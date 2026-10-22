import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { describe, it } from 'node:test';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import GuidePage from '../../app/guide/page';
import GuideChapterPage, { generateStaticParams } from '../../app/guide/[chapter]/page';
import { getGuide } from '../guide';

const read = (path: string) => readFileSync(new URL(`../../${path}`, import.meta.url), 'utf8');
const guide = getGuide();
const escape = (text: string) => text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#x27;');

async function chapterHtml(id: string): Promise<string> {
  const element = await GuideChapterPage({ params: Promise.resolve({ chapter: id }) });
  return renderToStaticMarkup(element);
}

describe('every chapter page renders the tour page as the app draws it', () => {
  it('has one static page per chapter, and no others', () => {
    assert.deepEqual(generateStaticParams(), guide.chapters.map(c => ({ chapter: c.id })));
    assert.match(read('app/guide/[chapter]/page.tsx'), /export const dynamicParams = false/);
  });

  it('renders each shot as its capture, its overlay and its full numbered callout list', async () => {
    for (const chapter of guide.chapters) {
      const html = await chapterHtml(chapter.id);
      assert.ok(html.includes(`<h1>${escape(chapter.title)}</h1>`), `${chapter.id}: title`);
      for (const shot of chapter.tour!.shots) {
        assert.ok(html.includes(`src="/guide/${shot.file}"`), `${chapter.id}: ${shot.file}`);
        assert.ok(html.includes(`alt="${escape(shot.alt)}"`), `${chapter.id}: alt for ${shot.file}`);
        for (const callout of shot.callouts) {
          assert.ok(html.includes(`<li value="${callout.number}">`), `${chapter.id}: item ${callout.number}`);
          assert.ok(html.includes(escape(callout.text)), `${chapter.id}: callout ${callout.number}`);
        }
      }
      const overlays = html.match(/<svg[^>]*aria-hidden="true"/g) ?? [];
      assert.equal(overlays.length, chapter.tour!.shots.length, `${chapter.id}: one decorative overlay per shot`);
    }
  });

  it('draws the end-of-drag hold ring and the press-and-hold double ring from the real data', async () => {
    const jump = await chapterHtml('jump');
    assert.match(jump, /stroke-dasharray="3 3"/);
    const hold = await chapterHtml('hold');
    assert.match(hold, /stroke-dasharray="3 3"/);
    assert.match(hold, /stroke-dasharray="3 4"/);
  });

  it('links its neighbours in source order and stamps the version it describes', async () => {
    const html = await chapterHtml('jump');
    assert.match(html, /<a rel="prev" href="\/guide\/move">/);
    assert.match(html, /<a rel="next" href="\/guide\/two-fingers">/);
    assert.ok(html.includes(`Guide for vynr ${guide.appVersion}`));
  });
});

describe('the /guide index', () => {
  const html = renderToStaticMarkup(createElement(GuidePage));

  it('lists every chapter in source order under its group heading', () => {
    const order = [...html.matchAll(/href="\/guide\/([a-z0-9-]+)"/g)].map(m => m[1]);
    assert.deepEqual(order, guide.chapters.map(c => c.id));
    for (const heading of ['Getting around', 'Your wines', 'Time and memory']) assert.ok(html.includes(`>${heading}</h2>`), heading);
    assert.ok(!html.includes('>Your data</h2>'), 'an empty group is not shown');
  });

  it('routes deeper help to support and shows the version stamp', () => {
    assert.match(html, /href="\/support"/);
    assert.ok(html.includes(`Guide for vynr ${guide.appVersion}`));
  });
});

describe('the guide is discoverable and static', () => {
  it('is in the sitemap, chapters included, and in the header and footer', () => {
    const sitemap = read('app/sitemap.xml/route.ts');
    assert.match(sitemap, /\$\{BASE\}\/guide</);
    assert.match(sitemap, /\$\{BASE\}\/guide\/\$\{c\.id\}/);
    assert.match(read('app/layout.tsx'), /href="\/guide"/);
  });

  it('ships no client JavaScript, forms, tracking or fetches', () => {
    for (const file of ['app/guide/page.tsx', 'app/guide/[chapter]/page.tsx', 'app/guide/GuideFigure.tsx', 'lib/guide.ts', 'lib/guide-overlay.ts']) {
      const source = read(file);
      assert.doesNotMatch(source, /['"]use client['"]/, file);
      assert.doesNotMatch(source, /<(?:form|input|textarea|button|script)\b/i, file);
      assert.doesNotMatch(source, /analytics|tracking pixel|\bfetch\(/i, file);
    }
  });
});
