import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Support",
  description: "Help with vynr, label scans, your data, and vynr+.",
};

export default function SupportPage() {
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
          Support
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
          vynr is made by a small, independent team. If something in the app is
          wrong or unclear, write to us. Messages are read by a person and are
          typically answered within a few days.
        </p>
        <p>
          <a href="mailto:support@vynr.app" style={{ overflowWrap: "anywhere" }}>
            support@vynr.app
          </a>
        </p>
        <p>
          Include your iPhone model and iOS version. For a scan problem, attach
          the diagnostic bundle described below.
        </p>

        <hr />

        <h2>A label scan read something wrong.</h2>
        <p>
          You can edit the fields before saving a scan, or edit the wine later.
          If you choose AI Fix, read the details in our <Link href="/privacy">Privacy Policy</Link>.
        </p>
        <p>
          To send a useful diagnostic, open the saved Wine detail, choose the
          overflow menu, then choose <strong>Capture Details</strong> and
          <strong> Send to Support</strong>. The bundle contains the label image
          and scanner output; it does not include anything from your journal.
        </p>

        <h2>Where is my data, and how do I back it up or delete it?</h2>
        <p>By default, your data is stored locally on your device.</p>
        <p>
          If iCloud is on for vynr, the data is stored in your private iCloud
          database using Apple CloudKit.
        </p>
        <p>
          Settings → Delete All Wine Data permanently removes wine records,
          saved label images, retained import source files, and associated import
          history from this device and your private iCloud backup. Journal
          entries and cellar layout remain on your device and, if iCloud is on,
          are backed up again.
        </p>
        <p>
          Uninstalling the app removes local data from the device, but does not
          delete published Share or Assistant Link data. Use the in-app revoke
          or delete control for those services.
        </p>

        <h2>How do I manage or cancel vynr+, or ask for a refund?</h2>
        <p>
          Manage or cancel vynr+ in your Apple Account subscriptions. A
          cancellation takes effect at the end of the current billing period.
          For a refund request, use Apple&apos;s{" "}
          <a href="https://reportaproblem.apple.com">Report a Problem</a> service.
          We can help explain the steps, but Apple manages purchases and refunds.
        </p>
        <p>
          Your core cellar, journal, tasting, and export features remain available
          without a subscription. See the <Link href="/terms">Terms of Use</Link> for
          the subscription terms.
        </p>
      </article>
    </section>
  );
}
