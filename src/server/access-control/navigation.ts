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
>;

export const portalRoutes: Record<
  PortalCode,
  readonly PortalRouteDefinition[]
> = {
  APPLICANT: [
    {
      path: "/applicant",
      label: "Dashboard",
      title: "Applicant portal",
      description:
        "Application and admission workflows will be implemented in a later demo phase.",
      permission: "applicant.portal.view",
    },
  ],
  STUDENT: [
    {
      path: "/student",
      label: "Dashboard",
      title: "Student portal",
      description:
        "Student schedules, subjects, grades, and attendance will be implemented in a later demo phase.",
      permission: "student.portal.view",
    },
  ],
  ACADEMIC: [
    {
      path: "/academic",
      label: "Dashboard",
      title: "Academic portal",
      description:
        "Teaching work is intentionally limited to access-control and shell foundations in this milestone.",
      permission: "academic.portal.view",
    },
    {
      path: "/academic/classes",
      label: "Teaching",
      title: "Teaching",
      description:
        "Assigned classes and teaching workflows will be implemented in a later demo phase.",
      permission: "academic.classes.view",
    },
    {
      path: "/academic/attendance",
      label: "Attendance",
      title: "Attendance",
      description:
        "Attendance records and class meetings will be implemented in a later demo phase.",
      permission: "academic.attendance.view",
    },
    {
      path: "/academic/grades",
      label: "Grades",
      title: "Grades",
      description:
        "Grade entry, review, and release will be implemented in a later demo phase.",
      permission: "academic.grades.view",
    },
    {
      path: "/academic/management",
      label: "Academic Management",
      title: "Academic management",
      description:
        "Program-level academic management will be implemented in a later demo phase.",
      permission: "academic.management.view",
    },
  ],
  RECORDS: [
    {
      path: "/records",
      label: "Dashboard",
      title: "Admissions & Records portal",
      description:
        "Records work is intentionally limited to access-control and shell foundations in this milestone.",
      permission: "records.portal.view",
    },
    {
      path: "/records/applicants",
      label: "Applicants",
      title: "Applicants",
      description:
        "Applicant review and requirements processing will be implemented in a later demo phase.",
      permission: "records.applicants.view",
    },
    {
      path: "/records/students",
      label: "Students",
      title: "Students",
      description:
        "Student records and account-creation workflows will be implemented in a later demo phase.",
      permission: "records.students.view",
    },
    {
      path: "/records/enrollment",
      label: "Enrollment",
      title: "Enrollment",
      description:
        "Enrollment processing, COE, and COR workflows will be implemented in a later demo phase.",
      permission: "records.enrollment.view",
    },
  ],
  OPERATIONS: [
    {
      path: "/operations",
      label: "Dashboard",
      title: "Operations portal",
      description:
        "Operations work is intentionally limited to access-control and shell foundations in this milestone.",
      permission: "operations.portal.view",
    },
    {
      path: "/operations/student-services",
      label: "Student Services",
      title: "Student services",
      description:
        "Student-service requests and concerns will be implemented in a later demo phase.",
      permission: "operations.student_services.view",
    },
    {
      path: "/operations/employees",
      label: "Employees",
      title: "Employees",
      description:
        "Employee operations will be implemented in a later demo phase.",
      permission: "operations.employees.view",
    },
    {
      path: "/operations/facilities",
      label: "Facilities",
      title: "Facilities",
      description:
        "Facilities and maintenance workflows will be implemented in a later demo phase.",
      permission: "operations.facilities.view",
    },
    {
      path: "/operations/administration",
      label: "Administration",
      title: "Administration",
      description:
        "Institutional configuration workflows will be implemented in a later demo phase.",
      permission: "operations.administration.view",
    },
  ],
  TECHNOLOGY: [
    {
      path: "/technology",
      label: "Dashboard",
      title: "Technology portal",
      description:
        "Technology work is intentionally limited to access-control and shell foundations in this milestone.",
      permission: "technology.portal.view",
    },
    {
      path: "/technology/accounts",
      label: "Accounts",
      title: "Accounts",
      description:
        "Account and membership administration will be implemented in a later demo phase.",
      permission: "technology.accounts.view",
    },
    {
      path: "/technology/security",
      label: "Security",
      title: "Security",
      description:
        "Security activity and audit views will be implemented in a later demo phase.",
      permission: "technology.security.view",
    },
    {
      path: "/technology/system",
      label: "System",
      title: "System",
      description:
        "System health and configuration views will be implemented in a later demo phase.",
      permission: "technology.system.view",
    },
    {
      path: "/technology/developer",
      label: "Developer",
      title: "Developer",
      description:
        "Developer diagnostics will be implemented in a later demo phase.",
      permission: "technology.developer.view",
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
    .map(({ path, label, title }) => ({ path, label, title }));
}
