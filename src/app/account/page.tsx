import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  ConceptDisclaimer,
  DevelopmentHeader,
  SkipLink,
} from "@/components/development-identity";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { SignOutButton } from "@/features/identity/sign-out-button";
import { getCurrentApplicationSession } from "@/server/auth/session";

export const metadata: Metadata = { title: "Account — DFCAMCLP Portal" };

export default async function AccountPage() {
  const current = await getCurrentApplicationSession(await headers());
  if (!current) redirect("/login");

  return (
    <div className="flex min-h-screen flex-col">
      <SkipLink />
      <DevelopmentHeader />
      <main
        id="main"
        className="mx-auto w-full max-w-3xl flex-1 px-5 py-10 sm:px-8 sm:py-12"
      >
        <header className="border-b border-border pb-7">
          <p className="text-sm font-semibold text-primary-hover">
            Authenticated account
          </p>
          <h1 className="mt-3 text-3xl font-semibold sm:text-4xl">
            Identity confirmed
          </h1>
          <p className="mt-4 max-w-2xl leading-7 text-muted-foreground">
            This development page proves authentication only. No portal
            membership, role, or permission has been evaluated.
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
                Portal access
              </dt>
              <dd>Not evaluated in P2-M3</dd>
            </div>
          </dl>
        </Card>

        <SignOutButton />
      </main>
      <ConceptDisclaimer />
    </div>
  );
}
