import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { describe, it } from 'node:test';
import { getChapter, type Shot } from '../guide';
import { OVERLAY, displaySpace, jpegSize, overlay, type OverlayPrimitive } from '../guide-overlay';

const frame = (name: string) => readFileSync(new URL(`../../public/guide/${name}`, import.meta.url));
const shot = (chapter: string, index: number): Shot => getChapter(chapter)!.tour!.shots[index];
const sizeOf = (s: Shot) => {
  const px = jpegSize(frame(s.file));
  return displaySpace(px.width, px.height);
};
const drawn = (s: Shot) => overlay(s, sizeOf(s));
const kinds = (prims: OverlayPrimitive[], kind: OverlayPrimitive['kind']) => prims.filter(p => p.kind === kind);
const fingers = (prims: OverlayPrimitive[]) => kinds(prims, 'finger') as Extract<OverlayPrimitive, { kind: 'finger' }>[];
const rings = (prims: OverlayPrimitive[]) => kinds(prims, 'holdRing') as Extract<OverlayPrimitive, { kind: 'holdRing' }>[];
const paths = (prims: OverlayPrimitive[], role: 'arrow' | 'movement') =>
  prims.filter((p): p is Extract<OverlayPrimitive, { kind: 'path' }> => p.kind === 'path' && p.role === role);
const close = (actual: number, expected: number, message?: string) =>
  assert.ok(Math.abs(actual - expected) < 0.002, `${message ?? ''} ${actual} ≠ ${expected}`);

/** The primitives one callout drew: from its ring up to and including its badge. */
function perCallout(prims: OverlayPrimitive[]): OverlayPrimitive[][] {
  const groups: OverlayPrimitive[][] = [];
  for (const p of prims) {
    if (p.kind === 'ring') groups.push([]);
    if (p.kind !== 'vignette') groups[groups.length - 1].push(p);
  }
  return groups;
}

describe('the overlay draws in the app display space', () => {
  it('reads each frame size from the JPEG itself', () => {
    assert.deepEqual(jpegSize(frame('walkthrough-01-cellar.jpg')), { width: 603, height: 1206 });
    assert.deepEqual(jpegSize(frame('walkthrough-06-record-bar.jpg')), { width: 603, height: 131 });
    assert.throws(() => jpegSize(Buffer.from('not a jpeg')), /not a JPEG/);
  });

  it('fits a frame into the 300 × 400 box: height-limited and width-limited', () => {
    const tall = displaySpace(603, 1206);
    close(tall.width, 200);
    close(tall.height, 400);
    const wide = displaySpace(603, 131);
    close(wide.width, 300);
    close(wide.height, 65.174);
  });
});

describe('the overlay is the app overlay, on the real chapters', () => {
  it('dims everything but the targets, and rings, numbers and badges every callout in order', () => {
    for (const id of ['move', 'jump', 'places', 'journal']) {
      for (const s of getChapter(id)!.tour!.shots) {
        const prims = drawn(s);
        assert.equal(prims[0].kind, 'vignette');
        const groups = perCallout(prims);
        assert.equal(groups.length, s.callouts.length);
        groups.forEach((group, i) => {
          assert.equal(group[0].kind, 'ring', 'a callout starts with its ring');
          const last = group[group.length - 1];
          assert.equal(last.kind, 'badge', 'and ends with its badge');
          assert.equal((last as { number: number }).number, s.callouts[i].number);
        });
      }
    }
  });

  it('draws a one-finger flick from where the finger lands, with no badge arrow', () => {
    const s = shot('move', 0);
    const prims = drawn(s);
    const ring = prims[1] as Extract<OverlayPrimitive, { kind: 'ring' }>;
    close(ring.x, 0.01 * 200 - 4);
    close(ring.w, 0.98 * 200 + 8);
    assert.deepEqual(fingers(prims).map(f => [f.cx, f.cy]), [[100, 328]]);
    assert.equal(paths(prims, 'arrow').length, 0, 'a callout with a trace draws no badge arrow');
    assert.equal(paths(prims, 'movement').length, 1);
  });

  it('rings the end of a drag-and-hold, and omits an arrow whose badge sits by its target', () => {
    const s = shot('jump', 0);
    const [first, second] = perCallout(drawn(s));
    const size = sizeOf(s);
    const end = s.callouts[0].trace!.to;
    assert.deepEqual(rings(first).map(r => [r.cx, r.cy, r.outer]),
      [[Math.round(end[0] * size.width * 1000) / 1000, Math.round(end[1] * size.height * 1000) / 1000, false]]);
    assert.equal(paths(second, 'arrow').length, 0, 'callout 2 badge is within 14 + 6 pt of its target');
  });

  it('draws a badge arrow from 14 pt off the badge to the edge of the target', () => {
    for (const [id, index] of [['follow', 0], ['add', 0]] as const) {
      const s = shot(id, index);
      const size = sizeOf(s);
      const callout = s.callouts[0];
      const [arrow] = paths(perCallout(drawn(s))[0], 'arrow');
      assert.ok(arrow, `${id}: the first callout draws an arrow`);
      const [start, end] = arrow.d.split(' M ')[0].replace('M ', '').split(' L ').map(p => p.split(' ').map(Number));
      const badge = [callout.badge[0] * size.width, callout.badge[1] * size.height];
      close(Math.hypot(start[0] - badge[0], start[1] - badge[1]), 14, `${id} start`);
      const [x, y, w, h] = callout.target;
      const t = { x: x * size.width - 4, y: y * size.height - 4, r: (x + w) * size.width + 4, b: (y + h) * size.height + 4 };
      const onEdge = [Math.abs(end[0] - t.x), Math.abs(end[0] - t.r), Math.abs(end[1] - t.y), Math.abs(end[1] - t.b)]
        .some(d => d < 0.002);
      assert.ok(onEdge, `${id}: the arrow ends on the inset target's edge`);
    }
  });

  it('draws two fingers 26 pt apart across the travel, each ringed at the end when they hold', () => {
    for (const s of getChapter('two-fingers')!.tour!.shots) {
      const prims = drawn(s);
      const dots = fingers(prims);
      assert.equal(dots.length, 2);
      const vertical = Math.abs(s.callouts[0].trace!.to[1] - s.callouts[0].trace!.from[1]) >
        Math.abs(s.callouts[0].trace!.to[0] - s.callouts[0].trace!.from[0]);
      close(Math.abs(vertical ? dots[0].cx - dots[1].cx : dots[0].cy - dots[1].cy), 26, 'finger spacing');
      assert.equal(rings(prims).length, 2, 'one end ring per finger');
      assert.equal(paths(prims, 'movement').length, 2);
    }
  });

  it('draws a press-and-hold as two rings and a still finger, with no movement', () => {
    const [hold] = perCallout(drawn(shot('hold', 0)));
    assert.deepEqual(hold.map(p => p.kind), ['ring', 'holdRing', 'holdRing', 'finger', 'badge']);
    const [inner, outer] = rings(hold);
    assert.equal(inner.outer, false);
    assert.equal(outer.outer, true);
    assert.deepEqual([inner.cx, inner.cy], [outer.cx, outer.cy]);
    assert.equal(paths(hold, 'movement').length, 0);
  });

  it('mirrors a spread and a pinch through the meeting point, a finger apart there', () => {
    for (const [index, motion] of [[0, 'spread'], [1, 'pinch']] as const) {
      const s = shot('pinch', index);
      const callout = s.callouts[0];
      assert.equal(callout.trace!.motion, motion);
      const size = sizeOf(s);
      const centre = motion === 'spread' ? callout.trace!.from : callout.trace!.to;
      const c = { x: centre[0] * size.width, y: centre[1] * size.height };
      const dots = fingers(perCallout(drawn(s))[0]);
      assert.equal(dots.length, 2);
      close((dots[0].cx + dots[1].cx) / 2, c.x, `${motion} mirror x`);
      close((dots[0].cy + dots[1].cy) / 2, c.y, `${motion} mirror y`);
      if (motion === 'spread') {
        close(Math.hypot(dots[0].cx - dots[1].cx, dots[0].cy - dots[1].cy), 2 * OVERLAY.fingerDiameter, 'gap at the centre');
      }
    }
  });

  it('numbers badges continuously across the shots of a page', () => {
    for (const chapter of ['places', 'time-lens', 'journal']) {
      const numbers = getChapter(chapter)!.tour!.shots.flatMap(s =>
        (kinds(drawn(s), 'badge') as Extract<OverlayPrimitive, { kind: 'badge' }>[]).map(b => b.number));
      assert.deepEqual(numbers, numbers.map((_, i) => i + 1));
    }
  });
});
