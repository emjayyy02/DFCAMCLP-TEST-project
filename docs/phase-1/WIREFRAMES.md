# Low-fidelity wireframes

24 required screens. Diagrams show hierarchy, not final dimensions, fields, branding or fabricated records. Brackets denote controls; `<...>` denotes supplied/configured information. All protected screens inherit scoped access, loading/error and confirmation behavior from [Shared patterns](SHARED-UX-PATTERNS.md). Each screen below specifies its own empty/failure behavior. Route destinations are in [Route map](ROUTE-MAP.md); Q references are in [Open questions](OPEN-QUESTIONS.md).

Common desktop frame for authenticated screens:

```text
+---------------------------------------------------------------+
| DFCAMCLP   <current portal>          Notifications   User menu |
+---------------+-----------------------------------------------+
| Permitted nav | Breadcrumb / page title / context             |
| Active group  | Primary task                                 |
| Child links   | Supporting detail                             |
+---------------+-----------------------------------------------+
```

Mobile replaces the sidebar with a drawer; the current portal stays visible. Diagrams below show main content unless explicitly depicting public/login shells. All forms expose real save state; no progress bar implies approval or elapsed-time completion.

## W01 — Public Home

```text
DFCAMCLP | Programs Admissions Campuses Announcements | Menu
<Institution introduction>
Find your program. Understand the admission process.
[Apply Now]  [Applicant Login]                  Portal Login
Programs and campuses     | Admission steps
<configured choices>      | Apply > Documents > DCAT > Enrollment
Published announcements
About / Contact / Help
```

- Purpose / user: help prospective students understand options and begin admission.
- Hierarchy: institution → task CTAs → programs/admission explanation → notices → contact.
- Primary action: Apply Now. Secondary: Applicant Login, browse programs, general Portal Login.
- Data/status: configured campus/program names and published notices only; no personal results or invented dates.
- Empty: no notices → “No current announcements”; retain admissions guidance. Error: notice-load Retry without removing navigation.
- Mobile: stack introduction, CTAs, admission steps and program list; public menu opens a drawer. No dashboard counters.

## W02 — Global Login

```text
DFCAMCLP                              [Back to public site]
Sign in
Portal              [Select portal v]
<Identity label>     [                       ]
<Context-specific username help>
Password            [                  Show ]
<Inline validation / access message>
[Sign In]
[Account help]                 Applicant? [Apply]
```

- Purpose / user: all account holders enter one explicitly selected portal.
- Hierarchy: portal → credentials → submit → recovery; no six unrelated layouts.
- Primary: Sign In. Secondary: show password, account help, public return, Apply.
- Data/status: six portal options excluding Public; checking, failed authentication, disabled/activation guidance after verification, or membership denied.
- Empty: no portal selected → prompt selection before entry. Error: generic credential failure; authenticated membership denial offers permitted portal choices without granting access.
- Mobile: single narrow form, visible labels and reachable submit when keyboard opens. Loading uses “Signing in…” and prevents duplicate attempts.

## W03 — Applicant Registration

```text
Apply to DFCAMCLP                       [Already registered? Sign in]
1 Account access > 2 Application > 3 Review and submit
Account-contact information
<required identity/contact fields pending confirmed policy>
<activation and privacy explanation supplied by institution>
[Continue]
<Next: application draft and Applicant ID>
```

- Purpose / user: prospective applicant begins account access without yet becoming a student.
- Hierarchy: purpose/steps → minimal contact fields → confirmed notices → continuation.
- Primary: Continue to application/access instructions. Secondary: Sign in, return to admissions.
- Data/status: registration pending/succeeded; activation guidance under Q12. No Student ID. Applicant ID appears on first saved application draft under Q01.
- Empty: blank labeled form with no fabricated defaults. Error: invalid fields link from summary; uncertain account creation prompts status/sign-in check, avoiding duplicate registration.
- Mobile: single column; full notices expandable only if essential consent remains readable. Preserve entered information on recoverable failure.

## W04 — Applicant Application Form

```text
Application                 Applicant ID <id>       Draft
Sections: Applicant details | Program choice | Review
<confirmed application fields grouped by topic>
Campus [choice]  Program [valid choices]  Major [if applicable]
Saved <time> / Unsaved changes
[Save Draft]                              [Review Application]
Review: field summary with [Edit section]
                                         [Submit Application]
```

- Purpose / user: applicant supplies and reviews application information.
- Hierarchy: ID/status → grouped fields → save feedback → review; submit appears at review, not competing with edit actions.
- Primary: Review Application, then Submit Application. Secondary: Save Draft, edit section, return to dashboard.
- Data/status: Draft/Submitted; configurable choices; Q13 governs fields, Q01 governs draft ID. Physical requirements are explained on Requirements, not an invented upload form.
- Empty: new draft explains first section. Error: field summary, retained entries, unsaved alert; uncertain submit checks status before retry.
- Mobile: sequential single-column sections; review all entered values before confirmation. Submitted version read-only with correction guidance (Q19).

## W05 — Applicant Dashboard

```text
Welcome <name>                         Applicant ID <id>
<program> / <campus>
Current stage: <stage>
+------------------------------------------------------+
| Next action: <specific instruction or waiting reason>|
| <date/time/location when assigned> [Open next step]  |
+------------------------------------------------------+
Application > Documents > DCAT > Enrollment
<current-stage details / latest relevant event>
Important announcements
```

- Purpose / user: applicant understands exactly what to do next.
- Hierarchy: identity/stage → next action → progress → relevant details → notices.
- Primary: stage-dependent next action. Secondary: full status timeline, announcements, profile.
- Data/status: own application, physical schedule, DCAT schedule/released result or accepted enrollment progress. Cards change with stage.
- Empty: no application → Begin Application; waiting for schedule → explicit waiting text. Error: progress unavailable → Retry; never infer rejection from a load failure.
- Mobile: next action first, compact current/next milestones, expandable vertical history. Not Qualified shows neutral result guidance and no enrollment CTA.

## W06 — Applicant Requirements

```text
Physical requirements                <verification status>
Submission appointment
<date> <time> <campus/location> <staff instructions>
Requirement                         Status / staff note
Report card                         <Pending / Verified>
Good Moral Certificate              <Pending / Verified>
PSA Birth Certificate               <Pending / Verified>
Residency-related evidence          <Pending / Verified>
[View appointment details]          [View application status]
```

- Purpose / user: applicant prepares for physical submission and sees verification progress.
- Hierarchy: appointment/instructions → checklist → next eligibility explanation.
- Primary: View appointment details when scheduled; otherwise read what to prepare. Secondary: application status, contact instructions.
- Data/status: item verification and factual deficiencies (Q13); staff owns verification, applicant has no Verify button.
- Empty: no schedule → “Your submission schedule has not been assigned”; still show known checklist. Error: unavailable verification → Retry, do not label all items missing.
- Mobile: labeled document rows with notes underneath; appointment details above checklist. No file upload or interview.

## W07 — DCAT Schedule

```text
DCAT Schedule                             Scheduled
Applicant <name>    Applicant ID <id>
Program <program>  Campus <campus>
Exam date <date>   Time <time>   Room <room>
<confirmed exam instructions>
[Download DCAT Form]
Schedule updated <time>                   [Application status]
```

- Purpose / user: eligible applicant finds the assigned exam and obtains its form.
- Hierarchy: schedule status → identity → exam date/time/place → download → instructions/history.
- Primary: Download DCAT Form. Secondary: application status, current schedule review.
- Data/status: exam status and all required form fields; current assignment replaces obsolete presentation without erasing history.
- Empty: not eligible → prerequisite explanation; eligible unscheduled → waiting message. Error: download failed → Retry with schedule still readable; schedule load failure never shows invented room/time.
- Mobile: vertically stacked facts and clear download button; full applicant name/ID remains readable. Superseded forms are identified (Q03).

## W08 — DCAT Result

```text
DCAT Result
Applicant <name> / <id>     Program <program> / Campus <campus>
<Results not yet available OR Released <date>>
<Passed OR Not Qualified>
<Outcome-specific explanation>
[View Enrollment Progress]  (Passed only)
[Contact Admissions]       [Back to Dashboard]
```

- Purpose / user: applicant privately reads their released result.
- Hierarchy: identity → release condition → outcome → appropriate next step.
- Primary: View Enrollment Progress for Passed; read outcome/contact guidance for Not Qualified. Secondary: Dashboard, Admissions contact.
- Data/status: only own released Passed/Not Qualified; no raw scores or unpublished outcome hidden in page content.
- Empty: results not released → explain return later without promise of notification timing. Error: cannot load → Retry, never render Not Qualified as fallback.
- Mobile: concise result heading and text; no dramatic success/failure illustration. No interview, retake or appeal invented.

## W09 — Enrollment Progress

```text
Enrollment Progress                  <current milestone>
Next: <Registrar appointment / wait for issuance / activation>
[Open required step]
Milestone                         Detail
For Enrollment                    <date if recorded>
Registrar physical submission     <appointment / verification>
COE                               <Not yet issued / Issued> [View]
COR                               <Not yet issued / Issued> [View]
Enrolled                          <Pending / confirmed>
Student account                   <activation state if created>
```

- Purpose / user: passed applicant or transitioning student follows official enrollment progress.
- Hierarchy: next action → milestones → issued documents → separate account access.
- Primary: current required step; after issuance View current document. Secondary: timeline, dashboard, activation instructions if available.
- Data/status: Registrar schedule, COE then COR, authorized Enrolled; account activation separate (Q02/Q05).
- Empty: admission not passed/released → explain availability prerequisite. Error: document failure offers Retry; issuance not inferred from an attempted download.
- Mobile: vertical milestone list, document action under each row. Initial COE/COR needs no new request.

## W10 — Student Dashboard

```text
<name>  <program> / <year level> / <campus>
AY <year>  Semester <term>
Next class: <subject / offering>  <time / room> [View Class]
Today's schedule                 Enrollment <status> [View]
<short agenda>                   Attendance <recorded summary>
Latest released grades           Pending requests
Announcements
```

- Purpose / user: student understands current academic activity.
- Hierarchy: current context → next class (or required enrollment action) → today's agenda → compact academic/service summaries.
- Primary: View Class; when enrollment action blocks access, Open Enrollment instead. Secondary: schedule, grades, requests, notices.
- Data/status: current term only by default; attendance counts and released grades, no unexplained health score.
- Empty: no classes today → next known class or none scheduled; no grades → not yet available. Error: failed region has Retry without collapsing other content.
- Mobile: next class then agenda; summaries stacked compactly. No complete academic history on dashboard.

## W11 — Student Schedule

```text
My Schedule           AY <year> Semester <term>
[Today] [Previous] <date/week> [Next]    [Day / Week]
Time          Offering / section          Room
<time>        <subject title / section>    <room> [View Class]
<time>        <subject title / section>    <room> [View Class]
Selected class: faculty / campus / meeting details
```

- Purpose / user: student finds where and when to attend an enrolled offering.
- Hierarchy: term/date → agenda → class detail.
- Primary: View Class. Secondary: day/week navigation and term selection.
- Data/status: offering-specific meetings, section, faculty, room; unassigned data labeled honestly.
- Empty: no meetings for date → navigate next date or term; no enrollment → enrollment status link. Error: Retry with chosen term/date retained.
- Mobile: day agenda default, labeled time/place cards; avoid shrinking the week grid. Historical terms remain clearly identified.

## W12 — Student Grades

```text
Grades                           AY [year] Semester [term]
Released final grades
Subject / offering                 Final grade   Released
<code / title / section>            <value>       <date>
<code / title / section>            Not yet released
<record explanation / correction contact>
[View enrollment context]
```

- Purpose / user: student reads authoritative released grades.
- Hierarchy: term → released values → missing-publication explanation → correction guidance.
- Primary: read/select term; no artificial submit action. Secondary: offering detail, enrollment context, correction contact.
- Data/status: only released final values; no GPA, formula, raw internal draft or inferred pass/fail without policy Q06.
- Empty: no released grades → “No grades have been released for this term.” Error: failed load is an error, not “No grades.”
- Mobile: subject-labeled rows/cards; retain term heading and release wording. Long subject names wrap.

## W13 — Academic Dashboard

```text
Teaching today                         AY <year> / <term>
Next class <offering / section / room>  [Open Class]
Today's classes
<time / class> <attendance action>      [Record Attendance]
Pending grade submissions              [Open Grade Submission]
Assigned classes                       [View All]
Announcements
```

- Purpose / user: faculty sees today's teaching actions.
- Hierarchy: next/today classes → incomplete attendance → grade work → assignments/notices.
- Primary: Open Class / Record Attendance for relevant meeting. Secondary: grade submission, assigned classes.
- Data/status: assigned offerings only; pending submissions are not assumed overdue without known deadlines.
- Empty: no assigned classes → show current term and assignment-contact guidance. Error: class-load Retry; do not show a false cleared workload.
- Mobile: class/action cards; pending grade work remains reachable below today's agenda. Management links only for authorized leaders.

## W14 — Faculty Class Detail

```text
<subject code/title>  <section>          AY <year> / <term>
<campus / program>  <meeting times / rooms>  Faculty <name>
[Overview] [Roster] [Attendance] [Grades] [Announcements]
Next meeting <date/time>                [Record Attendance]
Roster summary <authorized count>      [View Roster]
Grade work <Draft / Submitted / Locked> [Open Grades]
```

- Purpose / user: assigned faculty acts within the correct course offering.
- Hierarchy: offering identity → task tabs → next meeting → roster/grade context.
- Primary: Record Attendance for selected meeting. Secondary: roster, grades, scoped class announcement if permitted.
- Data/status: subject is distinct from offering; term/section never omitted when encoding.
- Empty: no roster → “No students enrolled in this offering”; no meeting → choose known meeting, no invented one. Error: Retry; revoked assignment gives safe access-unavailable state.
- Mobile: identity wraps; tabs scroll with clear active selection; action sections stack. Do not expose student records outside class scope.

## W15 — Faculty Attendance

```text
Attendance — <offering / section>         Meeting [date/time v]
<AY/semester>                    Unsaved / Saved <time>
Student ID / Name             Present  Late  Absent
<student>                       ( )    ( )    ( )
<student>                       ( )    ( )    ( )
Recorded <count>   Unmarked <count>
[Save Attendance]                         [Back to Class]
```

- Purpose / user: faculty records attendance for one actual meeting.
- Hierarchy: meeting identity → roster entry → completeness → save feedback.
- Primary: Save Attendance. Secondary: meeting selector, back to class.
- Data/status: Present/Late/Absent; unmarked is not absent. Q07 controls partial save/corrections. No default all-present state.
- Empty: roster empty → explain and link class; no meeting selected → selection prompt. Error: retain unsaved marks, show Retry; concurrent edit requests reconciliation.
- Mobile: one student card with clearly labeled choices; completeness and save reachable without covering fields. Leaving unsaved work triggers a stay/discard prompt.

## W16 — Grade Encoding

```text
Final Grades — <offering / section>      AY <year> / <term>
Draft / Saved <time> / Locked
Student ID / Name              Final grade      Validation
<student>                      [value]          <message>
<student>                      [value]          <message>
[Save Draft]                            [Review Submission]
Review: class / term / completeness / consequences
                                        [Submit Grades]
```

- Purpose / user: assigned faculty enters final grades and submits deliberately.
- Hierarchy: offering context → roster values/errors → save → separate submission review.
- Primary: Review Submission then Submit Grades. Secondary: Save Draft, return to class, submission history.
- Data/status: Draft/Submitted/Locked; configurable accepted values, no invented grading formula (Q06).
- Empty: no roster → no encoder, show assignment/enrollment guidance. Error: invalid rows link from summary; failed save preserves draft; failed submit never claims success.
- Mobile: student-labeled entry cards, errors adjacent to fields, full-page confirmation. Submission does not release grades to students.

## W17 — Admissions & Records Dashboard

```text
Admissions & Records                    AY/term [ ] Campus [ ]
Review <n> | Verification <n> | DCAT <n> | Release <n>
Accepted <n> | Enrollment <n> | COE <n> | COR <n>
Queue [Documents awaiting verification v]  Search [ ]
Applicant / ID      Program     Waiting since    Next action
<record>           <program>   <date>           [Open]
[Previous] Page <n> [Next]
Relevant deadlines / recent activity
```

- Purpose / user: authorized Records staff processes waiting work.
- Hierarchy: scope → compact queue filters → work rows → deadlines/activity.
- Primary: Open selected next record. Secondary: filter, search, pagination and other permitted queues.
- Data/status: live scoped counts, current stage and known dates only; counters may overlap.
- Empty: no matching work → clear filter option; cleared queue gets a calm completion message. Error: unavailable counts are not zero; queue Retry preserves scope.
- Mobile: queue count selector then labeled applicant cards; table is not merely squeezed. Filters summarize selected campus/program.

## W18 — Applicant Review

```text
[Back to review queue]  <Applicant name / ID>      Submitted
Program / campus           Application submitted <date>
[Application] [Requirements] [Schedule] [History]
<application sections read-only>
<verification facts / missing information notes>
Review note [                                              ]
[Complete Review]          [View Requirements] [View Schedule]
```

- Purpose / user: scoped Admissions reviewer examines one submitted application.
- Hierarchy: applicant/stage → submitted evidence → notes → permitted review action.
- Primary: Complete Review under confirmed authority; this does not mean Passed or release results. Secondary: requirements, scheduling, history, back to queue.
- Data/status: submitted information, item verification, history; correction handling is Q19. Do not add rejection/approval controls without defined policy.
- Empty: absent/incomplete record → explain missing information and authorized correction path. Error: save/load failure retains note with unsaved warning; stale version requires recheck.
- Mobile: tabs/detail sections stack; primary action follows evidence. Restore queue filters on return.

## W19 — DCAT Scheduling

```text
DCAT Scheduling                  Campus [ ] Program [ ]
Eligible, unscheduled applicants          Search [ ]
[ ] Applicant / ID   Program   Eligibility
[ ] <record>         <value>   Documents verified
Assignment: Date [ ] Time [ ] Campus [ ] Room [ ]
<capacity / conflict feedback when configured>
[Review Schedule Assignment]
Review: selected applicants + exact slot  [Confirm Assignment]
```

- Purpose / user: authorized Admissions scheduler assigns eligible applicants.
- Hierarchy: eligible queue → selection → slot → conflicts → review.
- Primary: Review then Confirm Assignment. Secondary: filters, clear selection, inspect applicant.
- Data/status: eligibility, existing assignment, selected count and configured slot constraints (Q03). Bulk selection never silently spans hidden pages.
- Empty: no eligible applicants → explain filter or eligibility; no configured slots → configuration-owner guidance. Error: conflict blocks affected assignment; failed save reports what is known before retry.
- Mobile: applicant selection cards then separate assignment/review step with visible selected count. No invented room capacity.

## W20 — Enrollment Queue

```text
Enrollment Queue               AY/term [ ] Campus [ ] Program [ ]
Stage [Registrar / Section / Subjects / COE / COR v] Search [ ]
Applicant or Student / ID   Current milestone    Waiting since
<person>                   <milestone>          <date> [Open]
Detail: prerequisites / Registrar verification / section & subjects
COE <state>   COR <state>   Enrollment <state>
[Perform current permitted step]                [History]
```

- Purpose / user: Registrar processes passed applicants through official enrollment.
- Hierarchy: scoped stage queue → person detail → prerequisite evidence → one milestone action.
- Primary: open record then appropriate verification/assignment/issuance action. Secondary: filters, history, student record.
- Data/status: separate applicant/student identifiers when present; COE/COR issuance and enrollment status; account activation never substitutes for Enrolled.
- Empty: no waiting records → clear-filter option. Error: failed issuance leaves milestone pending; conflicting change requires refresh.
- Mobile: cards open a full detail page; confirmations show person/document clearly. Manual section and subject steps remain provisional Q05.

## W21 — Student Record

```text
Student <name>  Student ID <id or not created>
Program / campus / year / standing
[Overview] [Enrollment] [Academic Records] [Applicant History]
Current enrollment: <AY/term / section / subjects / state>
COE / COR <issuance details>
Linked applicant <Applicant ID> [View authorized history]
Account provisioning <state> [Open provisioning handoff]
[Create Student Identity] (only at eligible checkpoint)
```

- Purpose / user: authorized Records staff views a coherent student record and admission link.
- Hierarchy: identity/standing → current enrollment → records/history → permitted provisioning action.
- Primary: create identity only at eligible checkpoint; existing records primarily support viewing. Secondary: enrollment, academic records, applicant history, status action if separately granted.
- Data/status: distinct IDs; preserved source history; basic account state without permission-management authority.
- Empty: accepted applicant lacks Student ID → eligible creation guidance; no enrollment history → explicit absence. Error: duplicate identity suspicion stops creation for staff resolution; load failure reveals no partial unrelated records.
- Mobile: identity then tabs/sections; action confirmations name the person. No automatic student standing promotion (Q18).

## W22 — Operations Dashboard: Maintenance example

```text
Operations — Facilities
Assigned to Me <n> | Open <n> | High Priority <n> | Resolved Today <n>
Ticket / location        Priority      Status       Action
<issue>                  <priority>    Pending      [Open]
<issue>                  <priority>    In Progress  [Open]
[Report Issue] (if authorized)
Selected ticket: details / assignee / task history
```

- Purpose / user: maintenance staff handles assigned facilities work.
- Hierarchy: assigned queue → priority/status → detail/action; no HR/admin modules for maintenance-only users.
- Primary: Open assigned ticket, then start/resolve as permitted. Secondary: filters, report issue if granted, task history.
- Data/status: Pending/In Progress/Completed; Resolved Today counts completion events under Q11.
- Empty: no assignments → clear message with permitted open-queue link. Error: queue failure not zero assignments; Retry retains filter.
- Mobile: location, priority and state remain on each card; ticket detail is full-screen. Administration variant follows the separate priorities in DASHBOARDS.md.

## W23 — Technology Dashboard

```text
Technology
Requires attention
<security/system item>   <severity / current state> [Inspect]
System health <known state / unavailable>  Backups <known status>
Accounts: Active <n> / Disabled <n>      Failed logins <n>
Recent authorized audit activity
<time / technical action / result>                      [View]
```

- Purpose / user: scoped technical staff identifies technical work requiring attention.
- Hierarchy: attention queue → evidenced health/backup state → account/security context → audit events.
- Primary: Inspect actionable event. Secondary: permitted accounts/security/system destinations.
- Data/status: no academic data; system regions shown only when allowed and backed by data (Q15).
- Empty: no actionable events → “No items requiring attention in your scope”; unknown monitoring remains Unknown. Error: unavailable health/backup data never appears Healthy/Successful.
- Mobile: attention items first, concise status rows after. Developer navigation requires explicit grants and no execution controls are implied.

## W24 — Technology User Account / Permissions

```text
[Back to Users]  <account identity>             <account status>
[Summary] [Memberships] [Permissions] [Audit History]
Memberships: Applicant [ ] Student [ ] Academic [ ] ...
Permissions for selected portal:
<action>                  <campus/program/record scope>
<explicit grant>          <scope>
Proposed changes: Before -> After
Reason [                                                ]
[Review Changes]                     [Disable Account] (separate)
Confirmation: account + exact changes + consequences [Confirm]
```

- Purpose / user: authorized technical administrator reviews and changes bounded access grants.
- Hierarchy: account identity/status → separate membership and action scope → change summary/reason → confirmation.
- Primary: Review Changes then Confirm. Secondary: audit history, authorized activation/recovery actions; disable is separate and consequential.
- Data/status: membership is not “all permissions”; current/proposed grants differ visibly; no passwords, secrets or academic records. Administrator can only grant within own assigned administration scope (Q10).
- Empty: no memberships → “No portal access assigned”; no grant authority → read-only detail without controls. Error: concurrent grant change requires refresh; failed action preserves proposed diff and never reports success prematurely.
- Mobile: sections become full-page steps; before/after changes wrap legibly and explicit confirmation remains reachable. Successful change refreshes status and shows audit outcome; identity/history are not deleted.
