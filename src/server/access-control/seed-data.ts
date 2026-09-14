import type { PortalCode } from "../../lib/portals";

export const roleSeed = [
  { code: "APPLICANT", label: "Applicant", portal: "APPLICANT" },
  { code: "STUDENT", label: "Student", portal: "STUDENT" },
  { code: "FACULTY", label: "Faculty", portal: "ACADEMIC" },
  {
    code: "PROGRAM_COORDINATOR",
    label: "Program Coordinator",
    portal: "ACADEMIC",
  },
  { code: "RECORDS_STAFF", label: "Records Staff", portal: "RECORDS" },
  {
    code: "MAINTENANCE_STAFF",
    label: "Maintenance Staff",
    portal: "OPERATIONS",
  },
  { code: "SCHOOL_ADMIN", label: "School Admin", portal: "OPERATIONS" },
  { code: "IT_ADMIN", label: "IT Admin", portal: "TECHNOLOGY" },
  { code: "DEVELOPER", label: "Developer", portal: "TECHNOLOGY" },
] as const satisfies readonly {
  code: string;
  label: string;
  portal: PortalCode;
}[];

export const permissionSeed = [
  {
    code: "applicant.portal.view",
    label: "View applicant portal",
    portal: "APPLICANT",
  },
  {
    code: "student.portal.view",
    label: "View student portal",
    portal: "STUDENT",
  },
  {
    code: "academic.portal.view",
    label: "View academic portal",
    portal: "ACADEMIC",
  },
  {
    code: "academic.classes.view",
    label: "View teaching",
    portal: "ACADEMIC",
  },
  {
    code: "academic.attendance.view",
    label: "View attendance",
    portal: "ACADEMIC",
  },
  {
    code: "academic.grades.view",
    label: "View grades",
    portal: "ACADEMIC",
  },
  {
    code: "academic.management.view",
    label: "View academic management",
    portal: "ACADEMIC",
  },
  {
    code: "records.portal.view",
    label: "View records portal",
    portal: "RECORDS",
  },
  {
    code: "records.applicants.view",
    label: "View applicant foundation",
    portal: "RECORDS",
  },
  {
    code: "records.students.view",
    label: "View student foundation",
    portal: "RECORDS",
  },
  {
    code: "records.enrollment.view",
    label: "View enrollment foundation",
    portal: "RECORDS",
  },
  {
    code: "operations.portal.view",
    label: "View operations portal",
    portal: "OPERATIONS",
  },
  {
    code: "operations.student_services.view",
    label: "View student services foundation",
    portal: "OPERATIONS",
  },
  {
    code: "operations.employees.view",
    label: "View employee foundation",
    portal: "OPERATIONS",
  },
  {
    code: "operations.facilities.view",
    label: "View facilities foundation",
    portal: "OPERATIONS",
  },
  {
    code: "operations.administration.view",
    label: "View administration foundation",
    portal: "OPERATIONS",
  },
  {
    code: "technology.portal.view",
    label: "View technology portal",
    portal: "TECHNOLOGY",
  },
  {
    code: "technology.accounts.view",
    label: "View account foundation",
    portal: "TECHNOLOGY",
  },
  {
    code: "technology.security.view",
    label: "View security foundation",
    portal: "TECHNOLOGY",
  },
  {
    code: "technology.system.view",
    label: "View system foundation",
    portal: "TECHNOLOGY",
  },
  {
    code: "technology.developer.view",
    label: "View developer foundation",
    portal: "TECHNOLOGY",
  },
] as const satisfies readonly {
  code: string;
  label: string;
  portal: PortalCode;
}[];

export type PermissionCode = (typeof permissionSeed)[number]["code"];
export type RoleCode = (typeof roleSeed)[number]["code"];

export const rolePermissionSeed: Record<RoleCode, readonly PermissionCode[]> = {
  APPLICANT: ["applicant.portal.view"],
  STUDENT: ["student.portal.view"],
  FACULTY: [
    "academic.portal.view",
    "academic.classes.view",
    "academic.attendance.view",
    "academic.grades.view",
  ],
  PROGRAM_COORDINATOR: [
    "academic.portal.view",
    "academic.classes.view",
    "academic.attendance.view",
    "academic.grades.view",
    "academic.management.view",
  ],
  RECORDS_STAFF: [
    "records.portal.view",
    "records.applicants.view",
    "records.students.view",
    "records.enrollment.view",
  ],
  MAINTENANCE_STAFF: ["operations.portal.view", "operations.facilities.view"],
  SCHOOL_ADMIN: [
    "operations.portal.view",
    "operations.student_services.view",
    "operations.employees.view",
    "operations.facilities.view",
    "operations.administration.view",
  ],
  IT_ADMIN: [
    "technology.portal.view",
    "technology.accounts.view",
    "technology.security.view",
    "technology.system.view",
  ],
  DEVELOPER: [
    "technology.portal.view",
    "technology.system.view",
    "technology.developer.view",
  ],
};

export const membershipSeed = [
  {
    email: "applicant.test@example.invalid",
    portal: "APPLICANT",
    role: "APPLICANT",
  },
  {
    email: "student.test@example.invalid",
    portal: "STUDENT",
    role: "STUDENT",
  },
  {
    email: "faculty.test@example.invalid",
    portal: "ACADEMIC",
    role: "FACULTY",
  },
  {
    email: "records.test@example.invalid",
    portal: "RECORDS",
    role: "RECORDS_STAFF",
  },
  {
    email: "operations.test@example.invalid",
    portal: "OPERATIONS",
    role: "MAINTENANCE_STAFF",
  },
  {
    email: "technology.test@example.invalid",
    portal: "TECHNOLOGY",
    role: "IT_ADMIN",
  },
  {
    email: "coordinator.test@example.invalid",
    portal: "ACADEMIC",
    role: "PROGRAM_COORDINATOR",
  },
  {
    email: "school-admin.test@example.invalid",
    portal: "OPERATIONS",
    role: "SCHOOL_ADMIN",
  },
  {
    email: "faculty-it.test@example.invalid",
    portal: "ACADEMIC",
    role: "FACULTY",
  },
  {
    email: "faculty-it.test@example.invalid",
    portal: "TECHNOLOGY",
    role: "DEVELOPER",
  },
] as const satisfies readonly {
  email: string;
  portal: PortalCode;
  role: RoleCode;
}[];
