import { notFound } from "next/navigation";
import { AppShell } from "@/components/portal/app-shell";
import { portalCodeFromSlug } from "@/lib/portals";
import { permittedNavigation } from "@/server/access-control/navigation";
import {
  requirePortal,
  safePortalMemberships,
} from "@/server/access-control/current";

export default async function PortalLayout({
  children,
  params,
}: LayoutProps<"/[portal]">) {
  const { portal: portalSlug } = await params;
  const portal = portalCodeFromSlug(portalSlug);
  if (!portal) notFound();

  const context = await requirePortal(portal);
  const membership = context.memberships.find(
    (candidate) => candidate.portal === portal,
  );
  if (!membership) notFound();

  return (
    <AppShell
      currentPortal={portal}
      memberships={safePortalMemberships(context)}
      navigation={permittedNavigation(portal, membership.permissions)}
      user={{ name: context.user.name, email: context.user.email }}
    >
      {children}
    </AppShell>
  );
}
