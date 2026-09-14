import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SiteShell } from "@/components/public/site-shell";
import {
  AdmissionsJourney,
  CampusPrograms,
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
            <h1 id="hero-title">
              Integrated Student
              <br />
              &amp; Employee Portal
            </h1>
            <p>
              Admissions, academics, and campus services
              <br className="hero-line-break" /> in one integrated experience.
            </p>
            <div className="hero-actions">
              <Button asChild>
                <Link href="/admissions">Explore Admissions</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/login">Portal Sign In</Link>
              </Button>
            </div>
          </div>
        </section>
        <section
          className="quick-access public-container"
          aria-labelledby="quick-title"
        >
          <h2 id="quick-title">Quick access</h2>
          <div className="quick-links">
            {[
              ["/admissions", "Admissions"],
              ["/login?portal=STUDENT", "Student Portal"],
              ["/login?portal=ACADEMIC", "Academic Portal"],
              ["/login?portal=RECORDS", "Admissions & Records"],
            ].map(([href, label]) => (
              <Link href={href} key={href}>
                {label}
                <svg
                  aria-hidden="true"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                >
                  <path d="M7 17 17 7M7 7h10v10" />
                </svg>
              </Link>
            ))}
          </div>
        </section>
        <section
          className="public-section public-container"
          aria-labelledby="programs-title"
        >
          <div className="section-heading">
            <div>
              <h2 id="programs-title">Programs &amp; campuses</h2>
              <p>Explore the academic programs across two campuses.</p>
            </div>
            <Link className="text-link" href="/programs">
              View programs
            </Link>
          </div>
          <CampusPrograms />
        </section>
        <section className="journey-section">
          <div className="public-container">
            <div className="section-heading">
              <div>
                <h2>Your admissions journey</h2>
                <p>A clear path from application to enrollment.</p>
              </div>
              <Link className="text-link" href="/admissions">
                Admissions overview
              </Link>
            </div>
            <AdmissionsJourney />
          </div>
        </section>
        <aside className="public-container portal-notice">
          <span className="notice-marker" aria-hidden="true" />
          <div>
            <h2>Explore the portal concept</h2>
            <p>
              This is a demonstration. Applications and real student information
              are not accepted.
            </p>
          </div>
          <Link className="text-link" href="/about">
            About this project
          </Link>
        </aside>
      </main>
    </SiteShell>
  );
}
