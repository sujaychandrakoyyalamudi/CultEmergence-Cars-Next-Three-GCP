# Contributing

## Before editing

Read `docs/CAR_RESEARCH.md`, `docs/ARCHITECTURE.md`, `docs/SDLC.md` and the root `AGENTS.md`. Open an issue or change note that identifies the product/data/technical outcome and its evidence.

## Development

```bash
npm install
npm run dev
```

Use Node 22. Keep the generated `package-lock.json` synchronized with `package.json`.

## Required checks

```bash
npm run validate:data
npm run verify:structure
npm run format:check
npm run lint
npm run typecheck
npm run test
npm run build
npm run test:e2e
```

Infrastructure changes also require Terraform formatting, initialization without the production backend when appropriate, validation and a reviewed plan.

## Data changes

- Prefer a current official U.S. source.
- Store a precise qualifier for price or performance conditions.
- Do not overwrite an independent estimate as a manufacturer fact.
- Update the checked date only for records actually reviewed.
- Preserve photo creator, license, source page and representative-image flag.

## Accessibility and performance

Core content must remain available without JavaScript, WebGL, remote photography, motion or a desktop viewport. Any new visual package needs a measured bundle impact, browser test and license review.

## Commit hygiene

Do not commit credentials, `.env` files, state, generated plans, reports containing sensitive data, or dependency directories. Keep commits focused and include tests/evidence.
