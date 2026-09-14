import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import nextConfig from '../../next.config';
import { resolveUrlPath } from '../atlas';

describe('published Atlas URL continuity', () => {
  it('redirects the two reparented Chilean regions to their canonical paths', async () => {
    const redirects = await nextConfig.redirects?.() ?? [];
    const cases = [
      {
        source: '/atlas/americas/chile/curico-valley',
        destination: '/atlas/americas/chile/central-valley/curico-valley',
        id: 'geo:cl:curico-valley',
      },
      {
        source: '/atlas/americas/chile/limari-valley',
        destination: '/atlas/americas/chile/coquimbo/limari-valley',
        id: 'geo:cl:limari-valley',
      },
    ];

    for (const { source, destination, id } of cases) {
      assert.deepEqual(
        redirects.find(redirect => redirect.source === source),
        { source, destination, permanent: true },
        `existing Atlas bookmark ${source} must not become a 404`
      );
      assert.equal(
        resolveUrlPath(destination.slice('/atlas/'.length).split('/')).node?.id,
        id,
        `redirect target ${destination} must resolve to the same atlas node`
      );
    }
  });
});
