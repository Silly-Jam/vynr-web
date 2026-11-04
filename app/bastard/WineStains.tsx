// Dried wine on the sheet: one glass ring, broken where the glass was lifted
// wet, and a second, fainter one much farther down from another evening.
// Drawn in SVG so no image ships; decorative only (hidden from assistive tech,
// behind the text, multiplied into the paper). The edges are pushed about by
// turbulence so they read as a ring that dried, not a circle that was drawn.
function Ring({ id, dash, rotate, seed }: { id: string; dash: string; rotate: number; seed: number }) {
  const filterId = `stain-wobble-${id}`;
  const poolId = `stain-pool-${id}`;
  return (
    <svg className="stain-ring" viewBox="0 0 160 160" aria-hidden="true" focusable="false">
      <defs>
        <filter id={filterId} x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="2" seed={seed} result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="11" xChannelSelector="R" yChannelSelector="G" />
          <feGaussianBlur stdDeviation="0.5" />
        </filter>
        <radialGradient id={poolId} cx="50%" cy="50%" r="50%">
          <stop offset="80%" stopColor="currentColor" stopOpacity="0" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0.16" />
        </radialGradient>
      </defs>
      <g filter={`url(#${filterId})`} transform={`rotate(${rotate} 80 80) scale(1 0.96)`}>
        <circle cx="80" cy="80" r="68" fill={`url(#${poolId})`} />
        <circle cx="80" cy="80" r="68" fill="none" stroke="currentColor" strokeWidth="3.6" strokeOpacity="0.6" strokeDasharray={dash} strokeLinecap="round" />
        <circle cx="81" cy="79" r="65.5" fill="none" stroke="currentColor" strokeWidth="1.2" strokeOpacity="0.35" strokeDasharray={dash} />
      </g>
    </svg>
  );
}

export default function WineStains() {
  return (
    <div className="manifesto-stains" aria-hidden="true">
      <span className="stain stain-one"><Ring id="one" dash="150 28 96 14 40 100" rotate={-35} seed={5} /></span>
      <span className="stain stain-two"><Ring id="two" dash="120 60 180 70" rotate={110} seed={9} /></span>
    </div>
  );
}
