# Desktop cleaner requirements

Last updated: 2026-10-04. These are design requirements and questions, not achieved capabilities.

## Accepted direction

| Requirement | Status |
| --- | --- |
| Desktop-sized robot with humanoid upper body | Accepted direction; dimensions unresolved |
| Wheeled mobility is acceptable | Accepted; two walking legs are not required |
| No customer-owned 3D printer or workshop | Required; manufactured parts and necessary tools must be included |
| Cleaning while the user is away | Eventual release objective; supervised development first |
| Return to charge when battery is low | Required objective; charging must be positively detected |
| Access between furniture with 5–15 cm height differences | Requested experimental capability |
| Furniture surfaces are separated by gaps | Confirmed; gap width and landing space unknown |
| Low total cost and repeatable assembly | Core objective; budget ceiling unresolved |
| LeRobot integration | Must be demonstrated on pinned software and hardware revisions |

## Cleaning task to define

Specify whether the first task is dust collection, wiping, rubbish collection, or tidying designated objects. A previous proposal was moving lightweight designated objects into a tray; this is not a final cleaning specification. Wet cleaning, liquids, and arbitrary-object disposal are not established scope.

## Mobility and anchoring candidates

Climbing flippers, lifting mechanisms, and installed/deployable bridges remain alternatives. No crossing mechanism has been selected. Gap width, surface strength, friction, clearance, and available landing area must be measured before choosing one.

Actively controlled silicone vacuum cups are a candidate for anchoring. They may improve attachment but do not increase actuator strength. Seal quality, lateral slip, peeling, leak rate, dust sensitivity, power use, and release behavior require physical tests. Independent pressure measurements and isolation between cups should be evaluated. Vacuum readings alone do not establish a safe load transfer.

## Open parameters

Prototype budget; robot mass and dimensions; reach and payload; exact task; surface materials; gap widths; landing clearance; cleaning consumables; noise; runtime; charging time; tools included; repair targets; and whether an installed bridge is acceptable.

Do not freeze a parts list or promise unattended furniture crossing until the necessary evidence exists.
