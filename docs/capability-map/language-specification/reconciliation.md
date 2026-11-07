# Language Specification Expected-versus-Observed Reconciliation

**Tanggal:** 2026-11-07
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
| `GAP-002` — `DECL-001`, `DECL-004`, `EVAL-002` plus `TYPE-001` runtime coercion | Parameters accept declared defaults, shorthand, and supported structured values; the selected profile overrides parameters only; evaluation order is parameters → profiles → constants → derived; explicit units normalize to `scene.unit` and contextual unitless numbers follow the type contract. | Missing/invalid values, invalid unit syntax, incompatible coercion, or illegal arithmetic fail with the documented structured diagnostic; profiles cannot override constants or act as styling. | Active shared fixture 16; core, CLI, language-service, renderer, and targeted Flutter projections; `pnpm conformance:fixtures`; canonical Node-24/CI/native-host evidence remains a separate verification boundary. |
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
| Current `⚠️` rows | 0 |
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
| `LANG-002` | `✔️` | `implemented` | `direct-local` | IN: deterministic relation-first; no solver/control flow | `LANG-002` — checked vocabulary/coercion projection plus graph/resolver and evaluator regression evidence; host/CI parity remains separate |
| `DOC-001` | `✔️` | `implemented` | `direct-local` | IN: root sections | `DOC-001` — parser/validator and fixture 10 |
| `DOC-002` | `✔️` | `implemented` | `direct-local` | IN: 2D scene/unit configuration | `DOC-002` — scene, units, viewport tests |
| `DOC-003` | `✔️` | `implemented` | `direct-local` | IN: readable/editorial vocabulary | `DOC-003` — status labels and the rule that informative examples cannot extend DSL vocabulary are enforced by `language-spec:check` |

### B. Declarations, types, expressions, dan evaluation

| ID | Result | Implementation | Evidence | Scope decision | Audit trace / gap |
| --- | --- | --- | --- | --- | --- |
| `DECL-001` | `✔️` | `implemented` | `direct-local` | IN: typed parameters; active bounded fixture 16 | `DECL-001` — typed defaults/structured values/profile overrides and derived placement pass Core/CLI/Flutter-local evidence |
| `DECL-002` | `✔️` | `implemented` | `direct-local` | IN: immutable constants | `DECL-002` — constants resolver/tests; shared immutability negatives limited |
| `DECL-003` | `✔️` | `implemented` | `direct-local` | IN: read-only derived/global/local scope | `DECL-003` — evaluator and derived access tests |
| `DECL-004` | `✔️` | `implemented` | `direct-local` | IN: parameter profiles only | `DECL-004` — profile-only override contract and negative boundaries pass validator, Core, CLI, fixture 28, and active fixture 16 evidence |
| `TYPE-001` | `✔️` | `implemented` | `direct-local` | IN: scalar typed values | `TYPE-001` — evaluator and validator enforce the checked v0.5 coercion boundary, including contextual length addition and rejected length²/number÷length cases |
| `TYPE-002` | `✔️` | `implemented` | `direct-local` | IN: structured 2D types | `TYPE-002` — validator shape contract, focused parameter regression, and fixture 29/conformance evidence cover frame2d, bbox2d, collection, and path-ref |
| `EXPR-001` | `✔️` | `implemented` | `direct-local` | IN: arithmetic/precedence subset | `EXPR-001` — evaluator and tests |
| `EXPR-002` | `✔️` | `implemented` | `direct-local` | IN: comparison/logical/ternary; statements OUT | `EXPR-002` — evaluator/parser validation |
| `EXPR-003` | `✔️` | `implemented` | `direct-local` | IN: symbol/property/index/anchor refs | `EXPR-003` — graph/eval context/reference tests |
| `EVAL-001` | `✔️` | `implemented` | `direct-local` | IN: dependency graph/topological evaluation | `EVAL-001` — graph/resolver/conformance; cycle fixtures not exhaustive |
| `EVAL-002` | `✔️` | `implemented` | `direct-local` | IN expected; active bounded v0.5 units/evaluator fixture | `EVAL-002` — normalized units, target-unit output, and derived geometry pass Core/CLI/Flutter-local evidence and active conformance |

### C. Geometry, composition, placement, dan anchors

| ID | Result | Implementation | Evidence | Scope decision | Audit trace / gap |
| --- | --- | --- | --- | --- | --- |
| `OBJ-001` | `✔️` | `implemented` | `direct-local` | IN: stable identity/object model | `OBJ-001` — parser/resolver/types and snapshots |
| `GEO-001` | `✔️` | `implemented` | `source+tests+fixture` | IN: 2D point modes | `GEO-001` — fixture 31 and Core/geometry tests cover absolute/relative/from-to/intersection point outcomes with typed deterministic projection. |
| `GEO-002` | `✔️` | `implemented` | `source+tests+fixture` | IN: line construction modes | `GEO-002` — fixture 31 covers from-to and direction-length; structured invalid-length/tangent boundaries remain tested. |
| `GEO-003` | `✔️` | `implemented` | `source+tests+fixture` | IN: rect/circle/ellipse | `GEO-003` — fixture 31 covers primitive dimensions, placement, anchors, and holes with resolved JSON/SVG snapshots. |
| `GEO-004` | `✔️` | `implemented` | `source+tests+fixture` | IN: curves/path/polygon/text | `GEO-004` — fixture 31 projects every supported v0.5 curve/path/text kind through Core, renderer, CLI, LS, and Markdown conformance. |
| `GEO-005` | `✔️` | `implemented` | `source+tests+fixture` | IN: closed shapes/topology | `GEO-005` — fixture 31 preserves closed-path closure and hole topology without implicit repair. |
| `COMP-001` | `✔️` | `implemented` | `source+tests+fixture` | IN: group hierarchy/transforms | `COMP-001` — fixture 31 and group/anchor tests prove hierarchy and deterministic post-transform projection. |
| `COMP-002` | `✔️` | `implemented` | `source+tests+fixture` | IN: clone/reuse | `COMP-002` — fixture 31 plus clone contract tests prove identity, metadata, and transformed inherited geometry. |
| `COMP-003` | `✔️` | `implemented` | `source+tests+fixture` | IN: component params/local derived/exports | `COMP-003` — fixture 31 covers component parameter/export projection; nested private-member and dependency-order regressions remain tested. |
| `PLACE-001` | `✔️` | `implemented` | `source+tests+fixture` | IN: generic directional placement | `PLACE-001` — fixture 31 covers topLeft, inside margin, and named-anchor placement; negative placement diagnostics remain stable. |
| `PLACE-002` | `✔️` | `implemented` | `direct-local` | IN: on.point | `PLACE-002` — point/anchor placement tests |
| `PLACE-003` | `✔️` | `implemented` | `source+tests+fixture` | IN: on.path | `PLACE-003` — fixture 31 covers deterministic path parameterization and explicit anchor placement; domain/unknown-field diagnostics remain tested. |
| `PLACE-004` | `✔️` | `implemented` | `source+tests` | IN: on.frame | `PLACE-004` — frame placement/tangent tests; consumer parity limited |
| `ANCH-001` | `✔️` | `implemented` | `source+tests+fixture` | IN: typed named/world anchors | `ANCH-001` — fixture 31 covers custom named-anchor and transformed world access; missing-anchor path diagnostics remain stable. |

### D. Collections, queries, dan constraints

| ID | Result | Implementation | Evidence | Scope decision | Audit trace / gap |
| --- | --- | --- | --- | --- | --- |
| `COLL-001` | `✔️` | `implemented` | `source+tests+fixture` | IN: repeat modes/identity | `COLL-001` — fixtures 24 and 32 plus Core regressions cover active repeat contexts, deterministic child identity/order, and collection projection. |
| `COLL-002` | `✔️` | `implemented` | `source+tests+fixture` | IN: divide/split collections | `COLL-002` — fixture 32 and split/divide regressions cover collection/path result shapes, pick/index behavior, and invalid boundaries. |
| `COLL-003` | `✔️` | `implemented` | `source+tests+fixture` | IN expected; bounded v0.5 boolean boundary active | `COLL-003` — fixtures 15, 19, 20, 24, and 32 cover the approved operations plus explicit empty/multipart result errors. |
| `COLL-004` | `✔️` | `implemented` | `source+tests+fixture` | IN: collection access/order/functions | `COLL-004` — fixture 32 and eval-context regressions cover ordering, count/first/last/index, empty behavior, structured errors, and no mutation. |
| `QUERY-001` | `✔️` | `implemented` | `source+tests` | IN: scalar/bbox geometry queries | `QUERY-001` — evaluator/query tests; no generated function report |
| `QUERY-002` | `✔️` | `implemented` | `source+tests+fixture` | IN: path/transform queries | `QUERY-002` — fixture 31 covers typed pointAt/tangentAt/toWorld values; domain and tolerance boundaries remain directly tested. |
| `CON-001` | `✔️` | `implemented` | `source+tests+fixture` | IN: post-resolve directional constraints | `CON-001` — fixture 32 relation matrix and constraint regressions cover equal/parallel/perpendicular/tangent and degenerate/reference boundaries without mutation. |
| `CON-002` | `✔️` | `implemented` | `source+tests+fixture` | IN: violation payload without geometry mutation | `CON-002` — fixtures 14 and 32 plus diagnostic regressions cover stable type/path/object/expected/actual payloads and unchanged resolved geometry. |

### E. Presentation dan metadata

| ID | Result | Implementation | Evidence | Scope decision | Audit trace / gap |
| --- | --- | --- | --- | --- | --- |
| `PRES-001` | `✔️` | `implemented` | `direct-local` | IN: dimension presentation | `PRES-001` — fixture 33 covers linear/radius/diameter/angle values, labels, roles, placement, and semantic projection |
| `PRES-002` | `✔️` | `implemented` | `direct-local` | IN: annotation presentation | `PRES-002` — fixture 33 covers basic/leader/target fallback and hostile text/attribute escaping through CLI/Markdown conformance |
| `PRES-003` | `✔️` | `implemented` | `direct-local` | IN: drawing roles/filter/defaults | `PRES-003` — fixture 33 and renderer semantic tests cover role identity, visibility, defaults, and filtering boundary |
| `PRES-004` | `✔️` | `implemented` | `direct-local` | IN: views/sheets composition | `PRES-004` — fixture 33 covers v0.5 scale/filter, portrait A4, topLeft/center placement, and sheet metadata without model mutation |
| `META-001` | `✔️` | `implemented` | `direct-local` | IN: non-geometric metadata | `META-001` — fixture 33, Core invariance regression, and renderer semantic/security checks cover document/object metadata safety |
| `META-002` | `✔️` | `implemented` | `direct-local` | IN: presets/inherit; legacy alias bounded | `META-002` — fixtures 30/33 and inherit/schema tests cover ordered preset/style alias merge and local override precedence |

### F. Diagnostics, error model, serialization, compatibility

| ID | Result | Implementation | Evidence | Scope decision | Audit trace / gap |
| --- | --- | --- | --- | --- | --- |
| `DIAG-001` | `✔️` | `implemented` | `direct-local` | IN: structured diagnostics by phase | `DIAG-001` — Core, language-service, CLI, Markdown, and 33-fixture conformance evidence cover parse/validate/resolve/runtime/constraint mappings; Node 24/CI/Flutter/MCP/native-host evidence remains not verified |
| `DIAG-002` | `✔️` | `implemented` | `direct-local` | IN: stable code/path/payload | `DIAG-002` — audited production sources contain no raw `Error` constructor throw; repeat/sheet boundary regressions and consumer mappings preserve stable code/phase/path/object fields |
| `ERR-001` | `✔️` | `implemented` | `direct-local` | IN: phase ordering/fail-safe modes | `ERR-001` — tolerant editor recovery, strict validate/compile behavior, runtime no-output behavior, and CLI/language-service/Markdown mappings pass local evidence; host runtime remains not verified |
| `SER-001` | `✔️` | `implemented` | `direct-local` | IN expected; canonical JSON contract | `SER-001` — fixture 33 expected JSON plus Core serializer/replay and CLI/conformance checks lock identity/order/finite numbers/views/sheets |
| `SER-002` | `✔️` | `implemented` | `direct-local` | IN layered SVG contract; raw bytes OUT | `SER-002` — fixture 33 semantic SVG, renderer security/replay tests, and CLI/Markdown conformance prove safe semantic serialization; raw byte equality remains excluded |
| `VER-001` | `✔️` | `implemented` | `direct-local` | IN: explicit/omitted version | `VER-001` — parser/schema/negative fixtures |
| `VER-002` | `✔️` | `implemented` | `direct-local` | IN: active/legacy/regression/future policy | `VER-002` — manifest/parser/compatibility checker |
| `VER-003` | `✔️` | `implemented` | `source+tests` | IN: documented aliases/fallbacks only | `VER-003` — checked alias catalog and resolver semantic-equivalence regression cover `styles`/`style` and `metaPresets`/`metaPreset`; downstream host parity remains separate |
| `VER-004` | `✔️` | `implemented` | `direct-local` | IN: fixture promotion/status governance | `VER-004` — manifest policy and conformance enforcement |

## 4. Absence and not-applicable guardrails

The join currently has no `❌`, `🌗`, or `⚠️` row: all 53 expected IDs have
local implementation, focused regression, and active fixture evidence on the
audited boundary. This must not be read as canonical external verification;
Node-24 CI, browser, native-host, and some Flutter/MCP evidence tiers remain
separate limitations.

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

- Current local results: conformance `677/677` across 33 fixtures, core
  `579/579`, language-service `91/91`, CLI `40/40`, renderer `110/110`,
  remark-relgeo `18/18`, remark-relgeo-hl `11/11`, and Playground `108/108`.
  This checkpoint used Node `22.23.2` even though the repository declares Node
  `>=24`; Flutter/MCP runtime, browser/native-host, and canonical CI remain
  unverified.
- The 2026-11-06 refresh also passed `spec:snapshot:check` and
  `spec:snapshot:test` after synchronizing 35 Markdown files and the generated
  manifest from `spec/id`. This is generated-asset evidence only; it does not
  promote the Flutter/MCP runtime boundary.
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
| Structured diagnostics and error model | `spec/id/core/04-evaluation-order.md`, `05-semantic-guarantees.md`, `06-error-model.md` | Core/LS/CLI/Markdown tests, raw-throw inventory, conformance, and language-spec check | core/language-service/CLI/Markdown owners | Node-24/CI/Flutter/MCP/browser/native-host evidence and any future code additions |
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
