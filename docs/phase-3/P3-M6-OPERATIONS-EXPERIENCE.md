# P3-M6 — Operations Experience

Status: **P3-M6 — PASS / COMPLETE.** This is a frontend-only concept for routine Student Services, basic Employees, Facilities, and light Administration.

## Routes and authorization

The existing guarded `[portal]/[[...section]]` route renders five Operations destinations: `/operations`, `/operations/student-services`, `/operations/employees`, `/operations/facilities`, and `/operations/administration`. Request, employee, and ticket details use query-selected records on their existing protected module route. The leaf still calls the existing `requirePortalPath`; no new permissions or backend route were added.

The existing permission-filtered navigation shows all five destinations to School Admin and only Dashboard and Facilities to Maintenance Staff. Dashboard content follows the same roles. Maintenance activity is limited to facilities items; Student Services, Employees, and Administration stay out of that workspace.

## Demo data and dashboard

`src/features/operations/demo-data.ts` centralizes fictional student-service requests, employee directory entries, facilities tickets, activity, the sample current term, and the campus/program reference derived from the existing canonical Applicant fixture. `demo-context.tsx` keeps request statuses, ticket assignments/statuses, activity, and feedback in React memory. Refresh resets changes; there are no local-storage or server writes.

School Admin sees counts derived from the two small work queues, a basic directory summary, the canonical reference summary, and recent demo activity. Maintenance Staff sees assigned, high-priority, and unassigned ticket counts, a short open-ticket list, and facilities-only activity. Neither dashboard uses charts or a generic KPI wall.

## Module scope

- **Student Services:** fictional queue with search and status/campus/category filters; detail includes the sample student identity, message, history, and a local status change. Resolving or closing asks for a short sample outcome note. Its sample categories and status vocabulary are not official. Admissions, DCAT, enrollment, student records, and COE/COR remain with Admissions & Records. No SLA is claimed.
- **Employees:** searchable basic directory with campus and functional-area filters and concise detail. Functional areas are provisional demo groupings, not an organization chart. Directory listing status is not employment or account status. No HRIS or private personnel record is represented.
- **Facilities:** fictional ticket queue with search, campus, status, priority, category, and Maintenance Staff quick filters. Quick views keep the visible status/priority filters aligned. Detail supports local assignment and status changes; resolving or closing a ticket requires a short sample outcome note. Locations, categories, priority, and status vocabulary are illustrative and do not claim an inventory, SLA, or emergency policy.
- **Administration:** read-only sample term and canonical campus/program registry. It displays Main Campus with BSA and BSBA (the three BSBA majors remain nested under BSBA) and IIT Campus with BSIS and BSCpE. The sample AY/semester is not a verified live term. There are no schema, role, security, curriculum, grade, or system controls here.

## Institutional data and assumptions

`DFCAMCLP.md` was read before implementation and remains the source of truth for institutional facts. The registry reuses the canonical `campusOptions` and `programOptions` fixture; it does not introduce a second BSIS entry, new programs, a public “IIT / CAA Campus” label, or top-level BSBA majors. No institution-data conflict was found in the referenced registry.

Student-service categories/statuses, functional areas, employee position labels, ticket categories/priorities/statuses, sample locations, dates, and AY 2026–2027 · 1st Semester are project/demo assumptions. All names and records are synthetic. Frontend updates do not persist, notify people, issue work orders, or change real school records.

## Responsive and accessibility direction

The experience reuses the established AppShell, PageHeader, Arial typography, neutral surfaces, restrained blue/yellow accents, shared controls, and status badges. Queues use semantic tables at wide desktop widths and labeled stacked records at narrower widths; filter controls wrap and detail layouts collapse to one column. There is no page-level horizontal table requirement on mobile/tablet.

Controls retain visible shared focus, persistent labels, keyboard operation, text status labels, and polite status feedback. Empty and filtered-empty states are concise. Detail views have a clear return link and activity history. This targets the project's WCAG 2.2 AA direction; it is not a formal conformance claim.

## Backend intentionally deferred

No student-service API, HRIS/payroll, employee mutation, attendance/timekeeping, leave, procurement, inventory/assets, maintenance database, work-order dispatch, academic-term persistence, notification, upload, or institutional configuration backend was implemented. P3-M7 Technology was not started.

## Validation

- After the rendered-review CSS fix: `pnpm test` PASS (5 files / 32 tests), `pnpm test:access` PASS (21 tests), `pnpm lint` PASS, `pnpm typecheck` PASS, and `pnpm build` PASS on Next 16.3.5/Turbopack. The previously completed database and authentication suites passed 12 and 9 tests, respectively; they were not rerun for this CSS change.
- Targeted Prettier check for the changed CSS and milestone documentation: PASS. Repository-wide `pnpm format:check` still reports the untouched canonical `DFCAMCLP.md`; that source-of-truth file was left unchanged.
- Impeccable detector: PASS, 0 findings for `operations-page.tsx`. The independent source review found a quick-filter/display mismatch and missing outcome notes for terminal states; quick views now align their visible filters, and resolving/closing demo requests or tickets requires a short note.

### Authenticated rendered-browser acceptance

Signed in with the existing local seed credential as School Admin (`school-admin.test@example.invalid`) and Maintenance Staff (`operations.test@example.invalid`). The credential was used only in process memory for local sign-in; it was not printed, recorded, or captured in a screenshot. Checks below used rendered in-app browser views at **375×812, 768×900, and 1440×900**. Browser-only demo updates reset on a full navigation, as intended.

| Role              | Rendered pages and widths                                                                                                                                | Acceptance evidence                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| ----------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| School Admin      | Dashboard and Student Services, Employees, Facilities, Administration at 375, 768, and 1440 px; request, employee, and ticket detail at all three widths | Dashboard prioritizes support work, then directory/reference summaries. Student queue search and combined status/campus/category filters returned expected counts and a clear empty state; request detail showed identity, message, and activity. Resolving a request required an outcome note; a blank note blocked Save, and a supplied note updated status and history. Employee search/campus/area filters, empty state, and detail worked. Facilities search/combined filters, detail, assignment, In Progress, and Closed status worked; a blank closure note blocked Save, and the supplied note appeared in activity. Administration showed exactly 2 campuses, 4 degree programs, and 3 majors nested under BSBA, with a single IIT BSIS entry and an explicitly assumed demo term. |
| Maintenance Staff | Dashboard and Facilities queue/detail at 375, 768, and 1440 px                                                                                           | Dashboard led with assigned, high-priority, and unassigned facilities work. My Tickets opened a 2-of-5 assigned queue; Open and High priority quick views aligned with visible filters. Ticket assignment and status changes updated feedback and activity. Resolved required a completion note; blank Save was blocked, and the entered note appeared in activity. Direct visits to `/operations/student-services`, `/operations/employees`, and `/operations/administration` each rendered **Access denied**.                                                                                                                                                                                                                                                                              |

At each requested width, inspected page-level overflow with `document.documentElement.scrollWidth` against the rendered viewport: 360≤375, 753≤768, and 1425≤1440 for the authenticated Operations shell and checked module/detail pages. The denied pages also had no overflow. Wide queues used tables; phone/tablet queues used stacked records. The School Admin mobile/tablet drawer listed all five authorized destinations; Maintenance's drawer and desktop sidebar listed only Dashboard and Facilities. The drawer opened and closed with Escape, returning focus to its trigger. Keyboard Tab reached the skip link and controls with a visible 2 px focus outline. Main buttons, filter chips, inputs, and selects measured 44 px high; status and priority used text labels rather than color alone. Forms used persistent labels and browser required-field validation. No Operations dialog is part of this milestone.

Rendered review found one tablet Facilities detail issue: status and assignment forms crowded each other in a two-column action grid. The action forms now stack within the detail card. Reinspection at 375, 768, and 1440 px showed readable, non-overlapping controls and no page overflow. No broad redesign was made.

### Separate environment/runtime issue

`pnpm env:check` could not complete in the earlier validation pass: Node 24.19.0 exited with `uv_os_get_passwd returned ENOMEM` before the validator ran. This is a local environment/runtime issue, not an Operations frontend acceptance failure; no new evidence connected it to these pages.

P3-M7 Technology was not started.
