# Sample fabrication enquiry — not an order

Prepared 2026-10-20. **Do not manufacture from these files yet.**

This package is for estimating a five-panel lantern enclosure. The fixture diameter is a rough 393.7 mm measurement. The 100 mm projection is synthetic because the actual projection is unknown. Stock is provisionally 3.175 mm (nominal 1/8 inch); supplier must confirm actual thickness before regenerating joints. No ceiling attachment is included.

## Files and quantities

- A and B: front/back, one each; same geometry.
- C and D: left/right, one each; same geometry.
- E: bottom, one.
- coupon-tab and coupon-slot: one each for initial fit testing; not enclosure parts.
- Each part has an SVG and DXF alternative. **Do not cut both formats.**
- design.json contains dimensions, paper rectangles, joint geometry and assumptions.

All geometry uses millimeters and finished boundaries. DXF explicitly sets INSUNITS=4; confirm imported E is **474.05 × 474.05 mm**. CAD Y is flipped from SVG Y, preserving geometry. No text, engraving, machining offsets, mounting holes or router reliefs are included. Supplier applies laser kerf compensation; no uncompensated on-line cutting. Laser only. A router requires redesigned internal corners.

The frame is 474.05 × 474.05 × 128.175 mm. The minimum bottom-panel blank is approximately 18.66 inches square, before process margins. The fit allowance is 0.15 mm total, a starting point requiring a coupon. Paper is bonded inside before assembly; assemble the four-wall ring before lowering onto the bottom.

Regenerate with `node scripts/build_quote_sample.cjs`. This is a quotation fixture, not a change to the app's default material profile. Supplier import and physical fit are not yet validated.

See [draft request](REQUEST-FOR-QUOTE.md) and [mounting and sourcing research](../../projects/cu-lamps/MOUNTING-AND-SOURCING.md).
