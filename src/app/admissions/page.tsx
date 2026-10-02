import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SiteShell, PageIntro } from "@/components/public/site-shell";
import { AdmissionsJourney } from "@/components/public/institution-content";
export const metadata: Metadata = {
  title: "Admissions — DFCAMCLP Portal Concept",
};
export default function AdmissionsPage() {
  return (
    <SiteShell>
      <main id="main" className="public-page">
        <div className="public-container">
          <PageIntro title="The admissions journey">
            A concise guide to the known application, physical document,
            examination, result, and enrollment stages.
          </PageIntro>
          <section
            aria-labelledby="before-you-begin"
            className="admissions-context"
          >
            <h2 id="before-you-begin">Before you begin</h2>
            <dl>
              <div>
                <dt>College context</dt>
                <dd>
                  The city has described tuition-free college education for
                  qualified Las Piñas students. This concept does not establish
                  current eligibility rules.
                </dd>
              </div>
              <div>
                <dt>Document submission</dt>
                <dd>
                  Documents are submitted in person for staff verification. This
                  concept does not accept uploads or define an exhaustive list.
                </dd>
              </div>
              <div>
                <dt>Examination</dt>
                <dd>
                  The known project flow includes the DCAT admission examination
                  and no interview stage.
                </dd>
              </div>
              <div>
                <dt>Application dates</dt>
                <dd>
                  Cycle names, opening dates, and deadlines are not set in this
                  concept.
                </dd>
              </div>
            </dl>
          </section>
          <section
            className="admissions-flow"
            aria-labelledby="admission-steps"
          >
            <h2 id="admission-steps">From application to enrollment</h2>
            <AdmissionsJourney detailed />
          </section>
          <div className="page-next">
            <div>
              <h2>Applicant portal entry</h2>
              <p>
                You can preview the applicant entry experience. It does not
                create an account or application.
              </p>
            </div>
            <Button asChild>
              <Link href="/account/create">View account-entry options</Link>
            </Button>
          </div>
        </div>
      </main>
    </SiteShell>
  );
}
