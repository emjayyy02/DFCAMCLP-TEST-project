# P2-M4 portal shell

The authenticated portal shell reuses the approved visual foundation: cool-neutral canvas, white structured surfaces, dark typography, blue interaction/orientation, and restrained yellow context. No official seal, logo, institutional palette claim, notification data, or dashboard statistic is introduced.

## Structure

`AppShell` composes:

- `TopHeader`: text identity, current portal, optional portal switcher, and user menu;
- `Sidebar`: desktop navigation filtered by effective permissions;
- `MobileDrawer`: the same filtered navigation in a native modal dialog;
- `PageHeader`: consistent page title and contextual description;
- `UserMenu`: safe account identity, Account, and Sign out;
- `PortalSwitcher`: present only for accounts with more than one active membership.

The shared `[portal]` server layout supplies only safe display data to the client shell. Raw database IDs, session tokens, and permission codes are not rendered. The current role label is visible as context, while authorization remains server-side.

## Navigation behavior

The explicit M4 destination catalog contains:

| Portal               | Foundation routes                                                                                                              |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| Applicant            | `/applicant`                                                                                                                   |
| Student              | `/student`                                                                                                                     |
| Academic             | `/academic`, `/academic/classes`, `/academic/attendance`, `/academic/grades`, `/academic/management`                           |
| Admissions & Records | `/records`, `/records/applicants`, `/records/students`, `/records/enrollment`                                                  |
| Operations           | `/operations`, `/operations/student-services`, `/operations/employees`, `/operations/facilities`, `/operations/administration` |
| Technology           | `/technology`, `/technology/accounts`, `/technology/security`, `/technology/system`, `/technology/developer`                   |

The active route uses one soft-blue treatment with blue foreground. Inaccessible items are absent. A typed URL still reaches the server guard: Faculty cannot open Academic Management, Maintenance Staff cannot open Employees or Administration, and IT Admin cannot open Developer without the separate Developer role.

Every page is deliberately lightweight: title, short future-scope description, authenticated role context, and an access-foundation notice. No page simulates an Applicant workflow, Student dashboard, class roster, grade record, attendance entry, Records queue, maintenance ticket, or Technology administration tool.

## Portal switcher and user menu

Single-membership accounts see no unnecessary switch control. `faculty-it.test@example.invalid` sees Academic and Technology only. Switching uses the existing authenticated Better Auth session and opens the selected portal root; the destination layout and page recheck the membership and permission graph.

The user menu exposes only Account and Sign out. `/account` now lists email, active account state, active portal memberships, and human-readable role labels. It does not expose raw permission codes.

## Access denied

Unauthenticated portal requests redirect to `/login` with the requested portal preselected. Authenticated requests without the portal membership or destination permission render the global `forbidden.tsx` Access denied experience with an HTTP 403 interrupt. The message names no internal role, permission, or database identifier.

## Responsive and accessibility behavior

Desktop uses a 256px light sidebar and flexible main region beneath a 64px header. Below the desktop shell breakpoint, the sidebar is removed rather than squeezed. A 44px menu button opens a side-aligned native `<dialog>`, which supplies modal focus containment and Escape dismissal. The close button works by pointer and keyboard; closing restores focus to the opener. Navigation closes the drawer before the route transition.

All navigation and controls retain approximately 44px minimum targets, visible focus, semantic header/main/nav/aside/footer landmarks, meaningful button labels, and text-based state. Long account values wrap, the main grid uses `minmax(0,1fr)`, and mobile surfaces avoid fixed content heights. Reduced-motion rules remain global. The portal switcher and user menu use keyboard-operable native disclosure controls.

The browser acceptance target remains 375×812, an intermediate 768-class width, and 1440×900. Validation evidence is recorded in [M4 validation](M4-VALIDATION.md); source/build success alone is not treated as responsive proof.
