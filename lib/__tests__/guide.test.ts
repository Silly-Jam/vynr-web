import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { describe, it } from 'node:test';
import {
  GROUPS,
  chapterLine,
  getChapter,
  getGuide,
  jcsBytes,
  neighbours,
  tourProjectionDigest,
  verifyBundle,
  versionStamp,
  type GuideBundle,
} from '../guide';

const FRAMES = new URL('../../public/guide/', import.meta.url).pathname;
const guide = getGuide();
const sha256 = (data: string | Buffer) => createHash('sha256').update(data).digest('hex');
const copy = (): GuideBundle => JSON.parse(JSON.stringify(guide));

describe('canonical bytes match the vynr generator (RFC 8785, spec §7)', () => {
  it('writes numbers in ECMAScript form, the fixtures build_guide.py tests', () => {
    const fixtures: [number, string][] = [
      [0, '0'], [-0, '0'], [1, '1'], [0.5, '0.5'], [0.00001, '0.00001'], [0.000001, '0.000001'],
      [1e-7, '1e-7'], [9.9e-7, '9.9e-7'], [9.99e20, '999000000000000000000'], [1e21, '1e+21'],
      [1.5e21, '1.5e+21'], [0.2, '0.2'], [0.959, '0.959'], [123.456, '123.456'], [-0.25, '-0.25'],
      [1.2345e-8, '1.2345e-8'], [5e-324, '5e-324'], [100, '100'], [3, '3'],
    ];
    for (const [value, expected] of fixtures) assert.equal(jcsBytes(value), expected, String(value));
  });

  it('sorts keys, drops whitespace and escapes only what JSON requires', () => {
    assert.equal(jcsBytes({ b: 1, a: [0, 'x"y'] }), '{"a":[0,"x\\"y"],"b":1}');
    assert.equal(jcsBytes('\u0001/→'), '"\\u0001/→"');
    assert.equal(jcsBytes([true, false, null]), '[true,false,null]');
  });

  it('refuses values JSON cannot carry', () => {
    assert.throws(() => jcsBytes(Number.NaN), /non-finite/);
    assert.throws(() => jcsBytes(undefined), /unsupported/);
  });
});

describe('the bundle is the one vynr generated', () => {
  it('reproduces its contentHash over the chapters and images', () => {
    assert.equal(guide.contentHash, sha256(jcsBytes({ chapters: guide.chapters, images: guide.images })));
  });

  it('carries the bootstrap equality digest exactly when it was bootstrapped', () => {
    if (guide.guideSourceCommit === guide.appSourceCommit) {
      assert.equal(guide.bootstrapEqualityDigest, null);
    } else {
      assert.equal(guide.bootstrapEqualityDigest, tourProjectionDigest(guide));
    }
    assert.equal(tourProjectionDigest(guide), '8b917f987240761775f46bec3b8552730d527fe66a9a30c7583be845ad707181');
  });

  it('stamps the version its release tag names', () => {
    assert.match(guide.guideSourceCommit, /^[0-9a-f]{40}$/);
    assert.match(guide.appSourceCommit, /^[0-9a-f]{40}$/);
    const tag = guide.describes.match(/^v(\d+\.\d+(?:\.\d+)?)-build\d+-source$/);
    assert.ok(tag, guide.describes);
    assert.equal(guide.appVersion, tag[1]);
    assert.equal(versionStamp(guide), `Guide for vynr ${guide.appVersion}`);
  });

  it('ships every frame it lists, byte for byte, and lists every frame a tour uses', () => {
    for (const [name, hash] of Object.entries(guide.images)) {
      assert.equal(sha256(readFileSync(FRAMES + name)), hash, name);
    }
    const used = new Set(guide.chapters.flatMap(c => c.tour?.shots.map(s => s.file) ?? []));
    assert.deepEqual([...used].sort(), Object.keys(guide.images).sort());
  });

  it('rejects a bundle edited by hand', () => {
    const tampered = copy();
    tampered.chapters[0].tour!.shots[0].callouts[0].text += ' (edited)';
    assert.throws(() => verifyBundle(tampered, FRAMES), /contentHash/);
  });

  it('rejects a frame that does not match its hash', () => {
    const tampered = copy();
    const name = Object.keys(tampered.images)[0];
    tampered.images[name] = '0'.repeat(64);
    assert.throws(() => verifyBundle(tampered, FRAMES), new RegExp(name.replace('.', '\\.')));
  });

  it('rejects an unknown group and a stamp that disagrees with its tag', () => {
    const group = copy();
    group.chapters[0].group = 'misc';
    assert.throws(() => verifyBundle(group, FRAMES), /group/);
    const version = copy();
    version.appVersion = '9.9';
    assert.throws(() => verifyBundle(version, FRAMES), /appVersion/);
  });
});

describe('chapters keep the source order and its groups', () => {
  it('lists the twelve tour chapters in tour order, each in a known group', () => {
    assert.deepEqual(guide.chapters.map(c => c.id), [
      'move', 'jump', 'two-fingers', 'back-across', 'places', 'hold', 'pinch',
      'add', 'filters', 'follow', 'time-lens', 'journal',
    ]);
    const known: readonly string[] = GROUPS.map(g => g.id);
    for (const chapter of guide.chapters) assert.ok(known.includes(chapter.group), chapter.id);
  });

  it('gives each chapter its index line and its neighbours', () => {
    const move = getChapter('move')!;
    assert.equal(chapterLine(move), move.tour!.message);
    assert.equal(getChapter('nope'), undefined);
    assert.deepEqual(neighbours('move'), { previous: undefined, next: getChapter('jump') });
    assert.deepEqual(neighbours('journal'), { previous: getChapter('time-lens'), next: undefined });
  });
});
