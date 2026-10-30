# Language Specification Implementation Gap Backlog

**Status:** candidate backlog with a bounded active selection; no implementation gap is closed by this document
**Source matrix:** [`language-specification/status-matrix.md`](./status-matrix.md)
**Audit source:** [`language-specification/implementation-audit.md`](./implementation-audit.md)
**Expected source:** [`language-specification/expected-capability-catalog.md`](./expected-capability-catalog.md)
**Join source:** [`language-specification/reconciliation.md`](./reconciliation.md)

## Rules

This is a planning/reporting artifact, not implementation. A candidate becomes
done only after source changes, tests, and the stated evidence target pass. The
rows below cover every matrix capability currently marked `🌗` or `⚠️`.

`owner` is the implementation owner; `dependency` is a real prerequisite, not a
priority ranking. Local tests do not substitute for canonical, public, browser,
or native-host evidence.

## Evidence inputs

The backlog is scoped from the normative language surface in
[`spec/id/`](../../../spec/id), the roadmap and scope decisions in
[`MATURATION-MASTER-PLAN.md`](../../MATURATION-MASTER-PLAN.md), ownership and
surface boundaries in [`REPOSITORY-MAP.md`](../../REPOSITORY-MAP.md), and the
capability-map rules in [`INVENTORY-PROTOCOL.md`](../INVENTORY-PROTOCOL.md).
The row-level joins are the [expected catalog](./expected-capability-catalog.md),
[implementation audit](./implementation-audit.md), and
[reconciliation](./reconciliation.md).

Priority is execution guidance, not implementation status: `P0` is a confirmed
broken or unsafe consumer contract, `P1` is a prerequisite contract or broad
parity risk, and `P2` is follow-on coverage or promotion work. A backlog row is
not a feature claim; only the stated implementation and verification evidence
can change the matrix status.

The active selection below is deliberately bounded to four rows. It is the
implementation scope for the next execution tasks; all other candidate rows
remain visible but are not active work in this tranche. A selected row may
address several capability IDs, and its status is reported from the matrix
using the status symbols below rather than being promoted by selection.

## Candidate goals/tasks

| ID | Priority | Candidate goal/task | Capability IDs | Scope / work type | Owner | Dependency | Acceptance test / evidence target | Risk | Next action |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `GAP-001` | `P1` | Create spec-to-consumer vocabulary/drift contract | `LANG-002`, `DOC-003`, `TYPE-001`, `TYPE-002`, `VER-003` | Contract/tooling + drift tests; not documentation closure | `relgeo/spec` + `relgeo/workspace` | Expected catalog and parser/schema ownership | Deterministic check covers sections, scalar/structured types, aliases, and normative/informative labels; current check passes, while broader object/renderer vocabulary remains to be extended | Consumer catalogs diverge silently | Maintain the check and extend it to remaining object/renderer field vocabulary before promoting the row |
| `GAP-002` | `P1` | Promote and conformance-test declarations, profiles, evaluator, and units | `DECL-001`, `DECL-004`, `EVAL-002` | Runtime semantics + shared fixtures | `relgeo/core` + `cli` | GAP-001; decision for fixture 16 | Active fixture covers defaults, structured params, profile override, derived placement, unit conversion; core/CLI/LS/Flutter evidence recorded | Numeric semantics differ by consumer | Write promotion decision and active fixture acceptance |
| `GAP-003` | `P1` | Expand geometry primitive and topology conformance | `GEO-001`, `GEO-002`, `GEO-003`, `GEO-004`, `GEO-005` | Geometry runtime + conformance fixtures | `relgeo/geometry` + `core` | GAP-001; renderer semantic comparator | Per-object mode/field/anchor/degenerate/topology fixtures with resolved JSON and semantic SVG snapshots | Geometry edge cases regress downstream | Inventory fields and add focused fixtures |
| `GAP-004` | `P2` | Close composition/component/clone parity | `COMP-001`, `COMP-002`, `COMP-003` | Runtime resolution + graph/snapshot tests | `relgeo/core` | GAP-003; graph/anchor contract | Active fixtures for group transform, clone identity/metadata, nested component params/local derived/exports; graph and snapshot checks | Scope leakage or wrong world coordinates | Select minimal active component fixture set |
| `GAP-005` | `P2` | Complete placement and anchor vocabulary | `PLACE-001`, `PLACE-003`, `ANCH-001` | Runtime placement + cross-consumer fixtures | `relgeo/core` + `geometry` | GAP-003/004; structured type contract | Fixture matrix for scalar/point/multi-anchor/inside/offset, on.path domains, and post-transform anchor values; parity across CLI/LS | Placement differs between pre/post-transform contexts | Generate anchor/placement table from spec |
| `GAP-006` | `P2` | Expand collection/repeat/split/boolean contract | `COLL-001`, `COLL-002`, `COLL-003`, `COLL-004` | Runtime collection/geometry behavior + fixtures | `relgeo/core` + `geometry` | Decision 07; GAP-003/005; error normalization | Active/candidate fixtures for repeat modes, split result shape, boolean operation boundary, collection access/empty/index errors; preserve 19/20 runtime errors | Multipart/topology overclaim | Keep fixture 15 boundary and review next operation separately |
| `GAP-007` | `P1` | Establish path/transform query domain and tolerance contract | `QUERY-002` | Numeric contract + runtime tests | `relgeo/core` + `geometry` | GAP-003/005; numeric policy | Query fixtures for pointAt/tangentAt/normalAt/frameAt/intersection/project/reflect/toWorld/toLocal with domain errors and tolerance | Cross-engine numeric mismatch | Define tolerance/domain table and tests |
| `GAP-008` | `P1` | Expand constraint and violation coverage | `CON-001`, `CON-002` | Runtime constraints + diagnostic fixtures | `relgeo/core` | GAP-007; diagnostics normalization | Shared fixtures for equal/parallel/perpendicular/tangent plus align; verify no geometry mutation and stable type/path/object payload | Diagnostic parity breaks consumers | Add one runtime-diagnostic fixture per constraint kind |
| `GAP-009` | `P1` | Harden dimension and annotation coverage/escaping | `PRES-001`, `PRES-002` | Renderer/core behavior + security and snapshot tests | `relgeo/renderer-svg` + `core` | Normative presentation paths; renderer security harness | Focused v0.5 hostile-input fixture; escaped text and dynamic presentation attributes; renderer security tests and local CLI/Markdown consumer checks pass; all dimension kinds and hosts are not yet exhaustive | Unsafe SVG or presentation regression | Extend dimension-kind and remaining host/consumer snapshot coverage |
| `GAP-010` | `P2` | Promote roles, views/sheets, and metadata semantics | `PRES-003`, `PRES-004`, `META-001`, `META-002` | Runtime presentation/metadata + compatibility fixtures | `relgeo/spec` + `renderer-svg` + `core` | GAP-009; placement/compatibility contracts | Role/filter/default style, view/sheet placement, metadata invariance, ordered inherit merge, and legacy alias fixtures; current host evidence | Renderers disagree on presentation | Define active presentation fixture boundary |
| `GAP-011` | `P0` | Normalize diagnostic/error model across runtime and consumers | `DIAG-001`, `DIAG-002`, `ERR-001` | Confirmed runtime contract defect + consumer mappings | `relgeo/core` + `language-service` + `cli` | GAP-001; parser/resolver mode contract | Resolver/validator entry points normalize uncategorized errors and focused fixtures pass; no raw errors at every public boundary and complete LS/CLI mapping remain outstanding | Broken recovery and inconsistent UX | Complete the raw evaluator/internal throw inventory and add shared phase/path/message fixtures plus consumer mapping checks |
| `GAP-012` | `P2` | Define canonical resolved-scene JSON contract | `SER-001` | Serialization contract + CLI/fixture tests | `relgeo/spec` + `core` + `cli` | GAP-011; VER-002 | Normative JSON schema or canonicalization rule; stable identity/order/numbers/errors; CLI output and fixture snapshots pass | Unstable downstream diffs/API | Decide semantic owner versus consumer serialization contract |
| `GAP-013` | `P0` | Fix and verify safe semantic SVG serialization | `SER-002` | Confirmed renderer security defect + regression tests | `relgeo/renderer-svg` | GAP-009; security regression harness | Dimension/annotation escaping fixed; no executable markup; local renderer, CLI, Markdown, and conformance evidence pass; broader Playground/host evidence remains incomplete | XSS/unsafe artifact or cross-renderer drift | Extend escaping regression through Playground/current-host consumers before any completion claim |

## Bounded active selection

The selected rows are bounded by the expected catalog, the audited findings,
and the normative `spec/id/` contract. Each row below records the owner, exact
source-of-truth path, consumer/implementation boundary, and observable
acceptance behavior required before its status can change. The selected status
is the current matrix status: selection is not completion.

| Selection | Current status | Capability IDs | Owner | Normative source of truth | Contract boundary | Explicit acceptance behavior |
| --- | --- | --- | --- | --- | --- | --- |
| `GAP-001` vocabulary/drift contract | `🌗` | `LANG-002`, `DOC-003`, `TYPE-001`, `TYPE-002`, `VER-003` | `relgeo/spec` + `relgeo/workspace` | [`spec/id/README.md`](../../../spec/id/README.md); [`spec/id/core/01-overview.md`](../../../spec/id/core/01-overview.md); [`spec/id/core/05-semantic-guarantees.md`](../../../spec/id/core/05-semantic-guarantees.md); [`spec/id/editorial-guide.md`](../../../spec/id/editorial-guide.md); [`spec/id/syntax/07-type-system.md`](../../../spec/id/syntax/07-type-system.md); [`spec/id/presentation/26-metadata.md`](../../../spec/id/presentation/26-metadata.md) | Normative vocabulary → core parser/validator, language-service schema/completions, and renderer field/role consumers. The spec remains authoritative; generated/checkable artifacts are consumers. | Deterministic vocabulary check passes for sections, scalar/structured types, aliases, and normative/informative labels; object/renderer field coverage remains to be extended. No package release or deployment is required. |
| `GAP-011` structured diagnostics | `🌗` + `⚠️` (`DIAG-001`/`ERR-001` partial; `DIAG-002` broken) | `DIAG-001`, `DIAG-002`, `ERR-001` | `relgeo/core` + `language-service` + `cli` | [`spec/id/core/04-evaluation-order.md`](../../../spec/id/core/04-evaluation-order.md); [`spec/id/core/05-semantic-guarantees.md`](../../../spec/id/core/05-semantic-guarantees.md); [`spec/id/core/06-error-model.md`](../../../spec/id/core/06-error-model.md) | Validator/resolver public results and their CLI/language-service mappings, including tolerant versus compile behavior. Constraint diagnostics remain post-resolve and must not mutate geometry. | No raw `Error` crosses a public boundary; documented error codes have stable phase/path/message payload fixtures; CLI and language-service mappings agree; tolerant and compile modes preserve the specified behavior. |
| `GAP-009` dimension/annotation coverage and escaping | `🌗` | `PRES-001`, `PRES-002` | `relgeo/renderer-svg` + `relgeo/core` | [`spec/id/presentation/22-dimension.md`](../../../spec/id/presentation/22-dimension.md); [`spec/id/presentation/23-annotation.md`](../../../spec/id/presentation/23-annotation.md); [`spec/id/presentation/26-metadata.md`](../../../spec/id/presentation/26-metadata.md) | Resolved presentation objects → SVG renderer, with CLI and Markdown snapshot consumers. This is presentation/serialization behavior, not a new geometry owner. | Focused v0.5 hostile-input fixture covers dimension/annotation text and dynamic attributes; renderer/security tests plus local CLI/Markdown consumer checks pass, while all dimension kinds and hosts remain incomplete. |
| `GAP-013` safe semantic SVG serialization | `🌗` | `SER-002` | `relgeo/renderer-svg` | [`spec/id/presentation/22-dimension.md`](../../../spec/id/presentation/22-dimension.md); [`spec/id/presentation/23-annotation.md`](../../../spec/id/presentation/23-annotation.md); [`spec/id/presentation/24-drawing-roles.md`](../../../spec/id/presentation/24-drawing-roles.md); [`spec/id/presentation/26-metadata.md`](../../../spec/id/presentation/26-metadata.md) | SVG output boundary consumed by CLI, Markdown, and Playground. Semantic geometry/roles are in scope; byte-for-byte SVG equality is not. | Dimension/annotation content cannot create executable markup, semantic geometry and role output remain unchanged, and focused renderer/security plus consumer snapshots pass. `GAP-009` is the focused fixture prerequisite; broader `GAP-010` presentation/metadata promotion is not active. Local focused evidence now passes; broader consumer evidence remains required. |

### Explicit exclusions from the active tranche

Rows not listed above remain candidate work only. In particular, `GAP-002`
through `GAP-008`, `GAP-010`, and `GAP-012` are not active implementation
commitments in this tranche. The audit's deferred sub-boundaries (including
fixture 16 promotion, broader boolean coverage, mobile/native delivery, and
external/canonical runtime evidence) remain deferred or unverified. Any future
`➖` or `⏸️` classification must remain excluded from active implementation;
neither status is a substitute for `🌗`, `⚠️`, or `❌` evidence.

## Coverage and dependency notes

| Check | Result |
| --- | --- |
| `🌗`/`⚠️` capability IDs covered by a candidate | 37/37 |
| `✔️` capabilities incorrectly assigned remediation | 0 |
| Expected `❌` capabilities | 0 currently; if discovered later, add a dedicated row with `Implementation=absent`, not `➖` |
| Documentation-only closure claims | prohibited |
| External evidence prerequisite | Node `>=24`, current child pointers, canonical CI, public/registry/browser/native evidence where the candidate requires it |

## Candidate promotion rule

A backlog row can be promoted only when its implementation change, focused tests,
shared fixture/conformance evidence, consumer evidence, and scope/compatibility
decision are all recorded. Updating this backlog or the status matrix alone does
not change implementation status.
