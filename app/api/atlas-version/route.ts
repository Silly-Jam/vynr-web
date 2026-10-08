import atlas from '../../../lib/atlas_v1.json';

/** The epoch actually bundled in this deployment, not an upstream release claim. */
export function GET(): Response {
  return Response.json({ dataEpoch: atlas.dataEpoch }, {
    headers: { 'Cache-Control': 'no-store' },
  });
}
