# Expected Core Runtime Capability Catalog

**Status:** expected catalog baseline; implementation status is assigned only by
the downstream audit and reconciliation artifacts

**Tanggal katalog:** 2026-10-30

**Compatibility line:** RelGeo DSL `0.5`

**Owner keputusan dan katalog:** `relgeo/workspace`

**Runtime boundary:** `core` sebagai mesin parse, semantic model, validate,
dependency graph, evaluate, resolve, diagnostics, dan semantic execution.

## 1. Tujuan dan aturan baca

Dokumen ini menetapkan capability yang **seharusnya tersedia** untuk core
runtime berdasarkan journey pengguna, workflow produk, command surface, roadmap,
kontrak DSL, compatibility policy, dan keputusan scope. Capability tetap dicatat
meskipun belum pernah diimplementasikan atau belum memiliki evidence.

Katalog ini adalah input sebelum audit. Setiap row memiliki:

- ID stabil;
- user outcome;
- dasar requirement;
- keputusan scope;
- owner/source of truth; dan
- status verifikasi katalog.

`PENDING-AUDIT` berarti row belum dibandingkan dengan source implementation,
test, atau matrix lama. Nilai itu bukan klaim bahwa capability sudah tersedia
atau tidak tersedia.

Aturan pemisahan sumber:

- `spec/id/` menetapkan makna normatif DSL;
- master plan, contract-versioning plan, README consumer, dan fixture manifest
  menetapkan workflow, boundary, compatibility, dan provenance;
- kode serta matrix/audit capability lama **bukan sumber daftar awal**; keduanya
  baru boleh dipakai pada pekerjaan audit downstream.

## 2. Target pengguna dan expected journey

Katalog ini melayani:

- author gambar parametrik dan technical drawing;
- reviewer yang perlu memahami relasi, nilai, dan diagnostics;
- pengguna Playground browser dan Flutter workbench;
- pengguna CLI/shell/CI; dan
- integrator yang memakai `@relgeo/core` untuk tooling atau renderer.

Journey minimum yang harus didukung oleh core:

```mermaid
flowchart LR
  author["Author / CLI / workbench"] --> input["RelGeo source"]
  input --> parse["Parse + semantic model"]
  parse --> validate["Validate"]
  validate --> graph["Build dependency graph"]
  graph --> evaluate["Evaluate values and queries"]
  evaluate --> resolve["Resolve semantic geometry"]
  resolve --> inspect["Inspect values, graph, constraints, diagnostics"]
  resolve --> output["Resolved scene / consumer API"]
  output --> preview["Renderer, Playground, Flutter, or CI"]
```

Command and product outcomes that establish the core boundary:

| Consumer workflow | Expected core outcome |
| --- | --- |
| CLI `info <file>` | Read document metadata, parameters/profiles, and DSL version without losing semantic contract. |
| CLI `compile <file>` | Parse, validate, resolve, calculate bounds, and emit a consumer-readable result. |
| CLI `check <file>` / validate flow | Resolve enough to report semantic failures without emitting render output. |
| CLI `--format json` / `svg` / `graph` | Provide stable semantic scene, renderer input, or dependency graph output; renderer formatting remains outside core ownership. |
| Playground edit → resolve → preview → inspect | Return diagnostics and resolved scene data quickly while preserving a useful boundary during temporary invalid input. |
| Flutter workbench | Consume the same DSL semantics and shared fixtures at the approved semantic boundary; Flutter UX is not core source of truth. |
| TypeScript integration | Import a documented public API for parsing, resolving, querying, and consuming typed results without reaching into private internals. |

## 3. Requirement register and scope decisions

| Code | Requirement / decision | Source of truth |
| --- | --- | --- |
| `R-JOURNEY` | RelGeo is a relation-first, typed, deterministic language for declarative parametric geometry and human/LLM-readable source. | `spec/id/core/01-overview.md`; `core/README.md`; `docs/MATURATION-MASTER-PLAN.md` §2.3–§2.5 |
| `R-PIPELINE` | The semantic pipeline is document → parser → validator → resolver → geometry runtime → consumer/renderer. | `spec/id/core/01-overview.md`; `docs/MATURATION-MASTER-PLAN.md` §3.2 |
| `R-MODEL` | Document sections, typed values, parameters, constants, derived values, profiles, components, objects, constraints, views, sheets, and metadata have explicit semantics. | `spec/id/core/02-document-structure.md`; `spec/id/syntax/`; `spec/id/geometry/`; `spec/id/presentation/` |
| `R-ORDER` | Evaluation follows explicit phase order and dependency graph; cycles are errors, not implicit repairs. | `spec/id/core/04-evaluation-order.md`; `spec/id/core/05-semantic-guarantees.md` |
| `R-VALIDATE` | Validation covers structure, types, expressions, references, geometry, topology, and constraint boundaries with actionable errors. | `spec/id/core/06-error-model.md`; `spec/id/syntax/`; `spec/id/geometry/` |
| `R-SEMANTIC` | Core exposes semantic geometry, queries, anchors, transforms, collections, and post-resolve constraints without becoming a general constraint solver. | `core/README.md`; `spec/id/geometry/`; `spec/id/core/05-semantic-guarantees.md` |
| `R-ROBUST` | Same input produces same result; identity, ordering, tolerance, and error paths are stable and no silent auto-fix is allowed. | `spec/id/core/05-semantic-guarantees.md`; `spec/id/core/06-error-model.md` |
| `R-COMPAT` | Active DSL line is `0.5`; omitted version defaults to active; supported legacy and unsupported future behavior is explicit. | `docs/compatibility-matrix.json`; `docs/plans/02-contract-versioning.md`; `fixtures/manifest.json` |
| `R-CONSUMER` | Core is a reusable public runtime consumed by CLI, Playground, renderer, language tooling, fixtures, and Flutter at explicit boundaries. | `core/README.md`; `cli/README.md`; `playground/README.md`; `docs/MATURATION-MASTER-PLAN.md` §3.1–§3.2 |
| `R-CONFORMANCE` | Shared fixtures distinguish active, supported-legacy, invalid, runtime-diagnostic, runtime-error, and capability evidence. | `fixtures/manifest.json`; `docs/MATURATION-MASTER-PLAN.md` Tahap 4 dan Tahap 6 |

Scope decisions for this catalog:

- **IN:** parse/input pipeline, semantic model, structural and semantic
  validation, dependency graph, typed evaluator, units, resolver, constraints,
  structured diagnostics, recovery behavior, determinism, public API,
  compatibility, and integration behavior at the core boundary.
- **IN WITH BOUNDARY:** views/sheets and presentation metadata are semantic
  inputs/outputs for core, while SVG styling and final rendering belong to the
  renderer; Flutter is a consumer, not core ownership.
- **IN WITH BOUNDARY:** constraints validate resolved geometry after resolution;
  core must not become a general equation or constraint solver.
- **IN WITH BOUNDARY:** compatibility includes active `0.5`, supported legacy
  `0.4`, regression-only `0.1`–`0.3`, omitted-version defaulting, and rejection
  of unsupported future versions as declared by the manifest/policy.
- **OUT:** editor UX, browser/desktop layout, renderer-specific SVG policy,
  package publishing automation, native accessibility, and transport/host
  protocols. Core only supplies the semantic contract consumed by those
  surfaces.
- **HELD / DECISION BOUNDARY:** candidate promotion is not silently inferred
  from fixture existence. In particular, fixture 16 evaluator/unit remains a
  capability candidate in the current project decision.

## 4. Expected capability catalog

All rows below have `PENDING-AUDIT` by design. The later audit must preserve
these IDs and add implementation evidence, parity, and gap status rather than
rewriting the expected set.

This deliberately includes capabilities that may be absent at the `core`
boundary. For example, deterministic multi-diagnostic aggregation,
source-location preservation, and a versioned resolved-scene contract remain
expected rows even when implementation evidence is incomplete or absent. The
catalog does not convert those observations into status symbols; that belongs
to the audit and reconciliation stages.

### A. Input pipeline and AST/semantic model

| ID | Capability | User outcome | Dasar requirement | Scope decision | Owner / source of truth | Status verifikasi |
| --- | --- | --- | --- | --- | --- | --- |
| `CORE-INPUT-001` | Accept a RelGeo source document and establish the active document boundary, including omitted-version defaulting. | Author/CLI can submit a document without manually constructing runtime objects. | `R-PIPELINE`, `R-COMPAT` | **IN**; source ingestion is read-only and version-aware. | `relgeo/spec`; `spec/id/core/01-overview.md`, `02-document-structure.md` | `PENDING-AUDIT` |
| `CORE-INPUT-002` | Parse YAML/document syntax into a structured intermediate representation with source locations where available. | Syntax mistakes are distinguishable from later semantic failures. | `R-PIPELINE`, `R-VALIDATE` | **IN**; parse result must not be mistaken for resolved geometry. | `relgeo/spec`; `spec/id/core/01-overview.md`, `06-error-model.md` | `PENDING-AUDIT` |
| `CORE-MODEL-001` | Represent the normative document sections: version, scene, parameters, constants, derived, profiles, meta presets, components, objects, constraints, views, sheets, and metadata. | Integrators can consume one semantic document model across CLI, Playground, and workbench. | `R-MODEL` | **IN**; optional sections remain semantically distinct. | `relgeo/spec`; `spec/id/core/02-document-structure.md` | `PENDING-AUDIT` |
| `CORE-MODEL-002` | Preserve typed values, object identity, namespaces, references, collections, and component scope in the semantic model. | Relations remain readable and addressable instead of degrading to untyped JSON. | `R-MODEL`, `R-SEMANTIC` | **IN**; identity is user-declared and stable; private component scope stays private. | `relgeo/spec`; `spec/id/syntax/07-type-system.md`; `spec/id/geometry/13-object-model.md`, `15-composition-objects.md` | `PENDING-AUDIT` |
| `CORE-MODEL-003` | Model scene coordinate policy, orientation, origin, auto-size, padding, and normalized unit context. | The same document can resolve predictably in a declared coordinate/unit context. | `R-MODEL`, `R-SEMANTIC` | **IN**; scene policy affects resolution context, not arbitrary metadata. | `relgeo/spec`; `spec/id/core/03-scene.md` | `PENDING-AUDIT` |

### B. Validation and error recovery

| ID | Capability | User outcome | Dasar requirement | Scope decision | Owner / source of truth | Status verifikasi |
| --- | --- | --- | --- | --- | --- | --- |
| `CORE-VALID-001` | Validate root/document structure, required fields, identifiers, object kinds, and section-specific schema. | Author receives an actionable structural error before resolution proceeds. | `R-VALIDATE`, `R-MODEL` | **IN**; invalid structure cannot be silently normalized into another meaning. | `relgeo/spec`; `spec/id/core/02-document-structure.md`, `spec/id/geometry/13-object-model.md` | `PENDING-AUDIT` |
| `CORE-VALID-002` | Validate typed values, expressions, parameter/default contracts, profiles, constants, and derived declarations. | A parameterized document fails clearly when a value has the wrong type or scope. | `R-VALIDATE`, `R-SEMANTIC` | **IN**; coercion is explicit and context-bounded. | `relgeo/spec`; `spec/id/syntax/07-type-system.md`–`12-expressions.md` | `PENDING-AUDIT` |
| `CORE-VALID-003` | Validate references, component exports/scope, placement targets, query inputs, and dependency legality. | Unknown or private references are reported at the source location/path that caused them. | `R-VALIDATE`, `R-ORDER` | **IN**; no implicit reference repair. | `relgeo/spec`; `spec/id/geometry/15-composition-objects.md`, `17-placement.md`, `20-geometry-queries.md` | `PENDING-AUDIT` |
| `CORE-VALID-004` | Validate geometry/path topology, closed-shape requirements, operation modes, and invalid/degenerate inputs. | Invalid geometry is rejected before it can corrupt downstream scene output. | `R-VALIDATE`, `R-ROBUST` | **IN**; path/boolean/offset/tangent boundaries remain explicit. | `relgeo/spec`; `spec/id/geometry/14-geometry-objects.md`, `16-collection-objects.md`, `21-constraints.md` | `PENDING-AUDIT` |
| `CORE-ERROR-001` | Provide editor-tolerant parsing/validation and bounded partial recovery for incomplete source. | Playground/editor can keep a useful diagnostic loop while the user is typing. | `R-JOURNEY`, `R-VALIDATE`, `R-CONSUMER` | **IN WITH BOUNDARY**; recovery must not be used to claim compile/resolve success. | `relgeo/spec` error model; `playground/README.md`; `docs/MATURATION-MASTER-PLAN.md` Tahap 5 | `PENDING-AUDIT` |
| `CORE-ERROR-002` | Keep compile/check behavior strict and distinguish parse, validation, resolution, runtime, and constraint failures. | CLI/CI can fail deterministically and choose the correct remediation path. | `R-VALIDATE`, `R-CONSUMER`, `R-CONFORMANCE` | **IN**; no silent auto-fixing or error swallowing. | `spec/id/core/06-error-model.md`; `cli/README.md`; `fixtures/manifest.json` invalid/runtime entries | `PENDING-AUDIT` |

### C. Dependency graph and evaluator

| ID | Capability | User outcome | Dasar requirement | Scope decision | Owner / source of truth | Status verifikasi |
| --- | --- | --- | --- | --- | --- | --- |
| `CORE-GRAPH-001` | Extract dependencies from parameters, derived values, objects, placements, paths, components, operations, collections, queries, and transforms. | Runtime understands relation intent instead of relying on declaration order. | `R-ORDER`, `R-SEMANTIC` | **IN**; every geometry-affecting relation must be explicit. | `relgeo/spec`; `spec/id/core/04-evaluation-order.md`, `spec/id/core/05-semantic-guarantees.md` | `PENDING-AUDIT` |
| `CORE-GRAPH-002` | Topologically order unified semantic nodes and detect circular dependencies with structured failure. | Authors can declare objects in readable order without hidden cycle behavior. | `R-ORDER`, `R-ROBUST` | **IN**; cycles are errors, never auto-broken. | `relgeo/spec`; `spec/id/core/04-evaluation-order.md`, `06-error-model.md` | `PENDING-AUDIT` |
| `CORE-EVAL-001` | Evaluate typed arithmetic, comparison, logic, conditional, member/index, and function expressions deterministically. | Derived geometry and labels respond to parameters without ambiguous coercion or side effects. | `R-SEMANTIC`, `R-ROBUST` | **IN**; evaluator is pure with respect to the document context. | `relgeo/spec`; `spec/id/syntax/07-type-system.md`, `12-expressions.md` | `PENDING-AUDIT` |
| `CORE-EVAL-002` | Resolve parameter defaults, active profiles, constants, derived values, and local component-derived values in the declared phase order. | One input can produce reusable variants while preserving dependency semantics. | `R-MODEL`, `R-ORDER` | **IN**; profile overrides do not rewrite source and component-local values do not leak globally. | `relgeo/spec`; `spec/id/core/04-evaluation-order.md`; `spec/id/syntax/08-parameters.md`–`11-profiles.md` | `PENDING-AUDIT` |
| `CORE-EVAL-003` | Evaluate geometry queries, anchors, intersections, selectors, frames, and coordinate conversions as typed semantic values. | Authors can construct new geometry from meaningful relationships and inspect derived values. | `R-SEMANTIC`, `R-ORDER` | **IN**; ambiguous multi-results require an explicit selector or a structured error. | `relgeo/spec`; `spec/id/geometry/18-anchors.md`, `20-geometry-queries.md` | `PENDING-AUDIT` |
| `CORE-UNIT-001` | Normalize and convert explicit/unitless lengths and angles against scene unit policy, including supported `px`, `mm`, `cm`, `m`, `in`, `rad`, and `deg` boundaries. | A document can be evaluated in its declared unit without losing semantic scale. | `R-MODEL`, `R-SEMANTIC`, `R-COMPAT` | **IN WITH BOUNDARY**; unitless numbers become lengths only in length contexts. | `relgeo/spec`; `spec/id/core/03-scene.md`; `spec/id/syntax/07-type-system.md`; fixture `v05-evaluator-units-candidate` | `PENDING-AUDIT` |

### D. Resolver and semantic execution

| ID | Capability | User outcome | Dasar requirement | Scope decision | Owner / source of truth | Status verifikasi |
| --- | --- | --- | --- | --- | --- | --- |
| `CORE-RESOLVE-001` | Resolve primitive, path, text, composition, collection, and geometry-operation objects into typed semantic geometry. | A valid source becomes a reusable resolved scene rather than an untyped parse tree. | `R-PIPELINE`, `R-SEMANTIC` | **IN**; supported object semantics come from the DSL contract. | `relgeo/spec`; `spec/id/geometry/13-object-model.md`–`16-collection-objects.md` | `PENDING-AUDIT` |
| `CORE-RESOLVE-002` | Apply placement, anchors, transforms, group/clone/component scope, and world/local coordinate semantics in a stable order. | Users can reuse and reposition geometry by relation instead of manual coordinate duplication. | `R-SEMANTIC`, `R-ORDER`, `R-ROBUST` | **IN**; post-transform access and operation identity rules are explicit. | `relgeo/spec`; `spec/id/core/03-scene.md`; `spec/id/geometry/15-composition-objects.md`, `17-placement.md`, `18-anchors.md` | `PENDING-AUDIT` |
| `CORE-RESOLVE-003` | Resolve repeat/divide/split/boolean collections with stable identity, ordering, result modes, holes, and topology boundaries. | Patterned and multi-result geometry remains addressable and reproducible. | `R-SEMANTIC`, `R-ROBUST`, `R-CONFORMANCE` | **IN WITH BOUNDARY**; empty/multipart outcomes are explicit runtime errors when mode requires single output. | `relgeo/spec`; `spec/id/geometry/16-collection-objects.md`, `19-collections.md`; fixtures runtime-error entries | `PENDING-AUDIT` |
| `CORE-RESOLVE-004` | Resolve views, sheets, drawing roles, and metadata as downstream semantic composition without mutating the model geometry. | Consumers can inspect or compose presentation-facing output while preserving the core model. | `R-MODEL`, `R-CONSUMER` | **IN WITH BOUNDARY**; SVG styling/rendering remains renderer ownership. | `relgeo/spec`; `spec/id/presentation/24-drawing-roles.md`, `25-views-sheets.md`, `26-metadata.md` | `PENDING-AUDIT` |
| `CORE-RESOLVE-005` | Produce a typed resolved scene with stable object identity, geometry properties, bounds, values, graph information, and consumer-safe semantic projection. | CLI, inspector, renderer, and workbench can consume one resolved result. | `R-SEMANTIC`, `R-CONSUMER`, `R-CONFORMANCE` | **IN**; output contract is semantic, not a private object dump. | `core/` public runtime contract; `core/README.md`; `fixtures/manifest.json` expected resolved snapshots | `PENDING-AUDIT` |

### E. Units, constraints, diagnostics, and failure semantics

| ID | Capability | User outcome | Dasar requirement | Scope decision | Owner / source of truth | Status verifikasi |
| --- | --- | --- | --- | --- | --- | --- |
| `CORE-CONSTRAINT-001` | Evaluate post-resolve constraints such as equality, parallel, perpendicular, tangent, alignment, and domain-specific relation checks. | Reviewer/CI can verify declared relations against resolved geometry. | `R-SEMANTIC`, `R-ROBUST` | **IN WITH BOUNDARY**; constraints validate after geometry and do not rewrite it. | `spec/id/core/04-evaluation-order.md`, `05-semantic-guarantees.md`; `spec/id/geometry/21-constraints.md` | `PENDING-AUDIT` |
| `CORE-CONSTRAINT-002` | Return structured violations with constraint path, related objects, expected/actual context, and stable severity semantics. | Workbench and CLI can show what failed and why without losing the resolved scene boundary. | `R-VALIDATE`, `R-CONSUMER`, `R-CONFORMANCE` | **IN**; violation reporting is distinct from general exception handling. | `spec/id/core/06-error-model.md`; fixture `v05-runtime-align-violation` | `PENDING-AUDIT` |
| `CORE-DIAG-001` | Expose machine-readable diagnostics with stable code, message, severity, source path/range where available, object/dependency context, and origin phase. | Editors, CI, and agents can explain and act on failures programmatically. | `R-VALIDATE`, `R-CONSUMER` | **IN**; codes and paths are part of the public semantic boundary. | `spec/id/core/06-error-model.md`; `core/README.md`; `fixtures/manifest.json` invalid/runtime entries | `PENDING-AUDIT` |
| `CORE-DIAG-002` | Aggregate diagnostics deterministically and distinguish multiple diagnostics from the primary failure without changing semantic outcome. | The same invalid document gives stable, reviewable error output across consumers. | `R-ROBUST`, `R-CONFORMANCE` | **IN**; ordering and truncation rules must be explicit if bounded. | `spec/id/core/05-semantic-guarantees.md`, `06-error-model.md`; `fixtures/manifest.json` | `PENDING-AUDIT` |
| `CORE-ERROR-003` | Report no-intersection, multiple-intersection, circular, invalid offset/path, invalid boolean, and unsupported-version outcomes with distinct actionable semantics. | User can choose a selector, repair source, or change compatibility line instead of guessing. | `R-VALIDATE`, `R-ROBUST`, `R-COMPAT` | **IN**; error taxonomy must not collapse materially different causes. | `spec/id/core/06-error-model.md`; `fixtures/manifest.json` IDs 13, 17–20 | `PENDING-AUDIT` |

### F. Determinism, public API, compatibility, and integration behavior

| ID | Capability | User outcome | Dasar requirement | Scope decision | Owner / source of truth | Status verifikasi |
| --- | --- | --- | --- | --- | --- | --- |
| `CORE-DET-001` | Deterministic parse/validate/evaluate/resolve behavior independent of platform, parse order, time, randomness, or mutable global state. | Re-running the same source yields the same semantic scene and diagnostics. | `R-ROBUST` | **IN**; purity and determinism are core guarantees. | `spec/id/core/05-semantic-guarantees.md`; `docs/MATURATION-MASTER-PLAN.md` §2.5 | `PENDING-AUDIT` |
| `CORE-DET-002` | Preserve stable object identity, dependency order, collection order, numeric tolerance policy, and diagnostic paths. | Snapshots, references, reviews, and cross-consumer comparisons remain meaningful. | `R-ORDER`, `R-ROBUST`, `R-CONFORMANCE` | **IN**; no resolver-generated rename or unordered public result. | `spec/id/core/05-semantic-guarantees.md`; `fixtures/manifest.json` expected snapshots | `PENDING-AUDIT` |
| `CORE-API-001` | Provide a documented public API for parsing, editor-tolerant parsing where applicable, validation/compile, resolution, queries, and typed results/errors. | TypeScript integrators can use core without private-module coupling. | `R-CONSUMER`, `R-PIPELINE` | **IN**; public API is narrower than internal implementation. | `core/README.md`; package public contract owned by `relgeo/core` | `PENDING-AUDIT` |
| `CORE-API-002` | Keep the core API renderer-neutral while exposing the resolved scene and bounds needed by SVG, CLI, Playground, Markdown, and Flutter consumers. | A renderer or product can evolve without redefining semantic geometry. | `R-CONSUMER`, `R-SEMANTIC` | **IN**; renderer-specific formatting is out of core ownership. | `core/README.md`; `docs/MATURATION-MASTER-PLAN.md` §3.1–§3.2 | `PENDING-AUDIT` |
| `CORE-COMPAT-001` | Enforce active DSL `0.5` and omitted-version default behavior consistently at parse, schema, fixture, and consumer boundaries. | Users know which language contract a document is evaluated against. | `R-COMPAT` | **IN**; active line is explicit, not inferred from package version. | `docs/compatibility-matrix.json`; `docs/plans/02-contract-versioning.md` §2.1–§2.2; `fixtures/manifest.json` | `PENDING-AUDIT` |
| `CORE-COMPAT-002` | Handle supported legacy `0.4`, regression-only `0.1`–`0.3`, and unsupported future/unknown versions with explicit policy and diagnostics. | Legacy documents have a known path and future documents fail safely. | `R-COMPAT`, `R-CONFORMANCE` | **IN WITH BOUNDARY**; historical support is not permission to silently reinterpret future syntax. | `docs/compatibility-matrix.json`; `docs/plans/02-contract-versioning.md`; fixture IDs `text-anchor-multiline`–`multi-sheet-title-block`, `v06-invalid-unsupported-version`, `v10-invalid-unknown-version` | `PENDING-AUDIT` |
| `CORE-COMPAT-003` | Preserve compatibility-line identity across core package, CLI, language tooling, Playground, website, and Flutter consumer declarations. | Consumers do not accidentally mix incompatible DSL semantics. | `R-COMPAT`, `R-CONSUMER` | **IN**; package version and DSL compatibility line remain separate. | `docs/compatibility-matrix.json`; `docs/plans/02-contract-versioning.md` §2–§7 | `PENDING-AUDIT` |
| `CORE-INT-001` | Integrate with CLI `info`, `compile`, and `check` flows and output contracts without duplicating semantic logic in the command layer. | Shell/CI users get predictable core-backed commands and exit behavior. | `R-JOURNEY`, `R-CONSUMER` | **IN WITH BOUNDARY**; CLI owns flags/filesystem, core owns semantics. | `cli/README.md`; `docs/MATURATION-MASTER-PLAN.md` §3.1–§3.2 | `PENDING-AUDIT` |
| `CORE-INT-002` | Serve Playground/language tooling edit → diagnostic → resolve → preview → inspect behavior, including temporary invalid-source recovery. | Browser authoring stays responsive without changing core meaning. | `R-JOURNEY`, `R-CONSUMER` | **IN WITH BOUNDARY**; worker/UI/accessibility remain consumer ownership. | `playground/README.md`; `docs/MATURATION-MASTER-PLAN.md` §4.3, Tahap 5 | `PENDING-AUDIT` |
| `CORE-INT-003` | Consume and emit shared fixture semantics for active, legacy, invalid, runtime-diagnostic, runtime-error, and capability cases. | Cross-consumer conformance can distinguish contract, candidate, and negative behavior. | `R-CONFORMANCE`, `R-COMPAT` | **IN**; fixture provenance is evidence, not an implementation substitute. | `fixtures/manifest.json`; `docs/MATURATION-MASTER-PLAN.md` Tahap 4 dan Tahap 6 | `PENDING-AUDIT` |
| `CORE-INT-004` | Maintain a stable semantic boundary for renderer-SVG, Markdown, and Flutter consumers, including object identity/type/path geometry where the project has explicitly selected semantic parity. | Downstream consumers can compare or render core results without claiming raw-format parity. | `R-CONSUMER`, `R-CONFORMANCE` | **IN WITH BOUNDARY**; raw SVG bytes, style, viewBox, and UX are not core parity contracts. | `docs/MATURATION-MASTER-PLAN.md` §3.2, Tahap 4, Tahap 6; `fixtures/manifest.json` surfaces | `PENDING-AUDIT` |

## 5. Fixture and provenance map

Fixture manifest entries are evidence anchors for later verification; they were
not used to invent the capability families above.

| Fixture group | Expected catalog role | Scope decision |
| --- | --- | --- |
| `v05-relational-baseline` | Active end-to-end parse/resolve/scene baseline across core and consumers. | Active `0.5` baseline. |
| `v05-runtime-align-violation` | Post-resolve constraint diagnostic and non-solver behavior. | Runtime diagnostic; geometry is not silently rewritten. |
| `v05-boolean-intersection-candidate` | Intersection and boolean semantic execution boundary. | Active on the approved boolean/intersection boundary only. |
| `v05-evaluator-units-candidate` | Typed evaluator, parameter length, explicit units, and derived placement. | Capability/candidate; not promoted to the active baseline by catalog inference. |
| `v05-invalid-missing-type`, `v05-invalid-yaml-syntax`, `v05-invalid-unknown-reference` | Structural, syntax, and reference failure behavior. | Invalid negative contract. |
| `v06-invalid-unsupported-version`, `v10-invalid-unknown-version` | Future/unknown compatibility rejection. | Invalid negative contract. |
| `v05-runtime-empty-boolean`, `v05-runtime-multipart-boolean` | Explicit runtime-error semantics for boolean result modes. | Runtime-error contract. |
| `0.4` reference fixtures | Legacy document compatibility and presentation composition. | Supported-legacy line. |

The manifest declares `relgeo/workspace` as owner, child repositories as
standalone-local-test surfaces, and the workspace runner as integration
authority. Those are provenance decisions; they do not upgrade a capability's
implementation status.

## 6. Audit handoff gate

The expected catalog is complete for this task when:

1. every in-scope core area in the task description has one or more stable IDs;
2. every row has outcome, requirement basis, scope decision, owner/source of
   truth, and verification status;
3. active, legacy, invalid, runtime-diagnostic, runtime-error, and candidate
   fixture boundaries are explicit;
4. public API, compatibility, and integration behavior are represented as
   capabilities rather than assumed from implementation; and
5. no implementation status has been assigned from code or the older matrix.

The current ID-by-ID audit is recorded in
[core-runtime/archive/implementation-audit-legacy.md](./archive/implementation-audit-legacy.md).
It preserves this catalog as the expected baseline and reports implementation,
evidence, parity, and gap status separately.

## 7. Source register

The source register below records why each input was used to define the
expected set. It is provenance for requirements and scope, not implementation
evidence.

| Source category | Source | Contribution to the expected catalog |
| --- | --- | --- |
| Repository boundary and ownership | [`docs/REPOSITORY-MAP.md`](../../REPOSITORY-MAP.md) | Establishes `core/` as `relgeo/core`, separates core ownership from CLI, Playground, renderer, language tooling, Markdown, Flutter, and platform concerns, and prevents consumer UX from being silently counted as core capability. |
| Capability inventory policy | [`docs/capability-map/INVENTORY-PROTOCOL.md`](../INVENTORY-PROTOCOL.md) and the capability-map index | Defines capability-first discovery, one owner boundary per capability, separate implementation/evidence/parity/scope axes, and the `expected-but-missing` rule. |
| User journeys and target users | [`core/README.md`](../../../core/README.md), [`docs/MATURATION-MASTER-PLAN.md`](../../MATURATION-MASTER-PLAN.md) §§3.1–3.2, and [`docs/plans/05-public-docs-and-playground-hardening.md`](../../plans/05-public-docs-and-playground-hardening.md) | Establishes author, reviewer, CLI/CI, Playground/workbench, and TypeScript-integrator journeys, including parse → diagnose → resolve → preview/inspect outcomes. |
| Workflows and menus/commands | [`cli/README.md`](../../../cli/README.md), [`playground/README.md`](../../../playground/README.md), and the CLI/Playground workflow rows in §2 | Defines `info`, `compile`, `check`/validation, format/graph output, editor recovery, inspector, graph, diagnostics, and preview as consumer workflows that require a core semantic boundary. |
| Roadmap and product decisions | [`docs/MATURATION-MASTER-PLAN.md`](../../MATURATION-MASTER-PLAN.md) §§2–7 and [`docs/plans/07-flutter-capability-promotion-and-svg-parity.md`](../../plans/07-flutter-capability-promotion-and-svg-parity.md) | Supplies lifecycle priorities, cross-repository dependency flow, fixture promotion boundaries, semantic-parity limits, and deliberate deferrals. |
| Normative and compatibility contracts | [`spec/id/`](../../../spec/id), [`docs/compatibility-matrix.json`](../../compatibility-matrix.json), and [`docs/plans/02-contract-versioning.md`](../../plans/02-contract-versioning.md) | Defines the language model, evaluation/error semantics, geometry/presentation vocabulary, active `0.5` line, legacy/future policy, and cross-package compatibility expectations. |
| Core public boundary | [`core/README.md`](../../../core/README.md) and [`core/package.json`](../../../core/package.json) | Confirms the package role, renderer-neutral public runtime boundary, supported consumer outcomes, and published package surface without treating internal code as the expected catalog. |
| Fixture/provenance contract | [`fixtures/manifest.json`](../../../fixtures/manifest.json) and the fixture/provenance map in §5 | Establishes active, legacy, invalid, runtime-diagnostic, runtime-error, and candidate evidence classes; fixtures anchor later verification but do not invent expected capabilities. |

Required evidence reviewed for this catalog:

- [`docs/MATURATION-MASTER-PLAN.md`](../../MATURATION-MASTER-PLAN.md)
- [`docs/REPOSITORY-MAP.md`](../../REPOSITORY-MAP.md)
- [`docs/capability-map/`](..)
- [`docs/compatibility-matrix.json`](../../compatibility-matrix.json)
- [`docs/plans/02-contract-versioning.md`](../../plans/02-contract-versioning.md)
- [`core/`](../../../core)
- [`fixtures/manifest.json`](../../../fixtures/manifest.json)

Additional requirement sources reviewed:

- [`spec/id/README.md`](../../../spec/id/README.md) and normative chapters under
  [`spec/id/core/`](../../../spec/id/core), [`spec/id/syntax/`](../../../spec/id/syntax),
  [`spec/id/geometry/`](../../../spec/id/geometry), and
  [`spec/id/presentation/`](../../../spec/id/presentation)
- [`core/README.md`](../../../core/README.md)
- [`cli/README.md`](../../../cli/README.md)
- [`playground/README.md`](../../../playground/README.md)

Intentionally not used as the initial capability-list source:

- `core/src/` implementation files and tests;
- `docs/capability-map/core-runtime/capability-matrix.md`; and
- `docs/capability-map/core-runtime/archive/implementation-audit-legacy.md`.
