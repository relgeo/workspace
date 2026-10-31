# RelGeo MCP — current implementation and evidence audit

**Audit date:** 2026-10-31

**Compatibility line:** RelGeo DSL `0.5.x`

**Audit role:** current evidence entry point for the 68-row expected catalog
**Status rule:** implementation status and evidence status are separate. A
fixture, contract, documentation statement, or CI definition is not promoted
to end-to-end MCP delivery without a directly matching runtime observation.

> **Current implementation overlay (2026-10-31):** The original 68-row audit
> below predates the desktop HTTP server, packaged full-spec search, and
> permission-gated edit tool. Those rows are reconciled in the current status
> matrix and reconciliation; do not use the old absence statements below as
> current facts. Current child commits are MCP `b4561c0` and Flutter `60ec760`.
> The Flutter CI run `41184291670` passed the desktop test/build matrix and the
> release workflow `41184693233` produced draft v1.0.1 artifacts. Local MCP
> Dart tests and Flutter integration tests cover tools/resources, loopback
> Streamable HTTP, auth scopes, stale edits, undo, and offline spec retrieval.
> ChatGPT Desktop live edit round-trip and packaged desktop MCP smoke remain
> unverified. The root integration manifest remains captured at 2026-10-09 and
> does not track these newer child revisions.

### Current Plan 14 overlay

| Capability | Current implementation/evidence | Status boundary | Canonicality |
| --- | --- | --- | --- |
| Full snapshot and drift identity | `flutter/assets/relgeo_spec/v0.5/manifest.json`, 34 Markdown files, source revision `b96ba3b...`, corpus digest, and `spec:snapshot:check` | Verified locally | Snapshot is in current Flutter child commit; root integration manifest still pins an older Flutter revision |
| Search and complete-section retrieval | `SpecSectionIndex`, `relgeo_search_spec`, `relgeo_get_spec_section`, bounded snippets, stable IDs, and resources | Verified locally | Supporting local; MCP package child commit is not refreshed in baseline |
| Flutter offline host bridge | `RelGeoSpecSnapshotLoader` and `RelGeoMcpDesktopServer.start` load only the bundled AssetBundle | Verified by Flutter tests/analyzer | Supporting local; desktop artifact/CI smoke is not claimed |
| Normativity and provenance | Spec sections carry source/path/anchor/version/revision/digest; examples remain `source: example` and non-normative | Verified by adapter and Flutter tests | Supporting local |
| Retrieval quality scenarios | Indonesian/English intent, ambiguity, no-result, presentation, full-section, and offline fixtures pass | Deterministic local tests pass | Supporting local |
| Inspector/Codex Desktop/loopback HTTP | Local Flutter IO tests exercise loopback HTTP; user has observed ChatGPT Desktop read-only spec/document calls; write round-trip and Inspector compatibility remain unverified | Read-only client behavior user-observed; current write flow not verified | Local integration and user observation, not canonical cross-host evidence |

The historical one-row-per-ID register remains useful for the broader Plan 11
backlog, but it must not overwrite this Plan 14 overlay or claim that local
supporting evidence is canonical CI/public evidence.

The [expected capability catalog](./expected-capability-catalog.md) remains
the expected baseline. The [reconciliation](./reconciliation.md) and [status
matrix](./status-matrix.md) contain the one-row-per-ID result. The prior dated
log is retained as [historical audit evidence](./archive/implementation-audit-legacy.md),
not as proof of current CI, deployment, or runtime state.

## 1. Audit scope and method

The audit inspected the pure-Dart `mcp/` package, its tests and transport
fixtures, the Flutter bridge/session and host lifecycle surfaces, relevant
consumer packages, MCP design/conformance documents, and available CI
configuration. Findings were assigned only where the inspected boundary could
support the claim:

- `✔️` means the audited boundary has direct implementation and sufficient
  evidence for that outcome;
- `🌗` means a contract, fixture, host subset, or consumer exists but the
  expected MCP outcome is not complete;
- `❌` means the in-scope outcome was checked against its owner boundary and
  implementation was not found;
- `⚠️` means a concrete defect or contract mismatch was observed;
- `⏸️` remains a deliberate roadmap/scope hold; it is not active work;
- `➖` is reserved for non-owner scope findings and is not used to remove an
  expected row.

Absence findings below are based on the catalog owner map, source paths,
tests, host boundaries, and the existing reconciliation—not on a single failed
text search. Missing services, dependencies, or permissions are recorded as
`not-verified` or `environment-unavailable`, not as target implementation
failures.

## 2. Snapshot and coverage

| Observation | Result | Evidence |
| --- | --- | --- |
| Workspace root revision at previous audit | `1cfa86553d7adb18179c6b3e1a33618a179b1414` | Historical 2026-10-30 audit snapshot |
| Current workspace root revision | `7d02e4c` | Documentation-only follow-up; baseline manifest remains older |
| Current MCP checkout | `b4561c08f7b41fd5630c76138a26ce6717ae9b33` | Child commit includes guarded document edit tool |
| Current Flutter checkout | `60ec76042b369659e4d048b2a53ea3a66a384de3` | Child commit includes desktop MCP editing and release workflow |
| Expected catalog → reconciliation | `68/68` | [reconciliation](./reconciliation.md) coverage |
| Expected catalog → status matrix | `68/68` | [status matrix](./status-matrix.md) rows |
| Current capability status | `32 ✔️`, `24 🌗`, `10 ❌`, `0 ⚠️`, `2 ⏸️`, `0 ➖` | Updated status matrix count; evidence state remains separate |
| Rows with not-verified evidence | `VAL-03`, `CXL-02`, `DEL-03` | Current matrix; no live cross-host or Inspector proof is claimed |
| Environment-unavailable evidence | None in current source/test audit | Earlier sandbox bind failure is historical; Flutter IO integration tests now bind loopback |

The bounded active tranche is recorded in the [MCP in-scope selection](./in-scope-selection.md).
It selects 20 rows; the remaining active backlog rows stay visible and are not
implicitly promoted, removed, or treated as completed.

## 3. Current implementation boundaries — 2026-10-31

| Boundary | Current implementation and direct evidence | Remaining boundary |
| --- | --- | --- |
| Full normative spec retrieval | MCP `b4561c0` indexes the bundled v0.5 Markdown snapshot; `relgeo_search_spec`, `relgeo_get_spec_section`, `relgeo_get_syntax_rule`, and spec resources return bounded results with section provenance. Flutter loads the checked-in 34-file bundle offline. | Search is lexical and limited to the pinned DSL 0.5 corpus. This is not semantic validation, completion, or rendering. |
| Active document read | Desktop router exposes active source/identity/revision/dirty state and diagnostics through the authenticated bridge; Flutter HTTP tests cover tools and resources. | Direct interoperability with current ChatGPT Desktop and packaged release smoke remain unverified. |
| Embedded transport/lifecycle | Flutter `60ec760` owns `RelGeoMcpDesktopServer`, binds ephemeral IPv4 loopback, validates host/origin, authenticates an in-memory eight-hour bearer token, and closes/revokes on stop. Workbench dialog is opt-in and exposes running state, endpoint, permission, temporary token, copy-config, Enable, and Disable. | Connected-client count/status is not exposed. Packaged-app behavior on each OS is not verified. |
| Permission-gated edit | Read-only mode omits/rejects `relgeo_apply_document_edit`; read-write is an explicit dialog choice. The tool applies bounded patches only to the active document with identity/revision checks and one undoable editor transaction. HTTP integration covers denied, stale, applied, dirty, and undo behavior. | A live ChatGPT Desktop edit round-trip and packaged app smoke remain pending. `EDIT-01`, `EDIT-05`, and cancellation/race coverage remain partial. |
| Save/file boundary | Apply changes the in-memory editor; Save, Save As, export, and autosave are separate host actions. | Manual packaged-app persistence/close/reopen smoke remains pending. |
| Tool composition boundary | Full-spec retrieval and active-document tools are available. The MCP server does not yet compose the core parser/resolver, language-service completion/diagnostics, or SVG renderer into a complete author/validate/render workflow. | `VAL-*`, `COMP-*`, `DIAG-*`, `RENDER-*`, and `WF-01` remain unresolved except where directly represented in the matrix. |
| Release/delivery | Flutter CI `41184291670` and release workflow `41184693233` passed; draft v1.0.1 has macOS universal, Linux x64, and Windows x64 bundles with checksums/provenance. | Draft is unpublished; no MCP-specific packaged runtime/client smoke or live Inspector proof is recorded. Root baseline manifest remains captured 2026-10-09. |

## 4. Historical contract defect closure evidence (2026-10-30)

The selected `ERR-01` repair is now present in the exported schemas and typed
dispatcher. The earlier observed mismatches were:

- `relgeo_get_examples` has the `anyOf` required-field rule but does not
  advertise the DTO’s `query`, `exampleId`, `specVersion`, or `maxResults`
  properties and bounds;
- `relgeo_complete_source` omits the DTO’s `specVersion` property; and
- `relgeo_render_source` omits the DTO’s `specVersion` property.

The schemas now advertise the DTO fields and bounds, all tool objects reject
unknown properties, and the dispatcher returns typed `-32602`/`-32601` errors
before invoking an owner. The focused regression tests and full MCP package
suite pass locally, so `ERR-01` is now `✔️`/`verified-local` at the contract
and adapter boundary. This remains separate from semantic domain mappings or
production socket/host delivery.

## 5. Current validation and delivery evidence

| Evidence | Result | What it proves / does not prove |
| --- | --- | --- |
| MCP package tests at `mcp@b4561c0` | **PASS — 32 Dart tests** | Schema, spec index/retrieval, router, resource, session/security, and edit contracts; does not prove a client session against a packaged app. |
| Flutter CI `41184291670` at `flutter@60ec760` | **PASS** | Format, analyzer, Flutter tests, and macOS/Linux/Windows build jobs for this revision. |
| Flutter IO integration tests | **PASS** | Loopback HTTP, initialization, tool/resource calls, read-only denial, write opt-in, stale guard, applied edit, dirty state, and undo. |
| Release workflow `41184693233` | **PASS; draft v1.0.1** | Three desktop archives and SHA-256 checksums verified; draft is not published and runtime usability is not established. |
| ChatGPT Desktop live mutation | **Not verified** | Read-only MCP/spec and document calls have prior user-observed success; the new edit-permission path still needs an explicit end-to-end smoke. |
| Root integration baseline | **Stale** | `docs/integration-baseline.json` still records 2026-10-09 child revisions and does not claim current full-workspace CI. |

## 6. Capability conclusions and handoff

1. Full-spec retrieval, active-document reads, the embedded desktop loopback
   server, and explicitly authorized bounded edits are now implemented and
   locally tested at their declared boundaries.
2. These changes do not provide semantic parse/resolve validation, completion,
   diagnostics explanation, SVG rendering, or the complete authoring workflow.
3. The current joined status is `32 ✔️`, `24 🌗`, `10 ❌`, `0 ⚠️`, and `2 ⏸️`.
   The expected catalog remains 68 rows; no expected capability was deleted.
4. `VAL-03`, `CXL-02`, and `DEL-03` retain `not-verified` evidence. Client-level
   write interoperability, packaged-app MCP smoke, and current root baseline
   synchronization remain open.
5. Follow-up implementation work is defined by the current
   [status matrix](./status-matrix.md), [reconciliation](./reconciliation.md),
   and [gap backlog](./implementation-gap-backlog.md). Expected capabilities
   remain unchanged in the catalog.
