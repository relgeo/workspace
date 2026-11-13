# MCP contract compatibility boundary

This document freezes the wire-level boundary between the standalone MCP
package and the RelGeo producers. The Dart contract is the adapter source of
truth for MCP serialization; `core/src/parser.ts` remains the source of truth
for DSL version meaning, and `language-service/src/protocol.ts` remains the
source of truth for editor protocol fields.

The immutable wire-contract revision is
`mcp-contract-2026-11-12-r1`. It is exported by the MCP package and is carried
in host status responses; the MCP and Flutter consumers must use this same
revision rather than inferring compatibility from a workspace commit alone.

## Version policy

The active compatibility line is DSL `0.5`, Language Service protocol `0.2`,
and UTF-16 positions. MCP tool requests default to DSL `0.5` and reject an
explicit version that is not the pinned MCP snapshot. The error is a JSON-RPC
invalid-parameter error with category `unsupported-spec-version`, data
`diagnosticCode: UNSUPPORTED_SPEC_VERSION`, and both requested and available
versions.

Core still classifies `0.4` as supported legacy and `0.1`–`0.3` as regression
only. That compatibility fact is exposed by the MCP contract for consumers,
but it does not imply that MCP has a legacy retrieval corpus. A legacy request
cannot silently fall back to the active `0.5` corpus.

The boundary is implemented in:

- `mcp/lib/src/contract/mcp_schema.dart` — shared constants, version
  classification, and error/provenance wire values;
- `mcp/lib/src/adapter/local_dispatch.dart` — request version, identity,
  protocol, and position-encoding guards;
- `core/src/parser.ts` — DSL version classification;
- `language-service/src/protocol.ts` — editor protocol and provenance result
  types;
- `docs/compatibility-matrix.json` — cross-package policy.

## Provenance vocabulary

MCP emits the canonical producer vocabulary used by Language Service:
`spec`, `website`, `example`, `language-service`, `core`, `renderer`, and
`document`. The Dart enum names `languageService` and `activeDocument` are
source-language names only; they are never emitted as camelCase wire values.
Only `spec` provenance is normative. Examples and websites remain explanatory.

## Error taxonomy

Dispatch errors may include a top-level `category` while retaining the
backward-compatible `data` object. Stable categories include
`invalid-request`, `unsupported-protocol-version`, `unsupported-spec-version`,
`not-initialized`, `unavailable`, `not-found`, `owner-contract`,
`owner-failure`, `owner-bounds`, `cancelled`, `stale`, and `internal`.
Unsupported-version errors additionally carry the stable diagnostic code
`UNSUPPORTED_SPEC_VERSION`; clients must branch on that code/category rather
than parsing human-readable messages.

## Additive DTO compatibility guards

`RenderSourceInput.sheetId` is preserved in `RenderResult.sheetId`. A legacy
owner result that omits the field is completed by the adapter with the
requested target; an owner result that names a different target is rejected as
`owner-contract`. This protects host identity without claiming that the pure
MCP package selects sheets or renders semantic content.

`SourceProposal.validateForRequest` validates a non-empty proposal and rejects
mixed-version provenance chains. Callers that require normative grounding can
also require a `spec` provenance entry. The proposal remains a draft DTO and
is not an implicit document mutation.

The same additive boundary exposes typed validation targets (`structural`,
`semantic`, and `resolve-ready`), a shared authoring context for document/
language-service/core/renderer adapters, lossless domain-error fields, and
transport-neutral loopback/stdio profiles. Host status serialization reports
client count and endpoint state while emitting only a redacted token marker.
These are adapter contracts; they do not fabricate semantic producer results
or prove packaged-client runtime behavior.

## Validation boundary

`mcp/test/mcp_schema_test.dart` covers constants, version classification, wire
provenance, and proposal provenance validation. `mcp/test/local_dispatch_test.dart`
covers unsupported-version errors, render-target echo, and render-target
mismatch rejection. The shared fixture
`fixtures/mcp/contract-boundary-cases.json` mirrors those cases. The workspace compatibility check also
compares the MCP constants and canonical provenance vocabulary with Core,
Language Service, and `docs/compatibility-matrix.json`.
`fixtures/mcp/cross-surface-contract-cases.json` covers validation target,
shared context, domain errors, transport policy, and host status redaction.

This contract check does not claim that MCP directly owns semantic parsing,
completion, rendering, or producer-domain error mapping. Those remain typed
owner boundaries and are tracked separately in the capability matrix.
