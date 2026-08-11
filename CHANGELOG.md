# Changelog

All notable changes to LinkOS will be documented here.

## [v2.0.0] - 2026-03-30

### Added — New Modules (10 features)
- **Supabase dual-write** (`src/supabase.ts`): Lightweight REST client using native `fetch()`, no SDK. Fire-and-forget writes; SQLite remains primary.
- **Budget governance** (`src/budget.ts`): Per-agent spending limits (daily/monthly/lifetime). 80% warning, auto-pause on exceed. Model-aware cost estimation.
- **Heartbeat execution model** (`src/heartbeat.ts`): Every agent run tracked with tokens, cost, duration, session state. Dead agent detection and crash recovery.
- **Activity audit log** (`src/audit.ts`): Immutable trail with 30+ action types. Actor-typed, entity-scoped, JSON detail. In-memory + SQLite + Supabase.
- **Health monitoring** (`src/health.ts`): `/health` endpoint checks 5 subsystems. Periodic self-check (5 min). Status change logging.
- **Discord adapter** (`src/discord.ts`): REST API notifications. Budget alerts, health alerts, task completions. Webhook + Bot Token modes.
- **Plugin system** (`src/plugins.ts`, `src/plugin-types.ts`): YAML manifest plugins in `plugins/`. Event subscriptions, tool registration, lifecycle hooks.
- **Session compaction** (`src/session-compaction.ts`): Auto-rotation at 200 runs / 2M tokens / 72h. Prevents context rot.
- **Enhanced dashboard API** (`src/dashboard.ts`): 15+ new endpoints for heartbeat, budget, activity, sessions, plugins, status.
- **Enhanced setup wizard** (`scripts/setup.ts`): Supabase, budget, Discord configuration sections.

### Added — New SQLite Tables
- `heartbeat_runs`, `budget_policies`, `budget_incidents`, `activity_log_v2`

### Added — New db.ts Functions
- `insertHeartbeatRun`, `updateHeartbeatRun`, `getTokenSpendForBudget`, `getBudgetPolicies`, `insertBudgetPolicy`, `deleteBudgetPolicy`, `insertBudgetIncident`, `getBudgetIncidents`, `insertActivityLogV2`, `getMemoryCount`, `clearSessionForAgent`

### Changed
- `index.ts`: Imports and initializes all v2 modules via registration pattern
- `package.json`: Version 2.0.0

### Architecture
- Zero new runtime dependencies (fetch-based Supabase, REST Discord, dynamic import plugins)
- Registration pattern avoids ESM circular imports
- Dual-write resilience: system works fully offline
- In-memory first: fast queries without DB round-trips

## [v1.0.0] - 2026-03-29

### Changed
- Full LinkOS branding (banner, README, dashboard, package metadata)
- First branded client-ready release
- Clone URL updated to scanbott/linkos

## [v1.1.1] - 2026-03-06

### Added
- Migration system with versioned migration files
- `add-migration` Claude skill for scaffolding new versioned migrations
