import type { Metadata } from "next";
import { getRoadmap } from "@/lib/roadmap";

export const metadata: Metadata = {
  title: "Roadmap",
  description:
    "What vynr launches with, what we are building next, and the directions we intend to take after that.",
  alternates: { canonical: "/roadmap" },
};

// Every word on this page comes from ROADMAP.md; this component only lays it out.
export default function RoadmapPage() {
  const roadmap = getRoadmap();
  const tiers = roadmap.sections.filter((section) => section.releases.length > 0);

  return (
    <section
      style={{
        maxWidth: 720,
        margin: "0 auto",
        padding: "48px 24px 80px",
      }}
    >
      <header style={{ marginBottom: "2rem" }}>
        <h1
          style={{
            fontSize: "2rem",
            fontWeight: 600,
            letterSpacing: "-0.02em",
            lineHeight: 1.2,
            color: "var(--atlas-text)",
            marginBottom: "0.75rem",
          }}
        >
          {roadmap.title}
        </h1>
        <div
          style={{
            width: 40,
            height: 2,
            background: "var(--atlas-tint)",
            borderRadius: 1,
          }}
        />
      </header>

      <article className="prose roadmap">
        <div dangerouslySetInnerHTML={{ __html: roadmap.introHtml }} />

        <nav className="roadmap-index" aria-label="Roadmap sections">
          {tiers.map((tier) => (
            <a key={tier.id} href={`#${tier.id}`} className="tap-target nav-link">
              {tier.title}
            </a>
          ))}
        </nav>

        {roadmap.sections.map((section) => (
          <section key={section.id} id={section.id} className="roadmap-section">
            <h2>{section.title}</h2>
            <div dangerouslySetInnerHTML={{ __html: section.html }} />

            {section.releases.map((release) => (
              <section
                key={release.id}
                id={release.id}
                className="release-band"
                data-commitment={section.id}
              >
                <h3>
                  {release.version && (
                    <>
                      <span className="release-version">{release.version}</span>{" "}
                    </>
                  )}
                  {release.theme}
                </h3>
                <p className="release-meta">
                  <span className="release-commitment">{release.commitment}</span>
                  {release.promise && (
                    <span className="release-promise">{release.promise}</span>
                  )}
                </p>
                <div dangerouslySetInnerHTML={{ __html: release.html }} />
              </section>
            ))}
          </section>
        ))}
      </article>
    </section>
  );
}
