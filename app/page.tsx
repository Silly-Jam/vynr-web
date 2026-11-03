import Link from "next/link";
import Image from "next/image";
import { APP_STORE_URL } from "@/lib/app-store";

export default function Home() {
  return (
    <section
      style={{
        position: "relative",
        flex: 1,
        width: "100%",
        maxWidth: 600,
        margin: "0 auto",
        padding: "clamp(36px, 9vw, 64px) 24px clamp(38px, 9vw, 60px)",
        textAlign: "center",
      }}
    >
      {/* Faint antique Mappe-Monde filling the hero canvas (behind everything) */}
      <div className="hero-map" aria-hidden="true" />

      <h1
        style={{
          fontSize: "3.2rem",
          fontWeight: 600,
          letterSpacing: "-0.03em",
          lineHeight: 1.1,
          color: "var(--atlas-text)",
        }}
      >
        Vynr
      </h1>

      <p
        style={{
          marginTop: "1.25rem",
          fontSize: "1.1rem",
          color: "var(--atlas-text-secondary)",
          letterSpacing: "0.02em",
          lineHeight: 1.5,
        }}
      >
        Your wines. In place. In time.
      </p>

      {/* Hero — wine glass illustration */}
      <div style={{ marginTop: "clamp(0.75rem, 4vw, 3.5rem)", marginBottom: "0.5rem" }}>
        <Image
          src="/journal/vynr-glass.png"
          alt="A wine glass, ink illustration"
          width={240}
          height={240}
          style={{ width: "clamp(168px, 46vw, 240px)", height: "auto", margin: "0 auto", display: "block" }}
          priority
        />
      </div>

      <p
        style={{
          fontSize: "1.05rem",
          fontWeight: 600,
          color: "var(--atlas-text)",
          letterSpacing: "-0.01em",
        }}
      >
        Map your taste.
      </p>

      <p
        style={{
          marginTop: "0.5rem",
          fontSize: "0.85rem",
          color: "var(--atlas-text-secondary)",
          letterSpacing: "0.01em",
          lineHeight: 1.5,
        }}
      >
        Available on the App Store now.
      </p>

      <a
        href={APP_STORE_URL}
        target="_blank"
        rel="noopener noreferrer"
        style={{ display: "inline-block", marginTop: "1.25rem" }}
      >
        <Image
          src="/app-store-badge.svg"
          alt="Download on the App Store"
          width={120}
          height={40}
          style={{ display: "block" }}
        />
      </a>

      <div style={{ marginTop: "clamp(1.25rem, 5vw, 2rem)" }}>
        <Link
          href="/blog"
          style={{
            fontSize: "0.85rem",
            color: "var(--atlas-tint)",
            textDecoration: "none",
            borderBottom: "1px solid var(--atlas-separator)",
            paddingBottom: "2px",
            letterSpacing: "0.02em",
            transition: "color 0.15s ease",
          }}
        >
          Read the blog
        </Link>
      </div>

      <p
        style={{
          marginTop: "clamp(1.5rem, 7vw, 3rem)",
          fontSize: "0.7rem",
          letterSpacing: "0.15em",
          textTransform: "uppercase" as const,
          color: "var(--atlas-separator)",
        }}
      >
        est. 2026
      </p>
    </section>
  );
}
