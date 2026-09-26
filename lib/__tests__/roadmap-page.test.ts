import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { describe, it } from 'node:test';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import RoadmapPage from '../../app/roadmap/page';
import { getRoadmap, parseRoadmap } from '../roadmap';

const read = (path: string) => readFileSync(new URL(`../../${path}`, import.meta.url), 'utf8');
const source = read('ROADMAP.md');
const page = read('app/roadmap/page.tsx');
const layout = read('app/layout.tsx');
const menu = read('app/components/SiteMenu.tsx');
const sitemap = read('app/sitemap.xml/route.ts');

const roadmap = getRoadmap();
const text = source.replace(/\s+/g, ' ');
const section = (title: string) => {
  const found = roadmap.sections.find(s => s.title === title);
  assert.ok(found, `missing section: ${title}`);
  return found;
};
const release = (version: string) => {
  const found = roadmap.sections.flatMap(s => s.releases).find(r => r.version === version);
  assert.ok(found, `missing release: ${version}`);
  return found;
};

describe('ROADMAP.md is the single public source', () => {
  it('renders /roadmap from ROADMAP.md with no copy in the page component', () => {
    assert.match(page, /import \{ getRoadmap \} from "@\/lib\/roadmap"/);
    assert.match(read('lib/roadmap.ts'), /path\.join\(process\.cwd\(\), 'ROADMAP\.md'\)/);
    for (const phrase of ['Remember every tasting', 'Journal, learn and teach', 'Tell us', 'What vynr launches with', '<li>', '<p>']) {
      assert.ok(!page.includes(phrase), `page.tsx must not carry roadmap copy: ${phrase}`);
    }
  });

  it('takes the meta description from the source summary', () => {
    assert.match(page, /description: getRoadmap\(\)\.summary/);
    assert.equal(roadmap.summary, source.split('\n\n')[1].trim());
  });

  it('builds without fetching anything', () => {
    assert.doesNotMatch(page + read('lib/roadmap.ts'), /\bfetch\(|linear/i);
    assert.doesNotMatch(page, /['"]use client['"]/);
  });

  it('localises vynr.app links and carries no raw HTML in the source', () => {
    const html = [roadmap.introHtml, ...roadmap.sections.flatMap(s => [s.html, ...s.releases.map(r => r.html)])].join('');
    assert.doesNotMatch(html, /href="https:\/\/(?:www\.)?vynr\.app/);
    assert.doesNotMatch(source, /<[a-z][a-z0-9-]*[\s>/]/i);
    const probe = parseRoadmap('# R\n\nS.\n\n[a](https://vynr.app) [b](https://www.vynr.app/x) [c](https://vynr.app/y#z)\n');
    assert.match(probe.introHtml, /href="\/">a<[\s\S]*href="\/x">b<[\s\S]*href="\/y#z">c</);
  });
});

describe('releases are organised by commitment level', () => {
  it('has the tier sections, then how vynr develops, what stays and the closing invitation', () => {
    assert.deepEqual(roadmap.sections.map(s => s.title), [
      'Launch', 'Planned next', 'Directional later', 'How vynr develops', 'What stays', 'Tell us what matters',
    ]);
  });

  it('bands every release with version, theme, commitment and promise', () => {
    const bands = roadmap.sections.flatMap(s => s.releases).map(r => [r.version ?? null, r.theme, r.commitment, r.promise ?? null]);
    assert.deepEqual(bands, [
      ['1.2', 'The launch release', 'Launch', 'Every bottle belongs to a larger story.'],
      ['1.2.x', 'Fix and refine', 'Planned next', 'The launch features, smoother.'],
      ['1.3', 'Journal, learn and teach', 'Planned next', 'Remember every tasting.'],
      ['1.4', 'Plan and be reminded', 'Directional later', 'Know what to open next.'],
      ['1.5', 'Your taste', 'Directional later', 'Understand your taste.'],
      ['1.6', 'Everywhere', 'Directional later', null],
      [null, 'Under consideration', 'Directional later', 'No version yet.'],
    ]);
  });

  it('indexes the three tiers and styles bands by tier', () => {
    assert.deepEqual(roadmap.sections.filter(s => s.releases.length).map(s => s.id), ['launch', 'planned-next', 'directional-later']);
    assert.match(page, /className="roadmap-index"/);
    assert.match(page, /href=\{`#\$\{tier\.id\}`\} className="tap-target nav-link"/);
    assert.match(page, /data-commitment=\{section\.id\}/);
  });

  it('fails loudly on a malformed source instead of rendering a guess', () => {
    assert.throws(() => parseRoadmap('# R\n\nS.\n\n## Launch\n\n### 1.2 — X\n\nno meta line\n'), /must open with/);
    assert.throws(() => parseRoadmap('# R\n\nS.\n\n## Launch\n\n### 1.2 — X\n\n**Planned next** · *p*\n'), /sits under "Launch"/);
    assert.throws(() => parseRoadmap('# R\n\nS.\n\n## Launch\n\ntext\n'), /has no releases/);
    assert.throws(() => parseRoadmap('# R\n\nS.\n\n## What stays\n\n### 1.9 — X\n\n**Launch**\n'), /may only sit under/);
    assert.throws(() => parseRoadmap('# R\n\nS.\n\n```\n## not a heading\n```\n'), /fenced code/);
    assert.throws(() => parseRoadmap('# R\n\nS.\n\n## Launch\n\n### 1.2 — A\n\n**Launch**\n\n### 1.2 — B\n\n**Launch**\n'), /duplicate id "v1-2"/);
    assert.throws(() => parseRoadmap('# R\n\nS.\n\n## 日本\n\ntext\n'), /empty id/);
    assert.throws(() => parseRoadmap('# R\n\nS.\n\n## Launch\n\n### Under consideration — ideas\n\n**Launch**\n'), /must be a version/);
    assert.throws(() => parseRoadmap('# R\n\n## Launch\n\n### 1.2 — A\n\n**Launch**\n'), /summary paragraph/);
    for (const definition of ['[c]: https://vynr.app/contact', '[c]:https://vynr.app/contact', '> [c]: https://vynr.app/contact', '- [c]: https://vynr.app/contact']) {
      assert.throws(() => parseRoadmap(`# R\n\nS [contact][c].\n\n## What stays\n\n${definition}\n`), /inline links/, definition);
    }
  });

  it('reads Windows line endings the same as Unix ones', () => {
    assert.deepEqual(parseRoadmap(source.replace(/\n/g, '\r\n')), roadmap);
  });
});

describe('the 1.3 working scope matches its release epic', () => {
  it('is presented as the working scope of a roughly three-month release, not a loose list', () => {
    const html = release('1.3').html;
    assert.match(html, /working scope of a roughly three-month release/);
    assert.match(html, /Details are refined through design/);
    assert.doesNotMatch(text, /not every one will arrive together|candidate enhancements|not a committed checklist|grab bag/i);
  });

  it('covers every area of the epic, including From vynr', () => {
    const html = release('1.3').html;
    for (const heading of ['Tasting events', 'Analytical tasting, extended', 'Journal and learning', 'Blind tasting and study sets', 'Teaching and sharing', 'From vynr']) {
      assert.ok(html.includes(`<h4>${heading}</h4>`), `1.3 missing: ${heading}`);
    }
    for (const item of [
      'never count towards your bottle allowance', 'explicit step adds it to a cellar', 'rename, correct or delete',
      'photographic keepsake', 'Vynrpedia explanations beside each field', 'set aside for checking',
      'Nobody marks you right or wrong', 'without cloning or owning it', 'readable again at any time from Settings',
      'No account and no tracking',
    ]) {
      assert.ok(html.includes(item), `1.3 missing detail: ${item}`);
    }
  });

  it('keeps the free record free', () => {
    const html = release('1.3').html;
    assert.match(html, /Analytical tasting stays free/);
    assert.match(html, /will never be taken away/);
  });
});

describe('the directional releases match their epics without over-promising', () => {
  it('1.4 covers planning, reminders, occasions and Assistant Link', () => {
    const html = release('1.4').html;
    for (const item of ['whole cellar', 'Opt-in drink-window reminders', 'not one alert per bottle', 'Plan wines for a meal', 'Assistant Link']) {
      assert.ok(html.includes(item), `1.4 missing: ${item}`);
    }
  });

  it('directional releases state intent, never settled free or paid terms', () => {
    for (const version of ['1.4', '1.5', '1.6']) {
      assert.doesNotMatch(release(version).html, /will not be a paid|will never|stays? free|free within|guarantee/i, `${version} makes a settled pledge`);
    }
    assert.match(release('1.4').html, /settled when this release is designed/);
  });

  it('1.5 covers profile, recommendations, chapters, personal Atlas and consent', () => {
    const html = release('1.5').html;
    for (const item of ['evidence behind every conclusion', 'You can correct it', 'why a wine may suit you', 'Chapters', 'private notes', 'reaches Assistant Link']) {
      assert.ok(html.includes(item), `1.5 missing: ${item}`);
    }
    assert.match(html, /no single score of your taste, and no comparison with other people/);
  });

  it('1.6 and the long-horizon list stay directional', () => {
    for (const item of ['Live sync between devices', 'iPad and Mac', 'Siri and Shortcuts', 'quick capture']) {
      assert.ok(release('1.6').html.includes(item), `1.6 missing: ${item}`);
    }
    const later = section('Directional later').releases.at(-1)!.html;
    for (const item of ['group a cellar', 'interactive map', 'web viewer', 'Comparing your cellar with another collection', 'Educational overlays', 'Aroma fingerprints', 'Drinks beyond wine', 'Android', 'lifetime purchase option']) {
      assert.ok(later.includes(item), `under consideration missing: ${item}`);
    }
  });
});

describe('continuing priorities and the 2.0 arc sit near the top', () => {
  const intro = roadmap.introHtml;
  const at = (needle: string) => intro.indexOf(needle);

  it('states label reading and reference data as continuing, with honest rhythms', () => {
    assert.ok(at('<h3>Always improving</h3>') >= 0, 'intro has "Always improving"');
    assert.match(intro, /neither has a finish line/);
    assert.match(intro, /Label reading<\/strong> gets more accurate in app updates every two weeks to monthly, with urgent fixes sooner/);
    assert.match(intro, /Reference data<\/strong> grows every week/);
    assert.match(intro, /href="\/revisions"/);
  });

  it('defines 2.0 as functional completeness, not an end to improvement', () => {
    assert.ok(at('<h3>Toward 2.0</h3>') > at('<h3>Always improving</h3>'));
    assert.match(intro, /functionally complete at 2\.0/);
    assert.match(intro, /It is not an end\. Maintenance, reference data, label reading, privacy and security work, and refinement all continue after it/);
  });

  it('places both before the first release and the feedback callout', () => {
    assert.ok(at('<h3>Toward 2.0</h3>') < at('<blockquote>'), 'priorities come before the callout');
    assert.doesNotMatch(text, /(?:label reading|reference data)[^.]*(?:is|are|will be) (?:done|finished|complete)/i);
  });

  it('keeps unproven label-reading capability out of committed releases', () => {
    assert.doesNotMatch(section('Planned next').releases.map(r => r.html).join(''), /intended bottle/);
    assert.match(section('Directional later').releases.at(-1)!.html, /Picking the intended bottle/);
  });
});

describe('the page invites feedback through the existing contact path', () => {
  it('opens and closes with a bordered callout linking /contact', () => {
    assert.match(roadmap.introHtml, /<blockquote>[\s\S]*href="\/contact"[\s\S]*<\/blockquote>/);
    assert.match(section('Tell us what matters').html, /<blockquote>[\s\S]*href="\/contact"[\s\S]*<\/blockquote>/);
    assert.equal((source.match(/Which of these would matter most to you\?/g) ?? []).length, 2);
    assert.match(read('app/globals.css'), /\.roadmap blockquote,\s*\.plans blockquote \{[^}]*border: 1px solid/);
  });

  it('links the cadence section to Revisions', () => {
    assert.match(section('How vynr develops').html, /href="\/revisions"/);
  });
});

describe('the public source carries nothing internal and promises nothing unsupported', () => {
  it('has no internal identifiers, tooling or links', () => {
    assert.doesNotMatch(source, /SJAM|\bADR\b|ADR-|STRAT-|linear\.app|badmini|Trinity|\bepoch\b|\bbuild \d|\bFR\d\b|\bG[1-5]\b|real devices|feel gate/i);
    assert.doesNotMatch(source, /WSET|MCP/);
  });

  it('has no prices or calendar dates', () => {
    assert.doesNotMatch(source, /S\$|US\$|\$\d|€|£/);
    assert.doesNotMatch(source, /\b20\d\d\b|\bQ[1-4]\b|January|February|March|April|June|July|August|September|October|November|December/);
  });

  it('uses "forward" Time Lens wording and never claims future work is available', () => {
    assert.doesNotMatch(text, /(?:full|complete) (?:forward )?Time Lens|unlimited scrubbing/i);
    for (const mention of text.match(/[^.]*Time Lens beyond six months[^.]*/g) ?? []) {
      assert.match(mention, /forward Time Lens beyond six months/, 'the paid Time Lens is always the forward one');
    }
    assert.doesNotMatch(text, /available now|coming soon|privacy controls/i);
    assert.match(text, /Free never shrinks/);
    for (const never of ['social feeds', 'community ratings', 'marketplace', 'advertising', 'affiliate links', 'gamification', 'sponsored placement', 'pay-to-rank', 'transaction fees', 'data resale']) {
      assert.ok(text.includes(never), `missing never-built item: ${never}`);
    }
  });
});

describe('roadmap is discoverable', () => {
  it('appears in the site menu and once in the sitemap, not in the header row', () => {
    assert.match(menu, /href: "\/roadmap"/);
    const nav = layout.slice(layout.indexOf('<nav'), layout.indexOf('</nav>'));
    assert.doesNotMatch(nav, /\/roadmap/);
    assert.equal((sitemap.match(/\$\{BASE\}\/roadmap</g) ?? []).length, 1);
  });
});

describe('the rendered page', () => {
  const html = renderToStaticMarkup(createElement(RoadmapPage));

  it('renders every section and release exactly once, with unique ids', () => {
    const ids = [...html.matchAll(/ id="([^"]+)"/g)].map(m => m[1]);
    assert.equal(new Set(ids).size, ids.length, `duplicate ids: ${ids}`);
    assert.equal((html.match(/class="release-band"/g) ?? []).length, 7);
    assert.equal((html.match(/<h1\b/g) ?? []).length, 1);
    assert.equal((html.match(/<h2>/g) ?? []).length, roadmap.sections.length);
  });

  it('links the feedback callouts to /contact exactly twice, and indexes the three tiers', () => {
    assert.equal((html.match(/href="\/contact"/g) ?? []).length, 2);
    const index = html.slice(html.indexOf('class="roadmap-index"'), html.indexOf('</nav>', html.indexOf('class="roadmap-index"')));
    assert.deepEqual([...index.matchAll(/href="#([^"]+)"/g)].map(m => m[1]), ['launch', 'planned-next', 'directional-later']);
  });
});
