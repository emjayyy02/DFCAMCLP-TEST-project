import { notFound } from "next/navigation";
import { AppShell } from "@/components/portal/app-shell";
import { ApplicantDemoProvider } from "@/features/applicant/demo-context";
import { StudentDemoProvider } from "@/features/student/demo-context";
import { AcademicDemoProvider } from "@/features/academic/demo-context";
import { RecordsDemoProvider } from "@/features/records/demo-context";
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
      {portal === "APPLICANT" ? (
        <ApplicantDemoProvider key={context.user.email}>
          {children}
        </ApplicantDemoProvider>
      ) : portal === "STUDENT" ? (
        <StudentDemoProvider key={context.user.email}>
          {children}
        </StudentDemoProvider>
      ) : portal === "ACADEMIC" ? (
        <AcademicDemoProvider key={context.user.email}>
          {children}
        </AcademicDemoProvider>
      ) : portal === "RECORDS" ? (
        <RecordsDemoProvider key={context.user.email}>
          {children}
        </RecordsDemoProvider>
      ) : (
        children
      )}
    </AppShell>
  );
}
