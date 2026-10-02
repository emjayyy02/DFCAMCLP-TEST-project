# P4-RC2B — Final Defect Fixes and Public Demo Release Gates

**PASS — 2 October 2026. READY FOR PUBLIC DEMO CREDENTIAL HANDOFF.** RC2A-F01/F02/F03 are resolved, the approved email-only Demo Accounts panel is implemented, and the required local release gates pass. The only permitted exception is the unchanged four-file formatting debt. RC2A is accepted through the owner's RC2B implementation brief. Stop after RC2B; no credential handoff or deployment was performed.

## Authority and scope

The current RC2B brief supersedes the earlier plan where it differs: failed sign-out preserves temporary presentation until confirmed success; this milestone has no password section or placeholder; evidence belongs in `rc2b-final/`; the next milestone is **PUBLIC DEMO RELEASE / CREDENTIAL HANDOFF**. Earlier M7/FD/RC2A reports and evidence remain historical records.

Read against `DFCAMCLP.md`, the RC2A audit and fix plan, FD7/FD8 disclosure documents, FD6 identity/profile report and roadmap. Frontend design, anti-vibecoded UI and Impeccable craft-floor/harden guidance were applied within the existing visual lock. No redesign, new package, route, schema, permission, credential model or school workflow was introduced.

## Confirmed fixes

| Finding                | Final behavior                                                                                                                                                                                                                                                                                                     | Fresh evidence                                                                                                                                                                                           |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| RC2B-01 / RC2A-F01, P1 | Sign out is pending during the request. Only a successful server result with `success: true` clears presentation and redirects to Login. Returned errors, HTTP failure, network failure and unconfirmed success stay on the current route, retain presentation, show a `role="alert"` message and re-enable retry. | Account, desktop menu and mobile drawer fault cases in `manifest.json`; eight Account reload cases in `refresh-confirmation.json`; successful logout and protected-route denial for all nine identities. |
| RC2B-02 / RC2A-F02, P2 | The semantic H1 on all four legal destinations receives programmatic focus with `preventScroll`. The heading is outside the normal Tab sequence; subsequent Tab reaches legal navigation. Pointer presentation and Back remain usable.                                                                             | Four pre-acknowledgement disclosure links, heading focus and Back/query checks; `legal-*-focus-1440.png`. These images show the next Tab target after the H1 assertion.                                  |
| RC2B-03 / RC2A-F03, P2 | The directory notice retains “Read-only account directory” once and describes fictional authorized portal access once. Contextual B36 and the existing non-mutating directory explanation remain.                                                                                                                  | Five `technology-correction-*.png` captures and IT Admin / Faculty + Developer access checks.                                                                                                            |

Sign-out failure feedback deliberately says success could not be confirmed: a lost response cannot establish whether the server revoked a session. The client makes no false success claim. Refresh and protected routes remain server-authorized.

## Demo Accounts panel

Login now offers **View demo accounts**. A native modal dialog presents exactly nine fixed fictional emails, existing role labels and authorized portal labels. A server-only projection passes only `email`, `label` and `portals` into the client; it does not enumerate live users or expose access-model identifiers, credentials or hidden auth records.

| Role/display label   | Fictional email                     | Existing authorized portal(s) |
| -------------------- | ----------------------------------- | ----------------------------- |
| Applicant            | `applicant.test@example.invalid`    | Applicant                     |
| Student              | `student.test@example.invalid`      | Student                       |
| Faculty              | `faculty.test@example.invalid`      | Academic                      |
| Program Coordinator  | `coordinator.test@example.invalid`  | Academic                      |
| Admissions & Records | `records.test@example.invalid`      | Admissions & Records          |
| Maintenance Staff    | `operations.test@example.invalid`   | Operations                    |
| School Admin         | `school-admin.test@example.invalid` | Operations                    |
| IT Admin             | `technology.test@example.invalid`   | Technology                    |
| Faculty + Developer  | `faculty-it.test@example.invalid`   | Academic · Technology         |

Every row has Copy email and Use this account. Actual clipboard write/readback passed for all nine emails; clipboard denial gives a selectable-email fallback. Prefill changes the email only, closes the panel and focuses the email input. Student, IT Admin and multi-membership prefill checks preserve the password and portal, issue no login request, create no session and do not submit the form. The panel remains independent of the login submit behavior.

The H2 receives opening focus; all 19 buttons are keyboard reachable; Tab/Shift+Tab remain contained; Escape and Close restore trigger focus. Rows scroll within the dialog and the controls remain usable at small widths and doubled text. A polite status announces clipboard results. Reduced motion disables the existing FD6 entrance animation. A guard prevents opening it alongside an already-open disclosure dialog.

There is **no shared-password section, value or placeholder**. The separate panel, public projection and login prefill callback leave a clear place for later approved handoff UI without mixing credentials into the account list.

## Fresh regression and evidence interpretation

All RC2B evidence is new in [rc2b-final](rc2b-final/README.md). Testing used the fresh Next.js production build in installed Microsoft Edge Chromium at isolated `localhost:3109`. `BETTER_AUTH_URL` was overridden for that process only; the existing port-3000 listener and `.env` were preserved.

| Evidence                                       | Result                                                                                                                                                                                                        |
| ---------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `manifest.json`                                | 333 raw assertions: 325 pass and eight incorrect neutral-Account reload predicates. No uncaught page errors. All 46 responsive measurements pass; 34 captures.                                                |
| `refresh-confirmation.json`                    | 64/64 pass across the same eight Account failure/reload cases; guarded Account identity, protected Student access, successful retry and post-logout denial are confirmed. Eight new captures; no page errors. |
| `doubled-panel-confirmation.json`              | 40/40 pass: all 19 actions remain focus-contained and visibly reachable at doubled text on 375 and 1440 widths; Escape restores focus.                                                                        |
| `release-checks.json`                          | 16/16 local safety/integrity gates pass, including all 42 B notices.                                                                                                                                          |
| `snapshot-before.json` / `snapshot-after.json` | Nine accounts and nine credential records; credential, logical-account and membership fingerprints match. Exactly ten intended source additions/changes.                                                      |

The eight raw failures expected a portal Account trigger on the neutral `/account` page, which intentionally uses a Development header. This was a harness error: subsequent successful retry already demonstrated a valid session. The focused confirmation checks the server-rendered Account identity and protected Student route instead. The raw failures are preserved, not relabeled as passing or presented as a clean 333/333 run. Earlier incomplete harness attempts and the initial whitespace-sensitive notice result are also preserved with explanations in the evidence README.

Coverage includes invalid and valid browser login; all nine isolated identities across 58 allowed route/identity combinations and nine direct denial cases; neutral Account identity; all nine normal sign-outs and denied protected entry afterward; multi-membership Academic/Technology switching; IT Admin denied Developer; Faculty + Developer denied IT Admin directory access and allowed Developer.

Ten sign-out fault cases cover Account at all five widths, desktop menu and mobile drawer, aborted network requests, HTTP 503 and HTTP 200 with `success: false`. Pending state, same route, enabled retry, accessible failure, retained bio, successful retry and post-logout denial pass. The eight Account cases additionally pass the corrected reload confirmation. Reload resets temporary presentation normally while retaining a valid server session.

All four legal links work before acknowledgement, focus the heading, preserve the source query and return via Back to the disclosure. Accepted disclosure/manual reopening and legal return also pass. The four legal pages, panel, corrected Technology notice and Account fault state were measured at **320×812, 375×812, 768×900, 1440×900 and 1920×1080**, with doubled-text checks on affected surfaces. There is no measured page-level horizontal overflow. The 42 captures comprise the 34 main captures and eight focused reload captures. Representative final images were visually reviewed in a bounded review batch.

## Local security and preservation gates

- Exactly the canonical nine `.invalid` fictional auth identities exist; the public panel exposes only the approved role/email/portal rows. No real identity was added.
- Existing server auth, access seeds, database seeds, package manifest/lock, disclosure provider/content and global CSS match the entry snapshot. The existing dirty FD8 correction is preserved.
- All B01–B42 contextual notices remain. The four legal headings change focus only; legal wording, acknowledgement storage/version, Return behavior and disclosure composition remain unchanged.
- Configured credential/env values, actual password hashes and session token literals were checked against 27 generated client assets and the public Login response with no matches. Configured secrets also have no matches in 245 tracked text files. Values themselves were not written to the evidence.
- `.env.example` is the only tracked env file. The panel contains no password source, env read, auth call or fetch. Email selection cannot bypass authentication or grant a membership.
- Before/after database comparisons confirm unchanged credential records, logical accounts and memberships. Existing integration suites exercise and restore controlled test state; session records naturally change during login/logout testing. This is not a claim that all database bytes remained identical.

## Full validation

| Command             | RC2B result                                                                                           |
| ------------------- | ----------------------------------------------------------------------------------------------------- |
| `pnpm test`         | PASS — 56 tests in eight files, including four new public-projection tests.                           |
| `pnpm test:db`      | PASS — 12 tests.                                                                                      |
| `pnpm test:auth`    | PASS — nine tests.                                                                                    |
| `pnpm test:access`  | PASS — 21 tests.                                                                                      |
| `pnpm lint`         | PASS — zero errors; five existing unused-disable warnings in archived RC2A harnesses.                 |
| `pnpm typecheck`    | PASS.                                                                                                 |
| `pnpm format:check` | Only the four unchanged historical files below fail; all RC2B changed files pass targeted formatting. |
| `pnpm build`        | PASS — production build and generated routes.                                                         |
| `git diff --check`  | PASS.                                                                                                 |

Permitted historical formatting debt: `docs/phase-4/PHASE-4-MANUAL-AUDIT.md`, `final-check-before-uiux/index.html`, `final-check-before-uiux/manifest.json` and `final-check-before-uiux/source-integrity-before.json`.

Two scoped tooling adjustments preserve prior evidence while running full gates: ESLint permits CommonJS imports only in the completed `rc2a-audit/**/*.cjs` harnesses; Prettier excludes only the immutable `rc2a-audit` archive. No product lint rule is disabled and the new RC2B evidence is formatted and linted. The generated `next-env.d.ts` build-path change was restored to its entry contents.

## Changed files and limits

Product changes: `src/features/identity/sign-out-button.tsx`; `src/features/disclosure/project-information-page.tsx`; new `project-information-heading.tsx`; `src/app/[portal]/[[...section]]/page.tsx`; `src/app/login/page.tsx`; `src/features/identity/login-form.tsx`; new `demo-accounts-panel.tsx`, `demo-accounts.css` and server-only `public-demo-accounts.ts`. New meaningful projection tests: `src/tests/public-demo-accounts.test.ts`. Tooling: `eslint.config.mjs` and `.prettierignore`. Documentation: this report, `P4-ROADMAP.md`, and fresh `rc2b-final/` scripts/results/screenshots. Pre-existing dirty FD8 and RC2A artifacts are retained and are not RC2B edits.

**Remaining confirmed P0/P1/P2 in this scope: none.** Browser keyboard/focus/semantic checks do not constitute a screen-reader certification. This RC2B run uses Edge Chromium, not physical mobile devices or a fresh Safari/Firefox matrix. Doubled text is a CSS text-size simulation, not a native browser zoom certification. Hosted origin/cookie/proxy/logging behavior, public deployment database isolation, abuse/rate limits, concurrent shared-account behavior, mutating endpoint review and Git-history secret review remain release-handoff checks, not claims established by this local run.

The unchanged FD6/FD8 historical prose mentions clearing presentation on sign-out intent; the newer RC2B brief explicitly requires preservation on failed sign-out. This report records that supersession while honoring the instruction to keep disclosure/legal content unchanged except heading focus. Handoff should reconcile that wording under its own authorization.

No credential/password was changed, synchronized, displayed or published; no reset, new package, commit, push or deployment occurred. Approval of the final public password and actual hosted release checks are still required before publication. **READY FOR PUBLIC DEMO CREDENTIAL HANDOFF.**
