import { Badge } from "@/components/ui/badge";
import { technologySecurityScenarios } from "./demo-data";
import { TechnologyAccessPath, TechnologySection } from "./technology-shared";

export function TechnologySecurity() {
  return (
    <div className="space-y-6">
      <div className="grid min-w-0 gap-6 xl:grid-cols-2">
        <TechnologySection
          title="Authentication"
          variant="plain"
          description="Better Auth handles sign-in; protected routes resolve sessions on the server."
        >
          <dl className="mt-4 divide-y divide-border border-y border-border">
            <div className="grid gap-1 py-3 sm:grid-cols-[10rem_minmax(0,1fr)] sm:gap-4">
              <dt className="font-semibold">Sign-in</dt>
              <dd className="leading-6 text-muted-foreground">
                Email and password verification is handled by Better Auth.
              </dd>
            </div>
            <div className="grid gap-1 py-3 sm:grid-cols-[10rem_minmax(0,1fr)] sm:gap-4">
              <dt className="font-semibold">Application account</dt>
              <dd className="leading-6 text-muted-foreground">
                A protected route requires an active application account linked
                to a project Person.
              </dd>
            </div>
            <div className="grid gap-1 py-3 sm:grid-cols-[10rem_minmax(0,1fr)] sm:gap-4">
              <dt className="font-semibold">Session</dt>
              <dd className="leading-6 text-muted-foreground">
                Database-backed sessions expire after seven days and refresh at
                most daily. Session IDs and cookies are not shown.
              </dd>
            </div>
            <div className="grid gap-1 py-3 sm:grid-cols-[10rem_minmax(0,1fr)] sm:gap-4">
              <dt className="font-semibold">Account state</dt>
              <dd className="flex flex-wrap items-center gap-2 leading-6 text-muted-foreground">
                <Badge tone="success">ACTIVE</Badge>
                <span>allows eligible sign-in and route checks;</span>
                <Badge tone="neutral">DISABLED</Badge>
                <span>is rejected by those checks.</span>
              </dd>
            </div>
          </dl>
        </TechnologySection>

        <TechnologySection
          title="Authorization"
          variant="plain"
          description="Deny by default: the selector sets portal intent, and each protected route must pass the full server-side sequence."
        >
          <TechnologyAccessPath />
        </TechnologySection>
      </div>

      <TechnologySection
        title="Sample access scenarios"
        variant="plain"
        description="Fictional examples of route responses, not logs or recorded events."
      >
        <ul className="mt-4 divide-y divide-border border-y border-border">
          {technologySecurityScenarios.map((item) => (
            <li
              key={item.scenario}
              className="grid gap-1 py-4 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] md:gap-6"
            >
              <h3 className="font-semibold">{item.scenario}</h3>
              <p className="leading-6 text-muted-foreground">{item.response}</p>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-sm text-muted-foreground">
          Demo / sample security scenarios · No timestamps or IP addresses
        </p>
      </TechnologySection>

      <TechnologySection
        title="Known limitations"
        variant="plain"
        description="Current limits of the implemented security foundation."
      >
        <ul className="mt-4 list-disc space-y-2 pl-5 leading-6 text-muted-foreground marker:text-foreground">
          <li>Security scenarios are not persisted as an audit history.</li>
          <li>
            There is no external SIEM, alert pipeline, or live monitoring feed.
          </li>
          <li>
            MFA and production account-recovery delivery are not implemented.
          </li>
        </ul>
      </TechnologySection>
    </div>
  );
}
