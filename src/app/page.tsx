import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="min-h-screen">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:m-4 focus:bg-background focus:p-3"
      >
        Skip to content
      </a>
      <header className="border-b border-border px-6 py-5 sm:px-10">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3">
          <span className="font-semibold">DFCAMCLP</span>
          <span className="text-sm text-muted-foreground">
            Development environment
          </span>
        </div>
      </header>
      <main
        id="main"
        className="mx-auto max-w-5xl px-6 py-16 sm:px-10 sm:py-24"
      >
        <h1 className="max-w-3xl text-3xl leading-tight font-semibold text-balance sm:text-5xl">
          Integrated Student &amp; Employee Portal
        </h1>
        <p className="mt-6 max-w-2xl leading-7 text-muted-foreground">
          The application foundation is being prepared. Student and employee
          services are not available in this development build.
        </p>
        <div className="mt-8">
          <div className="flex flex-wrap gap-3">
            <Button asChild>
              <a href="#foundation">View foundation status</a>
            </Button>
            <Button asChild variant="outline">
              <a href="/login">Test authentication</a>
            </Button>
          </div>
        </div>
        <section
          id="foundation"
          aria-labelledby="foundation-title"
          className="mt-16 border-t border-border pt-8"
        >
          <h2 id="foundation-title" className="text-xl font-semibold">
            Foundation status
          </h2>
          <dl className="mt-5 max-w-2xl divide-y divide-border">
            <div className="grid gap-2 py-4 sm:grid-cols-2">
              <dt>Application</dt>
              <dd>Bootstrap landing page available</dd>
            </div>
            <div className="grid gap-2 py-4 sm:grid-cols-2">
              <dt>Database</dt>
              <dd>Foundation migrated; not checked by this page</dd>
            </div>
            <div className="grid gap-2 py-4 sm:grid-cols-2">
              <dt>Portal access</dt>
              <dd>Not implemented yet</dd>
            </div>
          </dl>
        </section>
      </main>
      <footer className="mx-auto max-w-5xl px-6 pb-8 text-sm leading-6 text-muted-foreground sm:px-10">
        Development project only. This build does not represent an official
        college service.
      </footer>
    </div>
  );
}
