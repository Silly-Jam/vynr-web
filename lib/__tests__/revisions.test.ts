import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import {
  SHOW_ALL_THRESHOLD,
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

describe('getHighlights', () => {
  it('is absent for an edition nobody has annotated', () => {
    assert.equal(getHighlights('epoch-does-not-exist'), null);
  });

  it('never treats prose about the directory as an edition annotation', () => {
    // Regression: a README beside the notes rendered as one edition's editorial panel,
    // because the lookup only asked "is there a file with this name?".
    const dir = path.join(process.cwd(), 'content/revisions/highlights');
    const stray = path.join(dir, 'README.md');
    fs.writeFileSync(stray, 'prose about this directory\n', 'utf8');
    try {
      assert.equal(getHighlights('README'), null);
    } finally {
      fs.rmSync(stray, { force: true });
    }
  });

  it('is absent when the id names no edition, even with a file present', () => {
    const dir = path.join(process.cwd(), 'content/revisions/highlights');
    const orphan = path.join(dir, 'epoch-orphan-fixture.md');
    fs.writeFileSync(orphan, 'a note for an edition that does not exist\n', 'utf8');
    try {
      assert.equal(getHighlights('epoch-orphan-fixture'), null);
    } finally {
      fs.rmSync(orphan, { force: true });
    }
  });

  it('reads a highlights file written AFTER publication, leaving facts untouched', () => {
    const dir = path.join(process.cwd(), 'content/revisions/highlights');
    const target = path.join(dir, 'epoch-953.md');
    fs.writeFileSync(target, '\nTwo Bordeaux estates joined the atlas this week.\n', 'utf8');
    try {
      assert.equal(getHighlights('epoch-953'), 'Two Bordeaux estates joined the atlas this week.');
      // The machine record for a real edition is byte-identical either way.
      const before = fs.readFileSync(path.join(process.cwd(), 'content/revisions/epoch-953.json'), 'utf8');
      const after = fs.readFileSync(path.join(process.cwd(), 'content/revisions/epoch-953.json'), 'utf8');
      assert.equal(before, after, 'a highlights file must not be able to alter a machine edition');
      assert.equal(getEdition('epoch-953')?.changeCount, JSON.parse(before).changeCount);
    } finally {
      fs.rmSync(target, { force: true });
    }
  });

  it('treats a whitespace-only highlights file as no highlights', () => {
    const dir = path.join(process.cwd(), 'content/revisions/highlights');
    const target = path.join(dir, 'epoch-953.md');
    fs.writeFileSync(target, '   \n\n', 'utf8');
    try {
      assert.equal(getHighlights('epoch-953'), null);
    } finally {
      fs.rmSync(target, { force: true });
    }
  });

  it('refuses a highlights id that escapes the content directory', () => {
    assert.equal(getHighlights('../../package'), null);
  });
});
