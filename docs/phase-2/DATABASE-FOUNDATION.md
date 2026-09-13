# P2-M2 database foundation

P2-M2 introduces the typed PostgreSQL foundation only. PostgreSQL 17 remains the system of record. Drizzle ORM supplies the TypeScript schema and query layer; Drizzle Kit generates versioned SQL migrations. Authentication, authorization and school workflows are intentionally absent.

## Structure

```text
drizzle/
├── 0000_rare_mantis.sql
└── meta/
scripts/db/
├── environment.ts
├── migrate.ts
├── reset-dev.ts
└── seed.ts
src/server/db/
├── connection.ts
├── index.ts
├── queries/foundation.ts
├── schema/
│   ├── index.ts
│   ├── institution.ts
│   ├── people.ts
│   └── profiles.ts
└── seed/
    ├── data.ts
    └── index.ts
```

`src/server/db/index.ts` is marked `server-only` and is the configured application entrypoint that reads `DATABASE_URL`. Schema, migration and seed utilities receive configuration from the validated server environment and never hardcode connection credentials. `DATABASE_URL` has no `NEXT_PUBLIC_` prefix and is never exposed to browser code.

## Tables and relationships

All seven tables use internal UUID primary keys with PostgreSQL `gen_random_uuid()` defaults. Human-facing applicant, student and employee numbers are separate nullable fields because issuance checkpoints and final formats remain unresolved.

| Table                | Purpose and notable columns                                                                                                           |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| `people`             | One human identity: required first and last name; optional middle name, suffix and date of birth.                                     |
| `campuses`           | Configurable campus code/name, optional short/location labels and active flag.                                                        |
| `programs`           | A program belongs to one campus; global program code, formal working name, short name and active flag.                                |
| `program_majors`     | A major belongs to one program; code is unique within that program.                                                                   |
| `applicant_profiles` | One applicant profile per person; optional applicant number, selected program and matching selected major; minimal profile state.     |
| `student_profiles`   | One student profile per person; optional student number, required program, optional matching major/year level; minimal profile state. |
| `employee_profiles`  | One employee profile per person; optional employee number, department label and position title; minimal profile state.                |

The identity model permits one person to own both an applicant profile and a student profile. It does not copy the person's name into each institutional profile. A unique `person_id` inside each profile table prevents duplicate profiles of the same type while allowing different profile types for the same person.

Programs determine campuses. `student_profiles` therefore does not duplicate `campus_id`; a student's campus is retrieved through `student_profiles.program_id → programs.campus_id`. Applicant campus is derived the same way from the selected program. This prevents contradictory program/campus pairs.

BSBA is one program. Financial Management, Marketing Management and Human Resource Management are rows in `program_majors`, not unrelated programs. Composite foreign keys on applicant and student profiles enforce that a selected major belongs to the selected program. An applicant may omit both selections while still in an early lifecycle stage, but a major cannot exist without a program.

Employee department remains a nullable label because an authoritative department structure and ownership policy are not confirmed. Introducing a speculative HR hierarchy would exceed M2.

## Institutional codes and working names

The development seed uses campus codes `MAIN` and `IIT_CAA`. Program codes are globally unique: `BSA`, `BSBA`, `BSIS` and `CPE`. The working display short name for `CPE` is `CpE`; its formal stored name is `Computer Engineering`, which remains provisional until the official degree name is confirmed.

These are database data values, not React control flow. UI code must query configured relationships rather than branch on the literals.

## Nullability and constraints

Required relationships and labels are non-null. Lifecycle-dependent fields remain nullable:

- `date_of_birth` is not yet required by the Phase 2 foundation.
- institutional numbers are nullable because their creation algorithms and issuance checkpoints are not frozen;
- applicant program/major selection may be absent in a draft;
- student major is optional because not every program has majors;
- year level is optional until an authoritative academic record supplies it;
- employee department and position are optional because employee policy remains open.

Unique constraints cover campus code, global program code, program-major code within its program, one profile of each type per person, and every non-null applicant/student/employee number. PostgreSQL permits multiple nulls in those number columns while rejecting duplicate issued values.

Checks require a selected applicant major to have a selected program and require any stored student year level to be positive. Composite major/program foreign keys reject invalid cross-program major assignments.

## Referential behavior

Every foreign key uses `ON DELETE RESTRICT ON UPDATE RESTRICT`. Deleting a person, campus, program or major cannot silently cascade into profile or institutional history. Internal UUID primary keys are stable and are not intended to be updated. Later features must define explicit archival/correction behavior rather than treating cascade deletion as a lifecycle operation.

## Status enums

Two small PostgreSQL enums protect only stable foundation states:

- `applicant_profile_status`: `DRAFT`, `ACTIVE`, `INACTIVE`;
- `institutional_profile_status`: `ACTIVE`, `INACTIVE`, shared by student and employee profiles.

These describe whether a foundation profile is usable; they are not an admissions, enrollment, employment or student-standing workflow. DCAT, document, result, enrollment and academic statuses are deliberately deferred.

## Timestamps

Every table stores `created_at` and `updated_at` as timezone-aware timestamps. Both default on insert. Application writes that change a row must explicitly update `updated_at`; M2 does not add hidden database triggers before write behavior is defined. The deterministic seed updates this value when it reconciles an existing seed row.

## Migrations

`drizzle.config.ts` loads the same root `.env` convention as Next.js through `@next/env`, validates it with the existing Zod server environment parser and points Drizzle Kit at the modular schema.

```powershell
pnpm db:generate
pnpm db:migrate
pnpm db:studio
```

`db:generate` creates reviewable SQL and Drizzle metadata under `drizzle/`. `db:migrate` applies committed migrations and records them in `drizzle.__drizzle_migrations`. Schema push is not the primary migration path.

## Development seed

```powershell
pnpm db:seed
```

The seed uses stable UUIDs and conflict-aware writes. Repeating it reconciles the same rows instead of duplicating them. It creates only clearly fake people and institutional relationships:

- Main Campus — Talon III → BSA, BSBA;
- BSBA → Financial Management, Marketing Management, Human Resource Management;
- IIT / CAA Campus → BSIS, CPE;
- Alex Teststudent → `TEST-2027-0001` → BSIS → IIT / CAA;
- Jamie Testapplicant → `APP-TEST-0001` → CPE → IIT / CAA;
- Taylor Testemployee → `EMP-TEST-0001` with explicitly synthetic labels.

The number formats above are development placeholders, not final institutional algorithms.

## Safe development reset

```powershell
pnpm db:reset:dev
```

This destructive command drops and recreates the `public` and Drizzle migration schemas inside the configured development database, then migrates and seeds. It refuses to run unless all of these are true:

- `APP_ENV` is `development`;
- the PostgreSQL host is `localhost`, `127.0.0.1` or `::1`;
- `DATABASE_URL` targets the configured `POSTGRES_DB` with `POSTGRES_USER`;
- the database name ends in `_dev`.

There is intentionally no generic `db:reset` command. The reset does not delete Docker volumes or any other database.

## Tests and query proof

```powershell
pnpm test
pnpm db:migrate
pnpm test:db
```

The database suite proves connection/configuration, migration presence, repeatable seed behavior, institution relationships, person/profile joins, unique constraints, foreign keys and cross-program major rejection. Typed query helpers retrieve campus programs, program majors, a student with person/program/campus and an applicant with person/program/campus.

## Intentionally deferred

No Applicant ID, Student ID or username generator is implemented. There are no user accounts, Better Auth tables, sessions, portal memberships, roles, permissions or authorization rules. There are no admission/DCAT/enrollment tables, subjects, curricula, sections, offerings, grades, attendance, payments, maintenance, notifications, HRIS or Phase 3 workflows. P2-M3 has not started.
