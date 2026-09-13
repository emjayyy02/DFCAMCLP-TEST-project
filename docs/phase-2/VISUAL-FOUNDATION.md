# Visual foundation

Scope: the existing development, login, and authentication-proof pages only. This user-approved visual pass supersedes the provisional green styling in the earlier surface brief. P2-M4 and school workflows remain unstarted.

## Direction recorded before implementation

Concept: a calm academic workspace, with an institutional text identity and clearly grouped information. Keep Arial/Helvetica: familiar, legible, already installed, and no new font download. Blue provides orientation; a short yellow rule is the memorable identity detail. No seal exists in the repository; use text, never an invented mark.

Hierarchy: identity and environment → page purpose → primary action → supporting facts → subtle unofficial disclaimer. Left-aligned text; titles 30–36px, section headings 20px, body 16px/1.6, labels and metadata 14px. Restrained weight and spacing distinguish roles.

```text
Development desktop                 Login desktop
DFCAMCLP       Development           DFCAMCLP       Development
--------------------------------    --------------------------------
Portal title       Development      Portal context | Sign-in panel
Explanation        notice           Fake-data note | Portal / email
Primary / secondary                                | Password / Sign in
Foundation status rows                             | Support text
Disclaimer                          Disclaimer

Mobile: identity, purpose, actions/form, supporting content, disclaimer.
```

Brief review: avoid a generic marketing hero, statistics, icon-card grid, or dark sidebar. The development page remains a status entry point. Login gives the form the strongest visual weight. White panels on a cool canvas, one pale-blue identity region and a short yellow detail provide depth without decorative imagery. Existing authentication and routes are preserved.

## Skills used

- Project `frontend-design`: concept, hierarchy, composition, typography, and review against the supplied brief before code.
- Project `find-skills`: installed-skill discovery. The project contains `frontend-design` and `find-skills`; the session catalog and local file confirm the additional installed `impeccable` skill. No skills or packages installed.
- Installed `impeccable`: project context, craft-floor accessibility, restrained surfaces, and bounded browser review. The user's explicit internal-comp-then-implement workflow and approved palette take precedence over broader concept-selection workflows.

## Palette and tokens

The source of truth is `src/app/globals.css`, mapped through Tailwind v4 `@theme inline` and the existing shadcn configuration. No competing theme engine.

| Role                                | Value / use                                                   |
| ----------------------------------- | ------------------------------------------------------------- |
| Background / surface / elevated     | `#F8FAFC` / `#FFFFFF` / `#FFFFFF`                             |
| Foreground / muted                  | `#111827` / `#6B7280`                                         |
| Border / strong                     | `#E5E7EB` / `#8793A5`                                         |
| Primary / hover / soft / foreground | `#1D4ED8` / `#1E3A8A` / `#EFF6FF` / white                     |
| Accent / soft / foreground          | `#F4C542` / `#FFF7D6` / `#111827`                             |
| Success / soft / foreground         | `#16A34A` / `#F0FDF4` / `#166534`                             |
| Warning / soft / foreground         | `#D97706` / `#FFFBEB` / `#92400E`                             |
| Destructive / soft / foreground     | `#DC2626` / `#FEF2F2` / `#991B1B`                             |
| Info / soft / foreground            | `#2563EB` / `#EFF6FF` / `#1E3A8A`                             |
| Focus ring                          | primary blue, 2px outline, 3px offset                         |
| Geometry                            | 8px controls; 12px panels; 44px minimum controls/navigation   |
| Rhythm / elevation                  | 4px spacing base; 16/24/32px groups; one soft elevated shadow |

Approved brand hex values are retained. Strong input borders and darker semantic foregrounds supplement the palette for contrast; bright success/warning colors are not used for small text. Muted text on tinted regions uses the darker hue-specific foreground.

## Surfaces and component rules

- **Neutral:** cool page canvas, white cards and header, light-neutral secondary groups. Borders and spacing do most of the separation.
- **Blue:** primary actions, links, focus, text identity, pale-blue contextual panel and selected controls. Never all cards or all headings.
- **Yellow:** short identity rule and soft contextual notice. Dark foreground; no yellow text on white. No default yellow CTA.
- **Green:** semantic success only (Active / verified). Removed from primary, hover, selection, focus and general accents.
- **Buttons:** shared primary, outline/secondary, ghost, rare accent, destructive variants; 44px minimum, wrapping labels, visible focus, pending/disabled treatment.
- **Cards:** white, subtle border, 12px radius, comfortable responsive padding; elevation reserved for actual overlays.
- **Forms:** shared Input/Select visual treatment, strong visible border, blue focus/caret, persistent labels, grouped fieldsets where useful, descriptions linked to controls. Keep native input validation and password visibility behavior.
- **Status / Badge:** success green; pending amber; rejected red; informational blue; draft neutral. Always include words. Alert uses matching semantic foreground/background; `role=alert` only for live errors.
- **Tables:** neutral header, separators, tabular numerals, restrained hover and pale-blue selected rows. Maintain real table headers; allow a labeled scroll region only for comparisons. No business table added in this pass.
- **Navigation / Sidebar:** white/light neutral, 44px items, dark defaults and soft-blue hover/current treatment. Use one active treatment, without stacked yellow/blue indicators. Visual recipes only; no portal routes or shell.
- **TopHeader / AppShell / PageHeader:** reuse white header, centered content width, neutral page canvas, clear title/support hierarchy. Future shell behavior is deferred.
- **Dialog:** elevated surface and moderate radius; future accessible primitive must own focus trapping, dismissal, labeling and restoration. No custom dialog engine or inactive modal added.
- **Tabs:** neutral container, white selected tab with blue foreground and visible focus. Keyboard behavior belongs to the future accessible primitive.
- **FormSection:** legend/heading, short description, related fields grouped with spacing and neutral separator.
- **Progress:** future vertical mobile pattern; completed semantic success when it means completion, current blue, future neutral; label each state. No workflow implemented.

## Accessibility, responsive behavior and identity

Blue/white primary actions, deep-blue on pale-blue context, dark on soft yellow, muted text, semantic chip foregrounds and input borders require measured contrast. Visible keyboard outlines, persistent labels, 44px targets, error announcements and reduced-motion override are shared rules. Do not infer full WCAG conformance from these checks.

At 375px, sections stack in reading order and actions can fill the available width. Login uses one fluid form column; at desktop its quiet contextual panel sits beside it. No fixed-height page or clipped form. Account values wrap. Validate 375×812, 768px intermediate and 1440×900.

Use the following subtle footer on the existing pages: “Unofficial concept project for educational and portfolio purposes. Not affiliated with or endorsed by DFCAMCLP.” Only fake development data is appropriate. No affiliation or official-service claim.

## Validation and handoff

Overall status: **PASS / COMPLETE.** Visual-foundation pass finalized after PostgreSQL became available. No visual-system changes were made during this finalization; no regression required a real fix.

- Environment check PASS; environment tests 12/12 PASS; lint, typecheck, formatting and production build PASS.
- Browser evidence reviewed at 375px, 768px and 1440px with no horizontal overflow. The bounded independent finish review confirmed the two requested fixes: the header identity target is 44px high, and the shorter mobile login context moves Sign in from approximately 1007px to 882px while preserving a scrollable form and the desktop composition. Captures are in `.impeccable/review/`.
- Measured contrast: primary/white 6.70:1; deep blue/pale blue 9.52:1; dark/soft yellow 16.50:1; muted/canvas 4.62:1; input borders/white 3.11:1; semantic text above 6.8:1. The neutral badge now uses the dark foreground, improving its previous 4.41:1 contrast to above 16:1.
- Keyboard password control and skip link show a blue 2px outline with 3px offset. Native required portal selection, password Show/Hide, pending submission, generic error presentation and anonymous `/account` redirect were verified. These checks do not establish full WCAG conformance.

### Post-PostgreSQL re-run (13 September 2026)

PostgreSQL blocker resolved on host. The following were re-run with no visual-system modifications:

| Check                                                                            | Result                                                                                  |
| -------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| `pnpm env:check`                                                                 | PASS; values not displayed                                                              |
| `pnpm test`                                                                      | PASS: environment suite 12/12                                                           |
| `pnpm test:db`                                                                   | PASS: 12/12 database regression tests                                                   |
| `pnpm test:auth`                                                                 | PASS: 9/9 authentication regression tests                                               |
| `pnpm lint`                                                                      | PASS                                                                                    |
| `pnpm typecheck` (`next typegen && tsc --noEmit`)                                | PASS                                                                                    |
| `pnpm format:check`                                                              | PASS                                                                                    |
| `pnpm build`                                                                     | PASS; routes `/`, `/login`, `/account`, `/api/auth/[...all]`                            |
| `pnpm db:seed`                                                                   | PASS: deterministic development domain and authentication seed applied                  |
| Login page `GET /login`                                                          | PASS: 200, renders “Portal sign in” + “Development build. Use fake accounts only.”      |
| Anonymous `GET /account`                                                         | PASS: redirect to `/login`                                                              |
| Successful login `POST /api/auth/sign-in/email` (`student.test@example.invalid`) | PASS: 200, session cookie set                                                           |
| Authenticated `GET /account`                                                     | PASS: 200, renders “Identity confirmed”, account email, “Present and server-verified”   |
| Logout `POST /api/auth/sign-out`                                                 | PASS: 200 `{"success":true}`, cookies cleared; subsequent `GET /account` → 307 `/login` |

This clears the prior BLOCKED status. Database/authentication suites are no longer skipped; successful login, authenticated account rendering, and logout are now verified against the running Next.js development server and local PostgreSQL.

P2-M4 should reuse these tokens and primitives, then implement and test actual portal authorization, shell navigation, accessible drawers/dialogs/tabs and resource policies in its own milestone. This pass adds none of those behaviors.
