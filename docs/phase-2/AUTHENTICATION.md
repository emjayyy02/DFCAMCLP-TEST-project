# P2-M3 authentication architecture

## Selection and compatibility

Better Auth 1.7.4 is the approved authentication framework. It provides maintained email/password verification, database-backed sessions, HttpOnly cookie transport, CSRF/origin enforcement, session revocation APIs, and official Next.js App Router and Drizzle integrations. The implementation was checked against the current official [installation](https://better-auth.com/docs/installation), [Next.js integration](https://better-auth.com/docs/integrations/next), [Drizzle adapter](https://better-auth.com/docs/adapters/drizzle), [database](https://better-auth.com/docs/concepts/database), [session](https://better-auth.com/docs/concepts/session-management), [cookie](https://better-auth.com/docs/concepts/cookies), [options](https://better-auth.com/docs/reference/options), and [rate limiting](https://better-auth.com/docs/concepts/rate-limit) documentation on 13 September 2026.

The current Drizzle adapter is the separate `@better-auth/drizzle-adapter` package. Better Auth's Drizzle guidance is to generate the ORM schema, then use the ORM's versioned migration workflow. This project therefore keeps Drizzle Kit as the migration authority and does not use schema push as a permanent solution.

## Integration boundary

`src/server/auth/factory.ts` is the single Better Auth configuration factory. The runtime instance in `auth.ts` uses the server-only validated environment and database. `/api/auth/[...all]` exposes only Better Auth's official App Router handler. `src/lib/auth-client.ts` is the narrow browser client used by login and logout controls.

The security question in M3 is only **who is this user?** The selected portal is deliberately ignored by the authentication call. Portal membership, portal guards, roles, permissions, resource ownership, and portal-specific redirects remain P2-M4/P2-M5 work.

## Table ownership

Better Auth owns the records and lifecycle of:

- `auth_users`: authentication identity, display name, email, verification flag;
- `auth_accounts`: credential/provider account, including Better Auth's password hash field;
- `auth_sessions`: opaque database session token and expiry metadata;
- `auth_verifications`: verification/recovery token records reserved by the framework.

DFCAMCLP owns:

- the seven existing M2 tables (`people`, institution tables, and profile tables);
- `application_accounts`, a minimal domain extension containing only the auth-user/person link and `ACTIVE` or `DISABLED` application state.

No profile identity is duplicated in Better Auth. Credentials and password hashes are never placed in `people` or profile tables.

## Auth User to Person relationship

`application_accounts.auth_user_id` is a primary-key foreign key to `auth_users.id`. `person_id` is a unique foreign key to `people.id`. This enforces:

- one auth user maps to at most one Person;
- one Person maps to at most one application account;
- a Person may exist without any application account.

The link is an explicit database relationship, never an email-string match. The auth user and Person remain stable while applicant and student profiles can evolve around the same underlying account, so the future applicant-to-student lifecycle is not blocked.

## Identifiers and provisioning

M3 supports Better Auth email/password login only. Institutional username normalization, collision handling, Applicant identifiers, and `surname_studentid` provisioning remain unresolved institutional logic. The design can adopt Better Auth's official username plugin later without changing the Person relationship.

`pnpm db:seed` first reconciles domain data, then provisions six `.invalid` accounts through Better Auth's server `signUpEmail` API. It never inserts password hashes directly. The local-only password comes from `AUTH_SEED_PASSWORD`; the command refuses a missing/short value and production/preview environment validation rejects the variable entirely. Public sign-up remains disabled in the runtime auth instance.

## Password and session model

Better Auth performs password hashing and comparison using its built-in supported implementation; no custom cryptography exists. Passwords, password hashes, cookies, session tokens, and secrets are not logged or returned to client application code.

Sessions are opaque, database-backed Better Auth sessions delivered through its cookie mechanism. They expire after seven days and refresh at most daily. Cookie session caching is disabled so every protected request retrieves authoritative database state. Better Auth supplies HttpOnly cookies and production Secure behavior; its default SameSite security is retained. The canonical `BETTER_AUTH_URL` is trusted. Development/test additionally trusts only the equivalent localhost/127.0.0.1 origin on the same configured port; origin and CSRF protections remain enabled.

`getCurrentApplicationSession()` calls Better Auth's server `getSession` API, then requires an explicit active `application_accounts` link and Person. `/account` invokes this utility in a Server Component and redirects before rendering when no active session is present. Client session state is not trusted for access.

## Account state and revocation

`ACTIVE` allows authentication and protected application access. A Better Auth pre-request hook rejects a known `DISABLED` account on email sign-in with the same generic credential message used by the login UI. Every protected session check also rejects a disabled or unlinked account.

`disableAccount()` updates application status and deletes that user's rows from Better Auth's database session table in one transaction. Better Auth core exposes self-service revocation for the current user's request, but privileged arbitrary-user revocation otherwise belongs to its admin/authorization features, which would cross the M3 boundary. Directly removing the framework's database sessions is therefore the smallest deterministic administrative invalidation and does not introduce a token blacklist. Re-enabling policy and account-administration UI remain future work.

## Environment variables

- `BETTER_AUTH_URL`: canonical auth origin; HTTPS is required in preview/production.
- `BETTER_AUTH_SECRET`: at least 32 characters; known development/placeholder forms are rejected in preview/production.
- `AUTH_SEED_PASSWORD`: local/test fake-account password; optional generally, required only by auth seed/tests, and forbidden in preview/production.

`APP_URL` and `DATABASE_URL` remain as established in M1/M2. All auth configuration is read only by server modules. `.env` is ignored; `.env.example` contains blank placeholders only.

## Migration workflow

`drizzle/0000_rare_mantis.sql` is unchanged. `drizzle/0001_material_gladiator.sql` introduces the auth schema and `application_accounts`. Normal workflow remains:

```powershell
pnpm db:generate
pnpm db:migrate
pnpm db:seed
```

The guarded `pnpm db:reset:dev` recreates only the approved local development schemas, applies both migrations, seeds M2 domain data, and provisions the fake auth accounts.

## Deliberately deferred

P2-M3 does not implement portal memberships or portal guards, roles, permissions, resource authorization, account administration screens, production recovery/email delivery, email verification delivery, MFA, Redis, audit logging, production deployment, or any Phase 3 workflow. Better Auth includes a production baseline rate limiter; larger distributed abuse controls are deferred. Recovery policy and privileged-staff MFA remain institutional security decisions.
