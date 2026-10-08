import { it } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import { getAllEditions } from '../revisions';
import atlas from '../atlas_v1.json';

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
