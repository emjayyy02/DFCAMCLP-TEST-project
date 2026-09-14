# P2-M4 access control

P2-M4 adds a small deny-by-default authorization layer after Better Auth. It answers which portal an active account may enter, which role the account has there, and which shell destinations that role may use. It does not authorize any real student, applicant, class, grade, attendance, employee, or operational resource.

## Authentication and authorization

Better Auth remains responsible for identity, password verification, cookies, sessions, and sign-out. `application_accounts` remains the domain link from an auth user to one Person and retains `ACTIVE` / `DISABLED` state.

Authorization begins only after that authentication boundary:

```text
Authenticated active application account
  → active portal membership
  → portal-scoped role
  → small portal-scoped permission set
  → protected portal route
  → permission-filtered navigation
```

A valid account grants no portal by implication. Missing membership, inactive membership, missing role, or missing permission is denied.

## Relational model

Migration `drizzle/0002_striped_angel.sql` adds five tables, all with UUID primary keys:

| Table                | Purpose                                                                               |
| -------------------- | ------------------------------------------------------------------------------------- |
| `portal_memberships` | Explicit application account → portal relationship with `is_active` revocation state. |
| `roles`              | Small named role catalog; every role belongs to one portal.                           |
| `permissions`        | Shell/navigation permission vocabulary; every permission belongs to one portal.       |
| `role_permissions`   | Portal-consistent role → permission mappings.                                         |
| `membership_roles`   | Portal-consistent membership → role assignments.                                      |

`portal_code` is a PostgreSQL enum with `APPLICANT`, `STUDENT`, `ACADEMIC`, `RECORDS`, `OPERATIONS`, and `TECHNOLOGY`. These six values are stable product architecture established in Phase 1, rather than mutable institutional content. Display labels remain application data.

Unique constraints prevent duplicate account/portal memberships, role codes, permission codes, role/permission mappings, and membership/role assignments. Composite foreign keys include the portal on both sides of role mappings. PostgreSQL therefore rejects a role or permission assigned across portal families; UI validation is not the only protection. Foreign keys use restrictive behavior so deleting an authorization catalog row cannot silently erase assignments.

## Roles and permissions

| Portal               | Role                | Effective shell permissions                                     |
| -------------------- | ------------------- | --------------------------------------------------------------- |
| Applicant            | Applicant           | portal                                                          |
| Student              | Student             | portal                                                          |
| Academic             | Faculty             | portal, teaching, attendance, grades                            |
| Academic             | Program Coordinator | Faculty set plus academic management                            |
| Admissions & Records | Records Staff       | portal, applicants, students, enrollment                        |
| Operations           | Maintenance Staff   | portal, facilities                                              |
| Operations           | School Admin        | portal, student services, employees, facilities, administration |
| Technology           | IT Admin            | portal, accounts, security, system                              |
| Technology           | Developer           | portal, system, developer                                       |

Permission codes are intentionally limited to the shell vocabulary documented in the M4 brief. They do not mean that a role may read or mutate every future resource behind the label. For example, `academic.grades.view` makes the Grades placeholder destination available; it does not authorize a faculty member to view or edit any particular student's grade.

## Deterministic development assignments

| Fake account                        | Membership and role                        |
| ----------------------------------- | ------------------------------------------ |
| `applicant.test@example.invalid`    | Applicant — Applicant                      |
| `student.test@example.invalid`      | Student — Student                          |
| `faculty.test@example.invalid`      | Academic — Faculty                         |
| `records.test@example.invalid`      | Admissions & Records — Records Staff       |
| `operations.test@example.invalid`   | Operations — Maintenance Staff             |
| `technology.test@example.invalid`   | Technology — IT Admin                      |
| `coordinator.test@example.invalid`  | Academic — Program Coordinator             |
| `school-admin.test@example.invalid` | Operations — School Admin                  |
| `faculty-it.test@example.invalid`   | Academic — Faculty; Technology — Developer |

The original six M3 accounts remain. The latter three clearly fake accounts prove same-portal role differences and multi-portal access. `seedAccessControl()` uses conflict-aware writes for roles, permissions, mappings, memberships, and assignments, so repeated seeding does not create duplicates.

## Authoritative login selection

The login form posts credentials and the selected canonical portal code to `/api/portal-login`.

1. Better Auth verifies the credentials and creates a candidate session.
2. The server loads only active memberships, roles, and permissions for that application account.
3. The requested portal must have both an active membership and its portal-view permission.
4. On success, the Better Auth cookie is returned and the response names the authorized portal root.
5. On portal denial, the exact candidate session token is deleted and no cookie is returned. The form shows: “This account does not have access to the selected portal.”

The selected value never creates or changes membership. Invalid credentials retain the existing generic error. A failed portal check does not leave a silently authenticated browser session.

## Server authorization architecture

`src/server/access-control/service.ts` is the database-facing access layer. It builds one access context containing the current authenticated user, application account/Person link, active memberships, assigned roles, and effective permissions. It exposes small `canEnterPortal`, `hasPermission`, and `canAccessPortalPath` checks.

`src/server/access-control/current.ts` adapts that layer to Next.js. React `cache()` memoizes the authoritative access graph within one render pass. `requirePortal()` redirects an unauthenticated request to login and invokes Next.js `forbidden()` for an authenticated request without portal access. `requirePortalPath()` applies the destination permission at the leaf page. The shared dynamic portal layout also requires membership before rendering the shell; the leaf check remains necessary because Next.js layouts are not the only security boundary during partial rendering.

The route catalog is explicit. Unknown paths are not treated as permitted placeholders. Navigation is generated only after the server filters this catalog against effective permissions; hiding a link is convenience, while the leaf guard is enforcement.

## Revocation and disabled accounts

An inactive `portal_memberships` row removes only that portal from the access context. The application account may remain authenticated and may continue using another explicitly assigned portal. This is portal membership revocation.

A `DISABLED` application account retains M3 behavior: sign-in is rejected, existing sessions are removed, and protected session checks return no active identity. It is not implemented by toggling every membership. These states stay separate so removing one portal does not disable the entire account.

## Deliberately deferred

M4 contains no membership/role editing UI, universal superuser, object ownership policy, grant-approval workflow, emergency access, audit service, resource data, or school business action. Full shared audit and regression foundation belongs to P2-M5. Future business features must enforce resource-level policy near their own data and mutations; these shell permissions are not sufficient.

The `forbidden()` response uses Next.js 16.3.5's experimental `authInterrupts` option to produce a real 403 UI. This is acceptable for the demo foundation but must be rechecked during future framework upgrades. Authentication endpoints remain public API surfaces and retain Better Auth origin/CSRF protection.
