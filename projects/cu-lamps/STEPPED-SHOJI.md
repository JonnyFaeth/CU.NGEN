# Stepped Shoji — ceiling-lantern design reference

Date: 2026-10-20. Source: Jonathan's unfinished handmade lantern, six supplied photographs and four sampled frames of a supplied video. Working style name only; not a historical style attribution.

## Observed design language

- Pale translucent panels bounded by thin, natural-colored strips; exact material species and adhesive are unverified.
- Orthogonal stepped outlines, repeated horizontal ribs, and larger vertical bands.
- Open bands separating the upper perimeter from the main panel body.
- An open underside with crossing narrow members. The finished closure and attachment are not established.
- Layered rectangular silhouettes rather than a single uninterrupted box.

These are visual observations, not measured CAD geometry. The source is unfinished and should influence a new parametric family without implying all visible joints are final.

## Actual fixture and scope change

The supplied fixture is ceiling-mounted, with a circular rim, two visible lamps in opposed holders, and a central projecting stem. Its existing cover is absent in the supplied views. The stem's thread, load rating, attachment details, and intended accessory compatibility cannot be established from the images. Do not assume it can support this lantern.

Current Lantern Studio 0.4 generates freestanding surrounds. It does not support or validate ceiling suspension. Do not reuse its current cut list, footing assumptions, or quote as a finished ceiling kit.

## Proposed engine inputs

Separate `mountingMode` from decorative style. A ceiling-surround mode needs confirmed fixture diameter, complete projection below the ceiling including lamps/stem, chosen outer width/depth/height, service opening, verified mounting interface, and calculated assembly mass. Circular fixture geometry must fit inside the rectangular interior envelope.

For this style, expose rib count, upper-band height, open-band height, step inset, and border width. Derive equal rib spacing from the available panel height and actual strip width; reject nonpositive openings, collisions, and strips longer than purchased stock. Count ribs, borders, paper panels, joints, and mounting components in the bill of materials. Decorative strips must not silently become load-bearing members.

Updated manufacturing direction: use five CNC-cut sheet-wood panels with integral borders and ribs, rather than assembling the ceiling enclosure from individual sticks. See [five-panel kit specification](FIVE-PANEL-KIT.md). The open underside in the unfinished reference becomes a paper-lined bottom panel. Preview variants remain concept-only until matching fabrication and mounting plans exist.

## Evidence needed before a fitted kit

1. Rim outside diameter and maximum total projection from ceiling, in millimeters.
2. Preferred finished lantern width, depth, and drop; handmade prototype measurements if available.
3. Fixture model or manufacturer mounting documentation, plus accessible mounting-interface details. A visible stem alone is insufficient evidence of compatibility.
4. Actual stock section, paper, joint method, and measured prototype mass.

No absolute dimensions can be recovered reliably from these uncalibrated views. No verified scale reference was identified. Hand size and assumed bulb dimensions must not be used as scale.

## Next validation

Model the measured fixture envelope and lantern separately. Check intersection, access for lamp replacement, panel assembly order, stock use, and quote completeness. Build and weigh a small joint sample before selecting the suspension design. Physical fit and attachment remain untested; no new software feature or physical validation is claimed by this reference document.

Original home photographs, video, metadata, and decoded previews stay local and are not included in the public repository. This document records only project-relevant observations. No image training dataset has been created.

Implementation update, mobile 0.6: [five-panel CNC laser generator](PANEL-GENERATOR.md) now provides prototype drawings and cost estimates. Router cutting, verified mounting and physical fit remain unimplemented/unvalidated. Earlier future-tense notes above describe the original brief.
