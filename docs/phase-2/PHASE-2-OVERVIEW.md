# Phase 2 — Technical architecture and core foundation

## Current checkpoint

P2-M1 Repository + Stack Bootstrap, P2-M2 Database Foundation, P2-M3 Authentication, the Visual Foundation, and P2-M4 Access Control + Portal Shell are complete. P2-M4 passed an explicitly user-authorized fresh development-database reset, full regression suite, and rendered-browser acceptance. Phase 2 is COMPLETE. P2-M5 is intentionally removed as a standalone milestone; shared-foundation and regression checks run continuously inside Phase 3 frontend milestones.

The approved stack is Next.js App Router, React, TypeScript, Tailwind, shadcn/ui primitives, PostgreSQL, Drizzle, Better Auth, Zod, React Hook Form, TanStack Table, Vitest/Testing Library/Playwright, Docker Compose, pnpm and GitHub Actions. Dependencies are installed when their milestone needs them; the exact current dependency versions are in package.json and pnpm-lock.yaml.

## Architecture boundary

A modular monolith: browser → Next.js public/portal UI and server boundaries → domain services → PostgreSQL. Authentication, portal membership, action permissions and resource scope remain separate layers. Deny by default. No microservices or separate backend.

M1 introduced `src/app` for the landing shell, `src/components/ui` for an owned shadcn-style Button primitive, `src/lib` for environment parsing and styling utilities, `src/tests` for environment validation, and `scripts` for environment checks.

M2 adds a server-side Drizzle/PostgreSQL layer in `src/server/db`, one versioned migration, guarded migration/seed/reset commands, deterministic fake development data, relational query proofs and database integration tests. The seven foundation tables are `people`, `campuses`, `programs`, `program_majors`, `applicant_profiles`, `student_profiles` and `employee_profiles`. They do not implement school workflows.

M3 adds Better Auth email/password authentication, four framework-owned auth tables, a domain-owned one-to-one `application_accounts` link to Person, `ACTIVE`/`DISABLED` application state, database-backed cookie sessions, reproducible fake account provisioning, a shared login surface, and a neutral server-protected `/account` proof.

The Visual Foundation replaces provisional green with the approved cool-neutral, blue, and restrained yellow system.

M4 adds explicit active portal memberships, portal-scoped roles, a small shell-permission vocabulary, database-enforced portal consistency, authoritative portal selection at login, a cached server access context, protected portal/path guards, permission-filtered navigation, and the reusable authenticated shell. These permissions cover shell destinations only; real resource policies remain deferred.

The environment reader is server-only. Its pure Zod parser is independently testable and returns safe errors containing field names only. Next.js instrumentation validates runtime configuration. `env:check` loads Next.js environment conventions explicitly. No secret values are passed to browser components.

The approved development visual foundation is not official branding. It supplies shared tokens, skip links, semantic headings, visible focus, touch-sized controls, reflowing content and reduced-motion support. M4 extends it with a light desktop sidebar, mobile dialog drawer, header, portal switcher, user menu, page header, and access-denied state.

## Preserved decisions and unresolved policy

All Phase 1 documents and PRODUCT.md remain unchanged. The new approved Phase 2 brief supersedes the old “implementation not yet authorized” checkpoint and freezes the stack. It also resolves the architectural part of Q12: applicant-to-student transition retains the underlying authentication account and history. Institutional activation/recovery procedures remain open. Conversion is not implemented here.

The Phase 1 question register still governs institutional IDs, grading, attendance, enrollment, payments and operations. No production identifier algorithm is chosen. Future schema will use stable internal IDs and separate human-facing numbers.

M2 owns the foundational institution and person/profile schema. M3 owns authentication, session verification, and application account status. M4 owns portal membership, portal roles, shell permissions, portal guards, permission-driven navigation, and the authenticated shell. Resource ownership policy, audit service, application logger and notification delivery remain unimplemented. Future notifications remain domain event → notification service → in-app delivery; external channels and object storage are deferred.

## Current compressed Phase 2 roadmap

1. M1 — Stack Bootstrap ✅
2. M2 — Database Foundation ✅
3. M3 — Authentication ✅
4. Visual Foundation ✅
5. M4 — Access Control + Portal Shell ✅
6. M5 — Removed as a standalone milestone; checks continue inside frontend milestones

The older M4–M8 enterprise-sized sequence is obsolete for this polished mock/demo. Its useful security boundaries are preserved in the completed M4 foundation; it is not a direction to build audit, CI, and portal shells as separate later milestones.

## Environments

Development uses local Docker PostgreSQL and fake data. Preview requires a separate non-production database and secrets. Production requires its own database, secrets, backups and monitoring. Never reuse one database across environments. Preview/production APP_URL requires HTTPS. M1 has no production deployment.

## Official references consulted

- [Next.js installation](https://nextjs.org/docs/app/getting-started/installation): App Router, manual setup and runtime requirements.
- [shadcn Next.js installation](https://ui.shadcn.com/docs/installation/next): project aliases and primitive foundation.
- [Better Auth installation](https://better-auth.com/docs/installation): verified for the email/password server and React client setup used by M3.
- [Better Auth Next.js integration](https://better-auth.com/docs/integrations/next), [Drizzle adapter](https://better-auth.com/docs/adapters/drizzle), and [session management](https://better-auth.com/docs/concepts/session-management): verified for Better Auth 1.7.4 during M3 implementation.

## Validation record

See [M1 validation](M1-VALIDATION.md), [M2 validation](M2-VALIDATION.md), [M3 validation](M3-VALIDATION.md), and [M4 validation](M4-VALIDATION.md). M4 migration, deterministic seed, database/auth/access regression, and authenticated browser checks pass after an explicitly user-authorized `pnpm db:reset:dev` rebuilt local PostgreSQL from the complete migration chain.

## Next checkpoint

Phase 2 is complete. The authorized continuation is P3-M1 only. Stop after P3-M1; P3-M2 requires a separate instruction.

## Phase 3 roadmap

- M1 — Public Website + Login Experience — current; see [implementation and validation](../phase-3/P3-M1-PUBLIC-EXPERIENCE.md).
- M2 — Applicant Experience — remaining.
- M3 — Student Experience — remaining.
- M4 — Academic Experience — remaining.
- M5 — Admissions & Records Experience — remaining.
- M6 — Operations Experience — remaining.
- M7 — Technology Experience — remaining.
