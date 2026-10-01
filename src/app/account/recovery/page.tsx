import type { Metadata } from "next";
import Link from "next/link";
import { ApplicantRecoveryPreview } from "@/features/identity/account-entry";
import { PageIntro, SiteShell } from "@/components/public/site-shell";
import { DemoNotice } from "@/components/ui/demo-notice";

export const metadata: Metadata = {
  title: "Account recovery — DFCAMCLP Portal Concept",
};

export default function AccountRecoveryPage() {
  return (
    <SiteShell>
      <main id="main" className="public-container public-page identity-flow">
        <PageIntro title="Account recovery and assistance">
          Recovery guidance depends on the type of account. This concept does
          not send email or create support tickets.
        </PageIntro>
        <DemoNotice
          label="Recovery preview"
          detail="Use fictional details only. No account lookup, email delivery, or ticket service is connected."
        />

        <ApplicantRecoveryPreview />

        <section
          className="managed-recovery"
          aria-labelledby="managed-recovery-title"
        >
          <div>
            <h2 id="managed-recovery-title">Student and employee accounts</h2>
            <p>
              These accounts may need help from an authorized institutional
              administrator. Exact identity checks and support ownership are not
              defined here. No ticket was or can be submitted through this
              concept.
            </p>
          </div>
          <div className="managed-recovery-actions">
            <Link href="/login?portal=STUDENT" className="text-link">
              Student sign in
            </Link>
            <Link href="/login" className="text-link">
              Return to portal sign in
            </Link>
          </div>
        </section>
      </main>
    </SiteShell>
  );
}
