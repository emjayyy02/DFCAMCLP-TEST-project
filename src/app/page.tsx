import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ConceptDisclaimer,
  DevelopmentHeader,
  SkipLink,
} from "@/components/development-identity";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <SkipLink />
      <DevelopmentHeader />
      <main
        id="main"
        className="mx-auto w-full max-w-6xl flex-1 px-5 py-10 sm:px-8 sm:py-14"
      >
        <section
          aria-labelledby="page-title"
          className="grid gap-8 lg:grid-cols-[1fr_19rem] lg:items-center lg:gap-16"
        >
          <div>
            <h1
              id="page-title"
              className="max-w-xl text-3xl leading-tight font-semibold tracking-tight text-balance sm:text-4xl"
            >
              Integrated Student
              <br className="hidden sm:block" /> &amp; Employee Portal
            </h1>
            <p className="mt-5 max-w-xl leading-7 text-muted-foreground">
              The application foundation is being prepared. Student and employee
              services are not available in this development build.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Button asChild>
                <a href="#foundation">View foundation status</a>
              </Button>
              <Button asChild variant="outline">
                <Link href="/login">Test portal access</Link>
              </Button>
            </div>
          </div>
          <aside className="rounded-lg bg-primary-soft p-6 text-info-foreground">
            <h2 className="text-lg font-semibold">
              A foundation for campus services
            </h2>
            <p className="mt-3 text-sm leading-6">
              This build establishes the application, database and sign-in
              experience.
            </p>
            <p className="mt-5 rounded-md bg-accent-soft px-3 py-2 text-sm text-accent-foreground">
              For testing with fake development data only.
            </p>
          </aside>
        </section>
        <Card
          id="foundation"
          aria-labelledby="foundation-title"
          className="mt-10 sm:mt-12"
        >
          <h2 id="foundation-title" className="text-xl font-semibold">
            Foundation status
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Implementation notes for this development build.
          </p>
          <dl className="mt-5 divide-y divide-border">
            <div className="grid items-start gap-2 py-4 sm:grid-cols-[12rem_1fr] sm:gap-6">
              <dt className="font-medium">Application</dt>
              <dd>Bootstrap landing page available</dd>
            </div>
            <div className="grid items-start gap-2 py-4 sm:grid-cols-[12rem_1fr] sm:gap-6">
              <dt className="font-medium">Database</dt>
              <dd>Foundation migrated; not checked by this page</dd>
            </div>
            <div className="grid items-start gap-2 pt-4 sm:grid-cols-[12rem_1fr] sm:gap-6">
              <dt className="font-medium">Portal access</dt>
              <dd>
                <Badge tone="info">M4 foundation available</Badge>
              </dd>
            </div>
          </dl>
        </Card>
      </main>
      <ConceptDisclaimer />
    </div>
  );
}
