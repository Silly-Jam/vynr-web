import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { describe, it } from 'node:test';

const guideUrl = new URL('../../app/guide/page.tsx', import.meta.url);
const guide = existsSync(guideUrl) ? readFileSync(guideUrl, 'utf8') : '';
const layout = readFileSync(new URL('../../app/layout.tsx', import.meta.url), 'utf8');
const sitemap = readFileSync(new URL('../../app/sitemap.xml/route.ts', import.meta.url), 'utf8');

describe('guide is a bounded, static launch foundation', () => {
  it('exists and covers the six concepts in the in-app tour', () => {
    assert.ok(existsSync(guideUrl), 'app/guide/page.tsx must exist');
    assert.equal((guide.match(/<h2(?:\s|>)/g) ?? []).length, 6);

    for (const concept of [
      'Add your wines',
      'Shape your cellar',
      'Follow wine to its place',
      'See wine through time',
      'Remember the bottle',
      'Keep your cellar safe',
    ]) {
      assert.match(guide, new RegExp(concept));
    }
  });

  it('is server-rendered prose without forms, tracking, or client JavaScript', () => {
    assert.doesNotMatch(guide, /['"]use client['"]/);
    assert.doesNotMatch(guide, /<(?:form|input|textarea|button|script)\b/i);
    assert.doesNotMatch(guide, /analytics|tracking pixel/i);
  });

  it('routes deeper help to support', () => {
    assert.match(guide, /href="\/support"/);
  });
});

describe('guide is discoverable', () => {
  it('appears in the footer and sitemap', () => {
    assert.match(layout, /href="\/guide"/);
    assert.match(sitemap, /\$\{BASE\}\/guide/);
  });
});
