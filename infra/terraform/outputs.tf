output "cloud_run_service" {
  description = "Cloud Run service name."
  value       = google_cloud_run_v2_service.web.name
}

output "cloud_run_uri" {
  description = "Cloud Run-generated URI; ingress limits public traffic to the load balancer."
  value       = google_cloud_run_v2_service.web.uri
}

output "load_balancer_ip" {
  description = "Create apex and www A records pointing here when manage_dns is false."
  value       = google_compute_global_address.web.address
}

output "production_url" {
  description = "Canonical public URL."
  value       = "https://${var.domain}"
}

output "artifact_repository" {
  description = "Artifact Registry repository name."
  value       = google_artifact_registry_repository.web.name
}

output "dns_name_servers" {
  description = "Delegate the registrar to these name servers when manage_dns is true."
  value       = var.manage_dns ? google_dns_managed_zone.web[0].name_servers : []
}
