import Link from "next/link";
import { SiteHeader } from "./site-header";
import { SkipLink } from "@/components/development-identity";

export const conceptNotice =
  "Unofficial concept project for educational and portfolio purposes. Not affiliated with or endorsed by DFCAMCLP.";
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
              DFCAMCLP<span>Integrated Student &amp; Employee Portal</span>
            </Link>
            <nav aria-label="Footer navigation">
              <Link href="/programs">Programs</Link>
              <Link href="/admissions">Admissions</Link>
              <Link href="/login">Portal Sign In</Link>
            </nav>
          </div>
          <p>{conceptNotice}</p>
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
