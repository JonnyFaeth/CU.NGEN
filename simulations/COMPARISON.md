# Capture comparison — 2026-10-20

The original results remain unchanged in `results/` and `REPORT.md`. New results are in `comparison-results/`. Reproduce with `node simulations/compare-outline.cjs`.

## Methods

Same 5,400 camera/fixture/noise combinations as the original run. Reference marks use the same seeded random sequence. The new method rectifies eight projected box vertices rather than two corners of an image-axis bounding rectangle. Outline marks use a separate seed (20261020) because there are more marks. All vertices are available synthetically, including potentially occluded vertices: this is an optimistic full-envelope input, not realistic silhouette detection. Noise is uniform in image pixels, not a measured model of finger input. No photos, recognition, real phone sensors or physical objects are tested here.

Capture checks reject reference edges below 60 image pixels, adjacent-edge cosine above 0.17, opposite-edge ratio above 1.15, or relative x/y scale outside 0.9–1.1. These are provisional heuristics selected before this comparison, not validated accuracy thresholds. Passing them cannot detect reference-depth mismatch.

## Results

| Metric | Previous | Outline + reference checks |
|---|---:|---:|
| Trials | 5,400 | 5,400 |
| Accepted | 5,149 | 3,256 |
| Rejected | 251 | 2,144 |
| Accepted within 3 mm on every dimension | 31 | 27 |
| Within 3 mm / accepted | 0.60% | 0.83% |
| Median maximum error among accepted | 34.4 mm | 27.1 mm |
| 95th-percentile maximum error among accepted | 102.5 mm | 85.7 mm |
| Generated frames below requested 35 mm geometric clearance | 935 | 505 |
| Frames intersecting true box envelope | 1 | 0 |

For the **same 3,256 trials accepted by both methods**, median maximum error is **25.3 mm before and 27.1 mm after**. The smaller aggregate error is therefore not evidence that measurement accuracy improved; selection/rejection changes matter. The count meeting the 3 mm target decreased. These outcomes do not justify automatic fabrication. Lower collision counts on a finite, selected synthetic set are not a guarantee.

The original 60 flat-plane control checks still pass unchanged. Additional unit tests verify the new method on known rotated planar outlines and ensure invalid captures are rejected. Geometry and fee arithmetic remain separate checks.

## Product decision

Ship outline marking as an explicitly provisional planning aid, not an accuracy fix. Require the user's physical dimension confirmation before exporting the complete kit package. Retain quote previews for unconfirmed designs so users can explore. Keep the remaining measurement limitation visible.

The next required evidence is real front/side images with independently measured dimensions. The software cannot infer an unobserved reference-depth offset just from these marks. Thermal behavior remains outside this experiment.

## Example package

`example-kit/kit.html`, `drawing.svg` and `specification.json` describe a **synthetic** 80 × 80 × 140 mm light envelope with Split style: 181.4 × 181.4 × 191 mm surround, 16 wood parts, four rods, and $28.97 known estimate including $2.63 CU fee. Fabrication, packaging, handling, shipping and tax remain unquoted. No physical measurement or build has been performed. Regenerate after `python scripts/build_mobile.py` with `node simulations/build-example-kit.cjs`.
