import { drizzleAdapter } from "@better-auth/drizzle-adapter";
import { betterAuth } from "better-auth";
import {
  APIError,
  createAuthMiddleware,
  getSessionFromCtx,
} from "better-auth/api";
import { eq } from "drizzle-orm";
import type { Database } from "../db/connection";
import { applicationAccounts, authUsers, betterAuthSchema } from "../db/schema";
import { developmentAuthAccountSeed } from "../db/seed/data";

// Shared reviewers may end their own session, but cannot change the seeded
// identity/credentials or discover and revoke another reviewer's sessions.
const sharedDemoRestrictedEndpoints = new Set([
  "/update-user",
  "/change-email",
  "/change-password",
  "/set-password",
  "/delete-user",
  "/delete-user/callback",
  "/list-sessions",
  "/revoke-session",
  "/revoke-sessions",
  "/revoke-other-sessions",
]);
const sharedDemoPersonIds = new Set<string>(
  developmentAuthAccountSeed.map((account) => account.personId),
);

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
        if (sharedDemoRestrictedEndpoints.has(context.path)) {
          const session = await getSessionFromCtx(context, {
            disableCookieCache: true,
            disableRefresh: true,
          });
          if (session) {
            const [account] = await database
              .select({ personId: applicationAccounts.personId })
              .from(applicationAccounts)
              .where(eq(applicationAccounts.authUserId, session.user.id))
              .limit(1);
            if (account && sharedDemoPersonIds.has(account.personId)) {
              throw new APIError("FORBIDDEN", {
                message:
                  "Shared demo accounts cannot be changed or manage other sessions.",
              });
            }
          }
          return;
        }
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
