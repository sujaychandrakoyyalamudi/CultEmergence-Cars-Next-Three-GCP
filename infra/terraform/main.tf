locals {
  service_name = "cultemergence-cars"
  dns_name     = replace(var.domain, ".", "-")
  required_services = toset([
    "artifactregistry.googleapis.com",
    "cloudbuild.googleapis.com",
    "compute.googleapis.com",
    "dns.googleapis.com",
    "iamcredentials.googleapis.com",
    "run.googleapis.com"
  ])
}

resource "google_project_service" "required" {
  for_each           = local.required_services
  project            = var.project_id
  service            = each.value
  disable_on_destroy = false
}

resource "google_artifact_registry_repository" "web" {
  project       = var.project_id
  location      = var.region
  repository_id = "cultemergence"
  description   = "CultEmergence web container images"
  format        = "DOCKER"
  labels        = var.labels

  depends_on = [google_project_service.required]
}

resource "google_service_account" "web" {
  project      = var.project_id
  account_id   = "cultemergence-web"
  display_name = "CultEmergence Cloud Run web runtime"
}

resource "google_cloud_run_v2_service" "web" {
  project             = var.project_id
  name                = local.service_name
  location            = var.region
  ingress             = "INGRESS_TRAFFIC_INTERNAL_LOAD_BALANCER"
  deletion_protection = var.deletion_protection
  labels              = var.labels

  template {
    service_account                  = google_service_account.web.email
    timeout                          = "30s"
    max_instance_request_concurrency = 80

    scaling {
      min_instance_count = var.min_instances
      max_instance_count = var.max_instances
    }

    containers {
      image = var.container_image

      ports {
        name           = "http1"
        container_port = 8080
      }

      resources {
        limits = {
          cpu    = "1"
          memory = "512Mi"
        }
        cpu_idle          = true
        startup_cpu_boost = true
      }

      env {
        name  = "NEXT_PUBLIC_SITE_URL"
        value = "https://${var.domain}"
      }

      startup_probe {
        initial_delay_seconds = 0
        timeout_seconds       = 3
        period_seconds        = 10
        failure_threshold     = 12

        http_get {
          path = "/api/health"
          port = 8080
        }
      }
    }
  }

  lifecycle {
    ignore_changes = [template[0].containers[0].image]
  }

  depends_on = [google_project_service.required]
}

resource "google_cloud_run_v2_service_iam_member" "public" {
  project  = var.project_id
  location = google_cloud_run_v2_service.web.location
  name     = google_cloud_run_v2_service.web.name
  role     = "roles/run.invoker"
  member   = "allUsers"
}

resource "google_compute_security_policy" "edge" {
  project     = var.project_id
  name        = "cultemergence-edge"
  description = "Rate limits anonymous website requests at the edge."

  rule {
    action      = "throttle"
    priority    = 1000
    description = "Per-IP soft rate limit"

    match {
      versioned_expr = "SRC_IPS_V1"

      config {
        src_ip_ranges = ["*"]
      }
    }

    rate_limit_options {
      conform_action = "allow"
      exceed_action  = "deny(429)"
      enforce_on_key = "IP"

      rate_limit_threshold {
        count        = 300
        interval_sec = 60
      }
    }
  }

  rule {
    action      = "allow"
    priority    = 2147483647
    description = "Default allow"

    match {
      versioned_expr = "SRC_IPS_V1"

      config {
        src_ip_ranges = ["*"]
      }
    }
  }
}

resource "google_compute_global_address" "web" {
  project = var.project_id
  name    = "cultemergence-web-ip"
}

resource "google_compute_region_network_endpoint_group" "web" {
  project               = var.project_id
  name                  = "cultemergence-serverless-neg"
  region                = var.region
  network_endpoint_type = "SERVERLESS"

  cloud_run {
    service = google_cloud_run_v2_service.web.name
  }
}

resource "google_compute_backend_service" "web" {
  project               = var.project_id
  name                  = "cultemergence-web-backend"
  protocol              = "HTTP"
  load_balancing_scheme = "EXTERNAL_MANAGED"
  timeout_sec           = 30
  enable_cdn            = true
  security_policy       = google_compute_security_policy.edge.id

  backend {
    group = google_compute_region_network_endpoint_group.web.id
  }

  log_config {
    enable      = true
    sample_rate = 1.0
  }
}

resource "google_compute_url_map" "https" {
  project         = var.project_id
  name            = "cultemergence-https-map"
  default_service = google_compute_backend_service.web.id
}

resource "google_compute_managed_ssl_certificate" "web" {
  project = var.project_id
  name    = "cultemergence-managed-cert"

  managed {
    domains = [var.domain, "www.${var.domain}"]
  }
}

resource "google_compute_target_https_proxy" "web" {
  project          = var.project_id
  name             = "cultemergence-https-proxy"
  url_map          = google_compute_url_map.https.id
  ssl_certificates = [google_compute_managed_ssl_certificate.web.id]
}

resource "google_compute_global_forwarding_rule" "https" {
  project               = var.project_id
  name                  = "cultemergence-https"
  target                = google_compute_target_https_proxy.web.id
  ip_address            = google_compute_global_address.web.id
  port_range            = "443"
  load_balancing_scheme = "EXTERNAL_MANAGED"
}

resource "google_compute_url_map" "http_redirect" {
  project = var.project_id
  name    = "cultemergence-http-redirect"

  default_url_redirect {
    https_redirect = true
    strip_query    = false
  }
}

resource "google_compute_target_http_proxy" "redirect" {
  project = var.project_id
  name    = "cultemergence-http-proxy"
  url_map = google_compute_url_map.http_redirect.id
}

resource "google_compute_global_forwarding_rule" "http" {
  project               = var.project_id
  name                  = "cultemergence-http"
  target                = google_compute_target_http_proxy.redirect.id
  ip_address            = google_compute_global_address.web.id
  port_range            = "80"
  load_balancing_scheme = "EXTERNAL_MANAGED"
}

resource "google_dns_managed_zone" "web" {
  count       = var.manage_dns ? 1 : 0
  project     = var.project_id
  name        = local.dns_name
  dns_name    = "${var.domain}."
  description = "Public DNS for ${var.domain}"

  dnssec_config {
    state = "on"
  }
}

resource "google_dns_record_set" "apex" {
  count        = var.manage_dns ? 1 : 0
  project      = var.project_id
  managed_zone = google_dns_managed_zone.web[0].name
  name         = "${var.domain}."
  type         = "A"
  ttl          = 300
  rrdatas      = [google_compute_global_address.web.address]
}

resource "google_dns_record_set" "www" {
  count        = var.manage_dns ? 1 : 0
  project      = var.project_id
  managed_zone = google_dns_managed_zone.web[0].name
  name         = "www.${var.domain}."
  type         = "A"
  ttl          = 300
  rrdatas      = [google_compute_global_address.web.address]
}
