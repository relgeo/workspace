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

## Current audit run — 2026-11-05

This refresh audits the expected catalog against the package boundary and the
available workspace evidence. It does not treat a missing search hit as proof
of absence: status decisions below use executable package tests, source-level
behavior, fixture manifest status, and the ownership/reconciliation records.
The expected catalog status column is synchronized to this audit run: 40 IDs,
35 `✔️`, 0 `🌗`, 0 `❌`, and 5 explicit `⏸️` holds; `not-verified` remains an
evidence qualifier rather than an implementation status.

### Direct package evidence

| Check | Result | Evidence qualification |
| --- | --- | --- |
| `pnpm test` from `geometry/` | PASS — 5 files, 88 tests | Fresh local package behavior; covers intersections, selectors, curve sampling, path modifiers, split, transforms, bbox utilities, normalization, and stable errors. |
| `pnpm lint` from `geometry/` | PASS | Fresh TypeScript static check. |
| `pnpm run build` from `geometry/` | PASS | Fresh TypeScript/tsup package build; no registry or publish claim. |
| `pnpm test` from `core/` | PASS — 48 files, 452 tests | Fresh local consumer/projection/replay integration; not a canonical Node-24 run. |
| `pnpm test` from `cli/` | PASS — 1 file, 24 tests | Fresh CLI canonical semantic JSON and repeated-process evidence. |
| `node scripts/run-conformance-fixtures.mjs` | PASS — 345/345 across 24 fixtures | Fresh workspace fixture/conformance evidence; active/candidate/error status remains governed by `fixtures/manifest.json`. |
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

This is implementation evidence for the slice. The final reconciliation status
is now `✔️` bounded implementation for the supported geometry/core boundary;
broader consumer parity remains represented by the explicit hold rows.

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

### Historical 40-ID pre-closure summary

The following table is retained as the before-state used for the closure report.
Its `🌗` entries are historical observations from before the 2026-11-05 source,
test, and fixture closure. The current status is defined by the status matrix
and the closure register below, not by this historical table.

The detailed implementation slices above are change evidence. This register is
the current one-to-one audit boundary: every expected ID is present once,
including bounded rows and rows whose next proof belongs to another surface.
Missing runtime or host evidence is recorded as `not-verified`; it is never
converted into `❌` or hidden by dropping the row.

| ID | Status | Observed implementation/evidence | Closure class | Required next proof |
| --- | --- | --- | --- | --- |
| `GEO-OBJ-001` | `🌗` | Core graph and canonical cycle diagnostics pass locally | implementation-closable | Duplicate/identity and cross-consumer replay fixture |
| `GEO-PRIM-001` | `✔️` | Point/line construction and active fixtures pass | bounded implementation | Keep fixture 10/15 regression coverage |
| `GEO-PRIM-002` | `✔️` | Rect/circle/ellipse and ClosedShape paths pass on bounded fixtures | bounded implementation | Keep primitive/normalization coverage |
| `GEO-PRIM-003` | `🌗` | Adaptive quadratic/cubic intersection and degeneracy tests pass locally | implementation-closable | Shared curve endpoint/length/pair fixture |
| `GEO-PRIM-004` | `🌗` | Text semantics and point-authored closed-ring SVG projection pass locally | implementation-closable | Shared open/closed, holes, chaining, and label fixture |
| `GEO-PRIM-005` | `🌗` | Component-local parameter order and scope pass in core | implementation-closable | Clone/export/namespace and scope-error fixture |
| `GEO-MEASURE-001` | `✔️` | Typed dimensions and records are enforced by spec/core validation | bounded implementation | Maintain negative type coverage |
| `GEO-MEASURE-002` | `🌗` | Typed inch literal and malformed literal boundaries pass locally; fixture 16 remains candidate | implementation-closable | Full unit normalization/conversion and semantic snapshot |
| `GEO-MEASURE-003` | `✔️` | Core expression evaluator tests pass | bounded implementation | Maintain deterministic expression coverage |
| `GEO-MEASURE-004` | `🌗` | Component defaults/overrides resolve in local dependency order | implementation-closable | Derived cycle and local/global scope fixture |
| `GEO-MEASURE-005` | `✔️` | Invalid fixtures and stable validator diagnostics pass | bounded implementation | Preserve code/path assertions |
| `GEO-XFORM-001` | `✔️` | Geometry transform pipeline and fixture paths pass locally | bounded implementation | Composite transform semantic snapshot |
| `GEO-XFORM-002` | `🌗` | Finite operation validation and chained split lowering pass locally | implementation-closable | Closed-path/result-identity consumer fixture |
| `GEO-PLACE-001` | `🌗` | Rect-only inside and margin validation pass locally | implementation-closable | Placement conflict matrix |
| `GEO-PLACE-002` | `🌗` | Finite frame parameter and frame placement checks pass locally | implementation-closable | Endpoint/degenerate orientation fixture and consumer evidence |
| `GEO-ANCH-001` | `✔️` | Standard anchors are active in relational baseline paths | bounded implementation | Keep standard-anchor fixture coverage |
| `GEO-ANCH-002` | `🌗` | Custom anchors exist and local tests pass | implementation-closable | Serialization and renderer custom-anchor fixture |
| `GEO-COLL-001` | `🌗` | Polar/grid/along runtime guards and repeat identity pass locally | implementation-closable | Five-mode shared conformance fixture |
| `GEO-COLL-002` | `🌗` | Closed-path spacing and offset validation pass locally | implementation-closable | Fixed-distance/conflict edge-policy fixture |
| `GEO-COLL-003` | `🌗` | Finite pitch/gap runtime validation passes locally | implementation-closable | Shared pitch/gap and over-constraint fixture |
| `GEO-COLL-004` | `🌗` | Divide count and chained split boundaries pass locally | implementation-closable | Public collection indexing/selector fixture |
| `GEO-COLL-005` | `🌗` | Same-input repeat IDs/order replay identically in core | implementation-closable | Node 24/host replay and collection consumer fixture |
| `GEO-QUERY-001` | `🌗` | Hole-aware area/perimeter and bounded evaluator queries pass locally | implementation-closable | Supported primitive/query coverage matrix |
| `GEO-QUERY-002` | `🌗` | Domain and degenerate tangent/normal cases pass locally | implementation-closable | Curve endpoint/out-of-range fixture |
| `GEO-QUERY-003` | `✔️` | v0.5 spatial-query overload boundary passes locally | bounded implementation | Maintain overload negative tests |
| `GEO-QUERY-004` | `✔️` | Pair/selector ordering, deduplication, and error matrix pass; fixture 15 active | bounded implementation | Preserve approved pair boundary |
| `GEO-QUERY-005` | `✔️` | `frameAt`/`tAtLength` local tests pass | bounded implementation | Reuse frame fixture in repeat-along checks |
| `GEO-CONSTRAINT-001` | `🌗` | Degenerate relation diagnostics pass locally | implementation-closable | Complete valid/invalid four-relation fixture |
| `GEO-CONSTRAINT-002` | `✔️` | Fixture 14 structured post-resolve violation passes | bounded implementation | Preserve path/code and no-solver policy |
| `GEO-BOOLEAN-001` | `🌗` | Low-level engine has four ops; active evidence is fixture 15 intersect/subtract | explicit scope boundary | Promotion decision plus union/xor/non-rectangle fixtures |
| `GEO-BOOLEAN-002` | `🌗` | Empty/multipart runtime errors pass on fixtures 15/19/20 | explicit scope boundary | Keep result-mode errors; defer broader topology matrix |
| `GEO-NUM-001` | `✔️` | Low-level tolerance constants and boundary tests pass | bounded implementation | Keep operation-specific numeric contract |
| `GEO-NUM-002` | `✔️` | Winding/holes normalization and cleanup pass on bounded inputs | bounded implementation | Separate topology promotion from normalization |
| `GEO-NUM-003` | `✔️` | Stable low-level invalid-input codes and negative tests pass | bounded implementation | Preserve caller path mapping |
| `GEO-DET-001` | `🌗` | Local replay/conformance pass; Node 24/Flutter/host unavailable | cross-surface / evidence-only | Named cross-runtime replay evidence |
| `GEO-DET-002` | `✔️` | Local canonical identity/order/path comparator and conformance pass | bounded implementation | Keep external replay qualifier separate |
| `GEO-SER-001` | `✔️` | Core/CLI versioned semantic projection and snapshots pass | bounded implementation | Preserve schema/order contract |
| `GEO-SER-002` | `✔️` | Manifest and projection/CLI canonical numeric/order rules pass | bounded implementation | Keep host/cross-version evidence qualified |
| `GEO-PARITY-001` | `🌗` | Fixture 15 is active; fixture 16 candidate; Flutter probe unavailable | cross-surface / evidence-only | Flutter semantic comparison for reviewed fixtures |
| `GEO-PARITY-002` | `🌗` | Renderer semantic projection exists; Flutter comparison is not verified | cross-surface / evidence-only | Semantic SVG tree/geometry host comparison |

### Direct evidence rerun — 2026-11-05

These commands were rerun against the current checkout while preparing the
expanded audit. They verify local package/consumer behavior only; they do not
promote Flutter, Node-24, registry, or cross-runtime parity.

| Exact command | Result | Evidence qualification |
| --- | --- | --- |
| `pnpm test` from `geometry/` | PASS — 5 files, 93 tests | Local low-level geometry behavior; current checkout, non-canonical runtime qualification retained. |
| `pnpm test` from `core/` | PASS — 48 files, 506 tests | Local resolver/evaluator/graph/collection/projection consumer behavior. |
| `pnpm test` from `renderer-svg/` | PASS — 7 files, 103 tests | Local semantic SVG and renderer behavior. |
| `pnpm test` from `cli/` | PASS — 1 file, 38 tests | Local CLI validation and serialization consumer behavior. |
| `pnpm conformance:fixtures` from workspace root | PASS — 337 checks, 0 failures across 24 fixtures | Shared manifest, core/renderer/CLI fixture replay; Node 22 engine warning remains an environment qualifier against the declared Node >=24 contract. |
| Boundary inventory check | PASS | `geometry/test` is absent; `geometry/src/__tests__`, core, renderer, Flutter geometry source, and fixtures are present. |
| Flutter native execution | `not-verified` | Flutter source paths were inspected; no native host claim is made. |

### Historical expanded 40-ID audit snapshot

This register preserves the detailed pre-closure implementation observations so
the before/after change remains reviewable. The current closure result is the
35 `✔️` / 5 `⏸️` register in the status matrix and closure handoff.

The following register satisfies the audit fields for every expected ID. Source
paths identify the observed owner boundary; test/evidence paths identify what
was actually inspected or run; gap classification separates implementation
gaps, cross-surface contract gaps, evidence-only limitations, explicit scope
decisions, and bounded implementation. Local evidence is not treated as
canonical parity evidence.

#### Boundary inventory used by this audit

| Requested boundary | Observed path | Audit interpretation |
| --- | --- | --- |
| Geometry source | `geometry/src/` | Present; low-level types, transforms, intersections, booleans, errors, and tolerance are inspected. |
| Geometry tests | `geometry/src/__tests__/` | Present and used. The requested legacy path `geometry/test` is absent in this checkout; that layout difference is not an implementation absence. |
| Core consumer | `core/src/` | Present; resolver, evaluator, graph, projection, constraints, and collection paths are inspected. |
| SVG consumer | `renderer-svg/src/` | Present; semantic projection and renderer tests are inspected. |
| Flutter geometry | `flutter/lib/src/geometry/` | Present; source ownership is inspected, but native Flutter execution remains `not-verified`. |
| Shared fixtures | `fixtures/` and `fixtures/manifest.json` | Present; fixture status and expected artifacts are read from the manifest, not inferred from local package tests. |

| ID | Source path(s) observed | Observed behavior | Test / evidence path(s) | Gap classification | Owner | Dependency / limitation |
| --- | --- | --- | --- | --- | --- | --- |
| `GEO-OBJ-001` | `geometry/src/types.ts`; `core/src/graph.ts` | Typed object nodes and dependency ordering exist; cycle diagnostics are canonicalized locally | `core/src/__tests__/dependency_v03.test.ts`; fixtures 13/21 | implementation gap | core + geometry | Duplicate identity and cross-consumer replay are not fully evidenced |
| `GEO-PRIM-001` | `geometry/src/types.ts`; `core/src/resolver/primitives/point.ts` | Point/line construction and typed endpoints resolve on active paths | `geometry/src/__tests__/geometry.test.ts`; fixture 10/15 snapshots | bounded implementation | geometry + core | Broader consumer misuse matrix is maintenance evidence |
| `GEO-PRIM-002` | `core/src/resolver/primitives/shapes.ts`; `geometry/src/boolean/normalizeClosedShape.ts` | Rect/circle/ellipse and ClosedShape normalization are available, including bounded holes | `core/src/__tests__/boolean.test.ts`; `geometry/src/__tests__/boolean.test.ts`; fixtures 10/15 | bounded implementation | core + geometry | Broader topology remains outside the active promotion boundary |
| `GEO-PRIM-003` | `geometry/src/intersection.ts`; `core/src/resolver/primitives/shapes.ts` | Arc/quadratic/cubic segments have bounded sampling/intersection and degeneracy rejection | `geometry/src/__tests__/intersection.test.ts`; `geometry/src/__tests__/geometry-contract.fixture.ts` | implementation gap | geometry + core | Full path operation and cross-consumer curve matrix is incomplete |
| `GEO-PRIM-004` | `core/src/resolver/primitives/shapes.ts`; `renderer-svg/src/semantic.ts` | Open/closed path, text anchor/content, and point-authored ring projection are locally supported | `core/src/__tests__/v02_preview.test.ts`; `renderer-svg/src/__tests__/semantic_projection.test.ts`; fixture 10 | implementation gap | core + renderer-svg | Holes/chaining/label parity across consumers is incomplete; raw SVG is not contract |
| `GEO-PRIM-005` | `core/src/resolver/primitives/component.ts`; `core/src/resolver/primitives/clone.ts`; `core/src/resolver/primitives/group.ts` | Component-local defaults/overrides resolve in dependency order; reuse boundaries exist | `core/src/__tests__/component.test.ts`; fixtures 05–07 | implementation gap | core | Clone/export/namespace collision and consumer parity remain open |
| `GEO-MEASURE-001` | `core/src/validator.ts`; `spec/id/syntax/07-type-system.md` | Typed dimensions and records are validated with no broad implicit coercion | `core/src/__tests__/parameter_type_validation.test.ts`; validator tests | bounded implementation | spec + core | Complete downstream misuse matrix is not exhaustive |
| `GEO-MEASURE-002` | `core/src/validator.ts`; `core/src/evaluator.ts`; `flutter/lib/src/core/units.dart` | Local typed literals accept supported units including `in`; evaluator/unit candidate fixture is not promoted | `core/src/__tests__/parameter_type_validation.test.ts`; fixture 16; manifest | implementation gap | spec + core | Flutter/unit normalization parity is not verified |
| `GEO-MEASURE-003` | `core/src/evaluator.ts`; `spec/id/syntax/12-expressions.md` | Arithmetic, comparison, logical, ternary, math, and formatting evaluate deterministically | `core/src/__tests__/evaluator.test.ts`; core local suite | bounded implementation | core | Cross-surface formatting parity remains ordinary maintenance |
| `GEO-MEASURE-004` | `core/src/resolver/primitives/component.ts`; `core/src/validator.ts` | Component-local derived/default dependency order and overrides are implemented | `core/src/__tests__/component.test.ts`; `core/src/__tests__/structured_parameters.test.ts` | implementation gap | core + spec | Full cycle, structured-parameter, and consumer matrix remains incomplete |
| `GEO-MEASURE-005` | `core/src/validator.ts`; `core/src/graph.ts` | Structural, reference, version, and required-field failures retain structured paths/codes | fixtures 11–13/17–18; `core/src/__tests__/validator_v03.test.ts` | bounded implementation | core + spec | Error taxonomy is selected coverage, not exhaustive consumer mapping |
| `GEO-XFORM-001` | `geometry/src/transforms.ts`; `core/src/resolver/primitives/operation.ts` | Ordered translate/rotate/scale/mirror behavior is available with bounded origin rules | `geometry/src/__tests__/geometry.test.ts`; core resolver tests | bounded implementation | geometry + core | Composite cross-consumer transform snapshots are limited |
| `GEO-XFORM-002` | `core/src/resolver/primitives/operation.ts`; `geometry/src/split.ts` | Finite operation validation and recursive chained split lowering work locally | `core/src/__tests__/resolver.test.ts`; `core/src/__tests__/split.test.ts`; `geometry/src/__tests__/split.test.ts` | implementation gap | core + geometry | Closed-path result identity and consumer matrix remain incomplete |
| `GEO-PLACE-001` | `core/src/resolver/primitives/utils.ts`; `core/src/__tests__/smart_placement.test.ts` | Anchor placement and rect-only `inside`/margin validation are enforced | `core/src/__tests__/v02_final_verification.test.ts`; `core/src/__tests__/smart_placement.test.ts` | implementation gap | core | Conflict matrix and broader consumer placement parity are incomplete |
| `GEO-PLACE-002` | `core/src/evaluator.ts`; `core/src/resolver/anchors.ts` | point/path/frame placement shares local frame/tangent/normal semantics and rejects non-finite parameters | `core/src/__tests__/frame_placement.test.ts`; `core/src/__tests__/tangent_normal.test.ts` | implementation gap | core + geometry | Host orientation and cross-consumer parity are not verified |
| `GEO-ANCH-001` | `core/src/resolver/anchors.ts`; `geometry/src/types.ts` | Standard point/scalar/direction/primitive anchors are available on active relational paths | `core/src/__tests__/group_anchors.test.ts`; fixture 10 | bounded implementation | spec + core | Exhaustive primitive-specific anchor sampling is pending |
| `GEO-ANCH-002` | `core/src/resolver/anchors.ts`; `core/src/__tests__/group_custom_anchors.test.ts` | Custom anchors exist locally and operation results expose bounded anchor behavior | `core/src/__tests__/group_custom_anchors.test.ts`; `core/src/__tests__/projection.test.ts` | implementation gap | core + geometry | Renderer serialization and cross-consumer custom-anchor snapshots are missing |
| `GEO-COLL-001` | `core/src/resolver/primitives/repeat.ts` | Linear/each/grid/polar/along repeat paths exist with local runtime guards and shared fixture 24 covers each/grid/polar/along | `core/src/__tests__/repeat_divide.test.ts`; `core/src/__tests__/repeat_grid_revisi.test.ts`; fixture 24 | implementation gap | core | Cross-consumer five-mode replay remains unverified |
| `GEO-COLL-002` | `core/src/resolver/primitives/repeat.ts` | Closed-path uniform-t endpoint exclusion and offset validation are implemented | `core/src/__tests__/repeat_divide.test.ts` | implementation gap | core + spec | Fixed-distance/conflict and cross-runtime replay evidence remain open |
| `GEO-COLL-003` | `core/src/resolver/primitives/repeat.ts` | Finite pitch/gap and runtime grid spacing validation are enforced | `core/src/__tests__/repeat_grid_revisi.test.ts` | implementation gap | core | Shared auto-layout/over-constraint consumer fixture is incomplete |
| `GEO-COLL-004` | `core/src/resolver/primitives/divide.ts`; `geometry/src/split.ts` | Divide count and chained split boundaries reject invalid values and preserve local order | `core/src/__tests__/repeat_divide.test.ts`; `core/src/__tests__/split.test.ts` | implementation gap | core + geometry | Public indexing/selector/result identity matrix remains incomplete |
| `GEO-COLL-005` | `core/src/resolver/primitives/repeat.ts`; `core/src/projection.ts` | Repeat child IDs and order are stable for same-input local replay | `core/src/__tests__/projection.test.ts`; conformance runner | implementation gap | core | Node 24, Flutter, and cross-platform replay are not verified |
| `GEO-QUERY-001` | `core/src/evaluator.ts` | Measurement queries include hole-aware area/perimeter and boolean perimeter/bbox behavior | `core/src/__tests__/evaluator.test.ts`; `core/src/__tests__/boolean.test.ts`; fixture 24 | implementation gap | core + spec | Every supported primitive/query combination lacks a shared matrix |
| `GEO-QUERY-002` | `core/src/evaluator.ts`; `geometry/src/intersection.ts` | Point/path queries enforce finite `[0,1]` parameters and reject degenerate tangent/normal targets | `core/src/__tests__/tangent_normal.test.ts`; `core/src/__tests__/frame_placement.test.ts` | implementation gap | core + geometry | Broader curve/path tolerance and consumer coverage is incomplete |
| `GEO-QUERY-003` | `core/src/evaluator.ts` | v0.5 closest/project/reflect/world-space overload boundaries are locally tested | `core/src/__tests__/evaluator.test.ts` | bounded implementation | core + spec | Overloads outside v0.5 remain intentionally unimplemented |
| `GEO-QUERY-004` | `geometry/src/intersection.ts`; `core/src/__tests__/intersection_engine.test.ts` | Supported pair dispatch, selector ordering/deduplication, and empty/multiple errors are deterministic | `geometry/src/__tests__/geometry-contract.fixture.ts`; fixture 15; conformance 298/298 | bounded implementation | geometry + core | Broader sampled pairs remain outside active promotion |
| `GEO-QUERY-005` | `core/src/evaluator.ts`; `core/src/resolver/primitives/repeat.ts` | `frameAt` and `tAtLength` provide local frame/traversal values | `core/src/__tests__/frame_placement.test.ts`; repeat tests | bounded implementation | core + geometry | Shared repeat-along consumer reuse is partial |
| `GEO-CONSTRAINT-001` | `core/src/resolver/constraints.ts` | Equal/parallel/perpendicular/tangent validation has a valid matrix and structured degeneracy violations | `core/src/__tests__/constraints_diagnostics.test.ts`; fixture 14 | implementation gap | core + spec | Consumer and tolerance-boundary evidence remain open |
| `GEO-CONSTRAINT-002` | `core/src/resolver/constraints.ts`; `core/src/projection.ts` | Post-resolve violations preserve the resolved scene and stable path/code without a solver | fixture 14; conformance runner; structured error tests | bounded implementation | core + spec | Caller severity mapping remains consumer-owned |
| `GEO-BOOLEAN-001` | `geometry/src/boolean/BooleanEngine.ts`; `core/src/resolver/primitives/shapes.ts` | Engine and core resolver exercise union, subtract, intersect, and xor for rectangle topology | `geometry/src/__tests__/boolean.test.ts`; `core/src/__tests__/boolean.test.ts`; fixture 24 | explicit scope decision | geometry + core | Non-rectangle and cross-consumer promotion requires a separate decision |
| `GEO-BOOLEAN-002` | `geometry/src/boolean/normalizeClosedShape.ts`; `core/src/__tests__/boolean.test.ts` | Holes, xor multipart, empty, and bounded single/multi result errors are explicit | fixtures 15/19/20/24; `core/src/__tests__/boolean.test.ts` | explicit scope decision | core + geometry | Broader topology/result-mode matrix is deferred, not absent |
| `GEO-NUM-001` | `geometry/src/tolerance.ts`; `geometry/src/intersection.ts`; `geometry/src/path-modifiers.ts` | Operation-specific tolerance constants and boundary checks are active | `geometry/src/__tests__/intersection.test.ts`; `geometry/src/__tests__/split.test.ts`; package suite | bounded implementation | geometry + spec | No universal DSL epsilon or cross-runtime numeric parity claim |
| `GEO-NUM-002` | `geometry/src/boolean/normalizeClosedShape.ts` | Supported rings canonicalize winding, cleanup, and holes | `geometry/src/__tests__/boolean.test.ts`; fixture 15 | bounded implementation | geometry + core | Broader union/xor/non-rectangle topology remains deferred |
| `GEO-NUM-003` | `geometry/src/error.ts`; `geometry/src/path-modifiers.ts`; `geometry/src/split.ts` | Selected invalid/degenerate inputs produce stable low-level error codes | `geometry/src/__tests__/intersection.test.ts`; `geometry/src/__tests__/boolean.test.ts`; fixtures 19/20 | bounded implementation | geometry + core | Public document-path mapping is core-owned follow-up |
| `GEO-DET-001` | `core/src/projection.ts`; `scripts/run-conformance-fixtures.mjs` | Local repeated resolution/conformance is deterministic; canonical Node 24/Flutter/host replay is unavailable | conformance 298/298; local projection tests; runtime probe record | evidence-only limitation | core + parity | Node 22 checkout, Flutter host, and cross-platform runtime are not verified |
| `GEO-DET-002` | `core/src/projection.ts`; `cli/src/index.ts` | Local canonical comparator preserves IDs, order arrays, anchors, collections, and error paths | `core/src/__tests__/projection.test.ts`; CLI tests; conformance runner | bounded implementation | core + spec | Cross-runtime replay remains a separate evidence qualifier |
| `GEO-SER-001` | `core/src/projection.ts`; `cli/src/index.ts` | Versioned semantic scene projection is consumed by core/CLI | `core/src/__tests__/projection.test.ts`; CLI tests; expected JSON snapshots | bounded implementation | core + CLI | Flutter parity is not verified by local TypeScript evidence |
| `GEO-SER-002` | `core/src/projection.ts`; `fixtures/manifest.json` | Finite 12-decimal numbers, sorted keys, preserved arrays, and omitted undefined fields are canonical locally | `core/src/__tests__/projection.test.ts`; CLI tests; manifest; conformance 298/298 | bounded implementation | spec + core | Cross-version/host serializer parity remains not verified |
| `GEO-PARITY-001` | `flutter/lib/src/geometry/types.dart`; `flutter/lib/src/geometry/intersection.dart`; `core/src/projection.ts` | Shared fixture 15 is active on TypeScript/Flutter boundary; fixture 16 remains a capability candidate | fixtures 15/16 and manifest; Flutter source inspection | cross-surface contract gap | core + Flutter | Flutter probe/semantic comparison is unavailable; local TS pass is not parity proof |
| `GEO-PARITY-002` | `renderer-svg/src/semantic.ts`; `flutter/lib/src/ui/svg_exporter.dart` | Semantic SVG projection exists on TypeScript side; cross-consumer semantic comparison is not verified | `renderer-svg/src/__tests__/semantic_projection.test.ts`; SVG exporter source; parity plan | cross-surface contract gap | renderer-svg + Flutter | Raw SVG bytes/style/viewBox are excluded; host comparator is unavailable |

### Implementation closure evidence — active object/primitive/measure/transform/place slice

The following source changes are recorded as executable implementation evidence;
they do not by themselves promote the matrix rows or claim Flutter/host parity:

| Capability boundary | Source change | Regression evidence | Boundary retained |
| --- | --- | --- | --- |
| `GEO-MEASURE-002` | `core/src/units.ts` now uses a strict numeric grammar, rejects malformed known-unit literals and non-finite values, and preserves the existing unknown-suffix fallback. | `core/src/__tests__/units.test.ts`; `pnpm test` core: 48 files/497 tests; `pnpm lint` core. | Flutter unit normalization and cross-runtime equivalence remain not-verified. |
| `GEO-PRIM-003` / `GEO-PRIM-001` | `core/src/resolver/primitives/shapes.ts` and `point.ts` reject non-finite point, curve-control, rect, circle, and ellipse results before publishing geometry. | `core/src/__tests__/geometry.test.ts`; existing arc/curve degeneracy tests; `pnpm test` core. | Valid zero-radius circle inputs used for constraint diagnostics remain accepted. |
| `GEO-PRIM-005` / `GEO-MEASURE-004` | `core/src/resolver/primitives/component.ts` re-computes final inherited/instance parameter dependency order after overrides, preventing declaration-order drift. | `core/src/__tests__/component.test.ts`; `core/src/__tests__/inherit_resolution.test.ts`; `pnpm test` core. | Namespace/export parity and consumer/runtime parity remain separate boundaries. |
| `GEO-XFORM-001/002` | `geometry/src/transforms.ts` validates finite inputs/operations/results; `core/src/resolver/primitives/utils.ts` validates resolved transform and placement values. | `geometry/src/__tests__/geometry.test.ts`; `core/src/__tests__/frame_placement.test.ts`; package typechecks and suites. | Transform ordering and closed-path split boundary remain unchanged. |
| `GEO-PLACE-001/002` / `GEO-ANCH-002` | Core placement now rejects non-finite offsets and custom anchor coordinates, including malformed percentage anchors, with structured `INVALID_VALUE`. | `core/src/__tests__/frame_placement.test.ts`; smart/frame placement tests; `pnpm test` core. | Cross-consumer anchor serialization and host orientation parity remain not-verified. |
| `GEO-OBJ-001` / `GEO-PRIM-003` | `core/src/graph.ts` now includes explicit `from` references for arc/quadratic/cubic path segments, including inline hole segments, so topological ordering is independent of declaration order. Duplicate YAML object keys remain parse errors rather than silent identity overwrite. | `core/src/__tests__/dependency_v03.test.ts`; `core/src/__tests__/parser.test.ts`; `pnpm test` core: 48 files/497 tests; `pnpm lint` core. | Cross-runtime replay and duplicate identity behavior outside the YAML parser remain separate evidence boundaries. |
| `GEO-PRIM-005` / `GEO-ANCH-002` | Component scalar exports remain numeric in derived expressions while point exports remain anchor values; SVG anchor diagnostics render custom anchors with stable `object.anchor` labels. | `core/src/__tests__/component.test.ts`; `renderer-svg/src/__tests__/renderer.test.ts`; `pnpm test` renderer-svg: 7 files/103 tests; `pnpm lint` renderer-svg. | Semantic SVG schema does not add raw anchor metadata; Flutter anchor parity remains not-verified. |
| `GEO-PLACE-001` / `GEO-ANCH-002` | Group and clone custom anchors are resolved from the local child bbox before placement; validator accepts only declared custom anchor keys and rejects mixing them with standard placement sources. | `core/src/resolver/primitives/group.ts`; `core/src/resolver/primitives/clone.ts`; `core/src/validator.ts`; `core/src/__tests__/group_custom_anchors.test.ts`; `core/src/__tests__/sheet_view.test.ts`; `pnpm test` core: 48 files/502 tests; `pnpm lint` core. | Placement remains a core-local contract; cross-consumer and Flutter anchor parity remain not-verified. |
| `GEO-PRIM-004` / `GEO-PRIM-005` | Inline holes retain chained quadratic/cubic/line segment types and continuity; component-local object names remain prefixed and isolated from same-named top-level objects. | `core/src/__tests__/path_holes.test.ts`; `core/src/__tests__/component.test.ts`; `pnpm test` core: 48 files/503 tests. | Shared fixture serialization and cross-consumer curve/namespace parity remain separate evidence boundaries. |

### Implementation closure evidence — active collection/query/constraint/boolean slice

| Capability boundary | Source/contract change | Regression or fixture evidence | Boundary retained |
| --- | --- | --- | --- |
| `GEO-QUERY-001` | `core/src/evaluator.ts` now resolves boolean perimeter, bbox, and boundary sampling through the same typed segment path used by area/hole measurements. | `core/src/__tests__/boolean.test.ts` covers union perimeter, subtract-with-hole perimeter, xor area, and boolean bbox. | Curved approximation and cross-consumer numeric parity remain separate evidence boundaries. |
| `GEO-BOOLEAN-001/002` | Boolean union/xor result topology is exercised as a first-class core contract while empty/multipart strict errors remain unchanged; low-level geometry canonicalizes union/xor island order. | `geometry/src/__tests__/boolean.test.ts`; `core/src/__tests__/boolean.test.ts`; shared fixture 24 in `fixtures/reference/24-v05-collection-boolean-contract.yaml`. | Fixture 24 is core capability evidence; Flutter/renderer promotion and broader non-rectangle topology remain unverified/deferred. |
| `GEO-COLL-001/005` | Shared fixture 24 records along, grid, polar, and each repeat modes with stable child identity; repeated core resolution compares collection children and resolved object maps. | `core/src/__tests__/semantic_contract_fixtures.test.ts`; `fixtures/manifest.json` entry `v05-collection-boolean-contract`. | Linear mode and cross-runtime replay remain covered by existing local tests; Node/Flutter parity remains not-verified. |
| `GEO-CONSTRAINT-001` | The core relation matrix now has an executable valid case for equal, parallel, perpendicular, and tangent alongside existing structured invalid/degenerate diagnostics. | `core/src/__tests__/constraints_diagnostics.test.ts`. | Post-resolve validation remains intentionally solver-free; consumer parity remains separate. |

### Boundary findings retained from the full catalog audit

- `GEO-BOOLEAN-001/002` are now `⏸️` for the approved scope boundary; broader
  union/xor/non-rectangle topology is a separate promotion finding, not a
  missing implementation hidden by documentation.
- Core-owned queries, collections, placement, constraints, and resolver
  semantics remain consumer ownership boundaries; geometry package types or
  helpers do not prove a complete DSL implementation.
- Fixture 15 is the active bounded boolean/intersection evidence. Fixture 16
  remains a capability candidate, and Flutter/registry/Node-24/remote-CI
  evidence remains `not-verified`.
- The expected catalog still has 40 IDs joined one-to-one by reconciliation;
  the status matrix now has 35 `✔️`, 0 `🌗`, 0 `❌`, and 5 `⏸️` rows. The
  selected provenance finding is locally resolved and is no longer an open
  `⚠️` defect.
