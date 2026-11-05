# Language-Service Implementation-Gap Backlog

**Tanggal:** 2026-11-04
**Status:** candidate goal/task register; no row here counts as implementation  
**Source:** [language-service status matrix](./status-matrix.md) and
[expected-versus-observed reconciliation](./reconciliation.md)

The current bounded implementation subset is recorded in
[in-scope-selection.md](./in-scope-selection.md). Rows not listed there remain
visible candidate work, not active implementation for this tranche. Selected
rows remain here after implementation so their residual gap and evidence are
not lost.
Local implementation evidence for selected rows is recorded in
[implementation-audit.md](./implementation-audit.md); status promotion remains
the responsibility of the reconciliation task, which has now joined the local
evidence below.

Backlog ini menurunkan setiap expected capability berstatus 🌗, ❌, atau ⚠️
menjadi satu candidate task. Status evidence dan keputusan scope tetap
terpisah. Dokumentasi matrix/backlog tidak menutup gap implementasi; status
baru berubah setelah implementation evidence diaudit ulang.

Priority is explicit below and follows the matrix risk level: P0 is a confirmed
public-contract defect, P1 is a release-relevant capability gap, and P2 is a
lower-risk follow-up. Scope states the implementation boundary for the task;
the acceptance column states the evidence required to close it. The
LS-CONS-005 row is contract repair, not a new feature: changing README text
alone does not count as implementation evidence.

## Aturan dan coverage

- Candidate task bukan goal aktif SuClos sampai owner, scope, dan dependency disetujui.
- Setiap task memiliki satu expected ID, owner, dependency, acceptance test/evidence target, risk, dan next action.
- ❌ berarti absent pada expected boundary; tidak boleh diubah menjadi ➖ karena delivery atau evidence sulit.
- ⚠️ berarti defect atau contract drift yang terkonfirmasi, bukan absence.
- ➖ dan ⏸️ tetap ada di matrix sebagai scope/roadmap state, tetapi bukan implementation-gap task pada backlog ini.

## Triage P0/P1 — 2026-11-04

Triage ini adalah keputusan intake untuk task `Triage remaining Language
Service gaps`. Status pada kolom **status awal** disalin dari status matrix dan
reconciliation saat triage; status tersebut bukan klaim bahwa gap sudah
ditutup. `Implementation-closable` berarti perubahan source/test/contract dapat
dikerjakan pada checkout lokal tanpa npm/pub.dev release, production deploy,
browser/public runtime, desktop client, atau host OS yang belum tersedia.

### Dipilih untuk implementation sekarang

Semua row berikut memiliki owner, source of truth, dan acceptance test yang
konkret. Candidate-task table di bawah tetap menjadi register dependency dan
next action; tabel ini mengunci subset yang boleh dilanjutkan ke task contract
dan implementation.

| Expected ID / candidate | Status awal | Owner | Source of truth | Acceptance test / evidence target |
| --- | --- | --- | --- | --- |
| `LS-DIAG-002` / `LS-TASK-001` | 🌗 partial | language-service + core | `spec/id/core/06-error-model.md`; `language-service/src/service.ts` | Incomplete-source fixtures preserve independent diagnostics, stable ranges, and actionable results without dropping the document. |
| `LS-VAL-002` / `LS-TASK-004` | 🌗 partial | language-service + core + Playground | `spec/id/core/01-overview.md`; `language-service/src/protocol.ts`; Playground worker contract | Request/result test distinguishes structurally valid, semantically validated, and resolve-ready without changing core semantics. |
| `LS-SCHEMA-002` / `LS-TASK-005` | 🌗 partial | language-service + spec | `spec/id/core/02-document-structure.md`; `scripts/check-language-service-schema-drift.mjs` | Deterministic active-vocabulary drift check reports zero root/object differences and has a mutation regression test. |
| `LS-COMP-002` / `LS-TASK-007` | 🌗 partial | language-service + core | `spec/id/geometry/`; `language-service/src/completions.ts` | Object-reference and geometry-context completion returns typed items with replacement ranges in focused fixtures. |
| `LS-COMP-003` / `LS-TASK-008` | 🌗 partial | language-service | `language-service/src/service.ts`; `language-service/src/__tests__/language_service.test.ts` | Blank-line, quoted-ID, incomplete-expression, `typ:`, and one-edit object-field typo recovery fixtures return useful completion without throwing. |
| `LS-HOVER-001` / `LS-TASK-009` | 🌗 partial | language-service + docs owner | `language-service/src/service.ts`; language-service documentation catalog | Bounded root/field hover fallback and resolved object/property hover have stable content/ranges; complete keyword/type/enum and provenance coverage remains open. |
| `LS-HOVER-002` / `LS-TASK-010` | 🌗 partial | language-service + core | `language-service/src/protocol.ts`; core resolved-metadata contract | Metadata snapshot contains bounded type/value/reference data and explicit provenance when available. |
| `LS-RANGE-001` / `LS-TASK-011` | 🌗 partial | language-service | `language-service/src/service.ts`; `language-service/src/protocol.ts` | Diagnostic, token, completion, hover, metadata, and semantic-reference ranges pass multiline and quoted-ID tests. |
| `LS-RANGE-002` / `LS-TASK-012` | 🌗 partial | language-service + Playground | `language-service/src/service.ts`; `playground/src/__tests__/graph-navigation.test.ts` | `analyzeNavigation()` and one Playground source-jump consumer preserve document identity and exact UTF-16 ranges. |
| `LS-DOC-002` / `LS-TASK-013` | 🌗 partial | language-service + Playground | `docs/plans/05-public-docs-and-playground-hardening.md`; Playground worker sequencing tests | Edit → analysis → consumer sequence distinguishes document/session identity from source text and rejects misordered results. |
| `LS-INCR-002` / `LS-TASK-015` | 🌗 partial | language-service + Playground + MCP | `docs/plans/11-mcp-agent-integration.md`; `language-service/src/protocol.ts` | Out-of-order response integration test rejects stale results; identity remains serializable and monotonic. |
| `LS-VERS-002` / `LS-TASK-016` | 🌗 partial | language-service + protocol owners | `docs/capability-map/language-service/protocol-contract.md`; `language-service/src/protocol.ts` | Local result producers preserve protocol/spec version, UTF-16 encoding, identity, and caller/default producer provenance; source revision and downstream adapter propagation remain open. |
| `LS-PROTO-001` / `LS-TASK-017` | 🌗 partial | language-service | `language-service/src/protocol.ts`; `language-service/src/__tests__/protocol.test.ts` | Diagnostics, validation, schema, token, completion, hover, and metadata use versioned serializable DTOs or typed adapters. |
| `LS-PROTO-002` / `LS-TASK-018` | 🌗 partial | language-service + MCP | `docs/capability-map/language-service/protocol-contract.md`; `mcp/lib/src/contract/mcp_schema.dart` | TypeScript JSON and MCP DTO/dispatch fixtures preserve ranges, identity, readiness, recovery, and provenance without side effects. |
| `LS-REC-001` / `LS-TASK-019` | 🌗 partial | language-service + Playground | `language-service/src/protocol.ts`; `playground/src/__tests__/worker.test.ts` | Invalid → partial → recovered → stable sequence exposes explicit states and rejects false success. |
| `LS-REC-003` / `LS-TASK-020` | 🌗 partial | spec/core + consumer owners | `spec/id/core/06-error-model.md`; service/worker/storage/share/runtime error contracts | Same scenario maps consistently to parser, validation, runtime, or storage origin while host-owned errors remain distinct. |
| `LS-CONS-002` / `LS-TASK-021` | 🌗 partial | remark-relgeo-hl + language-service | `remark-relgeo-hl/src/__tests__/remark_relgeo_hl.test.ts`; token service contract | Injected language-service failure preserves fenced source or safe fallback and does not fail the Markdown transform. |
| `LS-CONS-003` / `LS-TASK-023` | 🌗 partial | MCP + language-service + core | `docs/plans/11-mcp-agent-integration.md`; `mcp/lib/src/contract/mcp_schema.dart` | Local MCP/core fixtures prove typed validation/diagnostic mapping and identity/readiness/provenance propagation. |

### Dipisahkan dari implementation sekarang

Row berikut tetap P0/P1 dan tetap memiliki owner serta next action, tetapi
tidak menjadi blocker untuk implementation-closable subset.

| Expected ID / candidate | Status awal | Classification | Owner / source of truth | Evidence atau next action |
| --- | --- | --- | --- | --- |
| `LS-DIAG-004` / `LS-TASK-002` | 🌗 partial | **scope-deferred** — API structural-only versus separate post-resolve diagnostics belum diputuskan | core + language-service; `spec/id/core/06-error-model.md` | Catat keputusan boundary, lalu tambahkan method/fixture hanya bila post-resolve result memang masuk scope. |
| `LS-INCR-001` / `LS-TASK-014` | 🌗 partial | **dependency-deferred** — full-document semantic fallback tidak dapat diganti sebelum core menyediakan dependency/index semantics | language-service + host worker; `language-service/src/analysis.ts` dan core analysis contract | Ukur fallback secara lokal; lanjutkan bounded dependency analysis setelah core index contract tersedia. |
| `LS-CONS-001` / `LS-TASK-003` | 🌗 partial | **external-evidence** — source/unit path sudah ada; gap residual adalah browser/public bundle smoke | Playground + language-service; Playground browser bundle/worker contract | Jalankan browser smoke dan catat artifact revision pada environment yang tersedia; jangan klaim parity dari unit tests saja. |
| `LS-CONS-004` / `LS-TASK-024` | 🌗 partial | **external-evidence** — live ChatGPT Desktop client dan target host OS diperlukan | MCP + Flutter + language-service; host session/revision/undo contract | Verifikasi client round-trip, stale guard, undo, dan packaged startup/shutdown pada supported OS; tetap terpisah dari semantic adapter work. |
| `LS-CONS-005` / `LS-TASK-022` | ✔️ local closed | **closed-local / release-evidence** — implementation repair selesai pada source boundary | language-service; `language-service/README.md`, `language-service/package.json`, `language-service/src/index.ts` | Pertahankan local regression evidence; verifikasi packed/registry/public artifact ketika release environment tersedia. |

### Triage accounting

| Check | Result |
| --- | ---: |
| P0/P1 rows reviewed | 23 (P0: 1, P1: 22) |
| Selected for implementation now | 18 |
| Scope/dependency deferred | 2 |
| External evidence only | 2 |
| Closed locally, release evidence pending | 1 |
| Selected rows with owner, source of truth, acceptance target, and initial status | 18/18 |

This triage does not promote any status symbol. The status matrix and
reconciliation remain authoritative for capability state; this section is the
canonical intake boundary for the next contract/implementation tasks.

## Contract lock and acceptance matrix — 2026-11-04

The following contract is locked before implementation begins. The precedence
order is: normative `spec/id` and core semantic behavior, then the frozen
language-service protocol, then consumer/host adapters. The inventory protocol
requires each row to keep implementation, evidence, parity, and scope
separate; this matrix therefore records behavior and evidence without
promoting any status symbol.

Compatibility invariants for this tranche:

- RelGeo DSL/spec compatibility remains `0.5`; the package remains
  `@relgeo/language-service` `0.5.1` and internal consumers remain on the
  `^0.5.0` family range. See [`docs/compatibility-matrix.json`](../../compatibility-matrix.json).
- The public result envelope remains protocol `0.2`, with `specVersion` `0.5`,
  UTF-16 half-open ranges, and `documentId` + monotonic `version` + opaque
  `requestId` as the minimum stale-result identity. See
  [`protocol-contract.md`](./protocol-contract.md).
- `spec/id` is normative, `core` owns semantic truth, language-service owns
  editor projection, and Playground/MCP/Markdown own their adapter or host
  behavior. See [`reconciliation.md`](./reconciliation.md) and the
  [inventory protocol](../INVENTORY-PROTOCOL.md).
- Changes to these invariants are not part of this implementation tranche. A
  breaking change requires an explicit compatibility decision record and
  coordinated next-line release; additive optional fields require a source of
  truth and serialization regression test.

| Expected ID | Locked boundary and source | Success behavior | Failure / edge behavior | Evidence target |
| --- | --- | --- | --- | --- |
| `LS-DIAG-002` | Language-service aggregates core parser diagnostics; `spec/id/core/06-error-model.md` defines diagnostic meaning. | Incomplete input returns stable, actionable independent diagnostics with source ranges and keeps the document editable. | Malformed or incomplete input must not throw, discard unrelated diagnostics, or invent semantic errors unavailable from core. | Language-service incomplete-source fixtures plus shared conformance diagnostics. |
| `LS-VAL-002` | Service/Playground result boundary uses protocol readiness; core remains validation/resolve authority. | Results distinguish `structurally-valid`, `semantically-valid`, and `resolve-ready` only at the corresponding evidence boundary. | Empty diagnostics alone cannot claim semantic validity; core unavailable or unresolved input remains `partial`/`invalid`. | Protocol readiness tests and a Playground worker request/result fixture. |
| `LS-SCHEMA-002` | Language-service schema/catalog adapts active `spec/id` vocabulary; `spec/id/core/02-document-structure.md` is normative. | Active sections, object types, fields, parameters, views, sheets, and presentation vocabulary compare deterministically with zero drift. | Unknown or unsupported spec vocabulary is reported as drift; the editor must not silently advertise it as supported. | `scripts/check-language-service-schema-drift.mjs` clean run and mutation regression. |
| `LS-COMP-002` | Completion projects bounded semantic context from core/spec; it is not a general constraint solver. | Object references and geometry context return typed items with exact replacement ranges. | Missing or ambiguous semantic context returns a bounded empty/structural result, never an invented object or geometry mutation. | Focused service completion fixtures for object IDs, anchors, selectors, and replacement ranges. |
| `LS-COMP-003` | Language-service owns recovery-aware completion projection; parser recovery remains a core boundary. | Blank lines, quoted IDs, incomplete expressions, and `typ:` typo contexts return useful completion without throwing. | Unsupported parser-error shapes return safe empty/partial results and preserve source context; no false semantic suggestion. | Focused partial/error completion suite and negative parser-shape fixtures. |
| `LS-HOVER-001` | Service owns syntax/field documentation projection; documentation provenance remains explicit. | Keyword, field, type, enum, valid-document, incomplete-document, and quoted-ID hover have stable content and ranges. | Unknown or incomplete symbols return null/partial hover without fabricated documentation or out-of-range spans. | Direct hover tests covering each listed query family. |
| `LS-HOVER-002` | Metadata DTO projects bounded core-derived information with protocol provenance. | Metadata includes bounded type/value/reference information and `spec`/revision provenance when available. | Unresolved or unavailable metadata is omitted or marked unavailable; consumers must not infer derived values from absence. | Metadata serialization snapshots and provenance-focused service tests. |
| `LS-RANGE-001` | All editor result families use protocol UTF-16, zero-based, half-open source ranges. | Diagnostics, tokens, completion edits, hover, metadata, and semantic references point to exact source spans. | Multibyte text, quoted IDs, multiline input, and EOF positions must not shift, invert, or escape the document range. | Multiline/quoted-ID range fixtures across result families. |
| `LS-RANGE-002` | Service returns typed navigation locations; Playground owns source-jump action and host document selection. | Definition/reference locations include target document identity and exact UTF-16 ranges; one host action consumes them. | Unknown target returns no location; cross-document or stale navigation cannot apply to the active document. | `analyzeNavigation()` service tests plus one Playground source-jump integration test. |
| `LS-DOC-002` | Service remains stateless; worker/consumer carries document/session identity and ordering. | Edit → analysis → consumer result preserves document identity, version, request identity, and ordering. | Out-of-order or wrong-document results are rejected without mutating current consumer state; source text is never used as identity. | Worker sequencing test and serialized request/result fixture. |
| `LS-INCR-002` | Service emits identity; Playground/MCP adapters enforce the stale-result boundary. | A result is accepted only when `documentId`, `version`, and `requestId` all match the current request. | Any mismatch yields stale/null disposition and cannot apply diagnostics, edits, navigation, or preview state. | `acceptCurrentDocumentAnalysis()` tests plus worker/MCP identity echo tests. |
| `LS-VERS-002` | Every local producer/adapter carries the frozen version/provenance envelope; compatibility policy remains `0.5`. | Results preserve protocol `0.2`, spec `0.5`, UTF-16 encoding, identity, optional revision, and provenance. | Missing optional provenance is allowed; wrong protocol/spec version or silently dropped identity fails the contract. | TypeScript result snapshots and local MCP adapter propagation tests. |
| `LS-PROTO-001` | Typed DTOs/adapters are the read-only public editor protocol; no official LSP server is implied. | Diagnostics, validation, schema, token, completion, hover, and metadata serialize through versioned typed shapes. | Unknown/malformed payloads fail safely; adapters may not invent incompatible fields or discard required range/identity data. | `language-service/src/__tests__/protocol.test.ts` and family type tests. |
| `LS-PROTO-002` | TypeScript JSON and MCP DTOs are serialization boundaries with no filesystem, network, UI, or mutation authority. | Round-trip preserves ranges, identity, readiness, recovery, provenance, and result kind without side effects. | Invalid DTO or unsupported result kind is rejected/contained; serialization failure cannot trigger a host mutation. | TypeScript JSON fixtures plus `mcp` schema/dispatch protocol tests. |
| `LS-REC-001` | Service exposes recovery state; Playground maps it to host actions and retains host-owned preview state separately. | Invalid → partial → recovered → stable sequence is explicit and preserves the current document context. | A current invalid/partial result cannot be labeled recovered; recovery metadata must not claim a valid preview. | Service protocol sequence tests and Playground worker recovery fixtures. |
| `LS-REC-003` | Error-origin vocabulary spans spec/core and consumer boundaries without collapsing host ownership. | Equivalent scenarios map consistently to parser, validation, runtime, or storage origins. | Storage/share/host failures remain distinguishable from language-service semantic errors; unknown origin is explicit, not guessed. | Cross-boundary origin mapping fixtures and consumer adapter assertions. |
| `LS-CONS-002` | Markdown highlighter consumes language-service tokens; plugin owns source-preserving fallback. | Normal highlighting succeeds and an injected service failure returns original fenced source or safe fallback. | Malformed input or thrown service error must not fail the Markdown transform or erase source content. | `remark-relgeo-hl` failure-injection test plus normal-path tests. |
| `LS-CONS-003` | MCP owns tool/transport semantics; language-service/core provide typed semantic results and provenance. | Local MCP/core path returns structured validation/diagnostic results with identity, readiness, ranges, and provenance. | Core/transport failure returns a structured failure/unknown result without claiming valid semantics or performing writes. | Local MCP/core adapter fixtures and MCP schema/dispatch tests. |

No public contract is considered changed by this lock alone. The next
implementation task must attach source/test diffs to each acceptance row and
must update the reconciliation only after those checks run. Browser/public,
registry, desktop-client, and host-OS checks remain external evidence and are
not substituted by local contract tests.

Implementation update for this task: `language-service/src/service.ts` now
implements the bounded `analyzeMetadata()` producer and opt-in core-backed
`validationTarget` states, with protocol regression coverage in
`language-service/src/__tests__/protocol.test.ts`. These changes preserve the
structural default and do not promote `LS-HOVER-002`, `LS-RANGE-001`, or
`LS-VAL-002`; their broader consumer/provenance gaps remain open for
verification and reconciliation.

The metadata producer now also emits exact-range, `targetId`-carrying entries
for the bounded reference-shaped fields `from`, `through`, `to`, `target`, and
`use` when their values are scalar source references. This improves local
semantic-reference evidence without claiming that the language service has
resolved the target or computed geometry.

The service hover fallback now projects bounded syntax/field documentation from
the active completion catalog when the source cannot be resolved. This gives
incomplete documents a safe explanatory result without inventing semantic
values; complete keyword/type/enum documentation and provenance remain open.

Protocol results now carry caller-supplied provenance or a minimal additive
producer entry (`source: language-service`, active spec version) when the host
omits it. This makes the producer boundary explicit without inventing a source
revision; revision and downstream adapter propagation remain open.

The Playground worker boundary now consumes the same readiness vocabulary as
an additive response envelope: empty source returns `partial`, parse/resolve
failure returns `invalid`, successful parse+resolve returns `resolve-ready`,
and a success after a worker-observed `invalid` or `partial` state returns
`recovered` (otherwise `stable`). `playground/src/__tests__/worker.test.ts`
covers these states, while the existing document/scene/SVG payload remains
backward-compatible. This closes only local worker evidence; browser/public
execution and broader core-backed producer propagation remain open.

| Check | Result |
| --- | --- |
| Tracked rows | 23 |
| Open candidate tasks | 22 |
| Locally closed rows retained for evidence | 1 (`LS-TASK-022`) |
| Open-task priority | P1: 22 |
| Open 🌗 tasks | 22 |
| Open ❌ tasks | 0 |
| Open ⚠️ tasks | 0 |
| Missing source IDs | 0 |
| Duplicate task source IDs | 0 |

## Candidate tasks

| Candidate task | Expected ID | Source status | Priority | Scope | Owner | Dependency | Acceptance test / evidence target | Risk | Next action |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| LS-TASK-001 tolerant syntax diagnostics | LS-DIAG-002 | 🌗 | P1 | language-service/core diagnostic aggregation for incomplete source | language-service + core | parser recovery; diagnostic ordering | Bounded aggregation now preserves independent diagnostics and passes focused service/conformance tests; broad incomplete-source recovery remains open | P1 edit-time recovery is noisy or incomplete | Expand the incomplete-source matrix and choose a broader aggregation policy |
| LS-TASK-002 post-resolve diagnostic contract | LS-DIAG-004 | 🌗 | P1 | boundary between structural diagnostics and post-resolve constraint results | core + language-service | resolver violation DTO; API boundary decision | A runtime constraint fixture either returns a documented language-service result or is explicitly covered by a separate runtime-diagnostics API | P1 runtime failures remain disconnected from editor results | Decide structural-only versus separate post-resolve method |
| LS-TASK-003 Playground browser integration | LS-CONS-001 | 🌗 | P1 | Playground browser bundle, worker, and editor consumer path | Playground + language-service | browser bundle; worker lifecycle; current artifact | Current Editor consumer now sends document/version/request identity to typed diagnostics/completion/hover adapters with legacy fallback; 106 unit tests, lint, and build pass | P1 local wiring may diverge from shipped path | Run current browser smoke and record route/build evidence |
| LS-TASK-004 validation readiness result | LS-VAL-002 | 🌗 | P1 | validate-only versus resolve-ready result semantics | language-service + Playground | validate-only versus resolve-ready semantics | A request/result test distinguishes structurally valid, semantically validated, and resolved-ready states without changing core semantics | P1 consumers treat partial validation as preview-safe | Draft result state vocabulary and worker contract |
| LS-TASK-005 schema drift checker | LS-SCHEMA-002 | 🌗 | P1 | generated comparison of active spec vocabulary and editor catalogs | language-service + spec | active spec vocabulary; core type catalog | `node scripts/check-language-service-schema-drift.mjs` reports zero root/object differences against the active `spec/id` snapshot; generated all-spec comparison remains open | P1 editor schema diverges silently from DSL | Connect the checker to generated active-spec vocabulary evidence |
| LS-TASK-007 semantic geometry completion context | LS-COMP-002 | 🌗 | P1 | bounded semantic completion context for object identity and geometry | language-service + core | semantic index; object identity | Bounded object-reference and object-context completion returns typed items with replacement ranges; full AST/semantic-index coverage remains open | P1 high-value semantic suggestions missing | Extend semantic-context coverage only with an agreed index contract |
| LS-TASK-008 partial/error completion suite | LS-COMP-003 | 🌗 | P1 | recovery-aware completion behavior and partial-context fixtures | language-service | tolerant parser; recovery context | Focused tests cover blank lines, quoted IDs, incomplete expressions, `typ:`, and one-edit object-field typo recovery without throwing; all parser-error shapes remain open | P1 users cannot recover after a typo | Add fixtures for the remaining supported partial contexts |
| LS-TASK-009 syntax and field hover contract | LS-HOVER-001 | 🌗 | P1 | syntax, field, type, enum, and incomplete-source hover content | language-service + docs owner | syntax catalog; documentation provenance | Direct service tests cover bounded root/field fallback and resolved object/property hover with stable content/range; complete keyword/type/enum and quoted-ID coverage remains open | P1 hover is empty or misleading | Define minimum hover content and source provenance |
| LS-TASK-010 semantic metadata provenance | LS-HOVER-002 | 🌗 | P1 | bounded semantic metadata and provenance result DTO | language-service + core | resolved metadata; provenance DTO | Metadata snapshot includes bounded type/value/reference information and explicit spec/revision provenance where available | P1 consumers overclaim derived values | Draft metadata DTO and add serialization snapshots |
| LS-TASK-011 exact ranges across result families | LS-RANGE-001 | 🌗 | P1 | source ranges across diagnostics, tokens, completion, hover, and metadata | language-service | source-location policy; position encoding | Diagnostics use core ranges; tokens, completion edits, hover, bounded metadata, and reference-shaped metadata carry tested ranges; broader semantic-index and host coverage remains open | P1 highlights/replacements target wrong source | Extend the range contract to broader semantic-index and host result consumers |
| LS-TASK-012 semantic navigation result | LS-RANGE-002 | 🌗 | P1 | minimal definition/reference navigation DTO and one host consumer | language-service + host | exact ranges; reference identity; host action contract | `analyzeNavigation()` returns typed definition/reference locations with document identity and exact ranges for object references; host jump action remains open | P1 users cannot jump from semantic result to source | Wire a Playground source-jump action against the navigation result |
| LS-TASK-013 document lifecycle request contract | LS-DOC-002 | 🌗 | P1 | stateless document update, analysis, identity, and ordering contract | language-service + Playground | document identity; request/result states | Edit sequence test proves update → analysis → consumer result ordering and distinguishes document/session identity from source text | P1 results can be attached to wrong document | Draft stateless request lifecycle DTO |
| LS-TASK-014 incremental or bounded analysis | LS-INCR-001 | 🌗 | P1 | bounded re-analysis strategy, benchmark, and edit-sequence behavior | language-service + host worker | performance target; edit-range model; parser capabilities | Local edits report changed range/line budget and inspected work; the selected full-document semantic fallback is explicit and measured because core dependency semantics are not incremental | P1 responsiveness degrades with document size | Replace fallback with dependency-bounded analysis only after core exposes a stable semantic index |
| LS-TASK-015 service stale-result identity | LS-INCR-002 | 🌗 | P1 | request/document identity fields and stale-result enforcement | language-service + Playground + MCP | document revision/request ID; serialization | Service mismatch helpers pass; Playground sends identity fields; MCP completion/validation inputs echo identity on results when supplied | P1 stale analysis can overwrite audited source | Add the service-to-worker integration assertion before adapter rollout |
| LS-TASK-016 result version and provenance | LS-VERS-002 | 🌗 | P1 | spec version, source revision, and provenance fields on results | language-service + protocol owners | compatibility policy; source/revision provenance | TypeScript results and MCP editor results carry protocol/spec version, UTF-16 encoding, document/request identity, optional revision, and provenance; remaining producer/consumer propagation closes the row | P1 evidence cannot be traced across consumers | Propagate the frozen envelope through remaining result producers and adapters |
| LS-TASK-017 unified typed editor protocol | LS-PROTO-001 | 🌗 | P1 | versioned read-only unified result DTO or explicit typed adapters | language-service | ranges, provenance, result state decisions | Diagnostics, validation, schema, token, completion, hover, and metadata share a versioned serializable DTO or explicit adapters with type tests | P1 each consumer invents incompatible shapes | Publish read-only protocol draft from existing types |
| LS-TASK-018 safe protocol serialization | LS-PROTO-002 | 🌗 | P1 | safe serialization and side-effect boundary tests | language-service + MCP | MCP security boundary; DTO schema | TypeScript JSON serialization and MCP Dart DTO/dispatch tests preserve ranges, identity, readiness, recovery, and provenance without side effects; packaged/cross-host evidence remains open | P1 adapter can lose safety or data fidelity | Add fixture-based cross-package serialization tests before runtime adapter |
| LS-TASK-019 actionable recovery states | LS-REC-001 | 🌗 | P1 | invalid-to-valid recovery state and sequence contract | language-service + Playground | error-origin taxonomy; invalid-to-valid sequence | Invalid, partial, recovered, and stable states are explicit in analysis/validation results and the invalid→partial→recovered sequence test rejects false success | P1 editor loop loses document or recovery context | Map recovery states to host actions and preserve last-valid preview separately |
| LS-TASK-020 cross-boundary error origins | LS-REC-003 | 🌗 | P1 | canonical parser, validation, runtime, and storage error-origin mapping | spec/core + consumer owners | parser/validation/runtime/storage origin vocabulary | Same scenario is classified consistently across service, worker, storage, share, and runtime paths; host-owned errors stay distinguishable | P1 user chooses wrong recovery action | Map existing codes/messages to canonical origin classes |
| LS-TASK-021 Markdown failure fallback | LS-CONS-002 | 🌗 | P1 | remark plugin source-preserving failure fallback | remark-relgeo-hl + language-service | token service error handling; source-preserving renderer | Injected language-service failure returns original fenced source or safe fallback and does not fail the Markdown transform; test passes | P1 docs build breaks on malformed/service failure input | Add try/catch fallback and failure-injection test |
| LS-TASK-022 package/docs API and version repair | LS-CONS-005 | ✔️ | P0 | public API/version contract repair with source or documentation regression test | language-service owner | API decision for getSchema; release metadata policy | README matches `0.5.1`, `getSchema()` is implemented, and the API/version regression test passes locally | Public consumers still need packed/registry verification | Retain as closed local evidence; verify packed/public artifact in the release environment |
| LS-TASK-023 MCP semantic analysis integration | LS-CONS-003 | 🌗 | P1 | core-backed validation/diagnostic mapping; MCP owns tool/transport semantics | MCP + language-service + core | typed semantic result/provenance DTOs; current MCP tool contract | MCP now accepts/echoes typed editor identity and exposes readiness/recovery fields on validation results; full core-backed language-service producer wiring remains open | Agents cannot validate or explain a proposal against current RelGeo semantics | Wire a core-backed semantic adapter and retain completion/render as separately scoped |
| LS-TASK-024 Desktop active-document write interoperability | LS-CONS-004 | 🌗 | P1 | verify existing Flutter-hosted bounded edit end to end; host/session/undo ownership stays in MCP/Flutter | MCP + Flutter + language-service | ChatGPT Desktop client; draft package on supported desktop hosts | Desktop edit round-trip proves revision guard, dirty state, and undo; packaged MCP startup and shutdown are smoke-tested per target OS | Users may trust an edit that did not apply to the intended active revision | Verify the live client round-trip and packaged-server smoke, prioritizing Windows |

## Scope and evidence follow-ups

These rows are intentionally not implementation tasks:

| Follow-up | Status | Owner | Acceptance evidence | Next action |
| --- | --- | --- | --- | --- |
| Active document identity, dirty state, and session storage | ➖ not-applicable | Playground/MCP/Flutter | Host DTO and lifecycle tests cover identity/dirty/revision without moving storage into language-service | Keep linked to host matrix; do not add service state by assumption |
| Last valid preview retention | ➖ not-applicable | Playground/host | Invalid update keeps last successful preview while Errors is shown | Maintain consumer acceptance test separately |
| MCP semantic analysis adapter and desktop verification | 🌗 partial | MCP/Flutter + language-service + core | Existing local MCP runtime and host bridge; semantic DTO contract and live desktop client | Define and test core-backed validation/diagnostics/completion integration; verify guarded edit round-trip separately |
| Node 24, registry, current CI, browser/public, native AT | ? unverified | workspace and consumer owners | Fresh canonical environment evidence | Schedule verification independently from gap implementation |

## Evidence handoff

The current implementation and verification handoff is recorded in the
[current implementation audit](./implementation-audit.md#reproducible-evidence-and-handoff--2026-11-04).
Local evidence is reproducible at the package and workspace boundaries and is
not contingent on npm/pub.dev publication, production deployment, registry
installation, or the MCP/Flutter host; local MCP host paths are now implemented while semantic integration remains open. The backlog remains the
authoritative handoff for residual work: selected rows with bounded local
evidence retain their residual `🌗` status, `LS-CONS-005` is retained as closed
local evidence, and unresolved `❌`, host-owned `➖`, and any historically deferred selection is visibly tracked as partial where current implementation evidence now exists.

The checkout anchors at handoff are workspace root
`1cfa86553d7adb18179c6b3e1a33618a179b1414`, language-service
`39c06dd8505d480672b0953d523f3675a7f30075`, Playground
`59a42ae925cf0c21541bc19ccac39f5061b35439`, and Markdown highlighter
`507ad18fe1b8c91eb3a48e365b5290cd02b049b8`. The first three boundaries have
working-tree changes; the Markdown highlighter was clean. These are review
anchors, not claims that the changes have been committed or released.

## Handoff rules

1. A candidate task becomes implementation work only after owner, dependency,
   scope, and acceptance evidence are approved.
2. A task is complete only after source/tests are changed and the status
   matrix plus audit are re-run. Editing this backlog is never completion
   evidence.
3. If implementation changes a capability boundary, update the expected
   catalog or scope decision explicitly before changing the status.
4. ➖ and ⏸️ must not be used to hide an absent language-service capability.

## Source links

- [Language-service package/source](../../../language-service/README.md)
- [Repository map](../../REPOSITORY-MAP.md)
- [Expected catalog](./expected-capability-catalog.md)
- [Implementation audit evidence](./implementation-audit.md)
- [Expected-versus-observed reconciliation](./reconciliation.md)
- [Status matrix](./status-matrix.md)
- [Maturation master plan](../../MATURATION-MASTER-PLAN.md)
- [Compatibility matrix](../../compatibility-matrix.json)
