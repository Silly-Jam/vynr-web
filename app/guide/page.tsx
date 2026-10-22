import type { Metadata } from "next";
import Link from "next/link";
import { GROUPS, chapterLine, getGuide, versionStamp } from "@/lib/guide";

// The guide is written once, in vynr's guide/chapters (SJAM-1041); this page lays out the
// generated bundle and carries none of its words.
export const metadata: Metadata = {
  title: "Guide to vynr",
  description:
    "How to move around vynr, add and follow your wines, and see them through time: the in-app guide, in full.",
  alternates: { canonical: "/guide" },
};

export default function GuidePage() {
  const guide = getGuide();
  const groups = GROUPS.map((group) => ({
    ...group,
    chapters: guide.chapters.filter((chapter) => chapter.group === group.id),
  })).filter((group) => group.chapters.length > 0);

  return (
    <section className="guide">
      <header className="guide-header">
        <h1>Guide to vynr</h1>
        <p>
          The same guide vynr shows when you first open it, with each page drawn as the app draws
          it: the real screen, what to touch, and the gesture to use.
        </p>
        <div className="guide-rule" />
      </header>

      {groups.map((group) => (
        <section key={group.id} className="guide-group" aria-labelledby={`group-${group.id}`}>
          <h2 id={`group-${group.id}`}>{group.heading}</h2>
          <ul>
            {group.chapters.map((chapter) => (
              <li key={chapter.id}>
                <Link href={`/guide/${chapter.id}`}>{chapter.title}</Link>
                <p>{chapterLine(chapter)}</p>
              </li>
            ))}
          </ul>
        </section>
      ))}

      <div className="prose guide-closing">
        <hr />
        <p>
          If something is unclear or does not work as described, visit <Link href="/support">Support</Link>.
          For planned improvements, see the <Link href="/roadmap">Roadmap</Link>.
        </p>
      </div>
      <p className="guide-stamp">{versionStamp(guide)}</p>
    </section>
  );
}
