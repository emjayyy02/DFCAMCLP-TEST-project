import Link from "next/link";
import { SiteHeader } from "./site-header";
import { SkipLink } from "@/components/development-identity";
import { ProjectInformationLinks } from "@/features/disclosure/demo-disclosure-provider";

export function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="public-site">
      <SkipLink />
      <SiteHeader />
      {children}
      <footer className="public-footer">
        <div className="public-container">
          <div className="footer-top">
            <Link href="/" className="footer-identity">
              DFCAMCLP<span>Student &amp; Staff Portal</span>
            </Link>
            <nav aria-label="Footer navigation">
              <Link href="/programs">Programs</Link>
              <Link href="/admissions">Admissions</Link>
              <Link href="/about">About</Link>
              <Link href="/login">Sign In</Link>
            </nav>
          </div>
          <ProjectInformationLinks />
          <p className="footer-copyright">
            © 2026 Marvin Silverio · Independent portfolio project.
          </p>
        </div>
      </footer>
    </div>
  );
}
export function PageIntro({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="public-page-intro">
      <h1>{title}</h1>
      <p>{children}</p>
    </div>
  );
}
