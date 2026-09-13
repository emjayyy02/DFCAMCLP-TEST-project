# Shared UX patterns

Conceptual inventory only; these names specify reusable behavior, not framework components. Permission checks precede data display; a loading placeholder must not briefly expose unauthorized controls.

| Pattern | Purpose / use | Important states | Mobile treatment |
|---|---|---|---|
| AppShell | Consistent authenticated task frame | Portal loading, ready, no access, session expired | Single content column; drawer navigation |
| TopHeader | Branding, current portal, notifications, user menu | Unread notice, expanded menu, multiple memberships | Compact branding; retain portal label and menu names |
| Sidebar | Grouped permitted destinations | Active, expanded, collapsed, absent group | Replaced by MobileDrawer |
| MobileDrawer | Full navigation access | Open/closed, active destination | Focus contained while open; close button; return focus to trigger |
| PageHeader | Page purpose/context and main action | View, editing, unsaved, submitting | Title then context then full-width action if useful |
| Breadcrumb | Return path on nested tasks | Current non-link; parent link | Short parent/back link without losing queue context |
| StatCard | Small actionable count, never decoration | Loading, real zero, error, stale | Compact count list; avoid tall stacks |
| DataTable | Staff queues, rosters, records | Sort, selected rows, loading, empty, filtered empty, error | Task cards for queues; controlled scrolling for true comparisons |
| SearchFilterBar | Reduce queue/term scope | Applied filters, no matches, reset | Search plus labeled filter drawer and active summary |
| Tabs | Related views of one record | Active, keyboard focus, unavailable state | Short labels; scroll without hiding active tab |
| StatusBadge | Named domain status | Neutral/info/success/warning/danger | Text remains visible; not color-only |
| ProgressStepper | Applicant/enrollment next milestone | Complete/current/future; halted branch | Current + next first; vertical expandable full journey |
| Timeline | Trace schedules, submissions, issuance | Event time, actor if allowed, correction, no events | Vertical chronological list |
| InfoCard | Group identity or contextual facts | Missing field, loading, read-only | Label/value stack; long identifiers wrap |
| Alert | Actionable warning or failure | Info, unsaved, stale, error, dismissible if safe | Inline beside relevant task; no covering content |
| FormSection | Meaningful chunks of application/encoding | Untouched, edited, invalid, saving, saved | Single column; no artificial carousel |
| DocumentRow | Issued COE/COR/DCAT form and availability | Pending, issued, unavailable, download failed, superseded | Document name/state above action; metadata wraps |
| ScheduleCard | Physical appointment/class facts | Unassigned, scheduled, changed, past | Date/time/place and instructions visible without hover |
| EmptyState | Explain absence and useful next step | First use, no results, no assignment, no release | Concise text and one relevant action |
| LoadingState | Communicate pending retrieval | Initial load, region refresh, action pending | Stable layout; accessible busy/status text |
| ErrorState | Explain failure and recovery | Load error, save error, conflict, forbidden | Keep task context; retry inline; no raw technical trace |
| Modal | Short focused supplementary task | Open, invalid, pending | Full-screen when needed; no complex nested dialogs |
| Drawer | Inspect queue item without losing list | Loading, detail, unsaved, error | Full-screen detail; back restores list |
| ConfirmDialog | Review consequential action | Before/after, reason, pending, failed | Readable consequence and explicit action; no offscreen button |
| Pagination | Bound long queues/records | Current page, next/previous, count unknown | Previous/Next plus page context; no infinite scroll dependency |
| NotificationItem | Link to authorized actionable update | Unread/read, stale target, removed permission | Useful short label; no sensitive preview |

## Status vocabulary

Statuses belong to domains; do not put every word in one universal dropdown. Qualify ambiguous Pending (“Pending verification”) in surrounding text. Color roles are semantic only; final colors are not selected.

| Label | Meaning / example | Semantic category |
|---|---|---|
| Draft | Saved work not submitted | Neutral |
| Pending | Waiting for named action/owner | Warning when action required, otherwise neutral |
| Scheduled | Confirmed appointment/meeting | Informational |
| Submitted | Delivered for processing, not approved | Informational |
| Under Review | Authorized review underway | Informational |
| Verified | Requirements checked by authorized staff | Success |
| Approved | Explicit approval completed, not publication | Success |
| Rejected | Request/review denied under confirmed policy, with reason | Danger |
| Passed | Released passing DCAT outcome | Success |
| Not Qualified | Released non-passing DCAT outcome; replaces “Failed” in applicant UX | Neutral; outcome heading and text, no alarming red treatment |
| In Progress | Work actively being performed | Informational |
| Completed | Task fulfilled | Success |
| Cancelled | Ended without completion | Neutral |
| Locked | Editing currently disallowed by workflow | Neutral, with reason |

Lifecycle labels (Eligible for DCAT, For Enrollment, Enrolled, Active Student, Graduating, Graduated) retain their specific meaning. Document state is Issued/Not yet issued; result visibility is Not yet released/Released. These are domain conditions, not synonyms for Approved. “Resolved” is a maintenance action/history event resulting in Completed. Present/Late/Absent are attendance values; Unmarked is missing data. Do not convert it to Absent. “Needs attention” is explanatory text, not a new lifecycle stage. Never display a load failure as a domain status such as Rejected or Not Qualified.

## Action and feedback semantics

- View opens read-only information. Edit changes a draft. Save Draft persists without submitting. Submit hands work to its next owner. Approve records approval. Release/Publish changes audience visibility. Issue records a document milestone. Delete is not a default V1 workflow action; prefer a defined correction/cancellation process.
- Confirm release of results, submission/release of grades, publication to broad audiences, document issuance, permissions changes and account disabling. Show affected person/class/audience, before/after when relevant, consequences and a precise action label. Cancel is safe and restores focus.
- Permission denial hides controls. A permitted action with unmet prerequisites shows the requirement, for example “Verify documents before scheduling DCAT.” Recheck scope and current state at action time later.
- Mark dirty forms and saved time. On failure retain editable inputs within the active view, flag unsaved work and offer Retry. Do not promise persistence across session expiry or offline reload; storage choices are outside Phase 1.
- Ambiguous save/submit results require refreshing authoritative status before another attempt. Concurrent edits show a conflict and reconciliation path; never silently overwrite. Successful changes announce concise status and update affected queues.
- Notifications supplement dashboard status; the workflow must remain understandable if a notification is missed. Dates include readable day/month/year and local time context (Philippine time); never show an invented deadline or countdown.

## Shared accessibility acceptance intentions

All fields have persistent labels, helper text and associated errors. Error summary links to fields; focus moves appropriately after failed submission. Native-feeling keyboard order follows reading order. Dialogs contain focus, close predictably and restore it. Status updates are announced without repeatedly interrupting input. Tables retain column headers; card transformations retain field labels. Icon-only controls have accessible names. Documents need accessible content equivalents; the schedule page remains readable if download fails. These are design requirements for later implementation checks, not a compliance claim.
