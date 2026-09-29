# P4-M3 — Public Website + Authentication & Account UX

**Status: PASS / COMPLETE.** P4-M3 public and account-entry UX is implemented. P4-M4 remains next and was not started. This report records the locked boundaries, research, implementation, and validation.

## 1. Locked sources read

Read in the order required by the P4-M3 brief:

1. `DFCAMCLP.md`
2. `docs/phase-4/PHASE-4-CONTEXT.md`
3. `docs/phase-4/P4-DESIGN-SYSTEM.md`
4. `docs/phase-4/P4-UX-RULES.md`
5. `docs/phase-4/P4-ROADMAP.md`
6. `docs/phase-4/PHASE-4-MANUAL-AUDIT.md`
7. `docs/phase-4/P4-M2-GLOBAL-DESIGN-FOUNDATION.md`
8. Relevant Phase 1–3 information architecture, navigation, shared UX, user-flow, responsive, authentication/access-control, portal-shell, public-site, and applicant-flow sources.

The requested installed Next.js 16.3.5 guides were read before editing: App Router layouts and pages, linking and navigating, forms, client components, and metadata. The app’s server components, route conventions, and existing login boundary were preserved.

## 2. Public information architecture

The homepage now flows through the campus hero, concise institution context, the two-campus program tables, the five-step admissions journey, a short history preview, and a final next-step area. Programs, Admissions, About, and Portal Sign In remain in the shared public navigation and footer. The redundant Quick Access and portal-concept sections were removed.

## 3. Homepage changes

The display title is **Student & Workers Portal**. The hero keeps the supplied campus image and its two destinations, with Portal Sign In primary and Explore Admissions secondary. The identity section explains who the college serves and what the site contains. The program, journey, and history sections lead into an admissions/sign-in call to action without adding M7 scroll motion.

## 4. Institutional research

Research confirmed public reporting for the 1998 establishment year, the city-funded context of the college, the Batch 2017 graduation, and the 2019–20 BSIS opening. Research did not verify a current IIT Campus street address or current admissions dates/eligibility rules, so neither was added. The 1998 date remains aligned with the canonical institution file and a 2005 newspaper report; a lower-authority directory lists 1995. That discrepancy is recorded below and was not used to change the canonical fact.

## 5. Research sources

- [Las Piñas City: DFCAMCLP opens BSIS at the Institute of Technology (2019)](https://laspinascity.gov.ph/news-and-events/news/205/index.html) — reports the BSIS opening for academic year 2019–20 following approval of the city’s CHED permit application.
- [Las Piñas City: DFCAMCLP Batch 2017 graduation coverage](https://laspinascity.gov.ph/news-and-events/news/99/index.html) — documents the graduation and the city-funded, tuition-free context for qualified Las Piñas students.
- [Philstar: 700 freshmen receive scholarships in Las Piñas (29 May 2005)](https://www.philstar.com/metro/2005/05/29/279538/700-freshmen-receive-scholarships-las-pintildeas/amp/) — contemporary reporting that describes the college as established in 1998 through city initiative/funding.
- [Third-party college directory entry](https://www.infomaninc.com/link/ched/dr_filemon_c_aguilar_memorial_college.htm) — lists 1995, conflicting with the project’s canonical 1998 fact and the newspaper report. It was not treated as sufficient evidence to change public history.
- `DFCAMCLP.md` — authoritative project source for the canonical campus and degree-program presentation.

## 6. History treatment

The homepage shows a concise 1998 establishment milestone and the 2019 BSIS milestone. About shows those plus the 2017 graduation milestone. Copy identifies public reporting as the basis and avoids invented events. The third-party 1995 listing remains an internal research conflict; no 1995 date is shown in the UI.

## 7. Programs presentation

`src/lib/institution-programs.ts` supplies one public presentation registry to both public pages. Main Campus contains BSA and BSBA; IIT Campus contains BSIS and BSCpE. BSBA’s three majors remain nested beneath the BSBA degree. Each rendered catalog has four degree rows and exactly one BSIS row under IIT Campus. No IIT street address is published. The institution-data test now asserts that the rendered catalog contains one BSIS code.

## 8. Admissions presentation

The sequence is application → physical document submission and verification → DCAT → results → enrollment. Pages state that dates, cycle names, current eligibility rules, and an exhaustive document list are not set in this concept. No interview, cutoff, deadline, automatic failure rule, or upload workflow was introduced. Public text distinguishes the city’s reported tuition-free context from current eligibility policy.

## 9. Footer/header changes

The public header aligns the DFCAMCLP identity with the Student & Workers Portal display title and includes Portal Sign In. The mobile menu retains its expanded state, accessible links, Escape handling, and focus restoration. The footer keeps an explicit unofficial/non-affiliation disclosure and author attribution; it makes no DFCAMCLP ownership or endorsement claim.

## 10. Login UX

The sign-in page uses a useful `name@example.com` email placeholder and links to account-entry and recovery guidance. Requested portal query values still preselect intent only. Server authorization remains the authority for portal access. Existing login errors, pending state, endpoint, and sign-in behavior were not rewritten.

## 11. Password-visibility treatment

The text Show/Hide control is now an eye icon button with the accessible names “Show password” and “Hide password,” `aria-pressed`, and `aria-controls`. Browser interaction verified both password/text input states and the matching pressed state. The password remains masked by default and retains current-password autocomplete.

## 12. Registration/account-entry architecture

`/account/create` presents Applicant entry separately from institution-managed Student and Faculty/staff identities. `/account/create/applicant` is a labeled, temporary applicant-entry preview. Student IDs are not treated as proof or a grant of access. Faculty/staff accounts are not publicly self-provisioned. These are public UX routes; they do not add auth endpoints or membership behavior.

## 13. Applicant self-registration behavior

The preview collects a fictional name, email, campus, program, and—when BSBA is selected—a major. Campus selection filters programs. It asks for no password, identity document, or file upload. Submission only displays a temporary page-local preview. Its result states that no account/application was created, no email was sent, and nothing was saved. Refreshing or leaving discards the form state.

## 14. Application-cycle treatment

The concept says a future application would be linked to an annual cycle but leaves names and dates unset. No year, opening window, deadline, status, or cycle record was invented. M4 owns any cycle model after the required policy decision.

## 15. Duplicate-person boundary

Applicant copy says the concept does not match identities or prevent duplicate people. Email equality is not presented as proof of one person. Real identity checks, repeat-application eligibility, concurrency, and idempotency remain policy/backend questions.

## 16. Student account-provisioning guidance

Student access is linked to an existing institutional student record. The entry page explains that entering a Student ID cannot verify identity or create access and links to Student sign-in. No self-service Student membership or arbitrary identity creation is implemented.

## 17. Staff account-provisioning guidance

Faculty and staff accounts are described as provisioned by authorized administrators. The concept cannot request or grant institutional access. Recovery guidance makes no claim that a ticket is submitted and does not establish a support owner or identity-check policy.

## 18. Recovery UX

Applicant recovery accepts a fictional email for a local preview only. It performs no account lookup and explicitly states that no email was sent. Student/employee guidance directs the user toward an authorized institutional administrator while stating that no ticket can be submitted here.

## 19. Real vs demo auth behavior

Existing sign-in continues to use the real project login path and server-verified access context. Applicant entry and recovery are frontend concepts only. They do not call registration/recovery services, persist a user/application, send email, open support tickets, or grant a portal membership. No schema, session, role, permission, middleware, or authorization rule changed.

## 20. Account-page changes

The authenticated `/account` page uses the shared identity summary/avatar fallback and removes repeated standalone name/email rows. Its description identifies the fictional development environment. Account status, server-verified session state, active memberships, portal links, and sign-out remain intact.

## 21. Responsive review

All nine reviewed routes were rendered at 375×812, 768×900, and 1440×900: `/`, `/programs`, `/admissions`, `/about`, `/login`, `/account/create`, `/account/create/applicant`, `/account/recovery`, and `/account`. Each had one document-wide horizontal boundary within its viewport and no horizontal overflow. The campus image was checked after its optimized image loaded.

## 22. Accessibility review

The rendered-route review found one H1 and one main landmark per route, no unlabeled form controls, unnamed buttons/links, or images missing `alt`. Program catalogs use table headers and BSBA majors use a nested list. Mobile menu open/close and Escape focus restoration were exercised; the password toggle was checked through its accessible name and state. This was a targeted manual semantic and keyboard review, not a formal WCAG certification or a full automated accessibility scan.

## 23. Browser QA

The local app was reviewed in the Codex in-app browser at mobile, tablet, and desktop widths. Route title/H1, error copy, document width, and BSIS mentions were inspected. The applicant preview was exercised with fictional values: IIT showed only BSIS/BSCpE and no major field; Main Campus → BSBA exposed its three majors; submission showed the temporary result. Recovery submission showed no-email copy. The mobile navigation was opened, closed with Escape, and verified to restore focus to its trigger. The eye toggle was switched on and off.

The rendered account belonged to the seeded single-membership Applicant. Portal → public page → browser Back/Forward retained the Applicant route/session. Multi-membership behavior is covered by the passing access-control integration suite, including the Faculty + Developer account mapping; a separate manual browser login with that account was not performed.

## 24. Regression results

- `pnpm test` — PASS, 7 files / 47 tests, including institution-data coverage.
- `pnpm test:db` — PASS, 1 file / 12 tests.
- `pnpm test:auth` — PASS, 1 file / 9 tests.
- `pnpm test:access` — PASS, 1 file / 21 tests.
- `pnpm lint` — PASS.
- `pnpm typecheck` — PASS (`next typegen` and `tsc --noEmit`).
- `pnpm build` — PASS, optimized production build generated the new public routes.
- `git diff --check` — PASS after the documentation and roadmap update.
- `pnpm format:check` — all changed files formatted; the repository check reports only the untouched `docs/phase-4/PHASE-4-MANUAL-AUDIT.md` baseline warning. That file was not edited or reformatted.
- `pnpm env:check` — separately blocked by Node 24.19.0 `uv_os_get_passwd returned ENOMEM`; no unrelated application code was changed to suppress this host error.

## 25. Remaining unresolved account/backend rules

- **U1:** person matching, repeat-application eligibility, and safe transaction/idempotency behavior.
- **U2:** official annual cycle, dates, deadline consequences, and reapplication policy.
- **U5:** student verification evidence, staff-provisioning authority, privacy, and support ownership.
- **U6:** recovery identity checks, delivery, ticket ownership, rate limits, and security controls.
- **U7:** historical source conflict and image provenance/rights; 1998 follows canonical data and the cited contemporary report, while the 1995 directory entry is not promoted.
- **U3/U4:** account/application creation transaction policy, extra requirements, and any digital document workflow remain unimplemented and require separate decisions.

## 26. Deferred P4-M4+ work

P4-M4 was not started. It may own the applicant/application handoff and any conditional cycle presentation, plus its own applicant/student refinement. Real registration, person deduplication, portal membership provisioning, institutional verification, email recovery, support tickets, digital document uploads, persistent profile photos, official admissions dates/policies, and additional media remain deferred pending verified policy and separate authorization. P4-M5, M6, and M7 work was not started.
