import type { Shot } from "@/lib/guide";
import { OVERLAY, overlay, type OverlayPrimitive, type Size } from "@/lib/guide-overlay";

const { colours } = OVERLAY;
const STROKE = { fill: "none", strokeLinecap: "round", strokeLinejoin: "round" } as const;

function Primitive({ p }: { p: OverlayPrimitive }) {
  switch (p.kind) {
    case "vignette":
      return <path d={p.d} fill="black" fillOpacity={OVERLAY.vignetteOpacity} fillRule="evenodd" />;
    case "ring":
      return (
        <rect x={p.x} y={p.y} width={p.w} height={p.h} rx={OVERLAY.targetCorner}
          fill="none" stroke={colours.tint} strokeWidth={OVERLAY.ringWidth} />
      );
    case "path":
      return (
        <path d={p.d} {...STROKE} stroke={colours.tint} pathLength={1}
          className={p.role === "movement" ? "guide-mv" : "guide-ar"}
          strokeWidth={p.role === "arrow" ? OVERLAY.arrowWidth : OVERLAY.movementWidth} />
      );
    case "finger":
      return (
        <circle cx={p.cx} cy={p.cy} r={OVERLAY.fingerDiameter / 2} fill="white"
          fillOpacity={OVERLAY.fingerFillOpacity} stroke={colours.tint} strokeWidth={OVERLAY.fingerRingWidth} />
      );
    case "holdRing":
      return p.outer ? (
        <circle className="guide-hr guide-hr-outer" cx={p.cx} cy={p.cy}
          r={(OVERLAY.fingerDiameter + OVERLAY.outerHoldRingGrowth) / 2} fill="none"
          stroke={colours.tint} strokeOpacity={OVERLAY.outerHoldRingOpacity}
          strokeWidth={OVERLAY.outerHoldRingWidth} strokeDasharray={OVERLAY.outerHoldRingDash} />
      ) : (
        <circle className="guide-hr" cx={p.cx} cy={p.cy} r={(OVERLAY.fingerDiameter + OVERLAY.holdRingGrowth) / 2}
          fill="none" stroke={colours.tint} strokeWidth={OVERLAY.holdRingWidth} strokeDasharray={OVERLAY.holdRingDash} />
      );
    case "badge":
      return (
        <g>
          <circle cx={p.cx} cy={p.cy} r={OVERLAY.badgeDiameter / 2} fill={colours.textPrimary}
            stroke="white" strokeWidth={OVERLAY.badgeOutline} />
          <text x={p.cx} y={p.cy} fill="white" fontSize={OVERLAY.badgeFontSize} fontWeight={700}
            style={{ fontVariantNumeric: "tabular-nums" }} textAnchor="middle" dominantBaseline="central">
            {p.number}
          </text>
        </g>
      );
  }
}

/** The overlay as one group per callout (ring through badge), so a story can light one step. */
function callouts(shot: Shot, display: Size): { vignette: OverlayPrimitive; groups: OverlayPrimitive[][] } {
  const [vignette, ...rest] = overlay(shot, display);
  const groups: OverlayPrimitive[][] = [];
  for (const p of rest) {
    if (p.kind === "ring") groups.push([]);
    groups[groups.length - 1].push(p);
  }
  if (groups.length !== shot.callouts.length) {
    throw new Error(`guide overlay: ${shot.file} drew ${groups.length} callouts for ${shot.callouts.length}`);
  }
  return { vignette, groups };
}

/**
 * One tour shot as the app shows it (vynr FeatureTourShotView): the real capture with the
 * overlay drawn over it in the app's display space. `decorative` marks the pinned-phone copy,
 * which repeats an inline shot and so is hidden from assistive technology.
 */
export default function ShotFrame({ shot, pixels, display, decorative = false }: {
  shot: Shot;
  pixels: Size;
  display: Size;
  decorative?: boolean;
}) {
  const { vignette, groups } = callouts(shot, display);
  return (
    <div className="guide-shot"
      style={{ width: display.width, aspectRatio: `${display.width} / ${display.height}`,
        ["--guide-aspect" as string]: display.width / display.height }}
      aria-hidden={decorative || undefined}>
      {/* eslint-disable-next-line @next/next/no-img-element -- a real capture at its own size; no optimiser rewrite */}
      <img src={`/guide/${shot.file}`} alt={decorative ? "" : shot.alt} width={pixels.width} height={pixels.height} />
      <svg viewBox={`0 0 ${display.width} ${display.height}`} aria-hidden="true" focusable="false">
        <Primitive p={vignette} />
        {groups.map((group, i) => (
          <g key={shot.callouts[i].number} className="guide-c" data-n={shot.callouts[i].number}>
            {group.map((p, j) => <Primitive key={j} p={p} />)}
          </g>
        ))}
        <rect x={0.5} y={0.5} width={display.width - 1} height={display.height - 1} rx={OVERLAY.imageCorner}
          fill="none" stroke={colours.cardStroke} strokeWidth={OVERLAY.cardStrokeWidth} />
      </svg>
    </div>
  );
}
