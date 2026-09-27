# Phase 4 — Locked UX rules

Status: **Behavior specification; implementation deferred to the authorized milestone.** Authority and conflict procedure are in [PHASE-4-CONTEXT.md](PHASE-4-CONTEXT.md). Visual values are owned by [P4-DESIGN-SYSTEM.md](P4-DESIGN-SYSTEM.md); delivery ownership and audit traceability are in [P4-ROADMAP.md](P4-ROADMAP.md).

## 1. Page orientation

Every important screen answers **Where am I? What am I viewing? What can I do?** before requiring a sidebar search.

- Show the current portal in the shell and the module/page in the content header. Use one primary heading, one concise purpose sentence, and relevant actions.
- For a selected record/class, make the entity name the prominent content title. Include its human-facing ID or subject code and the few facts needed to avoid acting on the wrong entity. Institution dimensions belong in context, not a long breadcrumb.
- Show term and section on academic work; selected entity and workflow stage on record work. Unavailable or invalid selections have a safe recovery state, not a fabricated fallback entity.
- Read-only pages need no artificial primary action. A clear reading purpose can satisfy “What can I do?”
- Keep orientation visible on mobile when the desktop sidebar is absent. Do not rely on a highlighted navigation link alone.

## 2. Navigation and identity

### Portal boundaries

The six authenticated portal families and current permission-filtered route catalog remain the product structure. A role label is context, not an authorization mechanism. Portal switching shows only authorized memberships and preserves server rechecks; it never merges two portals' permissions or transfers a selected record across unrelated contexts.

The current top-level routes, query-selected detail contracts, and working direct links are preserved by default. Better orientation is not a reason to introduce new route families. Header and sidebar use the same portal identity. Do not expose raw permission codes in ordinary user-facing controls.

### Logo behavior

| Surface                               | Destination                                          | Expected behavior              |
| ------------------------------------- | ---------------------------------------------------- | ------------------------------ |
| Public                                | `/`                                                  | Navigate home                  |
| Applicant                             | `/applicant`                                         | Current portal dashboard       |
| Student                               | `/student`                                           | Current portal dashboard       |
| Academic                              | `/academic`                                          | Current portal dashboard       |
| Admissions & Records                  | `/records`                                           | Current portal dashboard       |
| Operations                            | `/operations`                                        | Current portal dashboard       |
| Technology                            | `/technology`                                        | Current portal dashboard       |
| Neutral account/access-denied surface | Public home, plus separate authorized portal choices | Do not invent a current portal |

Logo links are navigation and must not invoke sign-out. Sign-out remains a separately labeled explicit action. Navigation to public pages and browser Back/Forward should preserve a valid session, subject to genuine expiry/revocation. Returning from a public page may reset browser-only demo state on a full document navigation; that is distinct from authentication loss and must not be described as logout.

**Session finding: “Previously reported; not reproduced during P4-M1 Student-session verification.”** The verified sequence was Student → public homepage → browser Back → authenticated Student profile. This does not establish behavior for every role, host, or expiry state. M3 owns wider verification. Do not change cookies, session duration, guards, or authentication without a reproducible defect and separately justified scope.

### Active state and nesting

The active module remains apparent when a query selects an entity. Use `aria-current="page"` for the actual current navigation page; if a future real child route exists, distinguish its current item from an ancestor's active grouping. Do not mark multiple unrelated destinations current. Unknown paths do not become authorized because they share a prefix.

| Situation                                                    | Required pattern                                                | Avoid                                                                 |
| ------------------------------------------------------------ | --------------------------------------------------------------- | --------------------------------------------------------------------- |
| Flat dashboard or module list                                | Page title + active top-level item                              | Breadcrumb repeating “Dashboard / Dashboard”                          |
| List → selected entity                                       | Short portal/module context, entity header, Back to list        | Entity buried below a generic list title                              |
| Several views of one entity                                  | Contextual subnavigation/tabs retaining entity identity         | Duplicating every tab in the global sidebar                           |
| Several real, stable permitted pages within a complex module | One collapsible sidebar level only if it reduces disorientation | Trees of subjects, individual students, tickets, or arbitrary records |
| Sequential application workflow                              | Stepper/status and next action                                  | Breadcrumb pretending to be progress                                  |

Academic, Records, and Technology are candidates for contextual navigation; no universal tree is mandated. A collapsible group requires real permitted children, keyboard-operable expansion, an accessible expanded state, and the current child visible. Do not create empty destinations from the broader Phase 1 wish list.

Queue/detail return should preserve applicable search, filters, sort, and list position. Prefer the current module's existing URL/state conventions; do not add browser storage just for convenience. If preservation cannot be supported within the current scope, report it instead of silently resetting users' work. Existing unsaved-work protection must remain; do not claim edits persist across refresh or session expiry.

### Small-screen navigation

Use the existing native dialog drawer. It has an accessible name, visible close control, focus containment, Escape dismissal, and trigger focus restoration. Selection closes the drawer. Account controls have distinct names from the navigation trigger. The logo and portal remain legible without squeezing account/menu targets. Public navigation retains its existing nonmodal disclosure behavior; do not impose modal focus trapping on it.

## 3. Actions and feedback

| Intent                                  | Element and hierarchy                                             | Example                                                   |
| --------------------------------------- | ----------------------------------------------------------------- | --------------------------------------------------------- |
| Navigate to another view                | Link; primary presentation only for the dominant next destination | Open application / View record                            |
| Change state or submit data             | Button with explicit verb                                         | Save demo draft / Confirm demo result                     |
| Main next step                          | One primary within the immediate task context                     | Review submission                                         |
| Meaningful alternative                  | Secondary                                                         | Cancel / Preview                                          |
| Low-priority action                     | Tertiary with clear hover/focus/underline or boundary             | Clear filters                                             |
| Genuine irreversible/destructive effect | Danger treatment and consequence review                           | Only when an authorized workflow actually has this effect |

Do not turn all blue links into filled buttons. Do not make state-changing actions look like ordinary body text. Row destinations need entity-specific accessible names when visible labels repeat, such as “Open record for Maria Santos.” A whole-card link cannot contain another button/link. Disabled actions explain missing prerequisites where useful; unauthorized actions remain absent, with server enforcement unchanged.

Icon-only controls are limited to recognizable actions with accessible names, suitable touch targets, visible focus, and a tooltip if ambiguity remains. Password visibility must announce Show password/Hide password and retain keyboard operation; the current text toggle already works. A tooltip cannot be the only touch-accessible explanation. No icon is required beside every heading.

### Feedback rules

- **Success:** confirm the exact result near the task and update the relevant view/count. Announce a concise polite status. Never say an email was sent, account created, or record persisted when only a demo state changed.
- **Validation:** keep entered values, explain errors beside their fields, associate messages programmatically, and provide a focusable linked summary for multiple errors. Do not expose credential/account existence through recovery/login messages.
- **Confirmation:** use review for meaningful consequences, naming the affected person/class/document and what will change. Keep safe Cancel and predictable Escape/focus restoration. Do not ask confirmation for ordinary navigation or harmless filtering.
- **Destructive confirmation:** specify the actual irreversible consequence; a generic “Are you sure?” is insufficient. Do not invent deletion features just to complete the design system.
- **Pending/failure:** prevent duplicate activation while pending, preserve useful context, and distinguish failed loading from no records. An uncertain result is not success; do not blindly repeat a potentially completed mutation.
- **Demo feedback:** explicitly say “demo” or “in this browser session” for sample mutations. Preserve SAMPLE / NOT VALID FOR OFFICIAL USE labels on document previews and print outputs.

## 4. Search, filters, and sorting

These are separate controls and concepts. **Search matches text; filters decide which records qualify; sort decides their order.** Apply search and filters, then order the visible result set. Result counts describe that same scope. Sorting must not remove rows or alter workflow status.

### Multi-field search foundation

Use trimmed, case-insensitive plain-text matching across useful display fields. A single query matches if it occurs in **any** supported field. Start with literal text; preserve punctuation in names/identifiers. Do not require users to learn a query language.

| List                      | Expected fields, where present and permitted                                                                   |
| ------------------------- | -------------------------------------------------------------------------------------------------------------- |
| Student/applicant records | Name, human-facing ID, program code/name, campus; student year/standing when useful                            |
| Academic roster           | Name, Student ID, section                                                                                      |
| Facilities                | Ticket ID, location, issue text, campus/category                                                               |
| Employee directory        | Name, employee ID, campus, functional area                                                                     |
| Technology accounts       | Already exposed fictional name/email and permitted account/membership labels; never credentials/session fields |

Help/placeholder text must match the actual fields searched. Search only the authorized data already available to that view. Do not add broader data access to make search appear more powerful. Reuse a tested matching utility or existing helper when suitable; page-specific field sets belong to their feature owners.

The manual audit's `||` syntax is an example of multi-field intent. **Literal OR-operator parsing is deferred.** Basic users get OR-across-fields automatically. If a later need establishes multi-term expression search, request a syntax/help/error specification first; do not ship a half-defined parser.

### Filters

Use persistent labels, clear selected values, a visible result count, and a reset action. Campus/program dependencies follow the canonical registry. Do not silently change a selected value without explaining that it became unavailable. No-results state retains the user's criteria and offers recovery.

Records already contains Program and Year Level filters. M5 reconciles their source/coverage; it does not add duplicate controls. Program choices use the canonical four-degree registry with campus relationships. A program with zero sample results is a legitimate empty result, not evidence of a missing degree. Do not seed fake records merely to make every filter nonempty. Year levels derive from the supported demo scenario/known values; do not invent official program duration.

### Default ordering

Use stable tie-breakers (human-facing ID, then stable internal key if needed). Never sort a localized date string alphabetically; use the underlying date value. Expose “Sort by” when choosing another order is useful, not for every tiny static list.

| Context                            | Default order                                                                                        | Appropriate alternatives / limits                                                          |
| ---------------------------------- | ---------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| Applicant processing queue         | Explicit selected work category/attention state, then oldest submitted                               | Newest submitted when useful; no invented urgency score or SLA                             |
| Student/employee directory         | Name A–Z, then ID                                                                                    | ID; descending name only if useful                                                         |
| Facilities                         | Open/In Progress work before Resolved/Closed; within group High → Normal → Low; then oldest reported | Newest first, priority; use the existing reported date, not an invented creation timestamp |
| Announcements                      | Newest published/sample date first                                                                   | Audience/category are filters, not sorting                                                 |
| Class schedule / calendar agenda   | Chronological date/time                                                                              | Preserve timetable meaning                                                                 |
| Attendance/grade roster            | Student name A–Z, then Student ID                                                                    | ID; never rank students by an invented performance metric                                  |
| History/activity                   | Newest recorded event first                                                                          | Public institutional history is the exception: chronological oldest → newest               |
| Technology account directory       | Name A–Z, then stable identifier                                                                     | Account state only as an explicit alternative; no fake risk score                          |
| Static institution/reference lists | Canonical source order and grouping                                                                  | Do not mechanically alphabetize workflow steps or architecture layers                      |

These defaults are **project/demo UX decisions**, not official processing policy. Changing display order must not mutate underlying data or introduce automated eligibility/prioritization decisions. M2 owns shared sort-control presentation and representative behavior; M4–M6 own their feature field sets and defaults.

## 5. Status and information hierarchy

Keep domain vocabulary distinct: account active state, portal membership state, application stage, document availability/issuance, result release, and enrollment are not interchangeable. Maintain statuses from the existing workflow until the authorized feature milestone explicitly revises them.

- Success indicates a completed/verified/active condition where supported.
- Warning indicates attention or waiting that requires action; information indicates scheduled/submitted/in-progress work.
- Danger indicates a blocking error or serious issue, not every pending item.
- Closed/archived/cancelled/unavailable are normally neutral; “Closed” alone does not prove successful resolution.
- Facilities priority is separate from ticket status. High priority may use danger emphasis; Resolved uses success; In Progress uses information; Open uses warning/neutral according to the visible task context. Do not relabel a priority as an official emergency classification.
- Admission “Not Qualified” uses calm text and neutral treatment. Unmarked attendance is missing data, not Absent. A fetch error is never rendered as Failed admission, Not Qualified, or zero records.

Every status includes text; color and optional shape/icon reinforce it. Show the current record status close to identity and the action it enables. Avoid a cluster of unexplained badges. Unknown monitoring stays unavailable/unknown; configured infrastructure is not a healthy production service.

## 6. Demo entry, identity, and account boundaries

P4-M3 may refine account creation/recovery **concept UI**, but existing real Better Auth login remains intact. The manual audit's “anyone can apply” expresses discoverable applicant entry, not waived residency/eligibility requirements or real open registration. The requested entry can illustrate the start of a demo application without provisioning a real account, assigning Applicant ID, or granting a membership. A local duplicate check must say it covers only its sample/current-session dataset and cannot guarantee one account per human.

Applicant email-recovery and staff/admin-ticket recovery are requested directions, not functioning delivery services. Show honest simulated outcomes or contact guidance; do not fake a sent message or submitted ticket. Student COR/COE verification is guidance pending policy, never a self-service authorization shortcut. Other roles cannot create their own permissions.

Annual-cycle examples require the U2 amendment before workflow modeling. Use canonical **DCAT**, not the audit's “DFCAT.” Do not automatically label incomplete applications failed or permit/restrict next-cycle applications without settled policy. Do not turn the canonical physical checklist into uploads or add a mandatory ID photo because a generic college might request one.

M4 owns fictional identity/name refinements and the Student 3rd-year/2nd-semester scenario. Keep IDs and Person continuity stable; propagate display changes to Academic/Records consumers so one fictional person does not have contradictory names or term context. Every invented course/history item is explicitly synthetic. Official grade calculations and curriculum remain out of scope.

Profile-image work is a local temporary preview only unless persistent storage is separately authorized. Explain reset/removal behavior before selection, constrain file type/size in the later implementation specification, retain initials fallback, and do not call a preview a saved profile update. Applicant document uploads are a different, deferred workflow.

## 7. Responsive UX and accessibility

| Size     | Required behavior                                                                                                                                                                                   |
| -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 375×812  | Logo and portal remain clear; accessible drawer; one primary content column; stacked summary/detail groups; labeled record rows; no page overflow; important actions stay recognizable and tappable |
| 768×900  | Drawer continues where desktop shell cannot fit; filter bars wrap; form/detail actions do not compete for one narrow row; choose one or two columns based on actual content                         |
| 1440×900 | Persistent sidebar, useful staff density, aligned controls, readable paragraph measures, deliberate width use                                                                                       |

The Operations School Admin summary cards were visibly cramped at 375px; earlier Operations work also identified tablet pressure. M6 must test both rather than assuming tablet is a small desktop. Stack first; do not shrink meaningful text. Horizontal scrolling may exist inside a true comparison table or short tab strip with a cue, never as accidental page overflow.

Keyboard requirements: logical tab order, visible focus, skip link, semantic buttons/links, native controls, labeled dialogs, Escape/focus restoration, and standard tab arrow/Home/End behavior where tabs exist. Keep current tab/entity context perceivable without hover. Do not make screen-reader order differ from visual order.

Forms retain explicit labels, grouped fieldsets where useful, associated errors, and clear required markers. Tables retain header associations; mobile transformations retain visible field labels. Use polite live regions for result counts/save feedback without announcing every unrelated render. No secrets or raw server errors in accessible text.

Meet the contrast and target-size specifications in the design system. Verify zoom/reflow, long names, long IDs, empty results, errors, selected/disabled/pending states, and reduced motion. Content and actions must remain available with animation disabled. Native print/PDF pagination and screen-reader operation need separate evidence; do not infer them from a screenshot or stylesheet.

## 8. Acceptance and unresolved conflicts

Each implementation milestone must exercise its real rendered workflows and current permissions, not an unguarded preview substitute. M2 establishes the shared presentation foundation; M3–M6 verify feature-specific behavior; M7 performs final cross-portal review. Specific test gates belong to the roadmap.

For U1–U10 unresolved items, preserve the working behavior, record the affected audit ID, stop only the conflicting part, and request a lock amendment. A designer's preferred interaction is not authority to weaken security, invent a school rule, or silently start the next milestone.
