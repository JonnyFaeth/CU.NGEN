# Mobile 0.7 material estimates

The ceiling-panel flow now offers MakerStock B/BB nominal 3 mm stock in 24 x 24 inch ($9.99) and 24 x 48 inch ($31.99) sizes, plus custom stock. Sources and qualification limits are in [the procurement study](../../procurement/material-efficiency/README.md). References were checked 2026-10-20.

Preset layout dimensions subtract the published 4.7752 mm possible undersize on each dimension. Existing packing adds 8 mm margins and 5 mm spacing, without rotation. Changing stock dimensions selects Custom and clears its price. Supplier-price inputs can override reference prices. Actual thickness must be measured and joints regenerated before cutting.

For the app's synthetic 393.7 mm diameter / 100 mm projection example:

- Square stock: two sheets, $19.98 wood + $39.99 whole paper roll + $6.00 CU fee = **$65.97 known subtotal**.
- Long stock: one sheet, $31.99 wood + $39.99 paper + $7.20 CU fee = **$79.18 known subtotal**.
- Custom with blank wood price excludes wood and explicitly lists it as unquoted.

These are incomplete planning subtotals. Trimming, wood adhesive, paper adhesive, mounting, fabrication including coupons, packaging, handling, shipping and tax remain unknown until entered. No payment or order is enabled. Advertised $12 wood-box shipping is guidance only and is not silently included as total kit shipping.

The breakdown also recalculates paper rolls for eight identical kits and displays their per-kit allocation. It does not deduct that allocation from a first-purchase estimate. Geometry changes can require more paper. Exported guides and JSON use the same quote as the screen, include the source selection, and retain all missing costs.

Validation: 32 automated tests passed, followed by the nine panel tests after the export-provenance refinement. Browser checks confirmed square, long and custom pricing, and missing-cost labels. Physical material and joint qualification remain outstanding.
