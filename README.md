# CU.NGEN — Custom Engine

CU.NGEN is CU's public workspace for designing affordable, reproducible systems around the job a person needs done.

## Try Lantern Studio

**Phone edition 0.3:** [mobile app and CU quote-flow source](mobile/README.md). Includes camera/library capture, perspective-reference measurement, three generated design choices, an expandable cost breakdown and a 10% CU fee. Payment and fulfillment are not launched; kit specifications are saved locally, not submitted as orders.

[Hosted phone review](https://cu-ngen-lantern.jbon3.chatgpt.site) (owner-private; sign-in required). [Mobile download](https://github.com/JonnyFaeth/CU.NGEN/releases/tag/mobile-v0.3.0). On iPhone, use the hosted link in Safari and Share → Add to Home Screen. Direct ZIP/HTML opening is not the iPhone installation path.

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
