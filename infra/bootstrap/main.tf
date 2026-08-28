variable "project_id" {
  type        = string
  description = "Google Cloud project containing the Terraform state bucket."
}

variable "region" {
  type        = string
  description = "State bucket location."
  default     = "us-central1"
}

variable "state_bucket_name" {
  type        = string
  description = "Globally unique GCS bucket name."
}

provider "google" {
  project = var.project_id
  region  = var.region
}

resource "google_project_service" "storage" {
  project            = var.project_id
  service            = "storage.googleapis.com"
  disable_on_destroy = false
}

resource "google_storage_bucket" "state" {
  project                     = var.project_id
  name                        = var.state_bucket_name
  location                    = var.region
  uniform_bucket_level_access = true
  public_access_prevention    = "enforced"
  force_destroy               = false

  versioning {
    enabled = true
  }

  lifecycle_rule {
    condition {
      num_newer_versions = 20
    }

    action {
      type = "Delete"
    }
  }

  depends_on = [google_project_service.storage]
}

output "state_bucket" {
  description = "Remote Terraform state bucket name."
  value       = google_storage_bucket.state.name
}
