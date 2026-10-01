# P4-FD6 — Expressive UI + Identity Implementation

**1 October 2026 · PASS / COMPLETE within the frontend demo boundary.**
Scope: frontend implementation of the accepted [FD5 lock](P4-FD5-IMPLEMENTATION-LOCK.md). The owner's FD6 brief supersedes the earlier planned next-milestone name RC2: **FD7 is next and has not started**.

## Implementation

The existing typography, palette, routes, feature providers and school workflows remain. FD6 adds a shared interaction language, bounded yellow accents, Applicant task/context layouts and a single account presentation architecture.

| Locked area                | Implemented behavior                                                                                                                                                                                                                                           |
| -------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Buttons                    | 140ms color/border feedback; enabled press 0.98 over 80ms; immediate actions and disabled/pending semantics.                                                                                                                                                   |
| Links / navigation         | Persistent content-link underline, hover reinforcement, 180ms selected-edge transition, immediate current route. Account and authorized-portal disclosures close on destination selection and Escape.                                                          |
| Tabs                       | Immediate existing selection and panels; 180ms bounded underline settle; one-line scroll strip with full labels, native scrollbar and room for focus outline. Arrow/Home/End behavior retained.                                                                |
| Sorting / interactive rows | 140ms header/indicator feedback; existing sort order, direction, query and aria-sort remain immediate. Brand-soft hover/focus-within applies only to rows with existing controls.                                                                              |
| Fields                     | 140ms border reinforcement; immediate blue focus outline and existing validation. Native controls remain.                                                                                                                                                      |
| Menus / drawer / dialogs   | 180ms menu (-4px), 220ms drawer (-16px), 180ms dialog (8px), 140ms backdrop. Native focus/inertness opens immediately; no closing delay.                                                                                                                       |
| Status / route feedback    | Existing live text updates immediately; 500ms local status emphasis (180ms emphasis plus 320ms settle). Only deliberate client destination changes emphasize the page-header rule; no whole-page fade or data-row movement.                                    |
| Public editorial motion    | Admissions connector and history keyline reveal over 320ms; admissions stagger 36ms, total below 500ms. Text is always visible. No portal scroll reveals. Restoration, fragments, focus, reduced motion and no-JS retain the final content.                    |
| Yellow                     | Canonical #FCDF00 institutional 64×4 keylines; bounded 48/64×4 current-context lines; current journey marker with blue boundary; 28px avatar plus disk inside a 44px target. Blue remains primary.                                                             |
| Applicant composition      | Centered dashboard up to 1408px; task/profile workspaces up to 1216px. Actual content-width container query at 1040px enables a 320px context rail with 32px gap; otherwise one logical column. Fields remain at most 704px; notice prose at most 672px.       |
| Photo                      | Shared avatar-plus dialog on account and both domain profiles. Native chooser; JPEG/PNG/WebP up to 2MB; decode validation, staged preview, explicit Use photo, Cancel, replacement and Remove. Object URLs are revoked. No upload endpoint or browser storage. |
| Account Profile            | One server-guarded DTO-driven view for all identities: name, email, actual account status, authorized memberships/roles, avatar, bio and existing sign out. Account identity and View profile link to /account.                                                |
| Bio                        | Optional plain text, empty initially, native 240-character limit, Edit / Apply demo bio / Cancel / clear. Focus enters editor and returns to Edit. No invented biography or backend update.                                                                    |
| Cross-surface identity     | Root client presentation provider keyed by signed-in user ID shares account photo/bio across client navigation and authorized portal switches. ID-gated reads prevent an old identity from being displayed while binding.                                      |
| Mobile / accessibility     | Tight existing title/disclosure grouping, centered desktop space, readable field widths, tab containment, visible notice-category label, 44px photo control, reachable scrolling dialogs, immediate focus and reduced-motion overrides.                        |

The provider stores only an optional object URL and bio, not auth/session/permission state. Existing guarded server pages supply user ID/name/email/status and already-filtered memberships; the provider cannot authorize anything. It clears on identity change, arrival at login/session-loss redirect and sign-out intent, and disappears on reload or a new tab. No root auth fetch, session timer, cookie, localStorage, sessionStorage, API, package or database change was added.

The Student account is Alex Teststudent while the school fixture is John Paul Reyes. Applicant draft identity may also diverge. Therefore account avatars share account state, while Applicant/Student sample photos keep their existing separate domain-provider lifetimes. Each domain profile links to Account profile with an explicit distinction. Phone, Student/Applicant IDs, program and campus stay on their existing school profile. Photo UI is shared; unrelated people are not merged.

## Applicant route coverage

| Route / view                    | Desktop composition                                                                                                                                                      |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Dashboard                       | Next action and notices in the main column; existing journey and application summary in the rail. Mobile order remains next action → journey/summary → notices.          |
| Application form / Requirements | Existing task and validation in the main column; current stage, application identity/program/campus and journey in the rail. Status tab avoids a duplicate full journey. |
| DCAT schedule / Results         | Existing schedule or result and allowed action first; current journey and application context alongside.                                                                 |
| DCAT form                       | Existing preview controls first; schedule context appears only when the existing exam state permits it.                                                                  |
| Enrollment Progress             | Existing progress; Registrar appointment appears only when existing enrollment state permits it.                                                                         |
| Registrar schedule / COE-COR    | Existing appointment or documents; enrollment progress and existing COE/COR availability labels in context.                                                              |
| Announcements                   | Existing filtered feed with visible category label; current stage and existing next-step destination alongside.                                                          |
| Profile                         | Identity and Personal/Contact facts; existing Application facts/status/link moved into the rail.                                                                         |

No new eligibility computation, official content, metric, schedule, appointment, fixture or action was introduced. The draft, scheduled, waiting, Not Qualified, COE-only and COR states retain their original meanings.

## Evidence and acceptance

Fresh evidence lives in [fd6-after](fd6-after/manifest.json); M7/FD2/FD3/FD4 originals are untouched. Each capture records browser, timestamp/run, commit plus dirty state, account group, route/query, scenario/tab/action description, viewport, motion preference, expected/actual result and available M7 before paths. New account/photo states have no identical prior golden and are labeled by their actual state rather than assigned a fabricated before image.

The initial review found 320px overflow in Application, DCAT and Enrollment: the grid child containing the horizontal tab strip retained its min-content width. Explicit minimum-width/maximum-width containment fixed it. [Initial review](fd6-after/initial-review.json) retains that finding. QA harness corrections narrowed selectors to native scenario selects and the photo error instead of Next's route announcer, selected only the committed avatar instead of the hidden dialog preview, and waited for portal navigation before opening Account. These were test synchronization/selection corrections.

The production run recorded **189 checks, 97 fresh captures and 75 route/viewport measurements**. All 75 width measurements passed. One additional check found that the End key selected the last Applicant tab at 320px without fully exposing it. A bounded focus handler now scrolls the focused tab into view immediately, retaining the existing selection and key contracts. Visual review also caught the Account label crowding the wordmark at 320px: below 361px, its text remains accessible but is visually hidden beside the avatar. The separate [keyboard and masthead confirmation](fd6-after/keyboard-confirmation.json) then passed **99/99 checks** across all three tabbed Applicant routes, all five widths and both motion preferences, with six additional screenshots. The original 188/189 result is preserved instead of rewritten as a run that never happened.

The earlier isolated interaction run passed [97/97 checks](fd6-after/interactions-manifest.json). Together the evidence verifies all nine account identities/membership counts; account/menu photo sharing; separate sample-domain identity; staging/cancel/apply/replace/remove and image errors; 240-character plain-text bio editing/cancel/clear; same-tab navigation and authorized portal switching; reload/new-tab/sign-out/Back reset behavior; no photo/bio mutation requests; object-URL cleanup; application validation/review/cancel; document preview; unchanged sortable-header directions; dialog/menu/drawer focus and Escape; reduced-motion changes during an open overlay; public no-JS/fragment/Back behavior; connector and overlay timings; and representative 200% text-size simulation.

Rendered contrast samples: body ink on canvas **13.71:1**; avatar plus ink on yellow **11.71:1**; blue plus boundary against yellow **7.88:1**. These are measured representative pairs, not a claim that every pixel or assistive technology was audited. The main run and focused confirmation total **103 screenshots**.

**Acceptance:** no remaining known FD6 product defect. Existing global formatting debt and platform/assistive-technology limits are explicitly retained below. FD6 does not claim the separate FD7 final QA milestone.

## Validation

| Command           | Result                                                                                                                                              |
| ----------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| pnpm test         | PASS: 52 tests across 7 files. Initial public-component alias import failure fixed with the existing relative import convention, then rerun passed. |
| pnpm test:db      | PASS: 12 tests.                                                                                                                                     |
| pnpm test:auth    | PASS: 9 tests.                                                                                                                                      |
| pnpm test:access  | PASS: 21 tests.                                                                                                                                     |
| pnpm lint         | PASS after final source and QA refinements.                                                                                                         |
| pnpm typecheck    | PASS after final source refinements.                                                                                                                |
| pnpm build        | PASS after final source refinements, Next.js 16.3.5 production build.                                                                               |
| pnpm format:check | Historical blocker only: the same four unchanged files listed below. Changed-file formatting is checked separately.                                 |
| git diff --check  | PASS after final changes.                                                                                                                           |

Unchanged formatting findings: docs/phase-4/PHASE-4-MANUAL-AUDIT.md; final-check-before-uiux/index.html; final-check-before-uiux/manifest.json; final-check-before-uiux/source-integrity-before.json. They are not silently reformatted or reported fixed.

## Exact changed source files

- src/app/layout.tsx — root presentation provider.
- src/app/[portal]/layout.tsx — existing user DTO additionally passes stable ID; guards unchanged.
- src/app/account/page.tsx — existing guarded reads mapped to shared account view.
- src/app/globals.css — motion/accent/focus/tab/photo/account/public recipes.
- src/components/portal/app-shell.tsx — account avatar/links, disclosure focus/close and route/status feedback binding.
- src/components/public/institution-content.tsx — bounded decorative reveal wrappers; facts unchanged.
- src/components/ui/identity.tsx — optional shared avatar slot.
- src/components/ui/demo-profile-photo.tsx — shared staged native dialog; existing domain photo hook retained.
- src/components/ui/interaction-feedback.tsx — new presentation-only route/live-region feedback helper.
- src/components/ui/reveal-accent.tsx — new progressive-enhancement editorial decoration.
- src/features/identity/demo-presentation-provider.tsx — new scoped in-memory account state.
- src/features/identity/account-profile.tsx — new shared profile/bio view.
- src/features/identity/sign-out-button.tsx — clears temporary presentation; existing auth call/redirect/refresh unchanged.
- src/features/applicant/applicant-page.tsx — task/context grouping, profile photo and distinction, visible category label.
- src/features/applicant/applicant.css — centered responsive composition and tab containment.
- src/features/applicant/shared.tsx — immediately exposes the focused tab; existing selection and Arrow/Home/End behavior retained.
- src/features/student/student-page.tsx — shared sample-photo control and explicit account/domain distinction.

Documentation: this report and P4-ROADMAP.md. Evidence: fd6-after scripts, manifests and screenshots. FD5 audit/lock files were already present from the preceding planning work and are preserved. Generated next-env.d.ts was restored to its original tracked content after checks; it is not a product/configuration change.

## Limits and boundary

Chromium desktop emulation verifies the specified 320, 375×812, 768×900, 1440×900 and 1920×1080 viewports. Representative 200% checks are explicit text-size simulation including pixel-sized leaf text, not physical OS scaling or browser zoom. No physical phone, Safari/WebKit, real screen reader or print pagination certification is claimed. Automated focus/ARIA checks are not an assistive-technology listening session. Native chooser cancellation is simulated by an empty selection; no OS chooser interoperability claim is made. A zero-membership account is supported by the shared empty branch but was not seeded merely for visual evidence.

No backend/server-service, API, schema, migration, database, auth semantics, permission, credential, fixture, canonical-fact or school-workflow changes. Search/filter/sort contracts are retained. No database reset, reseed, credential synchronization, commit, push or deployment. No profile upload or persistent profile editing claim.

**STOP AFTER FD6. FD7 has NOT started.**
