# Start here

## Run locally

Install Node.js 22, then run:

```bash
cp .env.example .env.local
npm install
npm run dev
```

Open <http://localhost:3000>.

The first networked install generates `package-lock.json`. Review and commit that file before a shared build or deployment. Then run the complete application gate:

```bash
npm run check
npx playwright install --with-deps chromium
npm run test:e2e
```

## Understand the project

1. `README.md` — capabilities, commands and repository map.
2. `docs/IMPLEMENTATION_GUIDE.md` — file-by-file explanation.
3. `docs/DESIGN_RESEARCH.md` — Apple-inspired design analysis and originality boundary.
4. `docs/CAR_RESEARCH.md` — selection methodology and the ten-car data table.
5. `docs/ARCHITECTURE.md` — rendering, data and deployment architecture.
6. `docs/GCP_DEPLOYMENT.md` — Cloud Run, load balancer, TLS, DNS and rollback sequence for `cultemergence.com`.
7. `PACKAGE_VERIFICATION.md` — exactly what was and was not executable in the authoring environment.

## Production deployment

Do not deploy directly from an unreviewed working tree. Generate and commit the lockfile, pass CI, build an immutable Artifact Registry image, run a reviewed Terraform plan, obtain explicit approval, then follow `docs/GCP_DEPLOYMENT.md`.
