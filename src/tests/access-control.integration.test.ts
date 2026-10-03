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
import { permittedNavigation } from "../server/access-control/navigation";
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
const configuredPassword = env.DEMO_ACCOUNT_PASSWORD ?? env.AUTH_SEED_PASSWORD;
if (!configuredPassword) {
  throw new Error(
    "DEMO_ACCOUNT_PASSWORD or AUTH_SEED_PASSWORD is required for access-control tests.",
  );
}
const password: string = configuredPassword;

const { client, database } = createDatabaseClient(env.DATABASE_URL, { max: 1 });
const auth = createPortalAuth(database, {
  baseURL: env.BETTER_AUTH_URL,
  secret: env.BETTER_AUTH_SECRET,
});

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
    const context = await contextFor("johnpaul.reyes@example.invalid");
    expect(context.memberships.map((item) => item.portal)).toEqual(["STUDENT"]);
  });

  it("allows the six Applicant demo pages without granting other portals", async () => {
    const context = await contextFor("juan.delacruz@example.invalid");
    expect(context.memberships.map((item) => item.portal)).toEqual([
      "APPLICANT",
    ]);
    for (const path of [
      "/applicant",
      "/applicant/application",
      "/applicant/dcat",
      "/applicant/enrollment",
      "/applicant/announcements",
      "/applicant/profile",
    ]) {
      expect(canAccessPortalPath(context, "APPLICANT", path)).toBe(true);
    }
    for (const portal of [
      "STUDENT",
      "ACADEMIC",
      "RECORDS",
      "OPERATIONS",
      "TECHNOLOGY",
    ] as const) {
      expect(canEnterPortal(context, portal)).toBe(false);
    }
    expect(
      canAccessPortalPath(context, "APPLICANT", "/applicant/unregistered"),
    ).toBe(false);
    expect(
      canAccessPortalPath(
        await contextFor("johnpaul.reyes@example.invalid"),
        "APPLICANT",
        "/applicant/application",
      ),
    ).toBe(false);
  });

  it("allows the Student experience routes without granting other portals", async () => {
    const context = await contextFor("johnpaul.reyes@example.invalid");
    expect(canEnterPortal(context, "STUDENT")).toBe(true);
    for (const path of [
      "/student",
      "/student/academics",
      "/student/enrollment",
      "/student/requests",
      "/student/announcements",
      "/student/calendar",
      "/student/profile",
    ]) {
      expect(canAccessPortalPath(context, "STUDENT", path)).toBe(true);
    }
    expect(canAccessPortalPath(context, "STUDENT", "/student/grades")).toBe(
      false,
    );
    expect(canAccessPortalPath(context, "TECHNOLOGY", "/technology")).toBe(
      false,
    );
  });

  it("allows Records Staff into the six guarded Records pages only", async () => {
    const staff = await contextFor("jose.garcia@example.invalid");
    const student = await contextFor("johnpaul.reyes@example.invalid");
    expect(staff.memberships.map((item) => item.portal)).toEqual(["RECORDS"]);
    for (const path of [
      "/records",
      "/records/applicants",
      "/records/dcat",
      "/records/students",
      "/records/enrollment",
      "/records/documents",
    ]) {
      expect(canAccessPortalPath(staff, "RECORDS", path)).toBe(true);
      expect(canAccessPortalPath(student, "RECORDS", path)).toBe(false);
    }
    expect(canAccessPortalPath(staff, "RECORDS", "/records/unregistered")).toBe(
      false,
    );
    expect(canAccessPortalPath(staff, "STUDENT", "/student")).toBe(false);
  });

  it("denies Student access to /technology", async () => {
    const context = await contextFor("johnpaul.reyes@example.invalid");
    expect(canEnterPortal(context, "TECHNOLOGY")).toBe(false);
    expect(canAccessPortalPath(context, "TECHNOLOGY", "/technology")).toBe(
      false,
    );
  });

  it("allows Technology access to /technology", async () => {
    expect(
      canEnterPortal(
        await contextFor("angelo.cruz@example.invalid"),
        "TECHNOLOGY",
      ),
    ).toBe(true);
  });

  it("denies Technology access to /student", async () => {
    expect(
      canEnterPortal(
        await contextFor("angelo.cruz@example.invalid"),
        "STUDENT",
      ),
    ).toBe(false);
  });

  it("allows Faculty into Academic but denies Academic Management", async () => {
    const context = await contextFor("maria.santos@example.invalid");
    expect(canEnterPortal(context, "ACADEMIC")).toBe(true);
    expect(hasPermission(context, "ACADEMIC", "academic.management.view")).toBe(
      false,
    );
    expect(
      canAccessPortalPath(context, "ACADEMIC", "/academic/management"),
    ).toBe(false);
    expect(
      canAccessPortalPath(context, "ACADEMIC", "/academic/announcements"),
    ).toBe(true);
  });

  it("allows Program Coordinator into Academic Management", async () => {
    const context = await contextFor("angelica.bautista@example.invalid");
    expect(
      canAccessPortalPath(context, "ACADEMIC", "/academic/management"),
    ).toBe(true);
    expect(
      canAccessPortalPath(context, "ACADEMIC", "/academic/announcements"),
    ).toBe(true);
  });

  it("allows Maintenance Staff into Facilities but not Employees", async () => {
    const context = await contextFor("mark.ramos@example.invalid");
    expect(
      canAccessPortalPath(context, "OPERATIONS", "/operations/facilities"),
    ).toBe(true);
    expect(
      canAccessPortalPath(context, "OPERATIONS", "/operations/employees"),
    ).toBe(false);
  });

  it("allows School Admin into all normal Operations sections", async () => {
    const context = await contextFor("marygrace.mendoza@example.invalid");
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
    const context = await contextFor("angelo.cruz@example.invalid");
    const technologyPermissions =
      context.memberships.find(
        (membership) => membership.portal === "TECHNOLOGY",
      )?.permissions ?? [];
    for (const path of [
      "/technology",
      "/technology/accounts",
      "/technology/security",
      "/technology/system",
      "/technology/profile",
    ]) {
      expect(canAccessPortalPath(context, "TECHNOLOGY", path)).toBe(true);
    }
    expect(
      canAccessPortalPath(context, "TECHNOLOGY", "/technology/developer"),
    ).toBe(false);
    expect(
      permittedNavigation("TECHNOLOGY", technologyPermissions).map(
        (item) => item.path,
      ),
    ).toEqual([
      "/technology",
      "/technology/accounts",
      "/technology/security",
      "/technology/system",
      "/technology/profile",
    ]);
  });

  it("allows the Developer role into the Developer foundation", async () => {
    const context = await contextFor("michael.castro@example.invalid");
    const technologyPermissions =
      context.memberships.find(
        (membership) => membership.portal === "TECHNOLOGY",
      )?.permissions ?? [];
    for (const path of [
      "/technology",
      "/technology/system",
      "/technology/developer",
      "/technology/profile",
    ]) {
      expect(canAccessPortalPath(context, "TECHNOLOGY", path)).toBe(true);
    }
    for (const path of ["/technology/accounts", "/technology/security"]) {
      expect(canAccessPortalPath(context, "TECHNOLOGY", path)).toBe(false);
    }
    expect(
      permittedNavigation("TECHNOLOGY", technologyPermissions).map(
        (item) => item.path,
      ),
    ).toEqual([
      "/technology",
      "/technology/system",
      "/technology/developer",
      "/technology/profile",
    ]);
  });

  it("allows the multi-portal account into both explicit portals only", async () => {
    const context = await contextFor("michael.castro@example.invalid");
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
    const userId = await authUserId("johnpaul.reyes@example.invalid");
    const cookie = await cookieFor("johnpaul.reyes@example.invalid");
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
    const email = "juan.delacruz@example.invalid";
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
    const userId = await authUserId("johnpaul.reyes@example.invalid");
    const before = await database
      .select({ id: authSessions.id })
      .from(authSessions)
      .where(eq(authSessions.userId, userId));
    const result = await signInToPortal(
      auth,
      database,
      {
        email: "johnpaul.reyes@example.invalid",
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
        email: "johnpaul.reyes@example.invalid",
        password,
        portal: "STUDENT",
      },
      requestHeaders(),
    );
    const technology = await signInToPortal(
      auth,
      database,
      {
        email: "angelo.cruz@example.invalid",
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
    const studentId = await authUserId("johnpaul.reyes@example.invalid");
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
