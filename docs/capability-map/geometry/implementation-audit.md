# Geometry implementation audit

This is the canonical audit entry point for the Geometry surface.

The dated evidence log retained from the previous flat layout is
[archive/implementation-audit-legacy.md](./archive/implementation-audit-legacy.md).
The current expected-versus-observed result is maintained in
[reconciliation.md](./reconciliation.md), while the maintainer-facing status
view is [status-matrix.md](./status-matrix.md). The archived log is historical
evidence and must not be read as proof of current CI, registry, deployment, or
runtime status. The bounded implementation selection derived from this audit is
recorded in the [implementation-gap backlog](./implementation-gap-backlog.md#triage-decision--task-triage-remaining-geometry-gaps--9052928134),
with its acceptance contract in the [locked contract matrix](./implementation-gap-backlog.md#locked-contract-and-acceptance-matrix--task-lock-geometry-contracts-and-acceptance--9052928134);
selection is not implementation evidence.

## Current audit run — 2026-11-03

This refresh audits the expected catalog against the package boundary and the
available workspace evidence. It does not treat a missing search hit as proof
of absence: status decisions below use executable package tests, source-level
behavior, fixture manifest status, and the ownership/reconciliation records.
The expected catalog status column is synchronized to this audit run: 40 IDs,
17 `✔️`, 23 `🌗`, and 0 `❌`; `not-verified` remains an evidence qualifier.

### Direct package evidence

| Check | Result | Evidence qualification |
| --- | --- | --- |
| `pnpm test` from `geometry/` | PASS — 5 files, 88 tests | Fresh local package behavior; covers intersections, selectors, curve sampling, path modifiers, split, transforms, bbox utilities, normalization, and stable errors. |
| `pnpm lint` from `geometry/` | PASS | Fresh TypeScript static check. |
| `pnpm run build` from `geometry/` | PASS | Fresh TypeScript/tsup package build; no registry or publish claim. |
| `pnpm test` from `core/` | PASS — 48 files, 452 tests | Fresh local consumer/projection/replay integration; not a canonical Node-24 run. |
| `pnpm test` from `cli/` | PASS — 1 file, 24 tests | Fresh CLI canonical semantic JSON and repeated-process evidence. |
| `node scripts/run-conformance-fixtures.mjs` | PASS — 298/298 across 23 fixtures | Fresh workspace fixture/conformance evidence; active/candidate/error status remains governed by `fixtures/manifest.json`. |
| Package metadata | `@relgeo/geometry@0.5.0`, DSL compatibility line `0.5` | `geometry/package.json`, `geometry/README.md`, and compatibility metadata agree locally. |
| Fixture manifest | 0.5 active fixtures include 10 and 15; 16 is `capability`; 19/20 are runtime-error fixtures | Manifest/expected-artifact review only in this refresh; fixture status is not inferred from package tests. |
| Runtime/platform evidence | Node `v22.23.2`; Node `>=24`, Flutter host, registry, remote CI, browser visual runtime, and cross-platform replay not rerun | `not-verified`, not a target failure and not a reason to relabel a capability `❌`. |

### Status decisions for the active bounded selection

| Capability/finding | Status | Observed implementation/evidence | Remaining boundary or limitation |
| --- | --- | --- | --- |
| `FIX-GEO-PROVENANCE-001` | `✔️` | `geometry/src/intersection.ts` now uses the RelGeo DSL `0.5` compatibility wording, and the unsupported-pair regression test asserts that stale `v0.3` text is absent. | Package-local fix is evidenced; consumer error-message refresh is outside this low-level task. |
| `GEO-QUERY-004` / `GAP-GEO-QUERY-004` | `✔️ bounded` | Pair/selector matrix, deterministic sort/deduplication, invalid/empty/multiple/unsupported cases, and fixture 15 pass locally. | Broader sampled path pairs and full DSL cross-consumer promotion remain outside this boundary. |
| `GEO-NUM-001` / `GAP-GEO-NUM-001` | `✔️ bounded` | Tolerances are implemented in intersection, split, path modifiers, and normalization; 88 geometry tests pass with boundary assertions. | No universal cross-runtime epsilon or public DSL error-bound claim. |
| `GEO-NUM-002` / `GAP-GEO-NUM-002` | `✔️ bounded` | `normalizeClosedShape` handles supported rect/circle/polygon/path/boolean inputs, removes near-duplicate/closing points, preserves holes, and applies clone transforms. | Broader union/xor/non-rectangle topology remains deferred by decision 08. |
| `GEO-NUM-003` / `GAP-GEO-NUM-003` | `✔️ bounded` | `GeometryError` and tests cover corner, offset, self-intersection, split, closed-shape, selector, and unsupported-pair failures. | Broader cross-consumer diagnostic catalog and document-path mapping remain core-owned follow-up. |

### Implementation task evidence — 2026-11-04

The first implementation slice for the triaged Geometry gaps is intentionally
recorded separately from the status join:

| Capability | Source change | Executable evidence | Contract limitation |
| --- | --- | --- | --- |
| `GEO-PRIM-003` | `geometry/src/intersection.ts` now adaptively flattens quadratic and cubic segments with bounded de Casteljau subdivision before line/curve and curve/curve approximation dispatch. | `geometry/src/__tests__/geometry-contract.fixture.ts` adds tolerance-bounded curve cases; `intersection.test.ts` adds quadratic crossing, cubic crossing, and degenerate quadratic/cubic failure cases; local package run passes 5 files/91 tests, lint, and build. | Existing supported pair/selector contract and DSL `0.5` error codes remain unchanged; this does not promote broader boolean, Flutter, Node 24, or registry evidence. |

This is implementation evidence for the slice only. The reconciliation status
remains `🌗 partial` until the downstream contract and consumer validation tasks
complete their acceptance evidence.

### Implementation task evidence extension — 2026-11-04

| Capability | Source change | Executable evidence | Contract limitation |
| --- | --- | --- | --- |
| `GEO-PRIM-005` / `GEO-MEASURE-004` | Component parameter resolution now uses a local dependency order for defaults and instance overrides; validator scope permits only the referenced component's declared parameters/derived values in instance `params`. | `core/src/__tests__/component.test.ts` exercises reverse-order `base → width → height` overrides and resolved component geometry; core test run passes 48 files/470 tests and lint. | This closes only local TypeScript/core scope behavior. It does not promote cross-runtime parity or broaden component exports/public syntax. |
| `GEO-QUERY-002` | `pointAt`, `tangentAt`, and `normalAt` now reject non-finite/out-of-range `t` values; tangent/normal reject zero-length paths rather than returning a fallback direction. | `core/src/__tests__/tangent_normal.test.ts` adds endpoint-domain and degenerate-path assertions; core test run passes 48 files/472 tests and lint. | Existing valid endpoint/curve results remain unchanged; error wording is normalized through the existing evaluator boundary and no parity claim is made. |
| `GEO-COLL-002` | Closed-target `repeat.along` with `uniform-t` now excludes `t=1`, preventing endpoint duplication while retaining open-target endpoint semantics. | `core/src/__tests__/repeat_divide.test.ts` adds a closed polygon traversal fixture; core test run passes 48 files/473 tests and lint. | This is local core behavior only; fixed-distance and cross-runtime replay remain unverified boundaries. |
| `GEO-CONSTRAINT-001` | Relation validation now reports structured violations for degenerate/non-finite parallel or perpendicular lines and degenerate tangent inputs instead of treating them as valid. | `core/src/__tests__/constraints_diagnostics.test.ts` covers zero-length line parallelism and zero-radius tangent input; core test run passes 48 files/474 tests and lint. | Post-resolve diagnostics remain the boundary; this does not add a solver or change the public constraint syntax. |
| `GEO-MEASURE-002` | Typed `length` and `point` validation now accepts the supported `in` unit and rejects malformed numeric literals using one strict local grammar. | `core/src/__tests__/parameter_type_validation.test.ts` covers inch length/point values and malformed `10..5mm`; core test run passes 48 files/476 tests and lint. | This closes the bounded TypeScript/core validation boundary only; normalization behavior, Flutter parity, and host evidence remain separate. |
| `GEO-PLACE-001` | `place.inside` now enforces the normative rect-container boundary and rejects negative/non-finite margins with structured resolve errors. | `core/src/__tests__/v02_final_verification.test.ts` covers a non-rect target and negative margin; core test run passes 48 files/477 tests and lint. | Existing valid rect placement and child dimensions are preserved; cross-consumer placement parity remains pending. |
| `GEO-QUERY-001` | Measurement queries now account for resolved holes in closed-shape area/perimeter and support area over resolved boolean loops. | `core/src/__tests__/evaluator.test.ts` asserts area 9600 and perimeter 480 for a 100×100 panel with a 20×20 hole; core test run passes 48 files/478 tests and lint. | Curved-boundary measurements retain the existing deterministic approximation; broader consumer parity remains pending. |
| `GEO-OBJ-001` | Dependency cycle diagnostics are now canonicalized by rotating the cycle to its lexicographically smallest node, making error paths stable across object declaration order. | `core/src/__tests__/dependency_v03.test.ts` compares two insertion orders and expects the same `A -> B -> A` path; core suite and lint pass after the change. | This stabilizes local graph diagnostics only; duplicate-key parser behavior and cross-runtime replay remain separate evidence. |
| `GEO-XFORM-002` | Operation resolver now rejects non-finite translation/rotation/scale/origin values before exposing a transform-bearing result node. | `core/src/__tests__/resolver.test.ts` covers an infinite translation expression; core suite and lint pass after the change. | Existing operation chaining/order and public syntax remain unchanged; cross-consumer transform parity remains pending. |
| `GEO-COLL-003` | Grid resolver now enforces finite positive pitch and finite non-negative gap at runtime, including editor-mode resolution. | `core/src/__tests__/repeat_grid_revisi.test.ts` covers negative pitch and infinite gap; core suite and lint pass after the change. | Pitch/gap exclusivity and over-constraint policy remain as existing validator contracts; collection syntax is unchanged. |
| `GEO-COLL-001` | Polar repeat now enforces a positive finite radius at runtime before creating collection members. | `core/src/__tests__/repeat_divide.test.ts` covers negative radius while resolving in editor mode; core suite and lint pass after the change. | Valid polar ordering and item context are unchanged; broader collection parity remains pending. |
| `GEO-COLL-004` | Divide resolver now rejects fractional and non-finite counts instead of rounding or entering an unbounded loop. | `core/src/__tests__/repeat_divide.test.ts` covers count `2.5` and `Infinity` in editor mode; core suite and lint pass after the change. | Existing divide ordering, endpoint semantics, and child identity remain unchanged. |
| `GEO-COLL-002` | Along-repeat offsets now require finite non-negative distances and a non-negative remaining path length before collection members are resolved. | `core/src/__tests__/repeat_divide.test.ts` covers a negative `startOffset` in editor mode; core suite passes 48 files/484 tests. | Valid offset and spacing behavior is unchanged; fixed-distance replay and cross-consumer parity remain separate evidence boundaries. |
| `GEO-XFORM-002` | Split lowering now recursively resolves nested operation targets before applying each transform, preserving transform order for chained operations. | `core/src/__tests__/split.test.ts` covers translate→rotate→split and verifies both resulting path pieces; core suite passes 48 files/485 tests. | Existing split tolerance and operation syntax remain unchanged; closed-path splitting and cross-consumer parity remain pending. |
| `GEO-PRIM-004` | Text resolution now honors the normative v0.5 implicit center anchor while retaining legacy pre-v0.5 top-left behavior; SVG semantic projection includes text content and anchor in addition to measured geometry. | `core/src/__tests__/v02_preview.test.ts` covers legacy/v0.5 defaults; `renderer-svg/src/__tests__/semantic_projection.test.ts` covers content/anchor projection. Core suite passes 48 files/486 tests; renderer semantic suite passes 7 files/91 tests. | Schema version stays 1; renderer-specific glyph metrics and raw SVG styling/bytes remain outside the semantic contract. |
| `GEO-PLACE-002` | `frameAt` now rejects non-finite parameters before range checking/clamping, preventing `Infinity` from silently resolving to the endpoint. | `core/src/__tests__/frame_placement.test.ts` covers an infinite scalar parameter; core suite passes 48 files/487 tests. | Valid frame point/tangent/normal/orientation behavior is unchanged; cross-consumer parity remains pending. |
| `GEO-PRIM-004` | SVG semantic projection now derives a closed ring from point-authored closed paths/polygons when resolved segments are absent, including the closing edge and an empty-segment fallback. | `renderer-svg/src/__tests__/semantic_projection.test.ts` covers a four-point closed path without `segments`; renderer suite passes 7 files/92 tests and lint. | Existing resolved-segment rings remain unchanged; curved path reconstruction, raw SVG output, and cross-consumer parity remain outside this slice. |
| `GEO-COLL-005` | Repeat child identity generation is centralized in a deterministic coordinate-based helper, preserving declaration order and stable IDs for linear, polar, along, each, and grid modes. | `core/src/__tests__/projection.test.ts` resolves the same repeat document twice and asserts identical `children`, generated IDs, and canonical serialized scenes; core suite passes 48 files/488 tests and lint. | This proves same-input local replay only; Node 24, Flutter, and cross-platform process parity remain external evidence. |

### Boundary findings retained from the full catalog audit

- `GEO-BOOLEAN-001/002` remain `🌗`; broader union/xor/non-rectangle topology
  is a separate `⏸️` promotion finding, not active implementation evidence.
- Core-owned queries, collections, placement, constraints, and resolver
  semantics remain consumer ownership boundaries; geometry package types or
  helpers do not prove a complete DSL implementation.
- Fixture 15 is the active bounded boolean/intersection evidence. Fixture 16
  remains a capability candidate, and Flutter/registry/Node-24/remote-CI
  evidence remains `not-verified`.
- The expected catalog still has 40 IDs joined one-to-one by reconciliation;
  the status matrix now has 17 `✔️`, 23 `🌗`, and 0 `❌` rows. `➖` and
  `⏸️` findings remain outside the row join; the selected provenance finding is
  now locally resolved and is no longer an open `⚠️` defect.
