# GitHub integration proposal · Phase 3

Authorize a GitHub App installation with minimum read permissions. Bind the authentication callback to an expiring, single-use state and the initiating session. Exchange authorization codes and mint installation tokens on the server. Redact credentials from logs and keep private API results out of shared caches.

Normalize provider IDs as strings. Normalize missing values as unknown and preserve actual zero counts. Follow pagination links, conditional requests, reset headers and Retry-After. Record completeness and last successful refresh. Separate pull requests from issues when interpreting combined issue counts. Reconcile repository metadata and building allocation in one transaction; retry idempotently using provider IDs.

Verify webhook signatures against the raw request body and deduplicate delivery IDs. On revocation, stop background jobs and remove inaccessible private data. Exercise mocks for partial pages, rate limits, permission loss, deletions and retry interruptions before checking a real installation.

[GitHub App authentication](https://docs.github.com/en/apps/creating-github-apps/authenticating-with-a-github-app) · [REST best practices](https://docs.github.com/en/rest/using-the-rest-api/best-practices-for-using-the-rest-api) · [Webhook validation](https://docs.github.com/en/webhooks/using-webhooks/validating-webhook-deliveries)
