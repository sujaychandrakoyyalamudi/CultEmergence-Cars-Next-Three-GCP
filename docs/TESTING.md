# Testing and quality gates

## Test pyramid

### Dependency-free checks

```bash
node scripts/validate-data.mjs
python3 scripts/verify-project.py
```

These run before package installation. They verify ten unique ranks/slugs, required fields, HTTPS sources, image licensing, fallbacks, file structure, merge markers and common secret patterns.

### Static and unit checks

```bash
npm run format:check
npm run lint
npm run typecheck
npm run test
```

`src/lib/cars.test.ts` protects the most important editorial invariants: ten records, contiguous ranking, unique routes, dated prices, sources and local fallbacks.

### Production build

```bash
npm run build
```

The build must statically generate all ten car routes and compile the client 3D/comparison chunks. Build warnings are reviewed, not automatically ignored.

### Browser tests

```bash
npx playwright install --with-deps chromium
npm run test:e2e
```

The smoke suite covers:

- home-page content and ten links;
- selector keyboard/click behavior;
- comparison selection limit;
- vehicle route specification/source content;
- reduced-motion rendering;
- WebGL-disabled fallback;
- mobile navigation;
- 404 behavior.

Before production, add `@axe-core/playwright` or an equivalent maintained tool and fail CI on serious accessibility violations. Manual keyboard and screen-reader review remains necessary.

### Container tests

```bash
docker build -t cultemergence-cars:local .
docker run --rm -p 8080:8080 cultemergence-cars:local
curl --fail http://127.0.0.1:8080/api/health
```

Verify the runtime user is non-root and no build toolchain is present in the final image.

### Terraform checks

```bash
terraform -chdir=infra/terraform fmt -check -recursive
terraform -chdir=infra/terraform init -backend=false
terraform -chdir=infra/terraform validate
```

Run `terraform plan` with an immutable image digest in a non-production project before a production plan. This repository never applies infrastructure automatically from pull-request CI.

## Evidence honesty

The generated bundle includes `PACKAGE_VERIFICATION.md`, which records what was and was not executable in the authoring environment. A passing dependency-free check is not represented as a passing Next.js build, Playwright run or Terraform validation.
