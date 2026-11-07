# Core Runtime Capability Status Matrix

**Tanggal:** 2026-11-05
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
0 duplicate, 0 extra; 38 `✔️`, 0 `🌗`, 0 `❌`, 0 `⚠️`.** This is the local
contract-closure result for Core submodule `ea74c9e`, backed by `537` Core
tests, `401/401` conformance checks across 27 fixtures, compatibility `283/283`,
and the consumer evidence recorded in the [closure report](./closure-report-2026-11-05.md).
It is not a Node 24, registry, browser, CI, or host-runtime claim.
`➖`, `⏸️`, dan
`?` tetap ditampilkan pada findings scope/evidence agar tidak disamakan dengan
absence implementation.

## Closure boundary and residual evidence

The 18 previously non-complete rows are now closed at the declared local
Core/consumer contract boundary. The exact source path, regression evidence,
and residual owner for each ID are recorded in the
[closure report](./closure-report-2026-11-05.md). Node `>=24`, registry/public
artifacts, current CI, browser E2E, and Flutter host evidence remain separate
evidence/scope findings; fixture 16 is active at the bounded local contract;
general constraint solving
remains explicit `➖`.

## Capability matrix

| ID | Capability | Status | Evidence | Gap | Owner | Dependency | Risk | Next action |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `CORE-INPUT-001` | Source ingestion, version default, document boundary | `✔️` | Audit §A; parser tests; local conformance | No current Node 24/registry proof | core | parser, compatibility policy | M | Keep parser/version fixture in release gate |
| `CORE-INPUT-002` | YAML/document parse to structured model with source locations | `✔️` | `core/src/parser.ts`, `sourceRangeForPath`, parser/diagnostic/language-service tests | Semantic document + best-effort range is the explicit v0.5 public boundary; no public AST claim | core + language-service | parser marks, diagnostic model | H | Maintain source-range regressions |
| `CORE-MODEL-001` | Normative document sections and semantic model | `✔️` | Audit §A; types/parser/section tests | Spec-to-types drift check is not generated | core + spec | document schema | M | Add contract drift check |
| `CORE-MODEL-002` | Typed values, identity, namespaces, references, collections, component scope | `✔️` | Recursive public semantic values/aliases; component, inherit, parameter, lint/build, and 537 Core tests | Public semantic model is typed; resolver-internal/generated-schema typing remains maintenance | core | type system, component scope | H | Maintain additive type coverage |
| `CORE-MODEL-003` | Scene coordinate, orientation, origin, auto-size, padding, units | `✔️` | Audit §A; resolver/unit tests | Numeric tolerance policy is distributed | core | scene context, units | M | Consolidate scene numeric policy |
| `CORE-VALID-001` | Structural/schema/identifier/object validation | `✔️` | Audit §B; parser/validator tests | Some paths still throw raw `Error` | core | schema, error normalizer | M | Normalize validator failures |
| `CORE-VALID-002` | Typed values, expressions, params, profiles, constants, derived validation | `✔️` | Audit §B; evaluator/parameter tests | Function/type contract is not exhaustive against spec | core + spec | evaluator, type system | M | Add exhaustive type/function assertions |
| `CORE-VALID-003` | Reference, scope, placement, query, dependency legality | `✔️` | Validator/reference/component/cycle tests; semantic-contract fixtures; production raw-throw inventory | Public reference/scope failures retain stable code/path/object context; visualization remains consumer-owned | core | graph, resolver context, diagnostics | H | Maintain namespace and dependency negatives |
| `CORE-VALID-004` | Topology, closure, operation modes, invalid/degenerate inputs | `✔️` | Path-hole, Boolean, repeat/divide/split tests; fixtures 25–27; geometry topology tests | Supported v0.5 topology/result-mode boundary is closed; future mixed-topology combinations are additive scope | core + geometry | topology, boolean, tolerance | H | Add fixtures only for newly promoted v0.5 behavior |
| `CORE-ERROR-001` | Editor-tolerant parse/validation and bounded recovery | `✔️` | Tolerant resolver, incomplete-editor fixture, diagnostics, Flutter invalid-boundary tests | Recovery is intentionally bounded and never reports strict compile/resolve success | core + Playground | editor mode, placeholder geometry | M | Maintain bounded recovery cases |
| `CORE-ERROR-002` | Strict compile/check with phase-distinct failures | `✔️` | Structured-error tests, invalid/runtime fixtures, CLI 38 tests, and 401/401 conformance | Strict phase/code/path contract is closed locally; published runtime remains external evidence | core + CLI | public diagnostic taxonomy | H | Maintain strict-mode boundary |
| `CORE-GRAPH-001` | Dependency extraction across semantic relations | `✔️` | Audit §C; graph/dependency tests | Expression scanning needs broader quoted/namespace negatives | core | expression deps, object graph | M | Add dependency extraction negatives |
| `CORE-GRAPH-002` | Topological ordering and circular dependency errors | `✔️` | Audit §C; cycle/conformance tests | Cross-platform canonical ordering unverified | core | graph, diagnostics | M | Add repeated-process ordering proof |
| `CORE-EVAL-001` | Typed expression evaluation and deterministic functions | `✔️` | Audit §C; syntax-only regression and evaluator tests | Failure paths still use raw errors | core | type system, diagnostic normalizer | M | Keep syntax-only evaluation behavior distinct from actual arithmetic errors |
| `CORE-EVAL-002` | Defaults, profiles, constants, derived and local scope phases | `✔️` | Audit §C; derived/component tests; active fixture 16; Core/CLI/Flutter-local evidence | Fixture 16 is active at the bounded local contract; canonical Node-24/CI/native-host evidence remains separate | core + spec | graph, profiles, units | H | Preserve active fixture and refresh canonical evidence |
| `CORE-EVAL-003` | Geometry queries, anchors, intersections, frames, conversions | `✔️` | Audit §C; query/frame/intersection tests | Overload/error combinations are not exhaustive | core + geometry | query selectors, geometry ops | M | Add query overload matrix |
| `CORE-UNIT-001` | Unit normalization and conversion for lengths/angles | `✔️` | Audit §C; unit tests; active fixture 16 conformance; Flutter semantic projection | Local cross-consumer promotion of fixture 16 is recorded; canonical host evidence remains separate | core + spec | scene unit policy, consumer parity | H | Preserve shared semantic snapshots |
| `CORE-RESOLVE-001` | Primitive, path, text, composition, collection, operation resolution | `✔️` | Audit §D; resolver/fixture tests | Full object combination coverage bounded | core | object dispatcher, geometry | M | Publish supported object-combination table |
| `CORE-RESOLVE-002` | Placement, anchors, transforms, scope, world/local semantics | `✔️` | Audit §D; placement/anchor/transform tests | All combinations not cross-consumer tested | core | anchors, transforms, graph | H | Add transform/anchor parity fixtures |
| `CORE-RESOLVE-003` | Repeat/divide/split/boolean collections and result modes | `✔️` | Repeat/divide/split/Boolean tests; fixtures 19/20/22/24–27; conformance | Active v0.5 identity/order/mode and invalid-target boundaries are closed; broader topology is additive scope | core + geometry | collection identity, boolean engine | H | Maintain supported result-mode matrix |
| `CORE-RESOLVE-004` | Views, sheets, roles, metadata composition | `✔️` | Audit §D; sheet/view/reference fixtures | Renderer styling remains outside core | core + renderer | scene projection, view policy | M | Preserve semantic view fixtures |
| `CORE-RESOLVE-005` | Typed resolved scene and consumer-safe semantic projection | `✔️` | `core/src/projection.ts`, projection/replay tests, CLI/renderer/Flutter/fixture comparators | Versioned projection and local consumer migration are closed; host replay is evidence-only | core + spec | geometry types, serializer | H | Maintain additive projection versions |
| `CORE-CONSTRAINT-001` | Post-resolve equality/alignment/parallel/perpendicular/tangent checks | `✔️` | Audit §E; constraint tests/fixtures 14/24 | Coverage of every relation kind is narrow | core + spec | resolved geometry, tolerance | H | Add valid/invalid fixture per constraint kind |
| `CORE-CONSTRAINT-002` | Structured violations with path, objects, expected/actual, severity | `✔️` | Constraint tests, fixture 14, conformance retention/replay, Flutter diagnostic test | Stable post-resolve violation schema is closed; new relation kinds require additive fixtures | core + geometry | diagnostic schema, consumer UX | H | Maintain relation fixtures |
| `CORE-DIAG-001` | Machine-readable diagnostics with code/path/context/phase | `✔️` | `errors.ts`, `diagnostics.ts`, source-range tests, structured-error/runtime fixtures, normative catalog assertion | Public code/phase/severity/path/context and fallback normalization are closed; deep ranges remain bounded by contract | core | error catalog, source paths | P0 | Maintain catalog and range regressions |
| `CORE-DIAG-002` | Deterministic multi-diagnostic aggregation | `✔️` | `aggregateDiagnostics`/`collectDiagnostics` tests; ordering, dedupe, truncation, and strict-equivalence regressions | Core aggregation boundary is closed; new adapter fault classes are additive maintenance | core | error model, ordering policy | P1 | Maintain deterministic aggregation |
| `CORE-ERROR-003` | Distinct actionable runtime error taxonomy | `✔️` | `closure_contracts.test.ts` compares normative error-model codes to `REL_GEO_ERROR_CODES`; structured-error/runtime tests and raw-throw inventory pass | Public taxonomy and normalization boundary are closed; future codes require catalog/type/normalizer/fixture updates | core | error catalog, all throw sites | P0 | Maintain emitted-code catalog agreement |
| `CORE-DET-001` | Platform/order/time-independent parse-to-resolve behavior | `✔️` | Audit §F; local graph/resolver/projection tests | Node 24/cross-platform proof unverified | core + parity | canonical toolchain, snapshots | H | Run canonical repeated-process gate |
| `CORE-DET-002` | Stable IDs, dependency/collection order, tolerance, diagnostic paths | `✔️` | Projection/replay, cycle, collection, diagnostics tests and conformance comparator | v0.5 replay/order/normalization rules are executable; cross-platform process proof remains external evidence | core + spec | serializer, graph, diagnostics | H | Maintain replay comparator |
| `CORE-API-001` | Documented public parse/validate/resolve/query/result API | `✔️` | Audit §F; exports/build/consumer imports | API docs are not generated/contract-tested | core | package exports, types | M | Add public-export contract test |
| `CORE-API-002` | Renderer-neutral resolved scene and bounds | `✔️` | Audit §F; renderer/CLI/Playground consumers | Semantic serialization/versioning remains open | core + geometry | ResolvedScene, serializer | M | Version semantic projection explicitly |
| `CORE-COMPAT-001` | Active 0.5 and omitted-version policy across boundaries | `✔️` | Audit §F; parser/conformance/compatibility checks | Consumer schema duplication can drift | core + spec | compatibility matrix, fixtures | M | Add schema/policy drift check |
| `CORE-COMPAT-002` | Legacy 0.4, regression 0.1–0.3, future/unknown rejection | `✔️` | Audit §F; parser/legacy/future fixtures | Historical behavior is fixture-bounded | core + spec | version policy, fixtures | M | Maintain version-delta catalog |
| `CORE-COMPAT-003` | Compatibility-line identity across package and consumers | `✔️` | Audit §F; compatibility checks and metadata review | Registry/remote release evidence not rerun | workspace + core | package metadata, CI, registry | H | Refresh public package verification |
| `CORE-INT-001` | CLI info/compile/check integration | `✔️` | Audit §F; CLI 38 tests and conformance | Published runtime not verified | core + CLI | command contract, filesystem boundary | M | Keep CLI command contract gate |
| `CORE-INT-002` | Playground/language tooling edit-diagnostic-resolve-preview flow | `✔️` | language-service 90, Playground 107, conformance, and Flutter recovery/diagnostic tests | Local edit→diagnostic→resolve→preview contract is closed; browser E2E/accessibility remain consumer evidence | core + consumers | worker, diagnostics, renderer | H | Maintain consumer boundary tests |
| `CORE-INT-003` | Shared active/legacy/invalid/runtime/capability fixtures | `✔️` | Audit §F; conformance 401/401 across 27 fixtures, including structured invalid code/phase/path checks | Manifest is not exhaustive spec coverage | workspace + core | fixture provenance, runner | M | Add fixture per promoted capability |
| `CORE-INT-004` | Stable semantic boundary for TS/renderer/Markdown/Flutter | `✔️` | renderer/CLI/language-service/remark/Playground/Flutter tests and 401/401 conformance | Semantic parity is closed locally; raw SVG bytes, UX, and Flutter host CI remain out of scope | core + consumer owners | shared fixtures, Flutter host | H | Maintain semantic comparator fixtures |

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
