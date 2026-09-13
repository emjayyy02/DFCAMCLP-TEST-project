# Phase 2 — Technical architecture and core foundation

## Current checkpoint

P2-M1 Repository + Stack Bootstrap and P2-M2 Database Foundation are complete. P2-M3–M8 have not started. This is not a completed Phase 2 delivery.

The approved stack is Next.js App Router, React, TypeScript, Tailwind, shadcn/ui primitives, PostgreSQL, Drizzle, Better Auth, Zod, React Hook Form, TanStack Table, Vitest/Testing Library/Playwright, Docker Compose, pnpm and GitHub Actions. Dependencies are installed when their milestone needs them; the exact current dependency versions are in package.json and pnpm-lock.yaml.

## Architecture boundary

A modular monolith: browser → Next.js public/portal UI and server boundaries → domain services → PostgreSQL. Authentication, portal membership, action permissions and resource scope remain separate layers. Deny by default. No microservices or separate backend.

M1 introduced `src/app` for the landing shell, `src/components/ui` for an owned shadcn-style Button primitive, `src/lib` for environment parsing and styling utilities, `src/tests` for environment validation, and `scripts` for environment checks.

M2 adds a server-side Drizzle/PostgreSQL layer in `src/server/db`, one versioned migration, guarded migration/seed/reset commands, deterministic fake development data, relational query proofs and database integration tests. The seven foundation tables are `people`, `campuses`, `programs`, `program_majors`, `applicant_profiles`, `student_profiles` and `employee_profiles`. They do not implement school workflows.

The environment reader is server-only. Its pure Zod parser is independently testable and returns safe errors containing field names only. Next.js instrumentation validates runtime configuration. `env:check` loads Next.js environment conventions explicitly. No secret values are passed to browser components.

The initial muted green/neutral styling is provisional development styling, not official branding or a final design system. The landing page provides a skip link, semantic headings, visible focus, a touch-sized link primitive, reflowing content and reduced-motion support. Portal navigation and user menus belong to M7.

## Preserved decisions and unresolved policy

All Phase 1 documents and PRODUCT.md remain unchanged. The new approved Phase 2 brief supersedes the old “implementation not yet authorized” checkpoint and freezes the stack. It also resolves the architectural part of Q12: applicant-to-student transition retains the underlying authentication account and history. Institutional activation/recovery procedures remain open. Conversion is not implemented here.

The Phase 1 question register still governs institutional IDs, grading, attendance, enrollment, payments and operations. No production identifier algorithm is chosen. Future schema will use stable internal IDs and separate human-facing numbers.

M2 now owns only the foundational institution and person/profile schema. Authentication/session, membership, role/permission, ownership policy, audit service, application logger and notification delivery remain unimplemented. Those must be implemented and tested in the prescribed order. Future notifications remain domain event → notification service → in-app delivery; external channels and object storage are deferred.

## Environments

Development uses local Docker PostgreSQL and fake data. Preview requires a separate non-production database and secrets. Production requires its own database, secrets, backups and monitoring. Never reuse one database across environments. Preview/production APP_URL requires HTTPS. M1 has no production deployment.

## Official references consulted

- [Next.js installation](https://nextjs.org/docs/app/getting-started/installation): App Router, manual setup and runtime requirements.
- [shadcn Next.js installation](https://ui.shadcn.com/docs/installation/next): project aliases and primitive foundation.
- [Better Auth installation](https://better-auth.com/docs/installation): preliminary reference only. Recheck supported Next.js/Drizzle integration and package compatibility before M3; no authentication implementation has begun.

## Validation record

See [M1 validation](M1-VALIDATION.md) and [M2 validation](M2-VALIDATION.md). M2 database checks ran against the local PostgreSQL 17 service. The agent environment could reach PostgreSQL but still had no Docker CLI, so Docker container startup remains attributed to the prior user-performed host validation rather than claimed as agent-executed.

## Next checkpoint

Stop after P2-M2. P2-M3 authentication may begin only after explicit approval. CI and full authorization regression work remain M8, rather than being prematurely reported as complete.
