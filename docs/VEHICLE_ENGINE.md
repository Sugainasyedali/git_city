# Vehicle engine proposal · Phase 2

Integrate a physics stepping loop with a fixed timestep and capped catch-up. Store the authoritative pose in the simulation and interpolate the visual body and chase camera. A low-detail collider per building should cover the same envelope used by placement. Keep keyboard and touch input behind one normalized throttle, brake and steering interface.

Spawn on a verified free road segment. Auto-reset a flipped or out-of-bounds vehicle to its last safe road position. Clear pressed inputs on blur and when opening a dialog. Expose direct map navigation for visitors who prefer to skip driving.

Gate delivery on reversing from rest, braking at speed, collisions at variable frame rates, touch steering, camera stability, teleport and recovery. Add reusable original vehicle geometry and document its origin before release.
