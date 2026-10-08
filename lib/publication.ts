import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { getAllEditions } from './revisions';

/** Matches the publisher: SHA-256 of sorted path/NUL/content-hash/LF records. */
export function publicationDigest(): string {
  const root = process.cwd();
  const files = [
    'lib/atlas_v1.json', 'lib/education.json',
    'lib/grapes_v1_core.json', 'lib/grapes_v1_extended.json',
    ...fs.readdirSync(path.join(root, 'content/revisions'))
      .filter(name => name.endsWith('.json'))
      .map(name => `content/revisions/${name}`),
  ];
  const digest = createHash('sha256').update('vynr-web-publication-v1\n');
  for (const relative of files.sort()) {
    const hash = createHash('sha256').update(fs.readFileSync(path.join(root, relative))).digest('hex');
    digest.update(`${relative}\0${hash}\n`);
  }
  return digest.digest('hex');
}

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
