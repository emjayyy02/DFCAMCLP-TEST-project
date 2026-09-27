import type { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { technologyAccessSteps } from "./demo-data";

export function TechnologySection({
  title,
  description,
  children,
  className = "",
}: {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      aria-label={title}
      className={`min-w-0 rounded-lg border border-border bg-white p-5 sm:p-6 ${className}`}
    >
      <h2 className="text-lg font-semibold sm:text-xl">{title}</h2>
      {description ? (
        <p className="mt-2 max-w-[70ch] leading-6 text-muted-foreground">
          {description}
        </p>
      ) : null}
      {children}
    </section>
  );
}

export function TechnologyAccessPath() {
  return (
    <ol className="mt-5 grid gap-x-4 gap-y-5 sm:grid-cols-2 xl:grid-cols-5">
      {technologyAccessSteps.map((step, index) => (
        <li key={step.label} className="min-w-0 border-t border-border pt-3">
          <span className="inline-flex h-8 min-w-8 items-center justify-center rounded-md bg-primary-soft px-2 text-sm font-semibold tabular-nums text-primary">
            {index + 1}
          </span>
          <h3 className="mt-3 font-semibold">{step.label}</h3>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            {step.detail}
          </p>
        </li>
      ))}
    </ol>
  );
}

export function FoundationStatus({ status }: { status: string }) {
  return (
    <Badge tone={status === "Enforced on the server" ? "success" : "info"}>
      {status}
    </Badge>
  );
}
