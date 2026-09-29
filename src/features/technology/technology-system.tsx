import { Badge } from "@/components/ui/badge";
import { technologySystemComponents } from "./demo-data";
import { TechnologySection } from "./technology-shared";

export function TechnologySystem({ environment }: { environment: string }) {
  return (
    <div className="space-y-6">
      <TechnologySection
        title="Application foundations"
        description="Stack and architecture details derived from the project implementation. Status describes the foundation, not live service health."
      >
        <dl className="mt-4 divide-y divide-border border-y border-border">
          {technologySystemComponents.map((item) => (
            <div
              key={item.name}
              className="grid gap-2 py-4 md:grid-cols-[12rem_minmax(0,1fr)_auto] md:items-center md:gap-4"
            >
              <dt className="font-semibold">{item.name}</dt>
              <dd className="break-words leading-6 text-muted-foreground">
                {item.value}
              </dd>
              <dd>
                <Badge
                  tone={
                    item.status === "Enforced on the server"
                      ? "success"
                      : "info"
                  }
                >
                  {item.status}
                </Badge>
              </dd>
            </div>
          ))}
        </dl>
      </TechnologySection>

      <TechnologySection
        title="Environment"
        description="This value identifies the current application runtime mode only. No host paths or environment-variable values are displayed."
      >
        <dl className="mt-4 grid gap-4 border-y border-border py-4 sm:grid-cols-[12rem_minmax(0,1fr)]">
          <dt className="font-semibold">Runtime mode</dt>
          <dd className="flex flex-wrap items-center gap-2">
            <Badge tone="neutral">{environment}</Badge>
            <span className="text-sm leading-6 text-muted-foreground">
              Demo environment · No live health checks
            </span>
          </dd>
        </dl>
      </TechnologySection>

      <p className="max-w-[75ch] text-sm leading-6 text-muted-foreground">
        This page does not report uptime, latency, resource usage, deployment
        state, or database connectivity. No secrets, connection details,
        credentials, or session data are displayed.
      </p>
    </div>
  );
}
