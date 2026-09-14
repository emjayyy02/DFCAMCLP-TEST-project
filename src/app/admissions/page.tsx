import type { Metadata } from "next";
import Link from "next/link";
import { SiteShell, PageIntro } from "@/components/public/site-shell";
import { AdmissionsJourney } from "@/components/public/institution-content";
export const metadata: Metadata = { title: "Admissions — DFCAMCLP Portal" };
export default function AdmissionsPage() {
  return (
    <SiteShell>
      <main id="main" className="public-container public-page">
        <PageIntro title="Your path to admission">
          An overview of the journey from application to enrollment.
        </PageIntro>
        <section
          aria-labelledby="before-you-begin"
          className="admissions-context"
        >
          <h2 id="before-you-begin">Before you begin</h2>
          <dl>
            <div>
              <dt>Local college context</dt>
              <dd>Free tuition, with a Las Piñas residency requirement.</dd>
            </div>
            <div>
              <dt>Document submission</dt>
              <dd>Physical documents are submitted for verification.</dd>
            </div>
            <div>
              <dt>Admission process</dt>
              <dd>
                The known process includes DCAT. There is no interview stage.
              </dd>
            </div>
          </dl>
        </section>
        <section className="admissions-flow" aria-labelledby="admission-steps">
          <h2 id="admission-steps">From application to enrollment</h2>
          <AdmissionsJourney detailed />
        </section>
        <div className="page-next">
          <div>
            <h2>About this overview</h2>
            <p>
              This concept does not accept applications or publish official
              deadlines and requirements.
            </p>
          </div>
          <Link className="text-link" href="/programs">
            Explore programs
          </Link>
        </div>
      </main>
    </SiteShell>
  );
}
