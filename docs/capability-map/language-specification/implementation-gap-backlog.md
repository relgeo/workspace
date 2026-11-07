# Language Specification Implementation Gap Backlog

**Status:** reconciled backlog and evidence register; local closure is supported by source, test, fixture, and consumer evidence, while external limits remain separate
**Source matrix:** [`language-specification/status-matrix.md`](./status-matrix.md)
**Audit source:** [`language-specification/implementation-audit.md`](./implementation-audit.md)
**Expected source:** [`language-specification/expected-capability-catalog.md`](./expected-capability-catalog.md)
**Join source:** [`language-specification/reconciliation.md`](./reconciliation.md)
**Latest evidence refresh:** 2026-11-07; GAP-001 through GAP-013 are locally closed on their bounded active fixture contracts where applicable; external evidence boundaries remain explicit

## Rules

This is a planning/reporting artifact, not implementation. A candidate becomes
done only after source changes, tests, and the stated evidence target pass. The
rows below preserve the historical mapping for every capability that was
previously marked `🌗` or `⚠️`; the current matrix has no such rows.

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

The former bounded selection and its candidate rows remain visible for
traceability. They are not an open implementation queue for the frozen local
boundary. A selected row may address several capability IDs, and its status is
reported from the matrix using the status symbols below rather than being
promoted by selection.

The P0/P1 triage below is a wider execution handoff than that bounded tranche.
It identifies every P0/P1 candidate that is implementation-closable in the
current checkout, even when its work is queued behind another local dependency.
It does not promote a matrix status, require a package release/deployment, or
turn external-host evidence into an implementation prerequisite.

## Candidate goals/tasks

| ID | Priority | Candidate goal/task | Capability IDs | Scope / work type | Owner | Dependency | Acceptance test / evidence target | Risk | Next action |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `GAP-001` | `P1` | Create spec-to-consumer vocabulary/drift contract | `LANG-002`, `DOC-003`, `TYPE-001`, `TYPE-002`, `VER-003` | Contract/tooling + drift tests; not documentation closure | `relgeo/spec` + `relgeo/workspace` | Expected catalog and parser/schema ownership | `normative-vocabulary-catalog.json` is the active checked projection; `pnpm run language-spec:check` deterministically checks root sections/order, scalar/structured types, aliases, document status labels, all 26 object types, and six geometry-operation field sets across parser/schema/completions | Renderer and external consumer catalogs can still diverge | Preserve the checked object-operation projection; promote renderer presentation fields through an explicit future catalog revision |
| `GAP-002` | `P1` | Promote and conformance-test declarations, profiles, evaluator, and units | `DECL-001`, `DECL-004`, `EVAL-002` | Runtime semantics + shared fixtures | `relgeo/core` + `cli` | GAP-001 | Active fixture 16 covers defaults, structured params, profile override, derived placement, and unit conversion; Core/CLI/LS/renderer/Flutter-local evidence and 677/677 conformance pass across 33 fixtures | Canonical Node-24/CI/native-host evidence remains separate | Preserve active fixture and refresh canonical evidence |
| `GAP-003` | `P1` | Expand geometry primitive and topology conformance | `GEO-001`, `GEO-002`, `GEO-003`, `GEO-004`, `GEO-005` | Geometry runtime + conformance fixtures | `relgeo/geometry` + `core` | GAP-001; renderer semantic comparator | **Locally closed:** fixture 31 provides per-object mode/field/anchor/topology resolved JSON and semantic SVG; Core and conformance checks pass | Broader renderer-host parity remains external | Preserve fixture 31 and explicit negative boundaries |
| `GAP-004` | `P2` | Close composition/component/clone parity | `COMP-001`, `COMP-002`, `COMP-003` | Runtime resolution + graph/snapshot tests | `relgeo/core` | GAP-003; graph/anchor contract | **Locally closed:** fixture 31 plus group/clone/component scope/export regressions and shared conformance | Host UX parity remains external | Preserve active composition fixture |
| `GAP-005` | `P2` | Complete placement and anchor vocabulary | `PLACE-001`, `PLACE-003`, `ANCH-001` | Runtime placement + cross-consumer fixtures | `relgeo/core` + `geometry` | GAP-003/004; structured type contract | **Locally closed:** fixture 31 covers topLeft/inside/custom-anchor/on.path and transformed world access; CLI/LS/Markdown projections pass | Browser/native host parity remains external | Preserve anchor/placement fixture and negatives |
| `GAP-006` | `P2` | Expand collection/repeat/split/boolean contract | `COLL-001`, `COLL-002`, `COLL-003`, `COLL-004` | Runtime collection/geometry behavior + fixtures | `relgeo/core` + `geometry` | Decision 07; GAP-003/005; error normalization | **Locally closed:** fixtures 24 and 32 cover repeat identity/context, divide/split result shapes, collection access, and approved boolean modes; fixtures 15/19/20 retain intersect/subtract and explicit empty/multipart boundaries; conformance 677/677 across 33 fixtures | Broader topology/host parity remains external | Preserve fixture 32 and explicit negative boundaries |
| `GAP-007` | `P1` | Establish path/transform query domain and tolerance contract | `QUERY-002` | Numeric contract + runtime tests | `relgeo/core` + `geometry` | GAP-003/005; numeric policy | **Locally closed:** fixture 31 covers pointAt/tangentAt/toWorld and focused tests cover frameAt/intersection/domain/tolerance boundaries | Cross-engine numeric parity remains external | Preserve tolerance/domain table and tests |
| `GAP-008` | `P1` | Expand constraint and violation coverage | `CON-001`, `CON-002` | Runtime constraints + diagnostic fixtures | `relgeo/core` | GAP-007; diagnostics normalization | **Locally closed:** fixture 32 covers equal/parallel/perpendicular/tangent relation validation; fixture 14 and Core diagnostics tests cover violation path/type/involved-object/expected/actual payload and no mutation | Cross-host diagnostic transport parity remains external | Preserve fixtures 14/32 and relation negatives |
| `GAP-009` | `P1` | Harden dimension and annotation coverage/escaping | `PRES-001`, `PRES-002` | Renderer/core behavior + security and snapshot tests | `relgeo/renderer-svg` + `core` | Normative presentation paths; renderer security harness | **Locally closed:** fixture 33 covers linear/radius/diameter/angle dimensions, target-fallback/leader annotations, hostile text, and dynamic presentation attributes; Core regression plus renderer/security, CLI, Markdown, and conformance checks pass | Unsafe SVG or presentation regression | Preserve fixture 33 and semantic/security checks |
| `GAP-010` | `P2` | Promote roles, views/sheets, and metadata semantics | `PRES-003`, `PRES-004`, `META-001`, `META-002` | Runtime presentation/metadata + compatibility fixtures | `relgeo/spec` + `renderer-svg` + `core` | GAP-009; placement/compatibility contracts | **Locally closed:** fixture 33 covers role/filter/default-style, view/sheet placement, metadata invariance, ordered inherit merge, and legacy aliases; Core regression and 677/677 conformance pass | Host parity remains external | Preserve fixture 33 and explicit host boundaries |
| `GAP-011` | `P0` | Normalize diagnostic/error model across runtime and consumers | `DIAG-001`, `DIAG-002`, `ERR-001` | Local runtime contract closed; external consumer evidence remains separate | `relgeo/core` + `language-service` + `cli` + `remark-relgeo` | GAP-001; parser/resolver mode contract | Raw-throw inventory is clean for audited production boundaries; resolver/validator entry points and CLI/LS/Markdown mappings have stable phase/path/message fixtures and pass local conformance | Stale recovery or inconsistent UX on unverified hosts | Preserve boundary regressions and run Node-24/CI/Flutter/MCP/browser/native-host verification when available |
| `GAP-012` | `P2` | Define canonical resolved-scene JSON contract | `SER-001` | Serialization contract + CLI/fixture tests | `relgeo/spec` + `core` + `cli` | GAP-011; VER-002 | **Locally closed:** fixture 33 expected JSON, Core deterministic replay regression, CLI snapshot, and conformance checks establish stable identity/order/number semantics; canonical CI remains external | Unstable downstream diffs/API | Preserve fixture 33 canonical JSON and replay check |
| `GAP-013` | `P0` | Fix and verify safe semantic SVG serialization | `SER-002` | Renderer security contract + regression tests | `relgeo/renderer-svg` | GAP-009; security regression harness | **Locally closed:** fixture 33 forbids executable markup and preserves semantic geometry/roles; renderer security, CLI/Markdown snapshots, and 677/677 conformance pass; raw SVG byte equality is out of scope | XSS/unsafe artifact or cross-renderer drift | Preserve semantic/security checks; host parity remains external |

## P0/P1 implementation-closability triage

**Triage date:** 2026-11-04. **Decision:** select all eight P0/P1 candidate
rows below for implementation follow-up. “Implementation-closable” means that
the owner can make progress and run a focused local acceptance check from this
checkout. It does not mean the capability is complete, externally verified, or
ready for release. The initial status is copied from the status matrix at
triage time and is intentionally unchanged by this table.

The normative success/failure boundaries and evidence expectations for these
rows are locked in [reconciliation §0](./reconciliation.md#0-contract-and-acceptance-lock).
That lock preserves the `0.5.x` compatibility line and requires any future
public-contract change to update `spec/id` and its acceptance fixture first.

| Gap | Priority | Capability IDs | Triage decision | Owner | Normative source of truth | Acceptance test / evidence target | Initial status | External or scope-deferred boundary kept separate |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `GAP-001` | `P1` | `LANG-002`, `DOC-003`, `TYPE-001`, `TYPE-002`, `VER-003` | **Locally closed for bounded v0.5 vocabulary projection** | `relgeo/spec` + `relgeo/workspace` | `spec/id/core/01-overview.md`, `spec/id/core/05-semantic-guarantees.md`, `spec/id/editorial-guide.md`, `spec/id/syntax/07-type-system.md`, `spec/id/geometry/15-composition-objects.md`, `spec/id/presentation/26-metadata.md` | `pnpm run language-spec:check`; language-service regression covers geometry-operation types/fields; Core, language-service, and conformance tests pass; no documentation-only closure | `✔️` / `implemented` | Renderer presentation-field projection and public/browser/native consumer evidence remain incomplete; registry release/deployment is not required |
| `GAP-002` | `P1` | `DECL-001`, `DECL-004`, `EVAL-002` plus the runtime/coercion boundary of `TYPE-001` | **Locally closed for bounded active contract** | `relgeo/core` + `cli` | `spec/id/syntax/07-type-system.md`, `spec/id/syntax/08-parameters.md`, `spec/id/syntax/11-profiles.md`, `spec/id/core/03-scene.md` | Active fixture 16, Core/CLI/language-service/renderer/Flutter-local projections, focused tests, and `pnpm conformance:fixtures` pass | `✔️` / `implemented` | Node 24 CI, canonical CI, Flutter/native-host runtime, and package publishing remain separate evidence boundaries |
| `GAP-003` | `P1` | `GEO-001`, `GEO-002`, `GEO-003`, `GEO-004`, `GEO-005` | **Locally closed; external parity separate** | `relgeo/geometry` + `relgeo/core` | `spec/id/geometry/13-object-model.md` through `spec/id/geometry/21-constraints.md` | Fixture 31 per-object mode/field/anchor/topology resolved JSON and semantic SVG; Core and conformance tests pass | `✔️` / `implemented` | Broader renderer-host parity and future topology promotion remain separate boundaries |
| `GAP-007` | `P1` | `QUERY-002` | **Locally closed; external parity separate** | `relgeo/core` + `relgeo/geometry` | `spec/id/geometry/18-anchors.md`, `spec/id/geometry/20-geometry-queries.md` | Fixture 31 query projection plus frame/intersection/domain/tolerance tests pass | `✔️` / `implemented` | Cross-engine/browser/native numeric parity remains external evidence |
| `GAP-008` | `P1` | `CON-001`, `CON-002` | **Locally closed; external verification separate** | `relgeo/core` | `spec/id/geometry/21-constraints.md`, `spec/id/core/06-error-model.md` | Fixture 32, fixture 14, Core diagnostics tests, and 677/677 conformance assertions cover relation validation, stable payloads, and no-mutation behavior | `✔️` / `implemented` | Complete consumer parity and canonical CI evidence remain unverified; no new solver scope is implied |
| `GAP-009` | `P1` | `PRES-001`, `PRES-002` | **Locally closed; external parity separate** | `relgeo/renderer-svg` + `relgeo/core` | `spec/id/presentation/22-dimension.md`, `spec/id/presentation/23-annotation.md`, `spec/id/presentation/26-metadata.md` | Fixture 33 covers all dimension kinds, annotation target fallback/leader, hostile text, and dynamic attributes; Core, renderer/security, CLI/Markdown, and conformance checks pass | `✔️` / `implemented` | Browser/native-host evidence remains external |
| `GAP-010` | `P2` | `PRES-003`, `PRES-004`, `META-001`, `META-002` | **Locally closed; external parity separate** | `relgeo/spec` + `relgeo/core` + `renderer-svg` | `spec/id/presentation/24-drawing-roles.md`, `spec/id/presentation/26-metadata.md` | Fixture 33 covers roles, views/sheets, metadata invariance, ordered inherit merge, and legacy aliases; Core regression and 677/677 conformance pass | `✔️` / `implemented` | Host parity remains external |
| `GAP-011` | `P0` | `DIAG-001`, `DIAG-002`, `ERR-001` | **Locally closed; external verification separate** | `relgeo/core` + `language-service` + `cli` + `remark-relgeo` | `spec/id/core/04-evaluation-order.md`, `spec/id/core/05-semantic-guarantees.md`, `spec/id/core/06-error-model.md` | Raw-throw inventory is clean for audited production sources; stable phase/path/message fixtures and CLI/language-service/Markdown mappings pass in Core 579, LS 91, CLI 40, Markdown 18, plus 677/677 conformance assertions across 33 fixtures | `✔️` / `implemented` | Node 24, canonical CI, Flutter/MCP runtime, browser/native-host, and clean-checkout evidence remain separately `not verified`; no package release is needed |
| `GAP-013` | `P0` | `SER-002` | **Locally closed; external parity separate** | `relgeo/renderer-svg` | `spec/id/presentation/22-dimension.md`, `spec/id/presentation/23-annotation.md`, `spec/id/presentation/24-drawing-roles.md`, `spec/id/presentation/26-metadata.md` | Fixture 33, renderer security/semantic checks, CLI/Markdown snapshots, and 677/677 conformance pass; raw SVG byte equality is out of scope | `✔️` / `implemented` | Playground/browser/native-host parity remains unverified |

| `GAP-012` | `P2` | `SER-001` | **Locally closed; external parity separate** | `relgeo/spec` + `relgeo/core` + `cli` | `spec/id/presentation/26-metadata.md`, `spec/id/core/05-semantic-guarantees.md` | Fixture 33 expected JSON, deterministic Core replay, CLI snapshot, and conformance establish stable identity/order/number semantics | `✔️` / `implemented` | Canonical CI remains external |

The rows above are implementation follow-ups, not claims that every related
sub-boundary is active. In particular, npm/pub.dev release, production
deployment, current canonical CI, browser/native-host runtime, and mobile
delivery are external or deferred evidence. Fixture 16 promotion, broader
boolean/topology promotion, and other decision-gated boundaries stay recorded
as deferred/unverified in the audit and are not acceptance blockers for the
local work listed above. All rows in this tranche are locally closed on the
audited boundary: GAP-006/GAP-008 use fixture 32, GAP-004/GAP-005 use fixture
31, and GAP-009/GAP-010/GAP-012/GAP-013 use fixture 33.

## Bounded active selection

The selected rows are bounded by the expected catalog, the audited findings,
and the normative `spec/id/` contract. Each row below records the owner, exact
source-of-truth path, consumer/implementation boundary, and observable
acceptance behavior required before its status can change. The selected status
is the current matrix status: selection is not completion.

| Selection | Current status | Capability IDs | Owner | Normative source of truth | Contract boundary | Explicit acceptance behavior |
| --- | --- | --- | --- | --- | --- | --- |
| `GAP-001` vocabulary/drift contract | `✔️` locally | `LANG-002`, `DOC-003`, `TYPE-001`, `TYPE-002`, `VER-003` | `relgeo/spec` + `relgeo/workspace` | [`spec/id/README.md`](../../../spec/id/README.md); [`spec/id/core/01-overview.md`](../../../spec/id/core/01-overview.md); [`spec/id/core/05-semantic-guarantees.md`](../../../spec/id/core/05-semantic-guarantees.md); [`spec/id/core/07-closure-contracts.md`](../../../spec/id/core/07-closure-contracts.md); [`spec/id/editorial-guide.md`](../../../spec/id/editorial-guide.md); [`spec/id/syntax/07-type-system.md`](../../../spec/id/syntax/07-type-system.md); [`spec/id/presentation/26-metadata.md`](../../../spec/id/presentation/26-metadata.md) | Normative vocabulary → core parser/validator, language-service schema/completions, and renderer field/role consumers. The checked projection now covers all 26 object types and the six geometry-operation fields; the spec remains authoritative. | `pnpm run language-spec:check` plus language-service regression checks object-operation types/fields. Public/browser/native consumer evidence remains separate; no package release or deployment is required. |
| `GAP-011` structured diagnostics | `✔️` locally (`DIAG-001`, `DIAG-002`, `ERR-001`) | `DIAG-001`, `DIAG-002`, `ERR-001` | `relgeo/core` + `language-service` + `cli` + `remark-relgeo` | [`spec/id/core/04-evaluation-order.md`](../../../spec/id/core/04-evaluation-order.md); [`spec/id/core/05-semantic-guarantees.md`](../../../spec/id/core/05-semantic-guarantees.md); [`spec/id/core/06-error-model.md`](../../../spec/id/core/06-error-model.md) | Validator/resolver public results and CLI/language-service/Markdown mappings preserve tolerant versus compile behavior. Constraint diagnostics remain post-resolve and must not mutate geometry. | Raw-throw inventory is clean for audited production sources; documented codes have stable phase/path/message fixtures; Core/LS/CLI/Markdown and conformance checks pass. Node 24/CI/Flutter/MCP/browser/native-host remains `not verified`. |
| `GAP-009` dimension/annotation coverage and escaping | `✔️` | `PRES-001`, `PRES-002` | `relgeo/renderer-svg` + `relgeo/core` | [`spec/id/presentation/22-dimension.md`](../../../spec/id/presentation/22-dimension.md); [`spec/id/presentation/23-annotation.md`](../../../spec/id/presentation/23-annotation.md); [`spec/id/presentation/26-metadata.md`](../../../spec/id/presentation/26-metadata.md) | Resolved presentation objects → SVG renderer, with CLI and Markdown snapshot consumers. This is presentation/serialization behavior, not a new geometry owner. | Fixture 33 covers all dimension kinds, annotation target fallback/leader, hostile text, and dynamic attributes; Core, renderer/security, CLI/Markdown, and conformance checks pass. |
| `GAP-013` safe semantic SVG serialization | `✔️` | `SER-002` | `relgeo/renderer-svg` | [`spec/id/presentation/22-dimension.md`](../../../spec/id/presentation/22-dimension.md); [`spec/id/presentation/23-annotation.md`](../../../spec/id/presentation/23-annotation.md); [`spec/id/presentation/24-drawing-roles.md`](../../../spec/id/presentation/24-drawing-roles.md); [`spec/id/presentation/26-metadata.md`](../../../spec/id/presentation/26-metadata.md) | SVG output boundary consumed by CLI, Markdown, and Playground. Semantic geometry/roles are in scope; byte-for-byte SVG equality is not. | Fixture 33, renderer security/semantic checks, CLI/Markdown snapshots, and conformance pass; Playground/browser/native-host parity remains separate evidence. |

### GAP-001 deterministic contract

`GAP-001` freezes one active vocabulary boundary. The normative source is the
chapter content under `spec/id`; the checked projection is
[`normative-vocabulary-catalog.json`](./normative-vocabulary-catalog.json); the
consumer projections are the core parser/types and language-service
schema/completions. `spec/id/README.md` and `spec/id/editorial-guide.md` are
informative governance documents: their status labels and editorial rules are
checked, but they cannot introduce a DSL field or type.

The contract is intentionally bounded to the v0.5 object-operation projection,
not the full renderer vocabulary. `GAP-001` checks the active root fields,
scalar/structured parameter types, the two documented compatibility aliases,
the three document-status labels, all 26 object types, and the six geometry
operation field sets across the Core parser and language-service
schema/completions. Renderer presentation fields are covered independently by
fixture 33 and the presentation/serialization rows; broader generated renderer
catalogs and public/browser/native consumer parity remain explicit external
boundaries.

### GAP-011 implementation progress

On 2026-11-06, the boundary closure was completed. In addition to the prior
evaluator and per-object normalization, repeat non-finite lengths now raise a
structured `ResolveError`, sheet size/placement expressions retain indexed
paths, and Markdown option/meta failures use typed boundary errors. The
production raw-throw inventory for Core, language-service, CLI, Markdown, and
renderer sources is clean. Core structured diagnostics, tolerant/strict mode,
CLI, language-service, and Markdown regressions pass (`579/579`, `91/91`,
`40/40`, and `18/18`), while the conformance runner passes `677/677` across
33 fixtures. Node 24, canonical CI, Flutter/MCP runtime, browser/native-host,
and clean-checkout evidence remain separately `not verified`; those external
boundaries do not reopen the audited local contract defect.

### GAP-002 implementation progress

On 2026-11-04, `core/src/validator.ts` was changed to validate each profile
override against the declared parameter contract. Unknown profile keys now
produce `UNKNOWN_FIELD` at the profile value path, and incompatible values for
typed parameters produce `TYPE_MISMATCH` using the same validator used for
defaults. Regression tests cover valid typed overrides, incompatible typed overrides,
and undeclared keys while existing shorthand profile resolution remains intact.
The core resolver now also rejects a selected profile that is absent from the
document with `UNKNOWN_REFERENCE` at path `profile`, matching the CLI option
boundary. A resolver regression also covers profile unit conversion feeding a
derived value and final geometry dimensions.

The current core run passes `579/579` tests; CLI passes `40/40`, targeted
Flutter shared conformance passes, and root conformance passes `677/677` across
33 fixtures. Fixtures 16, 31, and 32 are active for the bounded v0.5 contract. Canonical
Node-24/CI/native-host evidence remains separate and is not inferred from these
local results.

### Downstream handoff boundary

The checked contracts are available to downstream owners from the current
checkout: vocabulary through `normative-vocabulary-catalog.json` and
`pnpm run language-spec:check`; diagnostics through core chapters 04–06; and
presentation/safe semantic SVG through presentation chapters 22–24 and 26.
All 53 rows are locally closed on the frozen boundary. npm/pub.dev publication,
registry release, and production deployment are explicitly not prerequisites;
transport/runtime, canonical CI, browser/native-host, and public evidence stay
visible as separate external boundaries in [`reconciliation.md`](./reconciliation.md).

### Explicit exclusions from the active tranche

The remaining entries are retained for traceability and future external
verification, not as open local capability debt. The audit's deferred
sub-boundaries (including mobile/native delivery and external/canonical runtime
evidence) remain deferred or unverified. Any future `➖` or `⏸️` classification
must remain excluded from active implementation; neither status is a substitute
for `🌗`, `⚠️`, or `❌` evidence.

## Coverage and dependency notes

| Check | Result |
| --- | --- |
| `🌗`/`⚠️` capability IDs covered by a candidate | 0/0 currently; historical candidate mapping retained below |
| `✔️` capabilities incorrectly assigned remediation | 0 |
| Expected `❌` capabilities | 0 currently; if discovered later, add a dedicated row with `Implementation=absent`, not `➖` |
| Documentation-only closure claims | prohibited |
| External evidence prerequisite | Node `>=24`, current child pointers, canonical CI, public/registry/browser/native evidence where the candidate requires it |

## Candidate promotion rule

A backlog row can be promoted only when its implementation change, focused tests,
shared fixture/conformance evidence, consumer evidence, and scope/compatibility
decision are all recorded. Updating this backlog or the status matrix alone does
not change implementation status.
