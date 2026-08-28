# CultEmergence engineering instructions

## Product invariant

This repository is a read-only, evidence-linked editorial experience for ten U.S.-market vehicles. Do not turn it into a dealership lead form, generic vehicle database, account platform, price scraper, advertising tracker or arbitrary 3D-asset gallery without an explicit product decision.

## Architecture boundaries

- `src/data` owns editorial records only.
- `src/lib` owns validation and pure data access.
- `src/app` owns routes, metadata and page composition.
- `src/components` owns reusable presentation and isolated client behavior.
- `infra` owns cloud resources; application code cannot import it.
- Third-party/browser APIs stay behind the smallest component that needs them.

## Change method

1. State the behavior/data being changed.
2. Update source evidence and caveats with data changes.
3. Make the smallest coherent implementation.
4. Add or update a test in the same change.
5. Run dependency-free checks, then lint, typecheck, unit, build and applicable browser tests.
6. Review accessibility, reduced motion, WebGL failure, remote-image failure, mobile and metadata.
7. Do not claim a command passed unless it actually ran.

## Clean-code rules

- Strict TypeScript; validate external/JSON boundaries.
- Server components by default; client components only for browser state/APIs.
- High cohesion, low coupling, explicit props, pure derived data and no global mutable state.
- No unbounded effects, hidden network calls, scroll hijacking, autoplay sound or inaccessible custom controls.
- No model/CAD asset without a reviewed license and performance budget.
- No analytics or external script without an approved privacy update and CSP review.
- No credentials, service-account keys, Terraform state, `.env` files or production identifiers in source.
- Use immutable image tags/digests; never deploy `latest` as the release identity.
