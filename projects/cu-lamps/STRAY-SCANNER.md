# iPhone depth integration — 0.9 experimental

## Selection (October 26, 2026)

CU selects [Stray Scanner](https://github.com/strayrobots/scanner) as the first capture companion: its MIT-licensed source, documented depth/confidence/calibration exports, and [free App Store distribution](https://apps.apple.com/us/app/stray-scanner/id1557051662) avoid requiring this Windows-based project owner to compile an iPhone application. This is our fit-for-purpose choice, not a comparative accuracy ranking.

[Dominik Hagmann's LiDAR Scanner](https://github.com/Dominik-Hagmann/lidar-scanner-ios) is a promising MIT-licensed point-cloud alternative, but its documented installation requires a Mac and Xcode. Its own documentation explicitly separates sampling resolution from accuracy. Neither repository establishes accuracy for our reflective light, small stem or ceiling enclosure.

We implement an original data-format adapter, not a fork or embedded copy of Stray. Upstream license: https://github.com/strayrobots/scanner/blob/main/LICENSE.md . The native app remains separate; no upstream Swift source is bundled. Safari does not acquire ARKit depth through this adapter.

## Working integration

1. Install Stray on a compatible LiDAR iPhone; the listing currently requires iOS 18.6 or later.
2. Record a short steady view with the full rim, stem and surrounding flat ceiling visible. Make a second independent recording for comparison.
3. Export to Files, unzip if necessary. In CU choose a matching numbered depth PNG and confidence PNG, odometry.csv and original rgb.mp4 from the same recording.
4. CU reads full 16-bit millimeter depth; it never converts a depth PNG through an 8-bit browser canvas. CRCs, dimensions, encoding and decode sizes are checked. Calibration requires the exact selected frame and uses actual video metadata dimensions to scale intrinsics to depth resolution.
5. On the depth map mark three widely separated ceiling points, a fourth ceiling check, opposite rim endpoints across the center, and the lowest visible point. Dark gray samples are rejected. Undo/restart are available.
6. CU back-projects points, computes rim endpoint distance and signed point-to-ceiling-plane distance, then passes these approximate dimensions into the existing five-panel, style, price and export workflow. Scan method, frame and ceiling residual accompany saved projects and design/review JSON. Changing dimensions discards scan evidence.

All inputs are processed locally. Images, video, depth maps and point coordinates are not uploaded or persisted. Exported evidence contains only method, frame number, check residual and an unvalidated-accuracy flag. Scan-derived estimates retain approximate-planning status. Existing physical confirmation remains explicit.

## Boundaries and real-device acceptance

This first adapter supports the current documented 1.4 per-frame CSV format. Older exports without intrinsic columns fail with a clear message. The published App Store binary has not been exercised here; matching its export to this source format is a real-device acceptance task.

This is assisted single-frame measurement, not automatic segmentation, multi-frame fusion, a mesh, lens-distortion correction or a complete room scan. Seven points cannot prove full coverage. The user may select a chord instead of a diameter or miss a thin stem. Specular/transparent surfaces and depth blending at edges can yield a confidently wrong point. Per-pixel confidence is not an accuracy guarantee. The 10 mm ceiling residual and 15 mm rim-height gates are heuristic rejection thresholds, not error bounds or certified tolerances. More than one frame and independent physical reference dimensions remain necessary before releasing cutting dimensions.

Test on the actual iPhone 16 Pro using independently measured reference objects and at least three fresh recordings per object, different angles/distances, flat and textured ceilings, reflective fixtures and thin protrusions. Record signed dimension error, repeatability, failed captures, missing surfaces and incorrect acceptance. Do not tune only against the owner's rough 15.5 × 9 inch dimensions. No physical capture, absolute accuracy or native iPhone installation has been validated by the synthetic tests.

## Reproduction

Run `node --test mobile/stray.test.cjs` for PNG filter/precision, corruption, per-frame calibration, synthetic geometry and invalid-data checks. Run the repository CI suite for existing five-panel and customer workflows. Build with `python scripts/build_mobile.py`; package is `dist/CU-NGEN-Mobile-0.9.0.zip`.

Source-format references:
- https://github.com/strayrobots/scanner/blob/main/docs/format.md
- https://github.com/strayrobots/scanner/blob/main/StrayScanner/Helpers/OdometryEncoder.swift

No claim of improved real-world accuracy is made until paired device/reference measurements are collected.

## Validation performed for this change

67 automated tests passed, including actual UI-handler tests for scan import, applying dimensions, invalidating stale selections and preserving evidence through saved projects and export. PNG tests exercise all five PNG row filters without losing 16-bit depth. The deterministic design benchmark still reports 234 valid generated designs out of 288 cases, with 54 deliberately unsupported cases rejected. Desktop browser review confirms controls render and missing files produce a useful error. These checks do not replace a real iPhone capture; no device accuracy or full real-file browser import is claimed.

## Version 0.10 — ZIP review workflow

A single local ZIP supplies video, calibration and numbered depth/confidence pairs. The bounded reader supports stored/deflated entries, validates checksums/sizes, rejects unsafe/duplicate names, encrypted/split archives and multiple recordings. Limits: 300 MB archive, 600 MB declared expansion, 15,000 entries. Files are decoded on demand; no filesystem extraction or server upload occurs in the app.

Up to 24 evenly spaced frames are scored by high-confidence valid depth coverage (35% whole view, 65% central half). This does not detect the fixture or prove completeness. Photo previews use the upstream 60 fps export convention. Frames beyond video duration are excluded. Seek/display alignment remains subject to device review; do not select points when features do not match.

Guided point selection remains necessary. A skipped stem no longer discards an independently usable diameter. One reading per frame is retained; two distinct frames are required per scan-derived dimension. Provisional agreement requires spread <= max(10 mm, 5% of maximum). The largest agreeing estimate is used. Views are not statistically independent and agreement cannot exclude systematic error. Missing/disagreeing dimensions receive separate manual inputs; provenance distinguishes manual-fallback from scan-comparison. All results remain planning-only.

The owner-supplied ZIP was tested privately: 1,411 matched pairs, 24 sampled candidates decoded/calibrated, view 000980 ranking first by this heuristic. Desktop browser import, preview rendering, view switching and manual-fallback design generation were verified. Scan and screenshots remain ignored local files. Tests cover archive rejection, disagreement, dimension separation and actual UI handlers. Phone memory/performance, automatic segmentation and fabrication accuracy remain unverified.
