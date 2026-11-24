# Commit graph proposal · Phase 4

Store immutable commit SHA, ordered parent SHAs, author, authored time, committed time and subject. Store refs separately so branch movement never changes the graph itself. Derive edges from the explicit parent array, including every parent of an octopus merge. Group separate roots independently.

Start from selected refs and render topologically ordered rows. Retain pending lanes for unseen parents at page boundaries and show a continuation indicator until fetched. Date ordering alone can place a parent above its child because commit clocks can differ. A path or author filter should preserve enough context to explain truncated edges.

Validate with a linear history, divergent branches, a merge, multiple roots, a clock-skewed commit and pagination through a merge. Link diffs to the selected parent and label provider-truncated patches.
