# Core user flows

Screen names resolve through [Route map](ROUTE-MAP.md). W01–W24 refer to [Wireframes](WIREFRAMES.md). Status terms follow [Shared patterns](SHARED-UX-PATTERNS.md). Every staff transition requires its specific action permission and record scope; successful sign-in alone is insufficient. Confirmation is not evidence that a save succeeded: show success only after the authoritative result is known.

## F01 — Applicant registration and submission

Prospective person: Public Home (W01) → Apply / Registration (W03) → activation/account-access instructions (Q12) → Application Form (W04) → review summary → confirm Submit → receipt with existing Applicant ID → Applicant Dashboard (W05).

**V1 ASSUMPTION Q01:** first saved application draft creates the Applicant ID, visible before submission; the receipt repeats it. Registration collects only account-contact information; the application collects institutional application information without asking twice. Draft save/resume is provisional Q01. Required fields, consent text and residency evidence depend on Q13; never invent official legal wording. Submitted form is read-only pending a defined correction process (Q19).

Validation links to specific labeled fields and preserves entries. Failed save keeps the form and warns that changes are unsaved. Uncertain submission offers status recheck before retry to avoid duplicate applications. Existing-account handling uses non-enumerating guidance to sign in or recover; duplicate-person resolution is an authorized staff process, not automatic identity merging.

## F02 — Physical requirements

Records Submission Scheduling → select submitted applicant → assign date/time/location/instructions → confirm schedule → Applicant Requirements (W06) + Dashboard next action → applicant physically attends with report card, Good Moral Certificate, PSA Birth Certificate and residency-related evidence → authorized staff Requirements Verification → review each item → record verification → Documents Verified → Eligible for DCAT.

Physical delivery is not a portal upload or applicant self-verification. Applicant reads checklist and staff findings; only authorized staff verifies. **V1 ASSUMPTION Q13:** item-level Pending/Verified plus a factual “Needs attention” note supports missing/inadequate documents without declaring the whole application rejected. Missing requirements keep the applicant at this stage with next instructions. Rescheduling records the replaced schedule and surfaces the current one; no invented no-show penalty (Q03).

## F03 — DCAT schedule, exam and result

Records DCAT Scheduling (W19) → filter eligible applicants → select applicant(s) → choose configured date/time/campus/room → review assignment → confirm → Applicant Dashboard notice → DCAT Schedule (W07) → Download DCAT Form → physical exam → authorized staff records exam participation/result readiness → DCAT Results preparation → Admission Results release queue → authorized release confirmation → Applicant Results (W08).

The form carries Applicant ID/name, selected program, campus, exam date/time/room. Keep a current schedule/version indication; download failure offers Retry and readable schedule details. No public result list or raw scores. Before release, show “Results not yet available,” never the unpublished outcome. Published result is Passed or Not Qualified. Passed links to Enrollment Progress; Not Qualified presents neutral next-contact guidance without invented appeals. Public “results available” notices never substitute for an individual release check.

**V1 ASSUMPTION Q03:** staff assigns schedules; capacity/conflict checks need configured constraints and show conflicts before confirmation. A changed assignment invalidates the prior form visibly. Exact exam attendance recording and result correction/re-release authority are Q16; never infer Exam Taken merely because the date passed.

## F04 — Applicant becomes a student

Passed result → Applicant Enrollment Progress (W09) → Registrar schedule → physical Registrar submission → Records Enrollment Detail verifies prerequisites → authorized Student Record creation (W21) links applicant history → Student Account Creation handoff → secure activation instructions → Global Login with explicitly assigned Student membership → Student Dashboard (W10).

**V1 ASSUMPTION Q02:** identity creation follows Registrar verification; Student access may initially show enrollment in progress. Activation does not mark Enrolled. Do not silently add Student membership on a Passed result. Do not discard Applicant history or reuse Applicant ID as Student ID. Existing person/account is checked by authorized staff to prevent duplicates. Membership retention and whether activation uses an existing login are Q12; UX must support a handoff without claiming a second account is mandatory. Failed provisioning shows pending attention to staff and a clear waiting state to the person.

## F05 — Enrollment and initial documents

For Enrollment → Registrar Schedule → physical submission → Records Enrollment Queue (W20) → applicant's Enrollment Detail → Registrar verification → section assignment → subject enrollment → COE issuance → COR issuance → authorized enrollment completion → Applicant/Student Enrollment Progress shows Enrolled.

**V1 ASSUMPTION Q05:** staff manages section/subject steps within the enrollment workbench; their precise relation to COE/COR must be confirmed. Known visible sequence remains COE then COR, then Enrolled. Initial documents appear under Enrollment; do not require an additional-copy request. Staff sees prerequisites, current state and issuance history before confirming issuance. No tuition/payment gate is added. Failure leaves the milestone uncompleted and provides Retry/status check. A revised document must not silently replace issuance history; correction/reissue procedure is Q05.

## F06 — Student class access

Student Dashboard (W10) → My Schedule (W11) → selected meeting/offering → My Subject / Class Detail → current term, subject code/title, section, faculty, room and meeting schedule. My Subjects is the alternate entry; Curriculum Progress links completed/current curriculum items to available records without claiming graduation eligibility (Q04).

Student scope is own enrolled offerings; no editable enrollment or faculty roster controls. No class today shows the next known meeting or an honest empty state. Unassigned room/faculty says “Not yet assigned.” Term changes keep context visible. Attendance opens recorded statuses; Grades (W12) shows only released final grades (F09), not teacher drafts.

## F07 — Faculty attendance

Academic Dashboard (W13) → Assigned Classes → Class Detail (W14) → choose Class Meeting → Attendance (W15) → mark Present/Late/Absent → review unmarked rows → Save → saved time and recorded status summary.

**V1 ASSUMPTION Q07:** no student is marked Present by default; unmarked means not recorded, not Absent. Save permits explicitly identified unmarked rows with a completeness warning; finalization/locking policy stays open. Meeting date/class remain prominent. Lost connection keeps unsaved edits visibly pending; leaving prompts to discard or stay. A conflicting newer record requires refresh/reconciliation, not silent overwrite. Post-save correction rights/history are Q07.

## F08 — Grade encoding and submission

Assigned Class → Grade Encoding (W16) → enter final grade per enrolled student → Save Draft → validate → review summary → Confirm Submit Grades → submission receipt/status → Submission History.

**V1 ASSUMPTION Q06:** only final grades are entered; permitted values come from confirmed grading policy later. Do not invent scales, formulas, weights or automatic passing judgments. Validation identifies missing/invalid entries according to configured rules, not a hardcoded numeric range. Submission is distinct from saving. Submission confirmation identifies offering, term and affected roster; success becomes Submitted and editing is Locked pending authorized correction procedure. Failure preserves draft and does not show Submitted. No force-submit override is designed.

## F09 — Grade review and release

Submitted grades → authorized Grade Review if required → review detail → approve or return with reason where policy allows → authorized Release confirmation identifying class/term → released grades visible in Student Grades (W12).

**V1 ASSUMPTION Q06:** keep review as a replaceable stage; if no review is required, an explicitly authorized release still separates internal submission from student visibility. Release is a publication condition, not a synonym for approval. Reviewer scope does not grant editing of submitted values by default. Returned work reopens only through a permitted correction transition with history; student sees no unreleased values. Concurrent change or failed release requires a status recheck; never announce release prematurely.

## F10 — Additional student document request

Student New Request → choose approved request type (for example extra COE copy) → explain purpose/fulfillment instructions → review → Submit → My Requests detail/timeline → Records Document Requests → assigned processor begins work → completes fulfillment → student sees Completed and approved collection/download instructions.

**V1 ASSUMPTION Q09:** academic documents route to Records; non-academic services route to permitted Operations staff. Status: Submitted → In Progress → Completed, with Cancelled/Rejected only when policy allows and a reason is shown. Completion requires an actual fulfillment instruction, not merely a clicked button. No fee, SLA or delivery mode is promised. Failure preserves input; pending duplicate request warning links to the existing request rather than silently creating another.

## F11 — Announcement creation

Authorized staff Announcements → Create → title/body and publication details → choose Institution/Campus/Program/Section/Class audience within assigned publishing scope → preview audience description and content → Confirm Publish → published detail → eligible users' announcement lists.

**V1 ASSUMPTION Q14:** audience selection is explicit; broad institution/public publication requires a separate grant. Preview counts only if available and permitted. An institution audience does not automatically mean public website publication. Reject empty or out-of-scope audiences. Failure retains Draft; publish confirmation must not claim delivery through email/SMS. Subsequent membership/affiliation rules and correction/unpublish policy remain Q14.

## F12 — Maintenance ticket

Authorized reporter → New Maintenance Ticket → location/category/description → Submit → Operations Maintenance queue → authorized dispatcher assigns → assignee sees Assigned Tasks → starts In Progress → completion note → Resolve → ticket shows Completed (“Resolved” action/event).

**V1 ASSUMPTION Q11:** minimal ticket workflow only; priority is assigned by authorized staff and no SLA is invented. Reporter sees own ticket; assignee sees assigned scope. Missing room can use a location description. Save failure retains entered details; unavailable assignee leaves ticket Pending rather than fabricating assignment. Reopen/escalation/cancellation are unresolved. Not a core academic gate.

## F13 — Account administration

Technology Users → select account (W24) → inspect status and explicit memberships/scoped grants → choose permitted change → review before/after scope, affected portal and reason → confirm → result + audit event → refreshed account detail.

Membership and permissions are separate controls; adding membership must not mean “all permissions.” Grant administration itself has a bounded scope (Q10). Disable Account has its own confirmation and consequences; it does not delete person, applicant or academic history. Reset Password invokes the approved recovery flow, never shows a password. Last-admin protection, self-change rules and elevated approval policy remain Q10. Failed/concurrent change leaves old state visible with a recheck action and never reports an audit event as successful without evidence. Business data authority is not granted merely by entering Technology.
