import type { Metadata } from "next";
import { SiteShell } from "@/components/public/site-shell";
import { Button } from "@/components/ui/button";
import { ReturnToDemo } from "@/features/disclosure/demo-disclosure-provider";

export const metadata: Metadata = {
  title: "About the developer — Independent portal demo",
  description:
    "Meet Mj, the developer behind this independent learning project.",
};

const socials = [
  { name: "GitHub", href: "https://github.com/emjayyy02", icon: "github" },
  {
    name: "Portfolio",
    href: "https://project-01-personal-developer-profi.vercel.app",
    icon: "portfolio",
  },
  {
    name: "Instagram",
    href: "https://www.instagram.com/_emm.jayyy/",
    icon: "instagram",
  },
] as const;

function SocialIcon({ kind }: { kind: (typeof socials)[number]["icon"] }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="20"
      height="20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {kind === "github" ? (
        <path
          fill="currentColor"
          stroke="none"
          d="M12 .9a11.1 11.1 0 0 0-3.51 21.63c.56.1.76-.24.76-.54v-2.07c-3.1.68-3.75-1.32-3.75-1.32-.51-1.29-1.24-1.63-1.24-1.63-1.02-.69.08-.68.08-.68 1.13.08 1.73 1.16 1.73 1.16 1 .1.94 1.9 3.2 1.36.1-.73.4-1.22.71-1.51-2.47-.28-5.07-1.24-5.07-5.49 0-1.21.43-2.2 1.15-2.98-.12-.28-.5-1.41.11-2.94 0 0 .93-.3 3.05 1.14a10.63 10.63 0 0 1 5.55 0c2.12-1.44 3.05-1.14 3.05-1.14.61 1.53.23 2.66.11 2.94.72.78 1.15 1.77 1.15 2.98 0 4.26-2.6 5.21-5.08 5.49.4.35.76 1.02.76 2.06V22c0 .3.2.65.77.54A11.1 11.1 0 0 0 12 .9Z"
        />
      ) : kind === "instagram" ? (
        <>
          <rect x="3" y="3" width="18" height="18" rx="5" />
          <circle cx="12" cy="12" r="4" />
          <circle
            cx="17.5"
            cy="6.5"
            r=".75"
            fill="currentColor"
            stroke="none"
          />
        </>
      ) : (
        <>
          <circle cx="12" cy="12" r="9" />
          <ellipse cx="12" cy="12" rx="4" ry="9" />
          <path d="M3 12h18M5 6.5h14M5 17.5h14" />
        </>
      )}
    </svg>
  );
}

export default function AboutDeveloperPage() {
  return (
    <SiteShell>
      <main id="main" className="public-page developer-page">
        <div className="public-container">
          <div className="developer-intro">
            <span className="developer-wave" aria-hidden="true">
              👋
            </span>
            <h1>Hey, I&apos;m Mj.</h1>
            <p>
              I started this as a side project just to build something fun and
              realistic. It somehow became a whole portal 😅. I learn mostly by
              building, breaking things, and improving them.
            </p>
            <nav className="developer-socials" aria-label="Find Mj online">
              {socials.map((social) => (
                <Button asChild variant="outline" key={social.name}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <SocialIcon kind={social.icon} />
                    {social.name}
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                </Button>
              ))}
            </nav>
            <p className="developer-project-note">
              An independent learning project, with no DFCAMCLP affiliation.
            </p>
            <ReturnToDemo />
          </div>
        </div>
      </main>
    </SiteShell>
  );
}
