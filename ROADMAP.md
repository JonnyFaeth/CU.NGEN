# Roadmap

Milestones describe planned work. Unchecked items are not delivered capabilities.

## 0. Public project foundation

- [x] Establish CU.NGEN as the umbrella for CU Homie and CU LeRobot.
- [x] Document current requirements, uncertainty, and evidence standards.
- [x] Add contribution and proposal templates.
- [ ] Select reuse licenses for original software, documentation, and hardware.
- [ ] Inventory CU Homie's existing work with its owner.

## 1. Define a feasible desktop robot

- [ ] Measure one representative furniture route: gap width, rise, landing area, edge geometry, and surface material.
- [ ] Set the prototype budget, size, mass, payload, runtime, and noise limits.
- [ ] Define the first cleaning task and its success criteria.
- [ ] Compare wheeled mobility, climbing supports, and optional vacuum anchoring.
- [ ] Produce a sourced cost and load budget, including delivered manufactured parts and all required tools.

## 2. Bench evidence

- [ ] Test a representative joint and drive system.
- [ ] Test charging hardware and dock confirmation independently of learned behavior.
- [ ] Test a single vacuum anchor if retained as a candidate.
- [ ] Select an architecture using measured results and explicit tradeoffs.

## 3. Supervised reference robot

- [ ] Demonstrate bounded-surface cleaning and stopping behavior.
- [ ] Demonstrate LeRobot calibration, recording, replay, and a trained policy.
- [ ] Demonstrate repeatable docking and recovery from missed docking.
- [ ] Evaluate surface transitions on a supported test rig.

## 4. Reproduction and configuration engine

- [ ] Have an independent builder reproduce the reference robot without workshop access.
- [ ] Publish versioned assembly instructions, exact parts, substitutions, costs, and failures.
- [ ] Implement a small catalog with deterministic compatibility checks.
- [ ] Recommend only configurations with evidence appropriate to the requested task.
- [ ] Establish unattended-operation release criteria before advertising that capability.

There are no committed release dates. Evidence and available resources determine progression.
