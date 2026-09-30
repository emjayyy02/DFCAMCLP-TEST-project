# P4-M7 — Final Motion, Cross-Portal QA, and Concept Release Candidate

**Verdict: CONCEPT RELEASE CANDIDATE — PASS (30 September 2026).** This is a polished fictional/demo frontend release candidate. It is not a production, institutional approval, deployment, or formal accessibility claim. The [Final Visual Lock](P4-FINAL-VISUAL-LOCK.md) and [UX Rules](P4-UX-RULES.md) remain authoritative.

## Scope and corrections

M7 changed presentation only. `src/app/globals.css` adds a 180 ms, small-distance entrance to the existing portal drawer and account/portal switcher popovers. The global `prefers-reduced-motion: reduce` rule removes that motion and presents the final state immediately. Existing public menu and dialog behavior remains. An admissions/history scroll reveal was omitted because those sections are already readable and a reveal would add no task clarity.

Two visual defects were corrected during the final golden review: the portal switcher caption used tiny tracked uppercase text, and Academic section eyebrows retained the same older treatment. `src/components/portal/app-shell.tsx` and `src/features/academic/academic.css` now use the locked sentence-case Source Sans 600 treatment. No content, route, fixture, status, query, search/filter/sort, authentication, authorization, database, or workflow logic changed. No new package was added.

## Rendered visual review

The separate [M7 golden manifest](m7-final-rc/golden/manifest.json) contains **G01–G35 plus X01–X10**, 45 paired states and 174 fresh viewport/full-page/companion images at **375×812 and 1920×1080**. Fifteen [baseline/after comparison sheets](m7-final-rc/golden/comparison-01.jpg) and 15 [after contact sheets](m7-final-rc/golden/review-01.jpg) were inspected, including the seven recaptured Academic states after the eyebrow correction. This covers public, Applicant, Student, Academic, Records, Operations, Technology, and relevant dialog/drawer/denied states without recreating the historical 1,602-image corpus. The manifest has no failed captures, page errors, missing images, or page-level overflow.

The review checked the locked type and surface hierarchy, useful desktop task width, mobile ruled rows, table/toolbar alignment, section transitions, wrapping, dialogs, status treatment, and authentic sortable-header presentation. No remaining material deviation was found in those captured Chromium states. The Next development indicator visible in some screenshots is development chrome outside the page UI.

## Route, responsive, accessibility, and session evidence

The [browser checks](m7-final-rc/runtime-checks.json) cover all **35 portal routes**, eight public/account routes, and all **nine demo account groups**. The **43 route checks and nine account checks passed**, with no page errors or missing images. The public 404 was additionally checked in the responsive matrix. The 10-route matrix spans **320×812, 375×812, 768×900, 1440×900, and 1920×1080**; five representative 768px pages also passed with a computed 32px root font (200% text-size simulation). All **55 measurements passed** without page-level horizontal overflow.

All **22 keyboard/interaction checks passed**: skip-link first focus; mobile drawer focus containment, Escape, and focus return; sample document dialog actions, Escape, and focus return; required-field validation; sortable header focus-visible, Enter, `aria-sort` ascent/descent; Academic tab Arrow navigation; public menu, drawer, and popover reduced motion; account menu; and portal switching. The rendered login email input and sign-in button contrast samples passed at **15.67:1** and **10.54:1** against the 4.5:1 text criterion. These are sampled checks, not screen-reader testing or WCAG certification.

An independent UI sign-in reached Student. Direct navigation to Technology showed Access denied. Authenticated public navigation, Back/Forward/reload, sign-out, faculty/IT portal switching, and Technology role navigation passed. This did not reproduce the historical navigation concern; no auth code was changed.

## Validation

| Check                   | Result                                                                                                                                                                                                                          |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `pnpm test`             | PASS — 7 files, 52 tests, including institution data                                                                                                                                                                            |
| `pnpm test:db`          | PASS — 12 tests                                                                                                                                                                                                                 |
| `pnpm test:auth`        | PASS — 9 tests                                                                                                                                                                                                                  |
| `pnpm test:access`      | PASS — 21 tests                                                                                                                                                                                                                 |
| `pnpm lint`             | PASS                                                                                                                                                                                                                            |
| `pnpm typecheck`        | PASS                                                                                                                                                                                                                            |
| `pnpm build`            | PASS — Next.js 16.3.5 production build                                                                                                                                                                                          |
| Targeted Prettier check | PASS for M7 source, report, roadmap, runner, and evidence JSON                                                                                                                                                                  |
| `git diff --check`      | PASS                                                                                                                                                                                                                            |
| `pnpm format:check`     | BLOCKED by four unchanged pre-existing files: `docs/phase-4/PHASE-4-MANUAL-AUDIT.md`, `final-check-before-uiux/index.html`, `final-check-before-uiux/manifest.json`, and `final-check-before-uiux/source-integrity-before.json` |

The Impeccable detector's one `side-tab` warning points to the existing semantic danger alert's left border; it is consistent with the locked alert pattern and was left intact. The evidence uses local Microsoft Edge Chromium. Safari/WebKit, physical devices, actual operating-system text enlargement, and assistive-technology sessions were not verified. Live institutional policy, deployment, and deferred D1–D7 backend/product decisions remain outside M7. No database reset, credential sync, commit, push, or deployment was performed.

M7 is complete. Stop after this Phase 4 milestone.
