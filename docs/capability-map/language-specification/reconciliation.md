# Language Specification Expected-versus-Observed Reconciliation

**Tanggal:** 2026-11-04
**Join source expected:** [`language-specification/expected-capability-catalog.md`](./expected-capability-catalog.md)
**Join source observed:** [`language-specification/implementation-audit.md`](./implementation-audit.md)
**Required context:** [`MATURATION-MASTER-PLAN.md`](../../MATURATION-MASTER-PLAN.md), [`REPOSITORY-MAP.md`](../../REPOSITORY-MAP.md)

Published views: [status matrix](./status-matrix.md) dan
[implementation-gap backlog](./implementation-gap-backlog.md).

Contract handoff frozen for this tranche:

- vocabulary, aliases, types, fields, and document status labels are sourced
  from [`normative-vocabulary-catalog.json`](./normative-vocabulary-catalog.json)
  and checked by `pnpm run language-spec:check`;
- diagnostics are sourced from
  [`spec/id/core/04-evaluation-order.md`](../../../spec/id/core/04-evaluation-order.md),
  [`05-semantic-guarantees.md`](../../../spec/id/core/05-semantic-guarantees.md),
  and [`06-error-model.md`](../../../spec/id/core/06-error-model.md);
- dimension, annotation, drawing-role, metadata, and safe semantic SVG
  boundaries are sourced from the presentation contract in `spec/id/presentation/`
  and its hostile-input/semantic-output fixture requirements.

These sources are the normative and checked contract handoff. The capability
rows below remain an observed implementation/release view; they must not be
promoted to `implemented` merely because the contract is now explicit.

## 0. Contract and acceptance lock

**Lock date:** 2026-11-04. This section turns the selected P0/P1 triage into
observable acceptance boundaries before implementation work proceeds. It does
not add vocabulary, alter public behavior, or promote any matrix status. The
active public compatibility contract remains RelGeo DSL `0.5.x`, as recorded in
[`docs/compatibility-matrix.json`](../../compatibility-matrix.json): active
`0.5`, omitted version default `0.5`, supported legacy `0.4`, unsupported future
versions, and patch-compatible changes staying on the same compatibility line.
The normative source remains `spec/id`; the compatibility matrix is the release
policy, not a second semantic source of truth.

The acceptance records use the inventory protocol's four axes and evidence
separation: implementation behavior, evidence tier/environment, parity result,
and scope. Local commands or fixtures are implementation evidence only; they do
not become CI, public, browser, native-host, or registry evidence by
implication. An unavailable environment remains `not verified`, and a held
promotion/scope decision remains `held`/deferred rather than being converted to
an implementation failure.

| Gap / selected IDs | Contract boundary and success behavior | Failure / edge behavior that must be explicit | Expected evidence before a status change |
| --- | --- | --- | --- |
| `GAP-001` — `LANG-002`, `DOC-003`, `TYPE-001`, `TYPE-002`, `VER-003` | Relation-first evaluation follows the dependency graph and produces deterministic results; the checked projection agrees with normative root fields, scalar/structured types, aliases, and document-status labels. Editorial vocabulary remains informative and does not introduce DSL fields. | Unknown/circular references and invalid typed expressions produce stable diagnostics; general constraint solving and statement-level control flow remain outside v0.5; vocabulary/catalog drift fails the check rather than silently changing a consumer. | `pnpm run language-spec:check`; core graph/resolver tests; negative no-solver/control-flow and drift fixtures; language-service schema/completion comparison. |
| `GAP-002` — `DECL-001`, `DECL-004`, `EVAL-002` plus `TYPE-001` runtime coercion | Parameters accept declared defaults, shorthand, and supported structured values; the selected profile overrides parameters only; evaluation order is parameters → profiles → constants → derived; explicit units normalize to `scene.unit` and contextual unitless numbers follow the type contract. | Missing/invalid values, invalid unit syntax, incompatible coercion, or illegal arithmetic fail with the documented structured diagnostic; profiles cannot override constants or act as styling; fixture-16 promotion remains decision-gated until explicitly promoted. | Shared parameter/profile/unit fixture (fixture 16 or an approved replacement); core, CLI, language-service, and Flutter projections; `pnpm conformance:fixtures`; record the promotion decision separately from local pass/fail. |
| `GAP-003` — `GEO-001`–`GEO-005` | Supported 2D primitives, modes, anchors, closed-shape/topology cases, and geometry operations resolve with stable identity and semantic geometry; resolved JSON/SVG assertions compare meaning, not renderer-specific bytes. | Degenerate or invalid geometry returns the applicable stable error; unsupported pairs/features are rejected; topology/boolean expansion beyond the approved v0.5 boundary is not inferred from a passing local fixture. | Geometry contract fixtures and package tests; core/renderer semantic snapshots; `pnpm conformance:fixtures`; explicit negative cases for degenerate, unsupported, and topology boundaries. |
| `GAP-007` — `QUERY-002` | Path/transform queries return the normative typed result (`point`, `vector`, or `frame2d`) with the documented parameter domain, canonical intersection ordering, and tolerance policy; `toWorld`/`toLocal` preserve the coordinate-space contract. | Out-of-domain parameters, empty/multiple intersections without a selector, invalid selectors, unsupported pairs, non-finite/degenerate inputs, or unsupported targets produce the named diagnostic rather than a guessed result. | Query-domain/tolerance fixture table; `geometry/src/__tests__/intersection.test.ts` and focused query tests; core conformance and resolved-value assertions; consumer parity marked separately from local evidence. |
| `GAP-008` — `CON-001`, `CON-002` | Constraints run after geometry resolution as validation only; supported equal/parallel/perpendicular/tangent/alignment checks emit stable violation payloads and do not mutate geometry or dependency graph. | Structural/reference errors remain hard failures; a failed post-resolve constraint yields `CONSTRAINT_VIOLATION`/documented violation behavior, not geometry repair or an implicit solver; conflicting constraints remain diagnosable. | One shared fixture per constraint kind; before/after resolved-scene comparison proving no mutation; core diagnostics plus CLI/language-service mapping and conformance evidence. |
| `GAP-009` — `PRES-001`, `PRES-002` | Valid dimension and annotation objects preserve semantic text, role, identity, geometry, and placement through the renderer; supported presentation attributes are serialized according to the v0.5 presentation contract. | Hostile text/metadata is XML-escaped; unknown metadata is not raw markup; invalid presentation input is diagnosed or safely omitted according to the existing contract. No input may create element/attribute names, handlers, `<script>`, `<foreignObject>`, or executable URLs. | v0.5 hostile-input fixture; renderer security/dimension/annotation tests; local CLI and Markdown semantic snapshots; all-host/browser/native evidence remains a separate promotion gate. |
| `GAP-011` — `DIAG-001`, `DIAG-002`, `ERR-001` | Every public parser/validator/resolver/core/CLI/language-service boundary exposes `{code, phase, severity, message}` plus stable optional path/object/range fields; `editor` may recover, while `validate`/`compile` remain strict and deterministic. | Raw `Error`, stack, or locale-dependent text cannot cross a public boundary; unknown internal codes map to `UNKNOWN_ERROR`; strict failures produce no compile output; constraint diagnostics remain post-resolve and non-mutating; diagnostic ordering is deterministic. | Raw-throw inventory; core structured-diagnostic tests; tolerant/validate/compile fixtures; CLI and language-service mapping tests; `pnpm conformance:fixtures`; canonical/host evidence reported separately. |
| `GAP-013` — `SER-002` | SVG is a semantic projection on compatibility line 0.5: geometry, role, identity, and placement remain stable while safe text/attribute escaping is applied. Semantic comparison is required; byte-identical SVG is not. | Literal executable markup, event handlers, unsafe URLs, quote-breaking attributes, and `<foreignObject>` from input are forbidden; escaping must not silently delete the data or alter semantic geometry. | Renderer security and semantic-output fixtures; CLI/Markdown snapshots; conformance runner; browser/Playground/native-host parity remains `not verified` until independently run. |

### Contract-change gate

No public contract change is proposed by this lock. Any future change to the
success/failure behavior above must first update its normative `spec/id` chapter
and the matching acceptance fixture, then classify the compatibility impact
against [`docs/compatibility-matrix.json`](../../compatibility-matrix.json):
`patch-compatible` only for same-line compatible behavior; a breaking language
contract requires a decision record and the next compatibility line (for
example `0.6.x`). A package publish, deployment, or host-only evidence result
cannot by itself alter the language contract.

## 1. Aturan rekonsiliasi

Rekonsiliasi ini adalah join satu-ke-satu pada ID capability. Setiap ID dari
expected catalog harus memiliki tepat satu row di tabel §3. Tidak ada capability
yang dihapus karena belum ditemukan pada implementation.

Kolom dibedakan sebagai berikut:

- `Result` adalah hasil expected-versus-observed;
- `Implementation` menjelaskan apakah source/runtime ada;
- `Evidence` menjelaskan seberapa kuat pemeriksaan saat ini;
- `Scope decision` mempertahankan keputusan bahasa/produk, bukan menyimpulkan
  dari status implementation.

| Result | Arti |
| --- | --- |
| `✔️` | Expected capability terwujud pada boundary yang diaudit dan evidence langsung tersedia. |
| `🌗` | Sebagian terwujud atau coverage/consumer parity belum lengkap. |
| `⚠️` | Mismatch atau defect terkonfirmasi pada boundary yang diharapkan. |
| `❌` | Capability expected tidak ditemukan pada implementation boundary yang diperiksa. Ini bukan status `not verified`. |
| `⏸️` | Sengaja ditahan/deferred oleh keputusan scope atau promotion policy. |
| `➖` | Not applicable terhadap scope; tidak boleh digunakan untuk capability yang sekadar belum ditemukan. |

`Evidence` memakai `direct-local`, `source+tests`, `historical/local`, atau
`not verified` sesuai audit. `not verified` tidak mengubah `Result` menjadi
`❌` atau `➖` tanpa pemeriksaan boundary yang cukup.

| Dimensi | Kolom rekonsiliasi | Nilai yang diperbolehkan | Makna |
| --- | --- | --- | --- |
| Expected-versus-observed result | `Result` | tepat satu dari `✔️`, `🌗`, `❌`, `➖`, `⏸️`, `⚠️` | Ringkasan status capability pada boundary yang diaudit |
| Implementation finding | `Implementation` | `implemented`, `partial`, `absent`, `broken`, `deferred`, `not applicable`, atau `unverified` | Apakah realization source/runtime ditemukan; terpisah dari kekuatan bukti |
| Verification/evidence | `Evidence` | `direct-local`, `source+tests`, `historical/local`, atau `not verified` | Seberapa langsung dan current pemeriksaan yang mendukung finding |
| Scope | `Scope decision` | keputusan `IN`, `OUT`, `boundary only`, atau `deferred` dari catalog/decision record | Apakah capability memang diharapkan pada boundary ini |

## 2. Reconciliation coverage

| Check | Result |
| --- | --- |
| Expected IDs discovered | 53 |
| Reconciled rows | 53 |
| Expected IDs with exactly one reconciliation row | 53/53 |
| Duplicate expected IDs in reconciliation | 0 |
| Observed audit trace available | 53/53 |
| Current `❌` rows | 0 — semua 53 ID memiliki sebagian source/runtime realization; absence structural dicatat di §4 |
| Current `⚠️` rows | 1 — `DIAG-002` |
| Current `⏸️` rows | 0 as whole capability; deferred sub-boundaries remain in `EVAL-002`, `COLL-003`, and consumer evidence |

Tidak adanya `❌` pada join ini bukan klaim bahwa seluruh capability selesai.
Expected catalog memang memiliki realization parsial untuk setiap ID. Temuan
`absent` yang terpisah adalah **single generated machine-readable normative
catalog**, yang belum menjadi ID capability dalam katalog bahasa; ia tidak boleh
disamarkan sebagai row capability atau dipakai untuk menghilangkan expected ID.

## 3. One-to-one expected-versus-observed join

### A. Authoring language dan document structure

| ID | Result | Implementation | Evidence | Scope decision | Audit trace / gap |
| --- | --- | --- | --- | --- | --- |
| `LANG-001` | `✔️` | `implemented` | `direct-local` | IN: text-first YAML | `LANG-001` — parser and text contract present; vocabulary not generated |
| `LANG-002` | `🌗` | `partial` | `direct-local` | IN: deterministic relation-first; no solver/control flow | `LANG-002` — runtime deterministic; full negative/non-solver map incomplete |
| `DOC-001` | `✔️` | `implemented` | `direct-local` | IN: root sections | `DOC-001` — parser/validator and fixture 10 |
| `DOC-002` | `✔️` | `implemented` | `direct-local` | IN: 2D scene/unit configuration | `DOC-002` — scene, units, viewport tests |
| `DOC-003` | `🌗` | `partial` | `direct-local` | IN: readable/editorial vocabulary | `DOC-003` — normative status labels and checked vocabulary are frozen; broader editorial/example vocabulary is informative and is not generated |

### B. Declarations, types, expressions, dan evaluation

| ID | Result | Implementation | Evidence | Scope decision | Audit trace / gap |
| --- | --- | --- | --- | --- | --- |
| `DECL-001` | `🌗` | `partial` | `direct-local` | IN: typed parameters; candidate promotion separate | `DECL-001` — parameters exist; fixture 16 remains candidate |
| `DECL-002` | `✔️` | `implemented` | `direct-local` | IN: immutable constants | `DECL-002` — constants resolver/tests; shared immutability negatives limited |
| `DECL-003` | `✔️` | `implemented` | `direct-local` | IN: read-only derived/global/local scope | `DECL-003` — evaluator and derived access tests |
| `DECL-004` | `🌗` | `partial` | `source+tests` | IN: parameter profiles only | `DECL-004` — profile runtime/CLI exists; active fixture coverage incomplete |
| `TYPE-001` | `🌗` | `partial` | `direct-local` | IN: scalar typed values | `TYPE-001` — types/units exist; full coercion matrix not active |
| `TYPE-002` | `🌗` | `partial` | `direct-local` | IN: structured 2D types | `TYPE-002` — runtime types exist; path/frame/bbox/collection parity incomplete |
| `EXPR-001` | `✔️` | `implemented` | `direct-local` | IN: arithmetic/precedence subset | `EXPR-001` — evaluator and tests |
| `EXPR-002` | `✔️` | `implemented` | `direct-local` | IN: comparison/logical/ternary; statements OUT | `EXPR-002` — evaluator/parser validation |
| `EXPR-003` | `✔️` | `implemented` | `direct-local` | IN: symbol/property/index/anchor refs | `EXPR-003` — graph/eval context/reference tests |
| `EVAL-001` | `✔️` | `implemented` | `direct-local` | IN: dependency graph/topological evaluation | `EVAL-001` — graph/resolver/conformance; cycle fixtures not exhaustive |
| `EVAL-002` | `🌗` | `partial` | `direct-local` | IN expected; unit/evaluator promotion held | `EVAL-002` — units/CLI exist; fixture 16 candidate |

### C. Geometry, composition, placement, dan anchors

| ID | Result | Implementation | Evidence | Scope decision | Audit trace / gap |
| --- | --- | --- | --- | --- | --- |
| `OBJ-001` | `✔️` | `implemented` | `direct-local` | IN: stable identity/object model | `OBJ-001` — parser/resolver/types and snapshots |
| `GEO-001` | `🌗` | `partial` | `direct-local` | IN: 2D point modes | `GEO-001` — point/intersection runtime; full field matrix incomplete |
| `GEO-002` | `🌗` | `partial` | `source+tests` | IN: line construction modes | `GEO-002` — line modes exist; full error/consumer matrix incomplete |
| `GEO-003` | `🌗` | `partial` | `direct-local` | IN: rect/circle/ellipse | `GEO-003` — primitives exist; holes/placement combinations incomplete |
| `GEO-004` | `🌗` | `partial` | `source+tests` | IN: curves/path/polygon/text | `GEO-004` — runtime exists; active snapshots cover subset |
| `GEO-005` | `🌗` | `partial` | `source+tests` | IN: closed shapes/topology | `GEO-005` — holes/joins/corners exist; degenerate/topology parity incomplete |
| `COMP-001` | `🌗` | `partial` | `source+tests` | IN: group hierarchy/transforms | `COMP-001` — group tests/legacy fixtures; active v0.5 coverage limited |
| `COMP-002` | `🌗` | `partial` | `source+tests` | IN: clone/reuse | `COMP-002` — clone exists; active identity/metadata coverage limited |
| `COMP-003` | `🌗` | `partial` | `source+tests` | IN: component params/local derived/exports | `COMP-003` — component tests; nested/export coverage incomplete |
| `PLACE-001` | `🌗` | `partial` | `source+tests` | IN: generic directional placement | `PLACE-001` — placement utility exists; multi-anchor/inside coverage incomplete |
| `PLACE-002` | `✔️` | `implemented` | `direct-local` | IN: on.point | `PLACE-002` — point/anchor placement tests |
| `PLACE-003` | `🌗` | `partial` | `source+tests` | IN: on.path | `PLACE-003` — path placement exists; domain/error coverage incomplete |
| `PLACE-004` | `✔️` | `implemented` | `source+tests` | IN: on.frame | `PLACE-004` — frame placement/tangent tests; consumer parity limited |
| `ANCH-001` | `🌗` | `partial` | `source+tests` | IN: typed named/world anchors | `ANCH-001` — anchor resolver/tests; spec vocabulary broader than fixtures |

### D. Collections, queries, dan constraints

| ID | Result | Implementation | Evidence | Scope decision | Audit trace / gap |
| --- | --- | --- | --- | --- | --- |
| `COLL-001` | `🌗` | `partial` | `source+tests` | IN: repeat modes/identity | `COLL-001` — repeat runtime/tests; all modes not active |
| `COLL-002` | `🌗` | `partial` | `source+tests` | IN: divide/split collections | `COLL-002` — resolvers/tests; result/pick contract incomplete |
| `COLL-003` | `🌗` | `partial` | `direct-local` | IN expected; active boolean boundary limited by decision | `COLL-003` — fixture 15 active boundary; union/xor/broader topology held |
| `COLL-004` | `🌗` | `partial` | `direct-local` | IN: collection access/order/functions | `COLL-004` — count/first/last/index; raw edge errors not uniform |
| `QUERY-001` | `✔️` | `implemented` | `source+tests` | IN: scalar/bbox geometry queries | `QUERY-001` — evaluator/query tests; no generated function report |
| `QUERY-002` | `🌗` | `partial` | `source+tests` | IN: path/transform queries | `QUERY-002` — broad runtime; domain/precision/consumer parity incomplete |
| `CON-001` | `🌗` | `partial` | `source+tests` | IN: post-resolve directional constraints | `CON-001` — constraint implementation exists; active diagnostics center on align |
| `CON-002` | `🌗` | `partial` | `direct-local` | IN: violation payload without geometry mutation | `CON-002` — fixture 14 verifies align; all constraint types not shared |

### E. Presentation dan metadata

| ID | Result | Implementation | Evidence | Scope decision | Audit trace / gap |
| --- | --- | --- | --- | --- | --- |
| `PRES-001` | `🌗` | `partial` | `historical/local` | IN: dimension presentation | `PRES-001` — dimension runtime/legacy tests; active v0.5 coverage thin |
| `PRES-002` | `🌗` | `partial` | `historical/local` | IN: annotation presentation | `PRES-002` — annotation runtime/tests; active/escaping coverage incomplete |
| `PRES-003` | `🌗` | `partial` | `source+tests` | IN: drawing roles/filter/defaults | `PRES-003` — role source/rendering exists; host parity incomplete |
| `PRES-004` | `🌗` | `partial` | `source+tests` | IN: views/sheets composition | `PRES-004` — resolver/CLI/legacy fixture; current v0.5/host evidence incomplete |
| `META-001` | `🌗` | `partial` | `direct-local` | IN: non-geometric metadata | `META-001` — metadata runtime exists; full field/security consumer coverage incomplete |
| `META-002` | `🌗` | `partial` | `direct-local` | IN: presets/inherit; legacy alias bounded | `META-002` — inherit tests/schema; provenance and all merge cases incomplete |

### F. Diagnostics, error model, serialization, compatibility

| ID | Result | Implementation | Evidence | Scope decision | Audit trace / gap |
| --- | --- | --- | --- | --- | --- |
| `DIAG-001` | `🌗` | `partial` | `direct-local` | IN: structured diagnostics by phase | `DIAG-001` — phase/code/severity/path/message/range and mode boundaries are normatively specified; producer and fixture coverage remains incomplete |
| `DIAG-002` | `⚠️` | `broken` | `direct-local` | IN: stable code/path/payload | `DIAG-002` — structured contract is frozen, but raw `Error` paths still conflict with the public boundary until downstream producers normalize them |
| `ERR-001` | `🌗` | `partial` | `direct-local` | IN: phase ordering/fail-safe modes | `ERR-001` — tolerant/compile modes and post-resolve boundaries are specified; cross-consumer coverage remains incomplete |
| `SER-001` | `🌗` | `partial` | `direct-local` | IN expected; canonical JSON contract unresolved | `SER-001` — JSON output/snapshots exist; no normative generated shape |
| `SER-002` | `🌗` | `partial` | `direct-local` | IN layered SVG contract; raw bytes OUT | `SER-002` — semantic projection, hostile-input escaping, and raw-byte non-parity are specified; broader consumer evidence remains incomplete |
| `VER-001` | `✔️` | `implemented` | `direct-local` | IN: explicit/omitted version | `VER-001` — parser/schema/negative fixtures |
| `VER-002` | `✔️` | `implemented` | `direct-local` | IN: active/legacy/regression/future policy | `VER-002` — manifest/parser/compatibility checker |
| `VER-003` | `🌗` | `partial` | `source+tests` | IN limited: documented aliases/fallbacks only | `VER-003` — styles/metaPresets aliases are bounded by the checked catalog; provenance and downstream alias coverage are not centralized |
| `VER-004` | `✔️` | `implemented` | `direct-local` | IN: fixture promotion/status governance | `VER-004` — manifest policy and conformance enforcement |

## 4. Absence and not-applicable guardrails

The join currently has no `❌` row because the audit found at least a partial
source/runtime realization for every expected ID. This must not be read as
"everything exists”: 35 rows are `🌗`, two are `⚠️`, and several evidence tiers
are not current external verification.

If a future audit proves that an expected ID has no implementation at all, its
row must remain in this table and change to:

```text
Result: ❌
Implementation: absent
Evidence: direct boundary inspection proving absence
Scope decision: unchanged from expected catalog
```

`➖` is reserved for explicit non-applicability only. It is not a placeholder
for missing evidence. Current out-of-scope items—3D, animation/timeline,
statement-level scripting, general constraint solving, mobile delivery, and
publishable Flutter packaging—remain in the audit's scope register rather than
being silently joined as language capabilities.

## 5. Evidence and scope boundaries

- Current local results: conformance `298/298`, core `469/469`, language-service
  `82/82`, CLI `36/36`, Playground `104/104`, website build `138 pages`, and
  Flutter `302` tests. Node commands emitted a Node `22.23.2` versus required
  `>=24` warning.
- Local results are not promoted to canonical CI, registry, public Pages,
  browser E2E, native/device Flutter, or MCP transport/runtime evidence. MCP
  test execution was environment-blocked by Dart/package/host-write failures.
- `docs/MATURATION-MASTER-PLAN.md` establishes source-of-truth and compatibility
  policy; `docs/REPOSITORY-MAP.md` establishes repository ownership and consumer
  boundaries.
- Existing surface audits are trace evidence only. The expected list came from
  the expected catalog before implementation reconciliation.

## 5A. Downstream contract handoff

The following table is the consumption boundary for downstream owners. “Checked”
means a local deterministic check or focused test has run; it does not mean that
every consumer has adopted the contract.

| Contract | Normative source | Checked/local evidence | Downstream owner | Unresolved promotion gate |
| --- | --- | --- | --- | --- |
| Vocabulary, types, fields, aliases, and status labels | `spec/id/` plus [`normative-vocabulary-catalog.json`](./normative-vocabulary-catalog.json) | `pnpm run language-spec:check` | spec owner; core, language-service, CLI, and MCP consumers | full generated consumer catalog and cross-repository parity |
| Structured diagnostics and error model | `spec/id/core/04-evaluation-order.md`, `05-semantic-guarantees.md`, `06-error-model.md` | core tests and language-spec check; raw-error normalization remains open | core/language-service/CLI/MCP owners | producer normalization, complete stable-code coverage, and consumer fixtures |
| Dimensions, annotations, drawing roles, and metadata | `spec/id/presentation/22-dimension.md`, `23-annotation.md`, `24-drawing-roles.md`, `26-metadata.md` | renderer/core focused tests and language-spec check | core/renderer-svg/consumer owners | all supported kinds/hosts and canonical conformance evidence |
| Safe semantic SVG serialization | presentation contract and hostile-input/semantic-output fixtures | renderer-svg focused tests; raw SVG byte equality explicitly out of scope | renderer-svg and consumer owners | browser/native consumer evidence and semantic parity across hosts |

The handoff is consumable from the checked source tree and does not require an
npm or pub.dev release, registry publication, or production deployment. Those
may be promotion/release gates later, but they are not prerequisites for
downstream implementation or contract validation. Until the unresolved gates
are closed, rows remain `partial`, `broken`, or `not verified` as applicable.

## 6. Evidence register

The reconciliation is grounded in the required source-of-truth and discovery
evidence; these sources define expectation, ownership, and audit boundaries but
do not override the per-ID findings above:

- [`spec/id/`](../../../spec/id) — normative language contract;
- [`docs/MATURATION-MASTER-PLAN.md`](../../MATURATION-MASTER-PLAN.md) — roadmap,
  compatibility line, and product decisions;
- [`docs/REPOSITORY-MAP.md`](../../REPOSITORY-MAP.md) — ownership and consumer
  boundaries;
- [`docs/capability-map/INVENTORY-PROTOCOL.md`](../INVENTORY-PROTOCOL.md) and
  [`SURFACE-DISCOVERY-LEDGER.md`](../SURFACE-DISCOVERY-LEDGER.md) — discovery,
  evidence, and status rules;
- [`language-specification/expected-capability-catalog.md`](./expected-capability-catalog.md)
  — expected ID set; and
- [`language-specification/normative-vocabulary-catalog.json`](./normative-vocabulary-catalog.json)
  — checked vocabulary projection and drift-check scope; and
- [`language-specification/implementation-audit.md`](./implementation-audit.md)
  — observed source/test/consumer/runtime findings.
