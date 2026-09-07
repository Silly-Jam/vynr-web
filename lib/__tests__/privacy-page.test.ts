import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { describe, it } from 'node:test';

const page = readFileSync(new URL('../../app/privacy/page.tsx', import.meta.url), 'utf8');
const words = page.replace(/&apos;/g, "'").replace(/\s+/g, ' ');

describe('privacy page matches the shipping service boundaries', () => {
  it('distinguishes app AI providers from a user-connected Assistant Link', () => {
    assert.match(
      words,
      /We do not send your notes, tastings, ratings, or journal content to the AI providers behind AI Commentary, AI Fix, or guide reads/,
    );
    assert.match(
      words,
      /If you connect Assistant Link, the assistant you choose reads the redacted projection, which may include derived rating summaries/,
    );
  });

  it('describes iCloud and uninstall behavior without implying broader deletion', () => {
    assert.match(words, /If iCloud is on for vynr, the data is stored in your private iCloud database/);
    assert.match(
      words,
      /Uninstalling the app removes local data from the device, but does not delete published Share or Assistant Link data/,
    );
  });

  it('discloses the separate Cellar Health stored-label flow', () => {
    assert.match(
      words,
      /For Cellar Health, vynr sends each eligible wine's saved label photo, the text read from that photo, and the wine's stored details/,
    );
    assert.match(
      words,
      /Cellar Health has its own first-use disclosure, separate from a manual AI Fix disclosure/,
    );
  });
});
