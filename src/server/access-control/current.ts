import "server-only";
import { cache } from "react";
import { headers } from "next/headers";
import { forbidden, redirect } from "next/navigation";
import type { PortalCode } from "@/lib/portals";
import { portalDetails } from "@/lib/portals";
import { auth } from "@/server/auth/auth";
import { db } from "@/server/db";
import { getPortalRoute } from "./navigation";
import { canEnterPortal, getAccessContext, hasPermission } from "./service";

export const getCurrentAccessContext = cache(async () =>
  getAccessContext(auth, db, await headers()),
);

export async function requirePortal(portal: PortalCode) {
  const context = await getCurrentAccessContext();
  if (!context) redirect(`/login?portal=${portal}`);
  if (!canEnterPortal(context, portal)) forbidden();
  return context;
}

export async function requirePortalPath(portal: PortalCode, path: string) {
  const route = getPortalRoute(portal, path);
  if (!route) return null;

  const context = await requirePortal(portal);
  if (!hasPermission(context, portal, route.permission)) forbidden();
  return { context, route };
}

export function safePortalMemberships(
  context: Awaited<ReturnType<typeof requirePortal>>,
) {
  return context.memberships
    .filter((membership) => canEnterPortal(context, membership.portal))
    .map((membership) => ({
      portal: membership.portal,
      label: portalDetails[membership.portal].label,
      path: `/${portalDetails[membership.portal].slug}`,
      roleLabels: membership.roles.map((role) => role.label),
    }));
}

export function safeActiveMemberships(
  context: NonNullable<Awaited<ReturnType<typeof getCurrentAccessContext>>>,
) {
  return context.memberships.map((membership) => ({
    portal: membership.portal,
    label: portalDetails[membership.portal].label,
    path: `/${portalDetails[membership.portal].slug}`,
    roleLabels: membership.roles.map((role) => role.label),
  }));
}
