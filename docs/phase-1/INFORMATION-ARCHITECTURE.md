# Information architecture

## People, memberships and scope

| Person / purpose | Portal membership | Permitted information boundary |
|---|---|---|
| Prospective applicant exploring college | None | Published public information only |
| Applicant completing admission | Applicant | Own application, schedules, released result and enrollment progress |
| Student following current academics | Student | Own enrollment, classes, attendance, released grades and requests |
| Faculty teaching assigned classes | Academic | Assigned offerings, rosters, meetings and grade work |
| Coordinator / academic leadership | Academic | Separately assigned management scope; no automatic institution-wide access |
| Admissions / Registrar staff | Admissions & Records | Assigned processing functions and campus/program/record scope |
| Service, employee, facilities or administration staff | Operations | Only separately granted modules and records |
| Account/security/system staff | Technology | Assigned technical functions; no automatic grade, admission or employee-record authority |

Conceptual access: Person → account → explicit portal memberships → fine-grained action permissions + record scope. An employee profile alone confers no access. View, edit, submit, approve and release are different authorities. Every future protected read, download and mutation needs backend authorization, including direct URLs and object-level access. Routes and hidden menus are not enforcement.

An Academic + Technology account is possible only through explicit assignments. Switching preserves the selected portal's boundaries and does not combine privileges into one menu. Revoked membership or scope must remove access even in an already-open page; explain loss of access without exposing protected data.

## Institutional information

| Campus in current project model | Programs | Major structure |
|---|---|---|
| Main Campus — Talon III | BSA — Bachelor of Science in Accountancy; BSBA — Bachelor of Science in Business Administration | BSBA: Financial Management, Marketing Management, Human Resource Management |
| IIT / CAA Campus | BSIS — Bachelor of Science in Information Systems; CpE — Computer Engineering | None specified in this brief |

Campus, program, major and their relationships are configured data. Forms show available valid choices from that information; never infer campus from a program code. Changes must not relabel historical records silently. Curriculum version is visible where it explains student progress (Q04).

Academic browsing context: Academic Year → Semester → Campus → Program → Curriculum → Year Level → Subject → Course Offering → Section → Faculty Assignment → Student Enrollment. This is a conceptual navigation hierarchy, not a database containment prescription: a subject can appear in multiple offerings. A subject describes the curriculum item; an offering describes its actual term, section, meeting time, room and faculty. Class links use the offering context, not subject code alone.

## Identity and lifecycle

Person may have Applicant Profile and Student Profile. Application history remains linked and available to authorized Records staff after student creation; it is not overwritten with a student record.

Applicant ID is issued when an application is created. **V1 ASSUMPTION Q01:** creating the first saved draft creates the application; the submission receipt repeats its existing ID. Student ID is created only after admission and progression into enrollment; exact checkpoint is Q02. Neither ID generator is specified here. Student username remains `surname_studentid`, for example `silverio_2027-03-0127`; future normalization and collision handling are unresolved.

Journey: Prospective → Applicant → Application Submitted → Document Submission Scheduled → Documents Verified → Eligible for DCAT → DCAT Scheduled → Exam Taken → Passed / Not Qualified. Passed → For Enrollment → Registrar Document Submission → COE Issued → COR Issued → Enrolled → Active Student → Graduating → Graduated.

This journey is not one giant editable status selector. Application, requirement, exam, enrollment and student standing each retain their own status and history. The dashboard summarizes the current actionable milestone. A scheduled exam is not evidence of attendance; an account activation is not evidence of enrollment. Not Qualified stops the passing branch; do not invent an appeal, retake or interview process. Later standing changes need authorized policy, not automatic date-based promotion (Q18).

## Public shell

Institution name/placeholder branding → public navigation → page content → contact/help footer. Home communicates programs, admission process and current published notices. Apply Now is the primary task; Applicant Login is secondary. A general Portal Login link reaches the same login page for other users. Public announcements contain no personal schedules, applicant lists or results.

## Authenticated shell

Desktop: top header (roughly 60–72px guidance), left sidebar (roughly 220–260px guidance), main content. Header contains institution, current portal, notifications and user menu. Main content has breadcrumb when nested, page title/context, primary action and task content. No decorative KPI strip shared indiscriminately across portals.

User menu: Profile, Account Settings, Switch Portal only for multiple memberships, Sign Out. Shared staff profile/settings use portal-local routes. Notifications link to an authorized destination and show unread/read state; sensitive details are kept out of previews. No email/SMS delivery is specified.

## One global login

Portal dropdown: Applicant, Student, Academic, Admissions & Records, Operations, Technology; never Public. Applicant Login may preselect Applicant but selection grants nothing. Identity label/help changes with context: Applicant ID or registered email; Student username (`surname_studentid`); staff institutional username/email. Password, show/hide password and account-help link remain consistent.

Select portal → enter credentials → authenticate → check account status → check requested portal membership → load scoped permissions → requested permitted destination or dashboard. Prevent duplicate submission while checking. Keep portal choice on recoverable errors; do not retain a displayed password after a completed failure/navigation.

| Outcome | UX |
|---|---|
| Invalid credentials | “We could not sign you in with those details.” Do not reveal whether an account exists. |
| Authenticated, membership absent | “You do not have access to this portal.” Offer own available portals if permitted, or sign out/help; never auto-grant access. |
| Activation required / disabled account | After identity verification, show appropriate next step without displaying sensitive administrative reasons (Q12). |
| Network failure | “Sign-in could not be completed. Try again.” Preserve non-secret input. |
| Session expires during task | Explain expiry, require sign-in and recheck destination permissions; do not promise unsaved work was saved. |
| Authenticated but specific resource forbidden | Access unavailable with permitted back destination; no record title/details leaked. |

**V1 ASSUMPTION Q12:** applicants use an activation flow associated with registration; staff/student accounts are system-issued. Exact recovery and activation mechanics remain future policy/technical work. Account Settings covers account security preferences only, not self-service membership grants. Profile edits to authoritative identity information require a defined correction channel (Q19).
