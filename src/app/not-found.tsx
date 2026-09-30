import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  ConceptDisclaimer,
  DevelopmentHeader,
  SkipLink,
} from "@/components/development-identity";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col">
      <SkipLink />
      <DevelopmentHeader />
      <main id="main" className="neutral-state-page">
        <section className="neutral-state" aria-labelledby="missing-page-title">
          <p className="neutral-state-context">404</p>
          <h1 id="missing-page-title" className="page-title">
            Page not found
          </h1>
          <p className="mt-4 max-w-[65ch] text-muted-foreground">
            The page you’re looking for could not be found. Return to the
            homepage or sign in to continue.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild>
              <Link href="/">Home</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/login">Sign in</Link>
            </Button>
          </div>
        </section>
      </main>
      <ConceptDisclaimer />
    </div>
  );
}
