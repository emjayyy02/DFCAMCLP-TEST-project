import Link from "next/link";
import { SiteShell } from "@/components/public/site-shell";
import { ProjectInformationHeading } from "./project-information-heading";
import { informationPages, disclosureVersion } from "./disclosure-content";
import { ReturnToDemo } from "./demo-disclosure-provider";

export function ProjectInformationPage({ route }: { route: string }) {
  const page = informationPages.find((page) => page.route === route)!;
  return (
    <SiteShell>
      <main id="main" className="public-page project-information-page">
        <div className="public-container">
          <div className="project-reading-column">
            <div className="public-page-intro">
              <ProjectInformationHeading title={page.title} />
              <p>{page.intro}</p>
            </div>
            <p className="project-notice-version">
              Project notice · Version {disclosureVersion} · Updated 1 October
              2026
            </p>
            <nav
              className="project-page-navigation"
              aria-label="Project notices"
            >
              {informationPages.map((item) => (
                <Link
                  key={item.route}
                  href={"/" + item.route}
                  aria-current={item.route === route ? "page" : undefined}
                >
                  {item.title}
                </Link>
              ))}
            </nav>
            <article aria-label={page.title}>
              {page.sections.map((section) => (
                <section key={section.heading}>
                  <h2>{section.heading}</h2>
                  {"items" in section && (
                    <ul>
                      {section.items.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  )}
                  {section.paragraphs.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </section>
              ))}
            </article>
            <p className="project-notice-closing">
              These notices explain a portfolio demo. They are not presented as
              lawyer-reviewed legal documents.
            </p>
            <ReturnToDemo />
          </div>
        </div>
      </main>
    </SiteShell>
  );
}
