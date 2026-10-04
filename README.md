# CU.NGEN — Custom Engine

CU.NGEN is CU's public workspace for designing affordable, reproducible systems around the job a person needs done.

Founded by **Jonathan D Faeth**, it brings together two project tracks:

| Project | Focus | Current status |
| --- | --- | --- |
| [CU Homie](projects/cu-homie/README.md) | A CU product track to be defined from its existing work | Scope and implementation inventory pending |
| [CU LeRobot](projects/cu-lerobot/README.md) | An affordable desktop cleaning robot designed for integration with Hugging Face LeRobot | Requirements and feasibility planning |

**Current status: design-stage project.** This repository contains specifications and planning documents, not a working configuration engine, tested robot, validated parts list, or product available to order.

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
