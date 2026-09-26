import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Guide to vynr",
  description:
    "A short guide to building your cellar, exploring wine in place and time, and keeping your memories private.",
};

export default function GuidePage() {
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
          Guide to vynr
        </h1>
        <p style={{ color: "var(--atlas-text-secondary)", maxWidth: 580 }}>
          vynr brings together your wines, their makers, their places and your
          memories&mdash;so every bottle belongs to a larger story.
        </p>
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
        <h2>Add your wines</h2>
        <p>
          Choose the plus in your cellar and photograph the front label. vynr
          reads the label, proposes the wine details, and lets you correct every
          field before saving. You can also add a bottle manually when a label
          is unavailable or import an existing cellar.
        </p>

        <h2>Shape your cellar</h2>
        <p>
          A saved wine joins your cellar with its quantity, acquisition details,
          price and drinking intent. Storage keeps the physical side honest:
          create the places where bottles actually live, then move them without
          losing their history.
        </p>

        <h2>Follow wine to its place</h2>
        <p>
          Wine detail, producer profiles and Atlas are one connected route.
          Follow a bottle to its maker, appellation and region; use Atlas to
          move back out and understand the collection geographically.
        </p>

        <h2>See wine through time</h2>
        <p>
          Time Lens combines your cellar history with the same drinking-window
          guidance shown on each wine. Look back over what entered and left the
          cellar, or forward to see which bottles are approaching their moment.
          Guidance is a useful signal, not a promise&mdash;your own judgement
          always wins.
        </p>

        <h2>Remember the bottle</h2>
        <p>
          The Journal keeps tastings beside the people, places, photographs and
          notes that made them matter. A wine can be part of several memories,
          and each memory remains connected to its producer and place.
        </p>

        <h2>Keep your cellar safe</h2>
        <p>
          Your cellar begins on your device. When iCloud backup is available,
          vynr stores a protected copy in your private iCloud database. You can
          also export a complete <code>.vynr</code> backup from Settings and
          restore it later. vynr cannot browse your private cellar.
        </p>

        <hr />

        <p>
          This is the short launch guide. We will continue adding deeper
          walkthroughs as vynr grows. If something is unclear or does not work
          as described, visit <Link href="/support">Support</Link>. For planned
          improvements, see the <Link href="/roadmap">Roadmap</Link>.
        </p>
      </article>
    </section>
  );
}
