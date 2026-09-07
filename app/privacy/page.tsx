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
          Effective date: September 7, 2026
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
            If you enable iCloud backup, the data is stored in your private
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
          If you explicitly ask AI Fix to take another look, vynr sends the
          label photo, the text it read, and the details on the current scan form
          to the AI proxy and its configured AI provider. Before the first
          upload, the app shows this disclosure. It does not send your notes,
          tastings, or journal. The image is discarded after servicing the
          request; only derived repair fields may be cached for up to 24 hours
          by label fingerprint.
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
          marginalia. If you enable Assistant Link, vynr uploads a redacted,
          read-only projection that may include derived rating summaries. These
          services use a keychain-backed random identifier so published data can
          be retrieved and revoked. Published service data is retained until
          you use the corresponding revoke or delete control.
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
          <li>We do not send private cellar or journal content to AI providers.</li>
          <li>We do not use your private journal to train public models.</li>
        </ul>

        <h2>Your control</h2>
        <ul>
          <li>You can use the app without iCloud sync.</li>
          <li>You can delete individual entries inside the app at any time.</li>
          <li>
            Settings → Delete All Wine Data permanently removes your wine
            records and saved label images from this device and clears your
            private iCloud backup for vynr.
          </li>
          <li>You can revoke or delete Share and Assistant Link publications.</li>
          <li>You can disable anonymous usage data and AI Commentary in Settings.</li>
          <li>Uninstalling the app removes local data from the device.</li>
        </ul>

        <h2>Third-party services</h2>
        <p>
          Depending on the features you choose, vynr uses Apple CloudKit,
          Cloudflare Workers and KV, and configured AI providers. We minimise
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
