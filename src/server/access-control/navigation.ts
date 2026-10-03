import type { PortalCode } from "../../lib/portals";
import type { PermissionCode } from "./seed-data";

export type PortalRouteDefinition = {
  path: string;
  label: string;
  title: string;
  description: string;
  permission: PermissionCode;
};

export type NavigationItem = Pick<
  PortalRouteDefinition,
  "path" | "label" | "title"
> & { sectionStart?: boolean };

export const portalRoutes: Record<
  PortalCode,
  readonly PortalRouteDefinition[]
> = {
  APPLICANT: [
    {
      path: "/applicant",
      label: "Dashboard",
      title: "Your next step",
      description:
        "Follow your sample application from admission to enrollment.",
      permission: "applicant.portal.view",
    },
    {
      path: "/applicant/application",
      label: "Application",
      title: "Application",
      description: "Review your information and admission progress.",
      permission: "applicant.portal.view",
    },
    {
      path: "/applicant/dcat",
      label: "DCAT",
      title: "DCAT",
      description: "Your admission examination schedule, form, and result.",
      permission: "applicant.portal.view",
    },
    {
      path: "/applicant/enrollment",
      label: "Enrollment",
      title: "Enrollment",
      description: "Follow your Registrar appointment and document progress.",
      permission: "applicant.portal.view",
    },
    {
      path: "/applicant/announcements",
      label: "Announcements",
      title: "Announcements",
      description: "Sample updates for your applicant journey.",
      permission: "applicant.portal.view",
    },
    {
      path: "/applicant/profile",
      label: "Profile",
      title: "Profile",
      description: "Your sample applicant information.",
      permission: "applicant.portal.view",
    },
  ],
  STUDENT: [
    {
      path: "/student",
      label: "Dashboard",
      title: "Dashboard",
      description: "Your next class, day schedule, and recent sample updates.",
      permission: "student.portal.view",
    },
    {
      path: "/student/academics",
      label: "Academics",
      title: "Academics",
      description:
        "Your schedule, subjects, grades, attendance, and sample curriculum.",
      permission: "student.portal.view",
    },
    {
      path: "/student/enrollment",
      label: "Enrollment",
      title: "Enrollment",
      description: "Your sample enrollment status and documents.",
      permission: "student.portal.view",
    },
    {
      path: "/student/requests",
      label: "Requests",
      title: "Requests",
      description: "Frontend-only requests for additional document copies.",
      permission: "student.portal.view",
    },
    {
      path: "/student/announcements",
      label: "Announcements",
      title: "Announcements",
      description: "Fictional notices for the Student portal demonstration.",
      permission: "student.portal.view",
    },
    {
      path: "/student/calendar",
      label: "Calendar",
      title: "Calendar",
      description: "Sample class meetings and illustrative dates.",
      permission: "student.portal.view",
    },
    {
      path: "/student/profile",
      label: "Profile",
      title: "Profile",
      description: "Read-only sample student information.",
      permission: "student.portal.view",
    },
  ],
  ACADEMIC: [
    {
      path: "/academic",
      label: "Dashboard",
      title: "Academic portal",
      description:
        "A sample view of your classes, teaching tasks, and academic updates.",
      permission: "academic.portal.view",
    },
    {
      path: "/academic/classes",
      label: "Teaching",
      title: "Teaching",
      description:
        "Your assigned course offerings, schedules, and sample class rosters.",
      permission: "academic.classes.view",
    },
    {
      path: "/academic/attendance",
      label: "Attendance",
      title: "Attendance",
      description: "Record and review attendance for a sample class meeting.",
      permission: "academic.attendance.view",
    },
    {
      path: "/academic/grades",
      label: "Grades",
      title: "Grades",
      description:
        "Enter, review, and submit sample final grades for assigned classes.",
      permission: "academic.grades.view",
    },
    {
      path: "/academic/announcements",
      label: "Announcements",
      title: "Announcements",
      description:
        "Fictional campus, program, section, and class notices for this demo.",
      permission: "academic.portal.view",
    },
    {
      path: "/academic/management",
      label: "Academic Management",
      title: "Academic management",
      description:
        "A read-only overview of sample program offerings and faculty assignments.",
      permission: "academic.management.view",
    },
    {
      path: "/academic/profile",
      label: "Profile",
      title: "Profile",
      description: "Your signed-in identity and portal access.",
      permission: "academic.portal.view",
    },
  ],
  RECORDS: [
    {
      path: "/records",
      label: "Dashboard",
      title: "Admissions & Records portal",
      description: "Sample admissions and student-record work queues.",
      permission: "records.portal.view",
    },
    {
      path: "/records/applicants",
      label: "Applicants",
      title: "Applicants",
      description: "Find sample applicants and review physical requirements.",
      permission: "records.applicants.view",
    },
    {
      path: "/records/dcat",
      label: "DCAT",
      title: "DCAT",
      description:
        "Sample scheduling and result states for eligible applicants.",
      permission: "records.applicants.view",
    },
    {
      path: "/records/students",
      label: "Students",
      title: "Students",
      description: "Read existing sample student records.",
      permission: "records.students.view",
    },
    {
      path: "/records/enrollment",
      label: "Enrollment",
      title: "Enrollment",
      description: "Sample Registrar progression for qualified applicants.",
      permission: "records.enrollment.view",
    },
    {
      path: "/records/documents",
      label: "Documents",
      title: "Documents",
      description: "Sample COE and COR document states and previews.",
      permission: "records.enrollment.view",
    },
    {
      path: "/records/profile",
      label: "Profile",
      title: "Profile",
      description: "Your signed-in identity and portal access.",
      permission: "records.portal.view",
    },
  ],
  OPERATIONS: [
    {
      path: "/operations",
      label: "Dashboard",
      title: "Operations",
      description: "Routine school-support work for this demonstration.",
      permission: "operations.portal.view",
    },
    {
      path: "/operations/student-services",
      label: "Student Services",
      title: "Student Services",
      description: "Review fictional, non-academic student-service requests.",
      permission: "operations.student_services.view",
    },
    {
      path: "/operations/employees",
      label: "Employees",
      title: "Employees",
      description: "Find basic fictional employee directory entries.",
      permission: "operations.employees.view",
    },
    {
      path: "/operations/facilities",
      label: "Facilities",
      title: "Facilities",
      description: "Review sample maintenance tickets and demo updates.",
      permission: "operations.facilities.view",
    },
    {
      path: "/operations/administration",
      label: "Administration",
      title: "Administration",
      description: "Read the demo term and canonical campus/program reference.",
      permission: "operations.administration.view",
    },
    {
      path: "/operations/profile",
      label: "Profile",
      title: "Profile",
      description: "Your signed-in identity and portal access.",
      permission: "operations.portal.view",
    },
  ],
  TECHNOLOGY: [
    {
      path: "/technology",
      label: "Dashboard",
      title: "Technology",
      description:
        "A read-only view of demo account access, security foundations, and the systems behind this project.",
      permission: "technology.portal.view",
    },
    {
      path: "/technology/accounts",
      label: "Accounts",
      title: "Demo accounts",
      description:
        "Review fictional account status, portal memberships, and assigned roles.",
      permission: "technology.accounts.view",
    },
    {
      path: "/technology/security",
      label: "Security",
      title: "Security",
      description:
        "Review the implemented authentication and authorization foundations, plus sample scenarios.",
      permission: "technology.security.view",
    },
    {
      path: "/technology/system",
      label: "System",
      title: "System",
      description:
        "See safe project stack and environment information without simulated health metrics.",
      permission: "technology.system.view",
    },
    {
      path: "/technology/developer",
      label: "Developer",
      title: "Developer",
      description:
        "Explore the project architecture, portal map, canonical data, and demo boundaries.",
      permission: "technology.developer.view",
    },
    {
      path: "/technology/profile",
      label: "Profile",
      title: "Profile",
      description: "Your signed-in identity and portal access.",
      permission: "technology.portal.view",
    },
  ],
};

export function getPortalRoute(portal: PortalCode, path: string) {
  return portalRoutes[portal].find((route) => route.path === path) ?? null;
}

export function permittedNavigation(
  portal: PortalCode,
  effectivePermissions: readonly PermissionCode[],
): NavigationItem[] {
  return portalRoutes[portal]
    .filter((route) => effectivePermissions.includes(route.permission))
    .map(({ path, label, title }) => ({
      path,
      label,
      title,
      sectionStart: path.endsWith("/profile"),
    }));
}
