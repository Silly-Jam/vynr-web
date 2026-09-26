import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Roadmap",
  description:
    "The launch foundation, planned next steps and longer-term directions for vynr.",
  alternates: { canonical: "/roadmap" },
};

export default function RoadmapPage() {
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
          Roadmap
        </h1>
        <p style={{ color: "var(--atlas-text-secondary)", maxWidth: 580 }}>
          The launch foundation, what we plan to work on next, and the
          directions we are considering for later.
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
        <p>Everything below sits in one of three places:</p>
        <ul>
          <li>
            <strong>Launch foundation</strong> &mdash; what vynr is built on at
            launch.
          </li>
          <li>
            <strong>Planned next</strong> &mdash; our intended focus. Candidates
            may change, and not every one will arrive together.
          </li>
          <li>
            <strong>Directional later</strong> &mdash; themes we are
            considering. Their order, scope and timing may change.
          </li>
        </ul>
        <p>
          Which of these would matter most to you?{" "}
          <Link href="/contact">Tell us</Link>.
        </p>

        <h2>Launch foundation</h2>
        <p>
          Label scanning and manual entry; cellar and storage views; the Atlas
          and Vynrpedia; drinking windows and the Time Lens; and a journal of
          tastings, notes and photographs. The{" "}
          <Link href="/guide">Guide to vynr</Link> walks through each of them.
        </p>
        <p>
          The free foundation includes analytical tasting, your own wine
          records, backup and export. vynr+ adds room for a larger collection,
          the forward Time Lens beyond six months, Assistant Link, multiple
          cellars, and richer journal composition and publishing.
        </p>
        <p>
          Shared cellars let readers explore selected wines, notes and journal
          entries in the app or the web viewer. iCloud provides backup and
          restore; it is not live sync between devices, which is a later
          direction.
        </p>

        <h2>How vynr develops</h2>
        <p>
          Four kinds of work move at different speeds. These are the rhythms we
          intend, not fixed delivery dates.
        </p>
        <ul>
          <li>
            <strong>Fix and refine.</strong> Weekly app updates at first,
            easing to every two weeks as things settle. They refine existing
            features rather than add new ones; urgent reliability fixes can
            arrive sooner.
          </li>
          <li>
            <strong>Reference data.</strong> Weekly updates to producers,
            places, grapes, ageing guidance, education and Vynrpedia. These
            reach the app without an app update, and each week&rsquo;s changes
            are published in <Link href="/revisions">Revisions</Link>.
          </li>
          <li>
            <strong>Label reading.</strong> Accuracy improvements every two
            weeks to monthly, delivered inside app updates. When a label fails
            because a producer or place is missing, we add the reference data
            rather than bend the reader around the gap.
          </li>
          <li>
            <strong>New capabilities.</strong> A quarterly rhythm after launch,
            each release centred on one theme. What is free and what is vynr+
            is settled before the work begins.
          </li>
        </ul>
        <p>
          Reference data will keep growing: more producers, more complete
          regional geography including more vineyard-level detail, grape
          identities, ageing and vintage guidance, and further educational
          material.
        </p>

        <h2>Planned next</h2>

        <h3>Everyday refinements</h3>
        <p>
          The first update after launch is intended to bring back CellarTracker
          import, held out of the launch build to keep it simple, and to make
          manual entry smoother when a scan fails or is only partly read. Other
          near-term refinements:
        </p>
        <ul>
          <li>
            A clearer Restore from iCloud screen, alongside continued backup
            and restore improvements.
          </li>
          <li>
            Refinements to the maturity views and the Time Lens, and a quicker
            route from the Time Lens to the Journal.
          </li>
          <li>
            Better Assistant Link setup, recovery when a connection goes stale,
            and explicit choices about sharing exact quantities and collection
            value.
          </li>
          <li>
            A clearer path from publishing a shared cellar to opening it in the
            app or web viewer, including QR hand-off in a classroom.
          </li>
          <li>
            Making sure a student can record their own tasting of a shared wine
            without cloning it into a cellar.
          </li>
          <li>
            Clearer information about the bottle allowance, the edge of the
            free forward Time Lens, and a reminder before a trial ends.
          </li>
        </ul>
        <p>
          These may arrive across several updates. Assistant Link privacy
          controls remain free; using the link is part of vynr+.
        </p>

        <h3>Journal, learn and teach</h3>
        <p>
          The next feature theme centres on tasting occasions that stay part of
          your record, and on a closer connection between tasting, the Journal
          and learning. What follows are candidate outcomes, not a committed
          checklist.
        </p>
        <p>
          <strong>Keep the occasion.</strong> Start an empty tasting, add wines
          as you taste them, and come back later to their notes and marginalia.
          Wines you tasted stay distinct from bottles you own and never count
          towards your bottle allowance. The aim is a lasting record you can
          revisit, annotate and export, with a photographic keepsake, and an
          explicit step if you later add a tasted wine to a cellar.
        </p>
        <p>
          <strong>Learn from the record.</strong> Bring tasting notes and
          marginalia closer to Atlas places and Vynrpedia concepts. Extend the
          existing analytical tasting flow &mdash; appearance, nose, palate,
          finish and conclusion &mdash; with one consistent vocabulary, colour
          choices suited to each wine type, free text where you want it, and
          linked explanations. Related candidates: Vynrpedia explanations
          throughout the app, and a clearer way to review scan details that
          were set aside for checking.
        </p>
        <p>
          <strong>Compose and teach.</strong> Candidates include blind-tasting
          sets (write the note, reveal the wine, compare with vynr&rsquo;s
          reference information), study sets drawn from journal entries,
          composed study notes and exports, and tasting sets published to
          students. This builds on shared cellars that already carry notes and
          journal entries.
        </p>
        <p>
          Analytical tasting stays free. Capturing and keeping your own tasting
          history will not be taken away. Paid additions would build on that
          record &mdash; composing, organising, teaching and publishing
          &mdash; and their exact boundaries are still to be decided.
        </p>

        <h2>Directional later</h2>
        <p>
          A proposed order after Journal, learn and teach. These are not
          scheduled releases, and individual capabilities may move or change.
        </p>

        <h3>Plan and be reminded</h3>
        <p>
          Drink-window notifications and &ldquo;ready soon&rdquo; summaries; a
          view of what peaks across the whole cellar and where drinking windows
          crowd together; and deeper Assistant Link support, including food
          pairing and automatically refreshed cellar snapshots.
        </p>

        <h3>Your taste</h3>
        <p>
          A visible profile of what you tend to enjoy, explanations of why a
          wine may suit you, and recommendations informed by your own
          tastings. Further directions: journal chapters that draw connections
          across your past experiences, and your own annotations in the Atlas.
        </p>

        <h3>Everywhere</h3>
        <p>
          Live sync between devices, followed by iPad and Mac; Siri and
          Shortcuts; and a quick capture for noting a bottle when there is no
          time to stop. Live sync is separate from the backup and restore that
          vynr has at launch.
        </p>

        <h3>Under consideration</h3>
        <p>None of these has a release window or a settled scope.</p>
        <ul>
          <li>More ways to group a cellar: by producer, grape and vintage.</li>
          <li>An interactive map within the Atlas.</li>
          <li>
            Further development of the shared-cellar web viewer and Atlas
            reference pages.
          </li>
          <li>Similarity between wines, and how your cellar maps onto the Atlas.</li>
          <li>Educational overlays for deeper study.</li>
          <li>Aroma fingerprints.</li>
          <li>Drinks beyond wine.</li>
          <li>Android.</li>
          <li>A lifetime purchase option.</li>
        </ul>

        <h2>What stays</h2>
        <p>
          No account, privacy by default, and a useful free foundation. Free
          never shrinks: no release will move an existing free capability
          behind vynr+. Your wine records remain yours to capture, correct,
          back up and export, and reading a shared cellar remains free.
        </p>
        <p>
          vynr will not build social feeds, community ratings, a marketplace or
          wine purchasing, advertising, affiliate links, gamification,
          sponsored placement, pay-to-rank overlays, transaction fees or data
          resale.
        </p>

        <hr />

        <h2>Tell us what matters</h2>
        <p>
          Which of these would matter most to you?{" "}
          <Link href="/contact">Tell us</Link>. A note about how you collect,
          taste, study or teach helps us understand what deserves attention.
        </p>
      </article>
    </section>
  );
}
