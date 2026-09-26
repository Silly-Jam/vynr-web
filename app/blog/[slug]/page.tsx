import type { Metadata } from "next";
import Link from "next/link";
import { getAllPosts, getPostBySlug } from "@/lib/posts";
import type { WineData } from "@/lib/posts";
import { remark } from "remark";
import html from "remark-html";
import WineCard from "@/app/components/WineCard";

// Unknown slugs 404 instead of failing to read a missing Markdown file.
export const dynamicParams = false;

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  const url = postPath(slug);
  const image = socialImage(post);
  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: url },
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      url,
      publishedTime: isoDate(post.date),
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: [image.url],
    },
  };
}

function postPath(slug: string): string {
  return `/blog/${slug}`;
}

// A hero image is the post's own picture; otherwise use the generated article card.
function socialImage(post: { slug: string; title: string; heroImage?: string; heroAlt?: string }) {
  if (post.heroImage) {
    return { url: post.heroImage, alt: post.heroAlt || post.title };
  }
  return { url: `/og${postPath(post.slug)}`, width: 1200, height: 630, alt: post.title };
}

// gray-matter parses a bare YAML date into a Date; normalise to YYYY-MM-DD.
function isoDate(date: string | Date): string {
  return new Date(date).toISOString().slice(0, 10);
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  // UTC, so the visible day matches the <time dateTime> (a YAML date is UTC midnight).
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  const wines: WineData[] = (post as { wines?: WineData[] }).wines ?? [];
  const isJournal = (post as { type?: string }).type === "journal";

  // Split content into segments: text and wine placeholders
  const winePattern = /\[WINE:\s*([a-z0-9\-]+)\s*\]/g;
  type Segment = { type: "text"; content: string } | { type: "wine"; id: string };
  const segments: Segment[] = [];
  let lastIndex = 0;

  const content = post.content;
  let match: RegExpExecArray | null;
  while ((match = winePattern.exec(content)) !== null) {
    if (match.index > lastIndex) {
      segments.push({ type: "text", content: content.slice(lastIndex, match.index) });
    }
    segments.push({ type: "wine", id: match[1] });
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < content.length) {
    segments.push({ type: "text", content: content.slice(lastIndex) });
  }

  // If no wine tokens found, treat entire content as a single text segment
  if (segments.length === 0) {
    segments.push({ type: "text", content });
  }

  // Render each text segment through remark
  const renderedSegments = await Promise.all(
    segments.map(async (seg) => {
      if (seg.type === "text") {
        const processed = await remark().use(html).process(seg.content);
        return { type: "html" as const, html: processed.toString() };
      }
      return { type: "wine" as const, id: seg.id };
    })
  );

  // Wrap inline images — journal posts use full-width style, editorial posts use memory-shot
  const cropPositions = ["top", "center", "bottom"];
  let imageCount = 0;

  const processedSegments = renderedSegments.map((seg) => {
    if (seg.type !== "html") return seg;
    const wrapped = seg.html.replace(
      /<p>\s*<img\s+([^>]*?)\/?\s*>\s*<\/p>/g,
      (_match, attrs) => {
        imageCount++;
        if (isJournal) {
          return `<div class="journal-photo"><img ${attrs}></div>`;
        }
        const parity = (imageCount - 1) % 2 === 0 ? "odd" : "even";
        const pos = cropPositions[imageCount - 1] || "center";
        return `<div class="memory-shot memory-shot-${parity} memory-shot-pos-${pos}"><img ${attrs}></div>`;
      }
    );
    return { type: "html" as const, html: wrapped };
  });

  // Inject hero image at the start of content
  const heroAlt = post.heroAlt || post.title;
  if (post.heroImage && processedSegments.length > 0) {
    if (isJournal) {
      // Journal posts: centered block image, same style as inline journal photos
      const heroHtml = `<div class="journal-photo"><img src="${post.heroImage}" alt="${heroAlt.replace(/"/g, "&quot;")}" /></div>`;
      const first = processedSegments[0];
      if (first.type === "html") {
        processedSegments[0] = { type: "html", html: heroHtml + first.html };
      } else {
        // First segment is a wine card — prepend as its own html segment
        processedSegments.unshift({ type: "html" as const, html: heroHtml });
      }
    } else {
      // Editorial posts: floated right, text wraps around
      const heroHtml = `<figure class="hero-float"><img src="${post.heroImage}" alt="${heroAlt.replace(/"/g, "&quot;")}" />${post.heroAlt ? `<figcaption class="journal-caption">${post.heroAlt}</figcaption>` : ""}</figure>`;
      const first = processedSegments[0];
      if (first.type === "html") {
        processedSegments[0] = { type: "html", html: heroHtml + first.html };
      }
    }
  }

  const blogPosting = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: isoDate(post.date),
    url: `https://vynr.app${postPath(slug)}`,
    mainEntityOfPage: `https://vynr.app${postPath(slug)}`,
    image: new URL(socialImage(post).url, "https://vynr.app").toString(),
    ...(post.tags && { keywords: post.tags.join(", ") }),
    publisher: { "@type": "Organization", name: "Silly Jam Pte. Ltd." },
  };

  return (
    <section
      style={{
        maxWidth: isJournal ? 480 : 720,
        margin: "0 auto",
        padding: "48px 24px 80px",
      }}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPosting).replace(/</g, "\\u003c") }}
      />
      <Link
        href="/blog"
        style={{
          display: "inline-block",
          fontSize: "0.8rem",
          color: "var(--atlas-tint)",
          textDecoration: "none",
          marginBottom: "2rem",
          letterSpacing: "0.02em",
        }}
      >
        <span aria-hidden="true">&larr;</span> Blog
      </Link>

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
          {post.title}
        </h1>
        <time
          dateTime={isoDate(post.date)}
          style={{
            fontSize: "0.8rem",
            color: "var(--atlas-text-placeholder)",
            letterSpacing: "0.02em",
          }}
        >
          {formatDate(String(post.date))}
        </time>
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
        {processedSegments.map((seg, i) => {
          if (seg.type === "html") {
            return <div key={i} dangerouslySetInnerHTML={{ __html: seg.html }} />;
          }
          const wine = wines.find((w) => w.id === seg.id);
          if (!wine) return null;
          return <WineCard key={i} wine={wine} />;
        })}
      </article>
    </section>
  );
}
