# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

- Responsive full-stack web application.
- Preferred frontend direction for implementation: Next.js, React, TypeScript, and Tailwind CSS, using reusable components and a shared design system.
- Use Next.js server capabilities initially unless the technical architecture phase finds a meaningful reason for a separate backend.
- Preferred database direction: PostgreSQL. The ORM and database-access architecture remain open decisions for the technical architecture phase.
- The future system requires authentication, portal membership, role-based access, fine-grained permissions, protected resources, object-level authorization, and audit logging.
- Phase 1 is Information Architecture and UX Blueprint only. Do not begin production implementation unless explicitly instructed.

## Users

Applicants and current students are the primary end users. Staff portals support and operate the workflows they depend on.

Confirmed user groups:

- Applicants and prospective students
- Current students
- Academic staff, including faculty, program coordinators, and academic leadership
- Admissions and Records staff
- Operations staff
- Technology and IT staff

## Product Purpose

The DFCAMCLP Integrated Student & Employee Portal centralizes fragmented academic and administrative workflows into one role-based institutional system for Dr. Filemon C. Aguilar Memorial College of Las Piñas.

For applicants, it supports the journey from application through physical document submission, DCAT, enrollment, COE, COR, and creation of a student account. For students, it brings together schedules, subjects, grades, attendance, enrollment information, documents, requests, announcements, academic progress, and account information. For staff, it provides controlled operational tools for class management, applicant processing, admission, enrollment, records, announcements, employee operations, and account administration.

Success means that each user can understand their current status, complete the next permitted step, and access the information or operational queue appropriate to their role.

## Positioning

This is not a generic school-management dashboard. It is modeled around DFCAMCLP's public-college context and institution-specific workflows: free tuition, Las Piñas residency requirements, two campuses, the DCAT admission process, physical document submission, separate Applicant and Student identities, COE and COR enrollment milestones, campus- and program-aware information, role-separated portals, fine-grained authorization, mobile-friendly applicant and student journeys, and staff-oriented operational queues.

The system must not inherit unnecessary private-school tuition or accounting assumptions.

## Operating Context

Confirmed admission and enrollment workflow:

Application → physical document schedule → physical requirements submission → verification → DCAT eligibility → DCAT schedule → DCAT examination → result → enrollment → Registrar document submission → COE → COR → enrolled student

There is no admission interview stage. Do not add one.

Known institutional structure:

- Main Campus — Talon III: BSA and BSBA, with Financial Management, Marketing Management, and Human Resource Management programs.
- IIT / CAA Campus: BSIS and Computer Engineering / CpE.

Campus and program relationships should eventually be data-driven rather than hardcoded into UI logic.

Authenticated portal groups are Applicant, Student, Academic, Admissions & Records, Operations, and Technology. Public pages do not require authentication. One account may have multiple portal memberships only when explicitly granted.

## Capabilities and Constraints

- Phase 1 covers product structure, navigation, workflows, dashboards, UX patterns, responsive behavior, and low-fidelity wireframes.
- The portal selector never grants authorization. The server must verify that the authenticated user may enter the selected portal.
- Applicant and Student identities are separate. An Applicant ID is created with the application; a Student ID is created only after admission and progression into enrollment.
- The confirmed student username convention is `surname_studentid`, for example `silverio_2027-03-0127`.
- The exact Student ID generation algorithm remains undecided.
- DFCAMCLP has free tuition. Do not build a traditional tuition or accounting system.
- Known student payments are limited to ID and uniform payments. Internal financial processes remain unknown.
- Unknown institutional policies must be labeled `V1 ASSUMPTION`, not presented as confirmed facts.
- Applicant and Student portals must be strongly mobile-friendly. Staff portals may use denser desktop layouts where appropriate but must remain responsive.
- Avoid decorative dashboards, random analytics charts, excessive animation, unnecessary complexity, glassmorphism-heavy design, giant gradients, and generic admin-template patterns.

## Brand Commitments

- Working name: **DFCAMCLP Integrated Student & Employee Portal**.
- Do not imply that the project is officially commissioned, endorsed, or deployed by DFCAMCLP unless that becomes true.
- Official branding is not frozen. Do not invent official logo variants, seals, institutional colors, or typography.
- Use placeholders during UX work when official assets are absent.
- Confirmed product qualities: modern, institutional, trustworthy, calm, clean, accessible, professional, and student-friendly.
- Primary content principle: **CONTENT > DECORATION**.

## Evidence on Hand

- The admission and enrollment workflow is based partly on firsthand student experience and is confirmed for the current project scope.
- The known student payments of ID and uniform fees are based on firsthand experience.
- No official logo, seal, color palette, typography, commissioned-project evidence, deployment evidence, or other production brand assets are present in the repository.
- No testimonials, benchmarks, institutional claims, or unknown policies may be fabricated.

## Product Principles

1. Model the real DFCAMCLP lifecycle and terminology instead of generic education-software conventions.
2. Make status, next steps, and responsibilities clear for every role.
3. Treat authorization as a server-enforced security boundary, independent of portal navigation controls.
4. Prioritize accessible, mobile-friendly applicant and student journeys while supporting efficient staff operations.
5. Keep content and workflow clarity ahead of decoration or speculative features.

## Accessibility & Inclusion

Target WCAG 2.2 AA-quality UX from the beginning. Design for keyboard navigation, visible focus indicators, clear labels, sufficient contrast, logical headings, accessible validation and error messages, status communication beyond color alone, usable touch targets, readable typography, responsive layouts, screen-reader-friendly structure, and unambiguous action labels.
