import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { describe, it } from 'node:test';

const read = (path: string) => readFileSync(new URL(`../../${path}`, import.meta.url), 'utf8');
const layout = read('app/layout.tsx');

const header = layout.slice(layout.indexOf('<header'), layout.indexOf('</header>'));
const footer = layout.slice(layout.indexOf('<footer'), layout.indexOf('</footer>'));
const menu = read('app/components/SiteMenu.tsx');

const hrefs = (source: string) => [...source.matchAll(/href="([^"]+)"/g)].map(m => m[1]);

describe('header: the menu, the wordmark, and the three reasons people visit', () => {
  it('puts the menu before the wordmark, then Atlas, Guide and Blog', () => {
    assert.ok(header.indexOf('<SiteMenu />') >= 0, 'header renders the site menu');
    assert.ok(header.indexOf('<SiteMenu />') < header.indexOf('site-wordmark'), 'menu sits left of the wordmark');
    assert.deepEqual(hrefs(header), ['/', '/atlas', '/guide', '/blog']);
  });
});

describe('the site menu holds every page', () => {
  it('lists Explore, Vynr and Help in order', () => {
    const groups = [...menu.matchAll(/label: "([^"]+)",\s*links: \[([\s\S]*?)\]/g)].map(m => ({
      label: m[1],
      hrefs: [...m[2].matchAll(/href: "([^"]+)"/g)].map(h => h[1]),
    }));
    assert.deepEqual(groups, [
      { label: 'Explore', hrefs: ['/atlas', '/guide', '/blog'] },
      { label: 'Vynr', hrefs: ['/about', '/roadmap', '/revisions'] },
      { label: 'Help', hrefs: ['/support', '/contact'] },
    ]);
  });

  it('is an accessible disclosure that closes on navigation, link choice, Tab-out, Escape and outside taps', () => {
    assert.match(menu, /aria-expanded=\{open\}/);
    assert.match(menu, /aria-controls=\{panelId\}/);
    assert.match(menu, /hidden=\{!open\}/);
    assert.match(menu, /if \(pathname !== lastPath\)[\s\S]*?setOpen\(false\)/);
    assert.match(menu, /event\.key !== "Escape"/);
    assert.match(menu, /if \(focusWasInside\) buttonRef\.current\?\.focus\(\)/);
    assert.match(menu, /onBlur=[\s\S]*?event\.relatedTarget[\s\S]*?setOpen\(false\)/);
    assert.match(menu, /onClick=\{\(\) => setOpen\(false\)\}/);
    assert.match(menu, /pointerdown/);
    assert.match(menu, /aria-current=\{pathname === link\.href \? "page" : undefined\}/);
  });

  it('keeps the tester-only beta guide out of site navigation', () => {
    assert.doesNotMatch(layout + menu, /\/beta/);
  });
});

describe('footer is one calm line of legal pages and outward links', () => {
  it('links Privacy, Terms, Instagram, TikTok and the publisher, in order', () => {
    assert.deepEqual(hrefs(footer), [
      '/privacy',
      '/terms',
      'https://www.instagram.com/vynr.app',
      'https://www.tiktok.com/@vynr.app',
      '/about#silly-jam',
    ]);
    assert.match(footer, /aria-label="Vynr on Instagram"/);
    assert.match(footer, /aria-label="Vynr on TikTok"/);
  });

  it('gives every chrome link a 44px tap target', () => {
    const links = [...(layout + menu).matchAll(/<(?:Link|a|button)\b[^>]*>/g)].map(m => m[0]);
    for (const link of links) {
      assert.match(link, /className="[^"]*(?:tap-target|sj-colophon)/, `link lacks a tap target: ${link}`);
    }
    assert.match(read('app/globals.css'), /\.sj-colophon\s*\{\s*min-height: 44px;/);
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
    assert.match(read('ROADMAP.md'), /\]\(https:\/\/vynr\.app\/revisions\)/);
    assert.match(read('app/atlas/[[...path]]/page.tsx'), /href="\/revisions"/);
    assert.match(read('app/guide/page.tsx'), /href="\/roadmap"/);
    assert.match(read('app/support/page.tsx'), /href="\/guide"/);
    const beta = read('app/beta/page.tsx');
    assert.match(beta, /href="\/guide"/);
    assert.match(beta, /href="\/support"/);
  });
});
