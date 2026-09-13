# Proposed route map

These are UX page addresses only, not API endpoints or authorization rules. `:id`, `:offeringId` and similar markers denote opaque record references, not ID-format decisions. All protected pages/downloads require membership, action permission and record scope checks later. Routes below exhaust the navigation in [Portal navigation](PORTAL-NAVIGATION.md).

| Area | Routes and destination labels |
|---|---|
| Public | `/` Home; `/programs` list; `/programs/:id` detail; `/admissions`; `/campuses`; `/campuses/:id`; `/announcements`; `/announcements/:id`; `/about`; `/contact`; `/apply` applicant registration; `/login`; `/account/activate`; `/account/help` |
| Applicant application | `/applicant/dashboard`; `/applicant/application` form/review; `/applicant/application/status`; `/applicant/requirements` physical checklist/schedule |
| Applicant DCAT | `/applicant/dcat` Exam Schedule with Download Form action; `/applicant/dcat/results` own released result |
| Applicant enrollment | `/applicant/enrollment` progress; `/applicant/enrollment/registrar-schedule`; `/applicant/enrollment/coe`; `/applicant/enrollment/cor` |
| Applicant notices | `/applicant/announcements`; `/applicant/announcements/:id` |
| Student academics | `/student/dashboard`; `/student/schedule`; `/student/subjects`; `/student/subjects/:offeringId`; `/student/grades`; `/student/attendance`; `/student/curriculum-progress` |
| Student enrollment | `/student/enrollment`; `/student/enrollment/cor`; `/student/enrollment/coe` |
| Student requests and calendar | `/student/requests`; `/student/requests/new`; `/student/requests/:id`; `/student/announcements`; `/student/announcements/:id`; `/student/calendar` |
| Academic teaching | `/academic/dashboard`; `/academic/classes`; `/academic/classes/:offeringId`; `/academic/schedule`; `/academic/rosters`; `/academic/classes/:offeringId/roster` |
| Academic attendance | `/academic/attendance` class/meeting selector; `/academic/classes/:offeringId/meetings/:meetingId/attendance` |
| Academic grades | `/academic/grades` encoding class selector; `/academic/classes/:offeringId/grades`; `/academic/grades/submissions`; `/academic/grades/history` |
| Academic management | `/academic/management/classes`; `/academic/management/faculty-load`; `/academic/management/grade-review`; `/academic/management/grade-review/:id` |
| Academic notices | `/academic/announcements`; `/academic/announcements/new`; `/academic/announcements/:id` |
| Records admissions | `/records/dashboard`; `/records/applicants`; `/records/applicants/review`; `/records/applicants/:id`; `/records/requirements`; `/records/submission-scheduling`; `/records/dcat` scheduling; `/records/dcat/results` preparation; `/records/admission-results` release/history |
| Records students | `/records/students`; `/records/students/:id`; `/records/students/accepted`; `/records/students/account-creation`; `/records/students/status` |
| Records enrollment | `/records/enrollment`; `/records/enrollment/:id`; `/records/enrollment/sections`; `/records/enrollment/subjects`; `/records/enrollment/registrar-scheduling`; `/records/enrollment/coe`; `/records/enrollment/cor` |
| Records academic records | `/records/academic-records` enrollment history; `/records/academic-records/grades`; `/records/requests`; `/records/requests/:id`; `/records/reports` |
| Records notices | `/records/announcements`; `/records/announcements/new`; `/records/announcements/:id` |
| Operations services | `/operations/dashboard`; `/operations/student-services/requests`; `/operations/student-services/processing`; `/operations/student-services/requests/:id`; `/operations/student-services/concerns`; `/operations/student-services/concerns/:id` |
| Operations employees | `/operations/employees` directory; `/operations/employees/:id` profile; `/operations/employees/department-assignments` |
| Operations facilities | `/operations/facilities/tickets`; `/operations/facilities/tickets/new`; `/operations/facilities/tickets/:id`; `/operations/facilities/rooms`; `/operations/facilities/tasks` |
| Operations administration | `/operations/administration/campuses`; `/operations/administration/programs`; `/operations/administration/academic-years`; `/operations/administration/semesters`; `/operations/administration/announcements`; `/operations/administration/announcements/new`; `/operations/administration/announcements/:id`; `/operations/administration/calendar` |
| Technology accounts | `/technology/dashboard`; `/technology/accounts/users`; `/technology/accounts/users/:id`; `/technology/accounts/activation`; `/technology/accounts/password-reset`; `/technology/accounts/memberships`; `/technology/accounts/permissions` |
| Technology security | `/technology/security/login-activity`; `/technology/security/audit-logs`; `/technology/security/events` |
| Technology system | `/technology/system/health`; `/technology/system/integrations`; `/technology/system/backups`; `/technology/system/configuration` |
| Technology developer | `/technology/developer/version`; `/technology/developer/errors`; `/technology/developer/environment`; `/technology/developer/migrations`; `/technology/developer/feature-flags` |

For each prefix `applicant`, `student`, `academic`, `records`, `operations`, `technology`, add `/{prefix}/profile` and `/{prefix}/account-settings`. These user-menu destinations do not appear twice in the sidebar. Protected announcement creation is shown only where publishing is granted; all viewing is audience-scoped.

Queue destinations can use term, campus, program, stage and page filters without inventing additional pages. Static labels such as `new` or `accepted` are reserved destinations, never record identifiers. Document download is an action from an authorized document page, not a new top-level page. Unknown/unavailable routes return a safe not-found/access-unavailable state without record disclosure. Approved login return destinations must remain inside permitted portal scope.
