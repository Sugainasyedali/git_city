# Security boundaries

The local demo reads intentionally invented sample data and needs no credentials. Treat future repository names, branches, Markdown, SVG and diff text as hostile input. Render text safely, sanitize rich previews and validate outbound link protocols. Block client-controlled arbitrary network destinations in server fetches.

| Risk | Control and verification |
| --- | --- |
| Private data appears in a public world | Filter at the server for every resource and cache by authorization scope. Test direct IDs, searches, exports and revoked grants. |
| OAuth callback substitution | Validate session-bound single-use state and exact callback origin. Exercise expiry and replay. |
| Duplicate or forged webhooks | Verify signature, deduplicate delivery and make sync idempotent. |
| Credential exposure | Keep secrets server-side and redact payloads and logs. Review built browser assets. |
| Resource exhaustion | Bound geometry, page size, sync concurrency and uploaded asset sizes. |

Require explicit public discovery opt-in and explicit permission before sending private repository content to an external AI provider. Review dependencies and lockfile changes independently of application tests.
