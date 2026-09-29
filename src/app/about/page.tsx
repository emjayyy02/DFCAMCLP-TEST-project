import type { Metadata } from "next";
import Link from "next/link";
import {
  SiteShell,
  PageIntro,
  conceptNotice,
} from "@/components/public/site-shell";
import { HistoryTimeline } from "@/components/public/institution-content";
import { Button } from "@/components/ui/button";
export const metadata: Metadata = {
  title: "About — DFCAMCLP Portal Concept",
};
export default function AboutPage() {
  return (
    <SiteShell>
      <main id="main" className="public-container public-page about-page">
        <PageIntro title="About DFCAMCLP">
          A short institutional overview and the history behind this unofficial
          portal concept.
        </PageIntro>
        <section className="about-overview" aria-labelledby="college-overview">
          <div>
            <h2 id="college-overview">A city-funded public college</h2>
            <p>
              Dr. Filemon C. Aguilar Memorial College of Las Piñas serves
              learners in Las Piñas City through undergraduate programs. Its
              current project model groups the Main Campus and IIT Campus.
            </p>
          </div>
          <div>
            <h2>Campuses and programs</h2>
            <p>
              Main Campus includes BSA and BSBA, with three majors under BSBA.
              IIT Campus includes BSIS and BSCpE.
            </p>
            <Link className="text-link" href="/programs">
              View programs and campuses
            </Link>
          </div>
        </section>

        <section
          className="about-history"
          aria-labelledby="about-history-title"
        >
          <div className="section-heading">
            <div>
              <h2 id="about-history-title">Selected history</h2>
              <p>Three dated milestones supported by public sources.</p>
            </div>
          </div>
          <HistoryTimeline detailed />
        </section>

        <section className="about-disclosure" aria-labelledby="project-title">
          <div>
            <h2 id="project-title">About this project</h2>
            <p>{conceptNotice}</p>
            <p>
              This portfolio project is not commissioned for institutional
              deployment and is not designed to process real student, applicant,
              or employee information.
            </p>
          </div>
          <Button asChild variant="outline">
            <Link href="/login">Portal Sign In</Link>
          </Button>
        </section>
      </main>
    </SiteShell>
  );
}
