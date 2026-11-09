import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { describe, it } from 'node:test';
import { getAllAtlasNodes } from '../atlas';
import { DEFAULT_CHILD_LEVEL, formatLevelCount } from '../atlas-levels';

describe('formatLevelCount', () => {
  it('pluralises country as countries', () => {
    assert.equal(formatLevelCount(23, 'Country'), '23 countries');
    assert.equal(formatLevelCount(1, 'Country'), '1 country');
  });

  it('keeps the hyphen and lower case for sub-regions', () => {
    assert.equal(formatLevelCount(11, 'Sub-region'), '11 sub-regions');
    assert.equal(formatLevelCount(1, 'Sub-region'), '1 sub-region');
  });

  it('knows every level hint in the atlas dataset, and the default', () => {
    const hints = new Set(getAllAtlasNodes().flatMap(n => (n.childLevelHint ? [n.childLevelHint] : [])));
    hints.add(DEFAULT_CHILD_LEVEL);
    for (const hint of hints) assert.doesNotThrow(() => formatLevelCount(2, hint), hint);
  });

  it('fails loudly on an unknown level', () => {
    assert.throws(() => formatLevelCount(2, 'Parish'), /No plural for atlas level "Parish"/);
  });

  it('is the only pluralisation on the Atlas pages', () => {
    for (const path of ['app/atlas/[[...path]]/page.tsx', 'app/atlas/[[...path]]/AtlasTreemapView.tsx', 'app/atlas/[[...path]]/AtlasInfoPanel.tsx']) {
      const source = readFileSync(new URL(`../../${path}`, import.meta.url), 'utf8');
      assert.match(source, /formatLevelCount\(/, path);
      assert.doesNotMatch(source, /!== 1 \? 's'/, path);
    }
  });
});
