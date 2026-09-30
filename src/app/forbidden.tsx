import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  ConceptDisclaimer,
  DevelopmentHeader,
  SkipLink,
} from "@/components/development-identity";

export default function Forbidden() {
  return (
    <div className="flex min-h-screen flex-col">
      <SkipLink />
      <DevelopmentHeader />
      <main id="main" className="neutral-state-page">
        <section
          className="neutral-state"
          aria-labelledby="access-denied-title"
        >
          <h1 id="access-denied-title" className="page-title">
            Access denied
          </h1>
          <p className="mt-4 max-w-[65ch] leading-7 text-muted-foreground">
            You don&apos;t have permission to access this area. Use an
            authorized portal or review the memberships listed on your account.
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Button asChild>
              <Link href="/account">View account access</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/login">Return to sign in</Link>
            </Button>
          </div>
        </section>
      </main>
      <ConceptDisclaimer />
    </div>
  );
}
