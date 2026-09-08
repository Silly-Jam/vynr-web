import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { describe, it } from 'node:test';

const supportUrl = new URL('../../app/support/page.tsx', import.meta.url);
const support = existsSync(supportUrl) ? readFileSync(supportUrl, 'utf8') : '';
const privacy = readFileSync(new URL('../../app/privacy/page.tsx', import.meta.url), 'utf8');
const layout = readFileSync(new URL('../../app/layout.tsx', import.meta.url), 'utf8');
const contact = readFileSync(new URL('../../app/contact/page.tsx', import.meta.url), 'utf8');
const sitemap = readFileSync(new URL('../../app/sitemap.xml/route.ts', import.meta.url), 'utf8');

function words(source: string): string {
  return source
    .replace(/&apos;/g, "'")
    .replace(/&ldquo;|&rdquo;/g, '"')
    .replace(/\s+/g, ' ');
}

describe('support page is a bounded, static release surface', () => {
  it('exists with exactly three plainly headed FAQs and a human support address', () => {
    assert.ok(existsSync(supportUrl), 'app/support/page.tsx must exist');
    assert.equal((support.match(/<h2(?:\s|>)/g) ?? []).length, 3);
    assert.match(words(support), /typically answered within a few days/);
    assert.match(support, /href="mailto:support@vynr\.app"/);
  });

  it('remains server-rendered prose without a form, chat, or client JavaScript', () => {
    assert.doesNotMatch(support, /['"]use client['"]/);
    assert.doesNotMatch(support, /<(?:form|input|textarea|button|script)\b/i);
    assert.doesNotMatch(words(support), /live chat/i);
  });

  it('reuses the release privacy contract verbatim instead of restating it loosely', () => {
    const phrases = [
      'By default, your data is stored locally on your device.',
      'If iCloud is on for vynr, the data is stored in your private iCloud database using Apple CloudKit.',
      'Settings → Delete All Wine Data permanently removes wine records, saved label images, retained import source files, and associated import history from this device and your private iCloud backup. Journal entries and cellar layout remain on your device and, if iCloud is on, are backed up again.',
      'Uninstalling the app removes local data from the device, but does not delete published Share or Assistant Link data. Use the in-app revoke or delete control for those services.',
    ];

    for (const phrase of phrases) {
      assert.ok(words(privacy).includes(phrase), `privacy page no longer contains: ${phrase}`);
      assert.ok(words(support).includes(phrase), `support page drifted from privacy wording: ${phrase}`);
    }
  });

  it('documents the shipped diagnostic route and subscription self-service links', () => {
    const copy = words(support);
    assert.match(copy, /Wine detail.*Capture Details.*Send to Support/);
    assert.match(copy, /does not include anything from your journal/);
    assert.match(support, /href="\/privacy"/);
    assert.match(support, /href="\/terms"/);
    assert.match(support, /href="https:\/\/reportaproblem\.apple\.com"/);
  });
});

describe('support is discoverable across the public site', () => {
  it('puts Support between Privacy and Contact and includes Terms in the footer', () => {
    const privacyAt = layout.indexOf('href="/privacy"');
    const supportAt = layout.indexOf('href="/support"');
    const contactAt = layout.indexOf('href="/contact"');
    const termsAt = layout.indexOf('href="/terms"');

    assert.ok(privacyAt >= 0);
    assert.ok(supportAt > privacyAt);
    assert.ok(contactAt > supportAt);
    assert.ok(termsAt >= 0);
  });

  it('lists Support and Terms in the sitemap', () => {
    assert.match(sitemap, /\$\{BASE\}\/support/);
    assert.match(sitemap, /\$\{BASE\}\/terms/);
  });

  it('routes support requests from Contact to the support page', () => {
    assert.match(contact, /href="\/support"/);
  });
});
