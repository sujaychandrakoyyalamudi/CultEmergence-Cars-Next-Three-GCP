# Operations and maintenance

## Daily/continuous signals

- External load balancer 5xx rate and p95 latency.
- Cloud Run request count, instance count, startup latency, memory and CPU.
- `/api/health` availability from an external uptime check.
- Cloud Armor denied/throttled requests and false positives.
- Google-managed certificate status and expiry automation.
- Front-end exceptions from an explicitly approved privacy-preserving error tool, if one is later added.

Do not add free-form request URLs, query strings or user identifiers to metric labels.

## Editorial refresh

At least quarterly—or immediately after a model/price change:

1. Re-open every official source.
2. Verify U.S. availability, model year, trim, starting price and destination caveat.
3. Check projected values for final certification.
4. Update the checked date only for records actually reverified.
5. Run all checks and review the comparison table.
6. Record the change in version control.

## Dependency maintenance

- Use automated pull requests, but never auto-merge framework or Three.js changes.
- Review release notes and browser support.
- Run unit, build and browser suites.
- Recheck CSP and standalone Docker output.
- Compare bundle size and Lighthouse results before/after.
- Generate and commit a lockfile; deploy from `npm ci` once it exists.

## Image/license maintenance

- Keep creator, license, license URL and source-page history visible.
- Confirm attribution requirements before creating local derivatives.
- Do not strip attribution when replacing remote images.
- Verify the image still depicts the intended generation; keep `representative=true` when trim/market differs.
- Consider mirroring approved assets to a controlled bucket/CDN for production reliability.

## Incident playbooks

### Site returns 5xx

1. Check load balancer/backend and Cloud Run revision health.
2. Check startup probe and container logs.
3. Route traffic to the last healthy revision or previous image digest.
4. Preserve logs and the failed digest for analysis.
5. Fix forward; do not mutate a published tag.

### TLS not active

1. Verify apex and `www` DNS records resolve only to the reserved IP.
2. Inspect managed-certificate domain status.
3. Remove conflicting AAAA/CNAME records.
4. Keep the prior site active until HTTPS succeeds.

### Remote images fail

The client automatically displays local SVGs. Verify Wikimedia availability and the specific file revision. For a prolonged issue, mirror licensed derivatives and deploy a data-only image URL change.

### Incorrect price/specification

1. Confirm against the current source and capture the date.
2. Correct `cars.json` and qualifier.
3. Add or update a regression assertion if the error was structural.
4. Deploy as an editorial correction and document it.

## Rollback criteria

Rollback when a release causes widespread 5xx responses, broken navigation, inaccessible core content, hydration failure, missing all imagery/fallbacks, severe performance regression, CSP blocking the application, or incorrect high-impact vehicle data.
