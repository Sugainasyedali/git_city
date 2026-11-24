# Persistence proposal · Phase 3 onward

The foundation uses bundled demo fixtures. Adopt PostgreSQL when live synchronization begins. Use internal primary keys and unique immutable GitHub user and repository IDs.

| Entity | Relationships and constraints |
| --- | --- |
| User, GitHubConnection | User has an external user ID and zero or more authorized installations. Encrypt credential references. |
| Repository, RepositoryPermission | Unique external repository ID. Permission grants reference a principal and repository with a unique compound key. |
| World, District, WorldChunk | A world has an owner and visibility policy. Districts belong to a world. Chunk coordinates are unique per world. |
| Building | References world, chunk and source entity. Enforce unique (world, plot) and unique (world, source kind, source ID). |
| WorldMembership, Bookmark | Explicit opt-in membership and saved public destinations. Uniqueness per user and destination. |
| UserSettings, Vehicle, UserVehicle | User preferences and licensed vehicle catalog with per-user configuration. |
| ActivitySnapshot | Time-bounded aggregates keyed by repository and observation time. |

Index grants by principal, installations by owner and chunks by world and coordinates. Allocate plots and write their buildings in a transaction with uniqueness-conflict retries. Keep public projections independently filtered at query time. Revoke access and invalidate cached projections before asynchronously purging private material. Test migration rollback and restoration against disposable fixtures. Future tables cover organization membership, achievements, missions, dependency edges and historical snapshots.
