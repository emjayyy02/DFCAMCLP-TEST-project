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
      <main id="main" className="public-container public-page">
        <PageIntro title="Programs & campuses">
          Find the campus and program that match your interests.
        </PageIntro>
        <section aria-labelledby="academic-programs">
          <h2 id="academic-programs" className="sr-only">
            Academic programs
          </h2>
          <CampusPrograms detailed />
        </section>
        <p className="provisional-note">
          Computer Engineering / CpE follows the project’s provisional program
          naming.
        </p>
        <div className="page-next">
          <div>
            <h2>Planning your next step?</h2>
            <p>Get to know the admissions journey.</p>
          </div>
          <Link href="/admissions" className="text-link">
            Explore admissions
          </Link>
        </div>
      </main>
    </SiteShell>
  );
}
