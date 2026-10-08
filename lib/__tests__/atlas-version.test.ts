import { it } from 'node:test';
import assert from 'node:assert/strict';
import atlas from '../atlas_v1.json';
import nextConfig from '../../next.config';

it('the deployment probe reports the exact bundled Atlas epoch without caching', async () => {
  const { GET } = await import('../../app/api/atlas-version/route');
  const digest = nextConfig.env?.VYNR_PUBLICATION_DIGEST;
  assert.match(digest ?? '', /^[a-f0-9]{64}$/);
  const previous = process.env.VYNR_PUBLICATION_DIGEST;
  try {
    process.env.VYNR_PUBLICATION_DIGEST = digest;
    const response = GET();
    assert.deepEqual(await response.json(), {
      dataEpoch: atlas.dataEpoch, publicationDigest: digest,
    });
    assert.match(response.headers.get('Cache-Control') ?? '', /no-store/);
  } finally {
    if (previous === undefined) delete process.env.VYNR_PUBLICATION_DIGEST;
    else process.env.VYNR_PUBLICATION_DIGEST = previous;
  }
});
