# Architecture

Phase 1 is a single Next.js App Router application. A client boundary owns browser-only rendering. React renders semantic navigation and repository information. Three.js owns projection, geometry, lighting and hit testing. Keep camera matrices, pointer deltas and animation timing outside React state.

The demo provider supplies normalized records with immutable identifiers. Both world selection and the accessible repository list resolve through the same records. A renderer failure should preserve the list and inspector. The sample build has no reason to request a GitHub token, write to a database or schedule a worker.

| Boundary | Responsibility |
| --- | --- |
| app/ | HTTP entry points, layout and global styles |
| src/ | Client components, demo data and procedural rendering |
| docs/ | Architecture decisions, milestone acceptance and prospective service contracts |
| .github/ | Contributor templates and automated verification |

Keep the single package while the engine has one consumer. Introduce a server-only GitHub adapter and a transactional database at synchronization time. Defer physics to the driving milestone. Route data from provider to view model to presentation, with selection flowing back as an ID.

Next's installation guide sets Node 20.9 as the minimum for modern App Router versions. Use the project's lockfile and Node 24 for reproducible checks. Verify peer dependencies with npm ls after installation. React's official release history and Three's installation guide document the supported client and module APIs.

[Next installation](https://nextjs.org/docs/app/getting-started/installation) · [React versions](https://react.dev/versions) · [Three.js installation](https://threejs.org/manual/en/installation.html)

## Resolved foundation stack

The installed lockfile resolves Next.js 16.4.6, React and React DOM 19.3.1, Three.js 0.187.0, TypeScript 5.9.3 and ESLint 9.39.5. The installed Next package declares React and React DOM ^19.0.0 among accepted peer ranges. npm ls --depth=0 completed successfully under Node 24.22.3. Using Three.js directly keeps the orbit, picking and resource lifecycle in one browser module. The static export keeps the entire demonstration independent of application servers after compilation.

Phase 2 shares plot coordinates between the deterministic driving simulation, renderer and minimap. Three.js owns the live vehicle and chase camera. React owns drive mode, overlay state and sampled telemetry. No network service or new runtime dependency is needed.
