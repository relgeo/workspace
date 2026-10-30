# Core Runtime Capability Status Matrix

**Tanggal:** 2026-10-30  
**Boundary:** expected core runtime catalog versus implementation audit evidence  
**Status dokumen:** published downstream view; this document does not implement a gap

Matrix ini adalah view capability-first dari [expected catalog](./expected-capability-catalog.md), [current implementation audit](./implementation-audit.md), [historical audit log](./archive/implementation-audit-legacy.md), dan [expected-versus-observed reconciliation](./reconciliation.md). Keempat artefak tetap terpisah: katalog menetapkan expected set, audit mencatat discovery/evidence, reconciliation melakukan join, dan matrix ini merangkum keputusan tindak lanjut.

Boundary dan ownership mengikuti [docs/REPOSITORY-MAP.md](../../REPOSITORY-MAP.md)
(`core/` adalah `relgeo/core`; UI, CLI, renderer, language-service, Flutter,
dan platform evidence tetap memiliki boundary masing-masing). Status/evidence
dibaca sesuai [capability inventory protocol](../INVENTORY-PROTOCOL.md), sehingga
`❌`, `?`, `⏸️`, dan `➖` tidak disamakan.

## Cara baca dan coverage

Setiap expected ID muncul tepat satu kali. `Status` adalah hasil rekonsiliasi;
`Evidence` menjelaskan implementation dan boundary verifikasi; kolom lain
adalah gap-management decision. Row matrix atau backlog tidak dihitung sebagai
implementasi.

| Status | Makna |
| --- | --- |
| `✔️` | Implementasi ditemukan dengan evidence langsung pada boundary yang disebut. |
| `🌗` | Implementasi atau evidence hanya mencakup sebagian capability. |
| `❌` | Expected capability sudah diperiksa tetapi implementation boundary tidak ditemukan; row wajib dipertahankan. |
| `➖` | Bukan tanggung jawab core; bukan bukti capability product tidak ada. |
| `⏸️` | Expansion atau promotion ditahan oleh keputusan scope/dependency. |
| `⚠️` | Defect atau contract drift terkonfirmasi. |
| `?` | Evidence belum dapat diverifikasi; bukan bukti absence. |

Current reconciliation: **38 expected IDs, 38 matrix rows, 0 missing,
0 duplicate, 0 extra; 23 `✔️`, 14 `🌗`, 0 `❌`, 1 `⚠️`.** `➖`, `⏸️`, dan
`?` tetap ditampilkan pada findings scope/evidence agar tidak disamakan dengan
absence implementation.

## Capability matrix

| ID | Capability | Status | Evidence | Gap | Owner | Dependency | Risk | Next action |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `CORE-INPUT-001` | Source ingestion, version default, document boundary | `✔️` | Audit §4A; parser tests; local conformance | No current Node 24/registry proof | core | parser, compatibility policy | M | Keep parser/version fixture in release gate |
| `CORE-INPUT-002` | YAML/document parse to structured model with source locations | `🌗` | Audit §4A; parser/language-service tests; no public AST ranges | Public source-range AST contract absent | core + language-service | parser marks, diagnostic model | H | Decide AST/source-location ownership and add contract test |
| `CORE-MODEL-001` | Normative document sections and semantic model | `✔️` | Audit §4A; types/parser/section tests | Spec-to-types drift check is not generated | core + spec | document schema | M | Add contract drift check |
| `CORE-MODEL-002` | Typed values, identity, namespaces, references, collections, component scope | `🌗` | Audit §4A; types and component tests; broad `any` remains | Public semantic typing is weaker than expected | core | type system, component scope | H | Tighten public types and error/result unions |
| `CORE-MODEL-003` | Scene coordinate, orientation, origin, auto-size, padding, units | `✔️` | Audit §4A; resolver/unit tests | Numeric tolerance policy is distributed | core | scene context, units | M | Consolidate scene numeric policy |
| `CORE-VALID-001` | Structural/schema/identifier/object validation | `✔️` | Audit §4B; parser/validator tests | Some paths still throw raw `Error` | core | schema, error normalizer | M | Normalize validator failures |
| `CORE-VALID-002` | Typed values, expressions, params, profiles, constants, derived validation | `✔️` | Audit §4B; evaluator/parameter tests | Function/type contract is not exhaustive against spec | core + spec | evaluator, type system | M | Add exhaustive type/function assertions |
| `CORE-VALID-003` | Reference, scope, placement, query, dependency legality | `🌗` | Audit §4B; reference/component/graph tests | Raw exceptions can bypass stable path/code | core | graph, resolver context, diagnostics | H | Normalize reference failures and add namespace negatives |
| `CORE-VALID-004` | Topology, closure, operation modes, invalid/degenerate inputs | `🌗` | Audit §4B; path/repeat/boolean tests | Spec combinations and degenerates are bounded | core + geometry | topology, boolean, tolerance | H | Add targeted negative/edge fixture set |
| `CORE-ERROR-001` | Editor-tolerant parse/validation and bounded recovery | `🌗` | Audit §4B; tolerant resolver tests | Recovery is bounded, not a general partial AST | core + Playground | editor mode, placeholder geometry | M | Document supported recovery cases and limits |
| `CORE-ERROR-002` | Strict compile/check with phase-distinct failures | `🌗` | Audit §4B; CLI/invalid fixtures/conformance | Raw evaluator/resolver errors remain | core + CLI | public diagnostic taxonomy | H | Normalize strict-mode exceptions |
| `CORE-GRAPH-001` | Dependency extraction across semantic relations | `✔️` | Audit §4C; graph/dependency tests | Expression scanning needs broader quoted/namespace negatives | core | expression deps, object graph | M | Add dependency extraction negatives |
| `CORE-GRAPH-002` | Topological ordering and circular dependency errors | `✔️` | Audit §4C; cycle/conformance tests | Cross-platform canonical ordering unverified | core | graph, diagnostics | M | Add repeated-process ordering proof |
| `CORE-EVAL-001` | Typed expression evaluation and deterministic functions | `✔️` | Audit §4C; evaluator suite | Failure paths still use raw errors | core | type system, diagnostic normalizer | M | Route evaluator failures through public errors |
| `CORE-EVAL-002` | Defaults, profiles, constants, derived and local scope phases | `✔️` | Audit §4C; derived/fixture tests | Fixture 16 is candidate for cross-consumer promotion | core + spec | graph, profiles, units | H | Decide fixture 16 promotion boundary |
| `CORE-EVAL-003` | Geometry queries, anchors, intersections, frames, conversions | `✔️` | Audit §4C; query/frame/intersection tests | Overload/error combinations are not exhaustive | core + geometry | query selectors, geometry ops | M | Add query overload matrix |
| `CORE-UNIT-001` | Unit normalization and conversion for lengths/angles | `✔️` | Audit §4C; unit tests; conformance | Cross-consumer promotion of fixture 16 deferred | core + spec | scene unit policy, consumer parity | H | Promote only after shared semantic snapshots |
| `CORE-RESOLVE-001` | Primitive, path, text, composition, collection, operation resolution | `✔️` | Audit §4D; resolver/fixture tests | Full object combination coverage bounded | core | object dispatcher, geometry | M | Publish supported object-combination table |
| `CORE-RESOLVE-002` | Placement, anchors, transforms, scope, world/local semantics | `✔️` | Audit §4D; placement/anchor/transform tests | All combinations not cross-consumer tested | core | anchors, transforms, graph | H | Add transform/anchor parity fixtures |
| `CORE-RESOLVE-003` | Repeat/divide/split/boolean collections and result modes | `🌗` | Audit §4D; runtime-error/boolean/repeat fixtures | Topology and mode coverage remains bounded | core + geometry | collection identity, boolean engine | H | Add collection/result-mode acceptance matrix |
| `CORE-RESOLVE-004` | Views, sheets, roles, metadata composition | `✔️` | Audit §4D; sheet/view/reference fixtures | Renderer styling remains outside core | core + renderer | scene projection, view policy | M | Preserve semantic view fixtures |
| `CORE-RESOLVE-005` | Typed resolved scene and consumer-safe semantic projection | `🌗` | Audit §4D; `core/src/projection.ts` and projection tests; conformance/consumers | Versioned core projection exists; consumer migration remains open | core + spec | geometry types, serializer | H | Add consumer comparator/migration evidence |
| `CORE-CONSTRAINT-001` | Post-resolve equality/alignment/parallel/perpendicular/tangent checks | `✔️` | Audit §4E; constraint tests/fixture | Coverage of every relation kind is narrow | core + spec | resolved geometry, tolerance | H | Add valid/invalid fixture per constraint kind |
| `CORE-CONSTRAINT-002` | Structured violations with path, objects, expected/actual, severity | `🌗` | Audit §4E; `ConstraintViolation` tests; no severity/origin | Violation contract lacks stable severity and phase | core + geometry | diagnostic schema, consumer UX | H | Extend violation contract and snapshots |
| `CORE-DIAG-001` | Machine-readable diagnostics with code/path/context/phase | `🌗` | Audit §4E; `core/src/diagnostics.ts`, structured-error/diagnostic tests, language-service/fixture tests | Source mapping and complete raw-error coverage remain bounded | core | error catalog, source paths | P0 | Expand source-range mapping and error catalog checks |
| `CORE-DIAG-002` | Deterministic multi-diagnostic aggregation | `🌗` | Audit §4E; `collectDiagnostics` tests and strict resolver regression | Core aggregation covers parse and independent local validation faults; broader coverage remains | core | error model, ordering policy | P1 | Expand aggregation coverage without changing strict behavior |
| `CORE-ERROR-003` | Distinct actionable runtime error taxonomy | `⚠️` | Audit §4E; `BOOLEAN_EMPTY_RESULT` is now represented and normalized, but evaluator/raw throw-site catalog remains incomplete | Public fallback normalization prevents boundary loss, while exhaustive emitted-code/type agreement is not yet proven | core | error catalog, all throw sites | P0 | Generate/maintain emitted-code catalog and add raw-throw normalization regressions |
| `CORE-DET-001` | Platform/order/time-independent parse-to-resolve behavior | `✔️` | Audit §4F; local graph/resolver/snapshot tests | Node 24/cross-platform proof unverified | core + parity | canonical toolchain, snapshots | H | Run canonical repeated-process gate |
| `CORE-DET-002` | Stable IDs, dependency/collection order, tolerance, diagnostic paths | `🌗` | Audit §4F; local snapshots/cycle tests | Numeric and diagnostic ordering lack one contract | core + spec | serializer, graph, diagnostics | H | Publish replay/order/tolerance rules |
| `CORE-API-001` | Documented public parse/validate/resolve/query/result API | `✔️` | Audit §4F; exports/build/consumer imports | API docs are not generated/contract-tested | core | package exports, types | M | Add public-export contract test |
| `CORE-API-002` | Renderer-neutral resolved scene and bounds | `✔️` | Audit §4F; renderer/CLI/Playground consumers | Semantic serialization/versioning remains open | core + geometry | ResolvedScene, serializer | M | Version semantic projection explicitly |
| `CORE-COMPAT-001` | Active 0.5 and omitted-version policy across boundaries | `✔️` | Audit §4F; parser/conformance/compatibility 283/283 | Consumer schema duplication can drift | core + spec | compatibility matrix, fixtures | M | Add schema/policy drift check |
| `CORE-COMPAT-002` | Legacy 0.4, regression 0.1–0.3, future/unknown rejection | `✔️` | Audit §4F; parser/legacy/future fixtures | Historical behavior is fixture-bounded | core + spec | version policy, fixtures | M | Maintain version-delta catalog |
| `CORE-COMPAT-003` | Compatibility-line identity across package and consumers | `✔️` | Audit §4F; compatibility check 283/283 | Registry/remote release evidence not rerun | workspace + core | package metadata, CI, registry | H | Refresh public package verification |
| `CORE-INT-001` | CLI info/compile/check integration | `✔️` | Audit §4F; CLI 9/9 and conformance | Published runtime not verified | core + CLI | command contract, filesystem boundary | M | Keep CLI command contract gate |
| `CORE-INT-002` | Playground/language tooling edit-diagnostic-resolve-preview flow | `🌗` | Audit §4F; language-service 66/66 and worker wiring; browser E2E unverified | Consumer sequencing/accessibility evidence incomplete | core + consumers | worker, diagnostics, renderer | H | Run browser E2E and preserve core boundary |
| `CORE-INT-003` | Shared active/legacy/invalid/runtime/capability fixtures | `✔️` | Audit §4F; conformance 260/260 across 20 fixtures | Manifest is not exhaustive spec coverage | workspace + core | fixture provenance, runner | M | Add fixture per promoted capability |
| `CORE-INT-004` | Stable semantic boundary for TS/renderer/Markdown/Flutter | `🌗` | Audit §4F; TS consumers pass; Flutter CI/host unverified | Cross-consumer parity is bounded; raw SVG/UX out of scope | core + consumer owners | shared fixtures, Flutter host | H | Refresh Flutter/canonical consumer evidence |

## Scope, deferred, and evidence findings

These rows preserve statuses that must not be confused with implementation
absence; they are not additional expected IDs.

| Finding | Status | Evidence | Owner | Dependency | Risk | Next action |
| --- | --- | --- | --- | --- | --- | --- |
| General constraint solver / automatic geometry mutation | `➖` | Master plan/spec and `resolver/constraints.ts` define post-resolve violations | core/spec | product scope decision | M | Keep as explicit non-goal unless scope changes |
| Fixture 16 evaluator/unit promotion | `⏸️` | Manifest capability status; Flutter compatibility remains partial | core + Flutter | shared promotion evidence | H | Record human promotion decision before activating |
| Node `>=24`, registry, current CI, browser E2E, Flutter host | `?` | Current audit ran locally on Node 22.23.2 | workspace + consumers | canonical environments | H | Refresh evidence; do not infer absence |

## Evidence and handoff links

- [Expected core runtime catalog](./expected-capability-catalog.md)
- [Current implementation audit evidence](./implementation-audit.md)
- [Archived detailed audit log](./archive/implementation-audit-legacy.md)
- [Expected-versus-observed reconciliation](./reconciliation.md)
- [Core runtime implementation-gap backlog](./implementation-gap-backlog.md)
- [Maturation master plan](../../MATURATION-MASTER-PLAN.md)
- [Repository map](../../REPOSITORY-MAP.md)
- [Capability inventory protocol](../INVENTORY-PROTOCOL.md)
- [Coverage validation and handoff](./coverage-validation-handoff.md)
- [Compatibility matrix](../../compatibility-matrix.json)
- [Contract-versioning plan](../../plans/02-contract-versioning.md)
- [Fixture manifest](../../../fixtures/manifest.json)
