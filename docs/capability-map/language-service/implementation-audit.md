# Language Service implementation audit

This is the canonical audit entry point for the Language Service surface.

The dated evidence log retained from the previous flat layout is
[archive/implementation-audit-legacy.md](./archive/implementation-audit-legacy.md).
The current audit entry is maintained in this file.
The current expected-versus-observed result is maintained in
[reconciliation.md](./reconciliation.md), while the maintainer-facing status
view is [status-matrix.md](./status-matrix.md). The archived log is historical
evidence and must not be read as proof of current CI, registry, deployment, or
runtime status.

The bounded active selection for the current capability-debt tranche is
[in-scope-selection.md](./in-scope-selection.md). That record is a scope
decision only; it does not replace the audit evidence or promote any status.

## Current audit refresh — 2026-11-03

This refresh rechecked the selected language-service boundary and the local
consumers that directly import it. It records implementation evidence for the
reconciliation below; local tests do not establish registry, current CI,
browser/public, or native-host delivery evidence.

| Boundary | Fresh evidence | Result | Limit that remains visible |
| --- | --- | --- | --- |
| `language-service/` | `npm test && npm run lint && npm run build` in `language-service/` | PASS — 2 files, 82 tests; type-check and ESM/CJS/DTS build pass | No packed/registry/public artifact proof. |
| `remark-relgeo-hl/` | `npm test` in `remark-relgeo-hl/` | PASS — 1 file, 3 tests | Normal tokenization path is covered; injected service-failure fallback is not proven. |
| `playground/` | `npm test && npm run lint && npm run build` in `playground/` | PASS — 17 files, 102 tests; lint and production bundle build pass | Browser E2E, deployed/public bundle, and current CI are not verified here. |
| Workspace conformance | `node scripts/run-conformance-fixtures.mjs` from the workspace root | PASS — 260 checks across 20 fixtures | This is local fixture evidence; release publication, current CI, and external-host execution remain unverified. |
| Source consumer wiring | `playground/src/components/Editor.tsx`, `playground/src/worker.ts`, `playground/src/App.tsx`, `mcp/lib/src/contract/mcp_schema.dart`, `mcp/lib/src/adapter/local_dispatch.dart` | Playground editor helpers send document/version/request identity to typed diagnostics/completion/hover adapters; MCP completion/validation echo identity; 34 MCP tests pass | Playground request ordering and core-backed semantic producer wiring remain host/adapter work; browser/public execution is not verified. |

### Selected capability findings

| ID | Status | Observed evidence | Audit conclusion |
| --- | --- | --- | --- |
| `LS-CONS-005` | `✔️` local boundary / public delivery not verified | README now says `0.5.1`, `RelGeoLanguageService.getSchema()` returns the exported schema, and the focused API/version test passes. | The source/API mismatch is repaired and locally verified; registry/public artifact verification remains outside this task. |
| `LS-DIAG-002` | `🌗` | `src/service.ts#getDiagnostics` now projects core `collectDiagnostics` output and preserves bounded independent validation errors; 75 service tests pass. | Tolerant aggregation is implemented for the bounded path, but broad incomplete-source recovery remains partial. |
| `LS-SCHEMA-002` | `🌗` | `getSchemaDriftReport()` compares active root sections, object types, object fields, parameters, views, sheets, and presentation catalogs; clean baseline and mutation tests pass. | The baseline is code-owned and deterministic; a generated comparison against every active spec rule is still future evidence. |
| `LS-COMP-002` | `🌗` | `getCompletions()` now returns bounded object-reference items for expression and object contexts, with type detail and exact replacement edits. | Full AST/semantic-index context remains outside this bounded implementation. |
| `LS-COMP-003` | `🌗` | Partial completion tests cover blank lines, quoted IDs, incomplete expressions, and a `typ:` key typo recovery path. | The recovery contract is bounded; all parser-error shapes are not claimed. |
| `LS-RANGE-001` | `🌗` | Diagnostics use core source ranges; tokens retain offsets; completion items carry replacement ranges; hover results carry word ranges. | Metadata/semantic-inspection range coverage remains outside this selected implementation. |
| `LS-RANGE-002` | `🌗` | `analyzeNavigation()` returns a definition and bounded references for one object relation with stable document ID and exact UTF-16 ranges; protocol test passes. | Broader semantic relations and the Playground source-jump action remain open. |
| `LS-INCR-001` | `🌗` | `analysis.ts` reports changed range, changed-line budget, inspected line/code-unit counts, and an explicit full-document semantic fallback; protocol test passes. | Core dependency semantics are not incremental, so this is measured bounded planning rather than incremental parsing. |
| `LS-INCR-002` | `🌗` | `analyzeDocument()` returns serializable protocol/document/version/request identity, and helper tests reject mismatched responses. | Playground still owns worker ordering; a full host adapter migration is not claimed. |
| `LS-VERS-002` | `🌗` | `src/protocol.ts` freezes protocol `0.2`, spec `0.5`, optional source revision/provenance, and JSON serialization; family DTO tests cover diagnostics, validation, completion, hover, metadata, navigation, and analysis. | All producers and downstream worker/MCP adapters still need propagation evidence. |
| `LS-PROTO-002` | `🌗` | MCP typed DTOs accept optional editor identity and validation readiness/recovery fields, echo identity at dispatch, and preserve legacy JSON; the 34-test Dart suite passes. | Packaged/cross-host transport and core-backed language-service producer wiring remain open. |

### Other status boundaries confirmed

- `LS-TOKEN-001` remains `✔️`: the token service is consumed by
  `remark-relgeo-hl`, and the focused Markdown test passes.
- `LS-CONS-001` remains `🌗`: Playground source wiring and unit tests are
  present; browser/public execution remains unverified.
- `LS-CONS-002` remains `🌗`: normal Markdown highlighting passes, but the
  source-preserving fallback on language-service failure is not implemented.
- `LS-RANGE-002` and `LS-INCR-001` are now explicit `🌗` bounded rows: a
  minimal navigation relation and measured full-document analysis fallback are
  implemented, while broader host/core contracts remain open. `LS-VERS-002` is
  `🌗` at the protocol boundary because the
  vocabulary and serialization evidence are implemented. Unavailable
  browser/registry/CI evidence does not downgrade implementation absence to
  `?`.
- **Current integration update — 2026-10-31:** `LS-CONS-003` and
  `LS-CONS-004` are `🌗`, not deferred: MCP spec lookup/resources and the
  Flutter-hosted active-document read/guarded edit are implemented. This
  language-service audit does not establish semantic validation/completion
  integration or ChatGPT Desktop write interoperability.
- `LS-DOC-003` and `LS-REC-002` remain `➖` because the catalog assigns them to
  host/consumer ownership, not to the language-service implementation.

The test commands above emitted only the environment's locale warning. They
completed successfully. This refresh is local evidence; it does not claim
Node 24, registry, current CI, browser/public, or native-host verification.

Implementation note: these local changes are evidence for the dependent
reconciliation task. This audit does not silently rewrite the matrix or remove
candidate rows from the backlog.

## Reproducible evidence and handoff — 2026-11-03

The following commands reproduce the recorded local evidence from the stated
working directory boundaries:

```text
(cd language-service && npm test && npm run lint && npm run build)
(cd remark-relgeo-hl && npm test)
(cd playground && npm test && npm run lint && npm run build)
node scripts/run-conformance-fixtures.mjs
node scripts/check-language-service-schema-drift.mjs
(/Users/agusmade/development/flutter/bin/cache/dart-sdk/bin/dart .dart_tool/pub/bin/test/test.dart-3.11.5.snapshot)
git diff --check
git -C language-service diff --check
```

Observed results are language-service `82/82` tests plus type-check and
ESM/CJS/DTS build, Markdown highlighter `3/3` tests, Playground `102/102`
tests plus lint/build, MCP `34/34` tests, and a zero-difference active-spec
drift report. The commands use
the local workspace and do not require npm publication, a registry install,
production deployment, a pub.dev artifact, or a deferred MCP/Flutter host.

### Changed repository boundary

The evidence was collected against these revisions and working-tree states:

| Boundary | Revision | Working-tree boundary |
| --- | --- | --- |
| Workspace root | `1cfa86553d7adb18179c6b3e1a33618a179b1414` | Current language-service docs and the language-service/Playground gitlinks are uncommitted working-tree changes. |
| `language-service/` | `39c06dd8505d480672b0953d523f3675a7f30075` | README, service/completion/index/tests, and new protocol/schema-drift sources are modified or untracked. |
| `playground/` | `59a42ae925cf0c21541bc19ccac39f5061b35439` | A working-tree test change is present; this audit does not attribute or overwrite it. |
| `remark-relgeo-hl/` | `507ad18fe1b8c91eb3a48e365b5290cd02b049b8` | Clean at evidence capture. |

These revisions are checkout anchors, not release or commit claims. The
working-tree changes must be reviewed and committed by the repository owner
before any release-boundary conclusion is drawn.

### Remaining-gap handoff

The backlog and reconciliation retain the remaining `🌗`, `❌`, `➖`, and
`⏸️` rows. In particular, broader semantic navigation (`LS-RANGE-002`), the
measured full-document fallback in incremental analysis (`LS-INCR-001`), result provenance (`LS-VERS-002`), broader incomplete
source/recovery coverage, full active-spec drift generation, metadata ranges,
Markdown failure fallback, and the held MCP/desktop adapters remain open or
deferred. Registry/public artifact, current CI, browser/public, Node 24, and
native-host evidence remain not verified; these limitations do not change an
implementation status and are not prerequisites for this goal.
