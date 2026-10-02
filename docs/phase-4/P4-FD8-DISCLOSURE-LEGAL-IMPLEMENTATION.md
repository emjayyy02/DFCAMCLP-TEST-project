# P4-FD8 — Disclosure + Legal Implementation

**PASS — 1 October 2026. FD8 frontend acceptance complete; stop at FD8.** FD7 is accepted through the owner's explicit FD8 implementation brief. [FD7 audit](P4-FD7-DEMO-DISCLOSURE-AUDIT.md) and [FD7 lock](P4-FD7-DISCLOSURE-LEGAL-UX-LOCK.md) own copy and behavior. RC2A and RC2B have not started. No commit, push or deployment.

## Implementation and scope

One root `DemoDisclosureProvider` sits outside the existing presentation provider. Native `dialog.showModal()` supplies protected focus and background inertness, an explicit Tab boundary handles the first/last controls, and the title receives initial focus. The four locked paragraphs are shared by the modal and no-JavaScript fallback. The primary action is exactly **I understand — Enter demo**. Four complete information-page links are usable before acknowledgement. Entry Escape/Leave demo navigates to Disclaimer without acknowledgement; manual reopening uses Close/Escape and restores its trigger. If the original trigger no longer exists, focus returns to main content.

The root provider persists across normal client navigation. It remembers the current actual pathname/query/hash in memory for legal-page Return to demo, with `/` for a direct information-page entry. Legal routes never require acknowledgement. This return value is constructed from current same-origin browser location, not user-supplied return parameters. No authentication, authorization or portal-selection semantics change.

Acknowledgement stores only `dfcamclp.demoDisclosure.ackVersion = fd7-v1` in origin-local localStorage. There is no identity, acceptance timestamp, document signature or backend acceptance record. Normal navigation, reload, same-origin tabs and sign-out respect the saved version. Unknown, old or cleared versions prompt on a new entry/reload. A later version change can intentionally show revised copy. Storage exceptions produce an in-memory choice and the locked polite announcement: “Understood for this visit. Your browser could not remember this choice.” Reload prompts again when storage is unavailable. No cross-tab live revocation interrupts an active workflow; a full entry reads storage.

About this demo is available in public, portal, account, denied and not-found footers, after View profile in the account menu, and within Account profile. Opening from the account menu closes that menu first and restores the Account summary on exit. Four information links and the short “Independent portfolio demo.” attribution replace full footer prose; existing public copyright/author attribution remains. Sidebar and primary public navigation are preserved.

No-JavaScript non-legal entry renders the same paragraphs, ordinary information links and Continue to page content. Reopen buttons remain hidden before hydration, rather than exposing dead controls. Direct legal pages remain readable without JavaScript.

## Removed / consolidated A inventory

All 15 dispositions are complete. Global truthfulness is centralized; contextual limits stay beside their actions.

| ID  | Result                                                                                                                                               |
| --- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| A01 | Applicant family-wide fictional/reset strip removed.                                                                                                 |
| A02 | Student family-wide fictional/reset strip removed.                                                                                                   |
| A03 | Academic family-wide fictional/reset strip removed.                                                                                                  |
| A04 | Records shared Header strip removed.                                                                                                                 |
| A05 | Operations dashboard strip removed. Current source placed this strip on Dashboard; the four task-specific module notices remain.                     |
| A06 | Public full conceptNotice footer replaced with short attribution and persistent entries; copyright preserved.                                        |
| A07 | About body conceptNotice removed; adjacent generic disclosure consolidated into Project Disclaimer link. Institution introduction/content preserved. |
| A08 | Account, forbidden and not-found shared ConceptDisclaimer now supplies short attribution and persistent entries.                                     |
| A09 | Portal shell long project disclaimer replaced with shared secondary information footer.                                                              |
| A10 | Academic selected-roster standalone fictional-identifiers paragraph removed.                                                                         |
| A11 | Applicant announcements standalone fictional-notices introduction removed; feed preserved.                                                           |
| A12 | Technology Developer repeated unofficial closing paragraph removed.                                                                                  |
| A13 | First two global technologyDemoLimitations omitted at consumer with slice(2); fixture unchanged and third technical limitation retained.             |
| A14 | Account mixed preamble removed; existing photo/bio temporary-state helper retained.                                                                  |
| A15 | Academic management mixed clause reduced to exactly: No coordinator edits are saved.                                                                 |

Eight contextual DemoNotice call sites remain: four Operations modules, three account entry/recovery previews and one conditional Technology notice. Labels describe their task: Service model, Directory scope, Facilities model, Reference scope, Account entry preview, Entry preview, Recovery preview, Read-only account directory or System reporting. No rendered generic Demo workspace strip remains in the portal checks.

## Retained B inventory

All B01–B42 were reviewed against FD7 and the full source diff. The following automated marker audit confirms retained wording/controls; [notice-verification.json](fd8-after/notice-verification.json) includes exact sentinels, additional checks and source SHA256 hashes. This is source-backed regression evidence, not a claim that every workflow was manually executed anew. Existing workflow implementations, providers, photo controls and fixtures are unchanged.

| ID  | Source                                             | Retained evidence                                                                                                              |
| --- | -------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| B01 | `src/app/login/page.tsx`                           | PASS — Demo accounts only. Do not enter real student information.                                                              |
| B02 | `src/app/account/create/page.tsx`                  | PASS — Account entry preview; No account                                                                                       |
| B03 | `src/app/account/create/applicant/page.tsx`        | PASS — Entry preview; No password                                                                                              |
| B04 | `src/app/account/recovery/page.tsx`                | PASS — Recovery preview; No account lookup                                                                                     |
| B05 | `src/features/identity/account-entry.tsx`          | PASS — temporary preview; No account or application was created; not checked or contacted                                      |
| B06 | `src/features/identity/account-entry.tsx`          | PASS — identity-check behavior are not connected; does not look up accounts; No recovery email was sent                        |
| B07 | `src/features/identity/account-profile.tsx`        | PASS — Photo and bio are temporary in this tab; sign-out; maxLength={240}                                                      |
| B08 | `src/components/ui/demo-profile-photo.tsx`         | PASS — Temporary sample photo. Not uploaded or saved; Shown only in this tab; up to 2 MB                                       |
| B09 | `src/features/student/student-page.tsx`            | PASS — Sample school profile. Your sign-in identity; Student ID is separate                                                    |
| B10 | `src/features/applicant/scenario-switcher.tsx`     | PASS — Changes the sample journey only. No school records change.                                                              |
| B11 | `src/features/applicant/application-form.tsx`      | PASS — Submit this demo application?; Nothing will be sent to; Refresh resets the demo                                         |
| B12 | `src/features/applicant/applicant-page.tsx`        | PASS — No real appointment has been booked                                                                                     |
| B13 | `src/features/applicant/shared.tsx`                | PASS — SAMPLE DOCUMENT · NOT VALID FOR OFFICIAL USE; signatures; not defined in this concept                                   |
| B14 | `src/features/applicant/applicant-page.tsx`        | PASS — This demo assigns no Student ID or membership                                                                           |
| B15 | `src/features/student/student-page.tsx`            | PASS — Sample · Not valid for official use; not an issued school record; No official record or school                          |
| B16 | `src/features/student/student-page.tsx`            | PASS — This demo request stays in this browser session; It is not sent to; Review request                                      |
| B17 | `src/features/student/student-academics.tsx`       | PASS — Synthetic course list; not an official curriculum; V1 ASSUMPTION                                                        |
| B18 | `src/features/academic/academic-page.tsx`          | PASS — Your changes in this session; They reset when you                                                                       |
| B19 | `src/features/academic/academic-page.tsx`          | PASS — Coordinator view: this sample roster is read-only                                                                       |
| B20 | `src/features/academic/academic-page.tsx`          | PASS — Attendance saved in this demo session. It resets on refresh; Past-session edits; No official attendance                 |
| B21 | `src/features/academic/academic-page.tsx`          | PASS — No official record or notification is created; has not been released to students; does not define a scale               |
| B22 | `src/features/academic/academic-page.tsx`          | PASS — Publishing, delivery, and official campus updates are not part of this demo                                             |
| B23 | `src/features/academic/academic-page.tsx`          | PASS — No coordinator edits are saved; V1 ASSUMPTION; Official enrollment                                                      |
| B24 | `src/features/records/records-page.tsx`            | PASS — Staff demo statuses only; V1 ASSUMPTION; not an official admissions decision                                            |
| B25 | `src/features/records/records-page.tsx`            | PASS — This demo does not create a Student ID                                                                                  |
| B26 | `src/features/records/records-page.tsx`            | PASS — Review sample schedule; Save sample schedule; Confirm sample result                                                     |
| B27 | `src/features/records/records-page.tsx`            | PASS — sample statuses, not official releases; Confirm sample step                                                             |
| B28 | `src/features/records/records-page.tsx`            | PASS — SAMPLE · DEMO · NOT VALID FOR OFFICIAL USE; Print sample preview; not an                                                |
| B29 | `src/features/operations/operations-page.tsx`      | PASS — Service model; No SLA or official service catalog is represented                                                        |
| B30 | `src/features/operations/operations-page.tsx`      | PASS — It does not contact the student; Admissions, DCAT, enrollment, student records, and official documents                  |
| B31 | `src/features/operations/operations-page.tsx`      | PASS — Directory scope; not an official organization chart; No HR or account-access workflow                                   |
| B32 | `src/features/operations/operations-page.tsx`      | PASS — does not confirm an official department                                                                                 |
| B33 | `src/features/operations/operations-page.tsx`      | PASS — Facilities model; No inventory or response-time policy is represented                                                   |
| B34 | `src/features/operations/operations-page.tsx`      | PASS — Status changes stay in this browser session; No response-time or emergency policy; Sample ticket history                |
| B35 | `src/features/operations/operations-page.tsx`      | PASS — Reference scope; not official live settings; V1 ASSUMPTION                                                              |
| B36 | `src/app/[portal]/[[...section]]/page.tsx`         | PASS — Read-only account directory                                                                                             |
| B37 | `src/app/[portal]/[[...section]]/page.tsx`         | PASS — System reporting; No live monitoring or service-health reporting                                                        |
| B38 | `src/features/technology/technology-dashboard.tsx` | PASS — Counts are derived from fictional development accounts and their current seeded memberships                             |
| B39 | `src/features/technology/technology-accounts.tsx`  | PASS — review its account state, portal memberships; Fictional demo accounts and their access summaries; does not assign roles |
| B40 | `src/features/technology/technology-security.tsx`  | PASS — not logs or recorded events; No timestamps or IP addresses; not persisted as an audit history                           |
| B41 | `src/features/technology/technology-system.tsx`    | PASS — not live health; Runtime mode only; No live health checks                                                               |
| B42 | `src/features/technology/technology-developer.tsx` | PASS — real authentication and access foundation; technologyDemoLimitations.slice(2); they do not run from this page           |

Additional checks cover Applicant school/account distinction, appointment label, Records notification caveat and the third Technology limitation. Sample document stamps, contextual confirmation prose and print selectors are retained. The existing test suites validate school behavior and permission rules; there is no new official-policy claim.

## Public reading pages and privacy

Created `/disclaimer`, `/terms`, `/privacy`, `/acceptable-use` with metadata and a shared public reading layout. Exact locked copy uses one main heading, ordered h2 sections, Source Serif 4 headings, Source Sans body/interface, 42rem maximum reading measure, institutional blue links and restrained yellow detail. There is no card per paragraph/section. A local page-navigation list identifies the current page, and Return to demo preserves the originating session and route during client navigation. Notice version/date and the locked non-lawyer-reviewed closing line are visible.

Privacy distinguishes fictional school content from real credential transmission, the server-auth cookie/database session, identity/access/authentication records, seven-day configured session expiry/daily refresh, and uncertainty about nullable session IP/user-agent fields. Session expiry is not represented as a deletion guarantee. It accurately describes workspace memory, page-only previews, staged local photos/object URLs, 240-character tab bio, version-only acknowledgement, URL/history, explicit clipboard use and user-controlled sample print output. It narrowly states that hosting/proxy/infrastructure logging has not been verified. It supplies no blanket tracking, retention, encryption, sale-policy, hosting or certification guarantees. No analytics integration was added.

## Rendered acceptance

The final [browser manifest](fd8-after/manifest.json) records commit, dirty status, production preview, route, viewport, interaction state, capture time and reduced-motion state. Source hashes are in the notice audit. The transient generated next-env import change recorded at capture time was restored before delivery. Existing FD6 evidence is preserved as the shared-surface baseline; new disclosure/legal states have no preceding rendered counterpart.

**277/277 checks pass; 42 fresh PNG captures.** Ran installed Playwright against installed Microsoft Edge Chromium, isolated production preview at localhost:3108. Its process-only BETTER_AUTH_URL override enabled real local sign-in verification and did not edit configuration.

- Fresh Login deep link at 320×812, 375×812, 768×900, 1440×900, 1920×1080 and short 812×375 landscape: modal within viewport, pinned reachable actions, internal body scrolling where needed, four legal links, named dialog/title focus and trapped forward/reverse keyboard traversal.
- Four legal routes at all six widths: no automatic prompt, one main heading, current-page navigation and no page-level horizontal overflow. Twenty full-page reading captures cover the five requested widths.
- Legal-link navigation before acknowledgement; no stored choice; Return preserves origin query and re-prompts; entry Escape and browser Back; reload/new-tab/version clearing; manual Escape/trigger focus; no non-GET acknowledgement/reopen requests.
- Storage read/write SecurityError fallback: announcement, continued navigation, no repeat until reload. No-JavaScript same-copy fallback and all four legal-route exemptions.
- Reduced motion and an in-dialog preference switch: immediate final state, no modal animation loop.
- Representative doubled computed font sizes/line heights on Privacy and the dialog, retaining the hierarchy. Paragraph text verified at 32px versus 16px baseline; legal content contains horizontally and dialog scrolls with Close reachable. This is an explicit 200% text-size simulation, not physical browser/OS zoom.
- All nine existing seeded account roles sign in through the real permitted portal endpoint; direct authenticated entry, cleaned dashboard, footer links, account-menu reopening/focus restoration, legal roundtrip/session retention, Account helper and actual sign-out/version retention.
- Fresh anonymous 404 entry and preserved login guard; signed-in Student attempting Technology receives the actual server-denied state, with disclosure and legal footer, without access granted.

Visual review used one batched initial review and one bounded confirmation. The only presentation correction was explicit blue underlines for disclosure/legal/fallback links and the correct muted token. Initial-title and keyboard-bottom disclosure captures distinguish top-of-content focus from internally scrolled legal links. A harness selector initially assumed every page had an article; it was corrected for the modal and the final run passes. Another source-sentinel check used the wrong casing/old label; corrected to the actual unchanged source text.

Representative evidence: [320px entry](fd8-after/entry-initial-entry-320x812.png), [desktop entry](fd8-after/entry-initial-entry-1440x900.png), [375px Disclaimer](fd8-after/disclaimer-375.png), [1920px Privacy](fd8-after/privacy-1920.png), [doubled dialog text](fd8-after/disclosure-text-enlargement.png), [doubled Privacy text](fd8-after/privacy-text-enlargement.png), [Student dashboard](fd8-after/student-clean-dashboard.png), [Operations dashboard](fd8-after/operations-clean-dashboard.png), [denied state](fd8-after/denied-student.png), [no-JS entry](fd8-after/nojs-home.png).

## Validation

| Command/check                                               | Result                                                                                                                                                              |
| ----------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| pnpm test                                                   | PASS: 52 tests, 7 files                                                                                                                                             |
| pnpm test:db                                                | PASS: 12 tests                                                                                                                                                      |
| pnpm test:auth                                              | PASS: 9 tests                                                                                                                                                       |
| pnpm test:access                                            | PASS: 21 tests                                                                                                                                                      |
| pnpm lint                                                   | PASS                                                                                                                                                                |
| pnpm typecheck                                              | PASS                                                                                                                                                                |
| pnpm build                                                  | PASS; repeated after the bounded CSS correction, all four public routes compiled                                                                                    |
| pnpm format:check                                           | Historical unchanged debt only: PHASE-4-MANUAL-AUDIT.md and final-check-before-uiux/{index.html,manifest.json,source-integrity-before.json}; all changed files pass |
| git diff --check                                            | PASS                                                                                                                                                                |
| browser confirmation                                        | PASS: 277 checks, 42 captures, zero final errors                                                                                                                    |
| B warning/source scope audit                                | PASS: 42 IDs and four additional sentinels; no protected source changes                                                                                             |
| installed Impeccable detector, new disclosure/route sources | PASS: no findings                                                                                                                                                   |

No DB reset, credential synchronization or package install. DB/auth/access suites ran before the last presentation-only CSS correction; lint/typecheck/format/diff and the production build/browser confirmation cover final changes. The existing port-3000 server was preserved; only the isolated port-3108 preview created for this task was stopped.

## Exact changed files

25 application source files:

- `src/app/[portal]/[[...section]]/page.tsx`
- `src/app/about/page.tsx`
- `src/app/account/create/applicant/page.tsx`
- `src/app/account/create/page.tsx`
- `src/app/account/page.tsx`
- `src/app/account/recovery/page.tsx`
- `src/app/globals.css`
- `src/app/layout.tsx`
- `src/components/development-identity.tsx`
- `src/components/portal/app-shell.tsx`
- `src/components/public/site-shell.tsx`
- `src/features/academic/academic-page.tsx`
- `src/features/applicant/applicant-page.tsx`
- `src/features/identity/account-profile.tsx`
- `src/features/operations/operations-page.tsx`
- `src/features/records/records-page.tsx`
- `src/features/student/student-page.tsx`
- `src/features/technology/technology-developer.tsx`
- `src/app/acceptable-use/page.tsx`
- `src/app/disclaimer/page.tsx`
- `src/app/privacy/page.tsx`
- `src/app/terms/page.tsx`
- `src/features/disclosure/demo-disclosure-provider.tsx`
- `src/features/disclosure/disclosure-content.ts`
- `src/features/disclosure/project-information-page.tsx`

Documentation/evidence:

- `docs/phase-4/P4-FD8-DISCLOSURE-LEGAL-IMPLEMENTATION.md`
- `docs/phase-4/P4-ROADMAP.md`
- `docs/phase-4/fd8-after/verify.cjs`, `notice-verification.cjs`, `manifest.json`, `notice-verification.json`, and 42 PNG captures listed individually in the manifest.

The working tree began clean. Generated `next-env.d.ts` production/typegen import changes are restored to their pre-task contents. No backend/API/server-access source, auth configuration, DB/schema, fixtures, domain providers, workflow logic, test contract, package/lockfile or credential changes.

## Limits and stop

Local Chromium evidence does not establish physical iPhone/Safari/WebKit or screen-reader acceptance. The 200% check is computed-text simulation. No hosted release, hosting/logging verification, external security/legal review or new complete sample-PDF rendering run is claimed. Print warning sources and existing print styling remain intact. First-entry disclosure appears after hydration; no-JS users receive the visible fallback. Privacy must be rechecked when actual hosting changes.

Credentials were **not changed or published**. No future Demo Accounts list or dead Login toggle was introduced. Roadmap preserves prior RC/M7 history, marks FD7 accepted and FD8 complete after the acceptance above, and leaves **RC2A next / NOT STARTED**, followed by RC2B. Work stops after FD8.

## FD8 disclosure-only visual/content correction — 1 October 2026

**PASS — bounded correction complete. RC2A NOT STARTED.** The owner's correction brief supersedes only the original modal paragraph presentation above. The original 277-check/42-image evidence remains historical and unchanged. Current correction evidence is [correction-manifest.json](fd8-after/correction-manifest.json).

The dialog now begins with a centered 32px yellow-accent SVG warning symbol, stronger 24px About this demo heading, the exact requested supporting sentence, and a centered short yellow keyline. The generic focus outline is suppressed only on the static title that receives initial programmatic focus; every interactive link/button keeps its visible keyboard focus. No title border, danger card, banner, gradient or animation was added.

Four semantic list rows keep their explanations left aligned under explicit headings: Unofficial project, Fictional demonstration data, Do not enter real information, Temporary demo state. Each row has one restrained 20px inline SVG symbol with consistent alignment: important boundary, sample warning, prohibited entry or reset. All symbols use aria-hidden and focusable=false; accompanying text carries their meaning. There is no card per point or new icon package.

The body still derives from the four locked paragraphs, including the name/seal/campus-reference boundary, fictional-only instruction, explicit-source qualification, reset scopes and real-server sign-in statement. The third displayed row adds the owner's explicit “confidential” wording. This clarifies the existing real-information boundary; it adds no stronger affiliation, privacy, transaction or legal-effect claim. Shared source copy, four legal pages and no-JavaScript fallback are unchanged. No version bump is needed for this presentation correction.

Learn more is a named resource navigation group with the same four ordinary underlined links and destinations, arranged 2×2 above 600px and one column below. Actions have clearer separation: secondary Leave demo on the left and the blue primary action on the right. Mobile stacks them with the dominant primary action last/full width; manual Close remains right aligned on desktop. Desktop maximum width changes only from 32rem to 34rem (32px at the normal root size) to accommodate the row symbol column. Existing viewport margins, maximum height, internal body scrolling, pinned actions, native modal focus protection and reduced-motion behavior remain.

**149/149 browser checks pass; 16 new captures.** Installed Edge Chromium/Playwright exercised a production preview at 320×812, 375×812, 768×900, 1440×900, 1920×1080 and additional short 812×375 landscape. At every width: named dialog, four row headings, locked body content, hidden symbols, centered/unframed initially focused title, exact support copy, resource columns/underlines, no horizontal overflow, viewport containment, reachable actions, visible link focus and forward/reverse focus trap. Each legal link was followed before acknowledgement without storing a choice; Return preserved the Login query and re-prompted. Entry Escape and Leave demo left without acknowledgement. Exact version/query retention, reload suppression, manual Close/Escape and trigger focus restoration pass.

At 375px and 1440px, every computed font size/line height was doubled, with body text confirmed at 32px. Internal scrolling and reachable legal links/actions pass; the primary action still works. Reduced motion reaches the immediate final state. This remains a text-size simulation, not physical browser/OS zoom. Physical devices, Safari/WebKit and screen readers were not newly verified. One batched visual inspection found no additional defects requiring correction.

Evidence examples: [320px intro](fd8-after/correction-320x812-top.png), [375px resources/actions](fd8-after/correction-375x812-resources.png), [1440px intro](fd8-after/correction-1440x900-top.png), [1920px complete composition](fd8-after/correction-1920x1080-top.png), [short landscape](fd8-after/correction-812x375-resources.png), [375px doubled text/resources](fd8-after/correction-375-doubled-resources.png). The manifest lists all 16 images, source hashes, baseline commit/dirty status, routes, sizes, motion preferences, interaction states and timestamps.

Correction validation: **pnpm lint PASS; pnpm typecheck PASS; targeted Prettier PASS; git diff --check PASS.** Production build also passes; installed Impeccable detector reports no findings on the modified component. Earlier DB/auth/access/unit suites are not claimed as rerun for this presentation-only correction. The generated next-env production/typegen import changes were restored before delivery. The isolated port-3108 preview was stopped; the pre-existing server was preserved.

Exact correction files: src/app/globals.css; src/features/disclosure/demo-disclosure-provider.tsx; this report; fd8-after/verify-correction.cjs; fd8-after/correction-manifest.json; the 16 correction-*.png captures listed in that manifest. No acknowledgement/storage/state/focus-handler code, legal route/content, auth/backend, credential, fixture or workflow changes. No commit, push or deployment. **Stop after this FD8 correction; RC2A NOT STARTED.**
