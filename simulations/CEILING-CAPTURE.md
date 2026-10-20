# Assisted ceiling capture: development validation

Date: 2026-10-20. Version 0.5. This is a development test, not an independent accuracy benchmark.

## Actual reference images

Tested six supplied HEIC photographs after local, orientation-corrected JPEG conversion; four frames sampled locally from the supplied MOV; and the supplied Measure PNG screenshot. The app itself accepts still images only. Each image was reduced to a maximum 1000-pixel dimension, matching the browser detector input limit. Original media, pixel buffers and annotated overlays remain outside the repository.

The original edge-contour experiment failed to suggest an outline on all four uncropped fixture photographs. Replaced it with multiple grayscale thresholds, contour screening and ellipse fitting. Thresholds and rejection rules were adjusted on this same development set; these are not held-out test results.

Final visual review:

- Four uncropped fixture photographs: top candidate on the fixture region in 4/4. Two enclosed the fixture approximately; two selected the inner reflector and require outward correction. These are qualitative judgments, not pixel ground truth or physical measurement accuracy.
- Four video frames: one approximate fixture candidate; three returned none (cropped views). Video loading is not implemented in the app.
- Measure screenshot: no candidate after small-shape rejection. Screenshot controls produced a false candidate in the earlier iteration; plain photos are recommended.
- Two handmade-lantern photographs, outside the circular-fixture scope: one returned none; one produced a false candidate on a paper panel. The detector is not a semantic light recognizer. Review is mandatory.

A candidate score is a ranking heuristic, not a calibrated confidence or millimeter error estimate. No diameter is inferred from these images. The 15.5-inch diameter is user-supplied and converts to 393.7 mm. Ceiling projection remains unknown.

## Automated checks

`node --test mobile/scan.test.cjs mobile/mobile.test.cjs app/engine.test.cjs`: 23 passed. Checks include empty/invalid measurements, unit conversion, separate confirmation requirements, a synthetic ellipse and blank-frame rejection, and existing tabletop/quote regressions.

Local pixel-buffer replay: `node simulations/test-ceiling-photos.cjs LOCAL_PIXELS_MANIFEST LOCAL_RESULTS`. Manifest entries contain name, local RGBA buffer path, width and height; requires four bytes per pixel. The same `mobile/scan.js` function runs under Node and in the browser. Private source data is intentionally not shipped; the synthetic test is reproducible without it.

## Browser checks

Real JPEG fixture photo opens and produces a suggestion. Save remains disabled with missing projection or missing confirmation, enables with complete confirmed test values, and disables again after editing a dimension. The test used 4 inches as an explicitly synthetic projection, not an observed measurement of Jonathan's fixture. Original HEIC fails gracefully in the desktop preview browser with JPEG instructions and manual fallback. No actual iPhone test has been performed.

## Remaining work

Test on iPhone 16 Pro, improve HEIC support, collect independent fixtures with annotated outer rims, measure missed/false candidates, and validate confirmed dimensions against actual fit. Ceiling panel generation and mounting remain separate unimplemented work. No thermal or physical load test was performed in this capture validation.
