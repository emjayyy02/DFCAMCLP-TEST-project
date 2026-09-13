# P2-M2 validation and handoff

## P2-M2 — PASS / COMPLETE

Finalized on 13 September 2026. The database foundation acceptance criteria passed against the configured local PostgreSQL 17 development service. This closes only P2-M2. P2-M3 authentication and all Phase 3 workflows remain unstarted.

## Agent-executed validation

| Command or check                                 | Observed result                                                                                                                   |
| ------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------- |
| `pnpm install --offline --store-dir .pnpm-store` | Passed; lockfile and installed dependency metadata synchronized with pnpm 11.19.0.                                                |
| `pnpm db:generate`                               | Passed outside the Windows sandbox; confirmed 7 tables and no ungenerated schema changes after the initial migration was created. |
| `pnpm db:reset:dev` equivalent                   | Passed outside the Windows sandbox; reset only `portal_dev`, then applied migration and seed.                                     |
| `pnpm db:migrate`                                | Passed; repeat migration run reported success.                                                                                    |
| `pnpm db:seed` twice                             | Both runs passed; standalone seed command is repeatable.                                                                          |
| `pnpm env:check`                                 | Passed outside the Windows sandbox; server fields are valid and values were not displayed.                                        |
| `pnpm test`                                      | Passed: 1 file, 8 existing environment tests.                                                                                     |
| `pnpm test:db`                                   | Passed: 1 file, 12 database integration tests.                                                                                    |
| `pnpm lint`                                      | Passed with no warnings or errors.                                                                                                |
| `pnpm format:check`                              | Passed after generated Drizzle metadata was excluded from Prettier ownership.                                                     |
| `pnpm typecheck`                                 | Passed; Next.js route types generated and TypeScript completed.                                                                   |
| `pnpm build`                                     | Passed; Next.js 16.3.5 production build and static generation completed.                                                          |

`pnpm format:check` initially found Drizzle's generated JSON metadata, which is not Prettier-owned. `drizzle/meta` was added to `.prettierignore`; the final formatting result is recorded after documentation updates.

## Clean development database evidence

The agent could reach PostgreSQL on `127.0.0.1:5432`. The guarded reset validated `APP_ENV=development`, a local host, matching `POSTGRES_USER`/`POSTGRES_DB`, and the `_dev` suffix before reporting the target database name `portal_dev`. It then:

1. dropped only the `drizzle` and `public` schemas inside `portal_dev`;
2. recreated `public`;
3. applied `drizzle/0000_rare_mantis.sql`;
4. inserted the deterministic fake seed;
5. completed with exit code 0.

The database test then confirmed all seven public tables and at least one row in `drizzle.__drizzle_migrations`.

## Database integration evidence

All 12 integration tests passed:

1. validated connection succeeds;
2. migrated foundation tables and migration history exist;
3. running seed repeatedly preserves one copy of each deterministic row;
4. IIT / CAA resolves exactly BSIS and CPE;
5. BSBA resolves exactly its three majors;
6. fake student resolves person → program → campus;
7. fake applicant resolves person → selected program → campus;
8. duplicate campus code is rejected (`23505`);
9. invalid campus foreign key is rejected (`23503`);
10. nonexistent student person is rejected (`23503`);
11. duplicate non-null student number is rejected (`23505`);
12. a BSBA major attached to a BSIS student is rejected (`23503`).

The test rows use generated UUIDs and synthetic labels. Cleanup removes successful setup rows; expected rejected writes never persist.

## Docker attribution

The Docker CLI is still not installed or visible in the agent environment (`docker` is not recognized). The agent therefore did not execute `docker compose up` or independently inspect the container in this run. PostgreSQL TCP connectivity and all database operations were agent-executed against the already running service.

Container startup/health remains USER-PERFORMED HOST VALIDATION from M1: the user previously reported `dfcamclp-development-postgres-1` Healthy after `pnpm db:up`. No Docker configuration was changed in M2.

## Packages added

- runtime: `drizzle-orm` 0.45.2, `postgres` 3.4.9;
- development: `drizzle-kit` 0.31.10.

The existing pnpm version was not upgraded. Package versions are exact in `package.json` and resolved in `pnpm-lock.yaml`.

## Files created

- `drizzle.config.ts`;
- `drizzle/0000_rare_mantis.sql` and Drizzle metadata;
- `scripts/db/environment.ts`, `migrate.ts`, `seed.ts`, `reset-dev.ts`;
- `src/server/db/connection.ts`, `index.ts`;
- `src/server/db/schema/index.ts`, `people.ts`, `institution.ts`, `profiles.ts`;
- `src/server/db/seed/data.ts`, `index.ts`;
- `src/server/db/queries/foundation.ts`;
- `src/tests/database.integration.test.ts`;
- `docs/phase-2/DATABASE-FOUNDATION.md` and this validation record.

## Files modified

- `package.json`, `pnpm-lock.yaml`;
- `.prettierignore` to exclude generated Drizzle metadata;
- `README.md` and `docs/phase-2/PHASE-2-OVERVIEW.md` for current commands/status.

Next.js bootstrap, application UI, Tailwind, shadcn primitive, Compose, environment schema and M1 tests were not redesigned or replaced.

## Architecture decisions

- UUID primary keys are independent of nullable human-facing numbers.
- Program code is globally unique because the four current codes are institution-wide identifiers; campus code is also unique.
- Campus is derived through program on applicant/student queries, avoiding duplicate campus state.
- BSBA majors are child records, with composite foreign keys preventing a major/program mismatch.
- A person may have separate applicant, student and employee profiles; each profile type is unique per person.
- All foreign keys restrict delete and update; there is no cascade deletion of institutional/profile history.
- Minimal enums describe profile availability only, not school workflows.
- Department remains a nullable label rather than a speculative HR relation.
- Configured database access is server-only; scripts use the same validated non-public `DATABASE_URL` boundary.

## Open questions retained

Official Applicant ID and Student ID formats, Student ID creation checkpoint, username normalization/collision behavior, official CpE degree name, authoritative department structure, application fields and all admissions/academic/employee workflows remain unresolved. M2 does not invent them.

## Scope confirmation

- Better Auth NOT started.
- P2-M3 Authentication NOT started.
- No user accounts, sessions, portal membership, roles, permissions or RBAC introduced.
- No Phase 3 workflow implemented.
- No commit, push or deployment performed.

**Stop at P2-M2 — PASS / COMPLETE.**
