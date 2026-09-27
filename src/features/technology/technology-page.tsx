import { notFound } from "next/navigation";
import type { PermissionCode } from "@/server/access-control/seed-data";
import { portalRoutes } from "@/server/access-control/navigation";
import { db } from "@/server/db";
import { getTechnologyDemoAccounts } from "@/server/db/queries/technology";
import { TechnologyAccountsDirectory } from "./technology-accounts";
import { TechnologyDashboard } from "./technology-dashboard";
import { TechnologyDeveloper } from "./technology-developer";
import { TechnologySecurity } from "./technology-security";
import { TechnologySystem } from "./technology-system";

export async function TechnologyPage({
  section,
  permissions,
}: {
  section: string;
  permissions: readonly PermissionCode[];
}) {
  const canViewAccounts = permissions.includes("technology.accounts.view");
  const canViewSecurity = permissions.includes("technology.security.view");

  if (section === "dashboard") {
    const accounts = canViewAccounts ? await getTechnologyDemoAccounts(db) : [];

    return (
      <TechnologyDashboard
        accounts={accounts}
        showAccounts={canViewAccounts}
        showSecurity={canViewSecurity}
      />
    );
  }

  if (section === "accounts" && canViewAccounts) {
    return (
      <TechnologyAccountsDirectory
        accounts={await getTechnologyDemoAccounts(db)}
      />
    );
  }

  if (section === "security" && canViewSecurity) {
    return <TechnologySecurity />;
  }

  if (section === "system") {
    const environment =
      process.env.NODE_ENV === "production"
        ? "Production build"
        : process.env.NODE_ENV === "test"
          ? "Test"
          : "Development";
    return <TechnologySystem environment={environment} />;
  }

  if (
    section === "developer" &&
    permissions.includes("technology.developer.view")
  ) {
    const availableRoutes = portalRoutes.TECHNOLOGY.filter((route) =>
      permissions.includes(route.permission),
    ).map(({ label, path }) => ({ label, path }));

    return <TechnologyDeveloper availableRoutes={availableRoutes} />;
  }

  notFound();
}
