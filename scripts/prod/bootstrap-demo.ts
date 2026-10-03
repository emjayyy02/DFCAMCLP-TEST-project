import { readFileSync } from "node:fs";
import { parseEnv } from "node:util";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import { createDatabaseClient } from "../../src/server/db/connection";
import { assertProductionEnvironment } from "./guards";
import { bootstrapDemo } from "./bootstrap";

async function main() {
  // No shell overrides or fallback to development env files.
  const env = assertProductionEnvironment(
    parseEnv(readFileSync(".env.production.local", "utf8")),
    process.argv.slice(2),
  );
  const { client, database } = createDatabaseClient(env.DATABASE_URL, {
    max: 1,
  });
  try {
    const journal = JSON.parse(
      readFileSync("drizzle/meta/_journal.json", "utf8"),
    ) as { entries: { tag: string }[] };
    for (const entry of journal.entries) {
      const source = readFileSync(`drizzle/${entry.tag}.sql`, "utf8");
      if (/\b(DROP|TRUNCATE|DELETE\s+FROM)\b/i.test(source))
        throw new Error("Destructive migration refused.");
    }
    await migrate(database, { migrationsFolder: "drizzle" });
    console.info("Current Drizzle migrations applied.");
    console.info(
      JSON.stringify(
        await client.begin((sql) =>
          bootstrapDemo(sql, env.DEMO_ACCOUNT_PASSWORD),
        ),
      ),
    );
  } finally {
    await client.end();
  }
}
main().catch(() => {
  // Library errors may expose SQL parameters; output only a fixed safe message.
  console.error(
    "Production demo bootstrap failed. Check required configuration or canonical state. Seed transaction changes are rolled back; completed migrations remain applied.",
  );
  process.exitCode = 1;
});
