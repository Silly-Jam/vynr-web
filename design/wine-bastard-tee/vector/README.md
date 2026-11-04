# Wine Bastard tee — finished design candidate

Natural ecru only. Black and oxblood. Prepared for the operator's review;
jointly accepted by Codex/Ilsa and Claude/vynr-5a for presentation to the operator.
Not yet operator-approved or printer-approved. No merge or order authorised.
See `design-review-signoff.md` for concurrence and deliverable hashes.

## Open these

| File | Purpose |
|---|---|
| `back-final-preview.png` | Back artwork on ecru, 300 dpi |
| `front-final-preview.png` | Front stamp on ecru, 300 dpi |
| `back-final.svg` | Editable resolved back, 300 × 450 mm page |
| `front-stamp-final.svg` | Editable resolved front, ink exactly 80 mm wide |
| `hand-glass-final.svg` | Isolated hand/glass for inspection |
| `back-actual-size.pdf` | Full-size 300 × 450 mm back paper proof |
| `front-actual-size-a4.pdf` | A4 front paper proof, 80 mm stamp and 10 mm ruler |

Print PDFs at **100% / actual size**, never “fit to page”. The back requires
large-format paper or tiled printing. These are review proofs, not a fabric proof.

## What is fixed

The accepted five-digit grip and poster-scale bowl remain. The foot is 80% of
bowl width, 8% as tall as its own width, with the collinear wrist hidden 10% in
from its tip. Returning fingers vary in size; the cuff wraps the forearm. The
stamp borders skip and blot; the lettering and headline stay clean. Deliberate
hand-cut irregularity is retained, per the operator's direction.

**Typeface:** League Gothic Regular, natural width, SIL Open Font Licence 1.1.
The unmodified font and licence are in `fonts/`, downloaded from
https://github.com/google/fonts/tree/main/ofl/leaguegothic . All candidate type
is outlined without glyph stretching. Cuff cap height is **6.367 mm**.

**Inks:** black `#1B1917`, oxblood `#6E1522`; ecru `#F4ECD8` appears only in
previews. Final SVGs contain one compound path per ink: no masks, clips,
filters, embedded images or live type. **No trap anywhere.** Printer must
confirm physical ink matches and registration on the selected garment.

## Method and checks

Source curves were drawn as editable vector paths from the accepted study,
not traced from raster pixels. Compound paths resolve source masks and strokes
using sampled curves and boolean geometry. Maximum source chord: 0.5 units;
final simplification tolerance: 0.01 units. Comparing against half-chord source
sampling measured less than **0.05 mm** difference (`curve-convergence.json`).
The earlier unverified 0.01 mm total-error target is superseded by that measured
result. This is a convergence check, not a claim of exact analytic equivalence.

`geometry-report.json` records physical sizes and structural checks.
`feature-audit.json` and `preflight.md` record sampled print survivability.
The audit is 400 dpi (0.0635 mm), with type excluded from authored-mark tests,
skeleton terminals pruned and 0.5 mm page edges excluded. It is sampled
survivability, not mathematical minima at decorative tips or printer approval.

## Source and provenance

`*-review.svg` are the editable construction sources (including masks);
`*-final.svg` are the resolved candidate. Earlier `*-preview.png` are revision-2
history; use `*-final-preview.png` for this candidate. `review-history.md`
preserves the earlier reviews. The original accepted raster stays in `../studies/`.

`tools/` contains the reproducible build, vector resolution, audit and proof
export scripts. From this directory, using `uv`:

```
uv run --with fonttools python tools/build_vector.py
uv run --with numpy --with shapely --with svgpathtools python tools/resolve_vectors.py
uv run --with numpy --with shapely --with svgpathtools --with pillow --with scikit-image python tools/audit_features.py
python3 tools/export_proofs.py
```

Rendering requires `rsvg-convert`. The audit writes intermediate files and its
JSON to `work/`; the reviewed JSON is copied alongside this README. Physical
paper review, garment supplier/weight, placement and the printer's fabric proof
remain external approvals. Preserve the rough character rather than polishing
it into a sterile mark.
