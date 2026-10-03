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

For an existing local development/test database, run `pnpm auth:sync-demo` before re-seeding. The command validates the exact nine stable person/credential mappings, then updates existing auth names/emails and linked person names in one transaction. It does not create accounts, reset the database, or alter memberships, roles, or permissions. Email collisions or incomplete mappings roll back the transaction. Its existing credential sync uses the unchanged local `AUTH_SEED_PASSWORD`; this identity migration updated zero passwords.

Fresh databases use the normal `pnpm db:migrate` and `pnpm db:seed` workflow. Keep credentials in the local environment. The Faculty + Developer account retains Academic and Technology memberships. Archived milestone evidence may contain older identities; the current gallery is [Final Check Pass 4](../final-check-pass-4/index.html): 493 views, 7,875 PNG paths and all nine canonical identities.

The [public demo release check](phase-4/P4-PUBLIC-DEMO-RELEASE-CHECK.md) records fresh local identity, applicant, recovery, auth and release evidence. The seeded shared identities cannot change their canonical identity/email/password, delete their account, or list/revoke other reviewers' sessions. They can sign out of their own current session. School workflows and temporary photo/bio previews retain their existing demo boundaries.

No owner-approved shared public password has been supplied. Login → View demo accounts remains email-only, with role, email, authorized portal labels, Copy email and optional email prefill; it never auto-signs in. Keep the private local seed password out of source, public UI, screenshots and reports. Publish a shared password and Copy control only after owner approval, sanctioned synchronization and successful verification for all nine accounts. No credential synchronization or password change was performed in the final release check.
