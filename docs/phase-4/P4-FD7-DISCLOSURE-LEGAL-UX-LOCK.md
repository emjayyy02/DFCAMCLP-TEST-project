# P4-FD7 — Disclosure and Legal UX Lock

**1 October 2026 · PASS: complete planning specification, owner acceptance pending.** No implementation authorized. [Notice audit and source evidence](P4-FD7-DEMO-DISCLOSURE-AUDIT.md). FD8 is next only after acceptance and its explicit implementation instruction; RC2A/RC2B remain after FD8.

## 1. Purpose, authority and amendments

Help first-time visitors understand the independent portfolio-demo boundary once, then explore normal pages without repeated global banners. Readers include public visitors and all six authenticated portal families. Entry is a short reading/decision task; information pages are reading surfaces. Acknowledgement is a browser preference, not legal consent, a signature, an institutional transaction or an authorization grant.

Preserve Premium Civic-Academic identity, FD5/FD6 expression, canonical facts, all guards, session behavior, fixtures, workflow logic and search/filter/sort/query contracts. The newer owner brief supersedes the older roadmap's “FD7 final QA” label: FD7 now plans disclosure/legal UX, FD8 implements it, RC2A/RC2B verify the completed product.

After owner acceptance this lock narrowly amends Final Visual Lock §7's once-per-page/non-dismissible global disclosure, §8's long footer disclosure, FD5 §§10–11's blanket notice-retention language and historical roadmap O4. Only A inventory clauses are centralized. Contextual warnings/V1 ASSUMPTION/sample documents remain visible. FD5's ban on localStorage/sessionStorage continues for workflow/photo/bio state; the sole exception is the new acknowledgement preference below. No need to rewrite historical lock/report files.

## 2. First-entry disclosure: exact copy and structure

One root-owned native modal dialog, not a cookie banner or per-portal modal. Neutral white surface, Source Sans 3, existing 8px overlay radius/border/elevation, blue primary action and one restrained yellow institutional keyline. No extra seal, hazard icon, red warning wash, illustration, opt-in checkbox or scroll reveal.

Title: **About this demo**

Copy, four short paragraphs:

> This is an independent educational and portfolio side project. It is not affiliated with, commissioned by, operated by, or endorsed by DFCAMCLP. Its name, seal, and campus references are used only to demonstrate the concept.
>
> People, accounts, grades, schedules, applications, documents, tickets, and operational records shown are fictional or sample data. No displayed workflow represents an official institutional transaction or policy unless explicitly sourced.
>
> Use fictional details only. Do not enter real student, employee, or institutional information. Demo actions may simulate workflows without performing real school actions.
>
> Some local changes reset on reload or when you leave their workspace. Account photo and bio reset on reload or sign-out. Sign-in uses the project server; the Privacy & Data Notice explains what is stored.

Primary button, exact: **I understand — Enter demo**

Secondary links, exact and always usable before acknowledging:

- Project Disclaimer → `/disclaimer`
- Demo Terms of Use → `/terms`
- Privacy & Data Notice → `/privacy`
- Acceptable Use → `/acceptable-use`

Small secondary exit: **Leave demo** → `/disclaimer`. At first entry, Escape follows that same public information destination without writing acknowledgement. No backdrop dismissal or implicit acceptance. On manually reopened disclosure, show **Close** instead; Escape/Close returns focus to its trigger without changing the stored version. Primary action updates the preference and closes; reopening does not demand acceptance again.

Preserve requested destination/path/query/scroll when acknowledging. No redirect to a default portal/home after acceptance. Opening a legal link closes the dialog and navigates normally without writing acknowledgement. Legal pages offer **Return to demo**: back to the originating safe same-origin UI route in memory, with disclosure reopened if still unacknowledged; direct legal arrivals return to `/`. No arbitrary redirect URL from external query input, stored record selection or token. Browser Back remains native and must be tested; no history trap.

## 3. Browser acknowledgement contract

| Decision                                  | Locked behavior                                                                                                                                                                                                                                                                                                            |
| ----------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Mechanism                                 | `localStorage`, first-party browser origin only, wrapped in read/write error handling. No cookie/API/database acceptance record. Not tied to a fictional account.                                                                                                                                                          |
| Key / value                               | Key `dfcamclp.demoDisclosure.ackVersion`; value exactly `fd7-v1`. Store only the version string, no user ID/email, timestamp, credential, bio/photo, workflow data or fingerprint.                                                                                                                                         |
| First entry                               | After client storage check, show once on any normal UI route, including direct login/account/portal/denied/404 entry. One owner survives client navigation; no flash of repeated modal at every route.                                                                                                                     |
| Known version                             | Suppress automatic dialog for that origin/browser profile; normal browsing. New tabs read same key.                                                                                                                                                                                                                        |
| Version bump                              | Change version when material affiliation, data behavior, simulation boundary or use conditions change; not for typo/layout changes. Unknown/malformed/old value behaves unacknowledged.                                                                                                                                    |
| Storage denied/quota error                | Acknowledge in current root-mounted memory; close normally. Announce quietly: “Understood for this visit. Your browser could not remember this choice.” Reappears after full reload/new tab; no redirect loop.                                                                                                             |
| Storage cleared/private window/new origin | First-entry disclosure returns. A different domain/port is a different origin. Clearing localStorage does not sign out or erase server records.                                                                                                                                                                            |
| Sign-out/identity change/reload           | Do not clear acknowledgement on sign-out or reset it with profile/workflow state. Matching version survives reload; actual session validation is independent.                                                                                                                                                              |
| Other tabs                                | Read shared value on mount; storage event may update future eligibility. Never force-close a modal currently being read or interrupt an active workflow because another tab changes the key; defer re-prompt to next full entry.                                                                                           |
| Legal exemptions                          | `/disclaimer`, `/terms`, `/privacy`, `/acceptable-use` always readable without modal/acceptance/auth. No acknowledgement UI on API/static assets or non-UI responses.                                                                                                                                                      |
| No JavaScript                             | Public/legal content and server guards still work. Render a concise static disclosure card using the same title/copy/legal links on normal UI surfaces, with “Continue to page content” anchor; no false claim that acknowledgement was remembered. The no-JS fallback is part of this one system, not another banner set. |

Check browser storage only on client mount, with an explicit unresolved state; do not read it on server or cause hydration mismatches. The native modal's inert background prevents normal interaction while shown. This is a courtesy disclosure, not an access control mechanism: disabling scripts or editing storage cannot grant or revoke memberships. Server guards must execute as before.

## 4. Reopening and persistent access

All public/auth, six portal shells, Account, denied and 404 surfaces expose the same secondary footer group. Preserve current footer links, independent author attribution, public destinations and safe recovery actions.

Visible footer entries in this order: **Disclaimer · Terms · Privacy · Acceptable Use · About this demo**. The first four are links; the last is a button that opens the existing root disclosure without navigating or writing a value. Accessible nav name: “Project information”. Short attribution: **Independent portfolio demo.** No long footer paragraph. No “DFCAMCLP all rights reserved” ownership claim.

Also add **About this demo** as a tertiary Account-menu entry after View profile and before the sign-out separator, and beside Account Profile's existing presentation help. Close the account popover before opening the dialog; return focus to the Account trigger when that menu item no longer exists. No new Help route or primary/sidebar nav item. Footer is the persistent public fallback when no account exists.

For a manual reopen, retain the complete disclosure copy and all four links; Close never clears the stored preference. Do not hide legal access inside an authenticated-only Account menu.

## 5. Exact removal and contextual policy

The audit's **A01–A15** and **B01–B42** are the implementation checklist. A01–A05 remove family-wide banners; A06/A08/A09 replace long shell footers; A07/A10–A13 remove duplicated body/global clauses; A14/A15 consolidate mixed statements while preserving nearby B meaning. B01–B42 retain task-specific warnings, including all eight contextual DemoNotice sites/variants beyond the five global family strips.

Do not execute deletions until root disclosure, four legal pages, footer/reopen and storage-failure/no-JS access exist together. Retained contextual notices use specific headings (“Entry preview”, “Recovery preview”, “Service model”, “Directory scope”, “Facilities model”, “Reference scope”, “Read-only account directory”, “System reporting”), normal inset/rule typography and existing aside/help/live-result semantics. No “Demo workspace” headline repeated on each page. Keep a warning at the decision point, not solely in Privacy.

Do not strip every occurrence of demo/sample/fictional. Sample documents retain their own on-screen and printed non-official markings. Keep consequential/destructive reviews, errors, simulated save/results, no-delivery statements, V1 ASSUMPTION and reset caveats where they prevent reliance on an edit. Preserve domain-account distinction, read-only scope, unsupported live-health/official-policy warnings and fixture-provided announcement bodies. No new destructive workflow.

## 6. Shared public information-page composition

Four static public routes, outside portal guards and independent of acknowledgement. Use existing SiteShell and original identity, no duplicate seal. One title, one short standfirst, readable updated/version line, four-link local page navigation with current-page indication, constrained reading measure (42rem/60–72ch), plain sections with headings/rules and existing underlined links. No card around each paragraph, legal accordion, hero/campus-image repetition or marketing CTA. Source Serif 4 can serve public page H1/section heading roles already locked; body stays Source Sans 3, 16px. No additional font/assets.

Each page shows **Project notice · Version fd7-v1 · Updated 1 October 2026** when these texts are first implemented; later material edits update version/date truthfully. Shared closing line: **These notices explain a portfolio demo. They are not presented as lawyer-reviewed legal documents.** No checkbox, signature, consent ledger, jurisdiction clause, damages waiver, invented contact or institutional approval.

## 7. Project Disclaimer — locked content

Route `/disclaimer`; title **Project Disclaimer**; standfirst **The purpose and limits of this independent portal concept.**

### Independent concept

This is an independent educational and portfolio side project. It is not affiliated with, commissioned by, operated by, or endorsed by Dr. Filemon C. Aguilar Memorial College of Las Piñas (DFCAMCLP).

### Institutional references

The DFCAMCLP name, supplied seal, campus references, and campus photograph demonstrate the concept's setting. Their appearance does not imply approval or transfer ownership of institutional material to the project author. Institutional facts follow the project's sourced reference notes; unknown policies remain labeled as assumptions. This is not a claim of permission or a rights determination.

### Fictional records and sample workflows

People, accounts, grades, schedules, applications, documents, tickets, and operational records shown are fictional or sample content. No displayed workflow represents an official institutional transaction or policy unless explicitly sourced. Sourced context does not make a simulated action official.

### No official services

Demo actions do not submit real applications, book school appointments, deliver recovery messages, release grades, issue certificates, grant institutional access, or update DFCAMCLP records. Sample documents are not valid for official use. Use official institutional channels for real school matters.

### Portfolio purpose

The project illustrates interface and software-development decisions. Use fictional details only; do not enter real student, employee, or institutional information. Read the Demo Terms of Use, Privacy & Data Notice, and Acceptable Use for the demo's boundaries.

## 8. Demo Terms of Use — locked content

Route `/terms`; title **Demo Terms of Use**; standfirst **How to explore this educational demonstration.**

### Purpose and permitted testing

You may browse the concept, use designated fictional demo accounts when available, and try the interface's sample workflows and normal navigation. Treat results as demonstrations, not school services or institutional decisions.

### Use fictional details

Do not submit real confidential, personal, student, employee, or institutional data, or reuse a personal or school password. Account-entry and recovery previews do not create accounts or deliver messages. Real demo sign-in is different: credentials are processed by the project server as described in the Privacy & Data Notice.

### Testing limits

Do not attempt unauthorized access, bypass access controls, abuse shared accounts, automate bulk sign-ins or requests, or use the project to disrupt other visitors. Normal manual exploration of allowed routes and sample controls is permitted. No credential attacks or data extraction through unprovided access.

### Availability and accuracy

The demo may change, become unavailable, or reset. It does not guarantee continuous availability, complete or current institutional information, or accuracy for real school decisions. Workflow rules marked V1 ASSUMPTION are project assumptions. Use official channels to verify real requirements and transactions.

### Demo accounts and local changes

Demo accounts represent fictional roles, not individual institutional identities. Access remains limited by the server's assigned memberships and permissions. Local workflow edits and personal photo/bio changes have the reset behavior described in Privacy; acknowledgement does not save them. Follow Acceptable Use when using a shared account.

## 9. Privacy & Data Notice — actual behavior and proposed addition

Route `/privacy`; title **Privacy & Data Notice**; standfirst **What this demo sends to the project server and what stays temporarily in your browser.**

This content is based on current source, not a statement about uninspected hosting services. FD8 publishes the acknowledgement paragraph only when implemented and verified. Avoid “everything stays in your browser”, “no cookies” and “we collect nothing”.

### Sample school content

Displayed school people and operational records are fictional/sample content. School workflow edits run in temporary browser memory and are not submitted as institutional transactions. This does not mean that the project's sign-in system is simulated.

### Sign-in and sessions

Signing in sends the demo email, password, and selected portal to the project server. Better Auth verifies credentials using the project's authentication database. Successful permitted sign-in uses a browser session cookie and a database-backed session. The project stores demo account identity and access information, authentication credential records, and session identifiers, expiry and timestamps. The session schema also supports IP address and browser user-agent information; the current inspection does not establish which of those optional fields are populated for every request.

Sessions are configured with a seven-day expiry and a daily refresh interval. That is an authentication setting, not a promise to delete database records after seven days. Reloading a page may reset demo work while leaving a valid sign-in session intact. Sign out uses the real authentication service. Choosing a portal or acknowledging this notice does not grant access.

### Temporary workflow and form information

Applicant drafts/checklists/scenarios, Student requests, Academic attendance/grade drafts and submissions, Records processing, and Operations updates use browser memory scoped to their current workspace. They reset on reload, a new tab, or when that workspace's provider is removed, such as leaving its portal. Entry-preview name/email/program and recovery-preview email stay in that page's memory; those previews do not perform account lookup, registration or email delivery. Use fictional details only.

### Photo and bio

Selected JPEG, PNG, or WebP images up to 2 MB are decoded locally for staged preview. They are not uploaded by the current photo controls or saved to persistent browser storage. Browser object URLs are released when replaced, discarded, or their owning state is cleared. Account photo and optional plain-text bio (up to 240 characters) stay in this tab across ordinary client navigation and authorized portal switching. They clear on reload, arrival at sign-in, sign-out intent, or account identity change. A sample Applicant/Student profile photo is separate from the signed-in account and clears when its portal workspace is removed. Do not choose images or write text containing real confidential information.

### Disclosure acknowledgement — FD8 addition

After you choose “I understand — Enter demo”, the browser stores only the current disclosure version in first-party localStorage. It is not sent as a backend acceptance record and is not attached to an account. Clearing that item, using another browser profile/origin, or a material version change makes the disclosure appear again. If storage is unavailable, the choice lasts only for the current visit. It does not persist photos, bio, workflow edits, or authentication.

### Links, history, clipboard and print

Some selected records, views, searches, filters, sorting and dates appear in URLs and may remain in browser history independently of temporary workflow state. Do not put real confidential information into these controls. Printing or saving sample previews creates files/output under your control; sample markings remain. Copying the developer route map writes to your clipboard only when you activate that control.

### What is not established

No application analytics integration was identified in the inspected source. Hosting, proxy and infrastructure logging practices have not been verified by this notice. No claims are made here about data selling, transport or database encryption, blanket absence of tracking, database deletion schedules, or lawyer-reviewed compliance. Browser-memory reset and session expiry are distinct from server-data deletion. Public-hosting changes require this notice to be checked against the actual deployed configuration before making additional claims.

## 10. Acceptable Use — locked content

Route `/acceptable-use`; title **Acceptable Use**; standfirst **Keep exploration within the portfolio demo.**

- Use the project for educational demonstration and permitted interface testing.
- Enter fictional details only. Do not provide real confidential, student, employee, or institutional information or real personal/school credentials.
- Do not attempt unauthorized access, bypass permissions, attack credentials, or disrupt the service through abusive automation.
- Do not abuse shared demo accounts or try to use them for real school transactions.
- Do not represent this independent project or its sample documents as official DFCAMCLP software, services, records, or policy.

Normal manual browsing and permitted sample actions are welcome. Access controls still apply to every protected destination. For real institutional matters, use official channels.

## 11. Future Demo Accounts entry — no credential release

Reserve **Login → View demo accounts** below the form, beside existing recovery/account-entry links, as a secondary expandable panel. It will show a semantic role/fictional-email/shared-password/portal-purpose register, grouped by task rather than a promotional card grid. On mobile use labeled rows; retain a clear close/collapse control and the login warning. Keyboard-operated toggle with expanded state and associated region; no nested dialog on top of first-entry disclosure.

FD8 may reserve placement/copy in documentation but must not publish active credentials or a nonfunctional toggle without a separate credential-release instruction. No password values, environment secrets or final credential roster in FD7 documents or UI. Public credential release is a later owner gate; server membership remains authoritative. Displaying a role never grants access. Multi-portal accounts list only their actual permitted demonstrations when approved. No automatic sign-in, account creation, password reset/sync or account mutation in FD7/FD8 disclosure work.

## 12. Mobile, focus and motion

Disclosure uses a 32rem maximum width with 16px viewport gutters, existing 24px desktop/16px mobile dialog padding and natural text wrapping. Do not cap body height in a way that loses actions; for short screens use a bounded scroll body with reachable action region, tested with software keyboard/text enlargement. Legal links wrap as full text and maintain ≥44px actionable targets. At 320px the primary label may wrap; never reduce type or truncate it. Pages use one reading column; legal nav wraps, never page-level scroll.

Native dialog with `aria-labelledby` title and a short `aria-describedby` summary; retain semantic paragraphs for full reading. Initial focus on the title (programmatically focusable), not a preselected acceptance button. Native background inertness, contained Tab/Shift+Tab, visible focus, semantic links/buttons and reliable Escape behavior. On acknowledge return to prior valid focused element, otherwise main heading/region; never focus a disabled/removed control. Reopened popover flow returns to Account trigger. Legal navigation focuses destination heading through the normal accessible route behavior.

No forced reading timer, scroll-to-enable button, ticking checkbox, blanket announcement of long legal text or repeated live alert. Reduced motion resolves all decoration/overlay transitions at 0ms, including mid-open preference changes. Normal modal arrival may reuse FD6's 180ms small translate; controls and content/focus are available immediately. Legal pages and footer have no scroll entrance effects. Test actual contrast/focus on blue/yellow/neutral surfaces; source checks alone do not certify accessibility.

## 13. FD8 ownership and exclusions

| Batch              | Existing / proposed file ownership                                                                                                                                    | Future permitted work                                                                                                                                                                                               |
| ------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Root disclosure    | `src/app/layout.tsx`; proposed `src/features/disclosure/demo-disclosure-provider.tsx`, `demo-disclosure-dialog.tsx`, `disclosure-content.ts`                          | One neutral client owner, version-only browser preference, shared modal/reopen/no-JS fallback. Keep root/layout Server Components and existing presentation provider scope. Read installed Next guides before code. |
| Public legal pages | proposed `src/app/disclaimer/page.tsx`, `terms/page.tsx`, `privacy/page.tsx`, `acceptable-use/page.tsx`; shared information-page presentation                         | Four public static pages and metadata; do not move portal guards or introduce a second shell/design system. Ensure static routes coexist with catch-all.                                                            |
| Persistent entries | `src/components/public/site-shell.tsx`, `src/components/development-identity.tsx`, `src/components/portal/app-shell.tsx`, `src/features/identity/account-profile.tsx` | Shared footer links/reopen and secondary Account entry; preserve current auth/switcher/sign-out behavior.                                                                                                           |
| Notice migration   | Audit A/B owners: family page TSX, catch-all presentation, About, account-entry/recovery pages, account preamble, Technology Developer consumer                       | Exact clause/label removals only; preserve policy/action warnings, fixtures, all filters/tabs/query contracts and print markings.                                                                                   |
| Styles             | `src/app/globals.css` plus necessary existing feature selectors                                                                                                       | Reuse tokens/geometry and fix orphan notice spacing; no redesign or changing table/form density.                                                                                                                    |
| Evidence/docs      | FD8 implementation report and new `fd8-after/` evidence; roadmap                                                                                                      | New manifests with source state/date/browser/role/route/viewport/action/motion, before references, storage state and expected/actual results. Preserve all earlier evidence.                                        |

Server auth/access services, API handlers, schemas, migrations, seeds, credentials, fixture/data modules and permission/navigation catalogs stay read-only. No analytics, cookies for acknowledgement, consent backend, photo/bio/workflow persistence, new account services, packages, installs, database reset/reseed, commit/push/deploy or institutional policy/rights claim. If frontend behavior needs unavailable backend data, report the gap instead of expanding scope.

## 14. Acceptance, release ownership and remaining gates

FD7 planning PASS means both documents are complete, inventory maps all existing notices, proposed privacy statements have actual source anchors, roadmap supersession is explicit, local links/format/whitespace pass, and source hashes match the start of this task. **FD7 is marked complete only after owner acceptance.** No new app runtime/build/accessibility result is implied.

FD8 acceptance requires:

1. Fresh-origin first entry on Home, Login, one deep link in each portal family, Account, denied and 404; one root dialog, no duplicated prompts/guard bypass. Four direct public legal routes readable before acceptance and when signed out.
2. Version persistence across reload/new tab/client navigation; malformed/old versions, cleared storage, private/new origin and storage errors tested. No acknowledgement network request/user identifier and no storage writes beyond the version item. Sign-out/identity changes leave the preference intact while clearing presentation as before.
3. Legal-link → return/Back behavior preserves safe route/query and exposes disclosure when unacknowledged. Escape/Leave never writes acceptance; manual Close never erases it; no history trapping or open redirect.
4. Footer/access on public, auth, six portals, neutral and error surfaces; Account/profile reopening, menu-to-modal focus handoff and only one modal at a time. Four page links resolve with correct current-page semantics; primary navigation stays unchanged.
5. Each A01–A15 clause removed/consolidated as assigned; each B01–B42 and content-register item retained. Explicit before/after checklist, not search-count-only proof. Printed/PDF sample markers remain; consequential workflows still disclose no real submission/delivery.
6. Privacy matches implemented storage/network/source, including real auth cookies/database, nullable metadata uncertainty, URL history and all reset scopes. Reloading work never described as signing out. Host-specific unknowns remain explicit; no unsupported tracking/encryption/selling/deletion assertions.
7. 320/375×812/768×900/1440×900/1920×1080, short landscape, text enlargement; normal/reduced motion and preference change mid-dialog; full copy/link/action visibility. Keyboard focus/Escape/return verified. Screen-reader checks need actual listening evidence or an explicit remaining limitation. No physical-device/Safari claim from Chromium alone.
8. No-JS public/legal fallback and normal accessible content navigation; server authorization unchanged. Storage failure stays usable and does not interrupt every client destination.
9. Run relevant existing tests, database/auth/access suites for root/shell integration, lint/typecheck/build, changed-file formatting and diff checks; attribute historical untouched format debt. Meaningful storage/focus/routing tests, not cosmetic snapshots mirroring code. No database reset just to test disclosure.

**RC2A — after FD8:** bounded final visual/interaction/accessibility review against FD1/FD5 plus this lock; core G01–G35 pairs and affected F/disclosure/legal extensions; motion/focus/mobile/print evidence and truthful platform limits. It does not start in FD7.

**RC2B — after RC2A:** integrated all-route/nine-account auth/access/workflow/search/filter/sort regression and full existing gates; final concept release-candidate report, retaining historical M7/FD6 results. No production or institutional approval claim. These are planning allocations; their own briefs authorize execution.

Unresolved design decisions: **none**. Owner acceptance of FD7 remains pending. Credential publication requires separate approval; hosting/proxy practices, optional auth metadata population, actual screen-reader/device behavior and any FD8 runtime defects require later evidence. No invented retention/contact/rights policy blocks this bounded source-grounded plan.

**NO source code changed. FD8 NOT started.**
