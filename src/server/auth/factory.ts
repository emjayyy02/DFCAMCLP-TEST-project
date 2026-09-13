import { drizzleAdapter } from "@better-auth/drizzle-adapter";
import { betterAuth } from "better-auth";
import { APIError, createAuthMiddleware } from "better-auth/api";
import { eq } from "drizzle-orm";
import type { Database } from "../db/connection";
import { applicationAccounts, authUsers, betterAuthSchema } from "../db/schema";

type AuthConfiguration = {
  baseURL: string;
  secret: string;
  allowSignUp?: boolean;
  trustedOrigins?: string[];
};

export function createPortalAuth(
  database: Database,
  {
    baseURL,
    secret,
    allowSignUp = false,
    trustedOrigins = [baseURL],
  }: AuthConfiguration,
) {
  return betterAuth({
    appName: "DFCAMCLP Portal",
    baseURL,
    secret,
    database: drizzleAdapter(database, {
      provider: "pg",
      schema: betterAuthSchema,
    }),
    trustedOrigins,
    emailAndPassword: {
      enabled: true,
      disableSignUp: !allowSignUp,
      autoSignIn: false,
      minPasswordLength: 12,
      maxPasswordLength: 128,
    },
    session: {
      expiresIn: 60 * 60 * 24 * 7,
      updateAge: 60 * 60 * 24,
      cookieCache: { enabled: false },
    },
    hooks: {
      before: createAuthMiddleware(async (context) => {
        if (context.path !== "/sign-in/email") return;

        const email =
          typeof context.body?.email === "string"
            ? context.body.email.trim().toLowerCase()
            : null;
        if (!email) return;

        const [account] = await database
          .select({ status: applicationAccounts.status })
          .from(authUsers)
          .innerJoin(
            applicationAccounts,
            eq(applicationAccounts.authUserId, authUsers.id),
          )
          .where(eq(authUsers.email, email))
          .limit(1);

        if (account?.status === "DISABLED") {
          throw new APIError("UNAUTHORIZED", {
            message: "Invalid email or password.",
          });
        }
      }),
    },
  });
}

export type PortalAuth = ReturnType<typeof createPortalAuth>;
