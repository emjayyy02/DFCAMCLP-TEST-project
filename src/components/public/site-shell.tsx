import Link from "next/link";
import { SiteHeader } from "./site-header";
import { SkipLink } from "@/components/development-identity";
import { ProjectInformationLinks } from "@/features/disclosure/demo-disclosure-provider";
import {
  getCurrentAccessContext,
  safePortalMemberships,
} from "@/server/access-control/current";
import { authorizedPrimaryPortal } from "@/server/access-control/profile-navigation";
import { portalDetails, portalPath } from "@/lib/portals";

export async function SiteShell({ children }: { children: React.ReactNode }) {
  const current = await getCurrentAccessContext();
  const portal = current ? authorizedPrimaryPortal(current) : null;
  const account = current
    ? {
        user: {
          id: current.user.id,
          name: current.user.name,
          email: current.user.email,
        },
        currentPortal: portal,
        memberships: safePortalMemberships(current),
      }
    : null;
  return (
    <div className="public-site" data-authenticated={Boolean(current)}>
      <SkipLink />
      <SiteHeader account={account} />
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
              {current ? (
                portal ? (
                  <>
                    <Link href={portalPath(portal)}>
                      Return to {portalDetails[portal].label} Portal
                    </Link>
                    <Link href={`${portalPath(portal)}/profile`}>
                      View profile
                    </Link>
                  </>
                ) : (
                  <Link href="/">Home</Link>
                )
              ) : (
                <Link href="/login">Sign In</Link>
              )}
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
