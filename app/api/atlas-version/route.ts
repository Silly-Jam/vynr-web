import atlas from '../../../lib/atlas_v1.json';

/** Build-bound identity of the public artifact set actually deployed. */
export function GET(): Response {
  const publicationDigest = process.env.VYNR_PUBLICATION_DIGEST;
  if (!publicationDigest || !/^[a-f0-9]{64}$/.test(publicationDigest)) {
    throw new Error('Missing build publication digest');
  }
  return Response.json({ dataEpoch: atlas.dataEpoch, publicationDigest }, {
    headers: { 'Cache-Control': 'no-store' },
  });
}
