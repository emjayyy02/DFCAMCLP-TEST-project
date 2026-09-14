# P3-M1 — Public website and login experience

## Scope and direction

P3-M1 replaces the development-facing homepage and completes `/`, `/programs`, `/admissions`, `/about`, and `/login`. Phase 2 is complete; regression now runs within frontend milestones. P3-M2 has not started. No business backend workflow, schema, membership, role, permission, guard, or denied-session cleanup change is included.

The direction is a restrained modern institutional website: the existing Arial/Helvetica typography, soft neutral `#F8FAFC` canvas, white surfaces, charcoal `#111827` text, and subtle borders. Campus photography is the strongest visual element. Short program lists and a genuine sequential admissions journey replace decorative card grids.

## Supplied assets and tokens

- `logodfcamclp.webp` → `public/images/dfcamclp-seal.webp`: original bytes, intact aspect ratio, no recoloring/cropping/redrawing. Used at restrained sizes in the header and login identity. Unoptimized delivery preserves the original seal.
- `bacampus.webp` → `public/images/campus-hero.webp`: original asset retained. Homepage uses Next.js Image `fill`, `preload`, `sizes="100vw"`, `object-fit: cover`, a responsive crop, and a directional dark scrim. The photograph is the hero background; the scrim preserves natural detail toward the right.
- Canonical `--primary`: **#0D13CD**. Canonical `--accent`: **#FCDF00**.
- Hover blue mixes the primary with black; soft blue and yellow mix their canonical tokens with white. Focus uses primary. Semantic success/warning/error/information remain independent.

## Route architecture and factual content

`SiteShell` shares the public header, skip link, compact footer and unofficial notice. Public components do not wrap authenticated routes. `SiteHeader` alone handles navigation state; the pages and shared institutional content render on the server. Root metadata describes the concept and retains no-index/no-follow.

| Route         | Content                                                                                                                                                |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `/`           | Campus hero, admissions/sign-in actions, compact quick access, grouped programs, five-step journey, small demo notice                                  |
| `/programs`   | Main Campus — Talon III: BSA, BSBA and three majors; IIT Campus: BSIS and provisional Computer Engineering / CpE                                       |
| `/admissions` | Project-established residency/free-tuition context, physical submission, Application → Document submission → DCAT → Results → Enrollment; no interview |
| `/about`      | Short concept explanation, educational/portfolio purpose and explicit non-affiliation                                                                  |
| `/login`      | Original seal, portal selector, email/password, visibility toggle, pending/error feedback, demo-use notice and disclaimer in footer                    |

Facts come from PRODUCT.md and Phase 1 information architecture/user flows. No deadlines, contacts, cutoffs, extra programs, official notices or unsupported program descriptions are added. Public content is a small presentation catalog, not a new backend. Quick access uses the existing `portal` query parameter; selection never grants authorization. Login still posts to `/api/portal-login` and follows its authorized redirect.

## Responsive and interaction behavior

- Full desktop navigation switches to a labeled disclosure menu at 800px. It expands in document flow, uses `aria-expanded`/`aria-controls`, closes on Escape with trigger focus restored, and closes on route selection. It is not a modal and does not trap focus.
- At small widths, program groups stack and the admissions journey becomes vertical. Hero actions stack, image crop shifts, and footer wraps naturally. No fixed page height or animation is required for content access.
- Controls have 44px minimum target height. Links have hover feedback, current navigation uses both color and underline, buttons use a subtle pressed translation, inputs have hover/focus borders, and disabled/pending/error states remain intact.
- Menu opening and control transitions use 150ms. `prefers-reduced-motion` removes transitions/animation and pressed transforms.
- Semantic main/nav/footer landmarks, one h1 per route, ordered admission steps, explicit labels, native validation and alert announcements remain in use. Hero focus indicators are white over the dark scrim. This targets WCAG 2.2 AA-quality UX; it is not formal certification.

## Validation

Validation results and browser evidence are recorded below after the implementation review. Existing database suites run against local fake data without a database reset. Test suites may provision or restore their own fake fixtures through existing helpers.

## Limitations and next milestone

This is an unofficial mock/demo, not a commissioned or endorsed service, and must not receive real student data. Admission submission, activation/recovery, official requirements/deadlines, announcements, and school workflows are unavailable. Computer Engineering naming remains provisional. The source photo limits fine detail on wide displays; its original asset is preserved. No client demo-password helper is added and no seed secrets are exposed.

P3-M2 remains the Applicant Experience. P3-M3 Student, M4 Academic, M5 Admissions & Records, M6 Operations and M7 Technology remain future frontend milestones. Their existing shell placeholders are preserved.

## Final validation — 14 September 2026

**PASS for P3-M1**, with the tooling limits below. All checks were agent-executed; no user-performed host validation is claimed.

| Check               | Result                                                                                                                                                                |
| ------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Asset integrity     | SHA-256 hashes match both supplied files byte for byte                                                                                                                |
| Environment         | `pnpm env:check` PASS; `pnpm test` 12/12                                                                                                                              |
| Database            | `pnpm test:db` 12/12; no reset                                                                                                                                        |
| Authentication      | `pnpm test:auth` 9/9                                                                                                                                                  |
| Access control      | `pnpm test:access` 19/19                                                                                                                                              |
| Lint / typecheck    | PASS                                                                                                                                                                  |
| Format check        | PASS                                                                                                                                                                  |
| Production build    | PASS; all five public routes compiled, protected/API routes retained                                                                                                  |
| Mobile 375×812      | All five routes inspected; stacked content, hero crop, form, menu and footer reviewed; no horizontal overflow                                                         |
| Tablet 768×900      | All five routes inspected; menu, grouped programs, journey and login reviewed; no horizontal overflow                                                                 |
| Desktop 1440×900    | All five routes inspected; full navigation, photo hero and interior hierarchy reviewed; no horizontal overflow                                                        |
| Keyboard and states | Escape closes menu and restores trigger focus; route selection closes; input Tab order and 2px blue focus with 3px offset verified; keyboard password toggle works    |
| Login feedback      | Observed disabled pending state and safe “Invalid email or password.” alert from nonexistent fake credentials; submit re-enables and selection/input remain available |
| Reduced motion      | Verified delivered CSSOM rules remove all transitions/animation and pressed transforms; live OS preference emulation unavailable in this browser tool                 |
| Contrast            | Muted text on canvas 4.62:1, on white 4.83:1; primary/white 10.54:1; input border/white 3.11:1; foreground/canvas 16.96:1; photographic hero visually reviewed        |
| Independent review  | Two isolated agents: visual assessment 29/40 (Good), mechanical detector 0 findings, browser semantic/image/link inspection clean                                     |

The first environment-validator attempt failed on sandboxed Windows user-info lookup (`uv_os_get_passwd`); the same validator passed with approved host execution. The first explicit prettier invocation encountered a command-resolution issue; invoking the installed Prettier entrypoint succeeded, and `pnpm format:check` passed. The existing dev server stopped during the conversation interruption and was restarted; this was not an application defect. Some browser full-page captures required a viewport screenshot fallback. Screenshot width may exclude the scrollbar; dimensions above were checked through `innerWidth`/`innerHeight`.

Browser evaluation is read-only: no live Impeccable overlay injection was possible. Reduced motion was verified in the delivered stylesheet, not through OS emulation. No formal accessibility certification, screen-reader user testing, or new successful browser-authentication run is claimed; successful/denied authentication and session cleanup are covered by the existing integration suites. No seed password was placed in client code.

### Review refinements

Moved the demo notice before credentials; added a public programs path for visitors without accounts; explained DCAT as an admission examination; changed static program codes to neutral text to avoid link confusion; gave the small-screen demo notice a full-width text column. A suggestion to add another hero disclaimer was not adopted: the requested restrained footer/about notice pattern is retained, with an explicit demo notice before login entry. No unresolved design decision blocks this milestone. Provisional CpE naming remains a factual limitation.

### Evidence

- [Desktop homepage](evidence/home-desktop.png)
- [Mobile homepage](evidence/home-mobile.png)

Screenshots include the local Next.js development indicator, which is not public-page content and is absent from a production build.

### Files in this milestone

Created: `src/app/programs/page.tsx`, `src/app/admissions/page.tsx`, `src/app/about/page.tsx`, `src/components/public/site-header.tsx`, `src/components/public/site-shell.tsx`, `src/components/public/institution-content.tsx`, this document and its two evidence screenshots.

Assets added: `public/images/dfcamclp-seal.webp`, `public/images/campus-hero.webp`.

Modified: `src/app/page.tsx`, `src/app/login/page.tsx`, `src/app/layout.tsx`, `src/app/globals.css`, `src/features/identity/login-form.tsx`, `src/components/ui/button.tsx`, `README.md`, `docs/phase-2/PHASE-2-OVERVIEW.md`, `docs/phase-2/VISUAL-FOUNDATION.md`.

Skills: installed frontend-design, find-skills, and impeccable. Discovery reviewed the skills.sh leaderboard; no additional skill/package was installed. Local Next.js 16.3.5 image/layout documentation was read before implementation. The older Impeccable M3 surface note is stale and was not silently rewritten; the current user brief and M4 code govern this milestone.

**Stop: P3-M2 NOT started. No new business backend workflow implemented. No deployment, commit or push performed by this task.**

## Small public-site polish

Removed the desktop/mobile navbar sign-in CTA; the homepage hero action, footer links and direct `/login` route remain. Added a centered white sticky header with 16px top/inset spacing, 12px corners, a subtle border/shadow and no blur. The header retains normal document space, stays above scrolling content, and uses target scroll margins to keep anchored headings visible. Mobile navigation retains Escape/focus restoration and route-close behavior. Active, hover, focus and pressed feedback now apply equally to all four navigation links, including About.

Renamed the public-facing campus label from “IIT / CAA Campus” to “IIT Campus” in the shared homepage/Programs content. BSIS and Computer Engineering / CpE are unchanged; database identifiers and migrations are untouched.

Polish validation: 375×812, 768×900 and 1440×900 browser checks cover inset fit, scrolling, unobscured headings, seal sizing, navigation and overflow. Lint, typecheck, format check and production build PASS. At the Programs anchor the heading starts at 144px, below the sticky header bottom edge at 98px. Direct login rendering, mobile Escape/focus restoration, route close, and About active underline were verified. Existing homepage evidence screenshots were refreshed. No existing test covers the changed presentation-only files, so database/auth suites were not rerun for this patch. No backend/auth/access-control changes or database reset; P3-M2 NOT started.
