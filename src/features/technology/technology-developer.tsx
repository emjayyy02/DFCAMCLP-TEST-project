import { Badge } from "@/components/ui/badge";
import { campusSeed, majorSeed, programSeed } from "@/server/db/seed/data";
import { portalCodes, portalDetails } from "@/lib/portals";
import {
  technologyArchitectureLayers,
  technologyDemoLimitations,
  technologyMilestones,
  technologyPortalDescriptions,
} from "./demo-data";
import { TechnologyCopyRouteMap } from "./technology-copy-route-map";
import { TechnologySection } from "./technology-shared";

function institutionRegistry() {
  return campusSeed.map((campus) => ({
    name: campus.name,
    programs: programSeed
      .filter((program) => program.campusId === campus.id)
      .map((program) => ({
        name: `${program.name} (${program.shortName})`,
        majors: majorSeed
          .filter((major) => major.programId === program.id)
          .map((major) => major.name),
      })),
  }));
}

export function TechnologyDeveloper({
  availableRoutes,
}: {
  availableRoutes: { label: string; path: string }[];
}) {
  const registry = institutionRegistry();

  return (
    <div className="space-y-6">
      <TechnologySection
        title="Project architecture"
        description="A compact view of how a request moves through the demo application."
      >
        <ol className="mt-4 divide-y divide-border border-y border-border">
          {technologyArchitectureLayers.map((layer, index) => (
            <li
              key={layer.name}
              className="grid gap-3 py-4 sm:grid-cols-[2.5rem_minmax(0,1fr)] sm:gap-4"
            >
              <span
                aria-hidden="true"
                className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-primary-soft text-sm font-semibold tabular-nums text-primary"
              >
                {index + 1}
              </span>
              <div>
                <h3 className="font-semibold">{layer.name}</h3>
                <p className="mt-1 leading-6 text-muted-foreground">
                  {layer.detail}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </TechnologySection>

      <TechnologySection
        title="Portal map"
        description="These are the project's authenticated feature families, not a DFCAMCLP organization chart."
      >
        <dl className="mt-4 grid gap-x-8 sm:grid-cols-2">
          {portalCodes.map((portal) => (
            <div
              key={portal}
              className="grid gap-1 border-b border-border py-4"
            >
              <dt className="font-semibold">{portalDetails[portal].label}</dt>
              <dd className="text-sm leading-6 text-muted-foreground">
                {technologyPortalDescriptions[portal]}
              </dd>
            </div>
          ))}
        </dl>
      </TechnologySection>

      <TechnologySection
        title="Institution data integrity"
        description="This read-only view is rendered from the project's canonical seed registry. BSBA majors stay nested under BSBA."
      >
        <div className="mt-4 grid gap-x-8 sm:grid-cols-2">
          {registry.map((campus) => (
            <section
              key={campus.name}
              aria-label={campus.name}
              className="border-y border-border py-4 first:border-b-0 sm:first:border-b"
            >
              <h3 className="font-semibold">{campus.name}</h3>
              <ul className="mt-3 list-disc space-y-3 pl-5 marker:text-foreground">
                {campus.programs.map((program) => (
                  <li key={program.name}>
                    <span className="leading-6">{program.name}</span>
                    {program.majors.length ? (
                      <ul className="mt-1 list-[circle] space-y-1 pl-5 text-sm leading-6 text-muted-foreground">
                        {program.majors.map((major) => (
                          <li key={major}>{major}</li>
                        ))}
                      </ul>
                    ) : null}
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
        <p className="mt-3 text-sm text-muted-foreground">
          One BSIS program is represented under IIT Campus.
        </p>
      </TechnologySection>

      <div className="grid min-w-0 gap-6 xl:grid-cols-2">
        <TechnologySection
          title="Frontend milestones"
          description="P3-M7 complete — the Technology foundation is delivered."
        >
          <ul className="mt-4 divide-y divide-border border-y border-border">
            {technologyMilestones.map((milestone) => (
              <li
                key={milestone.label}
                className="flex flex-wrap items-center justify-between gap-3 py-3"
              >
                <span className="font-medium">{milestone.label}</span>
                <Badge
                  tone={
                    milestone.status === "Complete"
                      ? "success"
                      : milestone.status === "In progress"
                        ? "info"
                        : "neutral"
                  }
                >
                  {milestone.status}
                </Badge>
              </li>
            ))}
          </ul>
        </TechnologySection>

        <TechnologySection
          title="Demo data and limits"
          description="This project demonstrates frontend workflows around a real authentication and access foundation."
        >
          <ul className="mt-4 list-disc space-y-2 pl-5 leading-6 text-muted-foreground marker:text-foreground">
            {technologyDemoLimitations.map((limitation) => (
              <li key={limitation}>{limitation}</li>
            ))}
          </ul>
          <p className="mt-4 border-t border-border pt-4 text-sm leading-6 text-muted-foreground">
            Unofficial concept project for learning and portfolio demonstration.
            It is not affiliated with or endorsed by DFCAMCLP.
          </p>
        </TechnologySection>
      </div>

      <div className="grid min-w-0 gap-6 xl:grid-cols-2">
        <TechnologySection
          title="Build and tooling references"
          description="These are project scripts for the repository; they do not run from this page."
        >
          <dl className="mt-4 divide-y divide-border border-y border-border">
            <div className="flex flex-wrap items-center justify-between gap-3 py-3">
              <dt>Lint</dt>
              <dd>
                <code>pnpm lint</code>
              </dd>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-3 py-3">
              <dt>Type check</dt>
              <dd>
                <code>pnpm typecheck</code>
              </dd>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-3 py-3">
              <dt>Production build</dt>
              <dd>
                <code>pnpm build</code>
              </dd>
            </div>
          </dl>
        </TechnologySection>

        <TechnologySection
          title="Read-only route utility"
          description="Copy the route map available to your current Developer role."
        >
          <ul className="mt-4 divide-y divide-border border-y border-border">
            {availableRoutes.map((route) => (
              <li
                key={route.path}
                className="flex flex-wrap items-center justify-between gap-2 py-3"
              >
                <span>{route.label}</span>
                <code className="break-all text-sm">{route.path}</code>
              </li>
            ))}
          </ul>
          <TechnologyCopyRouteMap routes={availableRoutes} />
        </TechnologySection>
      </div>
    </div>
  );
}
