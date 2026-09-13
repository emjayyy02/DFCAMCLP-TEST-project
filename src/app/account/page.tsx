import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { SignOutButton } from "@/features/identity/sign-out-button";
import { getCurrentApplicationSession } from "@/server/auth/session";

export const metadata: Metadata = { title: "Account — DFCAMCLP Portal" };

export default async function AccountPage() {
  const current = await getCurrentApplicationSession(await headers());
  if (!current) redirect("/login");

  return (
    <main className="mx-auto min-h-screen max-w-3xl px-5 py-12 sm:px-8 sm:py-20">
      <header className="border-b border-border pb-7">
        <p className="text-sm font-semibold tracking-[0.12em] text-primary uppercase">
          Authenticated account
        </p>
        <h1 className="mt-3 text-3xl font-semibold sm:text-4xl">
          Identity confirmed
        </h1>
        <p className="mt-4 max-w-2xl leading-7 text-muted-foreground">
          This neutral page proves authentication only. No portal membership,
          role, or permission has been evaluated.
        </p>
      </header>

      <section aria-labelledby="identity-title" className="py-8">
        <h2 id="identity-title" className="text-xl font-semibold">
          Account details
        </h2>
        <dl className="mt-5 divide-y divide-border border-y border-border">
          <div className="grid gap-1 py-4 sm:grid-cols-[11rem_1fr] sm:gap-4">
            <dt className="text-sm font-semibold text-muted-foreground">
              Name
            </dt>
            <dd>{current.user.name}</dd>
          </div>
          <div className="grid gap-1 py-4 sm:grid-cols-[11rem_1fr] sm:gap-4">
            <dt className="text-sm font-semibold text-muted-foreground">
              Email
            </dt>
            <dd className="break-words">{current.user.email}</dd>
          </div>
          <div className="grid gap-1 py-4 sm:grid-cols-[11rem_1fr] sm:gap-4">
            <dt className="text-sm font-semibold text-muted-foreground">
              Account status
            </dt>
            <dd>Active</dd>
          </div>
          <div className="grid gap-1 py-4 sm:grid-cols-[11rem_1fr] sm:gap-4">
            <dt className="text-sm font-semibold text-muted-foreground">
              Session
            </dt>
            <dd>Present and server-verified</dd>
          </div>
          <div className="grid gap-1 py-4 sm:grid-cols-[11rem_1fr] sm:gap-4">
            <dt className="text-sm font-semibold text-muted-foreground">
              Portal access
            </dt>
            <dd>Not evaluated in P2-M3</dd>
          </div>
        </dl>
      </section>

      <SignOutButton />
    </main>
  );
}
