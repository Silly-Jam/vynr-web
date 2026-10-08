import { it } from 'node:test';
import assert from 'node:assert/strict';
import atlas from '../atlas_v1.json';

it('the deployment probe reports the exact bundled Atlas epoch without caching', async () => {
  const { GET } = await import('../../app/api/atlas-version/route');
  const response = GET();
  assert.deepEqual(await response.json(), {dataEpoch: atlas.dataEpoch});
  assert.match(response.headers.get('Cache-Control') ?? '', /no-store/);
});
