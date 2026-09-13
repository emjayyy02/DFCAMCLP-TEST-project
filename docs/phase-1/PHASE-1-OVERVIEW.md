# Phase 1 — Information Architecture + UX Blueprint

DFCAMCLP Integrated Student & Employee Portal · 13 September 2026

Status: blueprint complete for review; institutional policy questions remain open. This is a project model based on the supplied brief and existing PRODUCT.md, not an assertion of official school approval or independently verified policy.

## Reading map and ownership

| Document | Owns |
|---|---|
| [Information architecture](INFORMATION-ARCHITECTURE.md) | People, authority, identity, shells, login and lifecycle |
| [Portal navigation](PORTAL-NAVIGATION.md) | Menu hierarchy and permission visibility |
| [Dashboards](DASHBOARDS.md) | Priorities and next actions |
| [User flows](USER-FLOWS.md) | Screen transitions, handoffs and recovery |
| [Route map](ROUTE-MAP.md) | Proposed page addresses; not authorization |
| [Shared patterns](SHARED-UX-PATTERNS.md) | Components, states, vocabulary and action semantics |
| [Responsive UX](RESPONSIVE-UX.md) | Device behavior, accessibility and visual intent |
| [Wireframes](WIREFRAMES.md) | 24 low-fidelity screen specifications |
| [Open questions](OPEN-QUESTIONS.md) | Replaceable assumptions, conflicts and policy owners |

## Decisions and limits

Public is unauthenticated. Six authenticated destinations are Applicant, Student, Academic, Admissions & Records, Operations and Technology. A portal selection expresses intent; explicit membership and scoped permissions determine access. No portal implies another portal's authority.

The admission journey preserves physical submission, DCAT, Registrar submission, COE and COR. There is no interview. Applicant and Student identities remain distinct and history survives conversion. Campus/program relationships are configurable institutional information.

All `V1 ASSUMPTION` references point to the question register. They are UX working choices, not policy commitments. Existing PRODUCT.md stack preferences remain untouched and are not finalized by this phase.

## Acceptance index

| Criteria from brief | Evidence |
|---|---|
| 1–3: shells, login, authorization | Information architecture: shells, entry and authority |
| 4–5: all navigation, permission behavior | Portal navigation + route map |
| 6: all dashboard priorities | Dashboards |
| 7–9: applicant, DCAT, enrollment | User flows F01–F05; wireframes 03–09, 18–20 |
| 10: student academics | F06; wireframes 10–12; Student navigation |
| 11: faculty attendance/grades | F07–F09; wireframes 13–16 |
| 12–14: Records, Operations, Technology | F02–F05, F10–F13; wireframes 17–24 |
| 15–16: patterns and vocabulary | Shared patterns |
| 17: responsive behavior | Responsive UX + each wireframe |
| 18: required wireframes | Wireframes 01–24 |
| 19: unknown policy | Open questions |
| 20: Phase 1 only | Documentation-only change set |

## Handoff boundary

Review the open policy register with the relevant school owners before translating affected workflows into technical contracts. This phase adds no application UI, framework decision, database schema, APIs, authentication implementation, storage, integrations or production permissions. No production behavior has been tested or claimed. Stop here until explicitly instructed to proceed.
