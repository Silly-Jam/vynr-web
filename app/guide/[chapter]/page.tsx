import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ChapterStory from "../ChapterStory";
import GuideStoryEnhancer from "../GuideStoryEnhancer";
import { chapterLine, getChapter, getGuide, neighbours, versionStamp } from "@/lib/guide";

// One chapter on its own, in the same story treatment as /guide (spec §6). Only the bundle's
// chapters exist; any other slug 404s instead of failing a lookup.
export const dynamicParams = false;

export function generateStaticParams() {
  return getGuide().chapters.map((chapter) => ({ chapter: chapter.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ chapter: string }> }): Promise<Metadata> {
  const { chapter: id } = await params;
  const chapter = getChapter(id);
  if (!chapter) return {};
  return {
    title: `${chapter.title} · Guide to vynr`,
    description: chapterLine(chapter),
    alternates: { canonical: `/guide/${chapter.id}` },
  };
}

export default async function GuideChapterPage({ params }: { params: Promise<{ chapter: string }> }) {
  const { chapter: id } = await params;
  const chapter = getChapter(id);
  if (!chapter) notFound();
  const guide = getGuide();
  const index = guide.chapters.findIndex((c) => c.id === chapter.id);
  const { previous, next } = neighbours(chapter.id);

  return (
    <div className="guide">
      <p className="guide-back"><Link href={`/guide#${chapter.id}`}>The full Guide to vynr</Link></p>
      <ChapterStory chapter={chapter} index={index} headingLevel={1} eagerFirstShot />
      <nav className="guide-nav" aria-label="Guide chapters">
        {previous ? <Link href={`/guide/${previous.id}`} rel="prev">← {previous.title}</Link> : <span />}
        {next ? <Link href={`/guide/${next.id}`} rel="next">{next.title} →</Link> : <span />}
      </nav>
      <p className="guide-stamp">{versionStamp(guide)}</p>
      <GuideStoryEnhancer />
    </div>
  );
}
