# Responsive UX, accessibility and visual direction

Mobile is the primary planning surface for applicants/students; staff density is optimized for desktop but remains usable on phones. Device classes below describe behavior, not frozen breakpoints or CSS constants.

| Layout | Mobile | Tablet | Desktop |
|---|---|---|---|
| Public | Compact header/menu; short introduction then Apply/Login and admission steps | Navigation collapses when it no longer fits; content can form two columns | Full public navigation, restrained introduction and clear primary CTA |
| Authenticated shell | Menu button opens labeled drawer; current portal remains visible; no permanent sidebar | Drawer or compact sidebar according to space, never overlap task | Header + roughly 220–260px sidebar + flexible content |
| Dashboard | Next action first, stacked task content; counts become compact lists | Two columns only when reading order stays clear | Task area dominant; related context secondary |
| Admission/enrollment stepper | Current/next step first, expandable vertical history | Vertical list or short grouped steps | Grouped milestones with detail panel; do not stretch all lifecycle labels across page |
| Application forms | One column, sections, save state near actions; review before submit | One or two columns only for related short fields | Restrained reading width with section navigation if long |
| Staff queues | Labeled summary cards: identity, stage, due date if known, next action | Short table or list with detail panel | Search/filter bar, useful columns, pagination, detail drawer/page |
| Class schedule | Day agenda default; week available; no tiny calendar grid | Agenda or week with readable meeting details | Week/day view; offering detail linked |
| Grade/attendance entry | One labeled student row/card at a time; next/previous optional; roster completeness remains visible | Reduced columns; entry and student identity remain adjacent | Dense roster with sticky identity/context where useful |
| Comparative tables | Controlled horizontal scroll only if comparison needs it, with visible cue and accessible region | Same; hide no critical data | Full meaningful comparison; no decorative columns |
| Account grants | Separate Memberships and scoped Permissions sections; review changes on full page | Master/detail only if readable | User context beside grant editor and review summary |
| Dialogs/details | Full-screen when contents require it; actions remain reachable with keyboard open | Centered dialog or side detail | Short modal / drawer; long tasks use a page |

Use a navigation drawer consistently; a six-portal bottom navigation would hide destinations and consume space. A bottom-accessible Menu trigger may be evaluated later, but no second competing navigation system is required. Sticky action regions must not obscure focused fields, validation or content at zoom.

## Content and accessibility intentions

Use clear heading hierarchy, landmarks, skip-to-content access, meaningful links, keyboard-operable menus, visible focus and logical focus restoration. Provide status words/icons alongside color. Plan generous touch targets (approximately 44px preferred design guidance) and spacing; final conformance measurement belongs to implementation. Text and controls must remain readable with zoom and reflow. Never rely on hover, color or animation to convey a task.

Give real form labels, required indicators and examples only when they clarify the expected format. Preserve names with spaces/diacritics; do not truncate IDs or essential schedule locations beyond recovery. Errors explain how to fix the field; an error summary links to each invalid field. Avoid blame in admission outcomes and account errors.

Reading order is title/context → state → next action → detail → supporting information. Screen-reader order must match visual order. Table header associations and labeled mobile fields survive responsive transformations. Pending operations have an accessible status message. Respect reduced motion; no essential interaction depends on animation.

Use day/month names and explicit time context to avoid ambiguous appointment dates. Support long content and configurable official labels; final language/localization policy is not assumed. On slow connections prioritize text, state and next action; display partial-region failures honestly. Do not promise offline saves or downloaded confidential-data caches.

## Visual intent

Modern, calm institutional UI: clear hierarchy, disciplined spacing, restrained borders and task-focused typography. Public pages introduce the college and admission path; authenticated pages support work. Official logo/seal, palette, typeface and final tokens remain unset. Wireframes use text placeholders and no invented institutional statistics, achievements or endorsement. No glassmorphism, giant gradients, decorative charts, excessive motion or oversized illustrations.

## Later acceptance scenarios

Evaluate representative 320/375px phones, tablet widths and desktop; long names/IDs, long announcement titles, many queue rows, no records and missing assignments. Check keyboard-only entry, focus after dialog/error, zoom/reflow, reduced motion, loading/failed/uncertain saves, revoked access, unpublished results and authorized downloads. Verify roster entry on touch and keyboard, and that navigation overlays cannot trap users. These checks are specified for a future UI; no browser or production accessibility verification is claimed in this documentation phase.
