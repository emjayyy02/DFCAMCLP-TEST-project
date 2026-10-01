import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { PageHeader } from "@/components/portal/page-header";
import {
  ConceptDisclaimer,
  DevelopmentHeader,
  SkipLink,
} from "@/components/development-identity";
import { AccountProfile } from "@/features/identity/account-profile";
import {
  getCurrentAccessContext,
  safeActiveMemberships,
} from "@/server/access-control/current";

export const metadata: Metadata = {
  title: "Account profile — DFCAMCLP Portal",
};

export default async function AccountPage() {
  const current = await getCurrentAccessContext();
  if (!current) redirect("/login");
  const memberships = safeActiveMemberships(current);
  return (
    <div className="flex min-h-screen flex-col">
      <SkipLink />
      <DevelopmentHeader />
      <main id="main" className="account-profile-page">
        <PageHeader
          title="Account profile"
          description="Your sign-in identity, portal access, and temporary personal presentation."
        />
        <AccountProfile
          key={current.user.id}
          user={{
            id: current.user.id,
            name: current.user.name,
            email: current.user.email,
            status: current.identity.status,
          }}
          memberships={memberships}
        />
      </main>
      <ConceptDisclaimer />
    </div>
  );
}
