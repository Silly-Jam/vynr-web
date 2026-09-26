import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { describe, it } from 'node:test';

const roadmapUrl = new URL('../../app/roadmap/page.tsx', import.meta.url);
const roadmap = existsSync(roadmapUrl) ? readFileSync(roadmapUrl, 'utf8') : '';
const layout = readFileSync(new URL('../../app/layout.tsx', import.meta.url), 'utf8');
const sitemap = readFileSync(new URL('../../app/sitemap.xml/route.ts', import.meta.url), 'utf8');

// Copy checks run on whitespace-normalised source so line wrapping never matters.
const text = roadmap.replace(/\s+/g, ' ');
// Published copy only: the <article> body, so layout styles (e.g. lineHeight: 1.2) never trip copy checks.
const article = roadmap.slice(roadmap.indexOf('<article'), roadmap.indexOf('</article>'));

function headings(tag: 'h2' | 'h3'): string[] {
  return [...roadmap.matchAll(new RegExp(`<${tag}>([^<]+)</${tag}>`, 'g'))].map(m => m[1].trim());
}

describe('roadmap is organised by commitment level', () => {
  it('exists with one H1 and the three tiers in order', () => {
    assert.ok(existsSync(roadmapUrl), 'app/roadmap/page.tsx must exist');
    assert.equal((roadmap.match(/<h1(?:\s|>)/g) ?? []).length, 1);
    assert.deepEqual(headings('h2'), [
      'Launch foundation',
      'How vynr develops',
      'Planned next',
      'Directional later',
      'What stays',
      'Tell us what matters',
    ]);
  });

  it('keeps each theme under its tier', () => {
    assert.deepEqual(headings('h3'), [
      'Everyday refinements',
      'Journal, learn and teach',
      'Plan and be reminded',
      'Your taste',
      'Everywhere',
      'Under consideration',
    ]);
  });

  it('states that planned and later items are not promises', () => {
    assert.match(text, /candidate outcomes, not a committed checklist/);
    assert.match(text, /not scheduled releases/);
    assert.match(text, /None of these has a release window or a settled scope/);
  });
});

describe('roadmap covers every major user-facing theme', () => {
  it('names all four cadence tracks and links Revisions', () => {
    for (const track of ['Fix and refine.', 'Reference data.', 'Label reading.', 'New capabilities.']) {
      assert.ok(text.includes(track), `missing cadence track: ${track}`);
    }
    assert.match(roadmap, /href="\/revisions"/);
  });

  it('covers the near-term refinements', () => {
    for (const item of [
      'CellarTracker import',
      'manual entry',
      'Restore from iCloud',
      'Assistant Link setup',
      'QR hand-off',
      'without cloning it',
      'bottle allowance',
    ]) {
      assert.ok(text.includes(item), `missing near-term item: ${item}`);
    }
  });

  it('covers the Journal, learn and teach candidates', () => {
    for (const item of [
      'Start an empty tasting',
      'never count towards your bottle allowance',
      'Vynrpedia concepts',
      'appearance, nose, palate, finish and conclusion',
      'blind-tasting sets',
      'study sets',
      'tasting sets published to students',
    ]) {
      assert.ok(text.includes(item), `missing FR1 candidate: ${item}`);
    }
  });

  it('covers every later and long-horizon direction', () => {
    for (const item of [
      'Drink-window notifications',
      'food pairing',
      'what you tend to enjoy',
      'journal chapters',
      'annotations in the Atlas',
      'Live sync between devices',
      'iPad and Mac',
      'Siri and Shortcuts',
      'quick capture',
      'group a cellar',
      'interactive map',
      'web viewer',
      'Educational overlays',
      'Aroma fingerprints',
      'Drinks beyond wine',
      'Android',
      'lifetime purchase option',
    ]) {
      assert.ok(text.includes(item), `missing later direction: ${item}`);
    }
  });

  it('keeps the free promises and the never-built list', () => {
    assert.match(text, /Free never shrinks/);
    assert.match(text, /Analytical tasting stays free/);
    assert.match(text, /not live sync between devices/);
    for (const never of [
      'social feeds', 'community ratings', 'marketplace', 'advertising', 'affiliate links',
      'gamification', 'sponsored placement', 'pay-to-rank', 'transaction fees', 'data resale',
    ]) {
      assert.ok(text.includes(never), `missing never-built item: ${never}`);
    }
  });
});

describe('roadmap invites feedback through the existing contact path', () => {
  it('asks near the introduction and again at the end', () => {
    assert.equal((roadmap.match(/href="\/contact"/g) ?? []).length, 2);
    assert.equal((text.match(/Which of these would matter most to you\?/g) ?? []).length, 2);
    const first = roadmap.indexOf('href="/contact"');
    assert.ok(first < roadmap.indexOf('<h2>Launch foundation</h2>'), 'first invitation precedes the tiers');
    assert.ok(roadmap.lastIndexOf('href="/contact"') > roadmap.indexOf('<h2>Tell us what matters</h2>'));
  });

  it('is server-rendered prose without forms, voting, fetching or tracking', () => {
    assert.doesNotMatch(roadmap, /['"]use client['"]/);
    assert.doesNotMatch(roadmap, /<(?:form|input|textarea|button|select|script)\b/i);
    assert.doesNotMatch(roadmap, /\bfetch\(|analytics|tracking pixel/i);
  });
});

describe('roadmap publishes nothing internal and promises nothing unsupported', () => {
  it('carries no internal identifiers, tooling or links', () => {
    assert.doesNotMatch(roadmap, /SJAM-|ADR-|STRAT-|linear\.app|badmini|Trinity|epoch|\bbuild \d/i);
    assert.doesNotMatch(roadmap, /WSET/);
  });

  it('carries no prices, version labels or dates', () => {
    assert.doesNotMatch(roadmap, /S\$|US\$|\$\d|€|£/);
    assert.ok(article.length > 0, 'article body must exist');
    assert.doesNotMatch(article, /\b1\.\d\b|\bFR\d\b/);
    assert.doesNotMatch(roadmap, /\b20\d\d\b|\bQ[1-4]\b/);
  });

  it('uses "forward" Time Lens wording and never claims future work is available', () => {
    assert.doesNotMatch(text, /(?:full|complete) (?:forward )?Time Lens/i);
    assert.doesNotMatch(text, /available now|coming soon/i);
  });
});

describe('roadmap is discoverable without changing the header', () => {
  it('appears once in the footer and once in the sitemap', () => {
    assert.equal((layout.match(/href="\/roadmap"/g) ?? []).length, 1);
    const nav = layout.slice(layout.indexOf('<nav'), layout.indexOf('</nav>'));
    assert.doesNotMatch(nav, /\/roadmap/);
    assert.equal((sitemap.match(/\$\{BASE\}\/roadmap</g) ?? []).length, 1);
  });
});
