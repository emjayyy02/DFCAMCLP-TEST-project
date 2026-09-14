import type { Metadata } from "next";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  ConceptDisclaimer,
  DevelopmentHeader,
  SkipLink,
} from "@/components/development-identity";
import { redirect } from "next/navigation";
import { SignOutButton } from "@/features/identity/sign-out-button";
import {
  getCurrentAccessContext,
  safeActiveMemberships,
} from "@/server/access-control/current";

export const metadata: Metadata = { title: "Account — DFCAMCLP Portal" };

export default async function AccountPage() {
  const current = await getCurrentAccessContext();
  if (!current) redirect("/login");
  const memberships = safeActiveMemberships(current);

  return (
    <div className="flex min-h-screen flex-col">
      <SkipLink />
      <DevelopmentHeader />
      <main
        id="main"
        className="mx-auto w-full max-w-3xl flex-1 px-5 py-10 sm:px-8 sm:py-12"
      >
        <header className="border-b border-border pb-7">
          <h1 className="text-3xl font-semibold sm:text-4xl">Account access</h1>
          <p className="mt-4 max-w-2xl leading-7 text-muted-foreground">
            Review the active portal memberships and role labels assigned to
            this fake development account.
          </p>
        </header>

        <Card aria-labelledby="identity-title" className="my-8">
          <h2 id="identity-title" className="text-xl font-semibold">
            Account details
          </h2>
          <dl className="mt-5 divide-y divide-border border-y border-border">
            <div className="grid gap-1 py-4 sm:grid-cols-[11rem_1fr] sm:gap-4">
              <dt className="text-sm font-semibold text-muted-foreground">
                Name
              </dt>
              <dd className="min-w-0 break-words">{current.user.name}</dd>
            </div>
            <div className="grid gap-1 py-4 sm:grid-cols-[11rem_1fr] sm:gap-4">
              <dt className="text-sm font-semibold text-muted-foreground">
                Email
              </dt>
              <dd className="min-w-0 break-words">{current.user.email}</dd>
            </div>
            <div className="grid gap-1 py-4 sm:grid-cols-[11rem_1fr] sm:gap-4">
              <dt className="text-sm font-semibold text-muted-foreground">
                Account status
              </dt>
              <dd>
                <Badge tone="success">Active</Badge>
              </dd>
            </div>
            <div className="grid gap-1 py-4 sm:grid-cols-[11rem_1fr] sm:gap-4">
              <dt className="text-sm font-semibold text-muted-foreground">
                Session
              </dt>
              <dd className="text-success-foreground">
                Present and server-verified
              </dd>
            </div>
            <div className="grid gap-1 py-4 sm:grid-cols-[11rem_1fr] sm:gap-4">
              <dt className="text-sm font-semibold text-muted-foreground">
                Active portals
              </dt>
              <dd>{memberships.length}</dd>
            </div>
          </dl>
        </Card>

        <section aria-labelledby="memberships-title" className="my-8">
          <h2 id="memberships-title" className="text-xl font-semibold">
            Portal memberships
          </h2>
          {memberships.length ? (
            <ul className="mt-4 divide-y divide-border border-y border-border">
              {memberships.map((membership) => (
                <li
                  key={membership.portal}
                  className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="font-semibold">{membership.label}</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {membership.roleLabels.join(", ")}
                    </p>
                  </div>
                  <Link
                    href={membership.path}
                    className="inline-flex min-h-11 items-center font-semibold text-primary underline underline-offset-4"
                  >
                    Open {membership.label}
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 rounded-md bg-muted px-4 py-3 text-sm leading-6">
              No active portal access is assigned.
            </p>
          )}
        </section>

        <SignOutButton />
      </main>
      <ConceptDisclaimer />
    </div>
  );
}
