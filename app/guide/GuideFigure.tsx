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
        <path d={p.d} {...STROKE} stroke={colours.tint}
          strokeWidth={p.role === "arrow" ? OVERLAY.arrowWidth : OVERLAY.movementWidth} />
      );
    case "finger":
      return (
        <circle cx={p.cx} cy={p.cy} r={OVERLAY.fingerDiameter / 2} fill="white"
          fillOpacity={OVERLAY.fingerFillOpacity} stroke={colours.tint} strokeWidth={OVERLAY.fingerRingWidth} />
      );
    case "holdRing":
      return p.outer ? (
        <circle cx={p.cx} cy={p.cy} r={(OVERLAY.fingerDiameter + OVERLAY.outerHoldRingGrowth) / 2} fill="none"
          stroke={colours.tint} strokeOpacity={OVERLAY.outerHoldRingOpacity}
          strokeWidth={OVERLAY.outerHoldRingWidth} strokeDasharray={OVERLAY.outerHoldRingDash} />
      ) : (
        <circle cx={p.cx} cy={p.cy} r={(OVERLAY.fingerDiameter + OVERLAY.holdRingGrowth) / 2} fill="none"
          stroke={colours.tint} strokeWidth={OVERLAY.holdRingWidth} strokeDasharray={OVERLAY.holdRingDash} />
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

/**
 * One tour shot as the app shows it (vynr FeatureTourShotView): the real capture, the overlay
 * drawn over it in the app's display space, and the same callouts as a numbered list. The
 * overlay is decorative; the image's alt text and the list carry the meaning.
 */
export default function GuideFigure({ shot, pixels, display }: { shot: Shot; pixels: Size; display: Size }) {
  const primitives = overlay(shot, display);
  const first = shot.callouts[0]?.number ?? 1;
  return (
    <figure className="guide-figure">
      <div className="guide-shot" style={{ width: display.width, aspectRatio: `${display.width} / ${display.height}` }}>
        {/* eslint-disable-next-line @next/next/no-img-element -- a real capture at its own size; no optimiser rewrite */}
        <img src={`/guide/${shot.file}`} alt={shot.alt} width={pixels.width} height={pixels.height} />
        <svg viewBox={`0 0 ${display.width} ${display.height}`} aria-hidden="true" focusable="false">
          {primitives.map((p, i) => <Primitive key={i} p={p} />)}
          <rect x={0.5} y={0.5} width={display.width - 1} height={display.height - 1} rx={OVERLAY.imageCorner}
            fill="none" stroke={colours.cardStroke} strokeWidth={OVERLAY.cardStrokeWidth} />
        </svg>
      </div>
      <ol className="guide-callouts" start={first}>
        {shot.callouts.map((callout) => (
          <li key={callout.number} value={callout.number}>
            <span className="guide-badge" aria-hidden="true">{callout.number}</span>
            <span>{callout.text}</span>
          </li>
        ))}
      </ol>
    </figure>
  );
}
