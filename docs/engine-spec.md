# Custom Engine: initial specification

Status: proposed design; no engine implementation yet.

## Inputs

Task and success criteria, environment, budget and currency, user location for delivery estimates, available tools, assembly preference, payload/reach, runtime, acceptable maintenance, and required sensing.

Only collect the location detail necessary for pricing. Personal customer information does not belong in this public repository.

## Catalog records

Each component needs an exact model and revision, manufacturer documentation, source URL, price date and currency, availability, dimensions and mass, interfaces, ratings, and replacement options. Unknown values remain unknown.

Each configuration needs a versioned parts list, quantities, mechanical/electrical connections, calibration procedure, software revision, measured operating limits, test references, and known failures.

Evidence levels apply to individual claims: **proposed, calculated, bench-tested, robot-tested, independently reproduced**. A simulation or mock test is not physical validation.

## Selection rules

1. Reject known incompatibilities and violations of required limits.
2. Treat missing critical information as unresolved, never as a pass.
3. Filter configurations by task-specific test evidence.
4. Compare total cost among qualifying configurations; show assembly time, maintenance, and evidence strength separately.
5. Return “no validated match” when appropriate.

Start with curated configurations and explicit rules. Do not invent parts, ratings, prices, or compatibility to complete an answer.

## Cost accounting

Include parts, manufactured structures, fasteners, power system, charger/dock, sensors, computing, required tools, shipping, taxes where known, and explicit contingency. Distinguish purchased tools from recurring build costs.

A future CU assembly quote would separately account for labor, calibration, testing, failed parts/prints, packaging, support, and margin. No such quote is currently available.

## Deliverable

A recommended configuration with its task limits, itemized bill of materials, dated evidence, unresolved costs, assembly guide, and tested alternatives. Availability or price changes require revalidation. Compatibility with one LeRobot workflow does not establish compatibility with every policy or dataset.
