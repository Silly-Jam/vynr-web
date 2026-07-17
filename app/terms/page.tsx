import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms of Service for vynr and the vynr+ subscription.",
};

export default function TermsPage() {
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
          Terms of Service
        </h1>
        <p
          style={{
            fontSize: "0.8rem",
            color: "var(--atlas-text-placeholder)",
            letterSpacing: "0.02em",
          }}
        >
          Effective date: July 17, 2026
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
          These Terms of Service (&ldquo;Terms&rdquo;) govern your use of vynr, a
          private personal wine atlas, cellar, and tasting journal for iOS. By
          downloading or using the app, you agree to these Terms. If you do not
          agree, please do not use the app.
        </p>

        <h2>The app</h2>
        <p>
          vynr is a single‑player tool for recording and exploring your own wine
          collection and tasting history. It is provided for personal,
          non‑commercial use. vynr does not operate user accounts; your data is
          stored on your device and, if you enable it, in your personal iCloud
          account. How your information is handled is described in our{" "}
          <a href="https://vynr.app/privacy">Privacy Policy</a>.
        </p>

        <h2>Eligibility</h2>
        <p>
          vynr is intended for adults of legal drinking age in their
          jurisdiction. By using the app you confirm that you meet this
          requirement.
        </p>

        <h2>vynr+ subscription</h2>
        <p>
          Some optional features are offered through <strong>vynr+</strong>, an
          auto‑renewing subscription available as a monthly or annual plan. The
          following terms apply to vynr+:
        </p>
        <ul>
          <li>
            <strong>What you get:</strong> access to the vynr+ features described
            on the subscription screen for the duration of your subscription.
          </li>
          <li>
            <strong>Length and price:</strong> vynr+ is offered on a monthly or
            annual basis. The exact price and billing period for your region are
            shown in the app before you confirm any purchase.
          </li>
          <li>
            <strong>Billing:</strong> payment is charged to your Apple Account at
            confirmation of purchase. Subscriptions are processed and managed by
            Apple through the App Store.
          </li>
          <li>
            <strong>Auto‑renewal:</strong> the subscription automatically renews
            for the same period at the then‑current price unless auto‑renew is
            turned off at least 24 hours before the end of the current period.
          </li>
          <li>
            <strong>Renewal charge:</strong> your Apple Account is charged for
            renewal within 24 hours prior to the end of the current period.
          </li>
          <li>
            <strong>Managing and cancelling:</strong> you can manage or cancel
            your subscription, and turn off auto‑renewal, in your Apple Account
            settings in the App Store after purchase. Cancellation takes effect
            at the end of the current billing period.
          </li>
          <li>
            <strong>Refunds:</strong> refunds are handled by Apple in accordance
            with the App Store terms. We do not process payments or issue refunds
            directly.
          </li>
        </ul>
        <p>
          The core features of vynr — including recording your cellar, journal,
          and tasting notes, and exporting your own data — do not require a
          subscription.
        </p>

        <h2>Your content</h2>
        <p>
          You retain ownership of the entries, notes, ratings, and photos you
          create in vynr. You are responsible for the content you add and for
          keeping your own backups. You can export your data from within the app
          at any time, and uninstalling the app removes local data from your
          device.
        </p>

        <h2>Acceptable use</h2>
        <p>
          You agree not to misuse the app, including attempting to interfere with
          its normal operation, reverse‑engineer it other than as permitted by
          law, or use it for any unlawful purpose.
        </p>

        <h2>Optional AI commentary</h2>
        <p>
          If you request optional AI commentary, limited wine context is sent to
          a proxy service that returns interpretive text. This feature is
          optional and interpretive only; it is not professional advice. See the{" "}
          <a href="https://vynr.app/privacy">Privacy Policy</a> for details on
          what is sent.
        </p>

        <h2>Disclaimers</h2>
        <p>
          vynr is provided &ldquo;as is&rdquo; without warranties of any kind, to
          the fullest extent permitted by law. Reference information about
          regions, producers, and wines is provided for education and context and
          may be incomplete or inaccurate. We do not guarantee that the app will
          be uninterrupted or error‑free.
        </p>

        <h2>Limitation of liability</h2>
        <p>
          To the fullest extent permitted by law, vynr and its makers will not be
          liable for any indirect, incidental, or consequential damages arising
          from your use of the app. Nothing in these Terms limits any rights you
          have under applicable law.
        </p>

        <h2>Changes to these Terms</h2>
        <p>
          We may update these Terms from time to time. Material changes will be
          reflected by updating the effective date above. Continued use of the
          app after changes take effect constitutes acceptance of the updated
          Terms.
        </p>

        <h2>Contact</h2>
        <p>
          For questions about these Terms, contact:{" "}
          <a href="mailto:contact@vynr.app">contact@vynr.app</a>
        </p>
      </article>
    </section>
  );
}
