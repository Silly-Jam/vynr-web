import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import {
  SHOW_ALL_THRESHOLD,
  formatDate,
  SUPPORTED_SCHEMA_VERSION,
  UnsupportedEditionError,
  describeUpdate,
  getAllEditions,
  getEdition,
  getHighlights,
  groupByCategory,
  parseEdition,
  showsEveryChangeByDefault,
  summaryParts,
  type Edition,
  type RevisionChange,
} from '../revisions';

// ─── Helpers ─────────────────────────────────────────────────────────────────

function change(overrides: Partial<RevisionChange> = {}): RevisionChange {
  return {
    category: 'Producers',
    kind: 'added',
    id: 'Domaine Test',
    label: 'Domaine Test',
    datasets: ['ocr/producers_v1_extended.json'],
    ...overrides,
  };
}

function edition(changes: RevisionChange[]): Edition {
  return {
    schemaVersion: SUPPORTED_SCHEMA_VERSION,
    editionId: 'epoch-999',
    generatedAt: '2026-09-08T00:00:00Z',
    from: { epoch: 998, commit: 'a'.repeat(40), committedAt: '2026-09-01T00:00:00Z', registrySha256: '0'.repeat(64) },
    to: { epoch: 999, commit: 'b'.repeat(40), committedAt: '2026-09-08T00:00:00Z', registrySha256: '1'.repeat(64) },
    changeCount: changes.length,
    categories: [],
    changes,
  };
}

function many(count: number): RevisionChange[] {
  return Array.from({ length: count }, (_, i) =>
    change({ id: `Domaine ${i}`, label: `Domaine ${i}` })
  );
}

// ─── The fewer-than-ten rule ────────────────────────────────────────────────

describe('showsEveryChangeByDefault', () => {
  it('shows every change when the edition is smaller than the threshold', () => {
    assert.equal(showsEveryChangeByDefault(edition(many(SHOW_ALL_THRESHOLD - 1))), true);
  });

  it('folds the detail away exactly AT the threshold, not one past it', () => {
    // The boundary is where a rule silently becomes the other rule, so it is pinned
    // on both sides rather than only in the middle of each range.
    assert.equal(showsEveryChangeByDefault(edition(many(SHOW_ALL_THRESHOLD))), false);
    assert.equal(showsEveryChangeByDefault(edition(many(SHOW_ALL_THRESHOLD + 40))), false);
  });

  it('treats an empty edition as fully shown, so the page states the absence', () => {
    assert.equal(showsEveryChangeByDefault(edition([])), true);
  });

  it('reads changeCount, not the array length', () => {
    // The count is the generator's own claim; the renderer must not silently
    // substitute its own tally and disagree with the record it is displaying.
    const doc = edition(many(3));
    doc.changeCount = SHOW_ALL_THRESHOLD + 1;
    assert.equal(showsEveryChangeByDefault(doc), false);
  });
});

// ─── Grouping keeps the generator's order ───────────────────────────────────

describe('groupByCategory', () => {
  it('groups consecutive runs and preserves the emitted order', () => {
    const groups = groupByCategory([
      change({ category: 'Producers', label: 'B' }),
      change({ category: 'Producers', label: 'A' }),
      change({ category: 'Appellations', label: 'C' }),
    ]);
    assert.deepEqual(
      groups.map((g) => [g.category, g.changes.map((c) => c.label)]),
      [
        ['Producers', ['B', 'A']],
        ['Appellations', ['C']],
      ]
    );
  });

  it('does not merge a category that reappears later', () => {
    // Re-merging would reorder the record. The generator owns the ordering; a second
    // ordering rule here could disagree with the one the edition was written in.
    const groups = groupByCategory([
      change({ category: 'Producers' }),
      change({ category: 'Grapes' }),
      change({ category: 'Producers' }),
    ]);
    assert.deepEqual(groups.map((g) => g.category), ['Producers', 'Grapes', 'Producers']);
  });

  it('returns nothing for an empty edition', () => {
    assert.deepEqual(groupByCategory([]), []);
  });
});

// ─── Withheld field names are reported as a count, never named ──────────────

describe('describeUpdate', () => {
  it('names the public fields that changed', () => {
    assert.equal(describeUpdate(change({ kind: 'updated', fields: ['aliases', 'country'], otherFieldCount: 0 })), 'aliases, country');
  });

  it('reports withheld refinements as a count with no names', () => {
    const text = describeUpdate(change({ kind: 'updated', fields: [], otherFieldCount: 3 }));
    assert.equal(text, '3 details');
  });

  it('combines named fields with a count of the rest', () => {
    assert.equal(
      describeUpdate(change({ kind: 'updated', fields: ['known_cuvees'], otherFieldCount: 3 })),
      'known_cuvees, and 3 further details'
    );
  });

  it('singularises one withheld refinement', () => {
    assert.equal(describeUpdate(change({ kind: 'updated', fields: [], otherFieldCount: 1 })), '1 detail');
  });

  it('still says something when an update carries no field detail at all', () => {
    assert.equal(describeUpdate(change({ kind: 'updated' })), 'refined');
  });
});

describe('summaryParts', () => {
  it('omits the zeroes', () => {
    assert.deepEqual(summaryParts({ category: 'X', added: 2, updated: 1, removed: 0 }), ['2 added', '1 refined']);
  });

  it('is empty for an untouched category', () => {
    assert.deepEqual(summaryParts({ category: 'X', added: 0, updated: 0, removed: 0 }), []);
  });
});

// ─── An edition this renderer cannot fully display is refused ───────────────

describe('parseEdition', () => {
  it('refuses an unknown schema version rather than dropping fields silently', () => {
    assert.throws(
      () => parseEdition(JSON.stringify({ schemaVersion: 99, editionId: 'x' }), 'x'),
      UnsupportedEditionError
    );
  });

  it('refuses an edition missing its endpoints', () => {
    assert.throws(
      () => parseEdition(JSON.stringify({ schemaVersion: 1, editionId: 'x', changes: [] }), 'x'),
      UnsupportedEditionError
    );
  });
});

// ─── The published record on disk ───────────────────────────────────────────

describe('the published editions', () => {
  it('parses every edition committed to this repository', () => {
    const editions = getAllEditions();
    assert.ok(editions.length > 0, 'no editions are published');
    for (const e of editions) {
      assert.equal(e.schemaVersion, SUPPORTED_SCHEMA_VERSION);
      assert.equal(e.changeCount, e.changes.length);
    }
  });

  it('sorts newest epoch first', () => {
    const epochs = getAllEditions().map((e) => e.to.epoch);
    assert.deepEqual(epochs, [...epochs].sort((a, b) => b - a));
  });

  it('retains both epoch endpoints with their registry digests', () => {
    for (const e of getAllEditions()) {
      assert.ok(e.from.epoch < e.to.epoch, `${e.editionId} endpoints are not ordered`);
      assert.match(e.from.registrySha256, /^[0-9a-f]{64}$/);
      assert.match(e.to.registrySha256, /^[0-9a-f]{64}$/);
    }
  });

  it('carries no redacted curation vocabulary', () => {
    // The same denylist vynr-data enforces when it writes the edition. Asserted again
    // HERE because this repository is the public one: if the guard upstream ever
    // regressed, this is the last place it can be caught before deployment.
    const forbidden = ['canonicalRoster', 'canonical_roster', 'importanceScore', 'expectedCount', 'visibility'];
    const dir = path.join(process.cwd(), 'content/revisions');
    for (const name of fs.readdirSync(dir).filter((f) => f.endsWith('.json'))) {
      const raw = fs.readFileSync(path.join(dir, name), 'utf8');
      for (const token of forbidden) {
        assert.ok(!raw.includes(token), `${name} leaks ${token}`);
      }
    }
  });

  it('returns null for an edition that does not exist', () => {
    assert.equal(getEdition('epoch-does-not-exist'), null);
  });

  it('refuses an edition id that escapes the content directory', () => {
    // `editionId` arrives from a URL segment, already decoded by the router.
    assert.equal(getEdition('../../package'), null);
    assert.equal(getEdition('../../../etc/passwd'), null);
  });
});

// ─── Highlights are additive and human-owned ────────────────────────────────

const EDITIONS_DIR = path.join(process.cwd(), 'content/revisions');
const HIGHLIGHTS_DIR = path.join(process.cwd(), 'content/revisions/highlights');

/**
 * Run `body` with a synthetic edition and optional highlights file in place.
 *
 * These fixtures live in the REAL content directory, because that is what the module
 * under test reads. Two rules follow, and the second is why this helper exists at all:
 * every fixture uses an id no generated edition can produce, and the helper REFUSES to
 * start if a fixture path already exists rather than overwriting it. An earlier version
 * of these tests wrote and then deleted `highlights/epoch-953.md` — so running the
 * suite would have destroyed a human's editorial note for a real edition, silently.
 * A test may never delete content it did not create.
 */
function withFixtures(
  files: { path: string; body: string }[],
  body: () => void
): void {
  for (const file of files) {
    assert.ok(!fs.existsSync(file.path), `refusing to overwrite ${file.path}`);
  }
  fs.mkdirSync(HIGHLIGHTS_DIR, { recursive: true });
  for (const file of files) fs.writeFileSync(file.path, file.body, 'utf8');
  try {
    body();
  } finally {
    // Only the exact paths this helper created, and only after proving they were absent.
    for (const file of files) fs.rmSync(file.path, { force: true });
  }
}

const FIXTURE_ID = 'epoch-fixture-not-a-real-edition';
const fixtureEdition = (id: string) => ({
  path: path.join(EDITIONS_DIR, `${id}.json`),
  body: JSON.stringify({ ...edition([change()]), editionId: id }, null, 2) + '\n',
});
const fixtureHighlights = (id: string, text: string) => ({
  path: path.join(HIGHLIGHTS_DIR, `${id}.md`),
  body: text,
});

describe('getHighlights', () => {
  it('is absent for an edition nobody has annotated', () => {
    assert.equal(getHighlights('epoch-does-not-exist'), null);
  });

  it('never treats prose about the directory as an edition annotation', () => {
    // Regression: a README beside the notes rendered as one edition's editorial panel,
    // because the lookup only asked "is there a file with this name?".
    withFixtures([fixtureHighlights('README', 'prose about this directory\n')], () => {
      assert.equal(getHighlights('README'), null);
    });
  });

  it('is absent when the id names no edition, even with a file present', () => {
    withFixtures([fixtureHighlights(FIXTURE_ID, 'a note for an edition that does not exist\n')], () => {
      assert.equal(getHighlights(FIXTURE_ID), null);
    });
  });

  it('reads a highlights file written AFTER publication, leaving facts untouched', () => {
    const realEdition = path.join(EDITIONS_DIR, 'epoch-953.json');
    const before = fs.readFileSync(realEdition, 'utf8');
    withFixtures(
      [fixtureEdition(FIXTURE_ID), fixtureHighlights(FIXTURE_ID, '\nTwo Bordeaux estates joined the atlas this week.\n')],
      () => {
        assert.equal(getHighlights(FIXTURE_ID), 'Two Bordeaux estates joined the atlas this week.');
        assert.equal(getEdition(FIXTURE_ID)?.changeCount, 1, 'the annotated edition still reads');
      }
    );
    // A real, published edition is byte-identical throughout: annotation is additive.
    assert.equal(fs.readFileSync(realEdition, 'utf8'), before);
  });

  it('treats a whitespace-only highlights file as no highlights', () => {
    withFixtures([fixtureEdition(FIXTURE_ID), fixtureHighlights(FIXTURE_ID, '   \n\n')], () => {
      assert.equal(getHighlights(FIXTURE_ID), null);
    });
  });

  it('refuses a highlights id that escapes the content directory', () => {
    assert.equal(getHighlights('../../package'), null);
  });
});

// ─── The filename is the URL, so the id cannot disagree with it ─────────────

describe('editionId is bound to its filename', () => {
  it('refuses an edition whose id does not match the file it was read from', () => {
    // Otherwise the index links to `/revisions/<id>`, which resolves by looking for
    // `<id>.json` and 404s: the record advertises an edition nobody can open.
    assert.throws(
      () => parseEdition(JSON.stringify({ ...edition([]), editionId: 'epoch-999' }), 'epoch-953.json', 'epoch-953'),
      UnsupportedEditionError
    );
  });

  it('accepts a matching id', () => {
    const doc = parseEdition(JSON.stringify({ ...edition([]), editionId: 'epoch-999' }), 'epoch-999.json', 'epoch-999');
    assert.equal(doc.editionId, 'epoch-999');
  });

  it('holds for every edition committed to this repository', () => {
    for (const name of fs.readdirSync(EDITIONS_DIR).filter((f) => f.endsWith('.json'))) {
      const doc = JSON.parse(fs.readFileSync(path.join(EDITIONS_DIR, name), 'utf8'));
      assert.equal(doc.editionId, name.replace(/\.json$/, ''));
    }
  });
});

// ─── Dates render identically wherever the site is built ────────────────────

describe('formatDate', () => {
  it('renders the calendar date the timestamp itself carries', () => {
    // 02:00+08:00 is the previous day in UTC. A build host must not be able to move
    // a published record's date, in either direction.
    assert.equal(formatDate('2026-09-04T02:00:00+08:00'), 'September 4, 2026');
    assert.equal(formatDate('2026-09-04T23:30:00-05:00'), 'September 4, 2026');
    assert.equal(formatDate('2026-09-04T09:59:47+08:00'), 'September 4, 2026');
  });

  it('is independent of the process timezone', () => {
    const original = process.env.TZ;
    const rendered: string[] = [];
    try {
      for (const tz of ['UTC', 'Asia/Singapore', 'America/Los_Angeles', 'Pacific/Kiritimati']) {
        process.env.TZ = tz;
        rendered.push(formatDate('2026-09-04T02:00:00+08:00'));
      }
    } finally {
      if (original === undefined) delete process.env.TZ;
      else process.env.TZ = original;
    }
    assert.deepEqual(new Set(rendered), new Set(['September 4, 2026']));
  });

  it('returns an unparseable value unchanged rather than inventing a date', () => {
    assert.equal(formatDate('not a date'), 'not a date');
  });
});
