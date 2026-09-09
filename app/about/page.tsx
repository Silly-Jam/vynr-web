import type { Metadata } from "next";
import Image from "next/image";

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

        <h2>Three things, woven through time and taste</h2>
        <p>
          <strong>A cellar</strong> — to track what you own.
          <br />
          <strong>A journal</strong> — to record what you experienced.
          <br />
          <strong>An atlas</strong> — to understand where it came from, and
          who made it.
        </p>
        <p>Two threads run through all three.</p>
        <p>
          <strong>Time.</strong> Wine changes, and so does a cellar. Every
          bottle sits somewhere on its own curve — closed, approaching, at its
          peak, fading — and the Time Lens lets you scrub forward to see what
          will be ready next spring, or back to what you were drinking the
          year you moved house. The cellar is not a list. It is a map that
          moves.
        </p>
        <p>
          <strong>Taste.</strong> What you keep, what you open and what you
          write down slowly form a picture of what you actually like. vynr
          uses it to make its notes more yours: which bottle to open tonight,
          what you&rsquo;re overlooking, what a new wine might mean to you.
          It is built from your own record, for you, and it grows with every
          bottle.
        </p>

        <h2>If you&rsquo;re studying wine</h2>
        <p>
          Everything that helps a collector also helps a student. The atlas
          is a working map of regions, appellations and the rules behind
          them, not a decoration. Producer profiles bring together who they
          are, how they work and how their wines age. Vynrpedia sits
          underneath it all &mdash; in the app, long-press a place or a term
          to read what it means, or browse it on its own. The journal holds
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
            href="https://github.com/Silly-Jam"
            target="_blank"
            rel="noopener noreferrer"
          >
            Silly Jam on GitHub &rarr;
          </a>
        </p>

        <hr />

        <p><em>Just wine, remembered.</em></p>
      </article>
    </section>
  );
}
