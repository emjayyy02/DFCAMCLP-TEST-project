# Dashboard strategy

Every dashboard answers: what matters now, what needs attention, what next? Counts link to the same filtered queue they describe and share its scope. Never fabricate counts or show zero when data failed. Load/error states are per region so a failed announcement list does not conceal the next scheduled action. Show refresh/retrieval time where stale operational information could mislead.

| Portal | First / primary task | Next content, in order | Drill-through and conditional behavior |
|---|---|---|---|
| Applicant | Applicant ID, current stage, one next-action card and compact admission stepper | Physical submission schedule; DCAT schedule or released result; accepted enrollment milestones; important notices | Next action opens the matching form, requirements, exam or enrollment page. Stage-specific cards replace one another rather than accumulating. Before staff scheduling: “No schedule assigned yet”; no fake countdown. |
| Student | Name, program, year, campus, AY/semester; next class or enrollment action if blocked | Today's schedule; enrollment status; compact attendance summary; latest released grades; pending requests; announcements | Next class opens offering detail. Attendance reports recorded counts, not a policy-derived risk score. No grades yet is different from unreleased grades; do not expose staff drafts. No full history on dashboard. |
| Academic | Today's classes with next class and attendance needing action | Assigned classes; pending grade submissions; announcements | Start attendance for a selected meeting. Counters include only assigned/authorized offerings. No classes assigned: term context + contact assignment owner, not an empty grade editor. |
| Admissions & Records | Work queue with selected task filter and oldest/due work | Compact actionable counts; current queue rows; deadlines and scoped recent activity | Filters: applications awaiting review, documents awaiting verification, DCAT scheduling pending, results awaiting release, accepted applicants, enrollment queue, COE pending, COR pending. Prefer a count/filter strip over eight giant cards. Open next record, never auto-approve it. |
| Operations — maintenance example | Assigned to Me queue with priority and location | Open Tickets, High Priority, Resolved Today as compact filters; recent task changes | Only authorized facilities data. Resolve is a detail action requiring completion note under Q11. No employee statistics for maintenance accounts. |
| Operations — administration example | Current AY/semester and configuration/announcement actions allowed to this person | Active students, employees, programs only if permitted; recent approved configuration changes | Counts are optional context, not the purpose. Users with combined grants get grouped task lists, not a merged wall of unrelated metrics. |
| Technology | Technical items requiring attention with severity and state | System/backup status; security events and failed sign-ins; active/disabled account counts; recent audit activity | Only regions allowed by technical grants. Unknown/unavailable monitoring is labeled; never claim healthy or successful backup without evidence. No academic record widgets. |

## Shared dashboard decisions

One dominant action follows the current task; reading a result or checking today's classes can be the purpose without an artificial CTA. Announcements appear below actionable personal work except an urgent, appropriately targeted institutional notice. Notification urgency requires explicit editorial policy (Q14).

Queue order is **V1 ASSUMPTION Q17**: due date where one is assigned, then oldest pending. Show why an item is prioritized; do not infer deadlines. Filter counts may overlap across workflow dimensions and must not be added into a misleading total.

No data means an intentional instruction: no application → begin application; no class today → show next scheduled class if known; cleared queue → “No items match this queue”; no technical access → access-help. Network errors offer Retry and retain visible scope. Stale data is marked and sensitive actions must revalidate current state before confirmation.
