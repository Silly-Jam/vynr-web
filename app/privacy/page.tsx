import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How vynr handles your data.",
};

export default function PrivacyPage() {
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
          Privacy Policy
        </h1>
        <p
          style={{
            fontSize: "0.8rem",
            color: "var(--atlas-text-placeholder)",
            letterSpacing: "0.02em",
          }}
        >
          Effective date: September 25, 2026
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
        <p>
          vynr is designed to be a calm, private, user-owned wine journal and
          atlas. Most of your information stays on your device and under your
          control. We do not sell your data, run advertising networks, or track
          you across apps or websites.
        </p>

        <h2>What data vynr processes</h2>
        <p>You may create or capture the following information inside the app:</p>
        <ul>
          <li>Cellar entries, quantities, storage locations, and purchase notes</li>
          <li>Wine details such as producer, cuvée, vintage, grapes, and place</li>
          <li>Tasting notes, ratings, journal entries, and optional annotations</li>
          <li>Label and journal photos you choose to keep</li>
        </ul>
        <p>
          This information provides cellar management, journaling, navigation,
          search, and the optional services described below. It is not publicly
          visible unless you explicitly publish a shared cellar.
        </p>

        <h2>Where your data lives</h2>
        <ul>
          <li>
            By default, your data is stored locally on your device.
          </li>
          <li>
            If iCloud is on for vynr, the data is stored in your private
            iCloud database using Apple CloudKit.
          </li>
        </ul>
        <p>
          vynr does not operate sign-in accounts. Optional Share and Assistant
          Link services use a random, keychain-backed service identifier rather
          than your Apple Account or a hardware device identifier.
        </p>

        <h2>Photos and scanning</h2>
        <p>
          Ordinary label scanning and text recognition happen on-device. Label
          images are kept inside the app on your device.
        </p>

        <h2>AI Commentary (optional)</h2>
        <p>
          If you request AI Commentary, the app sends limited, impersonal wine
          and Atlas context to a Cloudflare Worker proxy, which forwards the
          request to an AI provider and returns text to your device. The request
          cannot represent tasting notes, ratings, journal text, journal photos,
          or other user-authored personal content, and the proxy rejects those
          fields recursively. Reference-only responses may be cached for up to
          seven days without a user or device identifier.
        </p>

        <h2>AI Fix / label review (optional)</h2>
        <p>
          If you explicitly ask AI Fix to take another look, vynr sends the label
          photo, the text it read, and the details on the current scan form to the
          AI proxy and its configured AI provider. Before the first manual upload,
          the app shows this disclosure.
        </p>
        <p>
          For Cellar Health, vynr sends each eligible wine&apos;s saved label photo,
          the text read from that photo, and the wine&apos;s stored details through the
          same proxy and AI provider. Cellar Health has its own first-use
          disclosure, separate from a manual AI Fix disclosure.
        </p>
        <p>
          Neither flow sends your notes, tastings, or journal. The image is
          discarded after servicing the request; only derived repair fields may be
          cached for up to 24 hours by label fingerprint.
        </p>

        <h2>Evolution guide reads (optional)</h2>
        <p>
          When you ask vynr to read a bottle&apos;s evolution (&ldquo;vynr&apos;s
          guide&rdquo;), the request works like AI commentary: limited wine
          context — producer, cuvée, vintage, region, appellation, grape, and
          the wine&apos;s current window — is sent to our proxy service, and the
          guide&apos;s answer is returned to your device.
        </p>
        <p>
          To improve vynr&apos;s reference data, the proxy also keeps an
          anonymous, wine‑scoped record of each guide read: the wine&apos;s
          identity and the guide&apos;s proposed drinking window. This record
          contains no account, device, session, or network identity — it cannot
          be linked to you or to your cellar. Raw records expire after 90 days;
          beyond that, only normalized wine‑level observations (for example,
          &ldquo;this wine was asked about, and the guide proposed this
          window&rdquo;) are kept, and they are used solely to prioritise and
          research vynr&apos;s built‑in wine knowledge. This is independent of
          any usage‑data setting and applies only when you invoke the guide.
        </p>

        <h2>Shared Cellars and Assistant Link (optional)</h2>
        <p>
          If you publish a shared cellar, vynr uploads the fields you select,
          which may include label photos, owner notes, and selected journal
          marginalia. These services use a keychain-backed random identifier so
          published data can be retrieved and revoked. Published service data is
          retained until you delete it with the corresponding in-app control,
          except that an Assistant Link snapshot is also deleted automatically
          in the cases described under &ldquo;Subscription records (vynr+)&rdquo;
          below. Revoking stops access immediately but does not itself delete
          anything; the content stays until you delete it or that automatic
          cleanup removes it.
        </p>

        <h3>Assistant Link is strictly opt-in</h3>
        <p>
          Nothing is uploaded until you turn Assistant Link on and publish. You
          choose what the redacted, read-only snapshot includes, for example
          whether to include your palate; it may include derived rating
          summaries. Free-text tasting notes, prices, storage locations, device
          identifiers and exact bottle counts are never included. You then
          connect an assistant yourself, by adding your private link to ChatGPT,
          Claude, Gemini or another assistant you choose.
        </p>
        <p>
          <strong>What vynr handles, and what your assistant provider handles.</strong>{" "}
          vynr stores the snapshot you published and serves it only to an
          assistant that holds your link. When your assistant asks your link a
          question, vynr receives that request (for example, a dish to pair) and
          uses it only to answer. vynr does not store it, and it never sees the
          rest of your conversation. Your questions, the snapshot data your
          assistant reads, and its answers are handled by that provider under
          its own terms and privacy policy, not this one.
        </p>

        <h3>Subscription records (vynr+)</h3>
        <p>
          Assistant Link is part of vynr+. To decide whether your link may
          answer, the app sends Apple&apos;s signed subscription record to our
          link service, and Apple sends it subscription status notifications
          (renewal, billing grace, refund, expiry). Apple&apos;s record also
          contains details such as the price and storefront; vynr checks the
          record&apos;s signature and discards those details. Apple never sends
          vynr your payment method, name, email address or Apple Account
          details. vynr keeps only what it needs to decide access:
        </p>
        <ul>
          <li>a keyed one-way code derived from your subscription&apos;s transaction ID;</li>
          <li>the subscription&apos;s current state and access end date;</li>
          <li>which of your service identifiers it covers.</li>
        </ul>
        <p>
          This record is pseudonymous, but it is linked to your Assistant Link,
          so it is not anonymous. It is used only to authorize and operate
          Assistant Link, and never to identify you in the real world, for
          marketing or advertising, for profiling, for sale or data brokerage,
          or to enrich any other product or service.
        </p>
        <p>
          Listing, revoking and deleting your links are free on every tier,
          with or without vynr+. If vynr+ lapses, your link stops answering at
          once, and its snapshot is deleted automatically 7 days later. A link
          that never had vynr+ access (one created before Assistant Link joined
          vynr+) has its snapshot deleted by the same scheduled cleanup 7 days
          after the later of the date this cleanup began and the link&apos;s
          last update.
          Deleting your last link deletes every link between those records and
          you. Two things are kept afterwards:
        </p>
        <ul>
          <li>a record that a free trial was used, so the trial cannot be repeated;</li>
          <li>
            for a refunded or expired subscription, its one-way code and access
            state, with no link to you, so an old purchase record cannot be
            replayed to regain access.
          </li>
        </ul>
        <p>
          Apple notification identifiers are kept for up to 31 days (a daily
          cleanup removes them once they are 30 days old), only to avoid
          applying the same notification twice.
        </p>

        <h2>Anonymous usage data (optional)</h2>
        <p>
          The &ldquo;Share Anonymous Usage Data&rdquo; setting is off by default.
          If you enable it, vynr sends content-free feature counters to a
          separate Cloudflare Worker. It sends no text, photos, wine names,
          notes, or user or device identifier. Aggregate counters expire after
          30 days.
        </p>

        <h2>Diagnostics</h2>
        <p>
          vynr contains no advertising, analytics, or crash-reporting SDK.
          Apple may provide App Store or TestFlight crash and performance
          diagnostics under Apple&apos;s own privacy controls and policy.
        </p>

        <h2>What we do not do</h2>
        <ul>
          <li>We do not sell your data.</li>
          <li>We do not track you across apps or websites.</li>
          <li>We do not run advertising networks.</li>
          <li>
            We do not send your notes, tastings, ratings, or journal content to
            the AI providers behind AI Commentary, AI Fix, or guide reads. If
            you connect Assistant Link, the assistant you choose reads the
            redacted projection, which may include derived rating summaries.
          </li>
          <li>We do not use your private journal to train public models.</li>
        </ul>

        <h2>Your control</h2>
        <ul>
          <li>
            You can use the app without iCloud backup by turning off iCloud access
            for vynr in iOS Settings.
          </li>
          <li>You can delete individual entries inside the app at any time.</li>
          <li>
            Settings → Delete All Wine Data permanently removes wine records,
            saved label images, retained import source files, and associated
            import history from this device and your private iCloud backup.
            Journal entries and cellar layout remain on your device and, if
            iCloud is on, are backed up again.
          </li>
          <li>
            You can revoke or delete Share and Assistant Link publications.
            Revoking stops access; deleting removes the published content.
          </li>
          <li>You can disable anonymous usage data and AI Commentary in Settings.</li>
          <li>
            Uninstalling the app removes local data from the device, but does
            not delete published Share or Assistant Link data. Use the in-app
            revoke or delete control for those services.
          </li>
        </ul>

        <h2>Third-party services</h2>
        <p>
          Depending on the features you choose, vynr uses Apple CloudKit,
          Cloudflare Workers, KV, D1 and R2, and configured AI providers. An
          assistant you connect through Assistant Link is chosen by you and
          works under its provider&apos;s own terms. We minimise
          what is sent and use it only to provide the
          requested feature, operate the service, prevent abuse, or maintain
          the short-lived caches described above.
        </p>

        <h2>Children</h2>
        <p>vynr is intended for adults of legal drinking age.</p>

        <h2>Contact</h2>
        <p>
          For privacy questions, contact: <a href="mailto:contact@vynr.app">contact@vynr.app</a>
        </p>
      </article>
    </section>
  );
}
