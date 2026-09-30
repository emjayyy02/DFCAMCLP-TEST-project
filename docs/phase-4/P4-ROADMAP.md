# Phase 4 — Roadmap and audit traceability

Status: **P4-M1 through P4-M6 complete; P4-FD1 PASS / COMPLETE; P4-FD2 PASS / COMPLETE; P4-FD3 next, NOT STARTED; P4-FD4 and P4-M7 NOT STARTED.** Updated 30 September 2026. This roadmap allocates work; only an explicit milestone instruction authorizes implementation. The [Final Visual Lock](P4-FINAL-VISUAL-LOCK.md) now owns the final frontend direction and explicitly supersedes the visual rules listed in its §12. [P4-DESIGN-SYSTEM.md](P4-DESIGN-SYSTEM.md) remains the historical foundation; [P4-UX-RULES.md](P4-UX-RULES.md) continues to own behavior. Institution facts remain in `DFCAMCLP.md`; product authority, evidence limits and U1–U10 gates remain in [PHASE-4-CONTEXT.md](PHASE-4-CONTEXT.md).

## Dependency and ownership model

Retain completed M1–M6 and the existing architecture, which already separates public/identity, shared shell/primitives, and six feature families. Insert the final frontend design sequence before M7. No framework or route reorganization is justified.

Sequence: **M1 → M2 → M3 → M4 → M5 → M6 → FD1 → FD2 → FD3 → FD4 → M7**. M4 established coherent demo identity/term changes before M5 consumed them in Academic/Records; M6 reused them. FD1 locks visual direction, FD2 establishes the shared visual foundation, and FD3/FD4 apply it to existing surfaces. This sequence is not permission to run ahead.

M2 owned shared contracts and shared adoption; M3–M6 owned feature data, copy and entity-specific interactions. Those implementation reports and A01–A55/O1–O8 dispositions below remain historical records. New visual findings V01–V13 are owned by FD2–FD4 as mapped in the [FD1 audit](P4-FD1-FINAL-VISUAL-AUDIT.md). M7 validates and adds bounded motion; it does not become a catch-all feature milestone. The FD sequence changes presentation only and does not reopen feature, fixture, policy or backend work.

## P4-M1 — Phase 4 Product & Design Lock-In

**Objective:** remove ambiguity for later implementation by locking direction, reusable patterns, boundaries, and audit ownership.

**Scope:** the four documents in this directory: context, design system, UX rules, roadmap. Read the manual audit, canonical institution source, current documentation/source, and retain the preceding read-only rendered findings.

**Dependencies:** completed Phase 3 frontend families; supplied manual audit; canonical institution rules; current read-only inspection.

**Findings addressed:** classify systemic versus page-specific findings, reconcile conflicting suggestions, qualify session evidence, and map every meaningful audit item.

**Implementation boundary:** documentation only. No React, CSS, fixtures, routes, schema, authentication, packages, or workflow changes. Preserve the supplied manual audit and historical source documents. Do not create the completion document from the superseded implementation brief.

**Deferred:** every application change; all M2–M7 execution; live account/recovery/upload/backend policy.

**Acceptance:** four internally consistent documents, complete audit disposition, explicit unresolved decisions, current-source feasibility, documentation formatting and diff checks, and confirmation that no application source changed. Regression suites/build are not required for prose-only changes and must not be reported as newly run.

## P4-M2 — Global Design Foundation

**Objective:** make the product use one coherent visual and navigation foundation before page-specific work.

**Scope:** central tokens/recipes; Button/Input/Select/Card/Badge/Alert/FormSection extensions; reusable PageHeader/context header, DemoNotice, identity/avatar fallback, table/list/toolbar and system-state presentation; AppShell seal, portal identity, active states, drawer/account controls, and neutral account/forbidden shell consistency. Normalize existing header/notice consumers across all families without rewriting their content/workflows. Apply shared link/interaction semantics and widths; establish distinct sort/filter presentation with a representative existing list. Add a reusable multi-field matching foundation only where needed, with explicit tests of semantics.

**Likely code owners:** `src/app/globals.css`, `src/components/ui/`, `src/components/portal/`, shared public/development identity components, and narrowly scoped feature header/notice/CSS consumers. Preserve the protected dynamic layout/catch-all guards. Do not relocate authorization to the browser.

**Dependencies:** M1 locks; installed Next.js docs before code; current baseline and clean accounting of local changes.

**Findings addressed:** typography/spacing drift, shared header/logo gaps, weak action affordance, inconsistent demo notices/status styling, common controls, navigation orientation contract, responsive primitives.

**Deferred:** public content redesign, registration/recovery flows, selected-entity data wiring, scenario/fixture changes, advanced Records search, Operations workflow changes, Technology expansion, scroll animation. Domain status mapping changes belong to each feature owner even though semantic colors are centralized here.

**Implementation boundary:** presentation and reusable interaction foundation. No schema, login/session, role/permission, school workflow, or canonical fixture changes. Do not enable a new route merely for navigation polish. A representative sort demonstration must use existing data and retain the owning feature's current default unless the feature milestone authorizes changing it.

**Acceptance:** shared headers/notices/actions visibly consistent; supplied seal present; portal logo routes correct; one active module; drawer keyboard behavior retained; all three viewport sizes sampled across the seven families; no page-level overflow; no third font/new styling package; old duplicate presentation rules removed where replaced. Run common implementation validation below, including auth/access regression because the shell is touched. Feature actions and demo state remain functional.

## P4-M3 — Public Website + Authentication & Account UX

**Objective:** improve public orientation and account-entry clarity while preserving working sign-in and honest demo boundaries.

**Scope:** homepage display title “Student & Staff Portal”; retain school background and both hero links, make Portal Sign In primary; remove Quick Access and redundant Explore the Portal section; concise researched institution description; compact program table; verified history timeline; restrained footer; login email example and accessible eye toggle refinement. Design clearly labeled applicant entry/duplicate-demo, staff provisioning/contact, and recovery concept states within the existing public/account architecture. Clarify public-to-authenticated return behavior without assuming a logout defect.

**Likely code owners:** `src/app/page.tsx`, public content pages/components, login/account pages, `src/features/identity/` presentation. Existing real login endpoint/configuration is preserved. Public-facing title alignment can include related header/footer/metadata, but not database/role terminology or a wholesale project rename.

**Dependencies:** M2; U1/U3/U5/U6 decisions for any behavior beyond a clearly labeled simulation; U7 sources for history/media. Account-entry screen structure must be reviewed in its implementation brief; no new backend endpoints are implied.

**Findings addressed:** audit §§1–4, public account guidance, reported session/navigation concern.

**Deferred:** actual public registration, global person deduplication/idempotency, recovery email delivery/admin ticket backend, auto-provisioning/membership, digital admissions uploads, automatic deadline outcomes. M4 owns the application/cycle destination; M7 owns scroll animation. AI background placeholders are deferred pending imagery/provenance approval; they must not masquerade as the actual campus or a historical event.

**Implementation boundary:** public content and frontend account UX only. Account creation can illustrate starting a demo application, not a successful persisted account. Student supporting-document validation cannot grant access. Recovery simulations never claim delivery. Do not invent historical events to reach a requested timeline length. Keep the unofficial notice; reject the school-owned “All rights reserved” claim absent authority.

**Acceptance:** public pages answer what/who/where with sourced facts; four canonical programs and nested BSBA majors remain correct; hero CTA order matches the audit; removed sections leave coherent navigation; history uses verified dates and fits approximately 1–2 desktop screens without padding/fabrication; login/password keyboard/autocomplete/error/pending behavior survives. Test portal logo → dashboard and portal → public → Back/Forward/reload for representative single- and multi-membership accounts. Record session outcomes; do not change authentication unless a defect is reproduced and scoped. Verify form simulations disclose their limits and cannot create real grants. Run common validation, especially auth/access suites.

## P4-M4 — Applicant + Student Refinement

**Objective:** make personal workflows easier to explore and present, with coherent fictional identity and academic history.

**Scope:** move Applicant preview scenarios into a clearly separated demo-tools area near navigation without hiding the active scenario or breaking mobile access; refine Applicant/Student profile layouts using M2 identity primitives; temporary local photo preview only if explicitly included in the milestone's implementation brief; Student calendar 12-hour AM/PM display; coherent 3rd-year/2nd-semester fictional Student history and term selection; synthetic curriculum labels; fictional naming update excluding Marvin. Propagate that demo person's name/term references to related Academic/Records/Operations fixtures as one coordinated data change. Preserve IDs and relationships.

**Likely code owners:** `src/features/applicant/`, `src/features/student/`, and their existing fixture consumers. Keep Applicant/Student providers' in-memory boundary; reuse shared primitives. M4 owns fixture consistency even when a small affected fixture lives in another family.

**Dependencies:** M2 and M3 entry-handoff specification; U2/U3 resolution before annual-cycle/application-start modeling; U4/U8 before any scope beyond physical checklist/local photo preview. Cross-feature identity/term dependency review before editing fixtures.

**Findings addressed:** audit §§5.1–5.2 and bonus names/profiles; page-specific personal refinement.

**Deferred:** canonical unknown subject lists, official grades/GWA/attendance policy, real enrollment, Student ID creation, official document generation, admissions uploads, persistent photo storage. Annual-cycle deadlines/automatic failure remain D2 unless amended. Do not add unavailable historical terms as if they contain authoritative grades.

**Implementation boundary:** fictional frontend scenarios. No schema, auth provisioning, academic result publication, official policy, or cross-user persistence. Local photo preview is not an admissions requirement. Staff profile expansion beyond existing views is deferred; M6 may reuse basic identity presentation.

**Acceptance:** scenario switching remains discoverable on desktop and mobile; application/checklist/DCAT/enrollment demo flows still work; AM/PM and Philippine-time context are consistent; selected historical term matches displayed synthetic subjects/results; no calculated official standing/GWA; renamed identity remains coherent across consumers with stable IDs; refresh behavior is truthful. Test representative draft/error/review/cancel/preview/request paths, keyboard tabs/dialogs, empty history, and all three sizes. Run common validation plus institution/fixture regressions for all touched families.

## P4-M5 — Academic + Admissions & Records Refinement

**Objective:** make staff work easy to locate, scan, and act on without losing the selected class/record.

**Scope:** populate M2 contextual headers/subnavigation for Faculty and Coordinator offering views and Records entities; improve Academic announcement hierarchy without changing publication behavior; apply consistent staff actions; reconcile Records canonical program filters, year/status coverage, and useful multi-field plain-text search; explicit context-appropriate ordering and clear reset/count/empty states. Preserve list context when returning from details.

**Likely code owners:** `src/features/academic/`, `src/features/records/`, existing query-selected view props. Reuse current `offering`/`record` routes; keep server permission catalog authoritative.

**Dependencies:** M2 components/search semantics; M4 identity/term fixtures; existing Faculty/Coordinator and Records access boundaries.

**Findings addressed:** audit §§5.3–5.4; selected entity disorientation, floating actions, bland announcement grouping, partial filter/search coverage and ordering.

**Deferred:** query-language/`||` parser, real academic/admissions mutations, publication/delivery, official grading algorithms, new permission vocabulary, missing Phase 1 management/reporting modules. Do not expand staff authority to improve the demo.

**Implementation boundary:** existing frontend workflows and permitted read-only scope. Coordinator access does not confer edit rights to every class. Canonical filter options need not have sample records. Never fabricate records merely to populate a filter or redesign the institution registry because the Student subset is small.

**Acceptance:** every selected class/record has clear portal/module/entity context, short purpose, and appropriate actions; Faculty and Coordinator views respect their existing boundaries; list return retains relevant criteria; searches match documented fields; filter and sort controls have distinct effects; stable ordering, empty states, long IDs/names and mobile labels are verified. Exercise attendance/grade draft-review-lock and representative Records document/enrollment demo paths with no behavior loss. Run common validation and Academic/Records institution/fixture/access tests.

## P4-M6 — Operations + Technology Refinement

**Objective:** finish operational density, status clarity, and useful technical information without inventing backend capability.

**Scope:** stack/wrap Operations dashboard summaries and controls based on content; apply domain-aware ticket status/priority mapping and explicit queue ordering; polish existing admin/maintenance views, employee identity presentation, and Technology spacing. Improve technical information hierarchy for IT Admin and Developer/multi-membership views using only safe repository-backed or already permitted data. Document what is unavailable rather than fabricating useful-looking metrics.

**Likely code owners:** `src/features/operations/`, `src/features/technology/`; shared patterns remain owned by M2 and can receive a documented minimal extension if needed.

**Dependencies:** M2 foundation, M4 fixture consistency, M5 staff-list patterns, U9 for any proposed additional Technology data source.

**Findings addressed:** audit §§5.5–5.7; O7 small-screen crowding; status-color misuse and technical content usefulness.

**Deferred:** HRIS/payroll/procurement/inventory, dispatch/maintenance backend, monitoring/uptime/health feeds, audit/SIEM logs, credential recovery tooling, role/grant editors, migration/deployment controls, persistent employee photo uploads.

**Implementation boundary:** preserve current Maintenance versus School Admin and IT Admin versus Developer permissions. Keep Technology's fictional account directory read-only and distinguish its database source from browser-reset demos. “Multitester” is a test scenario, not a new role or permission bundle.

**Acceptance:** specifically inspect Operations summaries and Facilities filters at 375 and 768; no cramped two-column summary or clipped controls; High priority and status are distinct; Closed does not imply success; updates/required outcome notes still work. Test both Operations role variants and IT Admin/Developer/multi-portal navigation and direct denial. Additional technical content has attributable source/meaning and no secret/live-health claims. Run common validation plus Operations/Technology fixture/access tests.

## P4-FD1 — Final Visual Audit & Design Lock

**Status: PASS / COMPLETE — documentation only, 30 September 2026.**

**Objective:** audit the current screenshot corpus and select one final Premium Civic-Academic Interface direction before implementation.

**Scope:** read canonical/Phase 4 sources and M2–M6 reports; map the 469-view/1,602-PNG manifest; inspect distinct archetypes and representative states; document systemic findings and explicit visual-rule amendments; select a golden review set.

**Deliverables:** [P4-FD1-FINAL-VISUAL-AUDIT.md](P4-FD1-FINAL-VISUAL-AUDIT.md), [P4-FINAL-VISUAL-LOCK.md](P4-FINAL-VISUAL-LOCK.md), and this roadmap update.

**Evidence:** 83 states inspected at both corpus sizes, with additional full-page and dialog-bottom inspection. The 35-state golden set references 70 primary desktop/mobile PNGs plus available long-content companions; all nine account groups and all six portal families are represented. The manifest inventory and screenshot existence were checked; this is not a new all-route browser/accessibility pass.

**Acceptance:** evidence-linked findings with priorities; one typography/color/surface/shell/density direction; old rules explicitly superseded; exact golden paths and reproduction notes; documentation checks and no source changes. No source implementation, packages, fixtures, routes, auth/access, database or workflow changes. FD2 is not started.

## P4-FD2 — Shared Visual Foundation

**Status: PASS / COMPLETE — 30 September 2026.** See [P4-FD2-SHARED-VISUAL-FOUNDATION.md](P4-FD2-SHARED-VISUAL-FOUNDATION.md).

**Objective:** express the Final Visual Lock through the existing shared presentation foundation.

**Scope:** shared typography and future self-hosted font assets; neutral/color/border/elevation/radius/spacing/width roles; masthead/sidebar/account/drawer visual treatment; PageHeader/ContextHeader/DemoNotice; buttons, links, native controls, tabs, table/list/toolbar recipes, badges, dialog geometry, empty/error/denied/404 presentation. Shared adoption may affect every family; migrate consumers minimally to preserve contracts. Do not create a second component library.

**Dependencies:** FD1 accepted; read installed Next.js guides before source edits; inspect current Git state, existing components, and golden baseline. Preserve all working controls, content facts and authorized destinations.

**Findings owned:** V01, V02, V05 foundation, V06, V10; shared portion of V03, V04, V08, V11 and V12. Exact ownership is in the FD1 audit.

**Boundary:** visual foundation only. No route/query changes, search/filter/sort behavior changes, fixtures, permissions, new workflow, auth/database work, new package, theme engine, scroll motion or publication. A presentation component for an existing 404 is not a new route; preserve not-found/guard behavior.

**Acceptance:** all 35 paired golden states reviewed after the foundation batch, with long-page/dialog companions where relevant; fresh font/fallback, focus, contrast, keyboard/drawer/dialog, 320px reflow and 768/1440px spot checks. Correct shared regressions and record exact evidence. Follow common implementation validation; source/build success alone is insufficient. Stop before FD3.

## P4-FD3 — Public + Applicant + Student Design Pass

**Status: NOT STARTED. Requires a separate implementation instruction.**

**Objective:** carry institutional editorial identity through public pages and strengthen personal journey/academic workspace composition.

**Scope:** public masthead/hero-to-footer continuity, Programs/Admissions/About, login and public account guidance; Applicant next task/journey/form/profile composition; Student next class/agenda/academics/calendar/profile and existing document/request presentation. Use FD2 primitives; no new copy claims, fields, scenarios or actions.

**Dependencies:** FD2 accepted. Canonical photo/seal/facts, existing demo disclosure and public/auth behavior preserved.

**Findings owned:** V07, V13; personal/public adoption of V03–V05, V08–V09 and V11–V12.

**Acceptance:** owned golden pairs and full pages, public menu, form/error/review/document states, personal mobile agenda, profile, long labels and one unaffected staff comparator. Preserve all routes, workflows, data, local state and search/filter/sort behavior. Run appropriate existing checks and visual acceptance. No M7 motion; stop before FD4.

## P4-FD4 — Academic + Records + Operations + Technology Design Pass

**Status: NOT STARTED. Requires a separate implementation instruction.**

**Objective:** finish operational composition, density and technical reference hierarchy using one system.

**Scope:** Faculty/Coordinator teaching and announcements; Records registry/detail/inline reviews; Maintenance/School Admin work queues and detail views; IT Admin account master/detail and Developer technical reference pages. Widen task regions and simplify repeated containers without changing any task or behavior.

**Dependencies:** FD2 and FD3 accepted; preserve established entity/query contracts, default filtering/sorting, role-specific actions and sample data.

**Findings owned:** staff adoption of V03–V04, V08–V09 and V11–V12; shared recipes remain at their FD2 owner rather than being copied into each family.

**Acceptance:** owned golden pairs, Technology full-page master/detail, applicable inline DCAT/document-review extensions, long IDs/names, all staff role variants, account/switcher/drawer states and one unaffected personal comparator. Verify useful 1920px width, 375px ruled rows, tablet wrapping and preserved control semantics. Follow common validation and record limitations. No feature/backend work or final motion; stop before M7.

## P4-M7 — Final Motion + Cross-Portal QA + Release Candidate

**Objective:** validate one coherent product and add only motion that helps comprehension.

**Scope:** restrained admission-journey/history scroll enhancement where useful; final cross-portal layout, typography, interaction, session-navigation and accessibility review; full responsive evidence matrix and bounded defect repair; concept-release handoff with unresolved/deferred items.

**Dependencies:** M2–M6 and FD2–FD4 accepted or explicitly documented blocked/deferred portions; FD1 Final Visual Lock remains authoritative. No feature may be called implemented because a later milestone could finish it.

**Findings addressed:** audit §6.6, admissions scroll animation, integration quality and final review gaps.

**Deferred:** all D1–D7 items below; formal accessibility certification; real institutional production approval; deployment unless separately requested.

**Implementation boundary:** no redesign loop or new feature family. Motion never hides essential content, delays tasks, or changes workflow meaning. Reduced motion shows the complete final state immediately. Fix reasonable concrete defects in a bounded review, not an open-ended style exploration.

**Acceptance:** final 35-state golden comparison at 375×812 and 1920×1080, plus 768×900 and 1440×900 coverage; all 35 portal routes, public/account surfaces, nine account groups and relevant states receive final regression coverage. Do not automatically recapture all 1,602 PNGs: use golden pairs plus targeted route/state evidence and record gaps. Check keyboard/focus/dialog/tab/reflow and reduced motion; no major page overflow or console/runtime errors; role-specific workflow/denial tests; live session navigation verification without treating O8 as a known bug. Run institution/frontend/database/auth/access suites, lint, typecheck, format, build, and diff check. Record real results and environment exceptions. Issue a concept release-candidate report, not a production-ready or formally certified claim.

## Common implementation validation

M2–M7 and FD2–FD4 must validate the changed rendered paths, state variations, and relevant roles. FD1 is documentation-only and does not require application test/build runs. Use existing scripts and meaningful tests of behavior, not snapshots that merely restate implementation. For broad shared/fixture work, run `pnpm test`, `pnpm test:db`, `pnpm test:auth`, `pnpm test:access`, `pnpm lint`, `pnpm typecheck`, `pnpm format:check`, `pnpm build`, and `git diff --check`. Institution-data tests are included in the non-integration test suite. Narrow follow-up fixes may use targeted reruns with explicit attribution; M7 runs the full gate. The FD milestones authorize no fixture changes.

Do not reset the database without demonstrated need and appropriate authorization. Existing integration suites may manage their own controlled fictional fixtures. If `pnpm env:check` fails before loading the script with `uv_os_get_passwd returned ENOMEM`, record the runtime failure separately; it is not a passing environment check or evidence of an application defect. If repository formatting flags untouched `DFCAMCLP.md`, preserve canonical content and report that existing issue rather than making unrelated changes.

## Manual-audit traceability

Source: [PHASE-4-MANUAL-AUDIT.md](PHASE-4-MANUAL-AUDIT.md). Each row has one primary milestone or explicit deferred/rejected disposition. Related downstream consumers inherit the owner's contract. “Accepted” means planned, not implemented. Conditional work is not required to pass as implemented while its policy gate remains unresolved; its blocked/deferred status must remain visible.

| ID  | Manual source and meaningful finding                                          | Primary owner / disposition | Locked resolution                                                                                                                                          |
| --- | ----------------------------------------------------------------------------- | --------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| A01 | Purpose: professional, functional, presentable for faculty review             | M7                          | Validate concept quality; no production approval claim                                                                                                     |
| A02 | §1 email placeholder/example                                                  | M3                          | Add a format example with persistent label; use a clearly fictional example                                                                                |
| A03 | §1 password eye Show/Hide                                                     | M3                          | Existing text toggle confirmed; refine icon/name/state, retain behavior                                                                                    |
| A04 | §2.1 anyone can apply; prevent duplicate applicant accounts                   | M3                          | Discoverable concept entry does not waive canonical eligibility; local demo duplicate state only; real registration/idempotency/person deduplication D1/U1 |
| A05 | §2.1 students validated by staff with COR/COE/support                         | M3                          | Explain requested staff-mediated direction; no self-granted account; U5                                                                                    |
| A06 | §2.1 other-role contact-admin provisioning message                            | M3                          | Honest contact/provisioning guidance; no live ticket or grant claim                                                                                        |
| A07 | §2.1.1 account creation begins application                                    | M3                          | Own demo entry/handoff contract; U3, M4 consumes it; no persisted account/application transaction                                                          |
| A08 | §2.1.1 personal/school/program information                                    | M4                          | Reuse existing draft fields; do not invent mandatory official fields                                                                                       |
| A09 | §2.1.1 birth certificate/report card/good moral/ID photo and adding documents | Deferred D2                 | Retain canonical physical checklist; extra requirements/ID photo/digital uploads gated by U4                                                               |
| A10 | §2.1.1 annual DFCAT 2025/2026/2027 cycles                                     | M4, conditional U2          | Proposed annual demo context only after amendment; canonical label is DCAT                                                                                 |
| A11 | §2.1.1 January opening, April physical submission, May exam example           | Deferred D2                 | Illustrative dates, not verified school calendar; no hardcoded real deadlines                                                                              |
| A12 | §2.1.1 incomplete by deadline means failed and retry next year                | Deferred D2                 | No automatic outcome/eligibility policy; distinguish incomplete from released Not Qualified                                                                |
| A13 | §2.1.1 future backend-ready foundation                                        | M3                          | Document frontend handoff/data distinctions; no speculative schema/backend build                                                                           |
| A14 | §2.2 applicant self-recovery by email/simple method                           | M3                          | Concept UX; actual recovery/delivery D1/U6                                                                                                                 |
| A15 | §2.2 other-role admin recovery ticket                                         | M3                          | Guidance/simulated request only; ticket service and recovery authority D1/U6                                                                               |
| A16 | §3.1 keep school hero background and two buttons                              | M3                          | Preserve supplied photo and two destinations                                                                                                               |
| A17 | §3.1 Student & Staff Portal; remove Integrated                                | M3                          | Public display title/aligned public labels; preserve internal Employee semantics                                                                           |
| A18 | §3.2 prioritize Portal Sign In                                                | M3                          | Primary Sign In, secondary Explore Admissions                                                                                                              |
| A19 | §3.3 remove Quick Access                                                      | M3                          | Remove redundant section, preserve reachable login destinations                                                                                            |
| A20 | §3.4 concise flowing what/who/where school description; research tone         | M3                          | Source verified facts; no invented slogan/mission quotation                                                                                                |
| A21 | §3.5 clean program table, minimal text                                        | M3                          | Four programs, campus relationships and nested BSBA majors retained                                                                                        |
| A22 | §3.5 retain admissions journey layout, add scroll animation                   | M7                          | M3 preserves content/layout; M7 owns optional progressive motion                                                                                           |
| A23 | §3.6 remove Explore the Portal section                                        | M3                          | Retain About nav and unofficial disclosure                                                                                                                 |
| A24 | §3.7 researched history timeline, approximately 1–2 1080p screens             | M3                          | Verify dates/sources; target compactness without fabricated filler; U7                                                                                     |
| A25 | §3.8 professional footer; tentative school copyright line                     | M3                          | Simple professional footer accepted; institutional ownership assertion rejected R2                                                                         |
| A26 | §4 backgrounds for history/description; AI placeholders optional              | Deferred D3                 | Preserve real hero; new media needs provenance/approval; generated imagery cannot impersonate the school/history                                           |
| A27 | §5 cross-page fixes should apply globally where recurring                     | M2                          | Shared primitives/recipes first; feature owners handle content-specific differences                                                                        |
| A28 | §5.1 Applicant function solid; move scenario selector near/sidebar            | M4                          | Separate demo tools, visible current scenario, mobile discoverability; preserve workflow                                                                   |
| A29 | §5.2 Student mostly fine; synthetic subjects acceptable                       | M4                          | Preserve structure; label synthetic curriculum; no official subject list invented                                                                          |
| A30 | §5.2 calendar AM/PM                                                           | M4                          | 12-hour display with explicit local time context; preserve chronological data                                                                              |
| A31 | §5.2 third-year/second-semester test Student and history                      | M4                          | Coherent synthetic historical terms, identity and downstream fixture alignment                                                                             |
| A32 | §5.3 unique headings/descriptions on Teaching/class, Faculty/Coordinator      | M5                          | Entity-context wiring using M2 header contract; verify both roles                                                                                          |
| A33 | §5.3 floating buttons/actions                                                 | M2                          | Shared affordance fix, migrate existing consumers; M5 verifies staff tasks                                                                                 |
| A34 | §5.3 bland Academic announcements                                             | M5                          | Better hierarchy/date/audience/content treatment; no publishing feature                                                                                    |
| A35 | §5.4 Program/Year filters incomplete, only two programs seen                  | M5                          | Reclassified as data-source/coverage gap: controls exist, Student fixtures cover two programs; canonical four-program registry already exists              |
| A36 | §5.4 advanced multi-field search                                              | M5                          | Literal OR-across-useful-fields and accurate help; preserve authorized scope                                                                               |
| A37 | §5.4 `\|\|` operator example                                                  | Deferred D4                 | Query-language parser unnecessary for initial multi-field search; needs later specification                                                                |
| A38 | §5.5 ticket colors clearer/standardized                                       | M6                          | Use M2 tokens; separate priority/status; no automatic green Closed                                                                                         |
| A39 | §5.5 admin Operations general polish                                          | M6                          | Preserve working role-specific tasks, improve density/context                                                                                              |
| A40 | §5.6 Technology general UI/spacing                                            | M6                          | Reuse shared foundation, retain truthful data boundaries                                                                                                   |
| A41 | §5.7 Multitester more useful information                                      | M6                          | Review IT Admin/Developer/multi-membership content; source-backed info only, U9                                                                            |
| A42 | §6.1 modern senior-quality styling; functional/visual balance                 | M2                          | Establish locked system; functionality wins any usability conflict                                                                                         |
| A43 | §6.2 breathing room, concise text                                             | M2                          | Shared rhythm/density/widths; no blanket giant padding                                                                                                     |
| A44 | §6.3 fix typography hierarchy                                                 | M2                          | Semantic type scale and retained readable interface family                                                                                                 |
| A45 | §6.3 introduce 2–3 fonts                                                      | Rejected R1                 | Latest brief caps at two; one existing family locked; hierarchy does not require additional fonts                                                          |
| A46 | §6.4 approved colors                                                          | M2                          | Preserve canonical blue/yellow and light neutrals                                                                                                          |
| A47 | §6.5.1 clickable elements obvious everywhere                                  | M2                          | Shared button/link/row semantics and interaction states                                                                                                    |
| A48 | §6.5.1 repeated numbering: deep-view navigation context                       | M2                          | Shared contextual-header/navigation contract; entity wiring A32/M5                                                                                         |
| A49 | §6.5.2 context-sensitive default ordering and separate sorter                 | M2                          | Shared sorter/filter contract; feature owners apply UX-rules defaults to their lists                                                                       |
| A50 | §6 important navigation: nested sidebar/submenu/tree when useful              | M2                          | At most one useful stable nesting level; prefer contextual entity nav; no universal tree                                                                   |
| A51 | §6.6 scrolling/hover/transitions/interaction feel                             | M7                          | M2 supplies basic states; M7 owns final motion and integrated feel                                                                                         |
| A52 | §7 suggested fictional test names; do not use Marvin                          | M4                          | Use approved name pool, stable IDs and coherent consumer updates                                                                                           |
| A53 | §7 reported logo logs user out, Back/Forward ineffective                      | M3 verification             | Previously reported; not reproduced during P4-M1 Student-session verification; no assumed auth fix                                                         |
| A54 | §7 photo upload and polished profile                                          | M4                          | Profile polish/local temporary preview only; server storage and broader staff profile expansion D5/U8                                                      |
| A55 | §7 missing logo on some pages, persistent top-left                            | M2                          | Shared seal/DFCAMCLP identity including neutral account/denied surfaces; current-portal destination where applicable                                       |

### Additional inspection findings

| ID  | Finding                                      | Primary owner   | Required outcome                                                                                 |
| --- | -------------------------------------------- | --------------- | ------------------------------------------------------------------------------------------------ |
| O1  | Authenticated seal missing                   | M2              | Shared original asset; no portal-specific logo variants                                          |
| O2  | Different page-header implementations        | M2              | One extendable contract, migrated consumers                                                      |
| O3  | Spacing drift                                | M2              | Shared role-based rhythm/widths                                                                  |
| O4  | Demo notices differ substantially            | M2              | One compact reusable pattern with truthful data-source variants                                  |
| O5  | Weak clickable affordance                    | M2              | Clear navigation versus state-changing controls                                                  |
| O6  | Selected class/record lacks strong context   | M5              | Prominent entity identity, module context, useful back/subnavigation                             |
| O7  | Operations summaries cramped at small widths | M6              | Content-driven stacking at 375 and 768; no shrunken text workaround                              |
| O8  | Student public navigation preserved session  | M3 verification | Downgrade alleged bug to unreproduced report; broader regression evidence before any auth change |

## Deferred and rejected register

| ID  | Item                                                                                                                                   | Why / reopening condition                                                                                                                                                                         |
| --- | -------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| D1  | Real registration, one-person deduplication, transaction idempotency, recovery delivery/admin tickets, staff verification/provisioning | Beyond frontend refinement; requires product/security/backend policy, persistence, identity proof and explicit implementation authorization. Never weaken current login/guards as a shortcut.     |
| D2  | Admissions-cycle calendar, deadline failure/reapplication rules, extra mandatory documents/ID photos, digital admissions uploads       | Unverified policy or conflict with canonical physical submission. Requires verified correction/amendment and separately scoped workflow work. Annual-cycle prototype itself is conditional M4/U2. |
| D3  | Additional background imagery, including AI placeholders                                                                               | Optional media not necessary to lock the system. Requires a concrete M3 media brief, provenance/rights review and truthful labeling; never generate fake historical evidence.                     |
| D4  | `\|\|` and other search-expression grammar                                                                                             | Plain multi-field matching fulfills the core need with less ambiguity. Reopen only with actual query requirements and defined syntax/accessibility/error behavior.                                |
| D5  | Persistent profile photo upload and new staff profile workflows                                                                        | Storage, retention, privacy, validation and authorized endpoints are not defined. M4 local preview and existing-view polish remain possible; real uploads need separate scope.                    |
| D6  | Official curriculum/grade formulas, extra school workflows, real monitoring/logs/security controls, HRIS/finance                       | Canonical unknowns and backend expansions; no invention to make screens fuller. Reopen only under separately approved policy and architecture.                                                    |
| D7  | Institutional production deployment/approval and formal accessibility certification                                                    | Phase 4 yields a concept release candidate. Actual institutional review, operational readiness, and formal testing are separate activities.                                                       |
| R1  | Three designed font families                                                                                                           | Conflicts with latest maximum of two and coherent restrained UI; keep one unless amended.                                                                                                         |
| R2  | “© [Year] DFCAM. All rights reserved.” as an asserted school ownership notice                                                          | No commission/ownership authority is established. Keep an honest professional concept footer; author attribution requires verified details if later requested.                                    |
| R3  | Prescribing an authentication repair for the reported logo issue now                                                                   | Report not reproduced; current AppShell logo already targets portal root. Verify broadly in M3 and change auth only for a reproduced, scoped defect.                                              |

## P4-M1 cross-check and handoff

- All manual sections, both duplicated §6.5.1 findings, and every bonus item have explicit rows A01–A55. Additional rendered findings O1–O8 are retained separately.
- The font conflict, “DFCAT” naming, unverified deadline/requirements proposals, institutional copyright, live upload implications, and session allegation have explicit resolutions/gates.
- Records filters and password visibility are classified as refinements of existing functionality, not missing features. Program coverage is not confused with a canonical registry error. The inspected login only declares activation/recovery unavailable; account UX must not be described as already-built forms that can simply be enabled.
- Each shared decision has a document owner. M2 defines reusable patterns; M3–M6 own feature behavior; M7 verifies integration. M4 owns coordinated fictional identity/term changes across consumers.
- Existing database-backed authentication/authorization and Technology read-only queries remain separate from browser-only school workflows. No roadmap item silently grants broader access or authorizes real data collection.
- U1–U10 and D1–D7 remain visible. Implementation agents must stop only a conflicting part and request a lock amendment rather than invent policy.

### Documentation validation — 27 September 2026

- Targeted Prettier check: PASS for all four new files. The initial sandboxed write returned EPERM; the approved formatter retry succeeded without expanding the file scope.
- Local Markdown link targets and table column consistency: PASS.
- Traceability structure: PASS, exactly one table row for each of A01–A55 and O1–O8. Semantic completeness was also reviewed against the manual audit, canonical constraints, and current source; row counts alone are not that review.
- Git change-scope check: only these four new documents; application source, package files, canonical institution source, PRODUCT.md, README.md, and manual audit unchanged.
- Application tests, lint, typecheck, and build: not rerun because this milestone changes documentation only. Prior inspection and historical validation are explicitly attributed rather than claimed as new acceptance.

### P4-M3 completion — 29 September 2026

- P4-M3 is **PASS / COMPLETE**. See [P4-M3-PUBLIC-AUTH-ACCOUNT-UX.md](P4-M3-PUBLIC-AUTH-ACCOUNT-UX.md) for implementation details, sources, browser evidence, and check results.
- At the P4-M3 handoff, P4-M1, P4-M2, and P4-M3 were complete and P4-M4 was next.
- No database reset, credential synchronization, commit, push, or deployment was performed for P4-M3. The standalone environment-check Node error is documented in the M3 report.

### P4-M4 completion — 29 September 2026

- P4-M4 is **PASS / COMPLETE**. See [P4-M4-APPLICANT-STUDENT-REFINEMENT.md](P4-M4-APPLICANT-STUDENT-REFINEMENT.md) for implementation details, review evidence, limitations, and validation results.
- At the P4-M4 handoff, P4-M1 through P4-M4 were complete and P4-M5 was next.
- No database reset, credential synchronization, commit, push, or deployment was performed for P4-M4.

### P4-M5 implementation and acceptance — 29 September 2026

- Academic and Admissions & Records implementation is documented in [P4-M5-ACADEMIC-RECORDS-REFINEMENT.md](P4-M5-ACADEMIC-RECORDS-REFINEMENT.md).
- Frontend, database, authentication, access-control, lint, targeted format, direct TypeScript, and isolated Webpack production-build checks pass. Faculty, Program Coordinator, and Records Staff browser acceptance passed at mobile, tablet, and desktop widths. P4-M5 is **PASS / COMPLETE**.
- P4-M6 is next and **has not started**.

**Historical P4-M5 handoff:** Stop after P4-M5. Do not begin P4-M6 until its milestone brief is supplied.

### P4-M6 implementation and acceptance — 29 September 2026

- Operations and Technology refinements, responsive browser evidence, review findings, and validation are documented in [P4-M6-OPERATIONS-TECHNOLOGY-REFINEMENT.md](P4-M6-OPERATIONS-TECHNOLOGY-REFINEMENT.md).
- P4-M6 is **PASS / COMPLETE**. P4-M7 is next and has not started.
- No database reset, credential synchronization, commit, push, or deployment was performed for P4-M6.

**Historical P4-M6 handoff:** Stop after P4-M6. Do not begin P4-M7. The FD1 amendment above inserts the final design sequence before M7; the earlier completion notes are retained as historical statements.

### P4-FD1 completion — 30 September 2026

- Audit and final visual lock complete; final direction is Premium Civic-Academic Interface with Source Sans 3 and selective public Source Serif 4.
- The old Arial, pale neutral/border, operational width, panel geometry, disclosure-card and visual-ownership rules are superseded only as enumerated in Final Visual Lock §12. Existing behavioral/canonical constraints and deferred/rejected backend-policy items remain.
- A45/R1's rejection of three designed families remains valid. Its old one-family default is now explicitly amended to the two-family direction; no third family is authorized.
- The golden set has 35 logical states, 70 primary viewport images, and existing long-content companions. This is an index to baseline evidence, not a new screenshot run or application acceptance claim.
- Only the two requested new design documents and this roadmap are changed. Application source, styles, routes, fixtures, packages, configuration and screenshot originals are unchanged. No application tests/build were rerun for prose-only work.

**Historical P4-FD1 handoff:** Stop after P4-FD1. The later FD2 implementation is complete; P4-FD3 is next and NOT STARTED.
