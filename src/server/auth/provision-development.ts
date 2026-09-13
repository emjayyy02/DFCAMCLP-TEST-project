import { eq } from "drizzle-orm";
import type { Database } from "../db/connection";
import { applicationAccounts, authUsers } from "../db/schema/authentication";
import { developmentAuthAccountSeed } from "../db/seed/data";
import { createPortalAuth } from "./factory";

type ProvisioningConfiguration = {
  appEnvironment: "development" | "test";
  baseURL: string;
  secret: string;
  password: string;
};

export async function provisionDevelopmentAuthUsers(
  database: Database,
  configuration: ProvisioningConfiguration,
) {
  if (
    !(["development", "test"] as string[]).includes(
      configuration.appEnvironment,
    )
  ) {
    throw new Error(
      "Development auth provisioning is disabled in this environment.",
    );
  }

  if (!configuration.password || configuration.password.length < 12) {
    throw new Error("AUTH_SEED_PASSWORD must contain at least 12 characters.");
  }

  const provisioningAuth = createPortalAuth(database, {
    baseURL: configuration.baseURL,
    secret: configuration.secret,
    allowSignUp: true,
  });

  for (const seed of developmentAuthAccountSeed) {
    let [authUser] = await database
      .select({ id: authUsers.id })
      .from(authUsers)
      .where(eq(authUsers.email, seed.email))
      .limit(1);

    if (!authUser) {
      await provisioningAuth.api.signUpEmail({
        body: {
          email: seed.email,
          name: seed.name,
          password: configuration.password,
        },
      });

      [authUser] = await database
        .select({ id: authUsers.id })
        .from(authUsers)
        .where(eq(authUsers.email, seed.email))
        .limit(1);
    }

    if (!authUser) {
      throw new Error(`Fake auth account was not provisioned: ${seed.email}`);
    }

    await database
      .insert(applicationAccounts)
      .values({
        authUserId: authUser.id,
        personId: seed.personId,
        status: "ACTIVE",
      })
      .onConflictDoUpdate({
        target: applicationAccounts.authUserId,
        set: {
          personId: seed.personId,
          status: "ACTIVE",
          updatedAt: new Date(),
        },
      });
  }

  return developmentAuthAccountSeed.length;
}
