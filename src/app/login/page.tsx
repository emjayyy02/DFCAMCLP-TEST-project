import type { Metadata } from "next";
import Link from "next/link";
import { LoginForm } from "@/features/identity/login-form";
import { Card } from "@/components/ui/card";
import {
  ConceptDisclaimer,
  DevelopmentHeader,
  SkipLink,
} from "@/components/development-identity";

export const metadata: Metadata = { title: "Sign in — DFCAMCLP Portal" };

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SkipLink />
      <DevelopmentHeader />
      <main
        id="main"
        className="mx-auto grid w-full max-w-5xl flex-1 items-start gap-7 px-5 py-8 sm:px-8 sm:py-12 md:grid-cols-[0.8fr_1.2fr] md:gap-10"
      >
        <section
          aria-labelledby="portal-context"
          className="rounded-lg bg-primary-soft p-5 text-info-foreground sm:p-8 md:mt-8"
        >
          <h2
            id="portal-context"
            className="text-xl leading-snug font-semibold tracking-tight md:text-2xl"
          >
            Integrated Student &amp; Employee Portal
          </h2>
          <p className="mt-4 hidden leading-7 md:block">
            A shared sign-in experience for students and employees.
          </p>
          <p className="mt-3 rounded-md bg-accent-soft px-3 py-2 text-sm leading-6 text-accent-foreground md:mt-6 md:px-4 md:py-3">
            Development build. Use fake accounts only.
          </p>
        </section>
        <Card aria-labelledby="login-title">
          <h1
            id="login-title"
            className="text-3xl font-semibold tracking-tight"
          >
            Portal sign in
          </h1>
          <p className="mt-3 leading-7 text-muted-foreground">
            Use a development account to verify secure authentication.
          </p>
          <LoginForm />
          <div className="mt-7 border-t border-border pt-5 text-sm leading-6 text-muted-foreground">
            <p>
              Account activation and recovery are not available in this build.
            </p>
            <Link
              href="/"
              className="mt-2 inline-flex min-h-11 items-center font-semibold text-primary underline underline-offset-4"
            >
              Return to development home
            </Link>
          </div>
        </Card>
      </main>
      <ConceptDisclaimer />
    </div>
  );
}
