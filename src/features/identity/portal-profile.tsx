import { eq } from "drizzle-orm";
import { PageHeader } from "@/components/portal/page-header";
import { UnifiedProfile } from "./account-profile";
import { ApplicantProfileInformation } from "@/features/applicant/applicant-page";
import { StudentProfileInformation } from "@/features/student/student-page";
import { safePortalMemberships } from "@/server/access-control/current";
import type { AccessContext } from "@/server/access-control/service";
import { portalDetails, type PortalCode } from "@/lib/portals";
import { db } from "@/server/db";
import { employeeProfiles } from "@/server/db/schema";

export async function PortalProfile({
  context,
  portal,
}: {
  context: AccessContext;
  portal: PortalCode;
}) {
  const [employee] =
    portal === "STUDENT" || portal === "APPLICANT"
      ? []
      : await db
          .select({
            employeeNumber: employeeProfiles.employeeNumber,
            department: employeeProfiles.departmentLabel,
            position: employeeProfiles.positionTitle,
            status: employeeProfiles.employmentStatus,
          })
          .from(employeeProfiles)
          .where(eq(employeeProfiles.personId, context.identity.personId))
          .limit(1);
  return (
    <div className="unified-profile-page" data-portal={portal}>
      <PageHeader
        title="Profile"
        description={`${portalDetails[portal].label} portal · Your identity, information, and access.`}
        density="personal"
      />
      <UnifiedProfile
        key={context.user.id}
        user={{
          id: context.user.id,
          name: context.user.name,
          email: context.user.email,
          status: context.identity.status,
        }}
        memberships={safePortalMemberships(context)}
      >
        {portal === "STUDENT" ? (
          <StudentProfileInformation />
        ) : portal === "APPLICANT" ? (
          <ApplicantProfileInformation />
        ) : employee ? (
          <section
            className="unified-profile-information"
            aria-labelledby="employee-information-title"
          >
            <h2 id="employee-information-title">Employee information</h2>
            <dl>
              {Object.entries({
                "Employee number": employee.employeeNumber,
                Department: employee.department,
                Position: employee.position,
                "Employment status": employee.status,
              })
                .filter(([, value]) => value)
                .map(([label, value]) => (
                  <div key={label}>
                    <dt>{label}</dt>
                    <dd>{value}</dd>
                  </div>
                ))}
            </dl>
          </section>
        ) : null}
      </UnifiedProfile>
    </div>
  );
}
