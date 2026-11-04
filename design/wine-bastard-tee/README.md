# Wine Bastard tee: illustrator brief

One page. Everything a vector illustrator needs to draw the print file from
the approved art direction, without coming back to us. Written 2026-11-04 by
the vynr team (operator + Ilsa, editorial + Claude). The manifesto itself is
live at `vynr.app/bastard`; this shirt is its public face.

## What we are making

A two-ink screen-printed T-shirt. **Back:** a hand raises a glass of red wine
in a toast; beside it the line **ENJOY IT MIGHTILY.** The sleeve cuff carries
a small **WINE BASTARD** stamp. **Front:** the manifesto's rubber stamp
(WINE BASTARD / MANIFESTO) small on the left chest, nothing else.

The website is the manifesto someone carried in a pocket. The shirt is the
standard someone raises. Same stamp, same oxblood, same paper-and-ink
character. Flat, economical, satisfying. Not a wine-brand graphic, not a joke
shirt, not agitprop. A raised glass is the wine world's raised fist: a toast,
never a threat.

## Reference files in this folder

| File | What it is | Status |
|---|---|---|
| `reference/ilsa-art-direction-2026-11-04.png` | The approved composition, both colourways | **Approved art direction. Not printable.** It is a generated raster: the hand, stem and foot have errors, the highlights are wrong, the hatching is too fine. Redraw it, do not trace it. |
| `reference/vynr-app-icon-1024.png` | The vynr app icon | The glass on the shirt **is this glass**: same bowl shape, same swirl of wine up the right side of the bowl. |
| `studies/block-arm-*.svg` | An earlier flat study | Superseded. Kept only for provenance. |

## Preserve from the art direction

- The composition: hand and glass rising from the bottom-left, tilted a few
  degrees in a toast; the two-line headline to the right, bottom-aligned with
  the fist; the cuff and its stamp bottom-left.
- The headline lettering: condensed wood-type caps, two lines, full stop
  kept. Face to be a licensed-for-merchandise condensed grotesque or wood
  type; confirm the face with us before outlining.
- The cuff stamp reads **WINE BASTARD** only, two lines, in the same stamp
  style as the front (double rule, slightly rotated, ink that skipped).
- The glass: the app icon's glass, with the wine swirled up the right side.

## Fix in the redraw

1. **Hand anatomy.** Reconstruct the hand properly: a real grip on a stem,
   thumb and index finger pinching the stem, remaining fingers curled under
   the bowl's foot. Knuckles, tendons and the wrist bone where the linocut
   would cut them. Decide left or right hand and keep it consistent with the
   foot's position.
2. **One continuous stem,** visible where it should be between the fingers,
   and a **foot aligned with the stem and the tilt** of the glass.
3. **Wine highlight: one cream knockout shape.** Not the pink glossy
   lozenges in the reference. One flat cut, the way the glass's own highlight
   is drawn. The icon's second small highlight may be kept if it reads as a
   cut, not a gloss.
4. **Hatching reduced** to lines that survive screen printing at the sizes
   below. Fewer, more confident cuts beat many fine ones.
5. **Two inks, exactly.** No tints, no halftones, no gradients, no third
   colour. The garment supplies the third colour.

## Colours

| Role | Hex (reference) | Notes |
|---|---|---|
| Oxblood (wine, and the only colour) | `#6E1522` on cream tee · `#7D1A29` on black tee | Match to a Pantone at the printer; candidates in the 188 C / 7421 C family. One ink per colourway. |
| Ink on cream tee | `#1B1917` | Near-black, warm. |
| Ink on black tee | `#F1E8D3` | Cream, not white. |
| Cream tee garment | about `#F4ECD8` | Natural / ecru. |
| Black tee garment | about `#151412` | **Black is the hero colourway.** |

Separations:

- **Black tee:** cream ink + oxblood ink.
- **Cream tee:** black ink + oxblood ink.

Keep both colourways in the production file as separate artboards sharing one
master drawing; only fills swap.

## Dimensions and print limits

- **Back print:** artwork box 30 cm wide, up to 45 cm tall, portrait, top of
  the glass about 7 cm below the back collar seam. Draw at 1:1 in millimetres.
- **Front print:** the stamp 8 cm wide on the left chest.
- **Cuff stamp:** cap height of WINE BASTARD at least 6 mm at print size.
- **Minimum line weight** 0.4 mm; **minimum gap between two inks or inside a
  knockout** 0.5 mm. The hatching must obey this. Trap the oxblood under the
  ink line of the bowl by 0.3 mm or specify no trap; say which.
- Prove it at 30 cm: print the back at 1:1 on paper and look at the cuff
  stamp, the stem between the fingers and the finest hatching. If any of
  those fails, simplify, do not shrink.

## Deliverables

1. Vector master (AI or SVG), fonts outlined, one layer per ink, named
   `ink-dark`, `ink-light`, `oxblood`.
2. Two colourway artboards (black tee, cream tee) plus the front stamp
   artboard.
3. Spot-colour separations as PDF, 1:1, with registration marks.
4. 300 dpi PNG previews of each artboard on its garment colour.
5. A one-line note of the headline face and its licence.

## Invariants (do not change these)

- Headline text is exactly `ENJOY IT MIGHTILY.` with the full stop.
- The stamp text is exactly `WINE BASTARD` (cuff) and `WINE BASTARD` over
  `MANIFESTO` (front).
- No vynr wordmark, no URL, no app-store badge anywhere on the garment. The
  glass is the only link to the app. (If the operator later wants a small
  mark, it goes on the inside neck label, not the print.)
- No third colour, no gradients, no distressing of the body lettering. The
  stamp alone may skip and blot.
- The wine is red. The glass is the icon's glass.

## Open points for us, not the illustrator

- Which hand (the reference is ambiguous). Default: the wearer's right hand,
  drawn as seen from behind the wearer, so the toast is theirs.
- Whether the front stamp carries MANIFESTO under WINE BASTARD (default yes,
  matching the web page) or WINE BASTARD alone like the cuff.
- Garment: a heavyweight cotton in natural and black.
