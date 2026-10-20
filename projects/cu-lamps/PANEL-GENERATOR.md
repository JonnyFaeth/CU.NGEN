# Five-panel generator: geometry and fabrication profile

Implemented in mobile 0.6 on 2026-10-20. This replaces the earlier ceiling-generator placeholder with prototype drawings, not a physically validated product.

## Supported process

CNC laser-cut sheet wood, 2–6 mm measured thickness. Outputs are finished 2D boundaries in true millimeters. They are neither machine G-code nor compensated beam-center paths. The fabricator must apply calibrated inside/outside kerf compensation. CNC router corner reliefs are not implemented; do not send the same files to a router without redesign.

Exactly five enclosure panels: A front, B back, C left, D right, E bottom. Top open. A/B have four corner slots each; C/D have four mating end-tabs each. Each wall has two lower tabs mating to eight slots in E. Tabs locate parts; wood adhesive retains them. They are not snap locks or validated suspension joints.

## Geometry convention

Let t be measured thickness, c side spacing, q bottom spacing, d fixture diameter and p total ceiling projection. I = d + 2c; wall height H = p + q; inset b = max(12, 3t). Base width/depth W = I + 2t + 2b. The front/back main faces are W × H. Side main faces are I × H, with t-deep tongues on their ends. Lower wall tongues extend t below the wall body into the base. Overall enclosure height is H + t; interior height above the base is H.

In assembled coordinates, E covers x/y 0..W. Front/back walls sit at y=b and y=W-b-t. Left/right walls sit at x=b and x=W-b-t. Side end-tabs occupy the thickness of front/back walls. The four-wall ring must be joined first and then lowered onto E; attaching each wall to E before closing the corner joints would trap the assembly.

Default total slot allowance 0.15 mm is a coupon starting point, not a proven fit. It is added once to slot width and length, centered on each mating tab. Material thickness, machine variation, kerf and adhesive choice still require a physical coupon. Do not promise a perfect fit from nominal dimensions.

## Patterns and paper

Plain, horizontal-rib and stepped-window variants use one connected piece for each face. The bottom uses four windows with a connected cross rib. Each panel has one paper rectangle covering the full window envelope with 6 mm bonding margin on all edges. Paper avoids slots and tabs. Paper is bonded on the inside before final assembly.

## Packing and costing

Conservative shelf layouts use 8 mm wood edge margins and 5 mm separation, without rotation. Every panel must fit the selected stock; invalid layouts disable exports. These are not globally optimized nesting results. Fit coupon uses extra scrap/stock and its cost belongs in the fabrication quote.

Reference wood: Woodpeckers PLY-24-24-18, nominal 3 mm / 1/8 inch, 24 × 24 inches (609.6 × 609.6 mm), $21.06 for one sheet. Listing showed unavailable when checked 2026-10-20. This is a planning price, not an available procurement offer. Supplier warns dimensions can be slightly undersize; edge margins do not replace measuring the delivered stock.

https://woodpeckerscrafts.com/products/1-8-x-24-x-24-baltic-birch-b-bb-plywood

Reference paper: eShoji S111 off-white Kozo small roll, 37 inches × 11 ft 9 inches, $39.99 checked 2026-10-20. Packing uses the stated imperial dimensions converted to 939.8 × 3581.4 mm. Charges whole rolls, retaining leftovers; does not prorate a first purchase.

https://www.eshoji.com/kozo-mulberry-paper-off-white/

Wood/paper quote inputs are editable. Changing wood sheet dimensions clears the old wood price. Wood adhesive, paper adhesive, mounting, CNC setup/cutting/coupon, packaging, handling, shipping and tax default to unknown, never free. CU's 10% fee applies to known kit costs, excluding shipping and tax. Orders remain closed.

## Validation and example

31 automated tests pass, including paired corner/base coordinates, hole separation, paper/joint separation across 54 parameter combinations, stock bounds and non-overlap, real-unit SVGs, quote arithmetic and earlier capture regressions.

Browser checks: sample generation, ZIP download/CRC integrity, all five SVGs and XML validity, scan confirmation feeding the generator, pattern switching, too-small-stock rejection clearing downloads, and measurement changes hiding stale outputs.

[Example package](../../simulations/five-panel-example/READ-ME.txt): diameter 393.7 mm (from user rough measurement), **synthetic projection 100 mm**, t=3, spacing 25 each. Enclosure 473.7 × 473.7 × 128 mm; two wood sheets and one paper roll; known estimate $90.32 including $8.21 CU fee. Eight cost categories remain unquoted. This is not Jonathan's confirmed build.

No CNC cut, physical fit, structural load, ceiling mount, or iPhone device validation has been performed. Mounting and service removal still need an actual interface design. Scope here is generating and testing prototype geometry and estimates.
