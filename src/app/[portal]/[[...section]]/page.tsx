import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/portal/page-header";
import { portalCodeFromSlug, portalDetails } from "@/lib/portals";
import { permittedNavigation } from "@/server/access-control/navigation";
import { requirePortalPath } from "@/server/access-control/current";
import { ApplicantPage } from "@/features/applicant/applicant-page";
import { StudentPage } from "@/features/student/student-page";
import { AcademicPage } from "@/features/academic/academic-page";
import { RecordsPage } from "@/features/records/records-page";
import { OperationsPage } from "@/features/operations/operations-page";

export default async function PortalFoundationPage({
  params,
  searchParams,
}: PageProps<"/[portal]/[[...section]]">) {
  const { portal: portalSlug, section = [] } = await params;
  const portal = portalCodeFromSlug(portalSlug);
  if (!portal) notFound();

  const path = `/${portalSlug}${section.length ? `/${section.join("/")}` : ""}`;
  const authorized = await requirePortalPath(portal, path);
  if (!authorized) notFound();

  if (portal === "APPLICANT") {
    const query = await searchParams;
    return (
      <ApplicantPage
        key={path}
        section={section[0] ?? "dashboard"}
        view={typeof query.view === "string" ? query.view : undefined}
      />
    );
  }

  if (portal === "STUDENT") {
    const query = await searchParams;
    return (
      <StudentPage
        key={path}
        section={section[0] ?? "dashboard"}
        view={typeof query.view === "string" ? query.view : undefined}
      />
    );
  }

  if (portal === "ACADEMIC") {
    const query = await searchParams;
    const membership = authorized.context.memberships.find(
      (candidate) => candidate.portal === portal,
    );
    if (!membership) notFound();
    const isCoordinator = membership.roles.some(
      (role) => role.code === "PROGRAM_COORDINATOR",
    );
    return (
      <AcademicPage
        key={`${path}:${query.offering ?? ""}`}
        section={section[0] ?? "dashboard"}
        isCoordinator={isCoordinator}
        offeringId={
          typeof query.offering === "string" ? query.offering : undefined
        }
        date={typeof query.date === "string" ? query.date : undefined}
      />
    );
  }

  if (portal === "RECORDS") {
    const query = await searchParams;
    return (
      <RecordsPage
        key={path}
        section={section[0] ?? "dashboard"}
        recordId={typeof query.record === "string" ? query.record : undefined}
        queue={
          typeof query.queue === "string"
            ? query.queue
            : typeof query.from === "string"
              ? query.from
              : undefined
        }
      />
    );
  }

  if (portal === "OPERATIONS") {
    const query = await searchParams;
    const membership = authorized.context.memberships.find(
      (candidate) => candidate.portal === portal,
    );
    if (!membership) notFound();
    const isMaintenanceStaff = membership.roles.some(
      (role) => role.code === "MAINTENANCE_STAFF",
    );
    return (
      <OperationsPage
        key={path}
        section={section[0] ?? "dashboard"}
        title={authorized.route.title}
        description={authorized.route.description}
        isMaintenanceStaff={isMaintenanceStaff}
        requestId={
          typeof query.request === "string" ? query.request : undefined
        }
        employeeId={
          typeof query.employee === "string" ? query.employee : undefined
        }
        ticketId={typeof query.ticket === "string" ? query.ticket : undefined}
        facilityView={typeof query.view === "string" ? query.view : undefined}
      />
    );
  }

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
