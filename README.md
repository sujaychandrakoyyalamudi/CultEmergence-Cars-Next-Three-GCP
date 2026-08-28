# CultEmergence Cars

A production-oriented **Next.js + Three.js** editorial website for `cultemergence.com`. It presents a researched collection of ten standout vehicles sold or publicly priced for the United States, with current starting prices, specifications, strengths, trade-offs, source links, open-license photography, a procedural 3D vehicle stage, comparison tools, and accessible fallbacks.

The visual language adapts broad product-storytelling principles observed on Apple’s iPhone 17 Pro page—large type, cinematic dark stages, concise chapters, sticky local navigation, rounded media panels, progressive disclosure, and restrained motion—without copying Apple assets, wording, proprietary code, or exact layouts.

## What is included

- A cinematic home page with an interactive Three.js vehicle sculpture.
- Ten statically generated vehicle detail pages.
- A client-side comparison studio for up to three vehicles.
- Transparent methodology, research trail, price caveats, image credits, and privacy pages.
- WebGL, remote-image, reduced-motion, and JavaScript-independent content fallbacks.
- Schema.org `ItemList` and `Vehicle` structured data, sitemap, robots, metadata, and web manifest.
- Strict TypeScript, Zod-validated editorial data, unit tests, Playwright smoke tests, security headers, and CI workflows.
- A multi-stage non-root Docker image for Cloud Run.
- Terraform for Cloud Run behind a global external Application Load Balancer with a serverless NEG, Cloud Armor, Google-managed TLS, Cloud CDN, optional Cloud DNS, Artifact Registry, and remote-state bootstrap.

## Technology

| Concern | Choice | Reason |
|---|---|---|
| Application | Next.js App Router + React + TypeScript | Static generation, metadata, routing, accessible server-rendered content, and a small deployment surface. |
| 3D | Three.js through React Three Fiber and Drei | Declarative, isolated client rendering with a procedural model and no third-party 3D-model license. |
| Content validation | Zod + a dependency-free validation script | One typed source of truth and an early failure when data drifts. |
| Styling | Hand-authored CSS | No runtime styling dependency; precise responsive and reduced-motion behavior. |
| Tests | Vitest + Playwright | Fast domain checks and real browser journeys. |
| Runtime | Node.js 22 + Next standalone output | Small non-root Cloud Run container listening on `PORT=8080`. |
| Infrastructure | Terraform + Google Cloud | Reproducible load balancer, TLS, security policy, Cloud Run, registry, and DNS. |

## Quick start

Prerequisites: Node.js 22.16 or a compatible Node 22 release, npm, and a browser with WebGL for the enhanced stage.

```bash
cp .env.example .env.local
npm install
npm run dev
```

Open `http://localhost:3000`.

The first `npm install` creates `package-lock.json`. Commit that generated lockfile before a shared or production deployment. This bundle intentionally does not include a fabricated lockfile: the authoring environment could not reach the npm registry, so dependency resolution was not falsely represented as executed.

## Verification commands

```bash
npm run validate:data     # dependency-free editorial-data checks
npm run verify:structure  # files, fallbacks, secrets, boundaries
npm run lint
npm run typecheck
npm run test
npm run build
npm run test:e2e
npm run check             # all non-browser checks plus production build
```

For Terraform:

```bash
terraform -chdir=infra/terraform fmt -check -recursive
terraform -chdir=infra/terraform init -backend=false
terraform -chdir=infra/terraform validate
```

## Repository map

```text
src/app/                    Next.js routes, metadata, CSS, sitemap and health endpoint
src/components/             Presentation, comparison, image fallback and Three.js components
src/data/cars.json          The ten researched editorial records
src/lib/                    Zod schema, data access and site configuration
public/images/fallback/     Original local SVG fallbacks for every car
public/images/ATTRIBUTION.md  Wikimedia photo licensing and source pages
e2e/                        Playwright browser journeys
scripts/                    Dependency-free data and repository checks
docs/                       Research, architecture, implementation, testing and operations
infra/bootstrap/            One-time protected GCS Terraform-state bucket
infra/terraform/            Cloud Run, load balancer, TLS, Cloud Armor, CDN and DNS
.github/workflows/          Verification and protected production deployment examples
Dockerfile                  Multi-stage standalone Next.js image
cloudbuild.yaml              Artifact Registry image build and push
```

Read [Implementation Guide](docs/IMPLEMENTATION_GUIDE.md) for a file-by-file explanation and [Google Cloud Deployment](docs/GCP_DEPLOYMENT.md) for the production sequence.

## Data and image policy

- Vehicle data was checked on **2026-08-26** and is intentionally dated.
- Prices are starting U.S. prices, not transaction prices; each record states what may be additional.
- Manufacturer projections and independent estimates are labeled rather than blended silently.
- Each vehicle page links to its source trail.
- Vehicle photographs load directly from Wikimedia Commons and retain their individual licenses. If a remote image is unavailable, the site uses an original local SVG illustration.
- For a commercial launch, review every photo license and consider mirroring approved derivative files under your own controlled asset pipeline while preserving attribution.

## Product and legal disclaimer

CultEmergence is an independent editorial demonstration. It is not affiliated with, endorsed by, or sponsored by the vehicle manufacturers or Apple. Vehicle and product marks belong to their respective owners. Verify price, incentives, availability, specifications, insurance, charging and purchase terms before making a decision.

## Documentation

- [Design Research](docs/DESIGN_RESEARCH.md)
- [Car Research](docs/CAR_RESEARCH.md)
- [Architecture](docs/ARCHITECTURE.md)
- [Implementation Guide](docs/IMPLEMENTATION_GUIDE.md)
- [Software Development Lifecycle](docs/SDLC.md)
- [Testing](docs/TESTING.md)
- [Google Cloud Deployment](docs/GCP_DEPLOYMENT.md)
- [Operations](docs/OPERATIONS.md)
- [Research Sources](docs/RESEARCH_SOURCES.md)
