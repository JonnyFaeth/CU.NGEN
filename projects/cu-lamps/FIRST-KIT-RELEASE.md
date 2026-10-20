# First complete CU kit: release path

2026-10-20. Product aim: open app, capture a light, compare designs, refine, choose, and order a complete kit. Mobile 0.8 implements the planning and review-package stages. Payment, delivery and physical approval are not implemented or implied.

## Keep the customer journey simple

Customer supplies a photo and the dimensions needed for fit; approximate inputs can explore designs. Do not make model numbers, wattage or mounting engineering a routine form. CU's internal review resolves those details from photos and available product information, asking one targeted follow-up only when necessary. A single photo currently cannot supply reliable metric depth. The interface must continue to say that measurements are entered, not automatically scanned in 3D.

The supported design family is a five-panel rectangular cover around a circular ceiling-fixture envelope. Noncircular fixtures, inaccessible mounting and uncertain light sources are review cases, not automatically approved configurations. Pattern names are stylistic choices, not claims about measured illumination.

## Current first article

Use the separate [nine-inch planning package](../../procurement/ceiling-nine-inch-planning/README.md). Its rough envelope is diameter 393.7 mm and projection 228.6 mm. All measurements, nominal 3 mm stock and attachment remain subject to verification. Do not manufacture the earlier 100 mm demonstration package by mistake.

## CU operations: evidence needed before releasing a kit

| Gate | Work | Evidence / acceptance |
| --- | --- | --- |
| Fixture identification | Obtain usable fixture and light-source photos; establish specifications and service needs | Reviewer records compatible source and manufacturer restrictions; unresolved cases do not ship |
| Actual dimensions | Measure full rim, lowest projection and attachment geometry | Recorded dimensions and uncertainty; regenerate all files from one approved design |
| Attachment design | Select a load path into a verified attachment; account for service removal | Qualified design review, actual weight, hardware ratings, installation method and prototype test plan; no unqualified ceiling adhesive substitution |
| Cutting | Fabricator confirms material, thickness, bed size, kerf and accepted geometry | Mating coupon fits without forcing or excessive play; inspect face quality, flatness and thin ribs |
| Assembly | Build all five panels and paper inserts using the exported instructions | Record actual dimensions, squareness, assembly time, joint failures, missing steps and tools; fix and regenerate if inconsistent |
| Enclosure suitability | Review light-source compatibility, spacing, heat and service access | Documented evaluation under intended use; a checkbox or simulation alone is not evidence of suitability |
| Customer trial | Have someone unfamiliar with the design assemble the kit | Log questions, errors, tools and damaged parts; repeat after instruction corrections |
| Complete pricing | Get matched quotes for cutting, paper, adhesives, attachment, packing, handling and delivery | Every cost sourced and dated, rejects accounted for, 10% CU fee explained; no unknown line silently zeroed |
| Fulfillment | Assign who buys, cuts, checks, packs, ships and handles returns | Named operator, lead time, stock substitutions policy and approved packing list |
| Checkout | Establish merchant account and order handling | Payment test, confirmed order record, customer notification, refund procedure and supported delivery area |

These are open gates, not completed tests. No machine bookings, purchases, paid work or supplier messages were made by this update.

## Quote-review handoff

The app's Prepare quote request downloads a ZIP with the exact selected design, five panel SVGs, nested stock, paper rectangles, parts list, guide and quote-request.json. It includes a plain-language request for a complete kit quote and explicitly authorizes no paid work. Nothing is transmitted automatically. Photos remain on the device and are not in the ZIP. A customer must share the package with their reviewer until CU has an actual submission service.

## Product acceptance tests

1. Enter approximate 15.5 inch diameter and 9 inch projection; preserve approximate status in every export.
2. Compare all three patterns; all must enclose the same input envelope, with correct distinct cut geometry.
3. Select Terrace, save, change to Quiet, restore; screen and downloads must return to Terrace.
4. Change stock or dimensions; update sheet counts, prices and unknowns without retaining stale exports.
5. Prepare a review request; quote, selected pattern and panel files must agree; no order/payment claim is allowed.
6. Invalid dimensions must clear generated results and disable stale export actions.
7. On iPhone 16 Pro, verify camera permissions, photo selection, marking, touch controls, saved design persistence, ZIP opening and Add to Home Screen. Desktop browser testing is not a substitute for this device test.

## What 0.8 does not claim

No automatic LiDAR measurement, manufactured prototype, qualified mount, guaranteed fit, live stock feed, definitive total, supplier delivery commitment, live quote submission or payment processing. Keep these visible in status and implementation work until evidence closes the relevant gate.
