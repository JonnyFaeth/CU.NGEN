# CU.NGEN — Custom Engine

CU.NGEN is CU's public workspace for designing affordable, reproducible systems around the job a person needs done.

## Try Lantern Studio

[Ceiling mounting and supplier research](projects/cu-lamps/MOUNTING-AND-SOURCING.md) · [Sample fabrication quote package](procurement/ceiling-sample/README.md). Prepared for supplier review; no final kit price or approved ceiling mount yet.

**Current phone source 0.10:** [mobile app and CU quote-flow source](mobile/README.md). Includes experimental [Stray Scanner LiDAR import](projects/cu-lamps/STRAY-SCANNER.md), assisted ceiling capture, three generated design choices, saved projects, quote-review exports, an expandable cost breakdown and a 10% CU fee. Payment and fulfillment are not launched; kit specifications are saved locally, not submitted as orders.

[October 25 scan-to-kit validation review](simulations/REVIEW-2026-10-25.md): measurement benchmark, independent panel audits, stock-price comparisons and customer workflow tests. [Corrected supplier DXF/PDF package](procurement/ceiling-sample-compatible/README.md).

[Hosted phone review](https://cu-ngen-lantern.jbon3.chatgpt.site) (owner-private; sign-in required). [Older 0.6 mobile download](https://github.com/JonnyFaeth/CU.NGEN/releases/tag/mobile-v0.6.0). On iPhone, use the hosted link in Safari and Share → Add to Home Screen. Direct ZIP/HTML opening is not the iPhone installation path.

[Download the latest Lantern Studio release](https://github.com/JonnyFaeth/CU.NGEN/releases/tag/lantern-v0.2.0) or open [app/index.html](app/index.html) locally after downloading the repository. No installation, account or API key is needed. [App guide](app/README.md).

The first working app offers guided photo measurement, an orthogonal lantern-surround generator, sourced material prices, cut lists and illustrated assembly booklets. It is a prototype design tool: photos need ruler confirmation, quotes need checkout verification, and physical lamp safety is not certified.

Founded by **Jonathan D Faeth**, it brings together these project tracks:

| Project | Focus | Current status |
| --- | --- | --- |
| [CU Homie](projects/cu-homie/README.md) | A CU product track to be defined from its existing work | Scope and implementation inventory pending |
| [CU LeRobot](projects/cu-lerobot/README.md) | An affordable desktop cleaning robot designed for integration with Hugging Face LeRobot | Requirements and feasibility planning |
| [CU paper lamps](projects/cu-lamps/README.md) | Orthogonal Japanese-inspired paper lamps with reproducible build geometry | Offline Lantern Studio app and separate first-build plan; physical validation pending |

**Current status: design and prototype software.** The paper-lamp track includes a working geometry and material estimator. The repository does not yet contain a physically validated lamp or robot, a validated purchasing recommendation, or a product available to order.

## What we are building toward

The proposed Custom Engine takes a task, budget, environment, and available resources, then recommends compatible components and a build plan supported by evidence. It should identify the least expensive configuration that meets explicit requirements among the configurations evaluated. It must report when no validated match exists.

Customers should be able to assemble future kits without a workshop or 3D printer. CU also intends to explore paid assembly, calibration, testing, and support. These are planned services; no prices or delivery commitments are established.

## Start here

- [Roadmap](ROADMAP.md)
- [Engine specification](docs/engine-spec.md)
- [CU LeRobot requirements](projects/cu-lerobot/requirements.md)
- [Validation plan](projects/cu-lerobot/validation.md)
- [Decision record](docs/decisions.md)
- [How to contribute](CONTRIBUTING.md)

CU is independent of Hugging Face and the LeRobot maintainers. Integration is a development objective, not an endorsement or a claim of current compatibility.

## Licensing and project conduct

This repository is public, but a reuse license has not yet been selected. See [licensing status](LICENSING.md) before reusing material. Software, documentation, and future hardware designs may require different licensing decisions.

Contributions and discussions should be respectful, specific, and evidence-based. Disclose substantial AI assistance and distinguish proposed capabilities from demonstrated results.

Latest evaluation: [capture comparison](simulations/COMPARISON.md). Automatic 3D measurement remains unresolved; kit exports now require user-confirmed dimensions. [Synthetic example package](simulations/example-kit/kit.html).

New in 0.5: [assisted ceiling capture](simulations/CEILING-CAPTURE.md) with local OpenCV rim suggestions, editable outline, mm/inch entry and confirmed-dimension export. [Scanning projects evaluated](projects/cu-lamps/SCANNING-RESEARCH.md). Version 0.6 adds [five-panel CNC laser geometry and parts estimates](projects/cu-lamps/PANEL-GENERATOR.md); physical fit and mounting remain unverified.


### Integrated iPhone capture (0.11 prototype)
Native ARKit capture now feeds CU�s guided measurement and design workflow directly, without a separate scanner app. [Native build and device validation instructions](ios/README.md). iPhone signing and real-device accuracy validation remain outstanding; the hosted web app cannot access LiDAR.
