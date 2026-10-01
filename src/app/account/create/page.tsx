import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { DemoNotice } from "@/components/ui/demo-notice";
import { PageIntro, SiteShell } from "@/components/public/site-shell";

export const metadata: Metadata = {
  title: "Account entry — DFCAMCLP Portal Concept",
};

export default function AccountEntryPage() {
  return (
    <SiteShell>
      <main id="main" className="public-container public-page identity-flow">
        <PageIntro title="Choose an account path">
          Applicant entry is self-service in this concept. Student and employee
          accounts remain institution-managed.
        </PageIntro>
        <DemoNotice
          label="Account entry preview"
          detail="No account, application, email, or portal access is created here. Use fictional details only."
        />

        <section
          className="applicant-entry-choice"
          aria-labelledby="new-applicant"
        >
          <div>
            <h2 id="new-applicant">Prospective applicant</h2>
            <p>
              An applicant entry begins an application journey. The preview
              collects only a name, email, and campus/program preference; the
              rest belongs in a later application step.
            </p>
          </div>
          <Button asChild>
            <Link href="/account/create/applicant">
              Preview applicant entry
            </Link>
          </Button>
        </section>

        <section
          className="managed-account-guidance"
          aria-labelledby="managed-accounts"
        >
          <div className="section-heading">
            <div>
              <h2 id="managed-accounts">Existing institutional accounts</h2>
              <p>
                These identities are linked or provisioned through institutional
                records and administrators.
              </p>
            </div>
          </div>
          <div className="identity-guidance-grid">
            <section aria-labelledby="student-account-guidance">
              <h3 id="student-account-guidance">Current student</h3>
              <p>
                Student portal access must be linked to an existing student
                record. Entering a Student ID here would not verify identity or
                create access.
              </p>
              <Link href="/login?portal=STUDENT" className="text-link">
                Continue to Student sign in
              </Link>
            </section>
            <section aria-labelledby="employee-account-guidance">
              <h3 id="employee-account-guidance">Faculty and staff</h3>
              <p>
                Employee accounts are provisioned by authorized administrators.
                This concept cannot request or grant institutional access.
              </p>
              <Link href="/account/recovery" className="text-link">
                View account assistance guidance
              </Link>
            </section>
          </div>
        </section>
      </main>
    </SiteShell>
  );
}
