import Link from "next/link";
import Image from "next/image";
import { ProjectInformationLinks } from "@/features/disclosure/demo-disclosure-provider";

export function DevelopmentHeader() {
  return (
    <header className="institution-masthead px-4 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-16 max-w-[80rem] flex-wrap items-center justify-between gap-x-6 gap-y-2 py-2">
        <Link
          href="/"
          className="inline-flex min-h-11 items-center gap-2 font-semibold tracking-wide text-primary-hover"
        >
          <Image
            src="/images/dfcamclp-seal.webp"
            alt=""
            width={40}
            height={40}
            unoptimized
            className="h-10 w-10 object-contain"
          />
          <span className="institution-wordmark">DFCAMCLP</span>
        </Link>
        <span className="text-sm text-muted-foreground">Independent demo</span>
      </div>
    </header>
  );
}

export function ConceptDisclaimer() {
  return (
    <footer className="mx-auto w-full max-w-6xl px-5 py-7 text-sm leading-6 text-muted-foreground sm:px-8">
      <ProjectInformationLinks />
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
