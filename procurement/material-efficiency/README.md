# Lower-cost materials, unchanged five-panel sample

Research and calculation date: 2026-10-20. Planning package, not a fabrication release or complete-kit quotation.

## Recommended sourcing candidate

Use two nominal 24 x 24 inch B/BB Baltic birch sheets, preserving the five-panel geometry, rib widths, joints and panel orientation. Retain the existing Kozo diffuser paper. The immediate saving comes from procurement, not weakening the structure or changing the appearance.

MakerStock's selected nominal 1/8 inch / 3 mm variants showed:

| Stock | Quantity | Unit price | Wood subtotal |
| --- | ---: | ---: | ---: |
| [24 x 24 inches](https://makerstock.com/products/baltic-birch-plywood?variant=42110553129057) | 2 | $9.99 | **$19.98** |
| [24 x 48 inches](https://makerstock.com/products/baltic-birch-plywood?variant=42246108545121) | 1 | $31.99 | $31.99 |

Both were offered for cart addition when checked; no purchase made. The supplier advertises B/BB grade, unfinished birch, dimensional tolerance +/-0.188 inch, thickness tolerance +0.3/-0.4 mm, and $12 shipping per up-to-50-lb box to the contiguous US. Confirm checkout, stock acceptance and trimming charges before buying.

Our previous wood allowance was $42.12 from an unavailable reference listing. The new material-only candidate is **$22.14 lower (52.56%)**. This is a reduction against that allowance, not a measured saving against a current competing delivered quote. Advertised wood shipping makes the two-sheet candidate $31.98 before tax. Previous-source shipping is unknown.

## Paper and cash required

Keep [S111 off-white Kozo paper](https://www.eshoji.com/kozo-mulberry-paper-off-white/), listed at $39.99 for a 37 inch x 11 ft 9 inch roll. The generated layout fits eight complete five-insert sets on one roll with 5 mm separation and 8 mm perimeter margin. This is a demonstrated yield, not a mathematical optimum; damage and trimming mistakes can reduce it.

| Basis | Wood + paper | Meaning |
| --- | ---: | --- |
| First purchase | **$59.97** | Two wood sheets plus one whole paper roll |
| Repeat-kit allocation | **$24.98** | Two sheets plus approximately one eighth of the roll |

Add $12 advertised wood shipping if the order fits one box. Paper shipping, tax, cutting, trimming, adhesives, mounting, labor, packaging, rejects and CU's fee are additional. These figures are **not a complete-kit selling price**. Never count unused paper as cash saved on the first order. Never assign sale value to offcuts without a real use.

## Reproducible layouts

- `two-square-sheets-1.svg` and `two-square-sheets-2.svg`: unchanged panel contours in a conservative stock envelope.
- `long-sheet-1.svg`: comparison only; the same stock area costs more from this source.
- `paper-eight-sets-1.svg`: labelled paper cutting diagram, not a laser-ready production file.
- `plan.json`: source geometry hash, placements, calculations and exclusions.

Generate from the repository root:

```sh
node scripts/material_plan.cjs
node --test scripts/material_plan.test.cjs mobile/panels.test.cjs
```

The wood layout subtracts 4.7752 mm from each nominal sheet dimension before applying 8 mm margins. All panels keep their original orientation; arrange the B face outward and confirm actual grain direction when loading. The two-sheet and long-sheet plans buy the same nominal area: using one large sheet is not automatically less wasteful.

SVG contours are finished dimensions requiring supplier CAM kerf compensation. Their canvas denotes the minimum planning envelope, not a demand to trim stock to that exact size. Machine work area, clamps and accepted blank sizes must still be checked. A 24-inch stock sheet may need supplier trimming to enter a smaller machine even when the part fits its cutting area.

## Quality gates before cutting

1. Measure delivered thickness in several places. The existing RFQ sample uses **3.175 mm**, while the candidate is nominal **3 mm**; do not assume they interchange. Regenerate joints using measured thickness, recalculate layout and cut a mating coupon before full panels.
2. Inspect face quality, flatness, voids and edge splitting. Matching the advertised B/BB grade does not prove identical performance. Reject defects across thin ribs or joints.
3. Keep ribs, borders, clearances and paper unchanged. Check assembled squareness and joint retention in a physical prototype.
4. Keep the current RFQ sample files frozen. Its 100 mm fixture projection is synthetic and its mounting is unresolved. This sourcing study does not make it a fitted ceiling kit.

## Further savings without changing the kit

Collect bottom-window offcuts for fit coupons and glue/paper adhesion trials. A fabricator must plan the coupon cut before releasing its surrounding window, or secure the recovered piece separately. No extra yield or dollar saving is booked yet.

Combine future wood orders only after confirmed demand to spread shipping. Batch paper preparation into complete labelled sets; bag each kit's five inserts together. Ask the makerspace whether accepted scrap is available in the required grade and thickness after they reply.

Avoid replacing B/BB with cheaper BB/BB, reducing thickness, rotating only some visible walls, or splitting the bottom just to hit a price. Those require separate appearance and structural evaluation. Procurement approval also does not remove the need to validate the eventual fixture enclosure and ceiling attachment.

The hosted app's provisional prices remain unchanged pending actual stock qualification and fabrication/mount quotes; this package provides an auditable procurement alternative without presenting an unverified complete-kit price.
