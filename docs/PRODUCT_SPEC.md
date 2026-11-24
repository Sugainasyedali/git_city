# GitVerse product specification

GitVerse gives developers a spatial index of their work. A building represents a repository. Selection reveals the repository that supplied its metadata. Every essential repository action must also be reachable through ordinary HTML controls.

## Research and differentiation

| Project | What its maintainers describe | GitVerse design decision |
| --- | --- | --- |
| [GitHub Skyline](https://github.com/github/gh-skyline) | Converts a contribution graph into a printable STL, with selectable years. | Give each repository an address and a selectable inspector. Keep contribution-calendar landmarks for the Personal World. |
| [Gource](https://github.com/acaudwell/Gource) | Animates a source tree, contributors and their changes across time. | Keep the city arrangement stable during exploration. Reserve history playback for a separate time control. |
| [Getaviz](https://github.com/softvis-research/Getaviz) | Explores software artifacts through interactive spatial visualizations for engineering analysis. | Use architecture to encode bounded metadata and expose exact values in a readable inspector. |

The Phase 1 visitor enters a clearly labeled sample city, explores by camera or a keyboard-accessible list and inspects a chosen repository. Future owners connect GitHub to generate private cities. Public portfolio visitors and opt-in global residents receive a separate public projection. Never rank developer skill by stars or contribution frequency.

## Acceptance

Run locally without credentials. Show at least 15 distinct sample buildings on road-safe plots. Support orbit, zoom, repository selection, readable matching fixture data, loading and failure recovery. Verify responsive controls, type safety, lint, automated tests and production compilation. Record actual observations in the milestone report.
