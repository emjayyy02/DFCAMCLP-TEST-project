import { loadEnvConfig } from "@next/env";
import { eq } from "drizzle-orm";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { parseServerEnv } from "../lib/env-schema";
import { disableAccount } from "../server/auth/account-service";
import { createPortalAuth } from "../server/auth/factory";
import { provisionDevelopmentAuthUsers } from "../server/auth/provision-development";
import { getApplicationSession } from "../server/auth/session-core";
import { createDatabaseClient } from "../server/db/connection";
import {
  applicationAccounts,
  authSessions,
  authUsers,
} from "../server/db/schema";
import { developmentAuthAccountSeed, seedIds } from "../server/db/seed/data";
import { seedDatabase } from "../server/db/seed";

loadEnvConfig(process.cwd());
const env = parseServerEnv(process.env);
const configuredPassword = env.DEMO_ACCOUNT_PASSWORD ?? env.AUTH_SEED_PASSWORD;
if (!configuredPassword) {
  throw new Error(
    "DEMO_ACCOUNT_PASSWORD or AUTH_SEED_PASSWORD is required for authentication tests.",
  );
}
const seedPassword: string = configuredPassword;

const { client, database } = createDatabaseClient(env.DATABASE_URL, { max: 1 });
const auth = createPortalAuth(database, {
  baseURL: env.BETTER_AUTH_URL,
  secret: env.BETTER_AUTH_SECRET,
});
const activeEmail = "johnpaul.reyes@example.invalid";

function requestHeaders(cookie?: string) {
  return new Headers({
    ...(cookie ? { cookie } : {}),
    origin: env.BETTER_AUTH_URL,
    "user-agent": "DFCAMCLP authentication integration test",
  });
}

async function signIn(email = activeEmail, password = seedPassword) {
  return auth.api.signInEmail({
    body: { email, password },
    headers: requestHeaders(),
    asResponse: true,
  });
}

function sessionCookie(response: Response) {
  const setCookie = response.headers.get("set-cookie");
  if (!setCookie) throw new Error("Successful sign-in did not set a cookie.");
  return setCookie.split(";", 1)[0];
}

describe("P2-M3 authentication", () => {
  beforeAll(async () => {
    await seedDatabase(database);
    await provisionDevelopmentAuthUsers(database, {
      appEnvironment: "test",
      baseURL: env.BETTER_AUTH_URL,
      secret: env.BETTER_AUTH_SECRET,
      password: seedPassword,
    });
  });

  afterAll(async () => {
    await provisionDevelopmentAuthUsers(database, {
      appEnvironment: "test",
      baseURL: env.BETTER_AUTH_URL,
      secret: env.BETTER_AUTH_SECRET,
      password: seedPassword,
    });
    await client.end();
  });

  it("provisions every fake development account through Better Auth", async () => {
    const provisioned = await database
      .select({ email: authUsers.email })
      .from(authUsers);

    expect(
      await provisionDevelopmentAuthUsers(database, {
        appEnvironment: "test",
        baseURL: env.BETTER_AUTH_URL,
        secret: env.BETTER_AUTH_SECRET,
        password: seedPassword,
      }),
    ).toBe(developmentAuthAccountSeed.length);
    expect(provisioned.map((row) => row.email)).toEqual(
      expect.arrayContaining(
        developmentAuthAccountSeed.map((account) => account.email),
      ),
    );
  });

  it("authenticates valid credentials and creates a cookie session", async () => {
    const response = await signIn();

    expect(response.status).toBe(200);
    const cookie = sessionCookie(response);
    const session = await auth.api.getSession({
      headers: requestHeaders(cookie),
    });
    expect(session?.user.email).toBe(activeEmail);
    expect(session?.session).toBeTruthy();
  });

  it("fails invalid and unknown credentials without revealing account state", async () => {
    const invalid = await signIn(activeEmail, "incorrect-fake-password");
    const unknown = await signIn("unknown@example.invalid");
    const invalidBody = await invalid.json();
    const unknownBody = await unknown.json();

    expect(invalid.status).toBe(401);
    expect(unknown.status).toBe(401);
    expect(invalidBody.message).toBe("Invalid email or password");
    expect(unknownBody.message).toBe("Invalid email or password");
  });

  it("retrieves an active authenticated session at the server boundary", async () => {
    const cookie = sessionCookie(await signIn());
    const current = await getApplicationSession(
      auth,
      database,
      requestHeaders(cookie),
    );

    expect(current).toMatchObject({
      user: { email: activeEmail },
      identity: {
        personId: seedIds.people.student,
        status: "ACTIVE",
      },
    });
  });

  it("denies anonymous protected access and allows an active session", async () => {
    const anonymous = await getApplicationSession(
      auth,
      database,
      requestHeaders(),
    );
    const cookie = sessionCookie(await signIn());
    const authenticated = await getApplicationSession(
      auth,
      database,
      requestHeaders(cookie),
    );

    expect(anonymous).toBeNull();
    expect(authenticated?.user.email).toBe(activeEmail);
  });

  it("ends the database session on logout", async () => {
    const cookie = sessionCookie(await signIn());
    const before = await auth.api.getSession({
      headers: requestHeaders(cookie),
    });
    expect(before).not.toBeNull();

    const response = await auth.api.signOut({
      headers: requestHeaders(cookie),
      asResponse: true,
    });
    const after = await auth.api.getSession({
      headers: requestHeaders(cookie),
    });

    expect(response.status).toBe(200);
    expect(after).toBeNull();
  });

  it.each(developmentAuthAccountSeed)(
    "protects shared identity and concurrent sessions for $name",
    async (account) => {
      const firstCookie = sessionCookie(await signIn(account.email));
      const secondCookie = sessionCookie(await signIn(account.email));
      const first = await auth.api.getSession({
        headers: requestHeaders(firstCookie),
      });
      const second = await auth.api.getSession({
        headers: requestHeaders(secondCookie),
      });
      expect(first?.session.id).not.toBe(second?.session.id);

      const requests = [
        {
          path: "/update-user",
          body: {
            name: "Fictional Release Probe",
            image: "https://example.invalid/photo.png",
          },
        },
        { path: "/change-email", body: { newEmail: "probe@example.invalid" } },
        {
          path: "/change-password",
          body: {
            currentPassword: seedPassword,
            newPassword: "Unused-fictional-probe-password",
          },
        },
        { path: "/delete-user", body: { password: seedPassword } },
        { path: "/list-sessions", method: "GET" },
        { path: "/revoke-session", body: { token: second!.session.token } },
        { path: "/revoke-sessions", body: {} },
        { path: "/revoke-other-sessions", body: {} },
      ];
      for (const request of requests) {
        const response = await auth.handler(
          new Request(`${env.BETTER_AUTH_URL}/api/auth${request.path}`, {
            method: request.method ?? "POST",
            headers: new Headers({
              ...Object.fromEntries(requestHeaders(firstCookie)),
              "content-type": "application/json",
            }),
            ...(request.body ? { body: JSON.stringify(request.body) } : {}),
          }),
        );
        expect(response.status, request.path).toBe(403);
      }

      const [unchanged] = await database
        .select({ name: authUsers.name, email: authUsers.email })
        .from(authUsers)
        .where(eq(authUsers.id, first!.user.id));
      expect(unchanged).toEqual({ name: account.name, email: account.email });
      await auth.api.signOut({ headers: requestHeaders(firstCookie) });
      expect(
        await auth.api.getSession({ headers: requestHeaders(firstCookie) }),
      ).toBeNull();
      expect(
        (await auth.api.getSession({ headers: requestHeaders(secondCookie) }))
          ?.user.name,
      ).toBe(account.name);
      await auth.api.signOut({ headers: requestHeaders(secondCookie) });
    },
  );

  it("leaves non-demo identity updates governed by Better Auth", async () => {
    const email = `${crypto.randomUUID()}@example.invalid`;
    const provisioningAuth = createPortalAuth(database, {
      baseURL: env.BETTER_AUTH_URL,
      secret: env.BETTER_AUTH_SECRET,
      allowSignUp: true,
    });
    await provisioningAuth.api.signUpEmail({
      body: {
        email,
        name: "Fictional Integration Person",
        password: seedPassword,
      },
    });
    try {
      const cookie = sessionCookie(await signIn(email));
      const response = await auth.api.updateUser({
        headers: requestHeaders(cookie),
        body: { name: "Fictional Updated Person" },
        asResponse: true,
      });
      expect(response.status).toBe(200);
      expect(
        (await auth.api.getSession({ headers: requestHeaders(cookie) }))?.user
          .name,
      ).toBe("Fictional Updated Person");
    } finally {
      await database.delete(authUsers).where(eq(authUsers.email, email));
    }
  });

  it("links one Better Auth user explicitly to one Person", async () => {
    const [link] = await database
      .select({
        email: authUsers.email,
        personId: applicationAccounts.personId,
      })
      .from(authUsers)
      .innerJoin(
        applicationAccounts,
        eq(applicationAccounts.authUserId, authUsers.id),
      )
      .where(eq(authUsers.email, activeEmail));

    expect(link).toEqual({
      email: activeEmail,
      personId: seedIds.people.student,
    });
  });

  it("rejects a second auth-user link to the same Person", async () => {
    const syntheticUserId = crypto.randomUUID();
    await database.insert(authUsers).values({
      id: syntheticUserId,
      name: "Synthetic Duplicate Link",
      email: `${syntheticUserId}@example.invalid`,
    });

    try {
      await expect(
        database.insert(applicationAccounts).values({
          authUserId: syntheticUserId,
          personId: seedIds.people.student,
        }),
      ).rejects.toMatchObject({ cause: { code: "23505" } });
    } finally {
      await database.delete(authUsers).where(eq(authUsers.id, syntheticUserId));
    }
  });

  it("disables access, revokes existing sessions, and blocks new login", async () => {
    const cookie = sessionCookie(await signIn());
    const session = await auth.api.getSession({
      headers: requestHeaders(cookie),
    });
    expect(session).not.toBeNull();

    await disableAccount(database, session!.user.id);

    const protectedResult = await getApplicationSession(
      auth,
      database,
      requestHeaders(cookie),
    );
    const remainingSessions = await database
      .select({ id: authSessions.id })
      .from(authSessions)
      .where(eq(authSessions.userId, session!.user.id));
    expect(protectedResult).toBeNull();
    expect(remainingSessions).toHaveLength(0);
    await expect(signIn()).rejects.toThrow("Invalid email or password.");
  });
});
