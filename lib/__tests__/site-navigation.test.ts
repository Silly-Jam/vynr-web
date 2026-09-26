import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { describe, it } from 'node:test';

const read = (path: string) => readFileSync(new URL(`../../${path}`, import.meta.url), 'utf8');
const layout = read('app/layout.tsx');

const header = layout.slice(layout.indexOf('<header'), layout.indexOf('</header>'));
const footer = layout.slice(layout.indexOf('<footer'), layout.indexOf('</footer>'));

const hrefs = (source: string) => [...source.matchAll(/href="([^"]+)"/g)].map(m => m[1]);

// The links between one footer group label and the next (or the end of the groups nav).
function group(label: string): string[] {
  const start = footer.indexOf(`>${label}</h2>`);
  assert.ok(start >= 0, `missing footer group: ${label}`);
  const next = footer.indexOf('<h2', start);
  const end = next === -1 ? footer.indexOf('</nav>', start) : next;
  return hrefs(footer.slice(start, end));
}

describe('header carries the three reasons people visit, always visible', () => {
  it('links the wordmark home, then Atlas, Guide and Blog in order', () => {
    assert.deepEqual(hrefs(header), ['/', '/atlas', '/guide', '/blog']);
  });

  it('has no menu to open', () => {
    assert.doesNotMatch(header, /<(?:details|summary|button|input)\b/);
    assert.doesNotMatch(layout, /['"]use client['"]/);
  });
});

describe('footer groups every other destination under a label', () => {
  it('uses the Vynr, Help and Legal groups in order', () => {
    const labels = [...footer.matchAll(/className="footer-group-label">([^<]+)</g)].map(m => m[1]);
    assert.deepEqual(labels, ['Vynr', 'Help', 'Legal']);
    assert.deepEqual(group('Vynr'), ['/about', '/roadmap', '/revisions']);
    assert.deepEqual(group('Help'), ['/guide', '/support', '/contact']);
    assert.deepEqual(group('Legal'), ['/privacy', '/terms']);
  });

  it('labels the social links in text and drops the dot separators', () => {
    assert.match(footer, />\s*Instagram\s*</);
    assert.match(footer, />\s*TikTok\s*</);
    assert.doesNotMatch(footer, /·/);
  });

  it('gives every navigation link a 44px tap target', () => {
    const links = [...layout.matchAll(/<(?:Link|a)\b[^>]*>/g)].map(m => m[0]);
    for (const link of links) {
      assert.match(link, /className="[^"]*(?:tap-target|sj-colophon)/, `link lacks a tap target: ${link}`);
    }
    assert.match(read('app/globals.css'), /\.sj-colophon\s*\{\s*min-height: 44px;/);
  });

  it('keeps the tester-only beta guide out of site navigation', () => {
    assert.doesNotMatch(layout, /href="\/beta"/);
  });
});

describe('links meet WCAG AA contrast', () => {
  // Relative luminance contrast, WCAG 2.x.
  const lum = (hex: string) => {
    const [r, g, b] = [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16) / 255)
      .map(c => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };
  const css = read('app/globals.css');
  const token = (name: string) => css.match(new RegExp(`--${name}:\\s*(#[0-9A-Fa-f]{6})`))?.[1] ?? '';

  it('uses a link colour of at least 4.5:1 on the page background', () => {
    const [a, b] = [lum(token('atlas-link')), lum(token('atlas-bg'))].sort((x, y) => x - y);
    assert.ok((b + 0.05) / (a + 0.05) >= 4.5, 'link colour fails AA');
    assert.match(css, /\.prose a,\s*\.text-link\s*\{\s*color: var\(--atlas-link\);\s*text-decoration: underline;/);
  });

  it('marks contextual links outside .prose as links', () => {
    assert.match(read('app/revisions/page.tsx'), /href="\/roadmap" className="text-link"/);
    assert.match(read('app/atlas/[[...path]]/page.tsx'), /href="\/revisions" className="text-link"/);
  });
});

describe('pages cross-link so nothing depends on the header alone', () => {
  it('connects Roadmap, Revisions, Atlas, Guide, Support and Beta', () => {
    assert.match(read('app/revisions/page.tsx'), /href="\/roadmap"/);
    assert.match(read('app/roadmap/page.tsx'), /href="\/revisions"/);
    assert.match(read('app/atlas/[[...path]]/page.tsx'), /href="\/revisions"/);
    assert.match(read('app/guide/page.tsx'), /href="\/roadmap"/);
    assert.match(read('app/support/page.tsx'), /href="\/guide"/);
    const beta = read('app/beta/page.tsx');
    assert.match(beta, /href="\/guide"/);
    assert.match(beta, /href="\/support"/);
  });
});
