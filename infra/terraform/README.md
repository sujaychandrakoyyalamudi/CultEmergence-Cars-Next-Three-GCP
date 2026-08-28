# Terraform stack

This root deploys one immutable Next.js container to Cloud Run and exposes it through a global external Application Load Balancer, Google-managed TLS certificate, Cloud Armor, Cloud CDN and optional Cloud DNS records for `cultemergence.com` and `www.cultemergence.com`.

It intentionally does not build the container. Build and push first, then pass an immutable tag or digest as `container_image`.

```bash
cp terraform.tfvars.example terraform.tfvars
cp backend.tf.example backend.tf  # after bootstrapping a state bucket
terraform init
terraform fmt -check -recursive
terraform validate
terraform plan -out=cultemergence.tfplan
# Apply only from an owner-controlled environment after reviewing the plan.
```

`manage_dns=false` is safest when the domain already uses another DNS provider. Create A records for the `load_balancer_ip` output. When `manage_dns=true`, delegate the registrar to the emitted Cloud DNS name servers before expecting the managed certificate to become active.
