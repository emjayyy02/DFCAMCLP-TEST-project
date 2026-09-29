import postgres from "postgres";
import { hashPassword, verifyPassword } from "better-auth/crypto";
import { developmentAuthAccountSeed } from "../../src/server/db/seed/data.ts";
import {
  assertDemoCredentialRows,
  assertDemoSyncEnvironment,
  DemoCredentialSyncError,
} from "./demo-credential-guards.mjs";

let client;
try {
  assertDemoSyncEnvironment(process.env, process.argv.slice(2));
  client = postgres(process.env.DATABASE_URL, {
    max: 1,
    onnotice: () => undefined,
  });
  const result = await client.begin(async (transaction) => {
    // Freeze mappings while validating the complete allowlist before any update.
    await transaction`SET LOCAL lock_timeout = '5s'`;
    await transaction`LOCK TABLE auth_users, application_accounts IN SHARE MODE`;
    await transaction`LOCK TABLE auth_accounts IN SHARE ROW EXCLUSIVE MODE`;
    const rows = await transaction`
      SELECT u.email, u.id AS "userId", app.person_id AS "personId",
        a.id AS "credentialId", a.account_id AS "accountId",
        a.provider_id AS "providerId", a.password
      FROM auth_users u
      LEFT JOIN application_accounts app ON app.auth_user_id = u.id
      LEFT JOIN auth_accounts a ON a.user_id = u.id AND a.provider_id = 'credential'
      WHERE u.email IN ${transaction(developmentAuthAccountSeed.map((seed) => seed.email))}
    `;
    assertDemoCredentialRows(rows);
    let updated = 0;
    for (const row of rows) {
      if (
        await verifyPassword({
          hash: row.password,
          password: process.env.AUTH_SEED_PASSWORD,
        })
      )
        continue;
      const hash = await hashPassword(process.env.AUTH_SEED_PASSWORD);
      const changed = await transaction`
        UPDATE auth_accounts SET password = ${hash}, updated_at = NOW()
        WHERE id = ${row.credentialId} AND user_id = ${row.userId} AND provider_id = 'credential'
        RETURNING id
      `;
      if (changed.length !== 1)
        throw new DemoCredentialSyncError(
          "Credential update did not affect exactly one existing record.",
        );
      updated += 1;
    }
    return { checked: rows.length, updated, unchanged: rows.length - updated };
  });
  console.info(JSON.stringify(result));
} catch (error) {
  // Database/library errors can include SQL parameters. Never print them.
  console.error(
    error instanceof DemoCredentialSyncError
      ? error.message
      : "Demo credential sync failed; any transaction changes were rolled back.",
  );
  process.exitCode = 1;
} finally {
  if (client) await client.end();
}
