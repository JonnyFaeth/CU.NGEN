# CU virtual test run — 2026-10-18

## Scope and method

Deterministic synthetic camera projection of ten rectangular light envelopes. These are envelope fixtures, not ten reconstructed lamp meshes. No photographs are rendered into the measurement engine: projected marks are passed to the exact production measurement function. This isolates geometry and mark error; it does not test image recognition, blur, shadows, lens distortion, Safari, joints, or physical assembly. Thermal behavior is outside this run.

- 60 coplanar controls: projected reference and true corresponding object corners, all within 0.1 mm rounding.
- 5400 3D-envelope trials: front/side views; yaw 0/15/30°, pitch 0/15°, reference offset -100/0/+100 mm, mark noise ±0/1/3 image pixels, ten repeats. Zero-noise repeats are duplicates and are not independent evidence.
- Diagnostic criterion chosen before execution: all three dimensions within 3 mm. This is an engineering screen, not a validated fabrication specification.
- Nominal frame geometry: 60 fixture/style/clearance combinations; checks cut conservation, IDs, and requested clearances. Rejections are listed separately.
- 1,000 seeded cost combinations checked against independent integer-cent arithmetic.

## Findings

| Metric | Result |
|---|---:|
| Measurement accepted / rejected | 5149 / 251 |
| Accepted within 3 mm on all dimensions | 31 (0.6%) |
| Median maximum dimension error | 34.40 mm |
| 95th-percentile maximum error | 102.50 mm |
| Largest error | 196.50 mm |
| Accepted measurements producing a frame | 5086 |
| Frames below requested 35 mm geometric clearance | 935 |
| Frames intersecting the true box envelope | 1 |
| Nominal geometry cases passed | 60 / 60 |
| Pricing cases passed | 1000 / 1000 |

Rates describe this deliberately stressed synthetic grid, not expected customer success rates. The clearance counts assess geometry only. Box envelopes are conservative and may contain empty space on real lamps.

## Interpretation

Coplanar homography arithmetic works, but the app's actual two-corner axis-aligned image bounding box is not equivalent to true corresponding corners at oblique camera angles. Three-dimensional protrusion and reference-plane mismatch add systematic errors which the current acceptance check does not detect. A successful return from the measurement function is not evidence of measurement accuracy. Ruler confirmation remains necessary. The current camera workflow is not ready for automatic fabrication.

Nominal cut-list and pricing arithmetic can be evaluated separately from measurement reliability. Geometry tests do not model cutting tolerances, clamping, access, racking or assembly sequence. Prices do not establish supplier availability or delivered cost.

## Next changes supported by this evidence

1. Keep photo results explicitly provisional and preserve physical measurement confirmation.
2. Replace two image bounding corners with four corresponding outline points for approximately planar faces, while documenting the remaining 3D limitation.
3. Evaluate a straight-on capture guide and reference placement constraints using the same seeded fixture set before claiming an accuracy improvement.
4. Validate actual phone captures against measured physical objects before enabling fabrication from camera data.

No application code or acceptance threshold was changed to improve these results. Reproduce with `node simulations/run.cjs`. Full trial records and summarized cohorts are in `results/measurements.json` and `results/summary.json`.
