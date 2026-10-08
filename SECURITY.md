# Security policy

## Supported surface

The supported public surface is the currently deployed Meo Cloud V0 website and its static metadata. There are no public application backends, accounts, or remote-control interfaces in V0.

## Reporting

Please report suspected security issues using [GitHub private vulnerability reporting](https://github.com/ngocnguyen0903933-boop/meomeo-cloud/security/advisories/new). Do not include secrets in public issues, and do not probe private Meo systems. General project contact: founder@meomeoai.dynv6.net.

## Baseline

- No credentials or environment secrets are required.
- No analytics, advertising, trackers, external fonts, or third-party scripts are loaded.
- No private Meo data belongs in this repository.
- Production signing keys do not exist in this repository and signed updates remain off.
- Meo Cloud never grants itself device authority.
- The HTML Content Security Policy allows only same-origin assets and a hash-authorized structured-data block. It is delivered via a meta tag: GitHub Pages does not support arbitrary custom response headers, so header-only directives such as `frame-ancestors` are not claimed.
- No application package dependencies or third-party runtime scripts are used. GitHub-maintained Actions perform validation, staging, and deployment. Common-secret checks supplement manual review; they cannot detect every possible secret.
