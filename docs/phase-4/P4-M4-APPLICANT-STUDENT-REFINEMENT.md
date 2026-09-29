# P4-M4 — Applicant + Student Refinement

**Status: PASS / COMPLETE — 29 September 2026**  
P4-M5 remains next and was not started.

## 1. Locked sources read

Implementation followed `DFCAMCLP.md`, `docs/phase-4/PHASE-4-CONTEXT.md`,
`P4-DESIGN-SYSTEM.md`, `P4-UX-RULES.md`, `P4-ROADMAP.md`,
`PHASE-4-MANUAL-AUDIT.md`, the P4-M3 handoff/completion notes, current feature
source and fixture consumers, and the installed Next.js app/layout/client
component/type-generation guides. `DFCAMCLP.md` remains canonical for the two
campuses and four programs.

## 2. Applicant demo-control relocation

The Applicant scenario selector now occupies the shared shell's demo-tools
slot. Desktop shows it above Applicant navigation; the mobile drawer includes
the same control before the route links. It reads and updates the existing
`ApplicantDemoProvider`, which remains above the shell and route children in
`src/app/[portal]/layout.tsx`.

## 3. Applicant scenario behavior

The ten existing scenarios and their workflow meanings remain centralized in
`src/features/applicant/demo-data.ts`. The native selector groups choices under
Application, DCAT, and Enrollment optgroups to improve scanning without adding
a second control surface or scenario state. A changed selection updated the
Applicant dashboard in the rendered preview. The preview helper mounted a
page-level provider, so route-to-route persistence was not directly browser
verified there; the guarded production layout provides the shared provider
outside the route content.

## 4. Applicant profile refinement

The profile uses the shared `IdentitySummary` hierarchy for the sample
applicant identity and keeps the existing editable sample fields, review
sections, and disclosure. It remains fictional frontend state.

## 5. Applicant photo behavior

Applicant uses the shared `DemoProfilePhotoPicker` and object-URL hook. The
picker accepts JPEG, PNG, and WebP up to 2 MB, rejects unsupported MIME types or
oversized files with inline feedback, and discloses that previews are local,
not uploaded or saved, and reset on refresh. No backend, persistent storage, or
document-upload behavior was added. The shared control was manually exercised
on the Student profile; Applicant uses the same component and hook but was not
separately file-tested.

## 6. Student fictional identity change

The primary demo Student is John Paul Reyes, BSIS at IIT Campus, represented as
3rd Year / 2nd Semester in AY 2026–2027. The stable displayed Student ID remains
`DEMO-STU-2026-0142`; Applicant identity and ID remain separate.

## 7. Cross-portal fixture consistency

The linked Academic roster, Records student fixture, and Operations student
assistance example use John Paul Reyes and the same Student ID/year context
where those fields are represented. The Academic primary roster key is now the
neutral `student-primary`; all grade-map references were updated with it, so
record-to-grade relationships remain intact. Institution campuses and program
relationships were not changed.

## 8. Student academic-state change

Student demo context now presents 3rd Year / 2nd Semester, AY 2026–2027. The
current five-subject term remains unreleased, with each current grade shown as
pending/not yet released.

## 9. Historical-grade architecture

Historical grades remain centralized in `src/features/student/demo-data.ts`.
The selector covers six year/semester datasets across AY 2024–2025 through
2026–2027 (five past terms and the current term), ordered newest first by the
available academic-year and semester choices. Selecting a 2025–2026 term in the
rendered review showed its released sample grades.

## 10. Historical-subject treatment

Historical subjects and grades are synthetic interface-review data. The
Student Academics views state that course lists are not official curricula;
Curriculum remains explicitly labeled `V1 ASSUMPTION` and not a degree audit or
graduation-eligibility check.

## 11. Grade-policy boundary

Grades display individual illustrative values and release statuses only. The
introduction now accurately covers both released and unreleased sample rows.
No average, GWA, GPA conversion, grade formula, passing rule, or academic
standing is calculated.

## 12. 12-hour time implementation

Student schedule displays use the shared `formatScheduleTime` and
`formatScheduleRange` helpers with `Intl.DateTimeFormat`, `en-PH`,
`Asia/Manila`, and `hour12: true`. Dashboard, academic schedule, and calendar
samples use AM/PM; other portals were not globally reformatted.

## 13. Student Calendar refinement

The calendar keeps its existing week/date controls, selected-day context, and
agenda hierarchy. Student event times use the shared Philippine-time formatter.
The narrow-screen day selector and agenda remain within the page viewport.

## 14. Student Academics refinement

Schedule, Subjects, Grades, Attendance, and Curriculum remain in the existing
local academic-view navigation. Tabs expose selected state and arrow/Home/End
keyboard handling. Grade selectors distinguish year and semester; no new
nested sidebar or backend workflow was added.

## 15. Student Profile redesign

The profile is identity-oriented: shared avatar/identity summary first, then
Personal and Academic details. It presents name, stable Student ID, program,
campus, year level, status, academic year, and semester without adding
unsupported personal fields or a wide property-table layout.

## 16. Student photo behavior

The photo preview is in-memory object-URL state shared through
`StudentDemoProvider` and the existing portal layout. A supported local WebP
rendered as a blob preview; a text file was rejected with an accessible error;
Remove photo cleared the preview and error. Source cleanup revokes replaced and
unmounted object URLs. Refresh reset is structural (provider state is not
persisted) and is disclosed in the UI; it was not separately exercised after
file selection. No data was sent outside localhost.

## 17. Fake-name audit

The active demo fixture search no longer finds `Marvin` in feature fixtures or
seed data. The Academic roster's former `student-marvin` internal key was
replaced with `student-primary`, and its grade references were updated. The
public footer's `Marvin Silverio` is project-author attribution, not a demo
person. Older P3 documents retain their historical account of the former
sample identity; they were not rewritten as part of this M4 change.

## 18. Responsive review

Rendered Applicant and Student profile surfaces were checked at 375×812,
768×900, and 1440×900. Document widths stayed at or below the viewport width
(the browser reserved a scrollbar gutter). Applicant's mobile drawer exposes
the selector; desktop shows it in the navigation tools area. Student profile
identity and photo control stack cleanly. Earlier route review also covered
Applicant dashboard/application/profile, Student dashboard, Grades, Calendar,
and Academic Schedule at representative target sizes. Internal horizontal
rails remain scrollable; no page-level horizontal overflow was observed.

The P4-M3 public correction was already present in the current source: public
title is “Student & Staff Portal,” public navbar label is “Sign In,” the
redundant “Choose your next step” section is absent, and the history component
contains the four researched milestones. No extra M3 page edit was necessary.

## 19. Accessibility

The scenario selector has a programmatic label and explanatory text. Profile
photo input labels, accepted formats, errors, and reset disclosure are
accessible; academic tabs expose tab roles and selected state; calendar dates
are named. Browser review used the accessibility tree and source review
confirmed keyboard tab movement and dialog patterns. This was not a complete
keyboard-only, screen-reader, physical-device, or WCAG-conformance audit.

## 20. Independent visual review

Two independent critiques were authorized. Assessment A scored the ten
heuristics 28/40 (Good) and identified grade-copy contradiction, mobile rail
continuation, dense scenario choices, and adjacent Applicant profile dividers.
The copy, grouping, and divider findings were addressed. The compact scrollable
tab/day rails remain, with their existing scrollbar cues and keyboard support.
Assessment B ran the requested detector once on the modified product markup;
it returned `[]` (zero findings). Its rendered review found a repeated role
label and past Applicant sample appointments, both corrected. It also noted a
long `.invalid` email wrapping in the Student profile; the fictional address
was shortened while retaining the reserved `.invalid` domain.

Assessment A inspected rendered views at 375×812 and 1440×900. Assessment B's
browser surface was approximately 1265×711 and could not set target dimensions.
Neither critique performed a full keyboard/screen-reader pass or a physical
device review. The detector did not produce an overlay; DOM injection was not
available through the active review surface.

## 21. Regression results

- `pnpm test`: PASS, 7 files / 49 tests.
- `pnpm test:db`: PASS, 12 tests.
- `pnpm test:auth`: PASS, 9 tests.
- `pnpm test:access`: PASS, 21 tests.
- `pnpm lint`: PASS.
- `pnpm typecheck`: PASS.
- `pnpm format:check`: repository command flags only the untouched
  `docs/phase-4/PHASE-4-MANUAL-AUDIT.md`; all changed files were formatted and
  checked individually.
- `pnpm build`: PASS. Final route list contains no temporary preview route.
- `git diff --check`: PASS.
- `pnpm env:check`: BLOCKED before the script by Node 24 runtime error
  `uv_os_get_passwd returned ENOMEM`; no application code change was made for
  it.

## 22. Known limitations

Applicant scenario persistence across guarded production routes was confirmed
from provider placement in the portal layout but not directly exercised with
an authenticated browser session. The temporary unguarded preview mounted its
provider at page scope and reset when its route changed, so it is not evidence
against the production layout. Photo preview, invalid-file rejection, and
removal were manually exercised; refresh reset is supported by in-memory state
and code inspection but was not separately reloaded after selection. No
physical-device or complete assistive-technology review was performed. The
environment check remains unavailable for the recorded Node runtime reason.

## 23. Deferred P4-M5+ work

P4-M5 Academic + Admissions & Records refinement, staff entity navigation,
search/filter work, and M5-specific Academic/Records presentation remain
unstarted. P4-M6 Operations/Technology refinement, P4-M7 motion and
cross-portal release-candidate QA, all persistent photo storage, policy-backed
grades/curriculum, real workflow persistence, and deployment remain deferred
to their existing milestone or policy owner. No final scroll animation was
added.
