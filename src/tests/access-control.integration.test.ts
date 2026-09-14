import { loadEnvConfig } from "@next/env";
import { and, eq, inArray } from "drizzle-orm";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { parseServerEnv } from "../lib/env-schema";
import type { PortalCode } from "../lib/portals";
import { disableAccount } from "../server/auth/account-service";
import { createPortalAuth } from "../server/auth/factory";
import { provisionDevelopmentAuthUsers } from "../server/auth/provision-development";
import {
  canAccessPortalPath,
  canEnterPortal,
  getAccessContext,
  hasPermission,
} from "../server/access-control/service";
import {
  membershipSeed,
  permissionSeed,
  rolePermissionSeed,
  roleSeed,
} from "../server/access-control/seed-data";
import { signInToPortal } from "../server/access-control/portal-login";
import { createDatabaseClient } from "../server/db/connection";
import { seedDatabase } from "../server/db/seed";
import { seedAccessControl } from "../server/db/seed/access-control";
import {
  applicationAccounts,
  authSessions,
  authUsers,
  membershipRoles,
  permissions,
  portalMemberships,
  rolePermissions,
  roles,
} from "../server/db/schema";

loadEnvConfig(process.cwd());
const env = parseServerEnv(process.env);
if (!env.AUTH_SEED_PASSWORD) {
  throw new Error("AUTH_SEED_PASSWORD is required for access-control tests.");
}

const { client, database } = createDatabaseClient(env.DATABASE_URL, { max: 1 });
const auth = createPortalAuth(database, {
  baseURL: env.BETTER_AUTH_URL,
  secret: env.BETTER_AUTH_SECRET,
});
const password = env.AUTH_SEED_PASSWORD;

function requestHeaders(cookie?: string) {
  return new Headers({
    ...(cookie ? { cookie } : {}),
    origin: env.BETTER_AUTH_URL,
    "user-agent": "DFCAMCLP access-control integration test",
  });
}

async function cookieFor(email: string) {
  const response = await auth.api.signInEmail({
    body: { email, password },
    headers: requestHeaders(),
    asResponse: true,
  });
  const setCookie = response.headers.get("set-cookie");
  if (!setCookie) throw new Error(`Sign-in did not set a cookie for ${email}.`);
  return setCookie.split(";", 1)[0];
}

async function contextFor(email: string) {
  const context = await getAccessContext(
    auth,
    database,
    requestHeaders(await cookieFor(email)),
  );
  if (!context) throw new Error(`Access context was not created for ${email}.`);
  return context;
}

async function authUserId(email: string) {
  const [user] = await database
    .select({ id: authUsers.id })
    .from(authUsers)
    .where(eq(authUsers.email, email));
  if (!user) throw new Error(`Missing fake user: ${email}`);
  return user.id;
}

describe("P2-M4 access control", () => {
  beforeAll(async () => {
    await seedDatabase(database);
    await provisionDevelopmentAuthUsers(database, {
      appEnvironment: "test",
      baseURL: env.BETTER_AUTH_URL,
      secret: env.BETTER_AUTH_SECRET,
      password,
    });
    await seedAccessControl(database);
  });

  afterAll(async () => {
    await database
      .update(applicationAccounts)
      .set({ status: "ACTIVE", updatedAt: new Date() });
    await seedAccessControl(database);
    await client.end();
  });

  it("seeds memberships, roles, permissions, and mappings idempotently", async () => {
    await seedAccessControl(database);
    await seedAccessControl(database);

    const seededRoles = await database
      .select({ code: roles.code })
      .from(roles)
      .where(
        inArray(
          roles.code,
          roleSeed.map((item) => item.code),
        ),
      );
    const seededPermissions = await database
      .select({ code: permissions.code })
      .from(permissions)
      .where(
        inArray(
          permissions.code,
          permissionSeed.map((item) => item.code),
        ),
      );
    const storedMemberships = await database
      .select({ id: portalMemberships.id })
      .from(portalMemberships);
    const storedRolePermissions = await database
      .select({ id: rolePermissions.id })
      .from(rolePermissions);
    const storedMembershipRoles = await database
      .select({ id: membershipRoles.id })
      .from(membershipRoles);

    expect(seededRoles).toHaveLength(roleSeed.length);
    expect(seededPermissions).toHaveLength(permissionSeed.length);
    expect(storedMemberships).toHaveLength(membershipSeed.length);
    expect(storedRolePermissions).toHaveLength(
      Object.values(rolePermissionSeed).flat().length,
    );
    expect(storedMembershipRoles).toHaveLength(membershipSeed.length);
  });

  it("assigns the Student account only to the Student portal", async () => {
    const context = await contextFor("student.test@example.invalid");
    expect(context.memberships.map((item) => item.portal)).toEqual(["STUDENT"]);
  });

  it("allows Student access to /student", async () => {
    const context = await contextFor("student.test@example.invalid");
    expect(canEnterPortal(context, "STUDENT")).toBe(true);
    expect(canAccessPortalPath(context, "STUDENT", "/student")).toBe(true);
  });

  it("denies Student access to /technology", async () => {
    const context = await contextFor("student.test@example.invalid");
    expect(canEnterPortal(context, "TECHNOLOGY")).toBe(false);
    expect(canAccessPortalPath(context, "TECHNOLOGY", "/technology")).toBe(
      false,
    );
  });

  it("allows Technology access to /technology", async () => {
    expect(
      canEnterPortal(
        await contextFor("technology.test@example.invalid"),
        "TECHNOLOGY",
      ),
    ).toBe(true);
  });

  it("denies Technology access to /student", async () => {
    expect(
      canEnterPortal(
        await contextFor("technology.test@example.invalid"),
        "STUDENT",
      ),
    ).toBe(false);
  });

  it("allows Faculty into Academic but denies Academic Management", async () => {
    const context = await contextFor("faculty.test@example.invalid");
    expect(canEnterPortal(context, "ACADEMIC")).toBe(true);
    expect(hasPermission(context, "ACADEMIC", "academic.management.view")).toBe(
      false,
    );
    expect(
      canAccessPortalPath(context, "ACADEMIC", "/academic/management"),
    ).toBe(false);
  });

  it("allows Program Coordinator into Academic Management", async () => {
    const context = await contextFor("coordinator.test@example.invalid");
    expect(
      canAccessPortalPath(context, "ACADEMIC", "/academic/management"),
    ).toBe(true);
  });

  it("allows Maintenance Staff into Facilities but not Employees", async () => {
    const context = await contextFor("operations.test@example.invalid");
    expect(
      canAccessPortalPath(context, "OPERATIONS", "/operations/facilities"),
    ).toBe(true);
    expect(
      canAccessPortalPath(context, "OPERATIONS", "/operations/employees"),
    ).toBe(false);
  });

  it("allows School Admin into all normal Operations sections", async () => {
    const context = await contextFor("school-admin.test@example.invalid");
    for (const path of [
      "/operations/student-services",
      "/operations/employees",
      "/operations/facilities",
      "/operations/administration",
    ]) {
      expect(canAccessPortalPath(context, "OPERATIONS", path)).toBe(true);
    }
  });

  it("allows IT Admin into normal Technology sections but not Developer", async () => {
    const context = await contextFor("technology.test@example.invalid");
    for (const path of [
      "/technology/accounts",
      "/technology/security",
      "/technology/system",
    ]) {
      expect(canAccessPortalPath(context, "TECHNOLOGY", path)).toBe(true);
    }
    expect(
      canAccessPortalPath(context, "TECHNOLOGY", "/technology/developer"),
    ).toBe(false);
  });

  it("allows the Developer role into the Developer foundation", async () => {
    const context = await contextFor("faculty-it.test@example.invalid");
    expect(
      canAccessPortalPath(context, "TECHNOLOGY", "/technology/developer"),
    ).toBe(true);
  });

  it("allows the multi-portal account into both explicit portals only", async () => {
    const context = await contextFor("faculty-it.test@example.invalid");
    expect(canEnterPortal(context, "ACADEMIC")).toBe(true);
    expect(canEnterPortal(context, "TECHNOLOGY")).toBe(true);
    for (const portal of [
      "APPLICANT",
      "STUDENT",
      "RECORDS",
      "OPERATIONS",
    ] satisfies PortalCode[]) {
      expect(canEnterPortal(context, portal)).toBe(false);
    }
  });

  it("blocks a revoked membership without disabling the account", async () => {
    const userId = await authUserId("student.test@example.invalid");
    const cookie = await cookieFor("student.test@example.invalid");
    await database
      .update(portalMemberships)
      .set({ isActive: false, updatedAt: new Date() })
      .where(
        and(
          eq(portalMemberships.applicationAccountId, userId),
          eq(portalMemberships.portal, "STUDENT"),
        ),
      );

    try {
      const context = await getAccessContext(
        auth,
        database,
        requestHeaders(cookie),
      );
      expect(context).not.toBeNull();
      expect(canEnterPortal(context!, "STUDENT")).toBe(false);
    } finally {
      await seedAccessControl(database);
    }
  });

  it("retains disabled-account behavior independently of membership state", async () => {
    const email = "applicant.test@example.invalid";
    const userId = await authUserId(email);
    const cookie = await cookieFor(email);
    await disableAccount(database, userId);

    try {
      expect(
        await getAccessContext(auth, database, requestHeaders(cookie)),
      ).toBeNull();
      await expect(cookieFor(email)).rejects.toThrow(
        "Invalid email or password.",
      );
    } finally {
      await database
        .update(applicationAccounts)
        .set({ status: "ACTIVE", updatedAt: new Date() })
        .where(eq(applicationAccounts.authUserId, userId));
    }
  });

  it("does not create an authenticated session for an unauthorized portal selection", async () => {
    const userId = await authUserId("student.test@example.invalid");
    const before = await database
      .select({ id: authSessions.id })
      .from(authSessions)
      .where(eq(authSessions.userId, userId));
    const result = await signInToPortal(
      auth,
      database,
      {
        email: "student.test@example.invalid",
        password,
        portal: "TECHNOLOGY",
      },
      requestHeaders(),
    );
    const after = await database
      .select({ id: authSessions.id })
      .from(authSessions)
      .where(eq(authSessions.userId, userId));

    expect(result).toEqual({ status: "portal-denied" });
    expect(after).toHaveLength(before.length);
  });

  it("authorizes valid portal selections and returns the portal destination", async () => {
    const student = await signInToPortal(
      auth,
      database,
      {
        email: "student.test@example.invalid",
        password,
        portal: "STUDENT",
      },
      requestHeaders(),
    );
    const technology = await signInToPortal(
      auth,
      database,
      {
        email: "technology.test@example.invalid",
        password,
        portal: "TECHNOLOGY",
      },
      requestHeaders(),
    );

    expect(student).toMatchObject({
      status: "authenticated",
      redirectTo: "/student",
    });
    expect(technology).toMatchObject({
      status: "authenticated",
      redirectTo: "/technology",
    });
  });

  it("denies anonymous access context", async () => {
    expect(await getAccessContext(auth, database, requestHeaders())).toBeNull();
  });

  it("rejects a role assignment whose role and membership portals differ", async () => {
    const studentId = await authUserId("student.test@example.invalid");
    const [membership] = await database
      .select({ id: portalMemberships.id })
      .from(portalMemberships)
      .where(
        and(
          eq(portalMemberships.applicationAccountId, studentId),
          eq(portalMemberships.portal, "STUDENT"),
        ),
      );
    const [technologyRole] = await database
      .select({ id: roles.id })
      .from(roles)
      .where(eq(roles.code, "IT_ADMIN"));

    await expect(
      database.insert(membershipRoles).values({
        portalMembershipId: membership.id,
        roleId: technologyRole.id,
        portal: "STUDENT",
      }),
    ).rejects.toMatchObject({ cause: { code: "23503" } });
  });
});
