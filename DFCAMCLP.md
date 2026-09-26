# DFCAMCLP — Project Source of Truth

_Last updated: 2026-09-26_

## Purpose

This file is the **single source of truth for DFCAMCLP-specific facts and project rules** used by the unofficial DFCAMCLP Integrated Student & Employee Portal concept.

Future milestones, phases, fixtures, UI copy, database seeds, routes, and documentation should read this file before inventing or duplicating institution data.

If another project file conflicts with this file, use this priority:

1. Newest explicit user correction
2. This `DFCAMCLP.md`
3. Current project/product documentation
4. Older milestone documentation
5. Generic assumptions

When a new verified fact changes something here, **update this file instead of creating a second conflicting source**.

---

# 1. Project Disclaimer

The portal project is:

- an **unofficial mock / concept project**
- for learning, portfolio, and demonstration
- not commissioned by DFCAMCLP
- not affiliated with DFCAMCLP
- not endorsed by DFCAMCLP
- not intended to process real student, applicant, employee, or school records

All demo identities and records must be fictional.

Recommended disclaimer:

> Unofficial concept project for educational and portfolio purposes. Not affiliated with or endorsed by DFCAMCLP.

---

# 2. Institution Identity

**Full name:** Dr. Filemon C. Aguilar Memorial College of Las Piñas  
**Common abbreviation:** DFCAMCLP  
**Institution type:** Local / city-funded public college in Las Piñas City  
**Tuition context:** Publicly described as tuition-free / free college education for qualified Las Piñas students  
**Year established:** 1998

The project should use the institution name respectfully but must never imply that the portal is official.

---

# 3. Canonical Campus Model

The project recognizes **two campus groups only**.

## 3.1 Main Campus

**Canonical display name:** Main Campus  
**Institution context:** DFCAMCLP  
**Known location reference:** Golden Gate Subdivision, Brgy. Talon III / Talon Tres, Las Piñas City

### Programs

- **BSA** — Bachelor of Science in Accountancy
- **BSBA** — Bachelor of Science in Business Administration

### BSBA majors

These are **majors under BSBA**, not independent degree programs:

- Financial Management
- Marketing Management
- Human Resource Management

## 3.2 IIT Campus

**Canonical display name:** IIT Campus  
**Institution unit:** Institute of Information Technology

### Programs

- **BSIS** — Bachelor of Science in Information Systems
- **BSCpE** — Bachelor of Science in Computer Engineering

### Naming rule

User-facing UI must say:

> IIT Campus

Do **not** display:

> IIT / CAA Campus

Older/internal project identifiers such as `IIT_CAA` may remain temporarily in code/database migrations if changing them would create unnecessary migration churn, but they must represent the **same single IIT campus**, not a second campus.

The exact current official street-address wording for IIT should be treated as **not yet frozen for this project**. Older references use CAA/Pulang Lupa terminology, while other public references use Dandelion Street / Doña Manuela / Pamplona III. Do not invent or hardcode an unverified public address.

---

# 4. Canonical Program Registry

There are **four degree programs in the current project model**.

| Campus | Canonical Code | Program |
| --- | --- | --- |
| Main Campus | BSA | Bachelor of Science in Accountancy |
| Main Campus | BSBA | Bachelor of Science in Business Administration |
| IIT Campus | BSIS | Bachelor of Science in Information Systems |
| IIT Campus | BSCpE | Bachelor of Science in Computer Engineering |

## Critical deduplication rule

**BSIS exists exactly once.**

Correct:

```text
IIT Campus
└── BSIS — Bachelor of Science in Information Systems
```

Incorrect:

```text
BS Information Systems
BSIS — Information Systems
```

Those are not two programs.

Likewise:

- full name + abbreviation must not create duplicate program rows
- public label + internal code must not create duplicate program rows
- the same program must not exist under both campuses unless explicitly verified in the future

## BSBA normalization rule

The following are **majors**, not separate top-level programs:

```text
BSBA
├── Financial Management
├── Marketing Management
└── Human Resource Management
```

Do not seed them as independent degree programs.

## Computer Engineering naming

Preferred public display:

> Bachelor of Science in Computer Engineering (BSCpE)

Existing internal code such as `CPE` may remain if already embedded in the schema, but it should map to this one program and must not create a second Computer Engineering record.

---

# 5. Admissions — Known Project Flow

The current project models incoming freshman admission as:

```text
Prospective Applicant
↓
Online Application
↓
Scheduled Physical Document Submission
↓
Requirements Verification
↓
Eligible for DCAT
↓
DCAT Scheduling
↓
Download / View DCAT Form
↓
Take DCAT
↓
Result
├── Passed → Enrollment
└── Not Qualified / Failed → End of current flow
```

## Important: no interview

The known admission process used for this project has **NO interview stage**.

Do not add:

- interview scheduling
- interview result
- interviewer notes
- interview approval

unless a future verified source explicitly changes the project rule.

---

# 6. Admission Eligibility — What We Know

Current project understanding:

- applicants are expected to be **Las Piñas residents**
- an academic eligibility threshold exists
- applicants take the **DFCAMCLP College Admission Test (DCAT)**
- admission involves physical document submission/verification

## What is NOT frozen

The exact current GWA/grade threshold is **not verified enough to hardcode as a source-of-truth rule**.

An older/reference screenshot mentions **83%**, but the portal must **not treat 83% as official** until it is explicitly verified.

Do not invent:

- exact grade cutoff
- admission quota
- DCAT passing score
- percentile
- ranking formula
- automatic admission formula

---

# 7. Known Admission Documents

The project currently recognizes these as known/representative physical admission requirements:

- Grade 12 report card / Form 138 / school card
- Good Moral Certificate / Certificate of Good Moral Character
- PSA birth certificate
- proof of Las Piñas residency

This list should be treated as **known but not guaranteed exhaustive**.

Do not silently add extra official requirements just to make the UI look complete.

## Physical-document rule

The known process is based on **physical submission/verification**.

Do not automatically create:

- document-upload systems
- OCR
- digital document approval
- cloud document storage

unless the project scope explicitly changes.

---

# 8. DCAT

**DCAT** is the college admission examination used in the project.

Known process:

1. Applicant becomes eligible after the required admission steps.
2. A DCAT schedule becomes available.
3. Applicant can view/download a DCAT form containing scheduling information.
4. Schedule may include:
   - date
   - time
   - room
   - campus
5. Applicant takes the examination.
6. Result becomes available later.

The user's firsthand process included school announcements indicating when schedules/results were available, after which the applicant checked the portal.

## Do not invent

- passing score
- score breakdown
- exam ranking
- interview after DCAT
- grading formula

---

# 9. Enrollment — Incoming Student Flow

Current project flow after passing DCAT:

```text
Passed
↓
For Enrollment
↓
Registrar Physical Document Submission / Verification
↓
COE Issued
↓
COR Issued
↓
Enrolled
↓
Active Student
```

This is a simplified project representation, not a claim that every internal office step is documented.

## COE / COR

**COE:** Certificate of Enrollment  
**COR:** Certificate of Registration

For this project:

- initial COE/COR issuance belongs to the enrollment experience
- later additional-copy requests may appear under Student Requests
- sample/demo COE/COR documents must always be marked as non-official

Do not build an official document generator unless future scope explicitly requires it.

---

# 10. Continuing-Student Enrollment Context

Public registrar material indicates that continuing-student enrollment can involve:

- online pre-enrollment/registration
- later in-person processing
- COR issuance
- official enrollment being completed only after required face-to-face steps

The exact process may vary by campus, year level, and academic year.

Do not turn one semester's public announcement into a permanent universal workflow.

---

# 11. Tuition and Finance Boundary

DFCAMCLP is treated in this project as a **city-funded, tuition-free local college**.

Therefore:

- there is no dedicated tuition billing portal in the current V1 scope
- do not invent tuition balances
- do not invent assessment fees
- do not invent payment gateways
- do not invent scholarship-balance workflows

The user has personally encountered non-tuition items such as ID/uniform payments, but the exact current official fee structure is not known.

Therefore:

> no tuition does not mean "no possible non-tuition charges," but the project must not invent fee amounts or finance workflows.

---

# 12. Applicant ID vs Student ID

Applicant identity and Student identity are separate.

## Applicant

Receives an **Applicant ID** during the admissions lifecycle.

## Student

Receives a **Student ID** only after the admissions/enrollment transition.

Rules:

- Applicant ID != Student ID
- do not show Student ID to someone who is still only an Applicant
- do not reuse Applicant ID as Student ID
- do not freeze a production ID-generation algorithm without verification

The application architecture may use internal UUIDs as technical primary keys while keeping human-facing IDs separate.

---

# 13. Person / Identity Continuity

Project architecture treats one human as one central `Person`.

Conceptually:

```text
Person
├── Applicant Profile
├── Student Profile
└── Employee Profile
```

When an Applicant becomes a Student:

- preserve the same Person identity
- do not create a duplicate human record
- Applicant and Student profile records may both remain historically meaningful
- Applicant ID and Student ID remain separate identifiers

This is a **portal architecture rule**, not an assertion about DFCAMCLP's existing real software.

---

# 14. Student Username Concept

Current project concept:

```text
surname_studentid
```

Example shape only:

```text
silverio_2026xxxx
```

This is a project UX/authentication concept.

It is **not confirmed as an official DFCAMCLP username convention**.

Current implemented authentication may still use email/password internally.

---

# 15. Academic Structure — Project Model

The portal architecture uses:

```text
Academic Year
↓
Semester
↓
Campus
↓
Program
↓
Curriculum
↓
Year Level
↓
Subject
↓
Course Offering
↓
Section
↓
Faculty Assignment
↓
Student Enrollment
```

## Critical distinction

**Subject != Course Offering**

Example:

```text
Subject:
IS 203 — Systems Analysis

Course Offering:
IS 203
AY 2026–2027
1st Semester
BSIS-2A
Faculty: Demo Faculty
```

Do not collapse these concepts.

---

# 16. Academic Rules That Are Only V1 Assumptions

The following are **product/demo assumptions**, not verified school policy:

- sections are manually assigned by Admissions & Records
- curriculum is versioned by program/year/semester
- faculty enters final grades
- no complex grading formula is modeled yet
- attendance statuses are Present / Late / Absent
- employee profile is basic
- announcements may target Institution / Campus / Program / Section / Class

Do not present these assumptions as official DFCAMCLP policy.

---

# 17. Grading

Known for the demo:

- Faculty-facing UI may enter representative final grades.
- Student-facing UI may display released/pending final grades.

Unknown:

- official grade calculation formula
- weighting of prelim/midterm/finals
- exact passing threshold
- official GWA/GPA rules
- retention rules
- honor rules

Do not invent these.

---

# 18. Attendance

Current demo vocabulary:

- Present
- Late
- Absent

Unknown:

- official attendance threshold
- automatic failure rules
- excused-absence policy
- disciplinary consequences

Do not present demo attendance calculations as official policy.

---

# 19. Applicant / Student Lifecycle Used by the Project

Current conceptual lifecycle:

```text
PROSPECTIVE
↓
APPLICANT
↓
APPLICATION SUBMITTED
↓
DOCUMENT SUBMISSION SCHEDULED
↓
DOCUMENTS VERIFIED
↓
ELIGIBLE FOR DCAT
↓
DCAT SCHEDULED
↓
EXAM TAKEN
↓
PASSED / NOT QUALIFIED
↓
FOR ENROLLMENT
↓
REGISTRAR DOCUMENT SUBMISSION
↓
COE ISSUED
↓
COR ISSUED
↓
ENROLLED
↓
ACTIVE STUDENT
↓
GRADUATING
↓
GRADUATED
```

This is the portal's lifecycle model.

Do not assume every label matches the real institution's internal terminology.

---

# 20. Transferees / Cross-Enrollees

Current project scope does **not** model:

- transferee admission
- cross-enrollment

Do not invent those workflows.

This should be treated as a current project boundary, not a permanent claim about every future DFCAMCLP policy, unless verified later.

---

# 21. Portal Families — Project Architecture Only

The concept portal uses six authenticated portal groups:

1. Applicant
2. Student
3. Academic
4. Admissions & Records
5. Operations
6. Technology

These are **project information-architecture groups**, not claims that DFCAMCLP officially organizes its offices this way.

## Meaning

### Applicant
Admissions journey and enrollment transition.

### Student
Academic self-service, enrollment documents, requests, announcements, calendar.

### Academic
Faculty and program-coordinator teaching workflows.

### Admissions & Records
Applicant processing, DCAT, enrollment, student records, COE/COR.

### Operations
Compressed project area for Student Services, Employees/HR, Facilities, and school administration.

### Technology
Accounts, access, security, system/developer tools.

---

# 22. Authorization Rule

Selecting a portal at login does **not** grant access.

The project enforces:

```text
Authenticated Account
↓
Explicit Portal Membership
↓
Role
↓
Permission
↓
Allowed Route
```

Example:

```text
Student account
→ Student portal ✅
→ Technology portal ❌
```

This is portal architecture, not an official DFCAMCLP production IAM policy.

---

# 23. Operations Scope Boundary

Operations is intentionally lightweight.

Current concept may represent:

- Student Services
- Employees
- Facilities
- Administration

Do not automatically build:

- full HRIS
- payroll
- procurement
- asset-management platform
- enterprise maintenance platform

unless scope explicitly expands.

---

# 24. Technology Scope Boundary

Technology may represent:

- accounts
- portal membership
- roles/access
- system status
- developer/demo tools

Do not imply these are real DFCAMCLP internal systems.

---

# 25. UI / Branding Source of Truth

The portal uses visual identity inspired by the provided school seal.

## Canonical brand-source colors

**Blue:** `#0D13CD`  
**Yellow:** `#FCDF00`

These are supporting accents, not dominant page surfaces.

UI foundation:

```text
neutral/light canvas
+ white/light structured surfaces
+ dark typography
+ restrained blue interaction
+ restrained yellow highlights
+ semantic status colors
```

## Green rule

Green is semantic success only.

It is not a primary brand color.

## Campus photography

The provided real campus photograph is used as the public homepage hero background.

The provided seal/logo must be used without:

- recoloring
- distortion
- recreation
- unnecessary repetition

---

# 26. Canonical Public Naming

Use these user-facing names consistently:

| Concept | Canonical Display |
| --- | --- |
| Institution | DFCAMCLP |
| Main campus | Main Campus |
| IT campus | IIT Campus |
| Accountancy | BSA — Bachelor of Science in Accountancy |
| Business Administration | BSBA — Bachelor of Science in Business Administration |
| Information Systems | BSIS — Bachelor of Science in Information Systems |
| Computer Engineering | BSCpE — Bachelor of Science in Computer Engineering |
| Admission exam | DCAT |
| Certificate of Enrollment | COE |
| Certificate of Registration | COR |
| Admissions/registrar portal | Admissions & Records |

Avoid switching between multiple labels for the same thing without a reason.

---

# 27. Hard Data Rules for Future Milestones

Future agents must obey these rules:

1. **Never create duplicate BSIS records.**
2. Never treat `BS Information Systems` and `BSIS` as different programs.
3. Never treat BSBA majors as top-level programs.
4. Never put BSIS under Main Campus.
5. Never put BSA/BSBA under IIT Campus.
6. Never create a second IIT campus because an old identifier says `IIT_CAA`.
7. Public UI says **IIT Campus**.
8. Applicant ID and Student ID must remain distinct.
9. Do not add an interview stage.
10. Do not add tuition billing.
11. Do not invent a DCAT cutoff.
12. Do not invent official grading formulas.
13. Do not invent official attendance thresholds.
14. Do not invent additional academic programs.
15. Do not use real student/applicant/faculty records.
16. Unknown school policy must stay unknown until verified.

---

# 28. Database / Fixture Normalization Rules

When seeding or building demo data:

## Campus

Exactly one Main Campus entity.

Exactly one IIT Campus entity.

Legacy internal `IIT_CAA` may map to IIT Campus but must not create another campus.

## Programs

Exactly:

```text
MAIN
├── BSA
└── BSBA
    ├── Financial Management
    ├── Marketing Management
    └── Human Resource Management

IIT
├── BSIS
└── BSCpE
```

## Unique program identity

A program should be identified by a stable canonical internal code/ID.

Display-name variants must not create new rows.

Example:

```text
BSIS
Bachelor of Science in Information Systems
BS Information Systems
```

must resolve to **one program entity**.

---

# 29. Data-Correction Rule

When the app shows a duplicate or conflicting DFCAMCLP fact:

1. Stop adding more fixture data.
2. Check this file.
3. Identify the canonical entity.
4. Remove/merge the duplicate.
5. Update seed/demo fixtures.
6. Update tests to prevent recurrence.
7. Update this file only if the canonical truth itself changed.

For the currently discovered issue:

> The duplicate BSIS listing is a data/fixture error. There must be only one BSIS program, under IIT Campus.

---

# 30. Known Unknowns / Open Questions

Do not guess these.

- exact current freshman academic/GWA threshold
- exact exhaustive freshman document checklist
- official current DCAT cutoff/scoring
- exact current IIT address wording to publish
- official preferred code/capitalization for BSCpE vs internal `CPE`
- production Applicant ID format
- production Student ID format
- username collision rules
- official section-assignment policy
- official curriculum data
- official grading computation
- official attendance policy
- exact current employee/department structure
- official non-tuition fees
- permanent policy on transferees/cross-enrollees
- exact internal approval path for COE/COR
- full official organization chart
- whether all portal concepts map to real school offices

If a future milestone depends on one of these, either:

- keep it clearly marked as a demo assumption, or
- verify it before freezing it.

---

# 31. Verified Public Reference Notes

Public references currently support the following broad facts:

- DFCAMCLP was established in 1998.
- Main Campus is associated with Golden Gate Subdivision, Talon III/Tres, Las Piñas.
- Main Campus offers Accountancy and Business Administration-related programs.
- DFCAMCLP is city-funded and publicly described as tuition-free/free college education for Las Piñas students.
- BSIS was publicly introduced as an Institute of Technology program.
- Current public-facing school/registrar material also references BSCpE students/graduates.
- Continuing-student enrollment announcements show online pre-enrollment followed by in-person COR-related processing.

These references are supporting evidence, not permission to invent details that are not stated.

---

# 32. Rule for Future AI / Codex Work

Before any future DFCAMCLP milestone:

> Read `DFCAMCLP.md` first.

When generating:

- fixtures
- seed data
- program lists
- campus filters
- applicant forms
- dashboards
- navigation
- public copy
- documentation

use this file instead of reconstructing school facts from memory.

If code disagrees with this file:

> flag the conflict before expanding the feature.

If a new user correction is given:

> update `DFCAMCLP.md` so later milestones inherit the correction.

---

# Canonical Snapshot

```text
DFCAMCLP
│
├── Main Campus
│   ├── BSA
│   └── BSBA
│       ├── Financial Management
│       ├── Marketing Management
│       └── Human Resource Management
│
└── IIT Campus
    ├── BSIS
    └── BSCpE
```

Admissions:

```text
Application
→ Physical Document Submission
→ Verification
→ DCAT
→ Results
→ Enrollment
→ COE / COR
→ Active Student
```

No interview.

No duplicate BSIS.

No invented programs.

No invented policy.
