# P3-M4 — Academic Experience

**Status: Complete as a frontend-only demo.** P3-M5 was not started.

This milestone extends the authenticated portal shell with the sample Faculty and Program Coordinator experience. It does not add an academic database, API, migration, official workflow, or new permission vocabulary.

## Experience

- **Dashboard:** role-specific welcome, today’s assigned classes, attendance and grade follow-up, sample announcements, and activity saved during the current browser session.
- **Teaching:** assigned course offerings, subject and section details, schedule, campus, searchable fictional roster, and links to teaching actions.
- **Attendance:** course and meeting selectors, explicit `Unmarked` defaults, Present/Late/Absent choices, mark-all-present, review counts, an unmarked-record warning, local save confirmation, and read-only sample history.
- **Grades:** final-grade entry, draft save, required-row completeness check, a review step, demo submission, locked submitted values, and submission history. No grade scale, calculation, or numeric range is assumed. Submission does not release grades to students.
- **Announcements:** read-only fictional notices filtered by campus, program, section, or assigned class.
- **Academic Management:** Coordinator-only read-only summary of sample offerings, rosters, and faculty assignments.

## Access and data boundaries

The server route catalog and guards remain authoritative. Faculty can access Dashboard, Teaching, Attendance, Grades, and Announcements. Program Coordinators receive those routes plus Academic Management through the existing `academic.management.view` permission. Announcements use the existing `academic.portal.view` permission. No role, permission, login, session, or database schema was changed.

The sample Student Marvin Reyes and the BSIS-2A subjects, schedule, instructors, term, campus, and recent attendance were checked against P3-M3 fixtures. A course subject is modeled separately from its course offering, which carries the section, term, campus, roster, instructor, and meeting schedule.

Attendance and grade edits live in React context for the current page session and reset on refresh. A saved attendance session is read-only because correction policy is unresolved. Coordinator views of offerings assigned to other faculty are read-only; teaching actions appear only for the Coordinator’s own sample offering.

**V1 ASSUMPTION:** the displayed fake students are assigned to the BSIS-2A offerings. Official enrollment synchronization and faculty assignment policy remain undefined.

## Validation

- `pnpm typecheck`, `pnpm lint`, `pnpm format:check`, and `pnpm build`: passed.
- `pnpm test`: 18 tests passed.
- `pnpm test:db`: 12 tests passed; `pnpm test:auth`: 9 passed; `pnpm test:access`: 20 passed.
- `pnpm env:check` could not run in this environment: Node.js 24.19.0 raised `uv_os_get_passwd returned ENOMEM` before the script loaded.
- Rendered-browser review at 375×812, 768×900, and 1440×900 checked horizontal overflow, responsive navigation, course roster search, attendance review/save, missing-grade validation, grade submission locking, announcement filtering, and Coordinator read-only boundaries.
- At 375×812, Coordinator offering filters announced the result count and no-results state, and mobile teaching-detail links met the 44px minimum target.
- The visual review used a temporary development-only preview wrapper around the existing AppShell and demo provider so the UI could be inspected without automating a sign-in flow. The wrapper was removed after review. The real `/academic` route continues through the existing server membership and path guards, which passed the database-backed access suite.
- No database reset was run.

### Screenshots

- [Faculty dashboard — 1440×900](../../.impeccable/review/academic-dashboard-1440x900.png)
- [Faculty dashboard — 768×900](../../.impeccable/review/academic-dashboard-768x900.png)
- [Faculty dashboard — 375×812](../../.impeccable/review/academic-dashboard-375x812.png)
- [Class and roster — desktop](../../.impeccable/review/academic-class-roster.png)
- [Class and roster — mobile](../../.impeccable/review/academic-class-roster-mobile.png)
- [Attendance review warning](../../.impeccable/review/academic-attendance-review-1440x900.png)
- [Grade submission review](../../.impeccable/review/academic-grade-review-1440x900.png)
- [Grade completeness dialog — mobile](../../.impeccable/review/academic-grade-missing-mobile.png)
- [Coordinator management — desktop](../../.impeccable/review/academic-coordinator-management-1440x900.png)
- [Coordinator management — mobile](../../.impeccable/review/academic-coordinator-management-mobile.png)
- [Announcements](../../.impeccable/review/academic-announcements.png)

## Next checkpoint

P3-M4 is complete. P3-M5 — Admissions & Records Experience — remains unstarted.
