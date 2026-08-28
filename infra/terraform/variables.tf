variable "project_id" {
  description = "Google Cloud project ID."
  type        = string
}

variable "region" {
  description = "Cloud Run and Artifact Registry region."
  type        = string
  default     = "us-central1"
}

variable "domain" {
  description = "Apex production domain."
  type        = string
  default     = "cultemergence.com"
}

variable "container_image" {
  description = "Immutable Artifact Registry image reference, preferably a digest."
  type        = string
}

variable "manage_dns" {
  description = "Create a Cloud DNS public zone and A records. Disable when DNS is managed elsewhere."
  type        = bool
  default     = false
}

variable "min_instances" {
  description = "Minimum Cloud Run instances."
  type        = number
  default     = 0

  validation {
    condition     = var.min_instances >= 0
    error_message = "min_instances must be non-negative."
  }
}

variable "max_instances" {
  description = "Maximum Cloud Run instances."
  type        = number
  default     = 10

  validation {
    condition     = var.max_instances >= 1
    error_message = "max_instances must be at least one."
  }
}

variable "deletion_protection" {
  description = "Protect the Cloud Run service from Terraform deletion."
  type        = bool
  default     = true
}

variable "labels" {
  description = "Labels applied to supported resources."
  type        = map(string)
  default = {
    application  = "cultemergence-cars"
    "managed-by" = "terraform"
  }
}
