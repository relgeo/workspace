# Language-Service Result and Provenance Protocol

**Status:** frozen vocabulary, protocol `0.2`  
**Compatibility line:** RelGeo DSL/spec `0.5`  
**Owner:** `relgeo/language-service` for the editor projection; `spec/id` and
`relgeo/core` remain the semantic authorities.

This document freezes the shared envelope used by language-service results and
the adapters that carry them through a worker or MCP boundary. It defines
identity and encoding; it does not claim that every producer or host already
implements every result family.

## Shared identity and encoding

Every result has these fields:

```ts
{
  protocolVersion: "0.2",
  resultKind: "diagnostics" | "validation" | "completion" | "hover"
    | "metadata" | "navigation" | "analysis" | "schema" | "tokens",
  specVersion: string,
  documentId: string,
  version: number,
  requestId: string,
  positionEncoding: "utf-16",
  sourceRevision?: string,
  provenance?: Provenance[]
}
```

- `documentId` is assigned by the host. Source text is payload, not document
  identity.
- `version` is the host's monotonic document/content version. It is distinct
  from `specVersion` and from the language-service protocol version.
- `requestId` is a caller-generated opaque string. It is used to reject an
  older response that completes after a newer request.
- `positionEncoding` is zero-based UTF-16 code units, matching the existing
  LSP-compatible `line`/`character` shapes. A `Range` is half-open: `start` is
  included and `end` is excluded.
- `sourceRevision` is an optional source/content digest or host revision. It
  is evidence about the analyzed source, not a replacement for `version`.

`Provenance` entries have `source`, `specVersion`, and optional `revision` and
`sourceUrl`. `spec` is normative; `core` is semantic computation;
`language-service` is an editor projection; `document`, `derived`, and `host`
describe non-normative inputs or ownership. Provenance is metadata only and
must not grant a result filesystem, network, UI, or mutation capabilities.

Diagnostics are not reduced to display-only fields at this boundary. Each
language-service diagnostic preserves the core `phase`, stable `code`,
`path`, optional `objectId`, `origin`, `expected`/`actual`, and
`dependencyChain`, together with a `provenance` entry identifying the core
projection. Dependency-chain entries are exposed as
`relatedInformation` anchors using the same bounded source range; consumers
may render them as explanation links but must not treat them as new semantic
results. Missing optional core fields remain absent rather than being guessed.

## Result families

The TypeScript public protocol exports a DTO for each expected family:

| `resultKind` | Required payload | Range/identity rule |
| --- | --- | --- |
| `diagnostics` | `diagnostics[]` | Diagnostic ranges use the shared UTF-16 encoding; phase/code/severity/path/provenance are preserved and dependency chains use `relatedInformation`. |
| `validation` | `readiness`, `recoveryState`, `diagnostics[]` | Readiness must not overclaim the evidence; recovery state describes the source sequence. |
| `completion` | cursor `position`, `items[]` | Completion text edits carry replacement ranges. |
| `hover` | query `position`, nullable `hover` | A non-null hover may carry a source range. |
| `metadata` | `entries[]` | Entries may carry a source range and `targetId`. |
| `navigation` | `locations[]` | Each location identifies a document and source range. |
| `analysis` | `readiness`, `recoveryState`, `diagnostics[]`, `semanticTokens[]` | Aggregate worker result with the same envelope. |
| `schema` | `schema` | Versioned schema snapshot with the same document/request identity. |
| `tokens` | `semanticTokens[]` | Token projection with the same UTF-16 and provenance envelope. |

Metadata and navigation DTOs are defined even where their producers are still
open backlog work; defining the shape does not promote an absent capability to
implemented.

## Validation readiness

The readiness enum is ordered by evidence, not by UI state:

| State | Meaning |
| --- | --- |
| `invalid` | A blocking parse or structural/typed diagnostic is present. |
| `partial` | Input is incomplete or insufficient to make a structural claim. |
| `structurally-valid` | Structural and typed validation passed; resolve has not been claimed. |
| `semantically-valid` | Core-backed semantic validation passed for the returned source revision. |
| `resolve-ready` | The result has passed the agreed resolve-ready core pipeline and may be used by a resolve consumer. |

The language-service structural boundary currently emits `partial`, `invalid`,
or `structurally-valid`. Only a core-backed integration may emit
`semantically-valid` or `resolve-ready`; an empty diagnostics array alone is
not proof of either state.

`recoveryState` is derived from the current result and an optional previous
same-document analysis state:

```text
invalid source  -> invalid
incomplete      -> partial
valid after invalid/partial -> recovered
valid without a recovery transition -> stable
```

The service remains stateless: the host supplies the previous state when it
wants the `recovered` transition labeled. A result with an invalid or partial
current readiness can never be labeled `recovered`.

## Document lifecycle and synchronization

The additive `LanguageServiceDocumentManager` export provides the stateful
document boundary around the stateless `RelGeoLanguageService`:

| Operation | Contract |
| --- | --- |
| `createDocument` / `openDocument` | Registers a non-empty `documentId`, non-negative integer version, source text, and optional provenance. Opening an already-open ID is rejected. |
| `changeDocument` | Requires exactly `currentVersion + 1`; accepts one full replacement or ordered UTF-16 ranged changes. Invalid positions, mixed full/ranged changes, and `rangeLength` mismatches are rejected before mutation. |
| `analyze` | Builds a request from the current snapshot, preserves identity/provenance, publishes diagnostics only for that version, and returns a monotonic response sequence. A retry with the same request ID is idempotent. |
| `closeDocument` | Requires the current version and removes the session. Unknown or stale sessions are rejected. |
| `complete`, `hover`, `metadata`, `navigation`, `semanticTokens`, `schema` | All editor result families use the same typed identity envelope; consumers do not need to reconstruct document/version/request metadata. |

The manager clears published diagnostics when a document changes, rejects a
stale publication, and exposes cooperative `CancellationToken` checks before
and after analysis. Cancellation is not a semantic error and never mutates
the document. The manager does not own Save, filesystem persistence, undo/redo,
or remote transport; those remain host boundaries.

## Stale-result rule

A host accepts a result only when all three identity fields match its current
request: `documentId`, `version`, and `requestId`. Any mismatch makes the
result disposition `stale` and the host must drop it without applying
diagnostics, edits, navigation, or preview state. The exported
`acceptCurrentDocumentAnalysis()` helper returns `null` for that stale path,
so callers cannot accidentally overwrite the active result. Completion of a
newer request does not require the host to cancel an older one; it only
requires the older result to be ignored. `sourceRevision` and provenance
explain the result and may be checked by a stricter adapter, but do not weaken
the three-field minimum guard.

The canonical implementation and JSON round-trip helpers are exported from
[`language-service/src/protocol.ts`](../../../language-service/src/protocol.ts).
The lifecycle implementation and synchronization fixture are in
[`language-service/src/document.ts`](../../../language-service/src/document.ts)
and [`language-service/test/document-lifecycle.v0.5.json`](../../../language-service/test/document-lifecycle.v0.5.json).
The service's `analyzeDocument()` result is the `analysis` family; the
document manager exposes typed identity envelopes for diagnostics, validation,
completion, hover, metadata, navigation, schema, and tokens without claiming
that every downstream host has already consumed every family.
