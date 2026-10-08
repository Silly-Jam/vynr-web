import { it } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, readFileSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import { getAllEditions } from '../revisions';
import atlas from '../atlas_v1.json';

const siblingPaths = ['lib/education.json', 'lib/grapes_v1_core.json', 'lib/grapes_v1_extended.json'];

it('the shipped Atlas covers every published revision', () => {
  assert.ok(Math.max(...getAllEditions().map(e => e.to.epoch)) <= atlas.dataEpoch,
    'newest revision must not advance beyond bundled Atlas');
});

for (const [epoch, shouldPass] of [[959, false], [960, true], [961, true]] as const) {
  it(`the actual Next build configuration ${shouldPass ? 'accepts' : 'rejects'} Atlas ${epoch} with revision 960`, () => {
    const root = mkdtempSync(join(tmpdir(), 'web-publication-'));
    try {
      mkdirSync(join(root, 'lib'));
      mkdirSync(join(root, 'content/revisions'), { recursive: true });
      writeFileSync(join(root, 'lib/atlas_v1.json'), JSON.stringify({dataEpoch: epoch}));
      for (const relative of siblingPaths) writeFileSync(join(root, relative), '{}\n');
      writeFileSync(join(root, 'content/revisions/epoch-960.json'), JSON.stringify({
        schemaVersion: 1, editionId: 'epoch-960', from: {epoch: 959},
        to: {epoch: 960}, changes: [],
      }));
      const result = spawnSync(process.execPath, [
        ...process.execArgv,
        '--eval', `require(${JSON.stringify(resolve('next.config.ts'))})`,
      ], { cwd: root, encoding: 'utf8' });
      assert.equal(result.status === 0, shouldPass, result.stderr);
      if (!shouldPass) assert.match(result.stderr, /Atlas.*959.*revision.*960/i);
    } finally { rmSync(root, {recursive: true, force: true}); }
  });
}

it('the build digest changes for same-epoch edits to every public artifact and revision', () => {
  const root = mkdtempSync(join(tmpdir(), 'web-publication-digest-'));
  try {
    mkdirSync(join(root, 'lib'));
    mkdirSync(join(root, 'content/revisions'), { recursive: true });
    const paths = ['lib/atlas_v1.json', ...siblingPaths, 'content/revisions/epoch-960.json'];
    for (const relative of paths) writeFileSync(join(root, relative), '{}\n');
    writeFileSync(join(root, paths[0]), '{"dataEpoch":960}\n');
    writeFileSync(join(root, paths[4]), JSON.stringify({
      schemaVersion: 1, editionId: 'epoch-960', from: {epoch: 959},
      to: {epoch: 960}, changes: [],
    }));
    function buildDigest(): string {
      const result = spawnSync(process.execPath, [
        ...process.execArgv, '--eval',
        `console.log(require(${JSON.stringify(resolve('next.config.ts'))}).default.env?.VYNR_PUBLICATION_DIGEST)`,
      ], { cwd: root, encoding: 'utf8' });
      assert.equal(result.status, 0, result.stderr);
      return result.stdout.trim();
    }
    const before = buildDigest();
    // Shared protocol vector with the Python publisher's regression suite.
    assert.equal(before, '2f748a13101c6b628cea2cba3d45e5e08e831737098fc8a304fe0ab21d5d3227');
    assert.equal(buildDigest(), before, 'identical build inputs must have identical digests');
    for (const relative of paths) {
      const original = readFileSync(join(root, relative));
      writeFileSync(join(root, relative), '\n', {flag: 'a'});
      assert.notEqual(buildDigest(), before, `same-epoch byte correction to ${relative} must change digest`);
      writeFileSync(join(root, relative), original);
    }
    mkdirSync(join(root, 'content/revisions/highlights'));
    writeFileSync(join(root, 'content/revisions/highlights/epoch-960.json'), '{"human":"copy"}');
    assert.equal(buildDigest(), before, 'human highlights are outside the machine publication');
    writeFileSync(join(root, 'content/revisions/epoch-959.json'), JSON.stringify({
      schemaVersion: 1, editionId: 'epoch-959', from: {epoch: 958},
      to: {epoch: 959}, changes: [],
    }));
    assert.notEqual(buildDigest(), before, 'the complete revision file set is bound');
  } finally { rmSync(root, {recursive: true, force: true}); }
});
