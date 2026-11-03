import type { Metadata } from "next";
import Image from "next/image";
import { APP_STORE_URL } from "@/lib/app-store";

export const metadata: Metadata = {
  title: "About",
  description:
    "A private wine cellar, atlas and tasting journal that brings together your wines, their makers, their places and your memories.",
};

export default function AboutPage() {
  return (
    <section
      style={{
        maxWidth: 720,
        margin: "0 auto",
        padding: "48px 24px 80px",
      }}
    >
      <header style={{ marginBottom: "2.5rem" }}>
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
          About
        </h1>
        <div
          style={{
            width: 40,
            height: 2,
            background: "var(--atlas-tint)",
            marginTop: "1.5rem",
            borderRadius: 1,
          }}
        />
      </header>

      <article className="prose">
        <p>
          vynr brings together your wines, their makers, their places and
          your memories &mdash; so every bottle belongs to a larger story.
        </p>

        <p>
          After a dinner, you want to keep the shape of it: the bottle that
          made the table go quiet, the acidity that cut through the dish, the
          producer you meant to look up, the way the room felt when the glass
          was lifted. Not as a score, but as a trace — something you can return
          to later.
        </p>

        <p>
          No crowd-sourced ratings. No social feeds. No marketplace. No
          gamification. No advertising. This is not a limitation. It is the
          product.
        </p>

        <h2>What vynr is built on</h2>
        <dl className="foundations">
          <div>
            <dt>A spatial Cellar and Atlas.</dt>{" "}
            <dd>
              The Cellar shows the wine world you have collected. The Atlas shows the larger world it belongs to. They are not separate catalogues, but two views of the same landscape.
            </dd>
          </div>
          <div>
            <dt>Living wine knowledge.</dt>{" "}
            <dd>
              A continuously refined reference of producers, places, grapes, vintages and maturity. It reaches through the Atlas, producer pages and Vynrpedia, and keeps growing without waiting for the next app release.
            </dd>
          </div>
          <div>
            <dt>What happened, and what comes next.</dt>{" "}
            <dd>
              The Journal and Time Lens share the same record. The Journal keeps what happened around a wine: the tasting, the photographs, the place and the asides in the margin. The Time Lens lets you move through that record: back through what you opened, across the cellar as it is now, and forward to what is coming into its own.
            </dd>
          </div>
          <div>
            <dt>Privacy by design.</dt>{" "}
            <dd>
              No account, no advertising and no resale of your data. Your cellar and memories remain private unless you choose to share them. Trust is not an option added in Settings; it is part of how vynr is built.
            </dd>
          </div>
        </dl>

        <h2>If you&rsquo;re studying wine</h2>
        <p>
          Everything that helps a collector also helps a student. The Atlas
          is a working map of regions, appellations and the rules behind
          them, not a decoration. Producer profiles bring together who they
          are, how they work and how their wines age. Vynrpedia sits
          underneath it all &mdash; in the app, long-press a place or a term
          to read what it means, or browse it on its own. The Journal holds
          tasting notes and the marginalia around them, so a structured
          tasting note and your own aside about the room sit on the same
          page.
        </p>
        <p>Study and drinking become one record.</p>

        <h2>Who it&rsquo;s for</h2>
        <p>
          People who enjoy wine and want a calm place to keep it: what they
          opened, where it came from, when the rest will be ready, and what
          it meant in the moment. People learning wine seriously &mdash;
          WSET students, newcomers to the trade, the curious &mdash; who want
          their study and their drinking to be the same record. For anyone
          who prefers private tools over public performance &mdash; and who
          wants their own record, not the internet&rsquo;s opinion.
        </p>

        <p>
          <a href={APP_STORE_URL} target="_blank" rel="noopener noreferrer">
            Find vynr on the App Store &rarr;
          </a>
        </p>

        <h2 id="silly-jam">Who makes it</h2>
        <p>
          <Image
            src="/silly-jam-icon.png"
            alt="Silly Jam Pte. Ltd."
            width={64}
            height={64}
            className="sj-inline-jar"
          />
          Silly Jam Pte. Ltd. is a Singapore software company building
          thoughtful software for enthusiasts and collectors.
        </p>
        <p>Creator and publisher of vynr.</p>
        <p>
          <a
            href="https://www.linkedin.com/company/silly-jam"
            target="_blank"
            rel="noopener noreferrer"
          >
            Silly Jam on LinkedIn &rarr;
          </a>
        </p>

        <hr />

        <p><em>Just wine, remembered.</em></p>
      </article>
    </section>
  );
}
