# P3-M3 — Student Experience

Status: **PASS — frontend demo scope**, validated 25 September 2026. No real Student or academic backend workflow was implemented. P3-M4 has not started.

## Routes and architecture

The Student experience uses the existing authenticated portal shell, catch-all route, and server-side `requirePortalPath` guard. Each Student navigation destination requires the existing `student.portal.view` permission. The role and permission model was not expanded.

| Route                                | Experience                                                                   |
| ------------------------------------ | ---------------------------------------------------------------------------- |
| `/student`                           | Next class, today’s schedule, enrollment, and recent released grade / notice |
| `/student/academics?view=schedule`   | Week schedule and mobile day agenda                                          |
| `/student/academics?view=subjects`   | Current sample subject list, section, instructor, units, and meeting times   |
| `/student/academics?view=grades`     | Academic-year and semester filters with released and pending states          |
| `/student/academics?view=attendance` | Per-subject counts and expandable sample records                             |
| `/student/academics?view=curriculum` | Synthetic course map with an explicit `V1 ASSUMPTION` notice                 |
| `/student/enrollment`                | Current sample status and COR / COE previews                                 |
| `/student/requests`                  | Frontend-only request, review, pending, and cancel states                    |
| `/student/announcements`             | Fictional notices, audience filter, and empty-state recovery                 |
| `/student/calendar`                  | Month calendar, mobile date strip, and selected-day agenda                   |
| `/student/profile`                   | Read-only fictional Student identity and academic details                    |

`src/features/student/demo-data.ts` centralizes the fake Student identity, term, subjects, schedule, grade states, attendance, synthetic curriculum, sample documents, request history, notices, and calendar events. `demo-context.tsx` stores new/cancelled request state in React memory across Student navigation; refresh resets it. It uses no local storage or API writes.

The Student ID uses a separate `DEMO-STU-…` prefix from any Applicant ID. The campus label is **IIT Campus**. Dates, records, people, instructors, and notices are fictional.

## Experience and safeguards

- **Dashboard:** answers next class and today’s schedule first, then current enrollment and recent released sample information. It does not present analytics or invented performance metrics.
- **Academics:** keyboard-operable Schedule, Subjects, Grades, Attendance, and Curriculum tabs. Schedule has week controls and a focused mobile day agenda. Subjects show enrolled sample subjects. Grade filters show the selected academic year/semester; unreleased grades have no numeric result or average.
- **Grades and attendance:** only sample release states and illustrative values appear. The page makes no official grading, passing, standing, attendance-threshold, or academic-consequence claim. Attendance records expand per subject.
- **Curriculum:** the course map is synthetic and explicitly disclaims official curriculum, degree audit, and graduation eligibility.
- **Enrollment and documents:** current sample enrollment status is visible. COR and COE previews are clearly marked **SAMPLE · NOT VALID FOR OFFICIAL USE**; they do not create official documents.
- **Requests:** the Student chooses a COR or COE copy, reviews it, adds a Pending sample request, and can cancel the pending item. A notice confirms the in-browser change. It is not sent to the school.
- **Announcements and calendar:** fictional items can be filtered by audience. Calendar controls change month and date; days without events show an empty state.
- **Profile:** read-only fake personal/contact and academic information. No staff controls or edit workflow were added.

## Responsive and accessibility review

The implementation keeps the existing P3-M1 / P3-M2 visual language: Arial, restrained blue and yellow accents, white and cool-gray surfaces, and the shared portal shell. The responsive review covered all eleven listed views at **375 × 812**, **768 × 900**, and **1440 × 900** using production-rendered screenshots. No page-level horizontal overflow was observed. Academic tabs and mobile date strips scroll within their own controls where needed.

A separate rendered finish pass found three issues and verified their fixes: schedule course codes now sit above subject titles, tablet calendar dates have clear button borders and selection state, and one-event calendar labels use the singular form. The Impeccable detector reported no findings.

Keyboard checks covered academic-tab arrow/Home/End selection and native-dialog Escape behavior. COR and COE previews opened and closed with focus returned to their launch buttons. Attendance detail disclosure, calendar date selection, announcement filtering, request review/submit/cancel, and mobile navigation Escape/focus return and route selection were exercised. Controls have labels and visible selected/status text; reduced-motion and print styles are scoped in `student.css`.

Rendered checks found one low-contrast Cancelled badge and corrected it. Sample computed contrast ratios are 4.62:1 for muted body copy, 10.54:1 for the primary button, and at least 6.81:1 for the four request statuses. Keyboard focus showed the shared 2px ring. Tabs, week controls, and primary actions were at least 44px high; mobile date buttons were 54px. The review browser had reduced motion enabled, with button transitions and animations resolving to `0s`. These checks support the WCAG 2.2 AA direction; they are not a formal conformance certification.

The browser print command was invoked from the sample COR preview. The browser session did not expose a reviewable native print destination, so pagination and an exported PDF were not visually verified. Physical printing and screen-reader operation were not tested.

## Regression validation

| Check                   | Result                                                      |
| ----------------------- | ----------------------------------------------------------- |
| `pnpm.cmd env:check`    | PASS — configuration checked without printing secret values |
| `pnpm.cmd test`         | PASS — 12/12                                                |
| `pnpm.cmd test:db`      | PASS — 12/12                                                |
| `pnpm.cmd test:auth`    | PASS — 9/9                                                  |
| `pnpm.cmd test:access`  | PASS — 20/20                                                |
| `pnpm.cmd lint`         | PASS                                                        |
| `pnpm.cmd typecheck`    | PASS                                                        |
| `pnpm.cmd format:check` | PASS                                                        |
| `pnpm.cmd build`        | PASS                                                        |
| Impeccable detector     | PASS — no findings                                          |

The access-control regression includes all seven Student navigation routes, unknown paths, unrelated portal denial, and the existing Applicant protection checks. Existing Applicant code and auth boundaries remain in place. The browser review used the production build and a clearly fake seeded Student account.

## Deferred work and next milestone

P3-M3 does not add Student tables, grade or attendance APIs, official curriculum data, schedule assignment, official document generation, request fulfillment, announcement delivery, calendar persistence, uploads, notifications, audit records, or resource-level authorization. Those require separate institutional policy and backend work.

P3-M4 Academic Experience is now complete as a frontend demo; P3-M5 Admissions & Records is next. P3-M3 adds Student self-view presentation only; academic staff workflows and authoritative academic records were outside that milestone.

## File inventory

Created: `src/features/student/demo-data.ts`, `src/features/student/demo-context.tsx`, `src/features/student/student-academics.tsx`, `src/features/student/student-page.tsx`, `src/features/student/student.css`, and this completion record.

Modified: `src/app/[portal]/layout.tsx`, `src/app/[portal]/[[...section]]/page.tsx`, `src/components/portal/app-shell.tsx`, `src/server/access-control/navigation.ts`, `src/tests/access-control.integration.test.ts`, `README.md`, and `docs/phase-2/PHASE-2-OVERVIEW.md`.
