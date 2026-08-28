# Software development lifecycle

CultEmergence follows a small-product lifecycle with explicit evidence rather than treating deployment as the end of engineering.

## 1. Discover and define

- Identify the audience and the editorial promise.
- Record why the ten vehicles were selected and what “best” means.
- Verify data from primary sources and label independent estimates.
- Analyze the reference experience for principles, not copyable assets.
- Define non-goals: no purchase recommendation engine, account system, lead form or unlicensed media library.

**Exit evidence:** `docs/DESIGN_RESEARCH.md`, `docs/CAR_RESEARCH.md`, accepted car data.

## 2. Design

- Map information architecture and route hierarchy.
- Design server/client boundaries.
- Define WebGL, motion, image and JavaScript fallbacks.
- Define accessibility, privacy, security and performance constraints.
- Select a deployment topology appropriate to a read-only site.

**Exit evidence:** `docs/ARCHITECTURE.md`, route/component map, Terraform plan design.

## 3. Implement in vertical slices

1. Typed data and one detail route.
2. Collection cards and all static routes.
3. Comparison behavior.
4. Procedural 3D enhancement and fallback.
5. Responsive/accessibility styling.
6. container, CI and infrastructure.

Each slice includes data validation or tests in the same change.

## 4. Verify

- Data schema, rank, source, fallback and pricing-date checks.
- Secret and repository structure checks.
- ESLint, strict TypeScript, formatting and unit tests.
- Production Next build.
- Desktop/mobile Playwright flows with reduced motion and WebGL disabled.
- Docker build and local health check.
- Terraform format, init without backend and validate.
- Accessibility and Lighthouse review in a real browser environment.

**Release rule:** do not claim a check passed unless its command actually ran.

## 5. Release

- Resolve and commit a dependency lockfile.
- Build one immutable image.
- Promote the same image digest between environments.
- Review Terraform plan before apply.
- Point DNS only after the load balancer IP is stable.
- Wait for managed certificate ACTIVE state before enforcing launch communications.
- Smoke-test canonical, www, HTTP redirect, health, car route, comparison and missing route.

## 6. Operate

- Monitor 5xx rate, request latency, Cloud Run instance/cold-start behavior, certificate state and Cloud Armor denials.
- Refresh prices/specifications on a scheduled editorial cadence.
- Review dependency and image-license changes.
- Keep prior container digests for rollback.
- Preserve Terraform state versions and restrict state access.

## 7. Retire or replace content

- Remove stale data from the source JSON and sitemap in the same change.
- Preserve source history in version control.
- Remove remote image references and attribution only when no route uses them.
- Decommission DNS, certificate, load balancer and Cloud Run through a reviewed Terraform plan.
