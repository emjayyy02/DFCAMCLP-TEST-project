import { migrate } from "drizzle-orm/postgres-js/migrator";
import { createDatabaseClient } from "../../src/server/db/connection";
import { seedDatabase } from "../../src/server/db/seed";
import { loadSafeDevelopmentResetEnvironment } from "./environment";
import { provisionDevelopmentAuthUsers } from "../../src/server/auth/provision-development";

async function main() {
  const env = loadSafeDevelopmentResetEnvironment();
  const { client, database } = createDatabaseClient(env.DATABASE_URL, {
    max: 1,
  });

  try {
    console.info(`Resetting local development database ${env.databaseName}.`);
    await client.begin(async (transaction) => {
      await transaction.unsafe("drop schema if exists drizzle cascade");
      await transaction.unsafe("drop schema if exists public cascade");
      await transaction.unsafe("create schema public");
    });
    await migrate(database, { migrationsFolder: "drizzle" });
    await seedDatabase(database);
    if (!env.AUTH_SEED_PASSWORD) {
      throw new Error("AUTH_SEED_PASSWORD is required for local auth seeding.");
    }
    await provisionDevelopmentAuthUsers(database, {
      appEnvironment: "development",
      baseURL: env.BETTER_AUTH_URL,
      secret: env.BETTER_AUTH_SECRET,
      password: env.AUTH_SEED_PASSWORD,
    });
    console.info(
      "Development database reset, migrated, and seeded successfully.",
    );
  } finally {
    await client.end();
  }
}

void main();
