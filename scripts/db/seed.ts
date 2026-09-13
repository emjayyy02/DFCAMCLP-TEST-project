import { createDatabaseClient } from "../../src/server/db/connection";
import { seedDatabase } from "../../src/server/db/seed";
import { loadDatabaseEnvironment } from "./environment";

async function main() {
  const env = loadDatabaseEnvironment();
  const { client, database } = createDatabaseClient(env.DATABASE_URL, {
    max: 1,
  });

  try {
    await seedDatabase(database);
    console.info("Deterministic development seed applied successfully.");
  } finally {
    await client.end();
  }
}

void main();
