import type { Metadata } from "next";
import { SiteShell } from "@/components/public/site-shell";
import { PreviewHeading } from "@/features/identity/account-entry";
import { ApplicantEntryPreview } from "@/features/identity/applicant-entry";
export const metadata: Metadata = {
  title: "Applicant entry — DFCAMCLP Portal Concept",
};
export default function ApplicantEntryPage() {
  return (
    <SiteShell>
      <main id="main" className="public-page">
        <div className="public-container identity-flow preview-page">
          <PreviewHeading
            title="Applicant entry"
            inlineInfo
            intro="Begin your application preview."
          >
            <p>
              Use fictional details only. These generic fields demonstrate an
              application and are not official DFCAMCLP requirements or
              admissions policies. Required fields apply only to this demo flow.
              Freshman, Transferee, Returnee and DCAT 2027 are preview options,
              not verified admissions policies or a published cycle.
            </p>
            <p>
              No account is created and no submission service is connected.
              Details and photos stay in page memory, are never uploaded, and
              disappear on refresh or leaving this page. Choose PNG, JPEG, or
              WebP up to 2 MB.
            </p>
          </PreviewHeading>
          <ApplicantEntryPreview />
        </div>
      </main>
    </SiteShell>
  );
}
