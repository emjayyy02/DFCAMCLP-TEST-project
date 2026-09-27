import "server-only";
import { and, asc, eq, like } from "drizzle-orm";
import type { TechnologyAccountRow } from "@/features/technology/demo-data";
import { groupTechnologyAccountRows } from "@/features/technology/demo-data";
import type { Database } from "../connection";
import {
  applicationAccounts,
  authUsers,
  membershipRoles,
  portalMemberships,
  roles,
} from "../schema";

export async function getTechnologyDemoAccounts(database: Database) {
  const rows = await database
    .select({
      name: authUsers.name,
      email: authUsers.email,
      accountStatus: applicationAccounts.status,
      portal: portalMemberships.portal,
      membershipActive: portalMemberships.isActive,
      roleLabel: roles.label,
    })
    .from(applicationAccounts)
    .innerJoin(authUsers, eq(authUsers.id, applicationAccounts.authUserId))
    .leftJoin(
      portalMemberships,
      eq(
        portalMemberships.applicationAccountId,
        applicationAccounts.authUserId,
      ),
    )
    .leftJoin(
      membershipRoles,
      and(
        eq(membershipRoles.portalMembershipId, portalMemberships.id),
        eq(membershipRoles.portal, portalMemberships.portal),
      ),
    )
    .leftJoin(
      roles,
      and(
        eq(roles.id, membershipRoles.roleId),
        eq(roles.portal, membershipRoles.portal),
      ),
    )
    .where(like(authUsers.email, "%@example.invalid"))
    .orderBy(asc(authUsers.email));

  return groupTechnologyAccountRows(rows as TechnologyAccountRow[]);
}
