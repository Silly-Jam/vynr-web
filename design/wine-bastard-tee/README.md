# Wine Bastard tee: illustrator brief

One page. Everything a vector illustrator needs to draw the print file from
the approved art direction, without coming back to us. Written 2026-11-04 by
the vynr team (operator + Ilsa, editorial + Claude), revised the same day
after Ilsa's review and the operator's ruling on the garment. The manifesto
itself is live at `vynr.app/bastard`; this shirt is its public face.

## What we are making

A two-ink screen-printed T-shirt on a **natural / ecru garment. One
colourway only; there is no black tee.** vynr has no dark mode by design: its
material is warm paper, and so is the shirt's.

- **Back print:** a hand raises a glass of red wine in a toast; below the
  hand, beside the forearm, the line **ENJOY IT MIGHTILY.** The forearm ends
  in an **illustrated** shirt cuff, drawn as part of the back artwork, and
  that drawn cuff carries a small **WINE BASTARD** stamp. There is no
  separate print on the garment's own sleeve.
- **Front print:** the manifesto's rubber stamp (WINE BASTARD over
  MANIFESTO) small on the left chest, in oxblood only. Nothing else.

The website is the manifesto someone carried in a pocket. The shirt is the
standard someone raises. Same stamp, same oxblood, same paper-and-ink
character. Flat, economical, satisfying. Not a wine-brand graphic, not a joke
shirt, not agitprop. A raised glass is the wine world's raised fist: a toast,
never a threat.

## Reference files in this folder

| File | What it is | Status |
|---|---|---|
| `reference/ilsa-art-direction-2026-11-04.png` | The approved composition, shown in two colourways | **Approved art direction. Not printable.** Use the left (cream) panel only; the black panel is historical. It is a generated raster: the hand, stem and foot have errors, the highlights are wrong, the hatching is too fine. Redraw it, do not trace it. |
| `reference/vynr-app-icon-1024.png` | The vynr app icon | The glass on the shirt **is this glass**: same bowl shape, same swirl of wine up the right side of the bowl. |
| `studies/block-arm-*.svg` | An earlier flat study | Superseded. Kept only for provenance. |
| `studies/hand-glass-wide-base-2026-11-04.png` + `.md` | The hand-and-glass anatomical sketch and its review | Accepted at the sketch gate with four corrections listed in the `.md`. Superseded as the starting image by the foot-overlap study below. |
| `studies/hand-glass-linocut-draft-2026-11-04.png` + `.md` | Intermediate linocut pass | Provenance only; its foot still touched the wrist. |
| `studies/hand-glass-foot-overlap-2026-11-04.png` + `.md` | The hand and glass with the corrections applied | **Start the vector hand from this.** Three of the four corrections are solved in it; the foot width is set by number below, not by another image. |

## Preserve from the art direction

- The composition: hand and glass rising from the bottom-left, tilted a few
  degrees in a toast. The headline sits **below the hand and to the right of
  the forearm**, its last line ending near the height of the illustrated
  cuff, as in the reference. Do not move it up beside the fist.
- The headline lettering: condensed wood-type caps, two lines, full stop
  kept. The face must be licensed for merchandise; confirm it with us before
  outlining.
- The illustrated cuff and its stamp: **WINE BASTARD** only, two lines, in
  the same stamp style as the front (double rule, slightly rotated, ink that
  skipped).
- The glass: the app icon's glass, with the wine swirled up the right side.

## Fix in the redraw

1. **Hand anatomy, and the grip in particular.** The glass is held by the
   stem, as in the reference: thumb and index finger pinch the stem just
   below the bowl; the middle, ring and little fingers curl around the stem
   beneath them; the foot of the glass sits below the hand, clear of the
   fingers. Knuckles, tendons and the wrist bone where a linocut would cut
   them. **Send a quick anatomical sketch of the hand and glass before the
   detailed redraw.** Left or right hand is your call at that stage; choose
   whichever gives the most convincing grip, and we approve it on the sketch.
2. **One continuous stem,** visible where it should be between the fingers,
   and a **foot aligned with the stem and the tilt** of the glass.
   Foot geometry, by number: width 80% of the bowl's maximum width; height
   8% of the foot's width (near edge-on, like the rim); the wrist contour
   passes behind the foot and emerges 10% of the foot's width in from the
   tip, collinear with where it entered.
3. **Wine highlight: one flat shape of exposed garment.** Not the pink glossy
   lozenges in the reference. One cut where the oxblood is simply not
   printed and the ecru fabric shows, the same way the glass's own highlight
   is made. The icon's second small highlight may be kept only if it reads
   as a cut, not a gloss.
4. **Hatching reduced** to lines that survive screen printing at the sizes
   below. Fewer, more confident cuts beat many fine ones.
5. **Two inks, exactly:** black and oxblood on the ecru garment. No tints,
   no halftones, no gradients, no third ink. Every light area is the fabric.

## Colours

| Role | Hex (reference) | Notes |
|---|---|---|
| Oxblood ink (the wine, the stamps) | `#6E1522` | Match to a Pantone at the printer; start in the 188 C / 7421 C family. |
| Black ink (hand, glass outline, headline) | `#1B1917` | Near-black, warm. |
| Garment | about `#F4ECD8` | Natural / ecru heavyweight cotton. Not white. |

Separation, back print: **black + oxblood.** Front print: **oxblood only.**
One master drawing, one artboard per print location.

## Dimensions and print limits

- **Back print:** artwork box 30 cm wide, up to 45 cm tall, portrait, top of
  the glass about 7 cm below the back collar seam. Draw at 1:1 in millimetres.
- **Front print:** the stamp 8 cm wide on the left chest, oxblood only.
- **Cuff stamp (illustrated, inside the back artwork):** cap height of WINE
  BASTARD at least 6 mm at print size.
- **Minimum line weight** 0.4 mm; **minimum gap between the two inks or
  inside any exposed-garment cut** 0.5 mm. The hatching must obey this.
  State whether you have trapped the oxblood under the black bowl line
  (0.3 mm) or left it untrapped.
- Prove it at 30 cm: print the back at 1:1 on paper and look at the cuff
  stamp, the stem between the fingers and the finest hatching. If any of
  those fails, simplify, do not shrink.

## Deliverables

0. The anatomical sketch of hand and glass (see Fix 1), before anything else.
1. Vector master (AI or SVG), fonts outlined, one layer per ink, named
   `black` and `oxblood`.
2. Two artboards: back print and front stamp.
3. Spot-colour separations as PDF, 1:1, with registration marks.
4. 300 dpi PNG previews of each artboard on the ecru garment colour.
5. A one-line note of the headline face and its licence.

## Invariants (do not change these)

- Headline text is exactly `ENJOY IT MIGHTILY.` with the full stop.
- The stamp text is exactly `WINE BASTARD` on the illustrated cuff, and
  `WINE BASTARD` over `MANIFESTO` on the front.
- One garment colour, natural / ecru. No black colourway.
- No vynr wordmark, no URL, no app-store badge anywhere on the garment. The
  glass is the only link to the app. (If the operator later wants a mark, it
  goes on the inside neck label, not the print.)
- Two inks, no third ink, no gradients, no distressing of the body
  lettering. The stamps alone may skip and blot.
- The wine is red. The glass is the icon's glass.
- The glass is drawn at poster scale, about 1.5× life against the hand, as
  in the accepted sketch (`studies/hand-glass-wide-base-2026-11-04.md`).
  Keep that scale; do not correct it to life size.

## Still open for us, not the illustrator

- The exact garment (weight and supplier) once the printer is chosen.
