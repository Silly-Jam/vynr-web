# Editable vector review — revision 2, 2026-11-04

Review draft only. These files do not supersede the accepted foot-overlap study
or constitute final production artwork. No image generation or automatic raster
tracing was used for this pass: the hand and glass are manually constructed
cubic paths, with transparent masks for cuts and occlusion.

## Audit and reuse

Read the current brief, accepted foot-overlap study and review, earlier
block-arm SVG and the website's stamp styles. Reused the accepted pose and
composition direction, two ink colours, double-rule stamp and text. The earlier
SVG contains the superseded block hand and cannot supply the approved anatomy.
The missing work was editable paths for the accepted hand and controlled glass
geometry. No website code or accepted reference assets have changed.

## Files

- `hand-glass-review.svg`: isolated hand/glass, editable paths, no typography.
- `back-review.svg`: 300 × 450 mm page; hand/glass plus illustrated cuff,
  oxblood cuff stamp and two-line headline.
- `front-stamp-review.svg`: provisional front stamp on an 80 × 42 mm page.
  The ink bounds must be fitted to exactly 80 mm after typography approval.

Black and oxblood groups are separate. Light areas are transparent knockouts,
not an ecru printing ink. Preview backgrounds are garment simulations only.
No trapping is applied in this review draft.

## Explicit geometry

In the hand master coordinate system:

- Bowl maximum outside width: 460 units (x=330…790).
- Foot width: 368 units (x=376…744), exactly 80% of bowl width.
- Foot outside height: 29.44 units, exactly 8% of foot width.
- Foot centre: (560, 1108).
- Hidden wrist contour: vertical at x=412.8, exactly 36.8 units (10% of
  foot width) inward from the left tip; it remains collinear behind the foot.
- Back composition applies a uniform 0.9 scale; all ratios are preserved.

## Required review / remaining work

1. The reconstructed hand is visibly more simplified than the accepted raster.
   Review thumb/index relationship, palm contour, returning fingers, cuts and
   the bowl-to-stem junction before approving it. Geometry compliance is not
   evidence of anatomical or stylistic approval.
2. Revision 2 selects **League Gothic Regular**, natural width, from Google
   Fonts under SIL OFL 1.1. Font and licence are bundled in `fonts/`. Lettering
   is outlined directly from font glyphs with uniform scaling, no stretching.
   Visual acceptance of the selected face remains part of this review.
3. Cuff placement, headline scale, stamp styling and optical spacing are first
   composition proposals. Stamp distress has not yet been added.
4. No claim of minimum-line/minimum-gap compliance: pointed cuts, narrow spaces,
   cuff lettering cap height and double rules require actual-size preflight
   after the artwork/type is approved. Simplify or widen as needed.
5. Masks and strokes should be resolved into final editable compound ink paths
   before production PDF export. Printer-approved spot inks, registration marks,
   300 dpi production previews, physical paper proof and final print approval
   remain outstanding. These are not printer-ready separations.

## Verification performed

All three SVGs parse as XML and contain no embedded raster images. Numeric
geometry assertions passed for the foot width, height and wrist inset. Rendered
and visually inspected hand, back and front on ecru. Fixed a draft layering
error that initially showed the stem through the fingers, and joined the arm
to the cuff. Website tests were not run: no application code changed.

## Review of the first vector draft (Claude, 2026-11-04)

**Not yet approved for production work. The structure is right; the hand,
the cuff and the type each need one more pass.** Checked the three SVG
sources, the previews on ecru, and the hand at 2× crop. Geometry assertions
(foot 80% / 8% / 10%, collinear hidden contour) hold; the black and oxblood
groups are cleanly separate; every light area is a knockout; the wine
carries one highlight. All of that stands.

### Hand

1. **The cavity is too big.** The black wedge between palm and fingers is
   about twice the area of the accepted study's; the hand reads as a glove
   opening rather than a fist. Close it to the study's proportion.
2. **The spikes inside the cavity go.** Two jagged white shards inside the
   black wedge read as cracks. Keep the long sliver along the thumb web and
   the two knuckle creases on the back of the hand, which work; delete the
   shards or replace them with one calm curve.
3. **Index finger.** The rounded tip right of the stem under the thumb is
   the index and it is enough for five digits. Give the index its knuckle
   on the top contour, one small bump between the thumb base and the back
   of the hand, so the count reads without looking for the tip.
4. **Returning fingers.** Three sausages with one nick each is the right
   idea; give the middle finger a joint so they are not identical.
5. **Pointed cuts.** Every sliver tapers to zero. Round each tip to at
   least 1.7 units (0.5 mm at 300 mm) before preflight, per the brief.

### Cuff

6. **The cuff is a box, not a sleeve.** It sits detached under a straight
   clip line, with two curves inside that read as the top of a sock. Draw it
   as a band wrapping the forearm: its edges follow the cylinder of the arm,
   the forearm enters it, and the turned-back edge is one curve. The stamp
   then sits on the band's face, rotated with it.

### Type

7. **No `textLength` with `spacingAndGlyphs`.** It is distorting the
   glyphs on both the headline and the stamps. Set the size and tracking and
   let the words be their own width.
8. **DIN Condensed Bold is a macOS system font.** Apple's licence covers
   documents on Apple devices; it is not a merchandise licence, and the
   brief requires one. Candidates that are: League Gothic or Bebas Neue
   (both SIL Open Font Licence). Pick one, record it in the brief, then
   outline.
9. **Front stamp.** Match the web stamp: MANIFESTO centred under WINE
   BASTARD, small, widely tracked (0.34 em), not left-set at two thirds the
   size. The cuff stamp stays WINE BASTARD only. Stamp distress (skip and
   blot) still to come; the double rule and the 6° rotation are right.

### Composition

10. The headline sits where the brief says, below the hand beside the
    forearm; its weight is right. Once the cuff wraps the arm, check that
    MIGHTILY.'s baseline still ends near the cuff's top edge.
11. The arm runs off the art box's left edge and the cuff hugs it. That is
    as in the art direction; the print edge will cut the arm. Accepted.

Preflight for minimum line and gap is still the illustrator's step after
these fixes; nothing here is a printer approval.


## Revision 2 — actioned after the above review

- Reused the existing path/mask drawing and fixed foot geometry. The body paths
  remain editable; no new generated or auto-traced hand was introduced.
- Narrowed the fist cavity, replaced its jagged internal shards with a calm
  curved palm boundary, and retained the thumb-web sliver and knuckle creases.
- Added the index knuckle on the top contour and a middle-finger joint.
- Hand knockout boundaries and black cut marks now have 4-unit round joins.
  The round expansion radius is 2 units, or 0.54 mm at the back's 0.9 scale
  and 300 mm page width. This removes mathematical zero-width tips on these
  marks; it is not a blanket minimum-gap certification for the whole artwork.
- Replaced the box cuff with a curved band, one turned edge and a matching
  curved arm clipping boundary. Stamp sits on the band's face.
- Selected League Gothic Regular (default width 100), SIL Open Font Licence
  1.1, from https://github.com/google/fonts/tree/main/ofl/leaguegothic . Bundled
  the unmodified font and copyright/licence. This supersedes DIN. No conclusion
  about Apple's font licence is required or asserted by this revision.
- Removed all textLength/spacingAndGlyphs settings. Outlined actual font glyphs
  without nonuniform scaling. MANIFESTO is optically centred under WINE BASTARD
  with 0.34 em tracking; cuff still reads WINE BASTARD only.
- Updated all three SVGs and previews in place. Checked XML, no raster embeds,
  no live system-font text, and preserved 80%/8%/10% geometry assertions.

Still for Claude/operator review: drawing fidelity to the accepted hand, cuff
shape and stamp placement, headline type choice and weight. Stamp distress,
full minimum-feature preflight, mask-to-compound-path conversion, physical proof
and printer approval remain. Revision 2 is not production approved. The original
review above is preserved as history; its first-draft observations should not
be mistaken for descriptions of this revision.
