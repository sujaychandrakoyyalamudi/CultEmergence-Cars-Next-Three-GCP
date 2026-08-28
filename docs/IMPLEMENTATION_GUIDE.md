# Implementation guide: what is what

## Top-level files

| File | Responsibility |
|---|---|
| `package.json` | Pinned direct dependencies and all developer commands. |
| `next.config.ts` | Standalone output, security headers, compression and framework configuration. |
| `Dockerfile` | Reproducible multi-stage build and non-root Cloud Run image. |
| `cloudbuild.yaml` | Builds and pushes commit-tagged and `latest` images to Artifact Registry. |
| `tsconfig.json` | Strict TypeScript and `@/` path alias. |
| `eslint.config.mjs` | Next core-web-vitals and TypeScript rules. |
| `playwright.config.ts` | Desktop and mobile browser journeys. |
| `vitest.config.ts` | Unit-test runtime and path aliases. |
| `Makefile` | Short aliases for common development and infrastructure checks. |

## Routes

| Route | Source | Purpose |
|---|---|---|
| `/` | `src/app/page.tsx` | Cinematic hero, ten-car collection, selection principles and comparison CTA. |
| `/cars/[slug]` | `src/app/cars/[slug]/page.tsx` | Static vehicle story, specs, powertrain, trade-offs, price and sources. |
| `/compare` | `src/app/compare/page.tsx` | Three-vehicle comparison shell. |
| `/methodology` | `src/app/methodology/page.tsx` | Selection and evidence policy. |
| `/credits` | `src/app/credits/page.tsx` | Photograph attribution and licenses. |
| `/privacy` | `src/app/privacy/page.tsx` | Current data-collection and hosting-log posture. |
| `/api/health` | `src/app/api/health/route.ts` | Lightweight Cloud Run startup/operational probe. |
| `/sitemap.xml` | `src/app/sitemap.ts` | Search-engine route inventory. |
| `/robots.txt` | `src/app/robots.ts` | Crawl policy and sitemap location. |
| `/manifest.webmanifest` | `src/app/manifest.ts` | Install metadata and theme colors. |

## Data flow

```text
cars.json
  → Zod schema in cars.ts
  → readonly sorted Car[]
  → server pages and client components
  → cards, detail routes, comparison rows, sitemap and JSON-LD
```

Adding an eleventh car intentionally fails validation: the product promise is ten. Replacing a car requires preserving unique ranks 1–10, slugs, four or more specs, three strengths, three trade-offs, source links, a photo credit and a local fallback.

## Component guide

### `HeroExperience.tsx`

Owns the selected car slug, motion preference and WebGL capability. It dynamically imports the heavier canvas only in a capable browser. The caption is normal HTML and remains accessible.

### `HeroCanvas.tsx`

Creates the bounded-resolution Three.js scene, lights, shadows and orbit controls. It receives only an accent color and motion state.

### `ProceduralCar.tsx`

Builds the original generic vehicle sculpture from primitives. Keeping geometry procedural avoids asset loading, model-license ambiguity and manufacturer-accuracy claims.

### `CarImage.tsx`

Loads the open-license photograph directly from Wikimedia. An image error swaps to the local fallback. The figure caption carries creator and license.

### `CompareClient.tsx`

Maintains at most three selected slugs. It derives rows from all unique spec labels, so new data appears without rewriting the table. The scroll container is keyboard-focusable.

### `MotionReveal.tsx`

Marks content visible when intersecting. Reduced-motion users see the content immediately. Important content never depends on the observer because it is already in the DOM.

## Styling system

`src/app/globals.css` contains:

- design tokens for color, radius, shell width and system font stacks;
- dark hero and light editorial surfaces;
- fluid typography with `clamp()`;
- two-column desktop and one-column mobile layouts;
- sticky header/chapter navigation;
- high-visibility focus indicators;
- explicit reduced-motion handling;
- system dark-mode adjustments.

No CSS-in-JS runtime or utility framework is required.

## Adding a new specification

1. Add the label/value to the relevant car records.
2. Use the same label only when the measurement is genuinely comparable.
3. Add `sortValue` and `unit` only when numeric sorting or future visualization needs them.
4. Run data, unit, browser and build checks.
5. Inspect the comparison table at desktop and mobile widths.

## Replacing remote photos with local production assets

1. Obtain a commercial-use license or confirm the Commons license.
2. Download an appropriately sized derivative.
3. Store it under `public/images/cars/`.
4. Change `image.url` to the local path and update the Zod URL rule accordingly.
5. Preserve creator, license, source page and any required attribution.
6. Remove the Wikimedia host from CSP only after all remote references are gone.
