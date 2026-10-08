import fs from 'node:fs';
import path from 'node:path';
import { getAllEditions } from './revisions';

/** Refuse a build that advertises a release newer than its bundled Atlas. */
export function assertPublicationEpochs(): void {
  const atlas = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'lib/atlas_v1.json'), 'utf8'));
  if (!Number.isSafeInteger(atlas.dataEpoch) || atlas.dataEpoch < 0) {
    throw new Error('Atlas has an invalid dataEpoch');
  }
  for (const edition of getAllEditions()) {
    if (!Number.isSafeInteger(edition.to.epoch) || edition.to.epoch < 0) {
      throw new Error(`Revision ${edition.editionId} has an invalid epoch`);
    }
    if (edition.to.epoch > atlas.dataEpoch) {
      throw new Error(`Atlas epoch ${atlas.dataEpoch} is behind revision epoch ${edition.to.epoch}`);
    }
  }
}
