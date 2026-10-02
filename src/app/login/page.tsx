import type { Metadata } from "next";
import Link from "next/link";
import { LoginForm } from "@/features/identity/login-form";
import { SiteShell } from "@/components/public/site-shell";
import { isPortalCode } from "@/lib/portals";
import { publicDemoAccounts } from "@/features/identity/public-demo-accounts";
import "@/features/identity/demo-accounts.css";
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
          <header className="login-heading">
            <h1 id="login-title">Portal sign in</h1>
            <p className="login-intro">Choose your portal to continue.</p>
          </header>
          <LoginForm
            defaultPortal={defaultPortal}
            demoAccounts={publicDemoAccounts}
          />
          <div className="login-account-links">
            <Link
              href="/account/create"
              className="ui-button login-create-account"
            >
              New applicant? Create an account
            </Link>
            <Link href="/account/recovery" className="text-link">
              Forgot password / account help
            </Link>
          </div>
        </section>
      </main>
    </SiteShell>
  );
}
