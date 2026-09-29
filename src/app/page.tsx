import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SiteShell } from "@/components/public/site-shell";
import {
  AdmissionsJourney,
  CampusPrograms,
  HistoryTimeline,
} from "@/components/public/institution-content";

export default function Home() {
  return (
    <SiteShell>
      <main id="main">
        <section className="campus-hero" aria-labelledby="hero-title">
          <Image
            src="/images/campus-hero.webp"
            alt="DFCAMCLP campus buildings surrounding an open courtyard"
            fill
            preload
            sizes="100vw"
            className="campus-hero-image"
          />
          <div className="hero-scrim" aria-hidden="true" />
          <div className="public-container hero-content">
            <h1 id="hero-title">Student &amp; Staff Portal</h1>
            <p>
              Public college information and portal access for the DFCAMCLP
              community.
            </p>
            <div className="hero-actions">
              <Button asChild>
                <Link href="/login">Portal Sign In</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/admissions">Explore Admissions</Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="institution-intro public-section">
          <div className="public-container">
            <div className="institution-intro-copy">
              <h2>College life in Las Piñas</h2>
              <p>
                Dr. Filemon C. Aguilar Memorial College of Las Piñas (DFCAMCLP)
                is a local, city-funded public college serving learners in Las
                Piñas City. This concept brings together campus program
                information, admissions guidance, and separate portal entry
                points for applicants, students, faculty, and school staff.
              </p>
            </div>
          </div>
        </section>
        <section
          className="public-section public-container"
          aria-labelledby="programs-title"
        >
          <div className="section-heading">
            <div>
              <h2 id="programs-title">Programs across two campuses</h2>
              <p>
                Four degree programs in the project model, with BSBA majors
                grouped under the degree.
              </p>
            </div>
            <Link className="text-link" href="/programs">
              View programs
            </Link>
          </div>
          <CampusPrograms detailed />
        </section>
        <section className="journey-section">
          <div className="public-container">
            <div className="section-heading">
              <div>
                <h2>The admissions journey</h2>
                <p>
                  Application, physical document submission and verification,
                  DCAT, results, then enrollment.
                </p>
              </div>
              <Link className="text-link" href="/admissions">
                Admissions overview
              </Link>
            </div>
            <AdmissionsJourney />
          </div>
        </section>
        <section
          className="history-preview public-section"
          aria-labelledby="history-title"
        >
          <div className="public-container">
            <div className="section-heading">
              <div>
                <h2 id="history-title">A brief history</h2>
                <p>Selected milestones supported by public reporting.</p>
              </div>
              <Link href="/about" className="text-link">
                About the college
              </Link>
            </div>
            <HistoryTimeline />
          </div>
        </section>
      </main>
    </SiteShell>
  );
}
