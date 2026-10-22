import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { describe, it } from 'node:test';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import GuidePage from '../../app/guide/page';
import GuideChapterPage, { generateStaticParams } from '../../app/guide/[chapter]/page';
import { getGuide } from '../guide';

const read = (path: string) => readFileSync(new URL(`../../${path}`, import.meta.url), 'utf8');
const guide = getGuide();
const escape = (text: string) =>
  text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#x27;');
const count = (html: string, needle: string) => html.split(needle).length - 1;

async function chapterHtml(id: string): Promise<string> {
  const element = await GuideChapterPage({ params: Promise.resolve({ chapter: id }) });
  return renderToStaticMarkup(element);
}
const indexHtml = renderToStaticMarkup(createElement(GuidePage));

/** The server markup, read in order, is the whole page: each shot inline, then its steps. */
function assertStory(html: string, id: string): void {
  const chapter = guide.chapters.find(c => c.id === id)!;
  const start = html.indexOf(`<section id="${id}"`);
  assert.ok(start >= 0, `${id}: section with its id`);
  const section = html.slice(start, html.indexOf('</section>', start));
  assert.ok(section.includes(`>${escape(chapter.title)}</`), `${id}: title`);
  let cursor = 0;
  for (const shot of chapter.tour!.shots) {
    const image = section.indexOf(`alt="${escape(shot.alt)}"`, cursor);
    assert.ok(image >= cursor, `${id}: ${shot.file} inline, in order`);
    cursor = image;
    for (const callout of shot.callouts) {
      const step = section.indexOf(`<li value="${callout.number}"`, cursor);
      assert.ok(step > cursor, `${id}: step ${callout.number} follows its shot`);
      assert.ok(section.indexOf(escape(callout.text), step) > step, `${id}: step ${callout.number} text`);
      cursor = step;
    }
    assert.equal(count(section, `alt="${escape(shot.alt)}"`), 1, `${id}: the shot's alt text appears once`);
  }
  // The pinned-phone copies are decorative: hidden from assistive technology, with empty alt.
  const phone = section.slice(section.indexOf('class="guide-phone-col"'));
  assert.match(phone, /^class="guide-phone-col" aria-hidden="true"/);
  assert.equal(count(phone, 'alt=""'), chapter.tour!.shots.length, `${id}: one decorative copy per shot`);
}

describe('/guide is the whole guide on one page', () => {
  it('opens with the movement map, each node linking to its chapter by the chapter title', () => {
    const map = indexHtml.slice(indexHtml.indexOf('class="guide-map"'), indexHtml.indexOf('</nav>'));
    for (const id of ['move', 'jump', 'hold']) {
      const chapter = guide.chapters.find(c => c.id === id)!;
      assert.match(map, new RegExp(`href="#${id}"`), id);
      assert.ok(map.includes(escape(chapter.title)), `${id}: caption is the chapter title`);
    }
  });

  it('then tells every chapter as a story section, in source order', () => {
    const order = [...indexHtml.matchAll(/<section id="([a-z0-9-]+)" class="guide-chapter"/g)].map(m => m[1]);
    assert.deepEqual(order, guide.chapters.map(c => c.id));
    for (const chapter of guide.chapters) assertStory(indexHtml, chapter.id);
  });

  it('draws the end-of-drag hold ring and the press-and-hold double ring from the real data', () => {
    const jump = indexHtml.slice(indexHtml.indexOf('<section id="jump"'), indexHtml.indexOf('<section id="two-fingers"'));
    assert.match(jump, /stroke-dasharray="3 3"/);
    const hold = indexHtml.slice(indexHtml.indexOf('<section id="hold"'), indexHtml.indexOf('<section id="pinch"'));
    assert.match(hold, /stroke-dasharray="3 3"/);
    assert.match(hold, /stroke-dasharray="3 4"/);
  });

  it('groups the overlay per callout, so the story can light one step', () => {
    const jump = indexHtml.slice(indexHtml.indexOf('<section id="jump"'), indexHtml.indexOf('<section id="two-fingers"'));
    for (const n of [1, 2, 3]) assert.ok(count(jump, `class="guide-c" data-n="${n}"`) === 2, `jump callout ${n}: inline and phone`);
  });

  it('routes deeper help to support and shows the version stamp', () => {
    assert.match(indexHtml, /href="\/support"/);
    assert.ok(indexHtml.includes(`Guide for vynr ${guide.appVersion}`));
  });
});

describe('every /guide/<chapter> URL still works', () => {
  it('has one static page per chapter, and no others', () => {
    assert.deepEqual(generateStaticParams(), guide.chapters.map(c => ({ chapter: c.id })));
    assert.match(read('app/guide/[chapter]/page.tsx'), /export const dynamicParams = false/);
  });

  it('renders the chapter in the same story treatment, with its neighbours and the full guide', async () => {
    for (const chapter of guide.chapters) {
      const html = await chapterHtml(chapter.id);
      assertStory(html, chapter.id);
      assert.ok(html.includes(`<h1 id="${chapter.id}-title" class="guide-chapter-title">`), `${chapter.id}: h1`);
      assert.match(html, new RegExp(`href="/guide#${chapter.id}"`));
    }
    const jump = await chapterHtml('jump');
    assert.match(jump, /<a rel="prev" href="\/guide\/move">/);
    assert.match(jump, /<a rel="next" href="\/guide\/two-fingers">/);
  });
});

describe('the guide is discoverable, and complete without JavaScript', () => {
  it('is in the sitemap, chapters included, and in the header and footer', () => {
    const sitemap = read('app/sitemap.xml/route.ts');
    assert.match(sitemap, /\$\{BASE\}\/guide</);
    assert.match(sitemap, /\$\{BASE\}\/guide\/\$\{c\.id\}/);
    assert.match(read('app/layout.tsx'), /href="\/guide"/);
  });

  it('has exactly one client component, which renders nothing and only toggles classes', () => {
    const files = readdirSync(new URL('../../app/guide/', import.meta.url), { recursive: true })
      .map(String).filter(f => /\.tsx?$/.test(f));
    const client = files.filter(f => /['"]use client['"]/.test(read(`app/guide/${f}`)));
    assert.deepEqual(client, ['GuideStoryEnhancer.tsx']);
    const enhancer = read('app/guide/GuideStoryEnhancer.tsx');
    assert.match(enhancer, /return null;\s*}\s*$/);
    assert.doesNotMatch(enhancer, /innerHTML|textContent|createElement|appendChild/);
    assert.equal(renderToStaticMarkup(createElement(GuidePage)).includes('is-enhanced'), false,
      'the server markup is the linear page; enhancement is added only in the browser');
  });

  it('honours Reduce Motion: no animation or transition survives it', () => {
    const css = read('app/globals.css');
    const reduced = css.slice(css.indexOf('@media (prefers-reduced-motion: reduce)', css.indexOf('Guide to vynr (SJAM-1041')));
    assert.match(reduced, /animation: none/);
    assert.match(reduced, /transition: none/);
  });

  it('ships no forms, tracking or fetches', () => {
    for (const file of ['app/guide/page.tsx', 'app/guide/[chapter]/page.tsx', 'app/guide/ChapterStory.tsx',
      'app/guide/ShotFrame.tsx', 'app/guide/MovementMap.tsx', 'app/guide/GuideStoryEnhancer.tsx',
      'lib/guide.ts', 'lib/guide-overlay.ts']) {
      const source = read(file);
      assert.doesNotMatch(source, /<(?:form|input|textarea|button|script)\b/i, file);
      assert.doesNotMatch(source, /analytics|tracking pixel|\bfetch\(/i, file);
    }
  });
});
