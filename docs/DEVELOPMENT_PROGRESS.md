# Phase 0 and Phase 1 development report

## Phase 0 · Planning and research

The starting workspace contained the uploaded brief and no application. The docs directory covers product comparisons, architecture, design tokens, world generation, vehicle design, integration, Git graph, persistence, security, performance, testing and the roadmap. AGENTS.md records contributor conventions. Compatibility was checked against official documentation, installed peer ranges, TypeScript and a production build.

## Phase 1 · Demonstration city

The App Router serves the landing page, explorer and field guide. src/City.tsx implements WebGL rendering, camera controls, seeded architectural variation, lighting, streets and selection. src/data.ts defines the 25 fictional repository records. src/Universe.tsx shares selection between the canvas and search directory. On WebGL failure the directory remains usable. The portable build embeds the same UI and engine in one offline HTML document with hash navigation.

Verification used Node 24 and Chromium. Lint, strict type checking, two fixture tests, the portable build and production static export passed. Browser checks verified visible changes after orbit and zoom, canvas picking, directory search, matching inspector language, immersive view, mobile navigation and directory availability after forced WebGL failure. The screenshots in docs/images were captured from the packaged application. The desktop overview was visually reviewed. Browser checks loaded the packaged HTML into Chromium directly because the managed local preview relay timed out opening port 4173. The Next.js routes passed the production build; a live browser session through that relay remains unverified.

This milestone uses local sample data only. No credentials or paid services are required. Authentication, private data, rate limiting and live synchronization require implementation and verification in Phase 3. Performance under real workloads and physical mobile GPU testing remain open. Personal World and Global World are roadmap cards. Driving is the next milestone, beginning with street collision bounds, vehicle controls and a chase camera.

## Phase 2 · Vehicle exploration

Implemented the original sports car, steering, acceleration, reverse, braking, boost, wheel rotation, a fixed-step collision model, headlights, chase and overhead views, minimap, speedometer, proximity inspection, teleportation, reset, graphics resolution presets and on-screen driving controls. The engine, controls and tests live in src/Vehicle.ts, src/driving.ts, src/DriveControls.tsx and tests/driving.test.ts. Both the portable edition and Next.js explorer share the implementation.

Lint, strict TypeScript checks, all five unit tests and the production build passed. The Playwright packaged-browser check covers keyboard acceleration, headlights, camera mode, map travel, matching proximity inspection, reset, the graphics control and narrow-screen pointer acceleration. All 25 repository parking spots passed collision and proximity tests. The driving screenshot was captured from Chromium. No credentials or additional services are required for driving. Mobile checks used a narrow Chromium viewport with simulated pointer input; physical-device performance is unmeasured.

Next milestone: Phase 3 server-side GitHub authorization, repository synchronization and persistent plot assignment.
