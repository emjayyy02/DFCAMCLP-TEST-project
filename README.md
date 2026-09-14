# DFCAMCLP Integrated Student & Employee Portal

Development project; not an official college service. Fake development data only.

Phase 1 is preserved in [docs/phase-1](docs/phase-1/PHASE-1-OVERVIEW.md). Phase 2 is being implemented sequentially. **Current checkpoint: P2-M4 access control and portal shell are PASS / COMPLETE after an explicitly user-authorized fresh development-database reset and full regression/browser acceptance. P2-M5 has not started.**

## Local setup

Prerequisites: Node.js 24 LTS, pnpm 11.19.0, Docker Desktop with Linux containers and Docker Compose v2 available in your terminal.

```powershell
pnpm install --frozen-lockfile
Copy-Item .env.example .env
```

Set a locally generated `POSTGRES_PASSWORD` in `.env`, then set `DATABASE_URL` to `postgresql://portal_dev:<URL-encoded-password>@localhost:5432/portal_dev`. Generate a unique `BETTER_AUTH_SECRET` of at least 32 characters and a local-only `AUTH_SEED_PASSWORD` of at least 12 characters. Keep `.env` private. Never paste its contents into issue reports. `.env.example` contains no usable credentials.

```powershell
pnpm env:check
pnpm db:up
pnpm db:migrate
pnpm db:seed
pnpm dev
```

Open http://localhost:3000/login. The shared login uses only the clearly fake `.invalid` accounts provisioned by `pnpm db:seed`. The selected portal is checked against the account's active membership and permissions; an unauthorized selection is denied and its candidate session is removed. PostgreSQL listens only on 127.0.0.1:5432. The named volume preserves local data across `pnpm db:stop`; do not delete it casually.

```powershell
pnpm lint
pnpm typecheck
pnpm test
pnpm test:db
pnpm test:auth
pnpm test:access
pnpm format:check
pnpm build
pnpm start
```

`pnpm format` formats application/configuration and new docs, explicitly excluding existing Phase 1 documents and PRODUCT.md. Missing/invalid server configuration fails startup; errors name fields without printing their values. The static landing page can build without connecting to PostgreSQL; a successful build does not replace the database startup check.

Use `pnpm db:generate` after an intentional Drizzle schema change and commit the generated SQL and metadata. `pnpm db:migrate` applies versioned migrations; `pnpm db:studio` opens the local Drizzle inspector. `pnpm db:seed` is deterministic and safe to repeat against development data.

`pnpm db:reset:dev` removes and recreates only the configured local development database schemas, then migrates and seeds them. It refuses to run unless `APP_ENV=development`, the database host is local, `DATABASE_URL` matches `POSTGRES_USER` and `POSTGRES_DB`, and the database name ends in `_dev`. It is destructive to that development database and must never be used for preview or production.

Authentication is implemented in M3. M4 adds explicit portal memberships, portal-scoped roles, small shell permissions, server guards, and the shared responsive portal shell. These permissions do not authorize future records or business actions. Shared audit and full regression work remain P2-M5. No school workflow tables or functionality exist.

See [authentication architecture](docs/phase-2/AUTHENTICATION.md), [access-control architecture](docs/phase-2/ACCESS-CONTROL.md), [portal shell](docs/phase-2/PORTAL-SHELL.md), [M4 validation](docs/phase-2/M4-VALIDATION.md), and [Phase 2 status and architecture](docs/phase-2/PHASE-2-OVERVIEW.md).
