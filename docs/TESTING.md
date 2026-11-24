# Verification

Use the package scripts from the repository root. Install with npm ci. Run npm run typecheck, npm run lint, npm test and npm run build. Launch npm run dev for interactive verification. The release report should distinguish observed behavior, automated assertions and planned checks.

| Journey | Acceptance check |
| --- | --- |
| First visit | Landing content and demo entry are readable with no credentials. |
| Explore | Confirm a rendered canvas, varied buildings on separate plots, visible roads, orbit and zoom. |
| Inspect | Choose buildings and list entries; match names and values to their fixture IDs. |
| Failure | Disable WebGL and verify that repository information remains reachable. |
| Small viewport | Inspect a repository without clipping critical controls. Check keyboard focus visibility. |
| Lifecycle | Navigate away and return; verify camera input and selection still work. |

Keep deterministic placement and fixture invariants in unit tests. Add browser regressions for observed selection bugs. Later milestones add simulated API failures, permission filtering, pagination and graph edge tests. Do not record a planned check as a pass.
