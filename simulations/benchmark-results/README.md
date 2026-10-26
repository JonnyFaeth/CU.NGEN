# Scan-to-kit benchmark

Run with `node simulations/benchmark.cjs`. Results are deterministic; source hashes are in results.json.

## Scope and results

{
  "designCases": 288,
  "generated": 234,
  "rejected": 54,
  "invalidGenerated": 0,
  "outlineCases": 14,
  "outlineRequiredFailures": 0,
  "costComparisons": 12
}

- Synthetic images are not real-world scan accuracy evidence.
- No automatic metric reconstruction or model training is performed.
- User fixture dimensions are approximate, not ground truth.
- No physical fit, mounting, thermal, load or longevity certification.
- Reference prices are not refreshed supplier quotes.
- Customer workflow runs real handlers in a DOM test harness, not an iPhone browser.

## Measurement

The actual OpenCV outline detector runs against 14 procedurally rendered images, including normal, low-contrast, occluded, cluttered and clipped cases. Normal cases require top-candidate intersection-over-union >= 0.85; blank images require no candidates. Challenge failures are recorded, not hidden. No metric depth or diameter is inferred from these images. Approximate 15.5-inch by 9-inch inputs remain approximate. See sensitivity results for the effects of +/-20 mm input error; these are geometric spaces, not certified clearances.

## Manufacturing geometry

288 input combinations exercise dimensions, thickness and patterns. Rejected configurations are reported separately from generated valid designs. Checks cover orthogonal finite contours, hole placement, paper overlap, stock boundaries and separation, assembled corner and base-tab/slot alignment, and cut perimeter. These checks do not establish material strength or physical fit.

## Cost comparison

Reference prices dated 2026-10-20, not newly verified. Whole-sheet and whole-roll purchasing, with 10% CU fee. Nine additional costs remain unknown. Cutting perimeter excludes coupons and does not predict machine time.

| Projection mm | Style | Stock | Sheets | Known subtotal incl. fee | Panel cut m |
|---|---|---|---|---|---|
| 100 | plain | square | 2 | $65.97 | 14.751 |
| 100 | plain | long | 1 | $79.18 | 14.751 |
| 100 | horizontal | square | 2 | $65.97 | 27.669 |
| 100 | horizontal | long | 1 | $79.18 | 27.669 |
| 100 | stepped | square | 2 | $65.97 | 23.927 |
| 100 | stepped | long | 1 | $79.18 | 23.927 |
| 228.6 | plain | square | 3 | $76.96 | 16.859 |
| 228.6 | plain | long | 2 | $114.37 | 16.859 |
| 228.6 | horizontal | square | 3 | $76.96 | 29.777 |
| 228.6 | horizontal | long | 2 | $114.37 | 29.777 |
| 228.6 | stepped | square | 3 | $76.96 | 26.036 |
| 228.6 | stepped | long | 2 | $114.37 | 26.036 |

Stock choices preserve each style's geometry. Different patterns have different cutting lengths even where material subtotals match. The cheapest listed subtotal is not a complete-kit quote.
