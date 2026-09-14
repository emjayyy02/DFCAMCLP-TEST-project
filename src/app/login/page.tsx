import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { LoginForm } from "@/features/identity/login-form";
import { SiteShell } from "@/components/public/site-shell";
import { isPortalCode } from "@/lib/portals";
export const metadata: Metadata = { title: "Sign in — DFCAMCLP Portal" };
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
          <Image
            src="/images/dfcamclp-seal.webp"
            alt="DFCAMCLP seal"
            width={72}
            height={72}
            unoptimized
          />
          <h1 id="login-title">Portal sign in</h1>
          <p className="login-intro">Choose your portal to continue.</p>
          <p className="login-note">
            Demo accounts only. Do not enter real student information.
          </p>
          <LoginForm defaultPortal={defaultPortal} />
          <p className="login-help">
            Account activation and recovery are not available in this concept.
          </p>
          <Link href="/programs" className="text-link">
            No demo account? Explore programs
          </Link>
        </section>
      </main>
    </SiteShell>
  );
}
