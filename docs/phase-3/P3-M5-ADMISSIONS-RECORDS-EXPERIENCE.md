# P3-M5 — Admissions & Records Experience

**Status: Complete as a frontend-only demo.** P3-M6 Operations and P3-M7 Technology are unstarted.

The Records experience follows **queue → find record → open detail → understand stage → perform demo action → clear feedback**. It uses the existing portal shell and calm institutional visual system. Counts are compact links into work queues; there are no charts or metric-card dashboards.

## Experience delivered

| Destination           | What staff can do in the demo                                                                                                                                                                                                                                                                                             |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `/records`            | See fixture-derived counts for requirements, DCAT scheduling, results, enrollment, and available documents; open the matching queue or directory. Counts describe overlapping work, not a summed total.                                                                                                                   |
| `/records/applicants` | Search by name or Applicant ID; filter by campus, program, and stage; open an application; use Overview, Application, Requirements, DCAT, and Enrollment detail sections. The physical checklist uses Pending, Presented, Verified, and Needs Attention. Staff verification is distinct from applicant preparation.       |
| `/records/dcat`       | See eligible, awaiting-exam, and awaiting-result records. Enter a sample date, time, and room; review and save the schedule; mark a sample exam completed; review and confirm Passed or Not Qualified. No score, interview, capacity promise, room booking, or notification is modeled.                                   |
| `/records/students`   | Search existing sample Student IDs and filter by campus, program, status, and year level; view read-only profile, term, and document statuses. No applicant-to-student conversion or Student ID generation occurs.                                                                                                        |
| `/records/enrollment` | See Passed applicants and advance through For Enrollment → Registrar Submission → COE Available → COE Issued → COR Available → COR Issued → Enrolled. Available document states require a separate sample issuance action before progression continues.                                                                   |
| `/records/documents`  | Filter by name/ID, document type, status, and applicant/student record type. Review COE/COR as Not Available, Available, or Issued. Preview or print a clearly marked **SAMPLE · DEMO · NOT VALID FOR OFFICIAL USE** page when available. Mark an available sample document issued. No official certificate is generated. |

Desktop directories use tables; narrow screens use readable record rows. All queues have clear counts or empty states. Search and filters update visible results. Demo actions have review/confirmation where needed and announce the outcome in a live status message.

## Data, access, and policy boundaries

`src/features/records/demo-data.ts` centralizes six fictional applicants and three existing fictional students. Jamie Testapplicant (`APP-TEST-0001`), the four physical requirement names, campus/program choices, and Marvin Reyes (`DEMO-STU-2026-0142`) align with the Applicant and Student demo fixtures. Applicant and Student IDs remain distinct. The other identities are fictional `DEMO-*` fixtures. Records state lives in React context, persists across Records navigation in the current browser session, and resets on refresh. It is not synchronized to the Applicant or Student browser sessions.

The server continues to run `requirePortal` in the layout and `requirePortalPath` before rendering a Records page. The six route entries use existing Records permissions: `records.portal.view`, `records.applicants.view` (including DCAT), `records.students.view`, and `records.enrollment.view` (including Documents). The database-backed access test confirms a Records Staff account can open these six paths, a Student account cannot, and an unregistered Records path is denied. No role, permission seed, authentication, schema, migration, API, or resource-level authorization was changed.

**V1 ASSUMPTION:** the four displayed physical requirements and item statuses illustrate staff handling; they are not an official admissions policy or rejection rule. The demo locks checklist edits after a DCAT schedule to keep its local sample state coherent.

**V1 ASSUMPTION:** eligible applicants can receive a sample date/time/room after all four items are Verified. The demo does not assert actual scheduling authority, conflicts, room capacity, or notification delivery.

**V1 ASSUMPTION:** the displayed result states and enrollment sequence illustrate the known handoff. Only Passed progresses to enrollment. Release authority, official document issuance, and Student ID creation remain undefined.

There is no live admissions backend, document upload, official COE/COR, interview, finance, transfer flow, database persistence, cross-user record ownership enforcement, or production claim. Do not enter real student information.

## Changed files

Created: `src/features/records/demo-data.ts`, `src/features/records/demo-context.tsx`, `src/features/records/records-page.tsx`, `src/features/records/records.css`, `src/tests/records-demo.test.ts`, this milestone document, seven screenshots under `docs/phase-3/evidence/records/`, and `records-desktop.png` / `records-mobile.png` under `.impeccable/review/`.

Modified: `src/app/[portal]/layout.tsx`, `src/app/[portal]/[[...section]]/page.tsx`, `src/server/access-control/navigation.ts`, `src/tests/access-control.integration.test.ts`, `README.md`, and `docs/phase-2/PHASE-2-OVERVIEW.md`. Shared AppShell components, seed permissions, schema, and backend endpoints were not changed.

## Validation

- `pnpm test`: 23 tests passed, including focused fixture, queue count, schedule validation, enrollment gating, and route-catalog checks.
- `pnpm test:db`: 12 passed; `pnpm test:auth`: 9 passed; `pnpm test:access`: 21 passed, including the six-route Records authorization case.
- `pnpm lint`, `pnpm typecheck`, `pnpm format:check`, and `pnpm build`: passed.
- `pnpm env:check`: unable to reach the project script; Node.js 24.19.0 / tsx raised `uv_os_get_passwd returned ENOMEM` before loading it. This is an environment/runtime failure, not a passing check.
- Rendered authenticated browser review at 375×812, 768×900, and 1440×900 checked queue and directory layout, no horizontal page overflow, applicant search and clear filters, Student year/status filtering, document type/status/record filters, requirements update and stage change, schedule review/save, exam/result progression, Registrar sequence, sample document availability/preview/issuance, and visible feedback. The browser session used the seeded fake Records account. No development-database reset was run.
- Impeccable detector on changed Records UI files returned `[]`. Independent finish review found three material issues (stage-aware primary action, screen-reader announcements, and development badge overlap); the fixes and recaptured mobile evidence passed its re-check with a **ship** disposition.

### Screenshots

- [Records dashboard — tablet](evidence/records/dashboard-tablet.png)
- [Applicants — desktop](evidence/records/applicants-desktop.png)
- [Applicants — mobile](evidence/records/applicants-mobile.png)
- [Applicant requirements — mobile](evidence/records/requirements-mobile.png)
- [Applicants filtered — tablet](evidence/records/applicants-tablet-filtered.png)
- [Students filtered — mobile](evidence/records/students-mobile-filtered.png)
- [Sample document preview — mobile](evidence/records/documents-mobile.png)

## Next checkpoint

Stop after P3-M5. P3-M6 Operations Experience and P3-M7 Technology Experience remain unstarted.
