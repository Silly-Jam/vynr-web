import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { describe, it } from 'node:test';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import PlansPage from '../../app/vynr-plus/page';
import { getPlans, parsePlans } from '../plans';
import { getRoadmap } from '../roadmap';

const read = (path: string) => readFileSync(new URL(`../../${path}`, import.meta.url), 'utf8');
const source = read('VYNR-PLUS.md');
const page = read('app/vynr-plus/page.tsx');
const text = source.replace(/\s+/g, ' ');
const plans = getPlans();

const section = (title: string) => {
  const found = plans.sections.find(s => s.title === title);
  assert.ok(found, `missing section: ${title}`);
  return found;
};

describe('VYNR-PLUS.md is the single public source', () => {
  it('renders /vynr-plus from VYNR-PLUS.md with no copy in the page component', () => {
    assert.match(page, /import \{ getPlans \} from "@\/lib\/plans"/);
    assert.match(page, /description: getPlans\(\)\.summary/);
    for (const phrase of ['Assistant Link', 'genuinely useful', 'Unlimited', '<li>', '<p>']) {
      assert.ok(!page.includes(phrase), `page.tsx must not carry copy: ${phrase}`);
    }
    assert.doesNotMatch(page, /['"]use client['"]|\bfetch\(/);
  });

  it('has the sections in order', () => {
    assert.deepEqual(plans.sections.map(s => s.title), [
      'No tiers of truth', 'What vynr+ adds', 'Side by side', 'Always free', 'Trying vynr+', 'If vynr+ ends',
    ]);
  });

  it('refuses a comparison section that mixes rows with prose subsections', () => {
    assert.throws(
      () => parsePlans('# P\n\nS.\n\n## Side by side\n\n### A\n\n- **vynr:** x\n- **vynr+:** y\n\n### B\n\nprose\n'),
      /mixes comparison rows/,
    );
  });
});

describe('the paid story leads with outcomes', () => {
  it('opens as useful without paying, never "complete" (2.0 is the completeness statement)', () => {
    assert.match(plans.summary, /^vynr is genuinely useful without paying\. vynr\+ is for when your wine becomes a collection/);
    assert.doesNotMatch(text, /complete without paying|whole without paying/i);
  });

  it('lists the vynr+ outcomes in the operator\'s order', () => {
    const adds = section('What vynr+ adds').html;
    const headings = [...adds.matchAll(/<h3>([^<]+)<\/h3>/g)].map(m => m[1]);
    assert.deepEqual(headings, [
      'Unlimited bottles and more cellars',
      'Plan beyond six months',
      'Assistant Link',
      'Ask vynr, whenever you need it',
      'Richer journal composition and publishing',
    ]);
  });

  it('explains Assistant Link by value first and names MCP exactly once, afterwards', () => {
    const adds = section('What vynr+ adds').html;
    const link = adds.slice(adds.indexOf('<h3>Assistant Link</h3>'), adds.indexOf('<h3>Ask vynr'));
    assert.match(link, /privately connects your cellar to ChatGPT, Claude or Gemini/);
    assert.equal((source.match(/MCP/g) ?? []).length, 1, 'MCP is named once');
    assert.ok(link.indexOf('Model Context Protocol (MCP)') > link.indexOf('ChatGPT, Claude or Gemini'), 'value before protocol');
    assert.match(link, /Tasting notes are never included, and your palate is shared only if you choose/);
    assert.match(link, /Listing, revoking and deleting your links stay free on every plan/);
  });

  it('states the no-tiers-of-truth contract', () => {
    assert.match(section('No tiers of truth').html, /Everyone sees the same wine facts, education and drinking curves/);
    assert.match(text, /free never shrinks/);
  });
});

describe('the comparison restates the shipped V1 boundary exactly', () => {
  const rows = section('Side by side').rows ?? [];
  const row = (area: string) => {
    const found = rows.find(r => r.area === area);
    assert.ok(found, `missing row: ${area}`);
    return found;
  };

  it('has one row per area, in order', () => {
    assert.deepEqual(rows.map(r => r.area), [
      'Bottles', 'Cellars', 'Time Lens', 'Ask vynr', 'Assistant Link', 'Journal', 'Sharing', 'Exports',
    ]);
  });

  it('pins the live gates: 50 bottles, six months forward, five Ask vynr answers', () => {
    assert.match(row('Bottles').freeHtml, /Up to 50 bottles you currently own, across all your cellars/);
    assert.match(row('Bottles').plusHtml, /Unlimited/);
    assert.match(row('Cellars').plusHtml, /Create additional cellars/);
    assert.match(row('Time Lens').freeHtml, /Your full history, and the next six months/);
    assert.match(row('Time Lens').plusHtml, /Your full history, and the complete forward horizon/);
    assert.match(row('Ask vynr').freeHtml, /Five answers a month/);
    assert.match(row('Ask vynr').plusHtml, /No monthly count, within fair use/);
    assert.match(row('Assistant Link').freeHtml, /List, revoke and delete links/);
    assert.match(row('Journal').freeHtml, /one text and one photo block/);
    assert.match(row('Sharing').freeHtml, /Open and browse shared cellars/);
    assert.match(row('Sharing').plusHtml, /Publish a new cellar snapshot, restore a revoked one, and copy shared wines/);
    assert.match(row('Exports').freeHtml, /A full export of all your data/);
  });

  it('keeps remediation off the Ask vynr allowance without claiming it is unlimited', () => {
    assert.match(section('Always free').html, /AI Fix and Cellar Health, which correct vynr's own reading, never use your Ask vynr allowance/);
    assert.doesNotMatch(text, /without limits|unmetered|unlimited (?:AI|fixes|answers)/i);
  });

  it('describes the explicit-consent trial and the lapse contract', () => {
    const trial = section('Trying vynr+').html;
    for (const item of ['<strong>Start your free month</strong>', 'never starts it', 'no charge and no subscription', 'exact end date', 'billing begins that day', 'One free month per device', 'held vynr+ before']) {
      assert.ok(trial.includes(item), `trial missing: ${item}`);
    }
    const lapse = section('If vynr+ ends').html;
    for (const item of ['Nothing is deleted', 'you keep everything', 'Publishing a new one needs vynr+', 'never undoes a revoke', 'Composing new grouped entries needs vynr+']) {
      assert.ok(lapse.includes(item), `lapse missing: ${item}`);
    }
  });
});

describe('the page claims nothing that has not shipped', () => {
  it('never sells declared-but-unshipped capabilities', () => {
    assert.doesNotMatch(text, /guided tasting|structured tasting notes|annotations|live sync|multi-device|overlay|exact quantit|collection value|drink-window reminder|notification|iPad|Mac\b|Siri|Shortcuts|blind/i);
  });

  it('uses forward Time Lens language, no prices, no retired offer terms', () => {
    assert.doesNotMatch(text, /(?:full|complete) (?:forward )?Time Lens|unlimited scrubbing/i);
    assert.doesNotMatch(text, /S\$|US\$|\$\d|€|£|credits|AI assists|14-day|trial starts automatically/i);
  });

  it('carries no internal identifiers', () => {
    assert.doesNotMatch(source, /SJAM|\bADR\b|ADR-|STRAT-|linear\.app|Capability\.|OfferPolicy|QuotaPolicy/);
  });
});

describe('the rendered page', () => {
  const html = renderToStaticMarkup(createElement(PlansPage));

  it('renders a real comparison table with unique ids', () => {
    assert.equal((html.match(/<table class="plans-table"/g) ?? []).length, 1);
    assert.equal((html.match(/<th scope="row"/g) ?? []).length, 8);
    assert.match(html, /<th scope="col" role="columnheader">vynr<\/th><th scope="col" role="columnheader">vynr\+<\/th>/);
    assert.equal((html.match(/data-plan="vynr"/g) ?? []).length, 8);
    // Explicit roles keep table semantics when phones restyle the table as blocks.
    assert.match(html, /<table class="plans-table" role="table"><thead role="rowgroup"><tr role="row">/);
    assert.equal((html.match(/role="rowheader"/g) ?? []).length, 8);
    assert.equal((html.match(/role="cell"/g) ?? []).length, 16);
    const ids = [...html.matchAll(/ id="([^"]+)"/g)].map(m => m[1]);
    assert.equal(new Set(ids).size, ids.length);
    assert.equal((html.match(/<h1\b/g) ?? []).length, 1);
  });

  it('never removes the column headers from the accessibility tree on phones', () => {
    const css = read('app/globals.css');
    assert.doesNotMatch(css, /\.plans-table thead \{\s*display: none/);
    assert.match(css, /\.plans-table thead \{\s*position: absolute;[^}]*clip: rect\(0, 0, 0, 0\)/);
    assert.match(css, /content: attr\(data-plan\) \/ "";/);
    assert.doesNotMatch(css.slice(css.indexOf('.plans-table thead th {'), css.indexOf('}', css.indexOf('.plans-table thead th {'))), /text-transform\s*:/);
  });

  it('routes subscription questions to Support', () => {
    assert.match(html, /href="\/support"/);
  });
});

describe('vynr+ is discoverable', () => {
  it('is linked from the roadmap launch band, the site menu and the sitemap', () => {
    const launch = getRoadmap().sections.find(s => s.title === 'Launch')!.releases[0].html;
    assert.match(launch, /<blockquote>[\s\S]*<strong>vynr\+<\/strong>[\s\S]*href="\/vynr-plus"[\s\S]*<\/blockquote>/);
    assert.match(launch, /Assistant Link to connect your cellar privately to ChatGPT, Claude or Gemini/);
    assert.match(read('app/components/SiteMenu.tsx'), /\{ href: "\/vynr-plus", label: "vynr\+" \}/);
    assert.equal((read('app/sitemap.xml/route.ts').match(/\$\{BASE\}\/vynr-plus</g) ?? []).length, 1);
  });
});
