# ADR 0004: Cloud Run behind a global external load balancer

- Status: Accepted
- Date: 2026-08-26

## Decision

Run the standalone Next.js container on Cloud Run with load-balancer-only ingress. Expose it through a global external Application Load Balancer with serverless NEG, managed TLS, HTTP redirect, Cloud Armor, stable IP and optional Cloud DNS.

## Why

The architecture is stateless and container-friendly. The load balancer is Google Cloud’s robust custom-domain path and centralizes TLS, edge policy and future CDN behavior for apex and `www`.

## Consequences

The edge has a baseline cost even at zero traffic. DNS must point to the reserved global IP before certificate activation. Infrastructure and application-image delivery have separate lifecycles; Terraform ignores later image-only changes after initial provisioning.
