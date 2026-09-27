# Phase 4 — Product and design context

Status: **LOCKED for planning — P4-M1 documentation only.** 27 September 2026.

This is the master context for Phase 4. It records the intended product, constraints, and decision process; it does not claim that the specified refinements are implemented. P4-M2 has not started. A roadmap entry is not authorization to execute that milestone.

## Purpose and quality target

Refine the existing DFCAMCLP portal into a coherent, credible institutional concept that professors and faculty administrators can evaluate. Users should understand their location, the information shown, the next permitted action, and the outcome of that action without explanations from a developer.

The locked direction is **Modern Civic + Premium Academic + Restrained Product Software**: professional, intentional, clear, trustworthy, modern, and meticulously designed. Public pages communicate institution identity; authenticated pages support tasks. Functional clarity takes priority when decoration competes with usability. Visual craft and functioning interactions both matter; neither compensates for failure in the other.

Avoid generic school dashboards, flashy SaaS templates, glassmorphism, neon/cyberpunk treatments, excessive rounding, decorative metrics, and lifeless database screens. Preserve the approved light canvas, white surfaces, dark text, restrained blue/yellow brand accents, school seal, and campus photograph. This is refinement of the current product, not a replacement design.

**Production-plausible means reviewable workflows and honest boundaries, not production readiness.** Phase 4 does not turn browser-only school workflows into authoritative records, establish institutional affiliation, or authorize processing real personal information. A future production build needs separate policy, resource authorization, persistence, privacy, operations, and security work.

## Read order and authority

Implementation agents must read, in order:

1. [DFCAMCLP.md](../../DFCAMCLP.md).
2. This document.
3. [P4-DESIGN-SYSTEM.md](P4-DESIGN-SYSTEM.md).
4. [P4-UX-RULES.md](P4-UX-RULES.md).
5. [P4-ROADMAP.md](P4-ROADMAP.md).
6. Relevant milestone and feature documentation, followed by the actual source.

The [manual audit](PHASE-4-MANUAL-AUDIT.md) is the primary record of the user's Phase 4 findings. It is an input to these locks, not an instruction to implement all findings immediately. Its disposition is exhaustively mapped in the roadmap.

Authority when sources disagree:

| Subject                                       | Authority                                                                                                    |
| --------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| Current scope and explicit corrections        | Latest explicit user instruction; P4-M1 is documentation only                                                |
| Institution facts                             | `DFCAMCLP.md`; a clearly verified new user correction must be recorded there through an authorized amendment |
| Phase 4 visual values and patterns            | `P4-DESIGN-SYSTEM.md`                                                                                        |
| Phase 4 behavior and information architecture | `P4-UX-RULES.md`                                                                                             |
| Milestone ownership and audit disposition     | `P4-ROADMAP.md`                                                                                              |
| Current implementation and feasibility        | Current source plus attributed test/browser evidence                                                         |
| Historical intent                             | PRODUCT.md and Phase 1–3 documents, subject to the above                                                     |

Do not treat an example or tentative manual-audit suggestion as a verified institution correction. In particular, its annual-cycle dates, document expansion, and automatic failure proposal remain unresolved. Its three-font suggestion is superseded by the latest maximum of two families. Its public display-title request is accepted for M3; internal Employee terminology and schema are preserved.

Historical documents remain useful but contain stale statements: PRODUCT.md describes an early phase and missing branding assets; the former Impeccable login brief describes a provisional green palette; early Phase 1 navigation lists capabilities not implemented in Phase 3. Those statements do not authorize restoring green branding, adding imagined routes, or rebuilding authentication. These four files supersede conflicting Phase 4 design guidance without rewriting the historical records.

## Existing strengths to preserve

- Seven frontend families exist: Public/Login, Applicant, Student, Academic, Admissions & Records, Operations, and Technology. Their task-oriented organization is already usable.
- Real authentication and server-enforced membership/role/route checks are separate from frontend demo workflows. The portal selector grants no access.
- The public site has a genuine campus image, supplied seal, concise program presentation, and a clear admissions journey.
- Applicant and Student views prioritize personal next steps. Academic class work and staff queues already have working sample interactions.
- Native dialog navigation, visible focus, labels, status words, semantic content, responsive lists, and reduced-motion styles provide a foundation to extend.
- Institution fixtures have a canonical two-campus/four-program model. Technology obtains fictional account counts through a restricted database query and does not simulate live system health.
- Existing tests and milestone records make regression checks possible. Historical passes are evidence of past runs, not current acceptance.

## Systemic weaknesses and evidence

| ID  | Finding                                           | Evidence and implication                                                                                                                                                                                            | Owner           |
| --- | ------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------- |
| O1  | School seal absent in authenticated header        | Public/login use the supplied asset; `AppShell` uses text identity only. Extend the shared identity pattern.                                                                                                        | M2              |
| O2  | Page headers vary                                 | Shared PageHeader, StudentPageHeader, AcademicPageHeader, and Records heading markup differ. Normalize one pattern and migrate consumers.                                                                           | M2              |
| O3  | Spacing and type vary between families            | Feature CSS contains different panel gaps, header widths, and intermediate type sizes. Consolidate by semantic role rather than blanket replacements.                                                               | M2              |
| O4  | Demo notices vary or are absent                   | Applicant control strip, Student text, Academic pill, Records right-aligned caption, Operations yellow notice, and Technology local explanations differ. Use a shared compact notice with truthful variants.        | M2              |
| O5  | Some actions resemble ordinary text               | Academic dashboard actions and staff row links have inconsistent underline/border treatment. Separate navigation from state changes.                                                                                | M2              |
| O6  | Selected record/class context is subordinate      | Teaching/Students stays the main title while the selected entity appears lower down. Establish a contextual header contract in M2; wire entity-specific content in M5.                                              | M5              |
| O7  | Operations summaries are cramped on small screens | School Admin dashboard rendered two narrow summary columns at 375px. Use content-driven stacking, verified at 375 and 768.                                                                                          | M6              |
| O8  | Reported session loss not reproduced              | **Previously reported; not reproduced during P4-M1 Student-session verification.** Student → public homepage → browser Back returned to the authenticated Student profile. Do not prescribe authentication changes. | M3 verification |

The manual audit additionally identifies public content/CTA redundancy, account-entry/recovery needs, Applicant scenario placement, Student time/history coverage, Academic announcement presentation, Records search/filter coverage, Operations status semantics, Technology usefulness, and profile/name refinements. These are page-specific work with separate owners in the roadmap.

### Inspection provenance and limits

The preceding read-only P4-M1 browser inspection used the running local application and existing fictional accounts. It covered `/`, `/programs`, `/admissions`, `/about`, `/login`; Applicant dashboard/application; Student dashboard/academics/calendar/profile; Academic dashboard/Teaching/selected IS 203 offering/announcements; Records dashboard/students/selected record; Operations School Admin dashboard/facilities; and Technology IT Admin dashboard/security/system.

Most public, Applicant, Student, Academic list, and Records views were inspected at desktop width. Additional samples included a Records detail and Operations dashboard at 375×812, and Facilities, Technology, and selected Academic class at 768×900. This was **not** a full route-by-three-viewports acceptance matrix. The Technology drawer closed on Escape and restored trigger focus. No new Coordinator, Maintenance-only, or Technology Developer browser pass was performed in P4-M1; their source and prior milestone evidence were consulted. No new regression-suite run, screen-reader test, formal contrast audit, or production certification is claimed.

Browser observations are retained here as an attributed baseline; no new screenshot archive was written during that inspection. Source review also confirmed that login already has Show/Hide, Records already has Program/Year filters, and its three student fixtures span two programs while the applicant fixture covers all four. Do not misreport these as wholly missing capabilities or missing canonical programs. The inspected login page states that activation/recovery are unavailable; it does not expose working registration/recovery forms. The audit's “UI exists” description is therefore not evidence that these flows only need enabling.

## Architecture and implementation philosophy

Extend `src/components/ui/`, `src/components/portal/`, and the existing Tailwind/token foundation in `src/app/globals.css`. Preserve the public `SiteShell`/`SiteHeader` and existing feature families. Do not create a parallel component library or theme engine. Use narrowly scoped shared recipes where a wrapper would add no value; remove obsolete duplicate rules when migrating consumers.

The protected dynamic layout and catch-all page continue to enforce `requirePortal` and `requirePortalPath`. Current query-selected details (`offering`, `record`, `ticket`, and related views) do not require a new route hierarchy to gain better orientation. Styling changes must not alter permission filtering or expose hidden modules.

Phase 3 demo providers keep school workflow changes in React memory; refresh resets them. Authentication is database-backed. Technology's account directory is read-only database data. Do not apply a universal “changes reset” claim to live account data, or imply that sample actions update the school.

Build shared presentation in M2, then apply page-specific content/interaction refinements in M3–M6. Keep identity relationships, query parameters, established controls, and working behavior unless the authorized milestone explicitly changes them. Fixture refinements must update related consumers coherently; cosmetic work must not silently change business rules.

Before future code edits, read the relevant installed Next.js guides in `node_modules/next/dist/docs/` as required by AGENTS.md. Inspect current Git state and preserve unrelated work. No styling-only package additions, route renames, database resets, deployments, commits, or pushes are implied by this plan.

## Institution and workflow invariants

`DFCAMCLP.md` owns the exact facts; do not create a second factual registry here. Preserve these critical constraints when applying it:

- Main Campus: BSA and BSBA; BSBA majors remain nested. IIT Campus: one BSIS and one BSCpE. No duplicate BSIS or second IIT campus.
- Admissions uses DCAT and physical document submission. No interview, invented passing score, grade cutoff, requirement list, or tuition billing.
- Applicant ID and Student ID are separate; one Person can retain both profiles. Account creation, enrollment, document issuance, and portal access are distinct events.
- A subject is distinct from a course offering. Sample curriculum and final-grade/attendance displays are not official calculations or eligibility rules.
- The institution is represented respectfully as an unofficial educational/portfolio concept. Do not imply commission, endorsement, institutional deployment, or a school-owned copyright claim.
- Use only explicitly fictional identities and records. The manual audit's name list is a source of sample names, not permission to identify real people.

## Known assumptions, unknowns, and gates

| ID  | Decision or unknown                                  | Locked treatment and amendment owner                                                                                                                                                                                                                                   |
| --- | ---------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| U1  | Duplicate applicant identity and repeat applications | M3 may design an in-memory duplicate demonstration. Email equality does not establish one human. Real identity matching, concurrency/idempotency, and cross-cycle eligibility require product plus backend/security decisions.                                         |
| U2  | Annual admission cycles and deadlines                | Annual-cycle UI is a labeled prototype proposal. January/April/May 2027 are illustrative, not school dates. User must approve the cycle model before M4 models it; no automatic failure or reapplication eligibility policy is authorized.                             |
| U3  | Account creation starts an application               | Accept as a proposed demo entry experience, not an implemented transaction or official issuance checkpoint. M3 owns entry handoff; M4 owns application draft/cycle presentation. Backend creation/rollback/ID policy needs a separate specification.                   |
| U4  | Expanded requirements, ID photo, digital attachments | Canonical physical requirements remain authoritative. ID-photo and extra document requirements are unverified. No digital admissions upload workflow; require verified policy and an explicit scope amendment.                                                         |
| U5  | Student verification and staff provisioning          | COR/COE verification and other-role contact-admin flows are demo guidance only. Exact owner, evidence, privacy, and authority are unresolved. They must never grant membership automatically.                                                                          |
| U6  | Recovery channels                                    | Applicant email recovery and non-applicant admin-ticket recovery are requested UX directions. Identity checks, mail delivery, ticket ownership, rate limits, and recovery security require separately authorized backend work.                                         |
| U7  | Historical copy and media                            | M3 must verify each new historical event with attributable sources; 1998 is available in the canonical file. Do not fill a timeline with guessed milestones. Imagery provenance, usable rights, and real replacement assets remain to be established.                  |
| U8  | Profile-photo storage                                | M4 can demonstrate local, temporary preview with file limits and clear disclosure. No server upload, persistent photo storage, real photo collection, or identity verification is authorized. Staff profile redesign beyond existing views requires a scope amendment. |
| U9  | Technology additional content                        | M6 may surface only repository-backed details permitted to that role. New logs, monitoring, health claims, grant editors, recovery tools, or system actions need separate backend scope.                                                                               |
| U10 | Official academic and administrative policy          | Curriculum, grading/GWA, attendance consequences, section assignment, quotas, fees, organization chart, and unresolved canonical facts remain unknown or labeled V1 ASSUMPTION. No refinement agent may settle them.                                                   |

Unresolved does not mean “choose something plausible.” Complete independent approved work, preserve the affected working behavior, and stop the conflicting part. Name the missing decision and its impact. The user/product owner approves lock amendments; institution-policy claims also require verification recorded in the canonical source. This is not a request for approval on routine implementation choices already covered by the locks.

## Implementation-agent governance

All implementation models, including lower-capability models, must follow the same constraints:

1. Identify the authorized milestone and its acceptance criteria before editing. Read the locks in order and inspect the relevant source and rendered baseline.
2. Do not create a competing design system, reinterpret the visual direction, invent institution facts, randomly change fonts/spacing, redesign navigation independently, add packages for taste, or silently supply missing UX policy.
3. Reuse an existing component or token when it fits. If it cannot express the required behavior, propose the smallest extension at its shared owner; do not patch every page independently.
4. When the specification is incomplete but covered by a locked pattern, use that pattern and document the choice. Do not escalate ordinary label wrapping, existing-token selection, or implementation mechanics.
5. For a genuine conflict: **preserve working behavior → document the conflict and affected audit ID → stop that conflicting part → request a lock/context amendment**. Continue unaffected authorized work. Never silently override governance.
6. Record an approved amendment once in its owning document, with date, reason, affected audit IDs, and downstream acceptance updates. Link to it rather than duplicating competing rules.
7. Report exactly what changed, what was tested, and what remains blocked. A source/build pass is not rendered acceptance; historical tests are not current tests. Never report an unimplemented backend as complete.
8. Stop at the milestone boundary. P4-M7 is not blanket authority to finish deferred backend work or deploy the project.

## Final Phase 4 success criteria

Phase 4 can pass as a **concept release candidate** when the authorized milestones meet their acceptance criteria, all manual findings have explicit dispositions, the shared visual/UX system is consistently applied, and no material cross-portal regression remains. Public and authenticated surfaces must feel related; tasks, entity context, action hierarchy, statuses, and demo boundaries must be clear at 375×812, 768×900, and 1440×900.

Verify keyboard/focus/reflow/reduced-motion behavior, representative workflows and role restrictions, canonical data integrity, applicable regression suites, lint, typecheck, formatting, build, and diff hygiene. Record any known environment or unrelated formatting blocker without treating it as a pass. Retain deferred items and policy gates in the handoff. No claim of formal WCAG certification, production approval, or real institutional use follows from this milestone.

## P4-M1 sources and completion boundary

Read: `DFCAMCLP.md`, `PRODUCT.md`, `README.md`, the manual audit, Phase 1 shared UX/responsive/navigation/architecture guidance, Phase 2 authentication/access-control/portal-shell/visual foundation documentation, and all seven Phase 3 milestone reports. Source feasibility was checked against the shared shell/primitives, feature headers/notices/CSS, login, route dispatch, Records fixtures, Operations status mapping, and Technology read-only views.

Impeccable was used for context and bounded design review guidance. Its context loader ran during the preceding audit; its stale historical surface brief does not override the user or canonical facts. No CSS/component implementation or mechanical UI detector pass belongs to this documentation-only milestone.

Reference-study conclusions are attributed in the design-system document. They are pattern inputs, not school facts or a claim that reference-site visual screenshots were reviewed. The earlier implementation brief is superseded by the current planning-only instruction. P4-M1 delivers exactly the four lock documents; the manual audit is preserved unchanged.
