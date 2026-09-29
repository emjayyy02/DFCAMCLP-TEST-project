# P4-M2 — Global Design Foundation

**Review date:** 2026-09-28 to 2026-09-29  
**State:** P4-M2 — PASS / COMPLETE within its shared-foundation scope. Credential synchronization, auth/access regression, and the missing authenticated browser acceptance are complete. P4-M3 has not started.

## Scope and locked direction

This milestone applies the P4-M1 Modern Civic + Premium Academic + Restrained Product Software direction to the existing shared UI. It retains the canonical blue `#0D13CD`, yellow `#FCDF00`, light neutral canvas, and Arial interface stack. It adds no package and changes no route, schema, production authentication/session behavior, permission rule, canonical fact, or business workflow. The explicitly authorized local credential repair is documented below.

The work normalizes existing components and adopts them in existing feature pages. It does not redesign public content, move Applicant scenario controls, redesign Student history/profile, rework Academic/Records detail workflows, change Operations workflow semantics, expand Technology content, or add M7 motion/release work.

## Shared foundation delivered

| Area                  | Foundation and adoption                                                                                                                                                                                                                                                                    |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Tokens                | Added shared color/status, surface, border, radius, shadow, spacing, type scale, width, control-height, focus, and interaction tokens in `src/app/globals.css`. Page widths distinguish readable content (56rem), operational views (70rem), and the shell (100rem).                       |
| Type and spacing      | Established caption, supporting, body, card, section, and page-title sizes, with a 4px-based spacing scale. Arial remains the sole interface font.                                                                                                                                         |
| Page headers          | Extended `PageHeader` with eyebrow, context, action, class, and personal/staff density options. Adopted it across Applicant, Student, Academic, Records, Operations, Technology, the route fallback, and the neutral account page.                                                         |
| Context/entity header | Added a reusable `ContextHeader` for parent context, entity title, metadata, return link, description, and actions. Deep detail pages are left for their owning feature milestones.                                                                                                        |
| Actions and links     | Added the tertiary button variant and clearer low-emphasis affordance. Kept links as navigation and buttons as state-changing actions. Preserved existing variants.                                                                                                                        |
| Surfaces and forms    | Normalized shared card padding and added shared textarea, checkbox, radio, label, help, and error controls alongside the existing input/select. Operations textareas and the Applicant checkbox now use shared controls.                                                                   |
| Tables and lists      | Added shared data-table, selected/hover, and toolbar recipes. Added `ListToolbar` and a labeled `SortControl`; Technology accounts now expose a separate “Sort by” control while retaining Email A–Z as default and leaving filter/count scope unchanged.                                  |
| Statuses              | Reused the existing central `Badge` tone map for success, warning, danger, info, and neutral display, with visible status text. Records consumes neutral treatment where applicable. Operations' existing “Closed” success mapping is intentionally unchanged for its feature owner in M6. |
| Demo truthfulness     | Added one reusable `DemoNotice` pattern and migrated existing portal notices. The Applicant scenario action remains in its current location. Operations receives a concise sample-data notice without workflow changes.                                                                    |
| Identity and branding | Added `Avatar` initials fallback and `IdentitySummary`. The authenticated shell uses the supplied seal at 40×40, portal identity, and existing portal-root destination. The neutral development header also shows the seal while retaining its existing home destination.                  |
| Navigation and states | Added a persistent active-module indicator, responsive shell styling, focus treatment, and shared empty/loading/error state primitives. The existing server-side access guard remains the authorization boundary.                                                                          |
| Responsive and motion | Added wrapping/stacking rules for shared headers, notices, toolbars, and state patterns; retained reduced-motion handling and a 150ms shared interaction duration.                                                                                                                         |

## Credential mismatch: proven cause and safe resolution

Before implementation, Better Auth 1.7.4's supported `verifyPassword` export from `better-auth/crypto` checked one failing seeded Student credential against the current runtime `AUTH_SEED_PASSWORD`. Its only result was **false**. This confirms a stale stored credential; it does not establish who changed the environment value or what the former password was.

The provisioning gap is in `provisionDevelopmentAuthUsers()`: it calls Better Auth `signUpEmail()` only for a missing user. For an existing user it updates the application-account link/status, without verifying or updating the password. Both integration suites and the seed script reuse this helper, so reseeding never repairs existing credentials after a seed-password change. `BETTER_AUTH_SECRET` serves a different purpose and was intentionally left unchanged.

### Local command

Run `pnpm auth:sync-demo` from the repository root with the existing local `.env`. The command uses Node 24's native environment loading and TypeScript stripping; it accepts **no arguments or arbitrary email input**.

- Uses only `developmentAuthAccountSeed`, the canonical nine-account allowlist in `src/server/db/seed/data.ts`: student, applicant, faculty, records, operations, technology, coordinator, school-admin, and faculty-it, all at `example.invalid`.
- Refuses production NODE_ENV, any APP_ENV other than development/test, non-loopback database hosts, mismatched configured database/user, and database names without a dev/test suffix. It preserves the existing 12–128 character password policy.
- Before any update, a locked transaction requires exactly one existing credential per seed identity, the canonical Person link, and the correct user/account mapping. Missing or duplicate credentials abort the transaction; the command inserts nothing.
- Uses Better Auth's supported `verifyPassword` and `hashPassword`. It skips matching credentials and updates only the existing allowlisted credential's password and updated timestamp. Any transaction failure rolls back changes.
- Does not reset the database, recreate users/people/profiles, or change memberships, roles, permissions, application data, migrations, or demo fixtures. It does not modify environment files or use/change `BETTER_AUTH_SECRET`.
- Prints counts or sanitized failure messages, never plaintext passwords, hashes, secrets, database credentials, or tokens.

Observed runs:

| Run                   | Checked | Updated | Unchanged |
| --------------------- | ------: | ------: | --------: |
| First synchronization |       9 |       9 |         0 |
| Immediate repeat      |       9 |       0 |         9 |

An in-memory before/after comparison confirmed application table contents and credential identities were unchanged, and the environment file was byte-for-byte unchanged. Auth session/verification tables were excluded from that application-data comparison. No reset was performed. Twelve new guard tests cover production refusal, argument refusal, database targeting, password presence, and missing/duplicate/inconsistent identities.

## Browser acceptance evidence

Normal local sign-in forms established legitimate sessions after auth and access suites passed. No fabricated cookies or sessions were used. Each listed root and deeper route was reviewed at **375×812, 768×900, and 1440×900**.

| Portal     | Authorized role | Routes                                             | M2 result                                                                                                                    |
| ---------- | --------------- | -------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| Applicant  | Applicant       | `/applicant`, `/applicant/application`             | Pass at all three sizes; Requirements tab and existing scenario placement retained.                                          |
| Student    | Student         | `/student`, `/student/academics`                   | Pass after grid-track fix; Schedule and Grades tabs work.                                                                    |
| Academic   | Faculty         | `/academic`, existing IS 203 Teaching class detail | Prior authorized review retained at all three sizes, as permitted.                                                           |
| Records    | Records Staff   | `/records`, `/records/students`                    | Pass; search for Marvin changes 3 records to 1, Clear filters restores 3.                                                    |
| Operations | School Admin    | `/operations`, `/operations/facilities`            | Shared foundation passes; Open filter changes 5 tickets to 2, Clear filters restores 5. Feature-specific density remains M6. |
| Technology | IT Admin        | `/technology`, `/technology/security`              | Shared foundation passes; existing Security diagram density remains M6.                                                      |

The five newly reviewed families provide **30 required route/viewport samples**. Each final sample has one main heading, a loaded authenticated seal, one consistent shared notice, and no horizontal page overflow. Portal identity, header hierarchy, spacing, visible action/link affordances, textual statuses, and active navigation were inspected. At mobile/tablet sizes navigation uses the drawer; at desktop the active page indicator is visible in the sidebar.

All five mobile drawers opened with the current item, closed with Escape, and restored visible keyboard focus to the trigger. A final retest used `dialog[open]`: native dialogs remain mounted after closing, so a check for the mere existence of `dialog` is not a valid closed-state assertion. This corrected the acceptance measurement, not application code.

Additional Technology Accounts smoke coverage verified Email A–Z as default, Name A–Z ordering with the same nine accounts, a zero-result search state, Clear filters restoring nine, and the shared sort toolbar at 375px. Existing feature behavior was retained; no workflow updates were submitted.

### Shared-foundation fix found during acceptance

At 375px, the new Student page grid initially expanded its implicit column to the Academics tabs' minimum content width: document scroll width 484px versus client width 360px. Adding `grid-template-columns: minmax(0, 1fr)` to `.student-experience` contains the shared header, notice, and feature content while preserving the tabs' own horizontal scroll. The corrected root and Academics page passed all three viewports. No overflow-hiding workaround or Student feature redesign was added.

### Retained public and neutral checks

- `/`, `/programs`, and `/login` passed at all three sizes; seal, main region, heading, public menu, Escape behavior, and focus return were reviewed previously.
- `/account` passed at all three sizes with the shared header, seal, and membership content.
- Earlier Faculty-session denials for other portals are access-guard evidence only. They are superseded by the legitimate per-role visual reviews above.

### Evidence location

Screenshots and `acceptance-metrics.json` are saved locally under:

`C:/Users/silve/.codex/visualizations/2026/09/27/01a0e355-003d-7621-9164-545f02d75b8c/p4-m2/`

Screenshot names use the route label and width, for example `student-academics-375.png`, `records-students-768.png`, and `technology-security-1440.png`. The metrics retain the initial Student failure and subsequent passing samples, plus the final drawer retests. Acceptance was browser viewport testing, not physical-device certification.

## Final validation

Fresh final checks on 2026-09-29:

| Check                      | Result                                                                                                       |
| -------------------------- | ------------------------------------------------------------------------------------------------------------ |
| `pnpm test`                | Pass — 47 tests, 7 files, including 12 sync guard tests.                                                     |
| `pnpm test:db`             | Pass — 12 tests.                                                                                             |
| `pnpm test:auth`           | Pass — 9 tests. Also passed before browser acceptance.                                                       |
| `pnpm test:access`         | Pass — 21 tests. Also passed before browser acceptance.                                                      |
| `pnpm lint`                | Pass.                                                                                                        |
| `pnpm typecheck`           | Pass after allowing generated Next.js type files to be written.                                              |
| `pnpm build`               | Pass — compiled, TypeScript completed, nine static pages generated.                                          |
| Targeted Prettier          | Pass on changed source, tests, scripts, and report/roadmap.                                                  |
| `git diff --check`         | Pass; line-ending notices only.                                                                              |
| Repository-wide formatting | Existing warning on untouched `docs/phase-4/PHASE-4-MANUAL-AUDIT.md`; no audit formatting was requested.     |
| `pnpm env:check`           | Known local Node 24.19/tsx failure: `uv_os_get_passwd returned ENOMEM` before the environment script starts. |
| Impeccable detector        | Prior single run warned about Arial; retained because the locked design system mandates it.                  |

Windows sandbox permissions initially blocked pnpm workspace-state writes, formatter writes, and Next generated types. Requested writes were rerun with the appropriate permission; pnpm scripts also used the process-only `pnpm_config_verify_deps_before_run=warn` setting. No dependency, lockfile, or persistent package-manager configuration was changed. The environment-check failure is recorded separately from application regression results.

## Scope retained and deferred ownership

- M3 public content, registration, and recovery work remains unstarted.
- M4 retains Applicant scenario relocation and Student history/profile ownership.
- M5 retains Academic/Records deep refinement ownership.
- M6 retains Operations/Technology feature refinements. Existing School Admin dashboard cards are dense at narrow widths; the Security authorization diagram's five columns are cramped inside its desktop half-width panel. These feature layouts were not redesigned. Operations' existing Closed success styling also remains a documented M6 status-semantics issue.
- M7 retains broader motion/release review. Shared reduced-motion behavior remains in place.

Files changed in this credential/acceptance continuation: `package.json`, `scripts/auth/demo-credential-guards.mjs`, `scripts/auth/sync-demo.mjs`, `src/tests/demo-credential-sync.test.ts`, `src/features/student/student.css`, this report, and `P4-ROADMAP.md`. Earlier shared M2 implementation changes were preserved. No commit or push was performed. Stop after P4-M2.
