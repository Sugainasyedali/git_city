# City engine

Each sample record maps to one visible selectable building and one accessible repository entry. Use stable fixture identifiers for geometry variation and selection. Keep placement separate from repository display order so filtering a list cannot move the streets.

A plot contains a bounded building footprint with a setback from the pavement. Treat wings and podiums as part of that footprint. Height should grow sublinearly with popularity, with a positive minimum and an explicit maximum. Language controls accent color. Use silhouettes, roof structures and facade patterns to distinguish towers in addition to color.

Keep scene construction separate from per-frame camera updates. Pointer picking must resolve a facade or roof back to its parent repository. A drag ending over a tower should leave selection intact. Dispose of geometries, textures, controls, observers and frame-loop subscriptions when the world unmounts.

For live synchronization, allocate new plots transactionally. Retain previous coordinates across renames and syncs. Validate that every footprint lies within its plot and outside road corridors; test edge cases at the largest generated dimensions.
