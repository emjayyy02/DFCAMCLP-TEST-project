import { and, eq } from "drizzle-orm";
import type { PortalCode } from "../../lib/portals";
import type { Database } from "../db/connection";
import {
  membershipRoles,
  permissions,
  portalMemberships,
  rolePermissions,
  roles,
} from "../db/schema";
import type { PortalAuth } from "../auth/factory";
import { getApplicationSession } from "../auth/session-core";
import type { PermissionCode } from "./seed-data";
import { getPortalRoute } from "./navigation";

export type PortalMembershipAccess = {
  id: string;
  portal: PortalCode;
  roles: { code: string; label: string }[];
  permissions: PermissionCode[];
};

export type AccessContext = NonNullable<
  Awaited<ReturnType<typeof getApplicationSession>>
> & {
  memberships: PortalMembershipAccess[];
};

export async function getActiveMemberships(
  database: Database,
  applicationAccountId: string,
) {
  const rows = await database
    .select({
      membershipId: portalMemberships.id,
      portal: portalMemberships.portal,
      roleCode: roles.code,
      roleLabel: roles.label,
      permissionCode: permissions.code,
    })
    .from(portalMemberships)
    .leftJoin(
      membershipRoles,
      eq(membershipRoles.portalMembershipId, portalMemberships.id),
    )
    .leftJoin(roles, eq(roles.id, membershipRoles.roleId))
    .leftJoin(rolePermissions, eq(rolePermissions.roleId, roles.id))
    .leftJoin(permissions, eq(permissions.id, rolePermissions.permissionId))
    .where(
      and(
        eq(portalMemberships.applicationAccountId, applicationAccountId),
        eq(portalMemberships.isActive, true),
      ),
    );

  const membershipMap = new Map<string, PortalMembershipAccess>();
  for (const row of rows) {
    const membership = membershipMap.get(row.membershipId) ?? {
      id: row.membershipId,
      portal: row.portal,
      roles: [],
      permissions: [],
    };
    if (
      row.roleCode &&
      row.roleLabel &&
      !membership.roles.some((role) => role.code === row.roleCode)
    ) {
      membership.roles.push({ code: row.roleCode, label: row.roleLabel });
    }
    if (
      row.permissionCode &&
      !membership.permissions.includes(row.permissionCode as PermissionCode)
    ) {
      membership.permissions.push(row.permissionCode as PermissionCode);
    }
    membershipMap.set(row.membershipId, membership);
  }

  return [...membershipMap.values()].sort((a, b) =>
    a.portal.localeCompare(b.portal),
  );
}

export async function getAccessContext(
  auth: PortalAuth,
  database: Database,
  requestHeaders: Headers,
): Promise<AccessContext | null> {
  const current = await getApplicationSession(auth, database, requestHeaders);
  if (!current) return null;

  return {
    ...current,
    memberships: await getActiveMemberships(database, current.user.id),
  };
}

export function hasPermission(
  context: AccessContext,
  portal: PortalCode,
  permission: PermissionCode,
) {
  return Boolean(
    context.memberships
      .find((membership) => membership.portal === portal)
      ?.permissions.includes(permission),
  );
}

export function canEnterPortal(context: AccessContext, portal: PortalCode) {
  const portalPermission =
    `${portal.toLowerCase()}.portal.view` as PermissionCode;
  return hasPermission(context, portal, portalPermission);
}

export function canAccessPortalPath(
  context: AccessContext,
  portal: PortalCode,
  path: string,
) {
  const route = getPortalRoute(portal, path);
  return Boolean(
    route &&
    canEnterPortal(context, portal) &&
    hasPermission(context, portal, route.permission),
  );
}
