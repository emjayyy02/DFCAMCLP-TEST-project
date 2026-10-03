# Current fictional demo accounts

The canonical account definitions are `src/server/db/seed/data.ts`. The public login panel, domain fixtures, and portal membership definitions derive from those nine accounts. These are fictional identities, with non-deliverable email addresses.

| Role                 | Name               | Email                             |
| -------------------- | ------------------ | --------------------------------- |
| Applicant            | Juan Dela Cruz     | juan.delacruz@example.invalid     |
| Student              | John Paul Reyes    | johnpaul.reyes@example.invalid    |
| Faculty              | Maria Santos       | maria.santos@example.invalid      |
| Admissions & Records | Jose Garcia        | jose.garcia@example.invalid       |
| Maintenance Staff    | Mark Ramos         | mark.ramos@example.invalid        |
| IT Admin             | Angelo Cruz        | angelo.cruz@example.invalid       |
| Program Coordinator  | Angelica Bautista  | angelica.bautista@example.invalid |
| School Admin         | Mary Grace Mendoza | marygrace.mendoza@example.invalid |
| Faculty + Developer  | Michael Castro     | michael.castro@example.invalid    |

Princess Aquino is an unused approved placeholder, without an account.

For an existing local development/test database, `pnpm auth:sync-demo` reads the owner-approved `DEMO_ACCOUNT_PASSWORD`, validates the exact nine stable Person/credential mappings, and updates only their existing credentials in a transaction. It fails clearly if the variable is missing. Canonical identity migration remains allowlisted; already-correct identity/domain records are untouched. The command is idempotent and does not create accounts, reset the database, or alter memberships, roles or permissions. Email collisions or incomplete mappings roll back the transaction.

Fresh databases use the normal `pnpm db:migrate` and `pnpm db:seed` workflow. Keep credentials in the local environment. The Faculty + Developer account retains Academic and Technology memberships. Archived milestone evidence may contain older identities; the current gallery is [Final Check Pass 4](../final-check-pass-4/index.html): 493 views, 7,875 PNG paths and all nine canonical identities.

The [public demo release check](phase-4/P4-PUBLIC-DEMO-RELEASE-CHECK.md) records fresh local identity, applicant, recovery, auth and release evidence. The seeded shared identities cannot change their canonical identity/email/password, delete their account, or list/revoke other reviewers' sessions. They can sign out of their own current session. School workflows and temporary photo/bio previews retain their existing demo boundaries.

The approved shared credential is synchronized and verified for all nine accounts. Login → View demo accounts shows a masked Demo password with Show/Hide and Copy, alongside role, email, authorized portals, Copy email and Use this account. The last action fills only the email; sign-in remains manual. The value comes only from the server-side `DEMO_ACCOUNT_PASSWORD` environment setting and is not hardcoded here or in source/screenshots. Configure that same approved variable on the eventual production host; actual hosted verification remains deployment handoff work. See the [final credential evidence](phase-4/public-demo-credential-handoff/sync-verification.json).
