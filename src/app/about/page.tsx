import type { Metadata } from "next";
import Link from "next/link";
import {
  SiteShell,
  PageIntro,
  conceptNotice,
} from "@/components/public/site-shell";
export const metadata: Metadata = {
  title: "About the Concept — DFCAMCLP Portal",
};
export default function AboutPage() {
  return (
    <SiteShell>
      <main id="main" className="public-container public-page about-page">
        <PageIntro title="One connected campus experience">
          A portal concept for Dr. Filemon C. Aguilar Memorial College of Las
          Piñas.
        </PageIntro>
        <div className="about-columns">
          <section>
            <h2>Designed around campus life</h2>
            <p>
              A shared starting point for admissions, academics, and the
              services students and employees use.
            </p>
            <Link className="text-link" href="/programs">
              Explore programs &amp; campuses
            </Link>
          </section>
          <section>
            <h2>A learning project</h2>
            <p>{conceptNotice}</p>
            <p>
              Not commissioned by the college, intended for institutional
              deployment, or designed to process real student information.
            </p>
          </section>
        </div>
      </main>
    </SiteShell>
  );
}
