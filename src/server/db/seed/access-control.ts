import { inArray } from "drizzle-orm";
import {
  membershipSeed,
  permissionSeed,
  rolePermissionSeed,
  roleSeed,
} from "../../access-control/seed-data";
import type { Database } from "../connection";
import {
  authUsers,
  membershipRoles,
  permissions,
  portalMemberships,
  rolePermissions,
  roles,
} from "../schema";

export async function seedAccessControl(database: Database) {
  await database.transaction(async (transaction) => {
    for (const role of roleSeed) {
      await transaction
        .insert(roles)
        .values(role)
        .onConflictDoUpdate({
          target: roles.code,
          set: {
            label: role.label,
            portal: role.portal,
            updatedAt: new Date(),
          },
        });
    }

    for (const permission of permissionSeed) {
      await transaction
        .insert(permissions)
        .values(permission)
        .onConflictDoUpdate({
          target: permissions.code,
          set: {
            label: permission.label,
            portal: permission.portal,
            updatedAt: new Date(),
          },
        });
    }

    const storedRoles = await transaction
      .select({ id: roles.id, code: roles.code, portal: roles.portal })
      .from(roles)
      .where(
        inArray(
          roles.code,
          roleSeed.map((role) => role.code),
        ),
      );
    const storedPermissions = await transaction
      .select({ id: permissions.id, code: permissions.code })
      .from(permissions)
      .where(
        inArray(
          permissions.code,
          permissionSeed.map((permission) => permission.code),
        ),
      );
    const roleByCode = new Map(storedRoles.map((role) => [role.code, role]));
    const permissionByCode = new Map(
      storedPermissions.map((permission) => [permission.code, permission]),
    );

    for (const [roleCode, permissionCodes] of Object.entries(
      rolePermissionSeed,
    )) {
      const role = roleByCode.get(roleCode);
      if (!role) throw new Error(`Seed role is missing: ${roleCode}`);

      for (const permissionCode of permissionCodes) {
        const permission = permissionByCode.get(permissionCode);
        if (!permission) {
          throw new Error(`Seed permission is missing: ${permissionCode}`);
        }
        await transaction
          .insert(rolePermissions)
          .values({
            roleId: role.id,
            permissionId: permission.id,
            portal: role.portal,
          })
          .onConflictDoUpdate({
            target: [rolePermissions.roleId, rolePermissions.permissionId],
            set: { portal: role.portal, updatedAt: new Date() },
          });
      }
    }

    const emails = [...new Set(membershipSeed.map((item) => item.email))];
    const storedUsers = await transaction
      .select({ id: authUsers.id, email: authUsers.email })
      .from(authUsers)
      .where(inArray(authUsers.email, emails));
    const userByEmail = new Map(storedUsers.map((user) => [user.email, user]));

    for (const assignment of membershipSeed) {
      const user = userByEmail.get(assignment.email);
      const role = roleByCode.get(assignment.role);
      if (!user) {
        throw new Error(`Seed account is missing: ${assignment.email}`);
      }
      if (!role) {
        throw new Error(`Seed role is missing: ${assignment.role}`);
      }

      const [membership] = await transaction
        .insert(portalMemberships)
        .values({
          applicationAccountId: user.id,
          portal: assignment.portal,
          isActive: true,
        })
        .onConflictDoUpdate({
          target: [
            portalMemberships.applicationAccountId,
            portalMemberships.portal,
          ],
          set: { isActive: true, updatedAt: new Date() },
        })
        .returning({ id: portalMemberships.id });

      await transaction
        .insert(membershipRoles)
        .values({
          portalMembershipId: membership.id,
          roleId: role.id,
          portal: assignment.portal,
        })
        .onConflictDoUpdate({
          target: [membershipRoles.portalMembershipId, membershipRoles.roleId],
          set: { portal: assignment.portal, updatedAt: new Date() },
        });
    }
  });
}
