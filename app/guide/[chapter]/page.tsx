import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import GuideFigure from "../GuideFigure";
import { chapterLine, frameSize, getChapter, getGuide, neighbours, versionStamp } from "@/lib/guide";
import { render } from "@/lib/markdown-source";

// Only the bundle's chapters exist; any other slug 404s instead of failing a lookup.
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
  const { previous, next } = neighbours(chapter.id);
  const body = chapter.body.trim();

  return (
    <article className="guide">
      <header className="guide-header">
        <p className="guide-back"><Link href="/guide">Guide to vynr</Link></p>
        <h1>{chapter.title}</h1>
        <p>{chapterLine(chapter)}</p>
        <div className="guide-rule" />
      </header>

      {chapter.tour?.shots.map((shot) => {
        const { pixels, display } = frameSize(shot.file);
        return <GuideFigure key={shot.file} shot={shot} pixels={pixels} display={display} />;
      })}

      {body && <div className="prose guide-body" dangerouslySetInnerHTML={{ __html: render(body) }} />}

      <nav className="guide-nav" aria-label="Guide chapters">
        {previous ? <Link href={`/guide/${previous.id}`} rel="prev">← {previous.title}</Link> : <span />}
        {next ? <Link href={`/guide/${next.id}`} rel="next">{next.title} →</Link> : <span />}
      </nav>
      <p className="guide-stamp">{versionStamp(getGuide())}</p>
    </article>
  );
}
