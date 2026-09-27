# P3-M7 — Technology Experience

Status: **P3-M7 — PASS / COMPLETE (2026-09-27).** This is a read-only technology portal for the project's account, access, security, system, and project foundations.

## Routes and authorization

The existing guarded `[portal]/[[...section]]` route renders `/technology`, `/technology/accounts`, `/technology/security`, `/technology/system`, and `/technology/developer`. Every destination still passes through `requirePortalPath`; the Technology navigation remains filtered by the current membership's server-resolved permissions.

IT Admin can view the dashboard, fictional account directory, security foundations, and system overview. Developer can view the dashboard, system overview, and project references. Direct requests for accounts, security, or Developer pages remain blocked when the membership does not carry the corresponding permission. No role assignment, account mutation, or system-control action is exposed.

## Accounts and access

The read-only account query joins application accounts to their existing authentication users, portal memberships, scoped roles, and role labels. It selects no session, cookie, password, or credential fields and includes only fictional `example.invalid` development accounts. The directory supports identity search and account-status and portal-membership filters. Account state and each portal membership's active state stay distinct; role rows are grouped under their account and portal.

The dashboard's counts come from the same query. They describe the local fictional development-account set, not institutional account totals or production access.

## Security and system foundations

The security view explains the implemented Better Auth sign-in, database-backed session behavior, separate application-account state, portal membership, role, effective permission, and server route check. Scenario cards are examples of application behavior, not recorded events. The page states that audit history, external SIEM or alerting, MFA, and production account-recovery delivery are not implemented.

The system view names the repository's Next.js App Router, React, TypeScript, Tailwind CSS, PostgreSQL, Drizzle ORM, Better Auth, and current runtime mode. Status labels describe implemented or configured foundations only. The page does not invent uptime, latency, resource usage, deployment state, database health, host paths, or secret values.

## Project references

The Developer view documents the request path through the application, the six authenticated feature families, the canonical campus/program registry, project scripts, and demo boundaries. Institutional data is derived from `src/server/db/seed/data.ts`: Main Campus contains BSA and BSBA, with the three BSBA majors nested under BSBA; IIT Campus contains one BSIS entry and BSCpE. No second BSIS program or new campus/program is introduced.

All account identities and records displayed in this experience are fictional. Phase 3 workflows remain frontend demos; this milestone adds no account-management API, persistent security audit, monitoring feed, SIEM, deployment controls, or institutional IT operations workflow.

## Acceptance and validation

- Rendered review used the existing Codex in-app browser tab at `localhost:3000`, signed in with the seeded IT Admin and Developer accounts. No desktop apps were opened.
- IT Admin can open Dashboard, Accounts, Security, and System. Direct `/technology/developer` access is denied. Developer can open Dashboard, System, and Developer; direct `/technology/accounts` and `/technology/security` access is denied.
- The IT Admin account directory returned all nine fictional accounts, applied Technology membership and text filters, displayed the correct empty state at zero matches, removed stale details when the selected account was filtered out, and restored the list and selection with Clear filters.
- The Developer navigation displayed only its permitted Technology routes and the user's separate portal choices. The mobile drawer closed with Escape and returned focus to its trigger.
- Dashboard, Accounts, Security, System, and Developer were inspected at 375×812, 768×900, and 1440×900. No horizontal overflow appeared. Content remained readable and the dashboard used real local account/membership counts; no fake health metrics, uptime, terminal output, or alert feed appeared.
- Security and System content described implemented foundations and called out missing audit history, SIEM/alerting, MFA, production recovery delivery, live health monitoring, and deployment controls.

- `pnpm test`: PASS (6 files, 35 tests).
- `pnpm test:db`: PASS (12 tests); `pnpm test:auth`: PASS (9 tests); `pnpm test:access`: PASS (21 tests), including the IT Admin and Developer permission/navigation matrix.
- `pnpm lint`: PASS; `pnpm typecheck`: PASS.
- `pnpm build`: PASS using an isolated temporary output directory so the running local browser session remained available.
- Targeted Prettier check for changed application, test, and feature files: PASS. Repository-wide `pnpm format:check` still reports the untouched `DFCAMCLP.md`; that source-of-truth file was left unchanged.
- `pnpm env:check` stopped before validation with Node 24.19.0 `uv_os_get_passwd returned ENOMEM`.

P3-M7 is complete. This milestone adds no account-management API, persistent security audit, monitoring feed, SIEM, deployment controls, or institutional IT operations workflow.
