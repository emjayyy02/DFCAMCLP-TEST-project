import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/portal/page-header";
import { portalCodeFromSlug, portalDetails } from "@/lib/portals";
import { permittedNavigation } from "@/server/access-control/navigation";
import { requirePortalPath } from "@/server/access-control/current";

export default async function PortalFoundationPage({
  params,
}: PageProps<"/[portal]/[[...section]]">) {
  const { portal: portalSlug, section = [] } = await params;
  const portal = portalCodeFromSlug(portalSlug);
  if (!portal) notFound();

  const path = `/${portalSlug}${section.length ? `/${section.join("/")}` : ""}`;
  const authorized = await requirePortalPath(portal, path);
  if (!authorized) notFound();

  const membership = authorized.context.memberships.find(
    (candidate) => candidate.portal === portal,
  );
  if (!membership) notFound();
  const navigation = permittedNavigation(portal, membership.permissions);

  return (
    <>
      <PageHeader
        title={authorized.route.title}
        description={authorized.route.description}
      />
      <div className="mt-8 grid gap-6 xl:grid-cols-[minmax(0,1fr)_18rem]">
        <Card aria-labelledby="foundation-title">
          <div className="flex flex-wrap items-center gap-3">
            <h2 id="foundation-title" className="text-xl font-semibold">
              Portal foundation
            </h2>
            <Badge tone="info">Access confirmed</Badge>
          </div>
          <p className="mt-4 max-w-[70ch] leading-7 text-muted-foreground">
            This page demonstrates authenticated portal membership, role-based
            permission checks, and the shared application shell. It contains no
            live school records or operational workflow.
          </p>
          <dl className="mt-6 divide-y divide-border border-y border-border">
            <div className="grid gap-1 py-4 sm:grid-cols-[10rem_1fr] sm:gap-4">
              <dt className="text-sm font-semibold text-muted-foreground">
                Current portal
              </dt>
              <dd>{portalDetails[portal].label}</dd>
            </div>
            <div className="grid gap-1 py-4 sm:grid-cols-[10rem_1fr] sm:gap-4">
              <dt className="text-sm font-semibold text-muted-foreground">
                Role
              </dt>
              <dd>{membership.roles.map((role) => role.label).join(", ")}</dd>
            </div>
          </dl>
        </Card>
        <aside
          aria-labelledby="available-title"
          className="rounded-lg bg-primary-soft p-6 text-info-foreground"
        >
          <h2 id="available-title" className="text-lg font-semibold">
            Available in this role
          </h2>
          <ul className="mt-4 space-y-2 text-sm leading-6">
            {navigation.map((item) => (
              <li key={item.path}>{item.label}</li>
            ))}
          </ul>
          <p className="mt-5 rounded-md bg-accent-soft px-3 py-2 text-sm leading-6 text-accent-foreground">
            Placeholder destinations prove access boundaries only.
          </p>
        </aside>
      </div>
    </>
  );
}
