import { notFound } from "next/navigation";
import { PageHeader } from "@/components/portal/page-header";
import { DemoNotice } from "@/components/ui/demo-notice";
import { portalCodeFromSlug } from "@/lib/portals";
import { requirePortalPath } from "@/server/access-control/current";
import { ApplicantPage } from "@/features/applicant/applicant-page";
import { StudentPage } from "@/features/student/student-page";
import { AcademicPage } from "@/features/academic/academic-page";
import { RecordsPage } from "@/features/records/records-page";
import { OperationsPage } from "@/features/operations/operations-page";
import { TechnologyPage } from "@/features/technology/technology-page";

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

  if (portal === "TECHNOLOGY") {
    const membership = authorized.context.memberships.find(
      (candidate) => candidate.portal === portal,
    );
    if (!membership) notFound();
    return (
      <div className="portal-technology-page">
        <PageHeader
          title={authorized.route.title}
          description={authorized.route.description}
        />
        <DemoNotice
          label={
            section[0] === "accounts" ? "Demo workspace" : "Project information"
          }
          detail={
            section[0] === "accounts"
              ? "Fictional development accounts · Read-only"
              : "No live monitoring or service-health reporting"
          }
        />
        <TechnologyPage
          section={section[0] ?? "dashboard"}
          permissions={membership.permissions}
        />
      </div>
    );
  }

  notFound();
}
