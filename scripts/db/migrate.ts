import { migrate } from "drizzle-orm/postgres-js/migrator";
import { createDatabaseClient } from "../../src/server/db/connection";
import { loadDatabaseEnvironment } from "./environment";

async function main() {
  const env = loadDatabaseEnvironment();
  const { client, database } = createDatabaseClient(env.DATABASE_URL, {
    max: 1,
  });

  try {
    await migrate(database, { migrationsFolder: "drizzle" });
    console.info("Database migrations applied successfully.");
  } finally {
    await client.end();
  }
}

void main();
