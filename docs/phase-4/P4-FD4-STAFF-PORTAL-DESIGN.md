# P4-FD4 — Staff Portal Final Design Pass

**Status: PASS / COMPLETE — 30 September 2026.** This pass applies the [Final Visual Lock](P4-FINAL-VISUAL-LOCK.md) and [FD2 foundation](P4-FD2-SHARED-VISUAL-FOUNDATION.md) to Academic, Admissions & Records, Operations, and Technology. [P4-UX-RULES.md](P4-UX-RULES.md) continues to own behavior. M7 has not started.

## Implementation

- **Academic:** Today's classes and editable teaching tasks lead the dashboard; activity and the notice are plain ruled secondary sections. Class facts and roster now form one continuous work surface. Announcements use a flat editorial feed with the existing audience filters. The Coordinator's read-only overview uses a quiet supervisory introduction before the offering register. Attendance and grade dialogs, save/review/submit behavior, and roster controls remain intact.
- **Admissions & Records:** The inset criteria strip aligns with the ruled directory results. Applicant identity columns retain at least 18rem on desktop; mobile records remain ruled links. The applicant detail's repeated panel title and tab spacing are quieter, bringing the physical checklist closer to the entity heading. Search, filters, sort defaults, inline reviews, physical-document semantics, and statuses are unchanged.
- **Operations:** Maintenance attention counts are a compact band above the active ticket queue. School Admin keeps the support queue first while directory, reference, and activity summaries become plain ruled sections. Ticket facts are tighter, with editable status and assignment forms before a quiet history region. At phone width, facts group in two columns so the action arrives sooner. Priority and status remain distinct.
- **Technology:** Authentication, authorization, scenarios, system environment, and Developer references use plain technical sections and registers. The primary architecture section remains a panel. Account emails wrap at word boundaries; the existing 96rem directory and 1920px master/detail split remain in place. The selected detail remains beside the table on desktop and directly after its row on mobile.

The feature roots gained presentation-only `data-section` attributes. `TechnologySection` gained a presentation-only `plain` variant. No routes, fixtures, workflow/state logic, permissions/auth, validation, search/filter/sort logic, statuses, database, or backend code changed. The pre-existing FD3 Programs surface correction in the working tree was preserved.

## Changed files

Academic: `src/features/academic/academic-page.tsx`, `src/features/academic/academic.css`.

Records: `src/features/records/records-page.tsx`, `src/features/records/records.css`.

Operations: `src/features/operations/operations-page.tsx`, `src/features/operations/operations.css`.

Technology: `src/features/technology/technology-accounts.tsx`, `technology-dashboard.tsx`, `technology-developer.tsx`, `technology-security.tsx`, `technology-shared.tsx`, and `technology-system.tsx` in that same directory.

Documentation and new evidence: this report, `P4-ROADMAP.md`, and [fd4-after](fd4-after/manifest.json). Earlier FD1–FD3 captures were not overwritten.

## Rendered review

The [manifest](fd4-after/manifest.json) contains fresh 1920×1080 and 375×812 evidence for G17–G35 plus five extensions: three Records DCAT inline review states, one Records document preview, and one unchanged FD3 Applicant profile comparator. The 24 states produced 94 viewport, full-page, and relevant dialog-bottom images. Baseline and after images were inspected for the Academic dashboard/class/announcement/management, Records registry/detail, Maintenance and School Admin queues, ticket detail, Technology accounts/security/Developer, dialogs, drawer, account menu, switcher, and access denial. The manifest reports zero capture failures, page errors, missing images, invalid text weights, or page-level horizontal overflow.

The [responsive checks](fd4-after/responsive-checks.json) cover 12 representative staff routes at 320×812, 768×900, and 1440×900: all 36 stayed within the viewport. Four 375px representative pages with a 32px root font (200%) also stayed within the viewport. This is a browser text-size simulation, not an operating-system or physical-device test. The same run passed announcement filter selection, Records tab Arrow key navigation, mobile selected-account adjacency, drawer Escape/focus return, and attendance dialog Escape. [Control checks](fd4-after/control-checks.json) passed Records search, clear filters, and sort; Technology account search; portal switcher choices; and account menu visibility. The existing selected state, button targets, contrast tokens, and reduced-motion foundation were preserved; no new motion was introduced. These are sampled accessibility checks, not certification.

## Validation and limits

| Check               | Result                                                                                                                                                                                                                                                                                                 |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `pnpm test`         | PASS — 7 files, 52 tests                                                                                                                                                                                                                                                                               |
| `pnpm test:db`      | PASS — 12 tests                                                                                                                                                                                                                                                                                        |
| `pnpm test:auth`    | PASS — 9 tests                                                                                                                                                                                                                                                                                         |
| `pnpm test:access`  | PASS — 21 tests                                                                                                                                                                                                                                                                                        |
| `pnpm lint`         | PASS                                                                                                                                                                                                                                                                                                   |
| `pnpm typecheck`    | PASS after permitted generated-file sandbox rerun                                                                                                                                                                                                                                                      |
| `pnpm build`        | PASS — Next.js 16.3.5 production build after permitted `.next` sandbox rerun                                                                                                                                                                                                                           |
| `git diff --check`  | PASS                                                                                                                                                                                                                                                                                                   |
| `pnpm format:check` | Four unchanged pre-existing files remain unformatted: `docs/phase-4/PHASE-4-MANUAL-AUDIT.md`, `final-check-before-uiux/index.html`, `final-check-before-uiux/manifest.json`, and `final-check-before-uiux/source-integrity-before.json`. FD4 source, report, roadmap, and JSON evidence are formatted. |

No material visual defect remains in the reviewed Chromium states. Safari/WebKit and physical-device behavior were not verified. No database reset, credential sync, commit, push, or deployment was performed. Stop after FD4; M7 is next and has not started.

## Table sorting UX correction — 30 September 2026

The sortable desktop tables in Records Applicants, Records Students, and Technology Accounts now sort through their actual column-header buttons. Each active column shows ↑ or ↓ and its `<th>` exposes `aria-sort="ascending"` or `"descending"`; inactive sortable headers expose `aria-sort="none"`. The buttons retain the table-header type, have visible keyboard focus, and use the existing Source Sans 600 table style. Only columns with an existing sort key received a button. The Records requirements queue uses Review priority as its sortable column because its existing default order is requirement attention; the normal applicant directory retains Submitted as its default active column.

The standalone sort dropdowns were removed from those desktop table toolbars. Their ruled-list mobile layouts retain sorting through a compact inline “Sorted by” select and direction button. Records DCAT and Documents are ruled lists at every width, so their existing sort fields use that compact control at every width rather than gaining artificial table headers. Search, filters, result counts, clear actions, and empty states remain in place. Other staff sections had no user-sort control, so no sorting was added to fixed-order, schedule, reference, checklist, or public tables.

Existing defaults remain: Applicants newest submission; requirements queue highest review attention; Students name; DCAT earliest exam date; Documents name; Accounts name. The correction adds reversible direction to each existing sort field. Records detail links now retain the selected direction through the `direction` query parameter alongside the existing search, filter, and sort parameters. No fixture, backend, policy, or business-workflow data changed.

[Table-sort correction evidence](fd4-after/table-sort-correction/checks.json) records 45 passing browser checks and 20 captures across Applicants, Students, DCAT, Documents, and Accounts at 375×812, 768×900, 1440×900, and 1920×1080. Checks cover defaults, two-click reversal, filter and search combinations, clear/reset, empty results, keyboard Enter, detail navigation state, and page-level overflow; all sampled pages stayed within the viewport. This is Edge Chromium browser evidence, not Safari or physical-device verification. `pnpm test` passed 7 files and 52 tests; `pnpm lint`, `pnpm typecheck`, targeted Prettier check, and `git diff --check` passed. M7 has not started.
