# Open policy questions and replaceable assumptions

Owners below are proposed consultation owners, not verified institutional titles or authority assignments. These are not blockers to documenting Phase 1; they must be resolved before implementing the affected policy. Each assumption is independently replaceable without changing the portal families.

| ID | Question / proposed owner | V1 ASSUMPTION and replacement boundary |
|---|---|---|
| Q01 | When does an application exist; applicant ID format; draft retention and duplicate applications? Admissions + Technology | First saved draft creates Applicant ID; submission repeats it. Draft save/resume is allowed. Replace creation checkpoint and draft policy; no ID algorithm fixed. |
| Q02 | Exact Student ID format and creation checkpoint? Registrar + Technology | Create after Registrar verification during enrollment; preserve applicant link. YEAR-EXAMDAY-PANGILAN remains an undecided idea, not an algorithm. |
| Q03 | Physical/DCAT schedule assignment, capacity, conflicts, rescheduling and missed appointments? Admissions | Staff assignment; show only confirmed dates/rooms and updated form. Replace scheduling rules; no invented penalty or self-booking. |
| Q04 | Curriculum ownership/versioning, progression, majors and equivalent subjects? Academic leadership + Registrar | Version per program/year/semester; display recorded completion only. No eligibility engine or automatic year promotion. |
| Q05 | Section assignment, subject enrollment, exact COE/COR sequence, signatories, corrections and enrollment completion authority? Registrar | Manual sections; internal preparation steps; COE then COR then authorized Enrolled. Document format and fulfillment remain unset. |
| Q06 | Grade scale, formula, special values, deadlines, reviewer, approver, releaser and correction process? Academic leadership + Registrar | Final grade only; configurable validation; draft → submitted → optional review → explicit release. Lock after submission; no numeric scale or complex formula invented. |
| Q07 | Meeting definition, attendance policy, late thresholds, incomplete saves, corrections and locking? Academic leadership | Present/Late/Absent; unmarked is not absent; save incomplete work with warning. No sanctions or attendance risk calculations. |
| Q08 | ID/uniform payment handling and responsible office? Operations + Registrar | No payment collection or ledger in V1; any future instructions require confirmed policy. No enrollment payment gate. |
| Q09 | Request catalog, routing, approval, fees, SLA, collection/download and cancellation? Registrar + Student Services | Records owns academic-document requests; Operations owns assigned non-academic services. Keep a small catalog and explicit fulfillment instructions. |
| Q10 | Who may grant which memberships/permissions; self-edit restrictions, approval and emergency access? Technology + institutional authority | Scoped administrators review before/after grants with reasons and confirmation; no universal superuser business access. Exact safeguards must be settled before implementation. |
| Q11 | Ticket reporters, priorities, assignment, reopening and room ownership? Facilities | Simple submitted/pending → in progress → completed ticketing; no SLA/asset management. |
| Q12 | Applicant registration vs system-issued accounts; activation/recovery, existing-account linking, Applicant membership retention? Technology + Admissions/Registrar | Registration initiates access; staff/student provisioning is system-issued. Show activation/pending states; never mandate duplicate accounts or erase applicant history. |
| Q13 | Required form fields, residency evidence, document validation, consent and retention? Admissions + designated privacy/policy owner | Known physical checklist only, configurable item requirements and staff notes; no upload substitute or invented consent statement. |
| Q14 | Announcement audience composition, public publication, urgency, edits and historical visibility? Authorized communications owners | Explicit scoped audience and publication preview. Public visibility is separate from Institution audience; no automatic external delivery. |
| Q15 | Available health/backup/integration data and developer operational authority? Technology | Informational status pages only when evidence exists; advanced controls deferred. |
| Q16 | Exam attendance recording, result entry, release/correction authority, and official outcome wording? Admissions | Prepare internally and release separately; applicant sees Passed / Not Qualified only. No raw score, appeal, retake or interview workflow. |
| Q17 | Queue priority, reports, export scope and data retention? Relevant office + privacy/policy owner | Due date if assigned, then oldest pending; basic scoped lists. Bulk exports need explicit policy. |
| Q18 | Active, graduating, graduated and other standing transitions? Registrar | Show authorized recorded standing; no auto-transition from dates or curriculum percentages. |
| Q19 | Profile/application corrections and submitted-record editing rights? Admissions/Registrar + Technology | Submitted records read-only with a contact/correction path until rules are defined; distinguish display preferences from authoritative identity data. |
| Q20 | Employee directory visibility, department assignments and profile ownership? Operations | Basic employee identity and assignment only; no HR case records, payroll or broad private directory access. |

## Conflicts discovered and smallest adjustments

| Conflict | Why it matters | Recommendation used in blueprint |
|---|---|---|
| ID on application creation vs flow placing ID after Submit | Could create two identifiers or block draft tracking | Q01: create on first saved application; show again on receipt. |
| Lifecycle says Failed; result requirement says Not Qualified | Inconsistent student-facing outcome | Use Not Qualified in UX; treat Failed as brief synonym, not a second outcome. |
| Self registration vs system-issued account statement | Could wrongly require manual issuance before Apply | Q12: registration initiates applicant access; system-issued Student/staff accounts remain; exact activation open. |
| Student creation order vs COE/COR and account activation | Account existence might be mistaken for official enrollment | Q02/Q05: keep identity, membership and enrollment milestones separate. |
| DCAT Results and Admission Results | Could duplicate unpublished and published outcomes | Same conceptual result, separate preparation and release queue views. |
| Records and Operations both process requests | Conflicting ownership and duplicate fulfillment | One assigned office per request type; Records for academic documents provisionally. |
| PRODUCT.md calls BSBA majors “programs” | Misrepresents the institution's configured hierarchy | Preserve PRODUCT.md; this blueprint follows the supplied brief: three majors under BSBA. |
| PRODUCT.md lists preferred implementation stack | Could be read as a Phase 1 final decision | Preserve preferences; make no framework/technical selection here. |
| Download DCAT Form listed as navigation | Creates an unnecessary page and inconsistent action | Keep a labeled download action on Exam Schedule. |

## Recommended V1 scope restraint

Retain all requested portal families and conceptual destinations, but defer executable migrations, feature-flag editing, backup restoration and integration configuration until validated technical operations needs exist. Keep developer/system views informational and permission gated; hide unavailable destinations instead of seeding fake data.

Defer elaborate HR, maintenance escalation, report builders and attendance/grade analytics. Keep employee identity, simple optional maintenance tickets and scoped operational reports only. No tuition/accounting, payments, LMS, library system, payroll, AI, file-upload workflow or external notification integration is added. These recommendations do not silently remove requested navigation from the blueprint.
