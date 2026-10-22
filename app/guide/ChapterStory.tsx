import { chapterLine, frameSize, type Chapter } from "@/lib/guide";
import { render } from "@/lib/markdown-source";
import ShotFrame from "./ShotFrame";

/**
 * One chapter as a story section (spec §6). The server markup is the whole page in reading
 * order: each shot inline, then its steps. On wide screens GuideStoryEnhancer pins the phone
 * column beside the steps and lights the step being read; without it this order stands.
 */
export default function ChapterStory({ chapter, index, headingLevel = 2, eagerFirstShot = false }: {
  chapter: Chapter;
  index: number;
  headingLevel?: 1 | 2;
  /** The page's first shot loads at once; the rest are lazy. */
  eagerFirstShot?: boolean;
}) {
  const Heading = headingLevel === 1 ? "h1" : "h2";
  const shots = chapter.tour?.shots ?? [];
  const frames = shots.map((shot) => frameSize(shot.file));
  const body = chapter.body.trim();

  return (
    <section id={chapter.id} className="guide-chapter" data-guide-story="" aria-labelledby={`${chapter.id}-title`}>
      <p className="guide-kicker">Chapter {index + 1}</p>
      <Heading id={`${chapter.id}-title`} className="guide-chapter-title">{chapter.title}</Heading>
      <p className="guide-lede">{chapterLine(chapter)}</p>

      {shots.length > 0 && (
        <div className="guide-story">
          <div className="guide-steps">
            {shots.map((shot, s) => (
              <div key={shot.file} className="guide-shot-group">
                <div className="guide-inline-shot">
                  <ShotFrame shot={shot} pixels={frames[s].pixels} display={frames[s].display} eager={eagerFirstShot && s === 0} />
                </div>
                <ol className="guide-step-list" start={shot.callouts[0].number}>
                  {shot.callouts.map((callout) => (
                    <li key={callout.number} value={callout.number} className="guide-step"
                      data-shot={s} data-n={callout.number}>
                      <span className="guide-badge" aria-hidden="true">{callout.number}</span>
                      <span>{callout.text}</span>
                    </li>
                  ))}
                </ol>
              </div>
            ))}
          </div>
          <div className="guide-phone-col" aria-hidden="true">
            <div className="guide-phone">
              <div className="guide-screen">
                {shots.map((shot, s) => (
                  <div key={shot.file} className={s === 0 ? "guide-phone-shot is-shown" : "guide-phone-shot"} data-shot={s}>
                    <ShotFrame shot={shot} pixels={frames[s].pixels} display={frames[s].display} decorative
                      eager={eagerFirstShot && s === 0} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {body && <div className="prose guide-body" dangerouslySetInnerHTML={{ __html: render(body) }} />}
    </section>
  );
}
