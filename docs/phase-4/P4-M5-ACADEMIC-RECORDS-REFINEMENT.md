# P4-M5 — Academic + Admissions & Records Refinement

**Status: PASS / COMPLETE — 29 September 2026**

P4-M5 changes are implemented within Academic and Admissions & Records. Automated
frontend, database, authentication, access-control, lint, formatting, direct
TypeScript, and isolated production-build checks passed. The authorized Faculty,
Program Coordinator, and Records Staff experiences received rendered review at
mobile, tablet, and desktop widths. P4-M6 has not started.

## 1. Locked sources read

The implementation followed the ordered Phase 4 sources in the supplied brief:
`DFCAMCLP.md`, Phase 4 context, design system, UX rules, roadmap, manual audit,
and the P4-M2, P4-M3, and P4-M4 handoffs, plus the relevant Phase 3 Academic and
Records material and current feature/authorization source. Installed Next.js
16.3.5 app-router, client-component, search-parameter, and route-type guidance
was checked before code changes. `DFCAMCLP.md` remains canonical for campus
and program structure.

## 2. Academic orientation changes

Academic pages identify the faculty or coordinator workspace and the active
academic term. Selected-class pages elevate the class identity and retain
section, program, campus, term, and role context near the content.

## 3. ContextHeader adoption

The selected Academic class and selected Applicant or Student record use the
shared `ContextHeader` pattern. Record headers include the record name, typed
ID, campus, program, status, and a return destination.

## 4. Academic local navigation

Selected-class context includes local Class, Attendance, and Grades navigation
where the existing teaching assignment permits it. The current view is marked
as the page, and assignment checks continue to determine which links appear.

## 5. Action-affordance changes

Academic navigation actions that previously floated as plain text now use the
shared button hierarchy. Attendance save/review and grade review/submission
continue using their existing state-changing controls and confirmation flow.

## 6. Teaching refinements

Teaching cards show course and subject, section, schedule, campus/program
context where useful, instructor, sample roster size, and a clear class action.
Roster rows are alphabetized by student name with Student ID as a stable tie
breaker. Roster access remains read-only.

## 7. Attendance refinements

Attendance pages show the selected course, section, program, campus, term, and
meeting context alongside the date control and roster. Existing Present, Late,
Absent, and Unmarked values and local save/review behavior are preserved. An
invalid or unavailable offering displays a safe return path instead of silently
opening the first class.

## 8. Grades refinements

Grade entry shows selected course, section, program, campus, term, and the
existing submission state before the roster. Completeness checks, review,
confirmation, and submitted-list locking are unchanged. No grading formula,
scale, threshold, average, or conversion was added. Invalid offering links fail
closed to Teaching.

## 9. Announcements redesign

Academic announcements retain audience filtering and fictional/read-only
disclosure. Items are ordered newest first and the first item receives a
stronger editorial hierarchy through the existing visual language; no backend,
random icon set, or extra status model was added.

## 10. Faculty vs Coordinator refinement

General Academic headers identify the role workspace. Faculty class views stay
teaching-focused. Academic Management remains an overview of sample offerings
and faculty assignments, with its existing read-only disclosure and no new
coordinator editing action. Existing assignment-based attendance/grade behavior
was preserved.

## 11. Records search architecture

`src/features/records/list-utils.ts` centralizes trimmed, whitespace-normalized,
case-insensitive literal matching and stable list ordering. Applicant search
matches identity, campus, program, and stage; Requirements also matches
requirement names/statuses; DCAT matches identity and exam status; Student
search matches identity, campus, program, year, and standing; Documents matches
identity and COE/COR status. Search does not match unrelated hidden room/date,
term, or enrollment fields. Search, filter, and sort state remain
independent; no query-expression grammar was introduced.

## 12. Records filter coverage

Applicant, DCAT, Student, and Documents views expose filters relevant to each
existing queue. Campus and program choices come from canonical institution data
and remain available even when the current sample fixtures have no matching
row. DCAT and Documents retain their existing status/type dimensions.

## 13. Records sorting

Sorting uses an explicit `SortControl` separate from filters. Applicant,
Student, DCAT, and Documents queues have their own meaningful options and
stable tie-breakers. Returning from a detail preserves the selected criteria
through query state.

## 14. Applicant-list changes

Applicant rows emphasize identity, stage, campus/program, and next work. The
requirements queue defaults to attention priority then oldest submission; the
general applicant list defaults to newest submission. Counts reflect the queue
and the current result set, and empty states follow the active criteria.

## 15. Applicant-detail changes

Applicant details show a strong identity/context header and use keyboard
operable Overview, Requirements, DCAT, and Enrollment tabs with tab/tabpanel
semantics. Opening a record carries the list criteria into the detail URL and
the return action restores them.

## 16. Requirements changes

Existing physical-document presentation, requirement status controls, and
review workflow remain intact. The Requirements queue searches requirement
names/statuses as well as applicant context. No upload control or
digital-submission workflow was added.

## 17. DCAT changes

The DCAT queue adds useful literal search across applicant context and exam
status, canonical campus/program filters, status filtering, separate name/date
sorting, current-result counts, and a criteria-aware empty state. Hidden sample
room/date values do not create unrelated search matches. Existing scheduling
and result interactions remain in place. No interview or score cutoff was
introduced.

## 18. Student-directory changes

The Student directory supports multi-field search across identity, campus,
program, year, and standing; canonical campus/program filters; all four year
levels; status filtering; and distinct name/ID/year sorting. Mobile rows expose
campus, program, year, and status rather than dropping those identifiers.

## 19. Student-record changes

The selected Student uses the shared identity/context hierarchy and continues
to use the P4-M4 fictional identity: John Paul Reyes, Student ID
`DEMO-STU-2026-0142`. Applicant and Student identities remain separate.

## 20. Enrollment changes

Enrollment status and existing frontend progression remain unchanged. One
demo-only progression step was verified to reset after refresh. No new
eligibility or enrollment rule was created.

## 21. Documents changes

The document register searches identity and COE/COR status, with campus/program,
record type, document type, and status filters plus a separate
name/campus/program/status sort. COE/COR availability and issue behavior remain
unchanged; no file upload was added.

## 22. Acronym treatment

The relevant Records descriptions explain DFCAMCLP College Admission Test
(DCAT), Certificate of Enrollment (COE), and Certificate of Registration
(COR). Full names are placed where a staff member needs the term, without
repeating expansions throughout every row.

## 23. Cross-portal data consistency

Academic and Records continue to reference the P4-M4 fictional Student identity
and canonical campus/program labels. Current campus/program facts are derived
from existing institution data; there is one BSIS program record. No campus,
program, or milestone data was added.

## 24. Responsive review

Program Coordinator Dashboard, class detail, Attendance, Grades, Announcements,
and Academic Management, plus Faculty Dashboard, Teaching, assigned class
detail, Attendance, Grades, and Announcements, were reviewed at 375×812,
768×900, and 1440×900. Faculty navigation contains its five authorized
destinations; a direct Academic Management URL is denied.
Records Staff reviewed the dashboard, applicant list/detail, Requirements,
DCAT queue/scheduling/results, Student list/detail, Enrollment, and Documents
list/detail at the same sizes. No reviewed page had page-level horizontal
overflow; representative visible document widths were 360, 753, and 1425 px.
Academic deep pages, record context, filters, queue rows, and mobile cards were
visually inspected at narrow widths; dashboard layouts were also inspected at
tablet and desktop widths.

## 25. Accessibility review

Rendered accessibility names and semantics were checked on Academic and
Records pages: class navigation marks the selected view, attendance selectors
name the student, and review dialogs identify their purpose and next action.
The mobile announcement filter shows a continuation cue and its Class filter
works. Records search inputs have visible labels and field-specific hints;
filters and sort controls are separately labeled, queue counts expose status
text, and applicant tabs have tab/tabpanel semantics.
ArrowRight from Overview moved focus and selection to Application. Mobile
record cards and selected states remained usable at 375 px. This is a focused
review, not a WCAG certification.

## 26. Independent visual review

Two read-only critiques called for stronger context and class navigation, a
clear coordinator/faculty boundary, scannable actions, separate filtering and
sorting, preserved criteria on return, and visible record fields on small
screens. Rendered review confirmed class identity and active local navigation,
assigned-only teaching actions, read-only coordinator management, scannable
Attendance and Grades, the editorial announcement hierarchy, clear Records
queues, record context, and responsive cards. Search returned one Sam result,
Requirement state search returned Alex, and hidden sample room values did not
match DCAT search. The announcement filter's clipped next item cues horizontal
continuation and its Class filter is usable.

## 27. Regression results

- `pnpm test`: PASS, 7 files and 51 tests, including institution-data coverage.
- `pnpm test:db`: PASS, 1 file and 12 tests.
- `pnpm test:auth`: PASS, 1 file and 9 tests.
- `pnpm test:access`: PASS, 1 file and 21 tests.
- `pnpm lint`: PASS.
- Direct TypeScript check (`tsc --noEmit --incremental false`): PASS.
- Targeted Prettier check on all changed source/test files: PASS.
- Production build: PASS using installed Next.js 16.3.5 Webpack build in an
  isolated copy of the current source, so the active dev server's `.next`
  directory was not changed.
- `git diff --check`: PASS.
- Academic coordinator browser review: PASS for the six listed views at the
  tested viewport widths. Attendance review showed six unmarked rows for a new
  meeting and was canceled without saving. Grade review listed the two missing
  entries and was canceled without changing data. An unassigned offering opened
  read-only in coordinator class detail; its Attendance URL showed
  “Offering unavailable.”
- Faculty browser review: PASS for Dashboard, Teaching, assigned class detail,
  Attendance, Grades, and Announcements at all three widths. The new-meeting
  Attendance preview was canceled, and the missing-grade review was canceled.
- Records browser review: PASS for the protected routes and detail/list views
  listed in §24 at all three widths. Search, filters, sorting, clear/reset,
  detail return state, and empty results were checked. Requirement status was
  restored to its original value after review. DCAT schedule review was closed
  before save; result confirmation was canceled. One enrollment demo step was
  advanced and then verified to reset on refresh. Document preview was closed
  without printing or issuing.

`pnpm typecheck` cannot complete route type generation while the active
development server holds `.next/types/routes.d.ts` (`EPERM`); direct TypeScript
checking and the isolated production build pass. `pnpm env:check` stops before
project validation with Node 24.19.0 `uv_os_get_passwd returned ENOMEM`.
Full `pnpm format:check` reports only the pre-existing untouched
`PHASE-4-MANUAL-AUDIT.md`; changed files pass targeted formatting checks.

## 28. Known limitations

Browser flows use fictional in-session fixtures and do not establish official
institutional policy, records, or production persistence. Workflow,
authentication, authorization, database schema, and backend behavior remain
unchanged. Accessibility review was focused and does not certify WCAG
conformance.

## 29. Deferred P4-M6+ work

P4-M6 Operations + Technology refinement remains next and unstarted. P4-M7
motion, including final scroll animation, remains deferred to its locked owner.
No unrelated portal family was changed.
