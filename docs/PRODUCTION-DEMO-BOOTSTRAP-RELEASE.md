# Production demo bootstrap release — 2026-10-03

Manual command from the repository root:

```sh
pnpm prod:bootstrap-demo
```

Run it twice. The second successful run must report `materialChanges: 0`.
This command is separate from `auth:sync-demo` and is never part of a Vercel
build/deploy, application startup, or request handler. Development sync and its
guards are unchanged.

Create the gitignored `.env.production.local` in the repository root:

```dotenv
APP_ENV=production
APP_URL=https://<real-vercel-domain>
BETTER_AUTH_URL=https://<real-vercel-domain>
BETTER_AUTH_SECRET=<unique-production-secret-at-least-32-characters>
DATABASE_URL=<neon-production-url-with-sslmode=require>
DEMO_ACCOUNT_PASSWORD=<approved-demo-password-12-to-128-characters>
PRODUCTION_DEMO_BOOTSTRAP_CONFIRM=DFCAMCLP_PUBLIC_DEMO
```

Use real values locally; never commit this file. The confirmation value is not
added to `.env.example`. Remove the confirmation variable after the two manual
runs; re-adding it is required for a future explicit bootstrap. No file is
automatically rewritten. Do not configure the confirmation variable in Vercel.

The command reads only this explicit file, without shell overrides or fallback
to `.env`. Both application URLs must use the same HTTPS origin with no path,
query, credentials, or fragment. The database must use a `.neon.tech` host and
`sslmode=require`; host-redirection options and all local DB targets are refused.
No account arguments are accepted. Errors and success summaries never print
database URLs, passwords, hashes, secrets, or tokens.

## Execution and verification

Current Drizzle migrations run first; destructive migration statements are
refused. Migrations remain applied if later seeding fails. Domain seed, auth,
application links, access-control seed, and final verification then run in one
transaction with locks. A failure rolls that whole seed transaction back.

The deterministic domain and access-control data come from the existing
canonical seed exports. The separate production worker inserts missing rows
and verifies existing values rather than calling development upserts that
always update timestamps. It provisions the exact nine canonical identities
using Better Auth's existing credential schema and password hashing/verifying
functions. Existing users require the exact name, email, active application
account, and canonical Person mapping. An existing unlinked user is ambiguous
and causes an abort. No unrelated user is adopted, overwritten, or removed.
Only an incorrect canonical password is synchronized.

Existing roles, permission sets, memberships, and assignments must agree with
the seed. Conflicting or excess canonical access causes an abort rather than
resetting access. Other users and their memberships remain untouched. Counts
refer to the canonical demo subset, allowing unrelated users in the database.

Every successful run verifies nine auth users, nine application links, nine
passwords, ten active portal memberships, exact role assignments, exact role
permission sets, and Michael Castro's Academic + Technology membership. A
second run preserves rows, hashes, IDs, and timestamps.

Automated tests cover production guards, fresh migrated schema, two-run exact
row equality, credential synchronization, conflict rollback, and unrelated
user preservation. The fresh-schema test uses only a guarded local development
database inside a transaction; its disposable schema is rolled back without
drop/reset/truncate.

## Live Neon result

Both manual production runs completed successfully against the configured Neon
database on 2026-10-03 (Asia/Taipei). All three current Drizzle migrations applied.
First run: 127 inserted rows, zero existing credential updates, 127 material
changes. Second run: zero inserted rows, zero credential updates, zero material
changes. Both runs verified users 9/9, application links 9/9, passwords 9/9,
memberships 10/10, canonical roles and permissions, and Michael Castro's
Academic + Technology access. No connection details or credential values are
included in this report.

## Validation

- `pnpm test`: 143/143 passed.
- `pnpm test:db`: 13/13 passed, including the isolated bootstrap integration test.
- `pnpm test:auth`: 19/19 passed.
- `pnpm test:access`: 21/21 passed.
- `pnpm lint`: passed with five pre-existing unused-disable warnings in audit scripts.
- `pnpm typecheck`: passed.
- `pnpm build`: passed with isolated production process settings as described below.
- `git diff --check`: passed.

With both `.env.production.local` and the development `.env` present, an ordinary
local build loads the development `AUTH_SEED_PASSWORD` fallback. The existing
production environment guard correctly rejects that mix. It was not weakened.
The successful build invoked the same `pnpm build` script in a child process
with `.env.production.local` parsed into its environment, `AUTH_SEED_PASSWORD`
removed, `NODE_ENV=production`, and `__NEXT_PROCESSED_ENV=true` to prevent fallback
loading. Both env files were left unchanged. Vercel should receive only the
production variables above (without the bootstrap confirmation or development
seed password); no bootstrap command belongs in its build configuration.
