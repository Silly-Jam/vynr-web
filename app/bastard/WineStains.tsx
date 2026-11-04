// Dried wine on the page: two glass rings and a drip, drawn in SVG so no
// image ships. Decorative only: hidden from assistive tech, behind the text,
// multiplied into the paper. The ring edges are pushed about by turbulence so
// they read as wet rings that dried, not circles.
const RING_FILTER = (
  <filter id="stain-wobble" x="-20%" y="-20%" width="140%" height="140%">
    <feTurbulence type="fractalNoise" baseFrequency="0.045" numOctaves="2" seed="3" result="noise" />
    <feDisplacementMap in="SourceGraphic" in2="noise" scale="5" xChannelSelector="R" yChannelSelector="G" />
    <feGaussianBlur stdDeviation="0.55" />
  </filter>
);

function Ring({ dash, rotate }: { dash?: string; rotate?: number }) {
  return (
    <svg className="stain-ring" viewBox="0 0 160 160" aria-hidden="true" focusable="false">
      <defs>
        {RING_FILTER}
        <radialGradient id="stain-pool" cx="50%" cy="50%" r="50%">
          <stop offset="78%" stopColor="currentColor" stopOpacity="0" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0.22" />
        </radialGradient>
      </defs>
      <g filter="url(#stain-wobble)" transform={rotate ? `rotate(${rotate} 80 80)` : undefined}>
        <circle cx="80" cy="80" r="68" fill="url(#stain-pool)" />
        <circle cx="80" cy="80" r="68" fill="none" stroke="currentColor" strokeWidth="4" strokeOpacity="0.55" strokeDasharray={dash} />
        <circle cx="81" cy="79" r="66" fill="none" stroke="currentColor" strokeWidth="1.4" strokeOpacity="0.35" strokeDasharray={dash} />
      </g>
    </svg>
  );
}

function Drip() {
  return (
    <svg className="stain-drip" viewBox="0 0 80 80" aria-hidden="true" focusable="false">
      <defs>{RING_FILTER}</defs>
      <g filter="url(#stain-wobble)" fill="currentColor">
        <ellipse cx="34" cy="38" rx="13" ry="10" fillOpacity="0.5" />
        <path d="M34 46 c-2 8 -1 14 2 18 c3 -4 4 -10 2 -18 z" fillOpacity="0.45" />
        <circle cx="56" cy="30" r="3.2" fillOpacity="0.5" />
        <circle cx="62" cy="44" r="1.8" fillOpacity="0.45" />
        <circle cx="18" cy="52" r="2.3" fillOpacity="0.4" />
      </g>
    </svg>
  );
}

export default function WineStains() {
  return (
    <div className="manifesto-stains" aria-hidden="true">
      <span className="stain stain-one"><Ring rotate={12} /></span>
      <span className="stain stain-two"><Ring dash="210 46 92 60" rotate={-70} /></span>
      <span className="stain stain-three"><Drip /></span>
    </div>
  );
}
