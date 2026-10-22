import type { Metadata } from "next";
import Link from "next/link";
import { GROUPS, getGuide, versionStamp } from "@/lib/guide";
import ChapterStory from "./ChapterStory";
import GuideStoryEnhancer from "./GuideStoryEnhancer";
import MovementMap from "./MovementMap";

// The whole guide on one page (spec §6, the scrolling story). The guide is written once, in
// vynr's guide/chapters (SJAM-1041); this page lays out the generated bundle and carries none
// of its teaching words.
export const metadata: Metadata = {
  title: "Guide to vynr",
  description:
    "How to move around vynr, add and follow your wines, and see them through time: the in-app guide, in full.",
  alternates: { canonical: "/guide" },
};

export default function GuidePage() {
  const guide = getGuide();
  const firstOfGroup = new Map(
    GROUPS.map((group) => [guide.chapters.find((c) => c.group === group.id)?.id, group.heading] as const),
  );

  return (
    <div className="guide">
      <header className="guide-header">
        <p className="guide-kicker">Guide to vynr · {versionStamp(guide)}</p>
        <h1>How vynr moves, and what each view is for</h1>
        <p>Every page of the in-app guide, drawn the way the app draws it: the real screen, what to touch, and the gesture to use.</p>
        <div className="guide-rule" />
      </header>

      <MovementMap />

      {guide.chapters.map((chapter, index) => (
        <div key={chapter.id}>
          {firstOfGroup.has(chapter.id) && <h2 className="guide-group-heading">{firstOfGroup.get(chapter.id)}</h2>}
          <ChapterStory chapter={chapter} index={index} />
        </div>
      ))}

      <div className="prose guide-closing">
        <hr />
        <p>
          If something is unclear or does not work as described, visit <Link href="/support">Support</Link>.
          For planned improvements, see the <Link href="/roadmap">Roadmap</Link>.
        </p>
      </div>
      <p className="guide-stamp">{versionStamp(guide)}</p>
      <GuideStoryEnhancer />
    </div>
  );
}
