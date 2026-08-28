# Package verification

Verification date: **2026-08-26**

This report distinguishes checks that actually ran in the authoring environment from checks that require networked dependencies, a browser runtime, Docker, Terraform providers or Google Cloud credentials.

## Executed and passed

- `node scripts/validate-data.mjs`
  - 10 cars.
  - 10 unique slugs.
  - contiguous ranks 1–10.
  - dated prices, manufacturer source, open-license photo metadata and local fallback for every record.
- `python3 scripts/verify-project.py`
  - required application, documentation, Docker, CI and Terraform files present.
  - direct non-type dependency versions pinned exactly.
  - fallback assets present.
  - common secret and merge-conflict patterns absent.
  - primary infrastructure controls present.
  - basic Terraform delimiter balance passed.
- `node scripts/check-format.mjs`
  - line endings, final newlines, trailing whitespace, tab policy and normalized JSON passed.
- TypeScript/TSX syntax transpilation using the installed TypeScript compiler.
  - 32 TypeScript/TSX files parsed without syntax diagnostics.
- Python bytecode compilation for repository Python scripts.
- JSON parse for every JSON artifact.
- YAML parse for every YAML workflow/configuration.
- CSS class-reference audit.
  - all static class names used by TSX have a corresponding stylesheet selector.
- Archive checksum and ZIP integrity test, recorded after packaging.

## Not executable in this sandbox

- `npm install` / dependency resolution: outbound network and npm registry DNS were unavailable.
- `npm run lint`, `npm run typecheck`, `npm run test`, `npm run build`: these require the unresolved npm dependencies.
- Playwright browser tests: Playwright and browser binaries could not be installed.
- Docker build/run: no Docker or compatible container runtime was installed.
- `terraform fmt`, `terraform init`, `terraform validate`, or `terraform plan`: Terraform was not installed and provider download access was unavailable.
- Google Cloud deployment, managed-certificate provisioning, DNS changes and production smoke tests: no cloud credentials or owner approval were used.
- Remote Wikimedia image availability: the application contains licensed source links and local SVG fallbacks, but outbound image fetching was unavailable in the sandbox.

## Required receiving-environment gate

After extracting the package on a networked development machine:

```bash
npm install
npm run check
npx playwright install --with-deps chromium
npm run test:e2e

docker build -t cultemergence-cars:local .
docker run --rm -p 8080:8080 cultemergence-cars:local
curl --fail http://127.0.0.1:8080/api/health

terraform -chdir=infra/terraform fmt -check -recursive
terraform -chdir=infra/terraform init -backend=false
terraform -chdir=infra/terraform validate
```

Do not represent the application as release-verified until those dependency-dependent checks pass and the generated `package-lock.json` is reviewed and committed.
