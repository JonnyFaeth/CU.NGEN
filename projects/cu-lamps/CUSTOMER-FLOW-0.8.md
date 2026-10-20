# Customer flow 0.8

2026-10-20. Customer journey: Your light -> Designs -> Your kit -> Prepare quote request. Checkout stays unavailable pending physical and operational validation.

- Three named geometric previews (Quiet, Horizon, Terrace) use the same fixture envelope, with paper infill shown. Selection changes the actual panel geometry and exports.
- Proportions, pattern and stock choices update the selected design and known subtotal. Matching material costs are not presented as proof of matching fabrication costs; each card shows its cut perimeter.
- Save/restore retains one project on the device, without photos. Restore is available before entering a new capture; invalid saved records report errors rather than changing the active design.
- Preparing a request downloads the exact selected prototype files plus a JSON review record and plain-language quotation brief. It does not transmit a request or place an order.
- No model-number or wattage form is imposed on the customer. CU's review checklist owns fixture identification, light-source suitability, mounting, fabrication and fulfillment. Follow-up questions should be targeted only to unresolved evidence.
- An outdated $21.06 source-link label was corrected to the current $9.99 reference used by the estimator. Source prices remain dated references, not a live supplier feed.

Validation: 39 automated tests passed; six journey/export tests were repeated after final preview and restore refinements. Browser testing entered the approximate 15.5 x 9 inch case, selected Terrace, saved, reloaded and restored the same dimensions and $76.96 known subtotal. A 393 x 852 viewport check showed no horizontal overflow. This does not validate actual iPhone camera behavior, installation or physical fabrication.

Remaining release work is tracked in [FIRST-KIT-RELEASE.md](FIRST-KIT-RELEASE.md). The app still needs real submission/fulfillment services and a payment account before the review step can become checkout. A physical first article, qualified attachment and approved complete delivered price are required before customers can order a kit.
