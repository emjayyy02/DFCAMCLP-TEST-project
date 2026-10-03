import { readFileSync } from "node:fs";
import { parseEnv } from "node:util";
import postgres from "postgres";
import { describe, expect, it } from "vitest";
import { bootstrapDemo } from "../../scripts/prod/bootstrap";
import { developmentAuthAccountSeed } from "../server/db/seed/data";
import { parseServerEnv } from "../lib/env-schema";

const password = "synthetic-bootstrap-test-password";
// Never load production configuration in integration tests.
const env = parseServerEnv(parseEnv(readFileSync(".env", "utf8")));
const url = new URL(env.DATABASE_URL);
if (
  !["development", "test"].includes(env.APP_ENV) ||
  !["localhost", "127.0.0.1", "[::1]"].includes(url.hostname) ||
  !/_(dev|test)$/.test(url.pathname)
)
  throw new Error("Bootstrap tests require local development/test DB.");

describe("production bootstrap transaction on isolated fresh schema", () => {
  it("migrates fresh schema, verifies 9/9 and 10/10, synchronizes once, preserves unrelated users, and rolls back conflicts", async () => {
    const client = postgres(env.DATABASE_URL, {
      max: 1,
      onnotice: () => undefined,
    });
    try {
      await client.begin(async (sql) => {
        const schema = `bootstrap_test_${crypto.randomUUID().replaceAll("-", "")}`;
        await sql`CREATE SCHEMA ${sql(schema)}`;
        await sql`SET LOCAL search_path TO ${sql(schema)}`;
        const journal = JSON.parse(
          readFileSync("drizzle/meta/_journal.json", "utf8"),
        ) as { entries: { tag: string }[] };
        for (const entry of journal.entries) {
          const source = readFileSync(
            `drizzle/${entry.tag}.sql`,
            "utf8",
          ).replaceAll('"public".', `"${schema}".`);
          for (const statement of source.split("--> statement-breakpoint"))
            await sql.unsafe(statement);
        }
        await sql`INSERT INTO auth_users (id, name, email) VALUES ('unrelated', 'Unrelated user', 'unrelated@example.invalid')`;
        const first = await bootstrapDemo(sql, password);
        expect(first).toMatchObject({
          accounts: 9,
          links: 9,
          credentials: 9,
          memberships: 10,
          roles: "verified",
          permissions: "verified",
          michaelCastro: ["ACADEMIC", "TECHNOLOGY"],
        });
        expect(first.materialChanges).toBeGreaterThan(0);
        const snapshot = async () => {
          const result = [];
          for (const table of [
            "campuses",
            "programs",
            "program_majors",
            "people",
            "student_profiles",
            "applicant_profiles",
            "employee_profiles",
            "auth_users",
            "auth_accounts",
            "application_accounts",
            "roles",
            "permissions",
            "role_permissions",
            "portal_memberships",
            "membership_roles",
          ]) {
            result.push(
              await sql`SELECT to_jsonb(t) AS row FROM ${sql(table)} t ORDER BY to_jsonb(t)::text`,
            );
          }
          return JSON.stringify(result);
        };
        const before = await snapshot();
        expect((await bootstrapDemo(sql, password)).materialChanges).toBe(0);
        expect((await snapshot()) === before).toBe(true);
        expect(
          (await bootstrapDemo(sql, password + "-changed")).credentialsUpdated,
        ).toBe(9);
        expect(
          (await bootstrapDemo(sql, password + "-changed")).materialChanges,
        ).toBe(0);
        const [unrelated] =
          await sql`SELECT * FROM auth_users WHERE id = 'unrelated'`;
        expect(unrelated.name).toBe("Unrelated user");
        const [michael] =
          await sql`SELECT id FROM auth_users WHERE email = ${developmentAuthAccountSeed[8].email}`;
        const portals =
          await sql`SELECT portal FROM portal_memberships WHERE application_account_id = ${michael.id} ORDER BY portal::text`;
        expect(portals.map((row) => row.portal)).toEqual([
          "ACADEMIC",
          "TECHNOLOGY",
        ]);
        await expect(
          sql.savepoint(async (nested) => {
            const personId = crypto.randomUUID();
            await nested`INSERT INTO people (id, first_name, last_name) VALUES (${personId}, 'Unrelated', 'Person')`;
            await nested`UPDATE application_accounts SET person_id = ${personId} WHERE auth_user_id = ${michael.id}`;
            await bootstrapDemo(nested, password);
          }),
        ).rejects.toThrow("conflicts");
        await expect(
          sql.savepoint(async (nested) => {
            const permissionId = crypto.randomUUID();
            const [role] =
              await nested`SELECT id FROM roles WHERE code = 'FACULTY'`;
            await nested`INSERT INTO permissions (id, code, label, portal) VALUES (${permissionId}, 'unexpected.permission', 'Unexpected', 'ACADEMIC')`;
            await nested`INSERT INTO role_permissions (role_id, permission_id, portal) VALUES (${role.id}, ${permissionId}, 'ACADEMIC')`;
            await bootstrapDemo(nested, password);
          }),
        ).rejects.toThrow("conflicts");
        await sql`UPDATE auth_users SET name = 'Conflicting identity' WHERE id = ${michael.id}`;
        const conflicting = await snapshot();
        await expect(
          sql.savepoint((nested) => bootstrapDemo(nested, password)),
        ).rejects.toThrow("conflicts");
        expect((await snapshot()) === conflicting).toBe(true);
        // Roll back the entire disposable schema without drop/reset/truncate.
        throw new Error("ROLLBACK_TEST_SCHEMA");
      });
    } catch (error) {
      if (!(error instanceof Error) || error.message !== "ROLLBACK_TEST_SCHEMA")
        throw error;
    } finally {
      await client.end();
    }
  }, 120_000);
});
