import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import type { TechnologyAccount } from "./demo-data";
import {
  summarizeTechnologyAccounts,
  technologySecurityScenarios,
  technologySystemComponents,
} from "./demo-data";
import {
  FoundationStatus,
  TechnologyAccessPath,
  TechnologySection,
} from "./technology-shared";

export function TechnologyDashboard({
  accounts,
  showAccounts,
  showSecurity,
}: {
  accounts: TechnologyAccount[];
  showAccounts: boolean;
  showSecurity: boolean;
}) {
  const accountSummary = summarizeTechnologyAccounts(accounts);

  return (
    <div className="mt-8 space-y-6">
      <div className="grid min-w-0 gap-6 xl:grid-cols-[minmax(0,1.4fr)_minmax(18rem,0.8fr)]">
        <TechnologySection
          title="How access is checked"
          description="Each protected Technology page checks the signed-in account and its effective portal permission on the server."
        >
          <TechnologyAccessPath />
        </TechnologySection>

        {showAccounts ? (
          <TechnologySection
            title="Demo account summary"
            description="Counts are derived from fictional development accounts and their current seeded memberships."
          >
            <dl className="mt-5 grid grid-cols-2 gap-x-4 gap-y-5 border-y border-border py-4 sm:grid-cols-4 xl:grid-cols-2">
              <div>
                <dt className="text-sm text-muted-foreground">
                  Total accounts
                </dt>
                <dd className="mt-1 text-2xl font-semibold tabular-nums">
                  {accountSummary.total}
                </dd>
              </div>
              <div>
                <dt className="text-sm text-muted-foreground">ACTIVE</dt>
                <dd className="mt-1 text-2xl font-semibold tabular-nums">
                  {accountSummary.active}
                </dd>
              </div>
              <div>
                <dt className="text-sm text-muted-foreground">DISABLED</dt>
                <dd className="mt-1 text-2xl font-semibold tabular-nums">
                  {accountSummary.disabled}
                </dd>
              </div>
              <div>
                <dt className="text-sm text-muted-foreground">
                  Portal memberships
                </dt>
                <dd className="mt-1 text-2xl font-semibold tabular-nums">
                  {accountSummary.memberships}
                </dd>
              </div>
            </dl>
            <Link
              className="mt-5 inline-flex min-h-11 items-center font-semibold text-primary underline underline-offset-4 hover:text-primary-hover"
              href="/technology/accounts"
            >
              Review demo accounts
            </Link>
          </TechnologySection>
        ) : (
          <TechnologySection
            title="System foundation"
            description="A project-level view of the application stack and access architecture."
          >
            <dl className="mt-4 divide-y divide-border border-y border-border">
              {technologySystemComponents.slice(0, 3).map((item) => (
                <div key={item.name} className="grid gap-1 py-3">
                  <dt className="font-semibold">{item.name}</dt>
                  <dd className="text-sm leading-6 text-muted-foreground">
                    {item.value}
                  </dd>
                </div>
              ))}
            </dl>
            <Link
              className="mt-4 inline-flex min-h-11 items-center font-semibold text-primary underline underline-offset-4 hover:text-primary-hover"
              href="/technology/system"
            >
              View system information
            </Link>
          </TechnologySection>
        )}
      </div>

      <TechnologySection
        title="Implemented foundations"
        description="These labels describe project architecture, not a live service health check."
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
                <FoundationStatus status={item.status} />
              </dd>
            </div>
          ))}
        </dl>
        <Link
          className="mt-4 inline-flex min-h-11 items-center font-semibold text-primary underline underline-offset-4 hover:text-primary-hover"
          href="/technology/system"
        >
          Read the system overview
        </Link>
      </TechnologySection>

      {showSecurity ? (
        <div className="grid min-w-0 gap-6 xl:grid-cols-2">
          <TechnologySection
            title="Security posture"
            description="A concise summary of implemented access protections. No external certification is claimed."
          >
            <ul className="mt-4 divide-y divide-border border-y border-border">
              <li className="flex flex-wrap items-center justify-between gap-3 py-3">
                <span>Authentication and session lookup</span>
                <Badge tone="success">Implemented</Badge>
              </li>
              <li className="flex flex-wrap items-center justify-between gap-3 py-3">
                <span>Portal and page authorization</span>
                <Badge tone="success">Server enforced</Badge>
              </li>
              <li className="flex flex-wrap items-center justify-between gap-3 py-3">
                <span>Disabled account checks</span>
                <Badge tone="success">Implemented</Badge>
              </li>
            </ul>
            <Link
              className="mt-4 inline-flex min-h-11 items-center font-semibold text-primary underline underline-offset-4 hover:text-primary-hover"
              href="/technology/security"
            >
              Review the security model
            </Link>
          </TechnologySection>

          <TechnologySection
            title="Sample security scenarios"
            description="Illustrative outcomes only. This is not recorded activity or audit history."
          >
            <ul className="mt-4 divide-y divide-border border-y border-border">
              {technologySecurityScenarios.slice(0, 2).map((item) => (
                <li key={item.scenario} className="py-3">
                  <p className="font-medium">{item.scenario}</p>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">
                    {item.response}
                  </p>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-sm text-muted-foreground">
              Demo scenarios · Not recorded events
            </p>
          </TechnologySection>
        </div>
      ) : null}
    </div>
  );
}
