import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { describe, it } from 'node:test';

const read = (path: string) => readFileSync(new URL(`../../${path}`, import.meta.url), 'utf8');

const LIVE_URL = 'https://apps.apple.com/sg/app/vynr/id6758237045';
const home = read('app/page.tsx');
const layout = read('app/layout.tsx');

describe('the site presents vynr as live on the App Store', () => {
  it('holds the one App Store link in lib/app-store.ts', () => {
    assert.ok(read('lib/app-store.ts').includes(`APP_STORE_URL = "${LIVE_URL}"`));
  });

  it('makes the App Store badge the home page primary call to action', () => {
    assert.match(home, /Available on the App Store now/);
    assert.match(home, /href=\{APP_STORE_URL\}/);
    assert.match(home, /src="\/app-store-badge\.svg"/);
    assert.match(home, /alt="Download on the App Store"/);
    assert.ok(existsSync(new URL('../../public/app-store-badge.svg', import.meta.url)), 'the badge file is committed');
    assert.ok(home.indexOf('href={APP_STORE_URL}') < home.indexOf('Read the blog'), 'the blog link stays secondary');
  });

  it('no longer says the app is still to come', () => {
    for (const [name, source] of [['home', home], ['layout', layout], ['README', read('README.md')]]) {
      assert.doesNotMatch(source, /launches soon|coming soon|be the first|pre-?launch/i, name);
    }
    assert.ok(read('README.md').includes(LIVE_URL));
  });

  it('tells search engines the app is in stock, not on pre-order', () => {
    assert.match(layout, /availability: "https:\/\/schema\.org\/InStock"/);
    assert.doesNotMatch(layout, /PreOrder/);
  });

  it('points every "get the app" link at the live listing', () => {
    for (const path of ['app/s/[shareId]/page.tsx', 'app/atlas/[[...path]]/page.tsx']) {
      const source = read(path);
      assert.match(source, /href=\{APP_STORE_URL\}/, path);
      assert.doesNotMatch(source, /apps\.apple\.com/, path);
    }
  });
});
