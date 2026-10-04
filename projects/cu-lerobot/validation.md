# Validation plan

All stages are proposed. There are no test results yet. Define acceptance thresholds before collecting results and retain unsuccessful trials.

## 1. Feasibility

Measure a representative route and define the first cleaning task. Estimate loads, stability, reach, continuous actuator demand, power draw, thermal limits, and component clearances. Evaluate ratings at the intended duty cycle, not only stall torque. Record unknowns and margins.

## 2. Component bench tests

Secure a representative actuator/drive mechanism and measure positional error, heating, wear, and faults over repeated sessions. If vacuum is retained, test clean and dusty surface samples for attachment success, lateral slip, peel resistance, leak-down, release, marking, and energy use. Start with one instrumented cup before testing multiple anchors.

## 3. Bounded-surface mobility and cleaning

Use a supervised, protected work area. Predefine object/debris type, placement, target cleanliness or placement accuracy, timeout, and intervention rules. Report success rates with trial counts and uncertainty. Verify behavior around obstacles, movable objects, and edges.

## 4. Charging

Test approach, alignment, electrical contact, actual charge detection, low-battery thresholds, missed approaches, blocked docking, and the response when the dock cannot be reached. Use battery/charging protections independent of the learned policy. An arrival at the dock is not a successful charging event unless charging is confirmed.

## 5. Surface transitions

Test rising and descending at 5, 10, and 15 cm only after selecting a feasible geometry and specifying gap width. Begin with a support/catch rig. Measure tipping, slipping, structural deflection, energy use, and repeatability. Define recovery on attachment loss and communication failure. Test intentional transitions separately from accidental edge encounters.

## 6. LeRobot workflow

Pin software/firmware revisions. Verify connection, calibration persistence, observation/action units, bounds, camera dimensions, timestamps, dataset recording/reload, supervised replay, and a trained policy. Record dropped samples and latency. Mock tests demonstrate software contracts only.

## 7. Independent reproduction and unattended release

A second builder uses the published kit inventory and instructions without workshop access. Record assembly time, total delivered cost, substitutions, repairs, and help required. Repeat applicable tests. Unattended operation requires a separate documented release assessment; a few successful demonstrations are insufficient.

## Evidence format

Record configuration ID, component/firmware revisions, software commit, calibration version, test protocol, environment, trial outcomes, raw measurements, interventions, and failures. Publish only permission-cleared data; remove personal information from recordings.
