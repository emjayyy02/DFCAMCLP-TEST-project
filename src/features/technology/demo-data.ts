import type { PortalCode } from "@/lib/portals";

export type TechnologyAccountStatus = "ACTIVE" | "DISABLED";
export type TechnologyMembershipStatus = "ACTIVE" | "INACTIVE";

export type TechnologyAccountRow = {
  name: string;
  email: string;
  accountStatus: TechnologyAccountStatus;
  portal: PortalCode | null;
  membershipActive: boolean | null;
  roleLabel: string | null;
};

export type TechnologyPortalMembership = {
  portal: PortalCode;
  status: TechnologyMembershipStatus;
  roles: string[];
};

export type TechnologyAccount = {
  name: string;
  email: string;
  status: TechnologyAccountStatus;
  memberships: TechnologyPortalMembership[];
};

export type TechnologyAccountFilters = {
  query: string;
  status: "ALL" | TechnologyAccountStatus;
  portal: "ALL" | PortalCode;
};

export function groupTechnologyAccountRows(
  rows: readonly TechnologyAccountRow[],
): TechnologyAccount[] {
  const accounts = new Map<string, TechnologyAccount>();

  for (const row of rows) {
    const account = accounts.get(row.email) ?? {
      name: row.name,
      email: row.email,
      status: row.accountStatus,
      memberships: [],
    };

    if (row.portal) {
      let membership = account.memberships.find(
        (candidate) => candidate.portal === row.portal,
      );

      if (!membership) {
        membership = {
          portal: row.portal,
          status: row.membershipActive ? "ACTIVE" : "INACTIVE",
          roles: [],
        };
        account.memberships.push(membership);
      }

      if (row.roleLabel && !membership.roles.includes(row.roleLabel)) {
        membership.roles.push(row.roleLabel);
      }
    }

    accounts.set(row.email, account);
  }

  return [...accounts.values()]
    .map((account) => ({
      ...account,
      memberships: account.memberships.toSorted((a, b) =>
        a.portal.localeCompare(b.portal),
      ),
    }))
    .toSorted((a, b) => a.email.localeCompare(b.email));
}

export function filterTechnologyAccounts(
  accounts: readonly TechnologyAccount[],
  filters: TechnologyAccountFilters,
) {
  const query = filters.query.trim().toLocaleLowerCase();

  return accounts.filter((account) => {
    const matchesQuery =
      !query ||
      account.name.toLocaleLowerCase().includes(query) ||
      account.email.toLocaleLowerCase().includes(query);
    const matchesStatus =
      filters.status === "ALL" || account.status === filters.status;
    const matchesPortal =
      filters.portal === "ALL" ||
      account.memberships.some(
        (membership) => membership.portal === filters.portal,
      );

    return matchesQuery && matchesStatus && matchesPortal;
  });
}

export function summarizeTechnologyAccounts(
  accounts: readonly TechnologyAccount[],
) {
  return {
    total: accounts.length,
    active: accounts.filter((account) => account.status === "ACTIVE").length,
    disabled: accounts.filter((account) => account.status === "DISABLED")
      .length,
    memberships: accounts.reduce(
      (total, account) => total + account.memberships.length,
      0,
    ),
  };
}

export const technologyAccessSteps = [
  {
    label: "Authentication",
    detail: "A server-verified account session",
  },
  {
    label: "Portal membership",
    detail: "An active membership for this portal",
  },
  {
    label: "Role",
    detail: "A portal-scoped role assignment",
  },
  {
    label: "Permission",
    detail: "A permission for the requested page",
  },
  {
    label: "Server route guard",
    detail: "The route checks access before rendering",
  },
] as const;

export const technologySystemComponents = [
  {
    name: "Web application",
    value: "Next.js App Router, React, TypeScript, and Tailwind CSS",
    status: "Foundation implemented",
  },
  {
    name: "Database foundation",
    value: "PostgreSQL with Drizzle ORM and versioned migrations",
    status: "Configured for development",
  },
  {
    name: "Authentication",
    value: "Better Auth with server-resolved database sessions",
    status: "Foundation implemented",
  },
  {
    name: "Access control",
    value: "Portal memberships, scoped roles, permissions, and route guards",
    status: "Enforced on the server",
  },
] as const;

export const technologySecurityScenarios = [
  {
    scenario: "A signed-in account requests a portal without membership",
    response: "The server returns the shared Access denied experience.",
  },
  {
    scenario: "An application account is marked DISABLED",
    response: "Sign-in and protected session checks reject the account.",
  },
  {
    scenario: "A route needs a permission the role does not have",
    response: "The server blocks the direct URL request before rendering.",
  },
] as const;

export const technologyPortalDescriptions: Record<PortalCode, string> = {
  APPLICANT: "Application, requirements, DCAT, and enrollment progress.",
  STUDENT: "Academic information, enrollment, requests, and notices.",
  ACADEMIC: "Teaching, class, attendance, and grade experiences.",
  RECORDS: "Admissions, student records, enrollment, and documents.",
  OPERATIONS: "Student services, employees, facilities, and administration.",
  TECHNOLOGY: "Account access, system foundations, and developer references.",
};

export const technologyArchitectureLayers = [
  {
    name: "Next.js App Router",
    detail: "Server-rendered application routes and shared layouts.",
  },
  {
    name: "Authentication",
    detail:
      "Better Auth resolves the signed-in user and session on the server.",
  },
  {
    name: "Access control",
    detail: "Active membership, portal role, and route permission are checked.",
  },
  {
    name: "Shared portal shell",
    detail: "One responsive shell derives navigation from allowed permissions.",
  },
  {
    name: "Six portal families",
    detail:
      "Applicant, Student, Academic, Records, Operations, and Technology.",
  },
  {
    name: "PostgreSQL and Drizzle",
    detail: "The database schema and migration foundation support the demo.",
  },
] as const;

export const technologyMilestones = [
  { label: "Public", status: "Complete" },
  { label: "Applicant", status: "Complete" },
  { label: "Student", status: "Complete" },
  { label: "Academic", status: "Complete" },
  { label: "Admissions & Records", status: "Complete" },
  { label: "Operations", status: "Complete" },
  { label: "Technology", status: "Complete" },
] as const;

export const technologyDemoLimitations = [
  "All displayed people and account email addresses are fictional demo data.",
  "Most Phase 3 interactions use in-memory demo state and may reset on refresh.",
  "Real backend workflows, persistent audit history, and live system monitoring are deferred.",
] as const;
