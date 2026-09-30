import type { Metadata } from "next";
import Link from "next/link";
import { LoginForm } from "@/features/identity/login-form";
import { SiteShell } from "@/components/public/site-shell";
import { isPortalCode } from "@/lib/portals";
export const metadata: Metadata = {
  title: "Sign in — DFCAMCLP Portal Concept",
};
export default async function LoginPage({ searchParams }: PageProps<"/login">) {
  const requestedPortal = (await searchParams).portal;
  const defaultPortal =
    typeof requestedPortal === "string" && isPortalCode(requestedPortal)
      ? requestedPortal
      : "";
  return (
    <SiteShell>
      <main id="main" className="public-container login-page">
        <section className="login-panel" aria-labelledby="login-title">
          <h1 id="login-title">Portal sign in</h1>
          <p className="login-intro">Choose your portal to continue.</p>
          <p className="login-note">
            Demo accounts only. Do not enter real student information.
          </p>
          <LoginForm defaultPortal={defaultPortal} />
          <div className="login-account-links">
            <Link href="/account/recovery" className="text-link">
              Forgot your password or need account help?
            </Link>
            <Link href="/account/create" className="text-link">
              New applicant? View account-entry options
            </Link>
          </div>
        </section>
      </main>
    </SiteShell>
  );
}
