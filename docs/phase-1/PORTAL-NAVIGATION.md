# Portal navigation

Menus expose permitted destinations, not all possible product capabilities. Empty groups disappear. No-permission controls are omitted; a permitted action blocked by workflow state remains explainable (for example, “Available after verification”). Deep links still require future backend enforcement. Every portal has the shared user menu in [Information architecture](INFORMATION-ARCHITECTURE.md).

## Public

Home · Programs · Admissions · Campuses · Announcements · About · Contact. Apply Now is a primary CTA; Applicant Login a secondary CTA. Portal Login is a utility link to the same global login. Program detail shows campus and majors; admissions explains physical submission, DCAT and enrollment without invented dates or requirements.

## Applicant

- Dashboard
- Application: Application Form; Requirements; Application Status
- DCAT: Exam Schedule; Results
- Enrollment: Enrollment Progress; Registrar Schedule; COE; COR
- Announcements

Download DCAT Form is an action within Exam Schedule, rather than a separate empty navigation page. Application Status and Enrollment Progress show timeline context. Future stages remain visible as explanatory destinations, with “Not yet available” and the prerequisite; never show an invented schedule or result. Profile and Account Settings are in the user menu.

## Student

- Dashboard
- Academics: My Schedule; My Subjects; Grades; Attendance; Curriculum Progress
- Enrollment: Enrollment Status; COR; COE
- Requests: New Request; My Requests
- Announcements
- Calendar

My Subjects lists enrolled offerings for the selected term; subject detail includes offering context. Curriculum Progress shows version and recorded completion, with no invented degree-audit rules. Initial documents live under Enrollment; additional-copy requests start under Requests. User menu includes Profile and Account Settings.

## Academic

- Dashboard
- Teaching: Assigned Classes; Class Schedule; Class Rosters
- Attendance
- Grades: Grade Encoding; Grade Submission; Submission History
- Announcements
- Academic Management, only for authorized leadership: Program Classes; Faculty Load; Grade Review

Rosters, attendance and grades are scoped to assigned offerings unless a separate management grant applies. Grade Submission collects ready drafts; Submission History is read-only traceability. Regular faculty do not see Academic Management. Read-only announcement access does not imply publish permission.

## Admissions & Records

- Dashboard
- Admissions: Applicants; Application Review; Requirements Verification; Submission Scheduling; DCAT Scheduling; DCAT Results; Admission Results
- Students: Student Records; Accepted Applicants; Student Account Creation; Student Status
- Enrollment: Enrollment Queue; Section Assignment; Subject Enrollment; Registrar Scheduling; COE Issuance; COR Issuance
- Academic Records: Enrollment History; Grades; Document Requests
- Announcements
- Reports

Application Review is a filtered work queue linked to the same applicant detail as Applicants. DCAT Results is staff result preparation; Admission Results is the release queue and publication history. This avoids two independent result sources (Q16). Student Account Creation initiates the authorized provisioning handoff; it grants no Technology permissions. Reports are scoped operational lists with approved export boundaries, not advanced analytics (Q17).

## Operations

- Dashboard
- Student Services: Student Requests; Request Processing; Student Concerns
- Employees: Employee Directory; Employee Profiles; Department Assignments
- Facilities: Maintenance Tickets; Rooms / Facilities; Assigned Tasks
- Administration: Campuses; Programs; Academic Years; Semesters; Announcements; Calendar

Each group and action needs its own grant and scope. A maintenance-only user sees Dashboard and permitted Facilities work only. Employee profiles start with basic identity and assignment, not payroll or private HR files. Administrative academic-period/program configuration does not authorize grade editing. Curriculum ownership remains Q04.

Student Requests and Request Processing are list/detail views of assigned service work. Records owns academic-document fulfillment; Operations sees only requests routed to its authorized services (Q09). One request should not be processed independently by both offices.

## Technology

- Dashboard
- Accounts: Users; Account Activation; Password Reset; Portal Memberships; Permissions
- Security: Login Activity; Audit Logs; Security Events
- System: System Health; Integrations; Backups; Configuration
- Developer, only with explicit developer grants: Application Version; Error Logs; Environment Status; Migrations; Feature Flags

Account grants do not imply security-log or developer grants. No impersonation, bulk destructive maintenance, backup restoration or executable migration controls are introduced. System/developer pages are informational destinations subject to data availability; operational automation is deferred (Q15). Password Reset initiates an approved recovery procedure; never displays existing passwords or recovery secrets.

## Navigation behavior

Use a small number of stable first-level groups; expand the current group and preserve the user's choice. Show a clear active page; breadcrumbs describe the current task, not every institutional dimension. Queue-to-detail back navigation restores term, campus/program filter and page position. Term context is visible on academic pages; changing it refreshes dependent data explicitly.

Switch Portal lists only assigned memberships, confirms leaving unsaved work, rechecks access and opens that portal's permitted dashboard. It does not transfer an open student's record into an unrelated portal. No membership/no enabled modules yields an access-help state, not a blank shell. Mobile navigation behavior is in [Responsive UX](RESPONSIVE-UX.md).
