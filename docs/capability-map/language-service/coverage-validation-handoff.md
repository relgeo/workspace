# Language-Service Coverage Validation and Handoff

> **Current integration overlay — 2026-10-31:** MCP is no longer contract-only: local spec/resource tools and the Flutter-hosted active-document read/guarded edit path are implemented and tested. Language-service semantic validation/completion/diagnostic/render integration and live ChatGPT Desktop write interoperability remain unverified. The older validation counts and runtime deferral notes below describe their original dated snapshot.

**Tanggal validasi:** 2026-10-30  
**Boundary:** expected catalog → implementation audit → reconciliation → status matrix → implementation-gap backlog  
**Validation status:** structurally validated with explicit implementation, scope, and evidence limitations  
**Important:** handoff ini tidak menyatakan language-service surface lengkap atau
bahwa capability yang masih partial, absent, deferred, atau broken sudah selesai.

## 1. Validation scope

Artefak dan evidence berikut diperiksa sebagai satu rantai, tanpa menjadikan
matrix lama sebagai sumber enumerasi expected:

| Artifact / source | Validation role | Result |
| --- | --- | --- |
| [Expected capability catalog](./expected-capability-catalog.md) | Expected key set, user outcome, requirement, scope, owner, and verification baseline | PASS — 33 unique expected IDs |
| [Implementation audit evidence](./archive/implementation-audit-legacy.md) | Discovery coverage S/T/C/P/D/O, source/test/consumer evidence, status, limitation, and gap map | PASS — 33/33 expected IDs mapped; local evidence limits retained |
| [Expected-versus-observed reconciliation](./reconciliation.md) | One-to-one join with separate implementation, evidence, and scope dimensions | PASS — 33 rows; no missing, extra, or duplicate ID |
| [Current status matrix](./status-matrix.md) | Capability-first reporting view with status, evidence, gap, owner, dependency, risk, and next action | PASS — 33 rows and all required decision columns |
| [Implementation-gap backlog](./implementation-gap-backlog.md) | Candidate handoff for partial, absent, and confirmed broken implementation work | PASS — 21 tasks for 17 partial, 3 absent, and 1 broken rows |
| [Historical capability matrix](./capability-matrix.md) | Historical evidence only; not the expected catalog source | PASS — retained and explicitly labeled historical in the current index |
| [Repository map](../../REPOSITORY-MAP.md) | Repository ownership and language-service/consumer boundary | PASS — language-service, Playground, Markdown, MCP, and Flutter owners are distinct |
| [Maturation master plan](../../MATURATION-MASTER-PLAN.md) | Product journey, layer ownership, roadmap, canonical evidence, and scope context | PASS — claims remain qualified by evidence freshness |
| [Compatibility matrix](../../compatibility-matrix.json) | DSL/package compatibility and release line context | PASS — active 0.5 and package 0.5.1 context is retained |
| [Surface discovery ledger](../SURFACE-DISCOVERY-LEDGER.md) | Cross-surface discovery category and matrix/audit routing | PASS — language-service row now points to current matrix and audit |

## 2. Mechanical coverage checks

| Check | Result | Interpretation |
| --- | --- | --- |
| Expected catalog IDs | 33 unique | Complete key set for this declared language-service catalog; not a claim that all future IDE features are in scope |
| Audit expected-ID coverage | 33/33 | Every expected ID has an observed row; source/test/consumer limits remain in audit |
| Reconciliation rows | 33/33 | Exactly one result per expected ID |
| Status matrix rows | 33/33 | Exactly one capability-first row per expected ID |
| Backlog source IDs | 23/23 tracked IDs | All 19 🌗 and 3 ❌ current gap IDs have candidate tasks; one closed local row is retained; ➖ rows remain out of scope |
| Missing/extra/duplicate IDs | 0 / 0 / 0 | Catalog, audit, reconciliation, matrix, and backlog source sets are consistent |
| Audit trace links | 33/33 | Every reconciliation row links to its current audit ID |
| Required artifact links | PASS | Catalog, audit, reconciliation, current matrix, backlog, repository map, master plan, and compatibility matrix are linked |

The counts are deliberately not a completeness claim. The 2026-10-31 overlay updates the matrix to 9 implemented, 19 partial,
3 absent, 2 not-applicable, 0 deferred, and 0 broken. The backlog tracks 23
rows (22 open tasks and one locally closed row retained for evidence); creating
or editing those tasks does not change implementation status.

## 3. Discovery and evidence validation

### Discovery category coverage

The current audit records all required discovery categories:

| Category | Validated coverage |
| --- | --- |
| S — source/API | language-service source modules, exports, package metadata, schema, completions, tokens, public methods |
| T — test/fixture | language-service tests, Markdown plugin tests, Playground tests, shared fixtures, conformance runner |
| C — consumer/UI/command | Playground editor/worker, Markdown highlighter, CLI/conformance path, MCP contract, host source-jump behavior |
| P — platform/security/runtime | worker/browser boundary, persistence/session ownership, MCP safety contract, package side-effect boundary |
| D — delivery/operations | package scripts, local test/lint/build, root conformance, Node/package/registry/CI/public limitations |
| O — ownership/docs/provenance | repository map, master plan, expected catalog, spec/id, README, plans, compatibility and MCP documents |

The audit also records that language-service itself has no menu, shortcut,
route, persistence store, worker, or platform service. Those surfaces are
validated as consumer/host boundaries rather than inferred as package
implementation.

### Capability category coverage

The catalog declares 13 capability categories. Each category below has an
explicit expected-ID set, a reconciliation status summary, and a current-audit
anchor, proving that the category was compared rather than inferred from only
the source tree.

| Capability category | Expected IDs | Count | Reconciliation status summary | Audit anchor |
| --- | --- | ---: | --- | --- |
| Diagnostics | LS-DIAG-001–004 | 4 | 2 ✔️ · 2 🌗 | [LS-DIAG-001](./archive/implementation-audit-legacy.md#ls-diag-001) |
| Validation | LS-VAL-001–002 | 2 | 1 ✔️ · 1 🌗 | [LS-VAL-001](./archive/implementation-audit-legacy.md#ls-val-001) |
| Schema | LS-SCHEMA-001–002 | 2 | 1 ✔️ · 1 🌗 | [LS-SCHEMA-001](./archive/implementation-audit-legacy.md#ls-schema-001) |
| Tokenization | LS-TOKEN-001 | 1 | 1 ✔️ | [LS-TOKEN-001](./archive/implementation-audit-legacy.md#ls-token-001) |
| Completion | LS-COMP-001–003 | 3 | 1 ✔️ · 2 🌗 | [LS-COMP-001](./archive/implementation-audit-legacy.md#ls-comp-001) |
| Hover/metadata | LS-HOVER-001–002 | 2 | 2 🌗 | [LS-HOVER-001](./archive/implementation-audit-legacy.md#ls-hover-001) |
| Source ranges/navigation | LS-RANGE-001–002 | 2 | 1 🌗 · 1 ❌ | [LS-RANGE-001](./archive/implementation-audit-legacy.md#ls-range-001) |
| Document lifecycle | LS-DOC-001–003 | 3 | 1 ✔️ · 1 🌗 · 1 ➖ | [LS-DOC-001](./archive/implementation-audit-legacy.md#ls-doc-001) |
| Incremental behavior | LS-INCR-001–002 | 2 | 1 🌗 · 1 ❌ | [LS-INCR-001](./archive/implementation-audit-legacy.md#ls-incr-001) |
| Versioning/provenance | LS-VERS-001–002 | 2 | 1 ✔️ · 1 ❌ | [LS-VERS-001](./archive/implementation-audit-legacy.md#ls-vers-001) |
| Editor protocol | LS-PROTO-001–002 | 2 | 2 🌗 | [LS-PROTO-001](./archive/implementation-audit-legacy.md#ls-proto-001) |
| Error recovery | LS-REC-001–003 | 3 | 2 🌗 · 1 ➖ | [LS-REC-001](./archive/implementation-audit-legacy.md#ls-rec-001) |
| Consumer integration | LS-CONS-001–005 | 5 | 2 🌗 · 2 ⏸️ · 1 ⚠️ | [LS-CONS-001](./archive/implementation-audit-legacy.md#ls-cons-001) |

The category counts sum to 33 and the status summaries sum to the matrix
totals. A category's ✔️ entry means bounded implementation evidence on the
stated boundary, not exhaustive product or runtime coverage.

### Evidence class validation

The audit uses evidence status as a separate dimension. The following mapping
is applied consistently:

| Evidence class | Meaning in this handoff | Current use |
| --- | --- | --- |
| verified-local | Direct source plus local test/build/fixture evidence in the current checkout | Service, schema, token, completion, version, and selected consumer rows |
| local consumer evidence | Consumer source/tests pass locally, but host/public delivery is not proven | Playground and Markdown rows |
| contract-only (historical classification) | Typed/documented contract existed without executable adapter/runtime proof at the original audit snapshot | Historical MCP standalone and desktop integration findings; current integration delta is in the overlay above |
| mismatch-confirmed | Source/package/docs disagreement reproduced locally | Package/docs compatibility row |
| not verified | Required environment or delivery surface was not run | Node 24, registry, current CI, browser/public, and native host checks |

Evidence class does not promote a partial capability to implemented, and
not-verified delivery evidence does not turn an observed absent capability into
not-applicable.

## 4. Legend and scope validation

The current status matrix defines and uses the complete required status legend:

| Symbol | Validated meaning |
| --- | --- |
| ✔️ | Implemented on the stated boundary with direct evidence; bounded, not exhaustive |
| 🌗 | Partial implementation, coverage, result shape, or consumer parity |
| ❌ | Expected and in scope, but implementation for the stated behavior was not found |
| ➖ | Not applicable to this boundary because ownership is assigned to host/consumer |
| ⏸️ | Deferred or held by an explicit roadmap/dependency decision |
| ⚠️ | Confirmed mismatch or broken contract |
| ? | Evidence not verified; never an absence claim |

Validated scope separation:

The `?` marker used below is an evidence state only, not a seventh
implementation status. Every matrix row still has exactly one of the six
implementation symbols above; verification availability is reported separately.

- LS-DOC-003 and LS-REC-002 are ➖ only because active-document/session state
  and last-valid-preview retention are host-owned in the expected catalog.
- LS-CONS-003 and LS-CONS-004 are now 🌗: local MCP spec/document tools and
  desktop bridge exist; semantic service integration and live-client write
  verification remain open.
- LS-RANGE-002, LS-INCR-001, and LS-VERS-002 remain ❌ implementation gaps.
- LS-CONS-005 is ✔️ at the local source boundary after README/API/version repair;
  packed/registry/public delivery remains an evidence limitation.
- Browser, registry, current CI, and native evidence limitations are ? evidence
  findings, not scope decisions.

## 5. Limitations that remain open

1. Local verification used Node 22.23.2 while repository metadata requests Node
   24 or newer.
2. Current remote CI, fresh registry install, current public Playground, and
   native accessibility/host checks were not rerun in this validation.
3. Playground and Markdown local tests verify source/unit paths, not every
   browser bundle, public route, or failure-injection path.
4. MCP local runtime and desktop bridge are implemented at the host/protocol
   boundary; the language-service package does not own transport, storage, or
   active-document session state. Semantic adapter and live-client evidence
   remain open.
5. Shared fixtures and local tests are bounded evidence, not exhaustive
   coverage of every DSL vocabulary, editor context, or error combination.
6. A passing coverage or documentation check does not close an implementation
   gap; source changes and a fresh audit are required.

## 6. Unresolved questions requiring human/product decisions

| Question | Affected IDs | Why unresolved | Required decision/evidence |
| --- | --- | --- | --- |
| Should post-resolve geometry/constraint violations be part of getDiagnostics or a separate API? | LS-DIAG-004, LS-VAL-002 | Core/Playground expose the runtime path, while the service currently stops at parse/validation | Choose API boundary and add executable fixture/contract |
| What is the shared result DTO for exact ranges, revision, and provenance? | LS-RANGE-001, LS-INCR-002, LS-VERS-002, LS-PROTO-001 | Existing types cover individual results but not one versioned cross-consumer shape | Approve range encoding, identity, provenance, and serialization policy |
| Which bounded incremental strategy is required? | LS-INCR-001, LS-DOC-002 | Service is stateless and reparses/scans each call; performance target is not selected | Choose cache, edit-range, incremental parser, or measured bounded fallback |
| Who owns schema/completion vocabulary generation and drift checks? | LS-SCHEMA-002, LS-COMP-002 | Current catalogs are maintained/tested but no generated spec/core parity check exists | Assign source-of-truth workflow and add drift evidence |
| Should README be corrected to RELGEO_SCHEMA or should getSchema be added? | LS-CONS-005, LS-SCHEMA-001 | Public docs and observed exports disagree; package version text is also stale | Choose API change or docs correction, then run API/version regression test |
| Which semantic language-service tools should MCP expose next? | LS-CONS-003, LS-CONS-004, LS-PROTO-002 | Local MCP discovery and desktop document paths exist; semantic validation/completion and live write interoperability remain open | Define a bounded semantic DTO contract and verify client edit/revision/undo behavior |

## 7. Implementation handoff

Implementation remains a separate goal/task concern. The
[implementation-gap backlog](./implementation-gap-backlog.md)
proposes 23 tracked tasks (22 open, one locally closed):

- diagnostics, validation, schema, completion, hover, ranges, document
  lifecycle, incremental behavior, versioning, protocol, and recovery tasks;
- Playground and Markdown consumer integration tasks;
- MCP semantic-tool and desktop interoperability follow-up; and
- the confirmed package/docs compatibility repair.

The highest-risk handoff items are LS-TASK-012 for semantic navigation,
LS-TASK-014 for incremental analysis, LS-TASK-016 for result provenance,
LS-TASK-021 for Markdown failure fallback, and LS-TASK-022 for public API/version
compatibility. Assigning or completing these tasks requires source changes,
tests/fixtures, and a fresh audit; editing this handoff, matrix, or backlog is
not implementation evidence.

## 8. Final validation statement

The language-service coverage map and handoff are **structurally validated**
for the 33-ID catalog and inspected source/evidence boundary. The
language-service surface is **not declared complete**: the status matrix still
contains 17 partial, 3 absent, 1 broken, 2 deferred, and 2 host-owned rows,
and delivery evidence limitations remain explicit. Future implementation must
proceed as separate goals from the candidate backlog, with status re-audited
after each accepted change.

## Required evidence index

- [Repository map](../../REPOSITORY-MAP.md)
- [Maturation master plan](../../MATURATION-MASTER-PLAN.md)
- [Compatibility matrix](../../compatibility-matrix.json)
- [Language-service package/source](../../../language-service/README.md)
- [Capability-map index](../README.md)
- [Expected catalog](./expected-capability-catalog.md)
- [Implementation audit](./archive/implementation-audit-legacy.md)
- [Reconciliation](./reconciliation.md)
- [Status matrix](./status-matrix.md)
- [Implementation-gap backlog](./implementation-gap-backlog.md)
- [Surface discovery ledger](../SURFACE-DISCOVERY-LEDGER.md)
- [Inventory protocol](../INVENTORY-PROTOCOL.md)
