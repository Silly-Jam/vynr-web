import type { Metadata } from "next";
import Link from "next/link";
import {
  getAllEditions,
  formatDate,
  formatEpochRange,
  summaryParts,
} from "@/lib/revisions";

export const metadata: Metadata = {
  title: "Revisions",
  description:
    "What changed in Vynr's wine reference data, edition by edition — producers, appellations, regions, grapes and concepts, compared between published epochs.",
};

export default async function RevisionsPage() {
  const editions = getAllEditions();

  return (
    <section style={{ maxWidth: 720, margin: "0 auto", padding: "48px 24px 80px" }}>
      <h1
        style={{
          fontSize: "1.8rem",
          fontWeight: 600,
          letterSpacing: "-0.02em",
          color: "var(--atlas-text)",
          marginBottom: "0.5rem",
        }}
      >
        Revisions
      </h1>
      <p
        style={{
          fontSize: "0.9rem",
          color: "var(--atlas-text-placeholder)",
          marginBottom: "3rem",
          maxWidth: "34rem",
          lineHeight: 1.6,
        }}
      >
        What changed in the wine reference data. Each edition compares two published
        epochs and lists the producers, places, grapes and concepts that moved between
        them.
      </p>

      {editions.length === 0 ? (
        <p style={{ fontSize: "0.925rem", color: "var(--atlas-text-secondary)" }}>
          No editions have been published yet.
        </p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column" }}>
          {editions.map((edition) => (
            <Link
              key={edition.editionId}
              href={`/revisions/${edition.editionId}`}
              className="blog-post-link"
              style={{ display: "block", textDecoration: "none", padding: "1.5rem 0" }}
            >
              <article>
                <h2
                  style={{
                    fontSize: "1.15rem",
                    fontWeight: 600,
                    color: "var(--atlas-text)",
                    marginBottom: "0.4rem",
                    letterSpacing: "-0.01em",
                  }}
                >
                  {formatEpochRange(edition)}
                </h2>
                <p
                  style={{
                    fontSize: "0.925rem",
                    color: "var(--atlas-text-secondary)",
                    lineHeight: 1.5,
                    marginBottom: "0.5rem",
                  }}
                >
                  {edition.changeCount === 0
                    ? "No reference-data changes."
                    : edition.categories
                        .map((c) => `${c.category}: ${summaryParts(c).join(", ")}`)
                        .join(" · ")}
                </p>
                <time
                  style={{
                    fontSize: "0.8rem",
                    color: "var(--atlas-text-placeholder)",
                    letterSpacing: "0.02em",
                  }}
                >
                  {formatDate(edition.to.committedAt)} ·{" "}
                  {edition.changeCount === 1
                    ? "1 change"
                    : `${edition.changeCount} changes`}
                </time>
              </article>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
