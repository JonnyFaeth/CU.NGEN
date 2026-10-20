# CU Lantern mobile 0.4

Phone-first static web app and CU quote preview, targeting Safari on iPhone 16 Pro. No paid API or external runtime dependencies. Source is public; the first hosted review is owner-private.

Run `python scripts/build_mobile.py`, then serve `dist/mobile` with any local HTTP server. Production installation requires HTTPS. Open the hosted link in Safari, Share, Add to Home Screen. This is not a native iOS binary and does not expose LiDAR. Physical iPhone validation is pending.

## Working flow

Camera/library input -> four reference corners plus 4–12 outline points -> front/side estimates -> physical dimensions -> three regenerated styles -> CU cost preview -> review and locally export a kit specification. Save/open projects and download illustrated assembly instructions. Photos never leave the device. No address or payment information is collected. No order is submitted by saving a specification.

The quoted base uses full purchased materials from the existing engine, with a documented $2.49 Lowe's wood substitution. See `projects/cu-lamps/PROCUREMENT.md`. This is conservative per-kit purchasing, not bulk CU manufacturing cost. All prices remain dated listings; no live supplier integration. Fabrication, packaging, handling, shipping and tax begin unquoted. The visible estimate includes 10% of known materials/fabrication/packaging/handling; shipping and tax do not receive the markup. Unknown costs are never silently treated as zero. Detailed lines are collapsed initially.

CU markup is not guaranteed net profit. Merchant fees, returns and other business expenses still need a real operational model. User confirmed that this release should implement app/quote flow first; payment and fulfillment accounts do not exist yet.

## Measurement boundaries

Reference corners are marked clockwise. The homography corrects only the reference plane. A 3D lamp can protrude out of that plane; images do not prove hidden depth, dimensions or heat clearance. Two physical dimensions of the reference and manual confirmation remain required. The maximum front/side height estimate is retained to avoid shrinking the envelope when the second view is shorter. Low-resolution/degenerate reference marks are rejected.

The public-domain lamp photo exercises loading and marking only. Known synthetic affine/projective fixtures test the calculation. No physical accuracy claim follows from these tests.

## Release status

The kit checkout is deliberately closed. Requests are downloaded locally and explicitly unsubmitted. Before enabling commerce: validated physical kit, confirmed sourcing and labor, CU fulfillment, merchant account, order backend and final delivery/tax quote. The client-side estimate must never be trusted as the charge amount in a future payment integration.

No real phone camera, Safari installation, physical prototype or lit-use testing has been completed by this software build. The UI and known-dimension math can be tested without claiming those results.

## Version 0.4 changes

Outline marking and provisional reference-quality checks replace two bounding corners in the phone UI. The legacy measurement API is retained to reproduce the historical benchmark. The comparison did not establish better 3D accuracy; see `simulations/COMPARISON.md`. Complete HTML kit exports require ruler confirmation and include matched quote lines, cut allocation, numbered front/back diagrams and assembly steps. A synthetic fixture package is supplied for review, not as evidence of a physical build.
