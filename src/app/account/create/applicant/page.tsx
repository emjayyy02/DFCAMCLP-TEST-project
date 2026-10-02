import type { Metadata } from "next";
import { DemoNotice } from "@/components/ui/demo-notice";
import { PageIntro, SiteShell } from "@/components/public/site-shell";
import { ApplicantEntryPreview } from "@/features/identity/account-entry";

export const metadata: Metadata = {
  title: "Applicant entry preview — DFCAMCLP Portal Concept",
};

export default function ApplicantEntryPage() {
  return (
    <SiteShell>
      <main id="main" className="public-page">
        <div className="public-container identity-flow">
          <PageIntro title="Applicant entry preview">
            Review the first information a connected application might ask for.
          </PageIntro>
          <DemoNotice
            label="Entry preview"
            detail="Use fictional details. Information stays in this page only and is lost when you leave or refresh. No password is collected."
          />
          <ApplicantEntryPreview />
        </div>
      </main>
    </SiteShell>
  );
}
