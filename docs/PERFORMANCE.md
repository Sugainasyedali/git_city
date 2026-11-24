# Performance budget and measurement

Target 60 fps on suitable desktops and 30 fps on supported low-powered devices. These figures are acceptance targets. Record actual hardware, browser, viewport, device pixel ratio, scene size and duration alongside measurements.

Profile a cold load, idle scene, orbit drag, repeated building selection and a full mount/unmount cycle. Capture transfer sizes, first usable controls, median and 95th-percentile frame time, draw calls, triangle counts and memory after disposal. Compare repeated runs with the same fixture. Software-rendered cloud Chromium measures functional compatibility and cannot establish a consumer GPU performance claim.

Prefer shared geometry and materials, batched windows, bounded pixel ratio and lazy 3D loading. Add chunk streaming as the global population grows. Keep hidden-tab work low and avoid per-frame React updates. Benchmark presets before advertising hardware support.
