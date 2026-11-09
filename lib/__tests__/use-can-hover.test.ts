import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { describe, it } from 'node:test';
import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { useCanHover } from '../use-can-hover';

const read = (path: string) => readFileSync(new URL(`../../${path}`, import.meta.url), 'utf8');

function HoverProbe() {
  return createElement('span', null, useCanHover() ? 'hover' : 'no-hover');
}

describe('useCanHover', () => {
  it('reports no hover on the server, matching the first client render so hydration agrees', () => {
    assert.equal(renderToString(createElement(HoverProbe)), '<span>no-hover</span>');
  });

  it('is the only hover check in both treemap views', () => {
    for (const path of ['app/s/[shareId]/TreemapView.tsx', 'app/atlas/[[...path]]/AtlasTreemapView.tsx']) {
      const source = read(path);
      assert.match(source, /const canHover = useCanHover\(\);/, path);
      assert.doesNotMatch(source, /matchMedia|setCanHover/, path);
    }
  });
});
