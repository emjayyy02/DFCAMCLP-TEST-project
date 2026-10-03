import fs from "node:fs";
import crypto from "node:crypto";
import { spawnSync } from "node:child_process";
import postgres from "postgres";
import { verifyPassword } from "better-auth/crypto";
import { developmentAuthAccountSeed as seeds } from "../../../src/server/db/seed/data.ts";
import { assertDemoSyncEnvironment } from "../../../scripts/auth/demo-credential-guards.mjs";

let db,
  stage = "environment";
class CredentialVerificationError extends Error {}
const ensure = (condition, message) => {
  if (!condition) throw new CredentialVerificationError(message);
};
const digest = (data) =>
  crypto.createHash("sha256").update(JSON.stringify(data)).digest("hex");
try {
  assertDemoSyncEnvironment(process.env);
  ensure(seeds.length === 9, "Expected exactly nine canonical identities.");
  const password = process.env.DEMO_ACCOUNT_PASSWORD;
  for (const [key, value] of Object.entries(process.env)) {
    if (
      key !== "DEMO_ACCOUNT_PASSWORD" &&
      key !== "AUTH_SEED_PASSWORD" &&
      /SECRET|PASSWORD|TOKEN|DATABASE_URL|API_KEY/.test(key)
    )
      ensure(
        value !== password,
        "Public demo password must not equal private configuration.",
      );
  }
  db = postgres(process.env.DATABASE_URL, {
    max: 1,
    onnotice: () => undefined,
  });
  stage = "database snapshot";
  const snapshot = async () => {
    const data = {};
    for (const table of [
      "auth_users",
      "people",
      "application_accounts",
      "portal_memberships",
      "membership_roles",
      "roles",
      "permissions",
      "role_permissions",
      "auth_accounts",
    ])
      data[table] = await db.unsafe(
        `SELECT * FROM ${table} ORDER BY ${table === "application_accounts" ? "auth_user_id" : "id"}`,
      );
    return data;
  };
  const before = await snapshot();
  stage = "canonical allowlist";
  const links =
    await db`SELECT u.id, u.email, u.name, app.person_id FROM auth_users u JOIN application_accounts app ON app.auth_user_id=u.id`;
  const allowlisted = new Set(
    links
      .filter((r) =>
        seeds.some(
          (s) =>
            s.personId === r.person_id &&
            s.email === r.email &&
            s.name === r.name,
        ),
      )
      .map((r) => r.id),
  );
  ensure(allowlisted.size === 9, "Canonical identity mapping is inconsistent.");
  for (const row of before.auth_accounts.filter(
    (r) => r.provider_id === "credential" && !allowlisted.has(r.user_id),
  ))
    ensure(
      !(await verifyPassword({ hash: row.password, password })),
      "A non-demo account already shares this credential; no synchronization performed.",
    );
  const run = () => {
    const result = spawnSync(
      process.execPath,
      ["--env-file=.env", "scripts/auth/sync-demo.mjs"],
      { encoding: "utf8" },
    );
    ensure(
      result.status === 0,
      "Sanctioned sync failed; sensitive details suppressed.",
    );
    return JSON.parse(result.stdout.trim());
  };
  stage = "sanctioned sync";
  const first = run(),
    after = await snapshot(),
    second = run(),
    afterSecond = await snapshot();
  stage = "database invariants";
  ensure(
    first.checked === 9 &&
      second.checked === 9 &&
      second.updated === 0 &&
      second.identitiesUpdated === 0,
    "Sync is not allowlisted and idempotent.",
  );
  const unaffectedTables = Object.keys(before).filter(
    (k) => k !== "auth_accounts",
  );
  ensure(
    unaffectedTables.every((k) => digest(before[k]) === digest(after[k])),
    "Identity, domain or access data changed during credential sync.",
  );
  const unrelated = (data) =>
    data.auth_accounts.filter((r) => !allowlisted.has(r.user_id));
  ensure(
    digest(unrelated(before)) === digest(unrelated(after)),
    "Non-demo credential records changed.",
  );
  ensure(
    digest(after) === digest(afterSecond),
    "Second sync changed database records.",
  );
  const matching = [];
  for (const row of after.auth_accounts.filter(
    (r) => r.provider_id === "credential",
  )) {
    if (await verifyPassword({ hash: row.password, password }))
      matching.push(row.user_id);
  }
  ensure(
    matching.length === 9 && matching.every((id) => allowlisted.has(id)),
    "Expected exactly nine allowlisted credential matches.",
  );
  const accounts = [];
  stage = "membership verification";
  for (const seed of seeds) {
    const memberships =
      await db`SELECT m.portal, array_agg(r.code ORDER BY r.code) AS "roleCodes", array_agg(r.label ORDER BY r.code) AS "roleLabels" FROM application_accounts app JOIN portal_memberships m ON m.application_account_id=app.auth_user_id AND m.is_active JOIN membership_roles mr ON mr.portal_membership_id=m.id JOIN roles r ON r.id=mr.role_id WHERE app.person_id=${seed.personId} GROUP BY m.portal ORDER BY m.portal`;
    ensure(memberships.length > 0, "Missing canonical portal memberships.");
    accounts.push({ email: seed.email, name: seed.name, memberships });
  }
  const missingEnv = { ...process.env };
  delete missingEnv.DEMO_ACCOUNT_PASSWORD;
  const missing = spawnSync(process.execPath, ["scripts/auth/sync-demo.mjs"], {
    env: missingEnv,
    encoding: "utf8",
  });
  ensure(
    missing.status !== 0 && missing.stderr.includes("DEMO_ACCOUNT_PASSWORD"),
    "Missing variable was not rejected clearly.",
  );
  const result = {
    checkedAt: new Date().toISOString(),
    mechanism: "pnpm auth:sync-demo / scripts/auth/sync-demo.mjs",
    first,
    second,
    accounts,
    exactlyNinePublicCredentialMatches: true,
    unrelatedCredentialRecords: unrelated(before).length,
    nonDemoRecordsUnchanged: true,
    identityAndAccessTablesUnchanged: true,
    secondRunAllRecordsUnchanged: true,
    missingVariableRejected: true,
    credentialSyncCompleted: true,
    passwordRecorded: false,
  };
  fs.writeFileSync(
    new URL("./sync-verification.json", import.meta.url),
    JSON.stringify(result, null, 2),
  );
  console.log(
    JSON.stringify({
      pass: true,
      first,
      second,
      accounts: accounts.length,
      nonDemoRecordsUnchanged: true,
      rolesPermissionsUnchanged: true,
    }),
  );
} catch (error) {
  const code =
    typeof error?.code === "string" && /^[A-Z0-9_]+$/.test(error.code)
      ? error.code
      : "unspecified";
  console.error(
    error instanceof CredentialVerificationError
      ? error.message
      : `Credential verification failed at ${stage} (${code}); sensitive details suppressed.`,
  );
  process.exitCode = 1;
} finally {
  if (db) await db.end();
}
