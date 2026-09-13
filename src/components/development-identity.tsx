import Link from "next/link";

export function DevelopmentHeader() {
  return (
    <header className="border-b border-border bg-surface px-5 py-5 sm:px-8">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-6 gap-y-2">
        <Link
          href="/"
          className="inline-flex min-h-11 flex-col items-start justify-center font-semibold tracking-wide text-primary-hover"
        >
          DFCAMCLP
          <span
            aria-hidden="true"
            className="mt-1 block h-1 w-8 rounded bg-accent"
          />
        </Link>
        <span className="text-sm text-muted-foreground">
          Development environment
        </span>
      </div>
    </header>
  );
}

export function ConceptDisclaimer() {
  return (
    <footer className="mx-auto w-full max-w-6xl px-5 py-7 text-sm leading-6 text-muted-foreground sm:px-8">
      <p className="max-w-3xl">
        Unofficial concept project for educational and portfolio purposes. Not
        affiliated with or endorsed by DFCAMCLP.
      </p>
    </footer>
  );
}

export function SkipLink() {
  return (
    <a
      href="#main"
      className="sr-only z-50 rounded-md bg-surface focus:not-sr-only focus:absolute focus:m-4 focus:p-3"
    >
      Skip to content
    </a>
  );
}
