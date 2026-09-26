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
        <p>Each release sits in one of three places:</p>
        <ul>
          <li>
            <strong>Launch</strong> &mdash; version 1.2, what vynr is built on.
          </li>
          <li>
            <strong>Planned next</strong> &mdash; the 1.2.x updates and 1.3.
            This is our intended focus; individual items may change, and not
            every one will arrive together.
          </li>
          <li>
            <strong>Directional later</strong> &mdash; 1.4 to 1.6 and beyond.
            A proposed order; scope and timing may change.
          </li>
        </ul>
        <p>
          Which of these would matter most to you?{" "}
          <Link href="/contact">Tell us</Link>.
        </p>

        <h2>Launch</h2>

        <h3>1.2 &mdash; the launch release</h3>
        <ul>
          <li>Label scanning and manual entry.</li>
          <li>Cellar and storage views, as a treemap or a list.</li>
          <li>The Atlas, producer pages and Vynrpedia.</li>
          <li>Drinking windows and the Time Lens, back through your history and forward.</li>
          <li>A journal of tastings, notes and photographs, with analytical tasting.</li>
          <li>Shared cellars that readers can explore in the app or the web viewer.</li>
          <li>
            iCloud backup and restore, and full export. This is backup, not live
            sync between devices.
          </li>
        </ul>
        <p>
          Free includes analytical tasting, your own wine records, backup and
          export. vynr+ adds room for a larger collection, the forward Time
          Lens beyond six months, Assistant Link, multiple cellars, and richer
          journal composition and publishing. The{" "}
          <Link href="/guide">Guide to vynr</Link> walks through the launch
          release.
        </p>

        <h2>How vynr develops</h2>
        <p>
          Four kinds of work move at different speeds. These are the rhythms we
          intend, not fixed delivery dates.
        </p>
        <ul>
          <li>
            <strong>Fix and refine (1.2.1, 1.2.2, &hellip;).</strong> Weekly
            app updates at first, easing to every two weeks as things settle.
            They refine existing features rather than add new ones; urgent
            reliability fixes can arrive sooner.
          </li>
          <li>
            <strong>Reference data.</strong> Weekly updates to producers,
            places, grapes, ageing guidance, education and Vynrpedia. These
            reach the app without an app update, and each week&rsquo;s changes
            are published in <Link href="/revisions">Revisions</Link>.
          </li>
          <li>
            <strong>Label reading.</strong> Accuracy improvements every two
            weeks to monthly, delivered inside the 1.2.x updates: better
            recognition of producers, cuvées and designations, and a way to
            pick the intended bottle when a photograph holds several. When a
            label fails because a producer or place is missing, we add the
            reference data rather than bend the reader around the gap.
          </li>
          <li>
            <strong>New capabilities (1.3, 1.4, &hellip;).</strong> Roughly one
            release a quarter after launch, each centred on one theme. What is
            free and what is vynr+ is settled before the work begins.
          </li>
        </ul>
        <p>
          Reference data will keep growing: more producers, more complete
          regional geography including more vineyard-level detail, grape
          identities, ageing and vintage guidance, and further educational
          material.
        </p>

        <h2>Planned next</h2>

        <h3>1.2.1 &mdash; the first update</h3>
        <ul>
          <li>
            CellarTracker import returns. It was held out of the launch release
            only to keep that release simple.
          </li>
          <li>
            Smoother manual entry when a scan fails or is only partly read.
          </li>
          <li>A clearer Restore from iCloud screen.</li>
        </ul>

        <h3>Later 1.2.x updates</h3>
        <ul>
          <li>Continued backup and restore improvements.</li>
          <li>
            Refinements to the maturity views and the Time Lens, and a quicker
            route from the Time Lens to the Journal.
          </li>
          <li>
            Easier Assistant Link setup, recovery when a connection goes stale,
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

        <h3>1.3 &mdash; Journal, learn and teach</h3>
        <p>
          The first feature release after launch. It centres on tasting
          occasions that stay part of your record, and on a closer connection
          between tasting, the Journal and learning. These are candidate
          enhancements, not a committed checklist.
        </p>
        <ul>
          <li>
            <strong>Tasting events.</strong> Start an empty tasting, add wines
            as you taste them, and come back to it later.
          </li>
          <li>
            <strong>Tasted, not owned.</strong> Wines you tasted stay distinct
            from bottles you own and never count towards your bottle allowance,
            with an explicit step if you later add one to a cellar.
          </li>
          <li>
            <strong>A lasting record.</strong> Revisit, annotate and export a
            completed tasting, with a photographic keepsake.
          </li>
          <li>
            <strong>Notes that teach.</strong> Tasting notes and marginalia
            linked to Atlas places and Vynrpedia concepts.
          </li>
          <li>
            <strong>Analytical tasting, extended.</strong> Appearance, nose,
            palate, finish and conclusion with one consistent vocabulary,
            colour choices suited to each wine type, free text where you want
            it, and linked explanations.
          </li>
          <li>
            <strong>Vynrpedia throughout the app</strong>, and a clearer way to
            review scan details that were set aside for checking.
          </li>
          <li>
            <strong>Blind-tasting sets.</strong> Write the note, reveal the
            wine, then compare with vynr&rsquo;s reference information.
          </li>
          <li>
            <strong>Study sets</strong> drawn from journal entries, and composed
            study notes and exports.
          </li>
          <li>
            <strong>Teaching.</strong> Tasting sets published to students,
            building on shared cellars that already carry notes and journal
            entries.
          </li>
        </ul>
        <p>
          Analytical tasting stays free. Capturing and keeping your own tasting
          history will not be taken away. Paid additions would build on that
          record &mdash; composing, organising, teaching and publishing
          &mdash; and their exact boundaries are still to be decided.
        </p>

        <h2>Directional later</h2>
        <p>
          A proposed order after 1.3. These versions are not scheduled, and
          individual capabilities may move between them or change.
        </p>

        <h3>1.4 &mdash; Plan and be reminded</h3>
        <ul>
          <li>Drink-window notifications and &ldquo;ready soon&rdquo; summaries.</li>
          <li>
            A view of what peaks across the whole cellar, and where drinking
            windows crowd together.
          </li>
          <li>
            Deeper Assistant Link support, including food pairing and
            automatically refreshed cellar snapshots.
          </li>
        </ul>

        <h3>1.5 &mdash; Your taste</h3>
        <ul>
          <li>A visible profile of what you tend to enjoy.</li>
          <li>
            Explanations of why a wine may suit you, and recommendations
            informed by your own tastings.
          </li>
          <li>Journal chapters that draw connections across your past experiences.</li>
          <li>Your own annotations in the Atlas.</li>
        </ul>

        <h3>1.6 &mdash; Everywhere</h3>
        <ul>
          <li>
            Live sync between devices, separate from the backup and restore in
            1.2.
          </li>
          <li>iPad and Mac, after live sync.</li>
          <li>Siri and Shortcuts.</li>
          <li>A quick capture for noting a bottle when there is no time to stop.</li>
        </ul>

        <h3>Under consideration</h3>
        <p>None of these has a version or a settled scope.</p>
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
