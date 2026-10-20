# Approximate 15.5 inch x 9 inch fixture: export consistency test

Tested 2026-10-20 with mobile 0.7.1. This package was downloaded through the app's real browser ZIP button, then checked with Python zipfile and XML parsing. It is separate from the earlier sample sent to suppliers; it does not replace their RFQ files.

**Planning only.** Diameter 393.7 mm and projection 228.6 mm are approximate user dimensions, not verified measurements. Stock input is nominal 3 mm, not a delivered-sheet measurement. Mounting remains unresolved. No physical build, joint-strength, thermal or installation validation is claimed.

| Part | Quantity | Wood envelope (mm) | Paper insert (mm) |
| --- | ---: | --- | --- |
| A / B, front / back | 2 | 473.7 x 256.6 each | 423.7 x 233.6 each |
| C / D, left / right | 2 | 449.7 x 256.6 each | 423.7 x 233.6 each |
| E, bottom | 1 | 473.7 x 473.7 | 423.7 x 423.7 |

Outside envelope: 473.7 x 473.7 x 256.6 mm. Interior envelope: 443.7 x 443.7 x 253.6 mm. These use the app's 25 mm side and bottom spacing inputs, which are geometric allowances, not qualified installation clearances.

Stock: three 24-inch-square sourcing candidates, planned inside 604.8248 mm square usable envelopes; one whole 939.8 x 3581.4 mm paper roll. Wood $29.97 + paper $39.99 + CU fee $7.00 = **$76.96 known subtotal**. Nine items remain unquoted: stock trimming, wood adhesive, paper adhesive, mounting, fabrication/coupons, packaging, handling, shipping and tax.

Verified:

- All 14 ZIP entries passed CRC checks and decoded successfully.
- Five individual SVG envelopes and contour counts match design.json; automated export tests compare the entire SVG contents and nested sheets against the geometry engine.
- parts-list.json matches panel and paper dimensions, stock quantities, quote and missing costs.
- Assembly guide matches the same quote, panel IDs and paper IDs; removed the stale $21.06 wood-reference paragraph.
- Guide describes the four-wall ring before bottom insertion, eight bottom tabs/slots, paper bonded inside clear of joints, and a separate fit coupon.
- Approximate measurement provenance survives the browser input, saved design, parts list, guide and README. Manufacturing-ready remains false.

Regression commands:

```sh
node --test mobile/panel-export.test.cjs mobile/panels.test.cjs mobile/scan.test.cjs mobile/mobile.test.cjs app/engine.test.cjs
```

The 100 mm demonstration package and older 3.175 mm-thickness RFQ sample are intentionally different. Use only one consistent package per fabrication request; never mix their panel or coupon files. Confirm the actual fixture and stock dimensions, regenerate, and obtain a qualified mount before fabrication or installation.
