# CU.NGEN paper lamps

Status: working geometry and material estimator; **no physical prototype has been tested**.

**Current build selection:** [Prototype 01 materials, joints, LED, budget and assembly](PROTOTYPE-01.md). It uses a smaller 7 × 7 × 10 inch frame and retail half-inch stock. The original numerical example below remains illustrative and is not a model of the selected prototype.

The first family is a Japanese-inspired, orthogonal tabletop paper lantern: a rectangular wood frame, four flat paper panels, an open top, and a rectangular base. All cuts are square. No curved forms, bent bamboo, printer, or custom electronics are required by this geometry. Supplier-cut parts are the intended route for a builder without a workshop; sourcing is still pending.

This is an additional CU.NGEN track, not a replacement for CU Homie or CU LeRobot. The first implementation uses explicit arithmetic and constraints, not generative AI. It generates dimensions that close geometrically; it does not claim that arbitrary inputs produce a safe lamp.

## Run it

From the repository root, using Python 3.10 or newer, with no third-party packages:

```powershell
python projects/cu-lamps/generate.py projects/cu-lamps/example.json --out projects/cu-lamps/examples/first-lamp
python -m unittest discover -s projects/cu-lamps -p "test_*.py" -v
```

Edit the JSON inputs to generate different rectangular proportions. Output consists of `build.json` (dimensions, frame cut list, stock allocation, paper sizes, mass, ideal stability estimates, assumptions and unresolved items) and `elevations.svg` (front and side views). The drawing is not a scaled print template, electrical plan or fabrication approval. The stock allocation is a conservative heuristic, not a claim of minimum cost or optimal packing.

## First example

| Item | Calculated nominal size or quantity |
| --- | --- |
| Frame | 180 × 180 × 280 mm |
| Base | 200 × 200 × 12 mm |
| Total height | 292 mm |
| Posts | Four 12 × 12 × 280 mm |
| Front/back rails | Four 12 × 12 × 156 mm |
| Side rails | Four 12 × 12 × 156 mm |
| Paper | Four 168 × 268 mm panels |
| Frame stock | Three usable 900 mm lengths, 12 × 12 mm section; 3 mm kerf allowance per cut |

The example's material densities, paper weight, and light-source envelope/mass are **illustrative inputs, not specifications for purchased products**. The base stock, adhesive, source, mounting, clips and tools still need selection. Do not use the cut list as a complete procurement list.

## Construction geometry

Take the base upper face as z=0. The frame occupies x=0..W, y=0..D, z=0..H. Four full-height square posts occupy the corners. Front/back rails span x=s..W-s at y=0..s and D-s..D; side rails span y=s..D-s at x=0..s and W-s..W. Both rail sets occupy z=0..s and H-s..H. Rails meet post faces without overlap. There are 16 rail-to-post end joints.

Paper attaches to the outside faces, inset from frame edges by s-overlap. It covers each opening with an overlap on all four sides; it does not wrap around corners. The top stays open. The source envelope is centered horizontally on the base. The source-height clearance is conservative to the underside of the upper rails, although the center is open.

The proposed assembly sequence is:

1. Obtain cut stock, a flat base and paper. Measure actual dimensions before using the model inputs. Stock length means usable length after end trimming.
2. Dry-fit two front/back rectangular frames in a square jig. Check diagonals, flatness and rail lengths.
3. Join those frames with the four depth rails. Trial glued butt joints are a starting concept; choose adhesive for the actual wood, follow its curing instructions, and test racking before relying on them. Reinforcement may change the parts list and source clearance.
4. Attach the frame to the base using a selected, tested attachment. The current model does not specify a proven base joint.
5. Cut and attach paper using an adhesive compatible with the chosen paper/finish. Test a coupon for wrinkles, staining, peel and humidity effects first.
6. Complete the unlit assembly checks below before selecting and installing a light. Final attachment and service access must be resolved before use.

## Physical calculations and limits

- Wood volume is the sum of the 12 nonoverlapping rectangular members. Mass = volume × supplied density. Paper mass = panel area × supplied grammage; base mass uses its own density.
- Center of mass is mass-weighted height, assuming symmetric construction and a centered, secured source. Adhesive, hardware, wiring and finish are omitted; replace estimates with measured mass before judging stability.
- Ideal tipping angle = atan(shorter base half-width / center-of-mass height). Ideal horizontal top-force to tip = weight × shorter base half-width / total height. These are rigid-body calculations, not impact, sliding, joint-strength or safety tests. The full base must contact a level surface.
- The 1 mm example dimensional allowance reduces source clearances and reserves sheet-trimming room. It is not a complete tolerance-stack analysis or a certified cutting tolerance. Measure and dry-fit before bonding.
- Geometry rejects invalid/nonfinite values, missing/unknown inputs, nonpositive openings, excessive paper overlaps, source-clearance violations, pieces longer than stock, and panels that cannot fit a sheet in either orientation. Paper planning conservatively assigns one sheet per panel and ignores grain/orientation constraints.
- Thermal behavior, beam/joint strength, lifetime, brightness and light transmission remain unknown. The engine must not fabricate those properties from appearance or dimensions. There is no validated lamp recommendation or cost quote yet.

## Prototype gates

**Unlit prototype first:** record material/product IDs, measured dimensions and masses, assembly time, tools, errors, and photographs. Check squareness, base attachment, racking and paper adhesion. Compare measured center of mass/stability with model predictions; avoid loading the prototype over valuables. No numeric strength pass threshold has been established yet.

**Light integration:** use a complete manufactured LED light source and its specified power supply within its manufacturer's installation limits; no flame, incandescent source, or improvised mains wiring. Low power or LED labeling alone does not establish compatibility with paper. Exact source model, mounting, manufacturer clearances, operating conditions and service access must be documented. The example's 30 mm clearance is an arbitrary geometric design input, **not a safe thermal distance**.

Before lit use, resolve source and battery/power-supply instructions, measure temperatures at paper, wood, adhesive and source under the intended worst operating conditions, and compare to documented material/component limits. Unknown limits block approval. Assess abnormal operation and applicable product requirements before sale or unattended use; the generator does not certify a luminaire. A corded design needs a real cable exit/strain relief and updated geometry; these are not included in v0.1.

## Next iteration

Select one actual wood section, paper, base material and complete LED source. Replace sample assumptions with measured/catalog values, build one unlit frame, then revise joints and tolerance rules from that evidence. Later add measured optical properties, sourced prices, decorative orthogonal lattice options and validated configuration search.

## Design references

The [Noguchi Museum's Akari collection](https://shop.noguchi.org/collections/akari-light-sculptures) describes washi paper and bamboo construction, a material reference rather than a template copied here. Our square wood frame is a distinct proposed construction. [IKEA's STRÅLA paper shade](https://www.ikea.com/gb/en/p/strala-lamp-shade-paper-star-white-green-10639886/) illustrates separating a paper shade from a compatible light source; its compatibility statements do not transfer to our design. References consulted 2026-10-17.

Substantial AI assistance was used to draft this implementation and documentation. Automated tests establish software behavior only. Licensing remains governed by the repository's [licensing status](../../LICENSING.md).

## Ceiling lantern reference

[Stepped Shoji design reference](STEPPED-SHOJI.md) records the first actual ceiling fixture and handmade style study. Ceiling mounting is a new, unimplemented product mode; the current freestanding kit does not cover this fixture. Source home media stays local.
