# Parallel dynv6 deployment

## Source and sites

- Original source and deployment: `ngocnguyen0903933-boop/meomeo-cloud`, `main`, custom domain `meomeoai.mooo.com`.
- Baseline source commit: `507b91e5f3e439fb0b01d8eacf111e52e7338436`.
- Parallel repository: `ngocnguyen0903933-boop/meomeo-cloud-dynv6`.
- Parallel deployment branch: `deploy/dynv6`; retained baseline branch: `source-snapshot`.
- New site: `https://meomeoai.dynv6.net`.

GitHub Pages supports one custom hostname per site, with an exception for its corresponding www redirect. Two unrelated custom hostnames therefore use two independent Pages sites here. All original source history is retained. Layout, product descriptions, public endpoints and private-data boundaries are reused. Only domain/contact metadata and deployment configuration change.

## DNS

The dynv6 zone uses A `185.199.108.153`. There is no AAAA or CNAME at the hostname. MX and SPF remain at the same hostname, so a conflicting CNAME must not be added. Additional redundant GitHub A addresses may be added later without changing MX/SPF, but are not required for this bounded deployment.

CAA at the zone apex is `0 issue "letsencrypt.org"`. This explicit authorization avoids inheriting a CAA lookup failure from the shared parent `dynv6.net`; GitHub's health check had reported `Dnsruby::NXDomain` before this addition. Public DNS and certificate verification remain the acceptance criteria.

## HTTPS evidence

A successful Actions run alone is not proof of TLS. Independently request the exact hostname with certificate verification enabled, inspect the certificate hostname and validity period, test HTTP-to-HTTPS redirection, and retrieve all public pages/assets/metadata. Record the tested commit and build ID. Do not bypass a certificate warning.

On 9 October 2026, the exact HTTPS hostname returned HTTP 200 with certificate validation enabled. GitHub reported an approved certificate for `meomeoai.dynv6.net`, and HTTPS enforcement was enabled only after this independent check. The health/status documents describe a manually reviewed public service state, not continuous PC health or an uptime guarantee.

## Credential boundary

This static deployment has no dynv6 API credentials and requires no dynamic DNS updater. Do not put API tokens in source, build metadata, command URLs, issues, logs or PRs. An exposed update token should be replaced or revoked through dynv6's supported Keys controls. Preserve the existing DNS records and update any legitimate client before revoking a credential it uses.

## Change authority

No merge to the original `main` or production traffic migration is part of this deployment. Any later consolidation needs separate Ngoc approval. Keep the original site accessible while reviewing the parallel site. Sensitive cloud capabilities remain OFF as documented in the architecture and data boundary.

References:

- https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/troubleshooting-custom-domains-and-github-pages
- https://docs.github.com/en/pages/getting-started-with-github-pages/securing-your-github-pages-site-with-https
