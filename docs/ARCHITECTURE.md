# Architecture

## System context

CultEmergence is a read-only editorial website. It does not need a database, account system or application API. The production unit is one immutable Next.js container behind a Google Cloud external Application Load Balancer.

```text
Visitor browser
  ├─ semantic HTML, CSS, metadata and static route content
  ├─ optional client comparison state
  ├─ optional Three.js/WebGL renderer
  └─ Wikimedia image request, with local SVG fallback
             │ HTTPS
             ▼
Global external Application Load Balancer
  ├─ Google-managed TLS for cultemergence.com and www
  ├─ HTTP → HTTPS redirect
  ├─ Cloud Armor rate limit
  └─ Cloud CDN where response caching permits
             │ serverless NEG
             ▼
Cloud Run (Next.js standalone, non-root, port 8080)
  ├─ statically generated home and car pages
  ├─ sitemap, robots, manifest and health route
  └─ security headers
```

## Application layers

### Content domain — `src/data` and `src/lib`

`cars.json` is the only editorial data source. `src/lib/cars.ts` owns the Zod schema, validation, sorting and retrieval helpers. UI components consume a validated `Car` type and never parse ad hoc records.

### Presentation — `src/app`

The App Router owns routes, metadata, static-parameter generation, JSON-LD, sitemap, robots, manifest and global styling. Detail routes are statically generated from the ten slugs.

### Reusable UI — `src/components`

- `HeroExperience`: selector state, motion preference and WebGL capability.
- `HeroCanvas` and `ProceduralCar`: isolated Three.js client layer.
- `CarImage`: remote image and deterministic local fallback.
- `CarCard`, `SpecGrid`: pure vehicle presentation.
- `CompareClient`: browser-only selection and table composition.
- `MotionReveal`: progressive enhancement through `IntersectionObserver`.
- `SiteHeader`, `SiteFooter`, `JsonLd`: shared document structure.

### Delivery — root, `.github`, `infra`

The Dockerfile creates Next standalone output and runs as an unprivileged user. Cloud Build creates immutable Artifact Registry tags. Terraform manages edge, runtime and optional DNS; a separate bootstrap stack creates protected remote state.

## Server and client boundaries

Most content is a Server Component. Client components are limited to behavior that requires browser APIs:

- WebGL detection and Three.js rendering.
- motion-preference observation.
- remote-image error fallback.
- comparison selection.
- intersection-based reveal.

This keeps the initial HTML useful for search engines, assistive technology, no-JavaScript browsing and WebGL failure.

## 3D progressive enhancement

The scene uses an original procedural object assembled from rounded boxes, cylinders and physically based materials. No manufacturer CAD, scanned model, GLTF download or proprietary texture is used.

Failure path:

```text
browser supports WebGL
  → dynamically import Three.js stage
  → render at bounded DPR 1–1.5
  → permit drag orbit and slow rotation

browser lacks WebGL or script fails
  → render local SVG fallback

prefers-reduced-motion
  → use demand frame loop
  → do not auto-rotate
  → reveal transitions become effectively instant
```

## Reliability and failure containment

- Remote photography has an `onError` switch to a local SVG.
- Every car has a validated fallback path.
- The 3D bundle is dynamically loaded and does not block editorial HTML.
- The health endpoint is independent of external image availability.
- There is no runtime dependency on a database or third-party API.
- Cloud Run startup probes target `/api/health`.
- Deployment uses immutable image tags/digests and supports one-command revision rollback.

## Security and privacy

- No authentication, forms, payments, tracking pixels or analytics by default.
- CSP limits images to self/data/blob and Wikimedia’s image host; frames and objects are denied.
- HSTS, `nosniff`, frame denial, referrer policy and restrictive permissions policy are applied to all routes.
- Cloud Run ingress accepts traffic through the load balancer; Cloud Armor applies an IP rate limit.
- Runtime service account receives no application IAM permissions.
- Container runs as a non-root user.
- Terraform state uses uniform access, public access prevention and versioning.
- CI scans the repository structure for common secret patterns.

## Performance budgets

- Dynamic-load the 3D renderer.
- Clamp device pixel ratio to 1.5.
- Avoid external fonts and environment-map downloads.
- Lazy-load non-hero photos and decode asynchronously.
- Use static generation for all editorial routes.
- Keep client state local and small.
- Preserve native scrolling rather than scroll-jacking.

After installing dependencies, use a bundle analyzer or Lighthouse in CI before adding new visual libraries. A new dependency should have a measured user benefit and a documented license.
