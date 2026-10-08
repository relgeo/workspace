# Session bridge and security contract

This document is the implementation evidence for the session/security slice
of [Plan 11](../plans/11-mcp-agent-integration.md). The pure-Dart contract is
in [`mcp/`](../../mcp/); the desktop adapter is
[`WorkbenchAgentBridge`](../../flutter/lib/src/mcp/workbench_agent_bridge.dart).
The adapter is a host boundary, not a widget and not an MCP transport.

## Ownership and repository boundary

| Concern | Owner | Boundary |
| --- | --- | --- |
| MCP protocol, typed session values, bounds, token policy | `relgeo_mcp` | `mcp/lib/`, pure Dart; no Flutter or filesystem dependency |
| Active source, dirty state, document identity, revision | RelGeo Desktop session | `flutter/lib/src/ui/workbench_document_session.dart` |
| One editor history entry | RelGeo Desktop editor controller | `flutter/lib/src/ui/workbench_editor_controller.dart` |
| Bridge composition | Flutter host adapter | `flutter/lib/src/mcp/workbench_agent_bridge.dart` |
| Save, Save As, export, file picker | Existing host/file-service lifecycle | outside MCP direct apply |
| JSON-RPC/SDK and transport choice | Future MCP adapter task | intentionally not selected by this spike |

The compatibility impact is additive: existing `WorkbenchFileService`, typed
Save acknowledgement, editor undo/redo, and `WorkbenchDocumentSession` APIs
remain available. The new MCP package is a path dependency for the Flutter
application and can later be moved to its own repository without importing
Flutter internals into the package.

The same pure-Dart package includes typed `DocumentationResult` and
`DocumentationProvenance` values with `source`, `sourceUrl`, `specVersion`, and
`revision`. Only `spec` provenance is normative (`website` is explanatory and
cannot override it); the future resource resolver must preserve that rule.

## Snapshot and revision invariants

`ActiveDocumentSnapshot` contains `documentId`, `name`, optional `path`, source,
monotonic `revision`, dirty state, and structured diagnostics. A source change
increments the revision. Opening/creating another document changes identity and
resets its revision to zero; Save changes the saved baseline but does not change
the source revision.

`DocumentEditProposal` contains only bounded source ranges and replacement text:

- at most 64 non-overlapping edits;
- each replacement is at most 16 KiB, with a 64 KiB total replacement bound;
- active source is capped at 1 MiB for this direct-apply contract;
- the proposal must include a summary and may include a bounded rationale.

The proposal is evaluated against the current snapshot before any editor write.
If `baseDocumentId` or `baseRevision` differs, the bridge returns `stale` and
does not apply the proposal. Other bound or range failures return `rejected`.
There is no merge, fuzzy matching, whole-file overwrite, or fallback to another
open document.

## One undoable transaction

After the guard passes, the Flutter adapter computes the next source and calls
the editor controller's agent-specific setter exactly once. It does not call
Save, Save As, export, a file picker, or any filesystem API. The existing editor
history therefore records the agent proposal as one undoable source replacement;
the normal editor listener updates the session and dirty state.

The session-side `applySourceIfCurrent` check is retained as a headless-host
fallback and a second invariant. A divergence between editor and session is a
`failed` result, not a successful write.

## Token lifecycle and scopes

`McpSessionTokenStore` is in-memory and belongs to one local server instance.
The host issues a random opaque token with either `readOnly` or `readWrite`
permission, validates it on every call, expires it by TTL, and revokes it when
the server stops. Tokens are not persisted in documents, preferences, logs, or
the repository. A read-only token cannot authorize `applyDocumentEdit`.

`McpSecurityPolicy` defaults to:

- server disabled until explicitly enabled by the desktop host;
- bind address `127.0.0.1` only;
- remote clients rejected/out of scope;
- arbitrary filesystem writes disabled;
- autosave disabled.

The transport adapter must enforce the token and permission before invoking the
bridge. The bridge itself only sees active-document operations, so even a future
transport cannot turn this contract into an arbitrary file writer.

## Save and autosave separation

Direct apply mutates the active in-memory session and marks it dirty. It does
not persist source. `Save` and `Save As` stay explicit document lifecycle
actions owned by the existing file service/host callbacks. Layout/preference
autosave is unrelated UI persistence and must not be reused for MCP source
changes. Remote MCP, arbitrary filesystem access, export, and background source
autosave remain out of scope.

## Verification

The pure contract tests cover multi-edit application, overlap/range bounds,
stale revisions, token scope/expiry/revocation, and localhost policy. The
Flutter test covers the active-document adapter, one native undo entry, dirty
state, document identity/revision reset, and stale replay rejection:

- `mcp/test/session_bridge_test.dart`
- `flutter/test/workbench_agent_bridge_test.dart`

The SDK/transport candidate decision and protocol fixture conformance remain a
separate follow-up; this contract intentionally does not lock `dart_mcp` or
`mcp_dart`.
