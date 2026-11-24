# GitVerse contributor instructions

GitVerse turns repositories into explorable buildings. Preserve stable identity, truthful provenance and direct access to repository details throughout all three planned worlds.

## Code boundaries

App Router routes and global styles belong in app/. Keep fixtures, city geometry and browser UI modules in src/. Keep engine math deterministic and independent of DOM state. Keep camera and animation state outside React. Centralize selection on repository ID. Read docs/ARCHITECTURE.md and docs/CITY_ENGINE.md before changing generation or selection. Record changes to these boundaries in both the docs and this file.

Use strict TypeScript, explicit types at external boundaries, bounded numeric inputs and runtime validation for remote payloads. Avoid untyped escape hatches. Prefer existing modules over extra dependencies. Keep domain logic and per-frame code separate. Do not create empty future packages.

## Visual and interaction quality

Follow docs/DESIGN_SYSTEM.md for token roles and typography. Every interactive affordance must perform a real action. Preserve visible keyboard focus, readable labels, accessible directory navigation and an explicit fallback when graphics fail. Reproduce the affected journey on both wide and narrow screens for UI changes.

## Security, assets and performance

Never expose GitHub credentials to the browser. Use immutable provider IDs and check authorization on each server request. Show demo provenance and document missing permissions or incomplete pagination. Document asset sources, license terms and changes in docs/ASSETS.md. Avoid externally hosted assets or fonts that would break the credential-free local demo. Keep reusable geometry and materials bounded and dispose of GPU resources on unmount. Measure render changes against the procedure in docs/PERFORMANCE.md.

## Commands and completion

Use Node 24 and npm. Run npm ci, npm run dev and open the URL printed by Next. Before delivery run npm run typecheck, npm run lint, npm test and npm run build. Review the actual render for graphics or interaction changes. Update documentation, acceptance evidence and limitations for the affected milestone. A feature needs implementation, working normal and failure paths, authorization review where relevant, relevant tests and a recorded verification result.

Keep plot placement, road clearance and parking calculations in src/driving.ts. Update the vehicle simulation tests when changing city spacing or vehicle dimensions.
