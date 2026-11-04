# Sampled print-survivability audit

| Drawn marks (type excluded) | Back | Front |
|---|---:|---:|
| Minimum surviving medial ink width | 0.458 mm | 0.762 mm |
| Minimum surviving medial gap width | 0.684 mm | 0.889 mm |
| Internal samples below 0.4 mm ink | 0 | 0 |
| Internal samples below 0.5 mm gap | 0 | 0 |
| Smallest isolated ink component, minor oriented bounding box | 2.060 mm | 5.343 mm |
| Smallest isolated knockout, minor oriented bounding box | 4.573 mm | None (frame breaks are open) |

Cuff text cap height: 6.367 mm. Front ink width: 80.000 mm. No trap anywhere.
Ink component and hole measures describe whole isolated shapes, not local line
thickness; see the medial-width rows for the latter.

Method: rasterise vector drawn marks with rsvg-convert at400dpi (0.0635mm per
sample), alpha threshold128, Euclidean distance to boundaries on skeletons,
8pixel terminal pruning for ink and12pixel for gaps, exclude0.5mm page edges.
League Gothic is excluded from the drawn-mark audit and preserved as designed.
The printer still assesses its counters/apexes on the physical proof. Results
are sampled survivability, NOT exact mathematical minima or guaranteed press
performance. Isolated decorative endpoints and intentional page clipping are
not required to have a nonzero mathematical width at their final point.

Corrections were limited to print survival: opened the rim-slot ends, shortened
the upper thumb-web cut slightly where it almost met the outline, simplified
the thumbnail to one curved nick, strengthened thin wrist-outline sections,
removed hairline lower-stem flares and tiny wedges at stamp-break ends.
No other cosmetic smoothing was done. Boolean numerical dust rings below
0.0001square source units are discarded; these were numerical artefacts, not
intentional distressed marks.

Reproduce via `tools/audit_features.py`; complete results are in
`feature-audit.json`, isolated-shape results in `feature-components.json`.
Source curves and resolved ink paths are editable vectors, never raster traces.
