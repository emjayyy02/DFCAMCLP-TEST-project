# DFCAMCLP Integrated Student & Employee Portal

Development project; not an official college service. Fake development data only.

Phase 1 is preserved in [docs/phase-1](docs/phase-1/PHASE-1-OVERVIEW.md). Phase 2 is being implemented sequentially. **Current checkpoint: P2-M2 database foundation is complete. P2-M3 authentication has not started.**

## Local setup

Prerequisites: Node.js 24 LTS, pnpm 11.19.0, Docker Desktop with Linux containers and Docker Compose v2 available in your terminal.

```powershell
pnpm install --frozen-lockfile
Copy-Item .env.example .env
```

Set a locally generated `POSTGRES_PASSWORD` in `.env`, then set `DATABASE_URL` to `postgresql://portal_dev:<URL-encoded-password>@localhost:5432/portal_dev`. Keep `.env` private. Never paste its contents into issue reports. `.env.example` contains no usable credentials.

```powershell
pnpm env:check
pnpm db:up
pnpm db:migrate
pnpm db:seed
pnpm dev
```

Open http://localhost:3000. The M1 page verifies that the app renders; it does **not** claim database connectivity or implemented authentication. PostgreSQL listens only on 127.0.0.1:5432. The named volume preserves local data across `pnpm db:stop`; do not delete it casually.

```powershell
pnpm lint
pnpm typecheck
pnpm test
pnpm test:db
pnpm format:check
pnpm build
pnpm start
```

`pnpm format` formats application/configuration and new docs, explicitly excluding existing Phase 1 documents and PRODUCT.md. Missing/invalid server configuration fails startup; errors name fields without printing their values. The static landing page can build without connecting to PostgreSQL; a successful build does not replace the database startup check.

Use `pnpm db:generate` after an intentional Drizzle schema change and commit the generated SQL and metadata. `pnpm db:migrate` applies versioned migrations; `pnpm db:studio` opens the local Drizzle inspector. `pnpm db:seed` is deterministic and safe to repeat against development data.

`pnpm db:reset:dev` removes and recreates only the configured local development database schemas, then migrates and seeds them. It refuses to run unless `APP_ENV=development`, the database host is local, `DATABASE_URL` matches `POSTGRES_USER` and `POSTGRES_DB`, and the database name ends in `_dev`. It is destructive to that development database and must never be used for preview or production.

Authentication arrives in M3; authorization in M4–M5; shared audit/logging in M6; portal shells in M7; security regression/CI in M8. No authentication, user-account or school-workflow tables exist yet.

See [database foundation](docs/phase-2/DATABASE-FOUNDATION.md), [M2 validation](docs/phase-2/M2-VALIDATION.md), and [Phase 2 status and architecture](docs/phase-2/PHASE-2-OVERVIEW.md).
