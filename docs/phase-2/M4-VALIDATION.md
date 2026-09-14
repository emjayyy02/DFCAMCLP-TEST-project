# P2-M4 validation and handoff

## P2-M4 — PASS / COMPLETE

Finalized on 14 September 2026. The user explicitly authorized the destructive `pnpm db:reset:dev` acceptance test for only the local DFCAMCLP development database. The reset rebuilt `portal_dev` from zero, applied the complete M2 → M3 → M4 migration chain, ran deterministic provisioning, and was followed by the full regression and rendered-browser acceptance sequence.

## Implemented scope

- generated migration `drizzle/0002_striped_angel.sql` after the unchanged M2/M3 migrations;
- portal membership, role, permission, role-permission, and membership-role schema;
- deterministic development catalog, assignments, and multi-portal account;
- authoritative portal-aware login with exact candidate-session removal on denial;
- cached server access context and deny-by-default portal/path guards;
- permission-filtered shared shell, desktop sidebar, mobile dialog drawer, header, user menu, portal switcher, page header, and 403 state;
- all requested M4 placeholder routes without school workflow data;
- M4 integration suite covering the requested access matrix and structural portal constraint.

## Validation evidence

| Check                              | Final post-reset result                                                                                                                                           |
| ---------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Explicit reset authorization       | PASS: user limited authorization to the local DFCAMCLP development database                                                                                       |
| `pnpm db:reset:dev`                | PASS: dropped and recreated `portal_dev`, migrated, seeded, and provisioned                                                                                       |
| Complete migration chain           | PASS: `0000_rare_mantis` (M2), `0001_material_gladiator` (M3), `0002_striped_angel` (M4)                                                                          |
| Deterministic seed repeat          | PASS: `pnpm db:seed` succeeded after reset                                                                                                                        |
| Access-control seed idempotency    | PASS: repeated seed plus integration assertions preserved exact catalogs, mappings, and assignments                                                               |
| `pnpm env:check`                   | PASS; values were not displayed                                                                                                                                   |
| `pnpm test`                        | PASS: 12/12 environment tests                                                                                                                                     |
| `pnpm test:db`                     | PASS: 12/12                                                                                                                                                       |
| `pnpm test:auth`                   | PASS: 9/9                                                                                                                                                         |
| `pnpm test:access`                 | PASS: 19/19                                                                                                                                                       |
| `pnpm lint`                        | PASS                                                                                                                                                              |
| `pnpm typecheck`                   | PASS; Next route types generated and TypeScript completed                                                                                                         |
| `pnpm format:check`                | PASS                                                                                                                                                              |
| `pnpm build`                       | PASS; dynamic portal, account, auth API, and portal-login routes compiled                                                                                         |
| Impeccable mechanical detector     | PASS: zero findings across the changed portal/login UI targets                                                                                                    |
| Browser review at 375 / 768 / 1440 | PASS: authenticated role filtering, portal switch, user menu, logout, direct denial, drawer focus/Escape/route close, visible focus, and zero horizontal overflow |

## M4 integration coverage

`src/tests/access-control.integration.test.ts` specifies:

1. idempotent membership/role/permission/mapping seed;
2. Student membership and Student allow;
3. Student → Technology deny;
4. Technology allow and Technology → Student deny;
5. Faculty allow and Academic Management deny;
6. Program Coordinator → Academic Management allow;
7. Maintenance Staff → Facilities allow and Employees deny;
8. School Admin normal Operations access;
9. IT Admin normal Technology access and Developer deny;
10. Developer → Developer foundation allow;
11. multi-portal Academic + Technology allow and unrelated portal deny;
12. revoked membership deny while the account remains active;
13. preserved disabled-account rejection/session revocation;
14. unauthorized login selection removes only its candidate session;
15. authorized Student and Technology selectors return their portal roots;
16. anonymous access-context denial;
17. PostgreSQL rejection of cross-portal membership/role assignment.

The route catalog and `canAccessPortalPath()` exercise direct path decisions in integration tests. Rendered-browser acceptance also typed a restricted Technology URL while authenticated only for Student and observed the Access Denied page; an authenticated HTTP check confirmed status 403 for that route. An unauthorized Technology selection with Student credentials remained on `/login`, displayed the safe denial, and left `/account` unauthenticated.

## Final representative authorization matrix

| Scenario                                         | Result |
| ------------------------------------------------ | ------ |
| Student → Student                                | ALLOW  |
| Student → Technology                             | DENY   |
| Faculty → Academic                               | ALLOW  |
| Faculty → Academic Management                    | DENY   |
| Program Coordinator → Academic Management        | ALLOW  |
| Maintenance Staff → Facilities                   | ALLOW  |
| Maintenance Staff → Employees                    | DENY   |
| IT Admin → Technology                            | ALLOW  |
| IT Admin → Developer                             | DENY   |
| Developer → Developer                            | ALLOW  |
| Multi-portal account → Academic and Technology   | ALLOW  |
| Multi-portal account → every unassigned portal   | DENY   |
| Revoked membership                               | DENY   |
| Disabled account                                 | DENY   |
| Anonymous or manipulated unauthorized direct URL | DENY   |

## Rendered-browser evidence

- 1440×900: Student shell displayed only the Student dashboard; Academic Faculty displayed Dashboard, Teaching, Attendance, and Grades; Technology Developer displayed Dashboard, System, and Developer.
- Multi-portal switcher exposed only Academic and Technology and successfully changed the active portal.
- User menu exposed the fake account identity, account link, and sign-out. The account page listed both active memberships and their roles.
- 375×812: mobile navigation used the dialog drawer, initial focus moved to Close, Escape closed it and returned focus to the opener, selecting System closed it and navigated with the active item marked.
- 768×900: mobile trigger remained available, the desktop navigation remained hidden, and document width matched scroll width.
- Login surface and authenticated shell had matching client/scroll widths at all target viewports; no horizontal overflow was observed.
- Disposable browser-only accounts were removed after validation.

## Fresh-reset acceptance sequence

```powershell
pnpm db:reset:dev
pnpm db:seed
pnpm env:check
pnpm test
pnpm test:db
pnpm test:auth
pnpm test:access
pnpm lint
pnpm typecheck
pnpm format:check
pnpm build
pnpm dev
```

All reset, seed, validation, test, lint, type, format, and build commands above ran successfully. Browser acceptance used the active local Next.js development server against the rebuilt database. The repeated `pnpm db:seed` and the access suite verified idempotency. HTTP checks additionally recorded Student → Student login as 200, Student → Technology direct access as 403, unauthorized Technology portal selection as 403 with no session cookie, and logout as 200.

## Scope confirmation

- P2-M5 has not started.
- No real school business workflow was implemented.
- No package, deployment, notification, email, SMS, payment, AI, or production-data behavior was added.
