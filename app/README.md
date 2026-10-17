# CU.NGEN Lantern Studio 0.2.0

A downloadable, offline browser app for designing an orthogonal paper surround around an existing small tabletop light. Open `index.html`; there is no build step, install, login, dependency or API key.

## Delivered workflow

- Front/side photo input with a manually marked reference and bounding box, plus physical measurement confirmation.
- Deterministic frame sizing from whole-light width, depth, height, clearance and measurement allowance.
- Plain and split-frame variants; perspective, front, side and top SVG views.
- Individually numbered wood parts, kerf-aware stock allocation and paper panel dimensions.
- Sourced material links, dated unit prices, quote overrides, and explicit unknown extras.
- JSON save/open, CSV parts export, SVG drawing export and an illustrated printable booklet (browser Save as PDF).
- Entirely local operation; no fetch calls, telemetry, CDN assets, model requests or photo uploads.

This is **assisted 2D photo measurement**, not automated 3D reconstruction or LiDAR. A reference must be in the measured feature's plane; a single image cannot establish hidden geometry or heat clearance. User confirmations never set `physicalApproval` to true.

## Supported prototype family

The app uses an independent, unfastened surround, open at top and bottom, with 12.7 mm square hardwood stock. The original light remains on its original base on the table. Unlike `projects/cu-lamps/PROTOTYPE-01.md`, this family has no base plate and does not incorporate a new light source. Do not mix the two cut lists.

Four full-height posts occupy the rectangle corners. Front/back rails run between posts in the x direction; side rails run in the y direction. Lower rails start at the selected bottom gap. Upper rails finish flush with the post tops. Optional center mullions butt between the rail pairs. Paper is on exterior faces, with 6 mm overlap around the openings. The top remains unobstructed.

Inputs include the full source/base/control/motion envelope. Internal spans = measured span + 2 × (requested clearance + measurement allowance), rounded upward to 0.5 mm. Total frame dimensions include two 12.7 mm posts. Height provides clearance below the upper rails. Domain caps (400 mm footprint, 450 mm height, 2.5 slenderness ratio) bound the prototype family; they are not proven safety thresholds.

The app does not validate real wood joints, racking, tipping, thermal behavior or optical performance. It produces unlit prototype instructions with explicit unresolved checks. Battery LED is the first evaluation path; corded fixtures require a separate integration assessment. Flame, incandescent and halogen are unsupported. Hanging/ceiling fixtures and lamp-mounted adapters are outside this release.

## Costs and sourcing

Supplier pages consulted 2026-10-17 are stored as links in `engine.js`. DRSQ-12-36 stock is nominal 12.7 mm square and 914.4 mm long; listing price $2.13 at one-unit tier, but the page reports unavailable. Paper is 45 gsm off-white Thai kozo in letter or 25 × 37 inch sheets. Paste is Y7; wood glue is Titebond Original 4 oz, Rockler 80862. Prices account for full purchased rods/sheets/bottles, not prorated consumption.

Paper uses a conservative one-sheet-per-panel plan. Larger sheets may waste material; this is disclosed rather than claiming optimized nesting. Wood uses first-fit decreasing with 10 mm trim per rod and 3 mm kerf per piece. It is not a guaranteed minimum-cost optimizer. Unit quote overrides are labeled user-entered. Tools, shipping, tax, outsourced cutting and testing equipment start unknown. There is no purchase or payment integration; supplier links let the builder review and order independently.

## Development / tests

```powershell
node --test app/engine.test.cjs
python -m unittest discover -s projects/cu-lamps -p "test_*.py" -v
python -m http.server 8765 --bind 127.0.0.1 --directory app
```

Use the HTTP command only for development if needed; end-user offline operation does not need it. The synthetic photo fixture in `test-fixtures` has a 100-pixel reference corresponding to 100 mm and an 80 × 140 pixel object. It is not real-world calibration evidence.

## Release limits

The working app is a research/design prototype, not a safe-to-sell generated lamp. Actual measurement accuracy, assembly reproducibility, joints and thermal safety require a physical build. No live inventory guarantee or fully delivered price can be provided without current checkout costs. No automatic photography or AI segmentation is claimed. Browser printing behavior and mobile camera access depend on browser/OS; tested configurations are recorded in `TESTING.md`.

Substantial AI assistance was used in development. Original source and diagrams retain the repository's [licensing status](https://github.com/JonnyFaeth/CU.NGEN/blob/main/LICENSING.md); publication is not a new general reuse grant.
