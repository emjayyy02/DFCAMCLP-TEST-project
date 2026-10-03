import { createDatabaseClient } from "../../src/server/db/connection";
import { seedDatabase } from "../../src/server/db/seed";
import { loadDatabaseEnvironment } from "./environment";
import { provisionDevelopmentAuthUsers } from "../../src/server/auth/provision-development";
import { seedAccessControl } from "../../src/server/db/seed/access-control";

async function main() {
  const env = loadDatabaseEnvironment();
  const { client, database } = createDatabaseClient(env.DATABASE_URL, {
    max: 1,
  });

  try {
    await seedDatabase(database);
    if (env.APP_ENV === "development" || env.APP_ENV === "test") {
      const password = env.DEMO_ACCOUNT_PASSWORD ?? env.AUTH_SEED_PASSWORD;
      if (!password) {
        throw new Error(
          "DEMO_ACCOUNT_PASSWORD or AUTH_SEED_PASSWORD is required for local auth seeding.",
        );
      }
      await provisionDevelopmentAuthUsers(database, {
        appEnvironment: env.APP_ENV,
        baseURL: env.BETTER_AUTH_URL,
        secret: env.BETTER_AUTH_SECRET,
        password,
      });
      await seedAccessControl(database);
    }
    console.info(
      "Deterministic development domain, authentication, and access-control seed applied successfully.",
    );
  } finally {
    await client.end();
  }
}

void main();
