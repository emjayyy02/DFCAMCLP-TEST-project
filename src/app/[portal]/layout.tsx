import { notFound } from "next/navigation";
import { AppShell } from "@/components/portal/app-shell";
import { SignedInIdentityProvider } from "@/features/identity/signed-in-identity";
import { ApplicantDemoProvider } from "@/features/applicant/demo-context";
import { ApplicantScenarioSwitcher } from "@/features/applicant/scenario-switcher";
import { StudentDemoProvider } from "@/features/student/demo-context";
import { AcademicDemoProvider } from "@/features/academic/demo-context";
import { RecordsDemoProvider } from "@/features/records/demo-context";
import { OperationsDemoProvider } from "@/features/operations/demo-context";
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

  const appShell = (
    <AppShell
      currentPortal={portal}
      memberships={safePortalMemberships(context)}
      navigation={permittedNavigation(portal, membership.permissions)}
      navigationTools={
        portal === "APPLICANT" ? <ApplicantScenarioSwitcher /> : undefined
      }
      user={{
        id: context.user.id,
        name: context.user.name,
        email: context.user.email,
      }}
    >
      {children}
    </AppShell>
  );

  const experience =
    portal === "APPLICANT" ? (
      <ApplicantDemoProvider key={context.user.email}>
        {appShell}
      </ApplicantDemoProvider>
    ) : portal === "STUDENT" ? (
      <StudentDemoProvider key={context.user.email}>
        {appShell}
      </StudentDemoProvider>
    ) : portal === "ACADEMIC" ? (
      <AcademicDemoProvider key={context.user.email}>
        {appShell}
      </AcademicDemoProvider>
    ) : portal === "RECORDS" ? (
      <RecordsDemoProvider key={context.user.email}>
        {appShell}
      </RecordsDemoProvider>
    ) : portal === "OPERATIONS" ? (
      <OperationsDemoProvider key={context.user.email}>
        {appShell}
      </OperationsDemoProvider>
    ) : (
      appShell
    );
  return (
    <SignedInIdentityProvider
      key={context.user.id}
      user={{
        id: context.user.id,
        name: context.user.name,
        email: context.user.email,
      }}
    >
      {experience}
    </SignedInIdentityProvider>
  );
}
