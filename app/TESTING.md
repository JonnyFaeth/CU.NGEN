# Release verification — 0.2.0

Date: 2026-10-17. This is software verification, not physical lamp validation.

## Automated checks

`node --test app/engine.test.cjs`: 9 passing tests. Includes frame closure/clearance, stock conservation including kerf and trim, rectangular and mullion variants, paper size selection, invalid/nonfinite inputs, independent approval gates, explicit unknown costs, cent-based arithmetic, photo scaling and 36 combinations of supported geometry.

Legacy Python generator: 6 tests pass. This is a separate base-mounted concept; its numerical estimates are not reused for the new freestanding surround.

`node --check` passes for both JavaScript files. Packaging uses an explicit allowlist; no photos, credentials, local profiles, node_modules or workspace history enter the download.

## Browser verification

Tested in the Windows Codex Chromium-based in-app browser on localhost:

- Default app renders, with review holds and unknown delivery costs.
- Changing light type, width and frame style updates the dimensions and cut list.
- Invalid width 999 mm removes stale output and disables exports.
- Front view renders with the corresponding accessible image description.
- Project JSON downloads and reopens with the saved dimensions/style restored.
- Synthetic photo upload and four click calibration yields 79.63 × 138.89 mm for an 80 × 140 mm target; click placement explains the small difference. This is not a camera-accuracy benchmark.
- Applying photo estimates clears physical measurement confirmation.
- Unit wood quote $3 for a four-rod split frame, plus explicit zero extras, produces $28.38. CSV export succeeds.
- Standalone illustrated assembly HTML downloads; six document sections contain cuts, prices, seven assembly steps and a physical-test record.
- 390 × 844 responsive viewport: document width equals visible width (no horizontal overflow).

The embedded browser's native print dialog blocks automation until Escape is pressed. A standalone HTML booklet download is provided so users can open it in their normal browser and use Print / Save as PDF. Actual PDF pagination and printing on all target browsers are not claimed verified.

## Not yet verified

The browser automation policy blocks `file://` navigation. Direct opening of the packaged HTML was therefore not browser-tested; browser behavior above was tested through localhost. The package is statically checked for embedded code and absence of external runtime dependencies. No workaround to the blocked browser action was used.

Real phone camera access, HEIC handling across browsers, Safari/Firefox behavior, true 3D scanning, real-world perspective error, material availability at checkout, shipping charges, a physical assembly, joint strength, tip/slide resistance, temperature limits and operating tests. No simulated or automated software test substitutes for those checks.
