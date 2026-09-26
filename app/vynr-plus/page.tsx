import type { Metadata } from "next";
import { getPlans } from "@/lib/plans";

export function generateMetadata(): Metadata {
  return {
    title: "vynr and vynr+",
    description: getPlans().summary,
    alternates: { canonical: "/vynr-plus" },
  };
}

// Every word on this page comes from VYNR-PLUS.md; this component only lays it out.
export default function PlansPage() {
  const plans = getPlans();

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
          {plans.title}
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

      <article className="prose plans">
        <div dangerouslySetInnerHTML={{ __html: plans.introHtml }} />

        {plans.sections.map((section) => (
          <section key={section.id} id={section.id}>
            <h2>{section.title}</h2>
            <div dangerouslySetInnerHTML={{ __html: section.html }} />
            {/* Explicit roles keep the table semantics when narrow screens restyle it as stacked blocks. */}
            {section.rows && (
              <table className="plans-table" role="table">
                <thead role="rowgroup">
                  <tr role="row">
                    <th scope="col" role="columnheader">
                      <span className="visually-hidden">Area</span>
                    </th>
                    <th scope="col" role="columnheader">vynr</th>
                    <th scope="col" role="columnheader">vynr+</th>
                  </tr>
                </thead>
                <tbody role="rowgroup">
                  {section.rows.map((row) => (
                    <tr key={row.id} role="row">
                      <th scope="row" role="rowheader">{row.area}</th>
                      <td role="cell" data-plan="vynr" dangerouslySetInnerHTML={{ __html: row.freeHtml }} />
                      <td role="cell" data-plan="vynr+" dangerouslySetInnerHTML={{ __html: row.plusHtml }} />
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </section>
        ))}
      </article>
    </section>
  );
}
