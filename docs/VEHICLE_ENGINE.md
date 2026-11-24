# Vehicle exploration

The simulation advances at 60 fixed steps per second with a bounded catch-up interval. The car has signed longitudinal speed, speed-dependent steering, rolling resistance, a service brake, handbrake and optional boost. A circular vehicle envelope clears the rotating body at all headings. Each step validates the next position against the raised lot rectangles and island boundary. Fixed-step travel at boost stays below the collision radius. Roads are level and suspension pitch is visual.

src/driving.ts owns layout, physics and safe parking. Both the renderer and map consume the same plot centers. src/Vehicle.ts builds the original car, lights, wheels and suspended body and updates the perspective camera. The chase arm shortens near raised lots. Overhead mode follows the car from above. Leaving driving restores orbit controls.

src/DriveControls.tsx unifies keyboard and pointer input, pause, graphics presets, map destinations and nearby selection. Input clears on blur and visibility changes. Opening a repository or map pauses motion. The HUD samples simulation telemetry at approximately 10 Hz. Low graphics uses a 0.75 pixel ratio.

The world uses fixture data. Driving currently spans Repository City. Personal and Global Worlds are future milestones.
