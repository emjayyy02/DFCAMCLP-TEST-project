# Phase 4 — Locked design system

Status: **Visual specification only.** No CSS or component changes in P4-M1. This file owns visual decisions; behavior belongs to [P4-UX-RULES.md](P4-UX-RULES.md), scope to [P4-ROADMAP.md](P4-ROADMAP.md), and authority to [PHASE-4-CONTEXT.md](PHASE-4-CONTEXT.md).

## Direction and reference conclusions

Modern Civic + Premium Academic + Restrained Product Software extends the current light institutional design. The existing seal and campus photograph provide identity; hierarchy, alignment, and useful density provide quality. Do not substitute a new dashboard template.

The preliminary reference study consulted public reference content from [GOV.UK breadcrumbs](https://design-system.service.gov.uk/components/breadcrumbs/), [GOV.UK tables](https://design-system.service.gov.uk/components/table/), [USWDS side navigation](https://designsystem.digital.gov/components/side-navigation/), and [Oxford undergraduate admissions](https://www.ox.ac.uk/admissions/undergraduate). This was a content/pattern study, not a rendered visual audit of those sites.

Adopt short structural context trails, clear tabular headings, restrained section navigation, and task-led institutional content. Do not copy their branding, layouts, claims, or entire component systems. The application observation remains the visual baseline. No external reference supersedes the locked palette or existing workflows.

## Brand and color roles

Use the original `public/images/dfcamclp-seal.webp` without recoloring, distortion, redrawing, or alternate portal logos. Display one seal in each shell header; a redundant image is decorative when the adjacent link already names DFCAMCLP. Preserve the current campus hero asset. New historical imagery must meet the provenance rules in the context/roadmap.

Retain existing semantic token names where possible. These values specify shared roles, not permission to recolor every page:

| Role                    | Locked value or derivation                                            | Use                                                                     |
| ----------------------- | --------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| Primary                 | `#0D13CD`                                                             | Primary actions, links, focus, selected navigation                      |
| Primary hover / soft    | Existing 80% primary + black / 5% primary + white mixtures            | Interaction feedback and restrained selection surface                   |
| Accent                  | `#FCDF00`                                                             | Small identity/context accents; never yellow small text on white        |
| Accent soft             | Existing 12% accent + white mixture                                   | Limited contextual emphasis, not a universal warning                    |
| Canvas                  | `#F8FAFC`                                                             | Page background                                                         |
| Surface / elevated      | `#FFFFFF`                                                             | Panels and overlays                                                     |
| Foreground / secondary  | `#111827` / `#6B7280`                                                 | Main text / supporting text; verify contrast on each actual surface     |
| Border / control border | `#E5E7EB` / `#8793A5`                                                 | Group separators / distinguishable inputs and outlined controls         |
| Muted surface           | `#F1F5F9`                                                             | Table headers, neutral groups and status                                |
| Success                 | `#16A34A`, soft `#F0FDF4`, text `#166534`                             | Verified/completed/active where meaning supports it                     |
| Warning                 | `#D97706`, soft `#FFFBEB`, text `#92400E`                             | Action needed, waiting requiring attention                              |
| Danger                  | Existing destructive token: `#DC2626`, soft `#FEF2F2`, text `#991B1B` | Blocking errors, failed technical actions, high-priority issue emphasis |
| Information             | `#2563EB`, soft `#EFF6FF`, text `#1E3A8A`                             | Scheduled, submitted, in-progress information                           |
| Neutral                 | Foreground on muted surface                                           | Draft, closed, archived, unavailable where appropriate                  |

Bright semantic colors are accents; use the darker semantic foregrounds for small text. Status must include words. Map domain meanings centrally; never recolor a label solely because the color looks pleasant. “Not Qualified” remains a calm labeled admission outcome, not a red technical-error banner. See UX rules for workflow distinctions.

Light mode is the Phase 4 target. Do not add a dark theme. Reuse existing success/warning/destructive/info/neutral Badge and Alert concepts rather than creating new parallel color names. Necessary contrast corrections must keep canonical brand values and be documented at the semantic-token level.

## Typography

**One intentional family is locked: retain Arial with the existing Helvetica/sans-serif fallback stack.** A fallback stack is not a request for three designed typefaces. No new font download or package is needed. The maximum is two intentional families, but no second family is authorized by this lock; introducing one requires a documented amendment with rendered evidence. Hierarchy comes from size, weight, spacing, and measure, not from adding fonts.

| Semantic role                          | Size / line height                 | Weight and scope                              |
| -------------------------------------- | ---------------------------------- | --------------------------------------------- |
| Public hero display                    | 40px small, up to 64px wide / 1.1  | 700; homepage only, wrap naturally            |
| Public interior title                  | 32px small, up to 48px wide / 1.15 | 700; editorial public use                     |
| Application page title                 | 28px small, 32px wide / 1.2        | 700; one primary heading per page/view        |
| Major section title                    | 24px / 1.3                         | 600–700; major content groups                 |
| Card/local section title               | 20px / 1.3                         | 600–700; standard panels                      |
| Compact subsection                     | 16px / 1.4                         | 600–700; labels within an established section |
| Body / field input                     | 16px / 1.5–1.6                     | 400; primary reading and input                |
| Secondary / navigation / table / label | 14px / 1.5                         | 400 for support, 600 for labels/actions       |
| Caption / optional eyebrow             | 12px / 1.5                         | 400 or 600; nonessential metadata only        |

Use modest negative title tracking and normal body tracking. Avoid uppercase sentences; short optional eyebrows may be uppercase. Names, IDs, schedules, error messages, and primary actions must not depend on 12px captions. Use tabular numerals for aligned dates/counts/identifiers when helpful. Long titles and IDs wrap; no essential information is available only through a tooltip or ellipsis.

These are semantic targets for M2, not instructions to replace every number mechanically. Heading level follows document structure, not desired size. Any responsive interpolation stays between the listed endpoints. Remove feature-specific near-duplicate sizes as the relevant component is migrated.

## Spacing and widths

Use a 4px base with the shared rhythm **4, 8, 12, 16, 24, 32, 48, 64px**. Map repeated spacing to semantic tokens or existing equivalent utilities. Avoid per-page values such as 13px or 19px without a functional reason.

| Relationship                                  | Standard                                                                |
| --------------------------------------------- | ----------------------------------------------------------------------- |
| Label → control / title → description         | 8px                                                                     |
| Control → help/error                          | 4–8px                                                                   |
| Related inline controls                       | 8–12px, wrapping before compression                                     |
| Form rows / compact list groups               | 16px                                                                    |
| Header → first content / independent sections | 24px staff, 32px Applicant/Student                                      |
| Panel padding                                 | 16px small screens, 24px when space permits                             |
| Panel gaps                                    | 16px compact staff, 24px personal/dashboard                             |
| Page side gutters                             | 16px small, 24px tablet, 32px desktop                                   |
| Page top / bottom                             | 24px / 32px small; 32px / 48px wide                                     |
| Public section rhythm                         | 48px small, 64px wide; use content length to avoid forced empty screens |

Widths are maximums; available space and content govern actual layout:

| Page type                         | Maximum content measure | Rule                                                                             |
| --------------------------------- | ----------------------- | -------------------------------------------------------------------------------- |
| Authenticated outer shell         | Existing 100rem         | Header/sidebar frame; do not stretch paragraph text across it                    |
| Operational queues and dashboards | 70rem                   | Support useful columns, not filler columns or empty metric cards                 |
| Reading/details/forms             | 56rem                   | Paragraphs remain about 65–70 characters; narrower form groups where appropriate |
| Public content                    | Existing 72rem          | Preserve editorial breathing room and current shell relationships                |
| Login form                        | Approximately 28rem     | One readable column with fluid small-screen gutters                              |

Applicant/Student are slightly more spacious; staff portals are moderately denser through layout and spacing, not smaller essential text or touch targets. A detail view may use a summary aside only if both columns remain readable. M2 owns these width variants; features select a variant rather than inventing another maximum.

## Geometry and surface patterns

Retain **8px control radius and 12px panel radius**. Rounded status labels are compact, not giant pills. Navigation, buttons, page headings, and whole cards are not capsules. Standard panels are flat white with a 1px neutral border. Use the existing restrained elevated shadow only for menus/dialogs; avoid shadows on every content group.

| Pattern              | When justified                             | Presentation                                                                    |
| -------------------- | ------------------------------------------ | ------------------------------------------------------------------------------- |
| Standard surface     | Related independent information            | White, subtle border, shared padding                                            |
| Interactive card/row | The whole module has one destination       | One semantic link, clear action cue and focus; no nested interactive controls   |
| Summary              | A next step or meaningful count            | Compact identity/state/action; count derives from the displayed scope           |
| Detail panel         | One selected record/class                  | Entity title, key context, then facts/actions; no repeated shell-sized headline |
| Notice/callout       | Context affects the task                   | Small inset or border, brief label/text; semantic color only if warranted       |
| Status panel         | Outcome is the page's purpose              | Heading + status words + next step; no theatrical success/failure decoration    |
| Plain section        | Content already grouped by heading/spacing | No extra card wrapper                                                           |

Do not put a bordered card inside a bordered card solely to separate paragraphs. Tables can have a single surface; rows do not each need cards at desktop. Mobile record rows may become labeled blocks because their reading structure changes.

## Action and link presentation

Extend the existing Button variants. Primary is filled blue with white text; secondary is outlined or restrained neutral; tertiary is a clearly interactive lower-emphasis control. Danger is reserved for genuinely destructive/consequential actions, not routine navigation. A disabled state includes programmatic disabling and understandable context; a pending action keeps its label/width stable and communicates progress.

State-changing controls remain buttons. Navigation remains links, even when a prominent next destination warrants button presentation through the existing `asChild` mechanism. Ordinary inline and row links are blue with a persistent underline and offset; hover strengthens the treatment. Navigation bars, clearly bounded interactive rows/cards, and button-presented links may omit underlines because their full affordance is visible. Do not underline ordinary data values or use blue as a substitute for a link.

Controls target at least 44×44px. Inline prose links are the exception to a 44px box; maintain readable spacing and a clear focus ring. No icon package is justified by the password-eye request: reuse existing icon conventions or a small accessible SVG. Icon-only controls require accessible names and clear state; see UX rules.

## Forms

Extend existing Input/Select/FormSection rather than styling raw controls independently. Textarea, checkbox/radio, validation, and required/help patterns should join that foundation as needed. Keep native semantics and labels. Inputs use white surfaces, visible strong borders, 44px minimum height, 16px text, and consistent hover/focus/disabled/invalid states. Textareas grow appropriately; no fixed-height clipping.

Labels remain above controls; placeholders are optional examples, never labels. Required indicators have a textual explanation. Help and error text are associated with the field. Errors include a message, not just a red border. Use one column on phones; two related fields may share a row only when labels and values fit at tablet width. Password visibility is a named button with visible/announced state; changing its icon must retain existing behavior and autocomplete.

## Tables and lists

One shared table recipe must specify a neutral header, left-aligned text, appropriate numeric alignment, row separators, tabular numerals, 12px vertical/16px horizontal desktop cell padding, and clear action columns. Hover is subtle; selected state combines a surface and a programmatic/text cue. Header labels are visually subordinate to the page title and stronger than secondary metadata.

Sorting has an explicit labeled selector or sortable header with a direction indicator and `aria-sort` where applicable. Do not show sort arrows on non-sortable headers. Search/filter toolbar, result count, and sort control occupy a coherent region; sort remains conceptually separate. Lists use the same hierarchy and semantics without pretending to be tables.

At narrow widths, operational rows become labeled records retaining identity, important status/context, and the next action. Keep semantic associations meaningful. Horizontal scrolling is reserved for genuine comparison matrices, scoped to a labeled region with a visible cue; it must never cause page-level overflow. Empty/error/loading states occupy the list region without fabricated rows or zero counts.

## Headers, navigation, and context

Application PageHeader: optional compact portal/module context → page/entity title → one short description → optional action group. Actions align consistently beside content when space permits and stack below on small screens. Use either an intentional bottom gap or restrained divider consistently; avoid extra stacked separators around notices.

Section headers pair the section title with a low-emphasis related action. Contextual headers identify the selected class/record prominently and show only relevant secondary facts. Example: `Academic / Teaching`, then `IS 203 — Systems Analysis`, then `BSIS-2A · IIT Campus · AY/semester`. Do not force every dimension into a breadcrumb. The actual authorized entity supplies these values.

Authenticated top navigation has the supplied school seal + DFCAMCLP at the left, clear current portal, and account/switch controls. The logo routes to the current authorized portal dashboard. Public identity routes to `/`. Account/access-denied surfaces have no single implicit current portal; use the shared identity with a public-home link and a clearly separate permitted-portal return path. Do not guess a portal or infer access from browser history.

Retain the approximately 64px top bar and existing 256px desktop sidebar. Sidebar identity names the portal and role when they differ; avoid repeating “Applicant / Applicant” or “Student / Student.” Active navigation uses a soft blue surface plus stronger text/indicator, not color alone. One primary active item; contextual children use a distinct subordinate treatment. Below the existing desktop shell breakpoint, use the accessible drawer rather than squeezing the sidebar. Do not add a second mobile navigation system.

Breadcrumbs are short parent/context trails; subnavigation switches views of an entity/module. Styling stays lighter than primary navigation. Nested sidebar ownership and active-state semantics are defined in UX rules; no universal navigation tree is prescribed.

## Demo, profile, and system states

Use one reusable **Demo Notice** pattern: a small visible “Demo workspace” label with a short supporting line and an optional adjacent scenario control. A neutral border or small brand accent is enough; it is not a warning banner. Place it once near page context, not inside every card. Preserve explicit sample labels on documents and consequential demo confirmations.

Variants must remain truthful:

- Browser-only editable workflow: “Fictional data · Changes reset on refresh.”
- Read-only fictional database directory: “Fictional development accounts · Read-only.”
- Informational Technology page: “Project information · No live monitoring,” only where that accurately describes the page.

Avatar/identity primitive: optional image, initials fallback, name, and concise role/context. Use a circle for an avatar only; it does not license pill-shaped panels. Reserve dimensions to prevent shifts. Image alternatives should not repeat an adjacent name unnecessarily. No upload backend is part of this primitive.

| State          | Presentation contract                                                                                    |
| -------------- | -------------------------------------------------------------------------------------------------------- |
| Empty          | Short heading, why nothing appears, one useful next action when available                                |
| Filtered empty | Retain search/filter context and offer Clear filters                                                     |
| Loading        | Stable region, accessible busy/status text; no fake counts or compulsory shimmer                         |
| Error          | Plain-language failure and recovery action, preserve entered values when safe; no raw traces             |
| Access denied  | Explain lack of access without exposing permission internals; offer authorized account/portal navigation |
| Success        | Concise contextual confirmation, not a page-obscuring overlay                                            |

## Responsive and interaction contract

Acceptance sizes are **375×812, 768×900, and 1440×900**; also verify reflow at 320 CSS px where appropriate. At 375px, use one task column and stacked summaries. At 768px, evaluate actual label/content fit before using two columns; wrap filter groups and move actions below context as necessary. At 1440px, keep readable measures and use available width for operational work, not decorative spacing.

The Operations two-column small-screen summary defect is a required M6 acceptance case. M2 supplies a reusable stacking pattern; M6 owns its final content-specific application. Never solve crowding by shrinking labels, clipping identifiers, or setting fixed-height cards.

Default/hover/pressed/focus/selected/disabled states must be explicit and coherent. Retain one visible focus language: primary-blue 2px outline with 3px offset on light surfaces, with a high-contrast adaptation over dark imagery. Focus must not be clipped by overflow or covered by sticky UI.

Basic color/background transitions are **150ms**, within a 120–200ms envelope. No new scroll effects before M7. Reduced motion removes nonessential transforms/reveals/transitions while retaining immediate state feedback and full content visibility. Do not add animation delays to reading, keyboard navigation, or form completion.

Target WCAG 2.2 AA-quality behavior: normal text contrast at least 4.5:1, large text 3:1, relevant control boundaries/focus indicators 3:1, keyboard operation, semantic landmarks/headings, labels, and no color-only status. Measure actual combinations during implementation. These targets are not a certification claim.

## Reuse map and acceptance ownership

| Existing owner                                                       | Planned responsibility                                                  |
| -------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| `src/app/globals.css`                                                | Central type/spacing/width/semantic/interaction tokens and recipes      |
| `src/components/ui/{button,input,card,badge,alert,form-section}.tsx` | Extend the current primitive family; consistent variants and states     |
| `src/components/portal/{app-shell,page-header}.tsx`                  | Identity, shell navigation, page/context header contracts               |
| `src/components/public/{site-shell,site-header}.tsx`                 | Related public identity/navigation; public content changes belong to M3 |
| `src/components/development-identity.tsx`, account/forbidden pages   | Coherent non-portal shell identity and return paths                     |
| Existing feature page/header/notice/CSS consumers                    | M2 shared adoption; M4–M6 entity/content-specific refinement            |

M2 may introduce narrowly scoped DemoNotice, identity/avatar, contextual-header, list-toolbar, and state primitives only where existing components cannot express the shared contract. Names are implementation choices; a second design system is not. Do not rebuild demo providers, route guards, authentication, or data services to implement visual consistency.
