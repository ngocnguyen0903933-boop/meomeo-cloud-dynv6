# Meo Meo AI — Meo Cloud V0

Official public website and static cloud foundation for Meo Meo AI.

This repository is the parallel dynv6 deployment. Its Git history includes the original website through commit `507b91e5f3e439fb0b01d8eacf111e52e7338436`, preserved on `source-snapshot`. The original repository [meomeo-cloud](https://github.com/ngocnguyen0903933-boop/meomeo-cloud) and its `meomeoai.mooo.com` deployment remain independent. No original `main` change or traffic migration is required.

## Scope

This repository contains only public material:

- Product website and public documentation
- Project status and health metadata
- Public release metadata (no binaries are published yet)
- Static deployment workflow

Meo PC remains local-first and authoritative. See [`docs/architecture.md`](docs/architecture.md) and [`docs/data-boundary.md`](docs/data-boundary.md).

## Local preview

Serve this directory with any static HTTP server. No build step and no environment variables are required.

## Validation

The workflow in `.github/workflows/pages.yml` runs `node tools/validate.mjs` to check required files, internal public links, JSON syntax, CSP presence, and common secret patterns. Only an explicit public allowlist is staged in `_site`; tooling and repository documents are not deployed. This is a baseline check, not a guarantee that all possible secrets are detectable. Build metadata records the deployment timestamp and commit ID.

## Deployment

1. Push to `deploy/dynv6` in `meomeo-cloud-dynv6`.
2. GitHub Actions validates the static tree.
3. The Pages artifact is deployed automatically.
4. GitHub Pages serves `meomeoai.dynv6.net` using the custom domain configured in this repository's Pages settings. The checked-in `CNAME` documents the hostname; GitHub ignores that file for Actions-based publishing.

DNS uses an A record from `meomeoai.dynv6.net` to GitHub Pages (`185.199.108.153`) so MX and TXT records can coexist at the same hostname. Do not introduce a CNAME alongside MX. This is a GitHub hosting address, never the Owner's home IP. HTTPS must be enforced in repository Pages settings after certificate issuance and independently verified. This deployment requires no dynv6 API token, paid resources, backend or new account.

### Email and preservation

The dynv6 hostname has MX priority 10 `mx1.improvmx.com`, MX priority 20 `mx2.improvmx.com`, and SPF TXT `v=spf1 include:spf.improvmx.com ~all`. Ngoc confirmed a real inbound message reached the destination inbox but was classified as Spam. This establishes receipt, not guaranteed inbox placement or outbound sending. The old FreeDNS limitation does not apply to these new records.

Keep the original repository, domain association and DNS unchanged. Pull requests against `source-snapshot` or `deploy/dynv6` validate only; they do not deploy. The deployment job is restricted to this repository and the `deploy/dynv6` branch. Content-review branches must not be merged or deployed without separate Owner approval. See [parallel deployment notes](docs/parallel-deployment.md).

## Public endpoints

- `/health/` and `/api/health.json`
- `/status/` and `/api/status.json`
- `/releases/` and `/api/releases.json`
- `/api/version.json`
- `/docs/`
- `/overview/` — English founder, product, maturity, Claude review history and milestones

## Content evidence policy

Public product summaries distinguish implemented internal work, proof of concept, research and roadmap. Private product records are not published by this website. A historical architecture-review attribution does not establish a production API integration, official partnership or program eligibility. Publicly inspectable website history is linked separately from internal product evidence. No private source, raw research or operational manuals should be added to make a marketing claim look stronger.

## Security

Do not commit credentials, private research, personal data, signing keys, private source, or device-control details. Report a security issue using [`SECURITY.md`](SECURITY.md).
