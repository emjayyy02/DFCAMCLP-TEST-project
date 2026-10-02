import type { Metadata } from "next";
import Link from "next/link";
import { SiteShell, PageIntro } from "@/components/public/site-shell";
import { CampusPrograms } from "@/components/public/institution-content";
export const metadata: Metadata = {
  title: "Programs & Campuses — DFCAMCLP Portal",
};
export default function ProgramsPage() {
  return (
    <SiteShell>
      <main id="main" className="public-page">
        <div className="public-container">
          <PageIntro title="Programs & campuses">
            The current project model groups four degree programs across Main
            Campus and IIT Campus. BSBA majors remain part of the BSBA degree.
          </PageIntro>
          <section aria-labelledby="academic-programs">
            <h2 id="academic-programs" className="sr-only">
              Academic programs
            </h2>
            <CampusPrograms detailed />
          </section>
          <div className="page-next">
            <div>
              <h2>Planning your next step?</h2>
              <p>Review the known admissions journey and its physical steps.</p>
            </div>
            <Link href="/admissions" className="text-link">
              Explore admissions
            </Link>
          </div>
        </div>
      </main>
    </SiteShell>
  );
}
