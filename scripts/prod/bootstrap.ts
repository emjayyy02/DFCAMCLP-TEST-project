import type { TransactionSql } from "postgres";
import { hashPassword, verifyPassword } from "better-auth/crypto";
import {
  campusSeed,
  programSeed,
  majorSeed,
  seedIds,
  developmentAuthAccountSeed,
} from "../../src/server/db/seed/data";
import {
  membershipSeed,
  roleSeed,
  permissionSeed,
  rolePermissionSeed,
} from "../../src/server/access-control/seed-data";

type Row = Record<string, string | number | boolean | null>;
const snake = (row: Row): Row =>
  Object.fromEntries(
    Object.entries(row).map(([key, value]) => [
      key.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`),
      value,
    ]),
  );
function conflict(): never {
  throw new Error("Canonical demo state conflicts; transaction aborted.");
}

// Internal worker. The CLI validates production configuration before connecting.
// Integration tests use this worker within an isolated local test schema.
export async function bootstrapDemo(sql: TransactionSql, password: string) {
  let inserted = 0;
  let credentialsUpdated = 0;
  async function ensure(table: string, row: Row, keys: string[]) {
    const where = keys.map((key) => sql`${sql(key)} = ${row[key]}`);
    const predicate = where.reduce((left, right) => sql`${left} AND ${right}`);
    let rows = await sql`SELECT * FROM ${sql(table)} WHERE ${predicate}`;
    if (!rows.length) {
      const added =
        await sql`INSERT INTO ${sql(table)} ${sql(row)} ON CONFLICT DO NOTHING RETURNING *`;
      inserted += added.length;
      rows = await sql`SELECT * FROM ${sql(table)} WHERE ${predicate}`;
    }
    if (
      rows.length !== 1 ||
      Object.entries(row).some(([key, value]) => rows[0][key] !== value)
    )
      conflict();
    return rows[0];
  }
  await sql`SET LOCAL lock_timeout = '10s'`;
  await sql`LOCK TABLE campuses, programs, program_majors, people, student_profiles,
    applicant_profiles, employee_profiles, auth_users, auth_accounts, application_accounts,
    roles, permissions, role_permissions, portal_memberships, membership_roles IN SHARE ROW EXCLUSIVE MODE`;

  // Validate all existing identities before domain or credential changes.
  for (const seed of developmentAuthAccountSeed) {
    const users =
      await sql`SELECT * FROM auth_users WHERE lower(email) = ${seed.email}`;
    const links =
      await sql`SELECT * FROM application_accounts WHERE person_id = ${seed.personId}`;
    if (users.length > 1) conflict();
    if (users.length) {
      const user = users[0];
      const mappings =
        await sql`SELECT * FROM application_accounts WHERE auth_user_id = ${user.id}`;
      if (
        user.email !== seed.email ||
        user.name !== seed.name ||
        mappings.length !== 1 ||
        mappings[0].person_id !== seed.personId ||
        mappings[0].status !== "ACTIVE" ||
        links.length !== 1
      )
        conflict();
    } else if (links.length) conflict();
  }
  for (const row of campusSeed)
    await ensure("campuses", { ...snake(row), is_active: true }, ["id"]);
  for (const row of programSeed)
    await ensure("programs", { ...snake(row), is_active: true }, ["id"]);
  for (const row of majorSeed)
    await ensure("program_majors", { ...snake(row), is_active: true }, ["id"]);
  for (const seed of developmentAuthAccountSeed)
    await ensure(
      "people",
      {
        id: seed.personId,
        first_name: seed.name.split(" ")[0],
        last_name: seed.name.split(" ").slice(1).join(" "),
        middle_name: null,
        suffix: null,
        date_of_birth: null,
      },
      ["id"],
    );
  await ensure(
    "student_profiles",
    {
      id: seedIds.profiles.student,
      person_id: seedIds.people.student,
      student_number: "TEST-2027-0001",
      program_id: seedIds.programs.bsis,
      major_id: null,
      year_level: 1,
      student_status: "ACTIVE",
    },
    ["id"],
  );
  await ensure(
    "applicant_profiles",
    {
      id: seedIds.profiles.applicant,
      person_id: seedIds.people.applicant,
      applicant_number: "APP-TEST-0001",
      selected_program_id: seedIds.programs.cpe,
      selected_major_id: null,
      application_status: "ACTIVE",
    },
    ["id"],
  );
  await ensure(
    "employee_profiles",
    {
      id: seedIds.profiles.employee,
      person_id: seedIds.people.employee,
      employee_number: "EMP-TEST-0001",
      department_label: "Development Test Services",
      position_title: "Synthetic Test Employee",
      employment_status: "ACTIVE",
    },
    ["id"],
  );

  const userIds = new Map<string, string>();
  for (const seed of developmentAuthAccountSeed) {
    let [user] =
      await sql`SELECT * FROM auth_users WHERE email = ${seed.email}`;
    if (!user)
      user = await ensure(
        "auth_users",
        {
          id: crypto.randomUUID(),
          email: seed.email,
          name: seed.name,
          email_verified: false,
        },
        ["id"],
      );
    await ensure(
      "application_accounts",
      { auth_user_id: user.id, person_id: seed.personId, status: "ACTIVE" },
      ["auth_user_id"],
    );
    userIds.set(seed.email, user.id);
    let credentials =
      await sql`SELECT * FROM auth_accounts WHERE user_id = ${user.id}`;
    if (!credentials.length) {
      await ensure(
        "auth_accounts",
        {
          id: crypto.randomUUID(),
          user_id: user.id,
          account_id: user.id,
          provider_id: "credential",
          password: await hashPassword(password),
        },
        ["id"],
      );
      credentials =
        await sql`SELECT * FROM auth_accounts WHERE user_id = ${user.id}`;
    }
    if (
      credentials.length !== 1 ||
      credentials[0].provider_id !== "credential" ||
      credentials[0].account_id !== user.id
    )
      conflict();
    const credential = credentials[0];
    let valid = false;
    try {
      valid =
        !!credential.password &&
        (await verifyPassword({ hash: credential.password, password }));
    } catch {
      /* Synchronize invalid hashes. */
    }
    if (!valid) {
      await sql`UPDATE auth_accounts SET password = ${await hashPassword(password)}, updated_at = NOW() WHERE id = ${credential.id} AND user_id = ${user.id}`;
      credentialsUpdated++;
    }
    const [verified] =
      await sql`SELECT password FROM auth_accounts WHERE id = ${credential.id}`;
    if (!(await verifyPassword({ hash: verified.password, password })))
      conflict();
  }
  const roleIds = new Map<string, string>();
  const permissionIds = new Map<string, string>();
  for (const row of roleSeed)
    roleIds.set(row.code, (await ensure("roles", { ...row }, ["code"])).id);
  for (const row of permissionSeed)
    permissionIds.set(
      row.code,
      (await ensure("permissions", { ...row }, ["code"])).id,
    );
  for (const role of roleSeed) {
    const codes = rolePermissionSeed[role.code];
    for (const code of codes)
      await ensure(
        "role_permissions",
        {
          role_id: roleIds.get(role.code)!,
          permission_id: permissionIds.get(code)!,
          portal: role.portal,
        },
        ["role_id", "permission_id"],
      );
    const actual =
      await sql`SELECT permission_id FROM role_permissions WHERE role_id = ${roleIds.get(role.code)!}`;
    if (
      actual.length !== codes.length ||
      actual.some(
        (row) =>
          !codes.some((code) => permissionIds.get(code) === row.permission_id),
      )
    )
      conflict();
  }
  for (const row of membershipSeed) {
    const membership = await ensure(
      "portal_memberships",
      {
        application_account_id: userIds.get(row.email)!,
        portal: row.portal,
        is_active: true,
      },
      ["application_account_id", "portal"],
    );
    await ensure(
      "membership_roles",
      {
        portal_membership_id: membership.id,
        role_id: roleIds.get(row.role)!,
        portal: row.portal,
      },
      ["portal_membership_id", "role_id"],
    );
    const assigned =
      await sql`SELECT role_id FROM membership_roles WHERE portal_membership_id = ${membership.id}`;
    if (assigned.length !== 1 || assigned[0].role_id !== roleIds.get(row.role))
      conflict();
  }
  const ids = [...userIds.values()];
  const memberships =
    await sql`SELECT * FROM portal_memberships WHERE application_account_id IN ${sql(ids)}`;
  const users = await sql`SELECT id FROM auth_users WHERE id IN ${sql(ids)}`;
  const links =
    await sql`SELECT auth_user_id FROM application_accounts WHERE auth_user_id IN ${sql(ids)}`;
  if (users.length !== 9 || links.length !== 9 || memberships.length !== 10)
    conflict();
  return {
    accounts: 9,
    links: 9,
    credentials: 9,
    memberships: 10,
    roles: "verified",
    permissions: "verified",
    michaelCastro: ["ACADEMIC", "TECHNOLOGY"],
    inserted,
    credentialsUpdated,
    materialChanges: inserted + credentialsUpdated,
  };
}
