import { ImageResponse } from "next/og";
import { getAllPosts, getPostBySlug } from "@/lib/posts";

// Article-specific social card for blog posts without a hero image.
// Colours mirror the papyrus tokens in app/globals.css.
const SIZE = { width: 1200, height: 630 };

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: "#fdf6e3",
          color: "#3D3528",
        }}
      >
        <div style={{ fontSize: 28, letterSpacing: "0.08em", color: "#6B614E" }}>
          vynr · journal
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 76, fontWeight: 600, lineHeight: 1.1, letterSpacing: "-0.02em" }}>
            {post.title}
          </div>
          <div style={{ width: 64, height: 3, background: "#8B7355", margin: "36px 0" }} />
          {post.description && (
            <div style={{ fontSize: 30, lineHeight: 1.4, color: "#6B614E", maxWidth: 960 }}>
              {post.description}
            </div>
          )}
        </div>
        <div style={{ fontSize: 26, color: "#6B614E" }}>vynr.app</div>
      </div>
    ),
    SIZE
  );
}
