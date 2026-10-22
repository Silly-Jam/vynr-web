import type { Callout, Shot, Trace } from './guide'

// The in-app tour's overlay (vynr FeatureTourShotView, SJAM-568/570/603) as SVG geometry, so
// the web guide draws each shot the way the app does. Everything is in the app's display
// space: the capture fitted into a 300 × 400 pt box, the box the app lays a shot out in. Every
// constant below is the app's, and each function translates one Swift function line for line.
// Spec: vynr docs/superpowers/specs/2026-10-21-guide-single-source-design.md §6.
export const OVERLAY = {
  box: { width: 300, height: 400 },
  imageCorner: 18,
  cardStrokeWidth: 1,
  vignetteOpacity: 0.38,
  targetInset: 4,
  targetCorner: 8,
  ringWidth: 2.5,
  badgeDiameter: 24,
  badgeFontSize: 13,
  badgeOutline: 1.5,
  arrowWidth: 2,
  arrowHead: 7,
  fingerDiameter: 20,
  fingerFillOpacity: 0.92,
  fingerRingWidth: 2.5,
  movementWidth: 3,
  movementHead: 9,
  headSpread: 0.6,
  twoFingerSpacing: 13,
  holdRingGrowth: 12,
  holdRingWidth: 2,
  holdRingDash: '3 3',
  outerHoldRingGrowth: 24,
  outerHoldRingWidth: 1.5,
  outerHoldRingDash: '3 4',
  outerHoldRingOpacity: 0.55,
  /** CellarCanvas, the canvas the tour's shots are drawn with. Used inside the overlay only. */
  colours: { tint: '#8C7360', textPrimary: '#262420', cardStroke: '#D4CFC4' },
} as const

export interface Size {
  width: number
  height: number
}

interface Point {
  x: number
  y: number
}

interface Rect extends Point {
  w: number
  h: number
}

export type OverlayPrimitive =
  | { kind: 'vignette'; d: string }
  | { kind: 'ring'; x: number; y: number; w: number; h: number }
  | { kind: 'path'; role: 'arrow' | 'movement'; d: string }
  | { kind: 'finger'; cx: number; cy: number }
  | { kind: 'holdRing'; cx: number; cy: number; outer: boolean }
  | { kind: 'badge'; cx: number; cy: number; number: number }

const JPEG_SOF = new Set([0xc0, 0xc1, 0xc2])

/** The pixel size from a JPEG's start-of-frame marker: the frame itself, never its filename. */
export function jpegSize(bytes: Buffer): Size {
  if (bytes[0] !== 0xff || bytes[1] !== 0xd8) throw new Error('jpegSize: not a JPEG')
  let offset = 2
  while (offset + 9 < bytes.length) {
    if (bytes[offset] !== 0xff) throw new Error(`jpegSize: bad marker at ${offset}`)
    const marker = bytes[offset + 1]
    if (JPEG_SOF.has(marker)) {
      return { height: bytes.readUInt16BE(offset + 5), width: bytes.readUInt16BE(offset + 7) }
    }
    offset += 2 + bytes.readUInt16BE(offset + 2)
  }
  throw new Error('jpegSize: no start-of-frame marker')
}

/** The capture fitted into the app's 300 × 400 pt box (`.scaledToFit()` in the app). */
export function displaySpace(width: number, height: number): Size & { scale: number } {
  const scale = Math.min(OVERLAY.box.width / width, OVERLAY.box.height / height)
  return { scale, width: width * scale, height: height * scale }
}

const round = (value: number) => Math.round(value * 1000) / 1000
const fmt = (p: Point) => `${round(p.x)} ${round(p.y)}`

function rect([x, y, w, h]: Callout['target'], size: Size): Rect {
  return { x: x * size.width, y: y * size.height, w: w * size.width, h: h * size.height }
}

function inset(r: Rect, by: number): Rect {
  return { x: r.x - by, y: r.y - by, w: r.w + 2 * by, h: r.h + 2 * by }
}

function roundedRect(r: Rect, c: number): string {
  const right = r.x + r.w
  const bottom = r.y + r.h
  return [
    `M ${fmt({ x: r.x + c, y: r.y })}`,
    `H ${round(right - c)} A ${c} ${c} 0 0 1 ${fmt({ x: right, y: r.y + c })}`,
    `V ${round(bottom - c)} A ${c} ${c} 0 0 1 ${fmt({ x: right - c, y: bottom })}`,
    `H ${round(r.x + c)} A ${c} ${c} 0 0 1 ${fmt({ x: r.x, y: bottom - c })}`,
    `V ${round(r.y + c)} A ${c} ${c} 0 0 1 ${fmt({ x: r.x + c, y: r.y })} Z`,
  ].join(' ')
}

/** A stroke to `end` with an arrowhead, as `movement` and `arrow` draw it. */
function arrowPath(start: Point, end: Point, unit: Point, head: number): string {
  const k = OVERLAY.headSpread
  const left = { x: end.x - unit.x * head - unit.y * head * k, y: end.y - unit.y * head + unit.x * head * k }
  const right = { x: end.x - unit.x * head + unit.y * head * k, y: end.y - unit.y * head - unit.x * head * k }
  return `M ${fmt(start)} L ${fmt(end)} M ${fmt(left)} L ${fmt(end)} L ${fmt(right)}`
}

/** `movement(from:to:)`: from the finger dot's edge to the end; nothing when shorter than a finger. */
function movement(start: Point, end: Point): OverlayPrimitive[] {
  const dx = end.x - start.x
  const dy = end.y - start.y
  const length = Math.hypot(dx, dy)
  if (length <= OVERLAY.fingerDiameter) return []
  const unit = { x: dx / length, y: dy / length }
  const origin = { x: start.x + (unit.x * OVERLAY.fingerDiameter) / 2, y: start.y + (unit.y * OVERLAY.fingerDiameter) / 2 }
  return [{ kind: 'path', role: 'movement', d: arrowPath(origin, end, unit, OVERLAY.movementHead) }]
}

/** `arrow(from:to:)`: badge edge to the nearest point of the target; nothing when the badge sits on it. */
function arrow(badge: Point, target: Rect): OverlayPrimitive[] {
  const end = {
    x: Math.min(Math.max(badge.x, target.x), target.x + target.w),
    y: Math.min(Math.max(badge.y, target.y), target.y + target.h),
  }
  const dx = end.x - badge.x
  const dy = end.y - badge.y
  const length = Math.hypot(dx, dy)
  const radius = OVERLAY.badgeDiameter / 2 + 2
  if (length <= radius + 6) return []
  const unit = { x: dx / length, y: dy / length }
  const start = { x: badge.x + unit.x * radius, y: badge.y + unit.y * radius }
  return [{ kind: 'path', role: 'arrow', d: arrowPath(start, end, unit, OVERLAY.arrowHead) }]
}

const finger = (p: Point): OverlayPrimitive => ({ kind: 'finger', cx: round(p.x), cy: round(p.y) })
const holdRing = (p: Point, outer: boolean): OverlayPrimitive => ({ kind: 'holdRing', cx: round(p.x), cy: round(p.y), outer })

/** `fingerTrace`: one finger of a spread or pinch, its movement then its dot. */
function fingerTrace(start: Point, end: Point): OverlayPrimitive[] {
  return [...movement(start, end), finger(start)]
}

/** `traceView`: the finger dot(s), the movement and, for a hold, the rings. */
function trace(t: Trace, size: Size): OverlayPrimitive[] {
  const from = { x: t.from[0] * size.width, y: t.from[1] * size.height }
  const to = { x: t.to[0] * size.width, y: t.to[1] * size.height }
  if (t.motion === 'hold') {
    // A press-and-hold: no arrow, because the gesture is the finger staying still.
    return [holdRing(from, false), holdRing(from, true), finger(from)]
  }
  if (t.motion === 'parallel') {
    // Two fingers sit side by side across the direction of travel.
    const offsets = t.fingers === 2 ? [-OVERLAY.twoFingerSpacing, OVERLAY.twoFingerSpacing] : [0]
    const vertical = Math.abs(to.y - from.y) > Math.abs(to.x - from.x)
    const across = vertical ? { x: 1, y: 0 } : { x: 0, y: 1 }
    return offsets.flatMap(offset => {
      const start = { x: from.x + across.x * offset, y: from.y + across.y * offset }
      const end = { x: to.x + across.x * offset, y: to.y + across.y * offset }
      return [...movement(start, end), finger(start), ...(t.hold ? [holdRing(end, false)] : [])]
    })
  }
  // Spread/pinch: the second finger mirrors the first through the point where the fingers meet
  // (the start of a spread, the end of a pinch), and they stay a finger apart there.
  const centre = t.motion === 'spread' ? from : to
  const outer = t.motion === 'spread' ? to : from
  const dx = outer.x - centre.x
  const dy = outer.y - centre.y
  const length = Math.max(Math.hypot(dx, dy), 1)
  const gap = { x: (dx / length) * OVERLAY.fingerDiameter, y: (dy / length) * OVERLAY.fingerDiameter }
  const near = { x: centre.x + gap.x, y: centre.y + gap.y }
  const mirroredNear = { x: centre.x - gap.x, y: centre.y - gap.y }
  const mirroredOuter = { x: 2 * centre.x - outer.x, y: 2 * centre.y - outer.y }
  return t.motion === 'spread'
    ? [...fingerTrace(near, outer), ...fingerTrace(mirroredNear, mirroredOuter)]
    : [...fingerTrace(outer, near), ...fingerTrace(mirroredOuter, mirroredNear)]
}

/** `overlay(in:)`: the vignette, then per callout its ring, its trace or arrow, and its badge. */
export function overlay(shot: Shot, size: Size): OverlayPrimitive[] {
  const targets = shot.callouts.map(c => inset(rect(c.target, size), OVERLAY.targetInset))
  const vignette = [
    `M 0 0 H ${round(size.width)} V ${round(size.height)} H 0 Z`,
    ...targets.map(t => roundedRect(t, OVERLAY.targetCorner)),
  ].join(' ')
  return [
    { kind: 'vignette', d: vignette },
    ...shot.callouts.flatMap((callout, index): OverlayPrimitive[] => {
      const target = targets[index]
      const badge = { x: callout.badge[0] * size.width, y: callout.badge[1] * size.height }
      return [
        { kind: 'ring', x: round(target.x), y: round(target.y), w: round(target.w), h: round(target.h) },
        ...(callout.trace ? trace(callout.trace, size) : arrow(badge, target)),
        { kind: 'badge', cx: round(badge.x), cy: round(badge.y), number: callout.number },
      ]
    }),
  ]
}
