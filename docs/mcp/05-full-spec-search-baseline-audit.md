# MCP Full-Spec Search — Historical Baseline Audit

**Audit date:** 2026-10-30
**Scope:** current implementation against [Plan 11](../plans/11-mcp-agent-integration.md) and [Plan 14](../plans/14-mcp-full-spec-search.md)
**Historical conclusion:** at the pre-implementation checkpoint recorded here,
full-spec retrieval was **not implemented**. The desktop path was a real,
read-only, loopback HTTP preview whose syntax surface was still a hardcoded
`rect` rule and two hardcoded examples.

> **Superseded for the current checkout.** This document is retained as the
> baseline that motivated Plan 14 implementation. Do not use its “absent” or
> “not implemented” rows as current runtime evidence. Current evidence is in
> [Plan 14](../plans/14-mcp-full-spec-search.md), the
> [SDK/conformance runbook](./03-sdk-conformance-runbook.md), and the
> [current capability-map handoff](../capability-map/mcp/implementation-audit.md).

This is an evidence baseline, not an implementation change. Repository files,
tests, CI definitions, and prior audit prose were inspected as evidence only.
No MCP source, Flutter source, test, or contract was changed for this audit.

## 1. Baseline identity

| Boundary | Actual checkout | Working-tree observation |
| --- | --- | --- |
| workspace | `4b8ab50858b7cc584ab43558c0b356bd548e6e87` | clean at audit start |
| `mcp` submodule | `fb8b0d7ad994fe376d4c3756a1ed51eb6d4e0d2e` | `main`, clean; `feat: add desktop MCP preview and local syntax tools` is the current submodule commit |
| `flutter` submodule | `e80efc69659bdde84082778ea73bdad998c5a86a` | inspected through workspace path dependency |
| `spec` submodule | `b96ba3b23de202227eade06614635ef6717df516` | source corpus used for the inventory |
| spec corpus | 34 Markdown files; 26 `Normative`, 8 `Informative`/index | no desktop snapshot or generated index found |

The root history contains pre-existing MCP work (`session bridge`, protocol
fixture, package extraction, schema/dispatcher, and desktop preview). These
changes are present in the checkout, but their authorship/provenance is not
attributable to this audit task. The current submodule has no uncommitted
changes, so there is no additional local MCP work to attribute as “outside
SuClos” beyond the committed checkout state.

## 2. Status vocabulary

- **Present:** directly implemented at the inspected boundary.
- **Partial:** a related contract, host path, or preview exists, but it does not satisfy the full Plan 14 outcome.
- **Stale:** an existing document describes an older checkout or an older evidence state; it must not be used as current runtime proof.
- **Not verified:** no direct runtime evidence was available; this is not a target failure claim.
- **Absent:** no implementation or configuration was found at the named owner boundary.

## 3. Plan 14 coverage baseline

| Plan 14 capability | Current evidence | Status | Baseline finding |
| --- | --- | --- | --- |
| Full `spec/id/**/*.md` corpus | `spec/id/` inventory: 34 files, including core, syntax, geometry, presentation, appendix, README/index, and editorial guide | **Present as source only** | The normative source exists; no MCP-consumable snapshot is bundled. |
| Version/revision/digest snapshot metadata | `McpProvenance` carries `source`, `sourceUrl`, `specVersion`, `revision` in `mcp_schema.dart` | **Partial** | Generic DTO provenance exists, but no corpus digest, file path, heading, anchor, or snapshot manifest is produced. |
| Offline Flutter asset bridge | `flutter/pubspec.yaml` has the `../mcp` package dependency but no `assets` declaration; no `flutter/assets/relgeo_spec` files or sync/check command were found | **Absent** | Desktop cannot currently load a bundled full-spec corpus from the inspected configuration. |
| Section splitting/indexing | No section/index type or Markdown parser is present in `mcp/lib`, `flutter/lib/src/mcp`, or the MCP tests | **Absent** | No heading ancestry, anchor, section ID, or deterministic section index exists. |
| `relgeo_search_spec` | `mcp_schema.dart` declares seven MVP tools; `local_dispatch.dart` dispatches `relgeo_find_syntax` and the other seven only | **Absent** | The Plan 14 search tool is not declared, advertised, or routed. |
| `relgeo_get_spec_section` | Resource URI parser supports `relgeo://spec/rules/{ruleId}`, but the resource store only reads caller-supplied static resources | **Partial** | A URI shape exists for one rule-like resource, but no full section retrieval from Markdown exists. |
| Full lexical ranking | Desktop fallback uses a fixed list of ten `rect` terms and returns one constant match | **Absent** | No file/title/heading/body scoring, phrase weighting, stable corpus tie-break, or relevant excerpt exists. |
| Normativity/provenance preservation | `McpProvenance.isNormative` is true only for `spec`; hardcoded rect output includes spec/example provenance | **Partial** | Provenance labeling is modeled, but it does not describe retrieved Markdown sections or a bundled snapshot revision. |
| Desktop server/host lifecycle | `mcp_server_io.dart` starts a loopback HTTP server, issues an in-memory read-only token, and `cad_workbench.dart` exposes enable/disable/copy-config UI | **Present for preview host** | Host lifecycle is real and bounded, but its router is created without a dispatcher or static resources, so it cannot expose full spec retrieval. |
| Offline/no repository-path dependency at runtime | No asset loader or spec path bridge found; current hardcoded preview has no network or repository read | **Not verified for target** | The preview is local, but the required bundled-corpus behavior is not implemented and therefore cannot be proven offline. |
| Agent routing/capability report | Initialize instructions and capabilities explicitly say desktop preview indexes the normative `rect` rule only; local testing docs repeat that limitation | **Partial** | Normative-first guidance exists for the preview, not for full-corpus search and section retrieval. |
| Plan 14 scenario/conformance coverage | Existing tests cover DTO/router/resource plumbing with fake handlers and a fake static resource; no full-corpus query set or retrieval assertions exist | **Absent** | The five acceptance scenario families are not executable evidence yet. |

## 4. Evidence by required implementation surface

### Pure-Dart MCP package

`mcp/lib/src/contract/mcp_schema.dart` has the typed provenance model,
seven read-only MVP tool contracts, and canonical resource URI forms. It does
not have Plan 14 tool DTOs or a snapshot/section DTO. The resource URI parser
is path-safe and does not resolve arbitrary filesystem paths.

`mcp/lib/src/adapter/local_dispatch.dart` has two distinct paths:

1. `RelGeoMcpToolDispatcher` validates and dispatches injected owner callbacks.
   This is reusable contract plumbing, not a spec implementation.
2. When the desktop router has no injected dispatcher, the fallback contains
   `_rectSyntaxMatch`, `_rectSyntaxDocumentation`, and two hardcoded examples.
   `_findDesktopSyntax` matches only the fixed `rectTerms` list, and
   `_getDesktopSyntaxRule` accepts only `geometry.rect`.

`RelGeoMcpResourceStore` can read static resources supplied by a host, but the
desktop host supplies none. Therefore its generic static-resource capability
must not be counted as a bundled spec snapshot.

### Flutter host and asset configuration

`flutter/lib/src/mcp/mcp_server_io.dart` owns the local HTTP listener, loopback
and Origin checks, bearer authorization, protocol-version check, and JSON-RPC
router. It constructs `RelGeoMcpResourceStore(activeBridge: bridge)` and a
router without `RelGeoMcpToolDispatcher`; this is why the desktop path selects
the hardcoded preview branch.

`flutter/lib/src/ui/cad_workbench.dart` owns the `Workbench → MCP Server…`
dialog, temporary endpoint/token display, enable/disable lifecycle, and stop
on workbench disposal. `WorkbenchAgentBridge` supplies active document and
diagnostics/session behavior. None of these files loads `spec/id` assets.

`flutter/docs/mcp-local-testing.md` is consistent with the code at this
baseline: it documents active-document/diagnostics reads and explicitly says
desktop normative search covers `rect` only. The document is evidence of the
current limitation, not evidence of Plan 14 completion.

### Spec corpus

The 34-file inventory is complete for `spec/id/**/*.md` at the inspected
submodule revision. The 26 normative files are the numbered core (01–06),
syntax (07–12), geometry (13–21), and presentation (22–26) chapters. The
remaining 8 files are indexes, the editorial guide, and the informative
summary. This corpus is broad enough to cover the Plan 14 examples—parameters,
constants, path placement, dimensions, annotations, roles, views, and sheets—
but no MCP index currently consumes it.

### Tests, workflow, and CI

`mcp/test/` contains four Dart test files. The local dispatch tests verify
typed validation, JSON-RPC lifecycle, fake static resource reads, and the
session boundary. They do not read `spec/id`, exercise Markdown section
splitting, or assert query ranking. `flutter/test/workbench_agent_bridge_test.dart`
covers the active-document bridge and undo/revision behavior, not spec assets
or desktop retrieval.

`mcp/.github/workflows/mcp-ci.yml` runs format, analyze, unit tests, and the
dependency-free transport conformance harness. It does not define a Plan 14
corpus sync/check, retrieval query matrix, or asset drift check.

## 5. Acceptance-scenario baseline

| Plan 14 scenario | Observed current behavior | Status |
| --- | --- | --- |
| “Bagaimana cara menggambar kotak?” | Fixed `rect` terms can return the hardcoded `geometry.rect` match; examples are fixed square/rectangle snippets | **Partial** |
| “Apa beda `parameters` dan `constants`?” | No corpus search or section retrieval; no matching tool path | **Absent** |
| “Bagaimana menempatkan titik di path?” | No corpus search or section retrieval | **Absent** |
| Presentation chapter question | No corpus search; dimensions/annotations/roles/views/sheets are not exposed by the desktop preview | **Absent** |
| Query not covered by preview | A non-rect query returns an empty fixed list, but there is no full-corpus relevance boundary or nearest-section explanation | **Partial, not full-spec evidence** |
| Offline bundled snapshot | No Flutter asset/snapshot configuration found | **Not verified / effectively absent** |
| Example vs rule separation | Hardcoded examples use `example` provenance and the rect rule uses `spec` provenance | **Present for preview only** |

## 6. Stale or superseded evidence

`docs/capability-map/mcp/implementation-audit.md` and
`docs/capability-map/mcp/coverage-validation-handoff.md` contain a broader
68-row audit, but their recorded revisions (`workspace 1cfa865`, MCP
`e225919`, and an uncommitted working-tree claim) do not match this checkout.
They also say the Flutter server lifecycle/UI was not found, while the current
checkout has that lifecycle in `cad_workbench.dart` and `mcp_server_io.dart`.
Those documents are therefore **stale for current host evidence**. Their
catalog/reconciliation counts remain useful as historical planning context,
but their snapshot, host-absence, and working-tree claims are not current
proof. This document is the current Plan 14-focused baseline.

Plan 11’s headline status and `flutter/docs/mcp-local-testing.md` remain
consistent on the key point: contract/router and desktop preview exist, while
full-spec retrieval and bundled versioned snapshots do not.

## 7. Validation record and environment limits

| Check | Result | Interpretation |
| --- | --- | --- |
| Read-only source/config inspection | **PASS** | Required Plan 11/14, MCP, Flutter, spec, docs, capability-map, workflow, and history surfaces were inspected. |
| Flutter bridge test | **PASS — 3 tests** | Active-document bridge behavior passes; this does not prove MCP retrieval. |
| MCP analyze/test/conformance through `dart` wrapper | **Environment unavailable** | Wrapper attempted to update read-only `flutter/bin/cache/engine.stamp`. |
| MCP analyze through direct Dart SDK binary | **Blocked by dependency state** | Analyzer could not resolve `package:test/test.dart`; no `pub get` or dependency mutation was performed in this audit. |
| Live HTTP/Inspector retrieval | **Not verified** | No full-spec server path exists to exercise; existing transport evidence is bounded to the current preview/fixture work. |

No test failure above is interpreted as evidence that a target full-spec
implementation failed; the target implementation is not present, and the
missing dependency/runtime checks are recorded as environment or scope limits.

## 8. Handoff boundary

This baseline establishes the next implementation prerequisites without
changing them:

1. define Plan 14 search/section DTOs while keeping `mcp` pure Dart;
2. add a typed snapshot/document provider boundary rather than reading a host
   repository path from the MCP package;
3. add Flutter asset sync/check and bundle all 34 Markdown files with a
   version/revision/digest manifest;
4. replace the desktop `rect` fallback with corpus-backed deterministic
   indexing/search and complete-section retrieval;
5. add query scenarios, provenance/normativity assertions, offline checks, and
   drift/conformance evidence.

The catalog JSON work in Plan 13, npm/pub.dev release, remote MCP, production
deployment, and image creation/editing remain out of this audit’s scope and
are not prerequisites for the Plan 14 baseline.

## 9. Reproduction commands

Run from the workspace root. These commands are read-only. The counts reproduce
the historical source inventory; current implementation checks confirm the
historical baseline is superseded and full-spec retrieval is present:

The same checks are packaged as [`validate-full-spec-baseline.sh`](./validate-full-spec-baseline.sh).
It is an audit guard, not a product/runtime gate.

```sh
rg --files spec/id -g '*.md' | sort | wc -l
rg -l 'Status dokumen: `Normative`' spec/id -g '*.md' | wc -l
rg -n 'relgeo_search_spec|relgeo_get_spec_section|relgeo_spec|assets:' \
  mcp flutter docs/plans/14-mcp-full-spec-search.md
rg -n '_rectSyntaxMatch|_rectSyntaxDocumentation|rectTerms|RelGeoMcpResourceStore' \
  mcp/lib/src/adapter/local_dispatch.dart flutter/lib/src/mcp
git status --short
git -C mcp status --short --branch
```

The expected historical inventory is `34` Markdown files and `26` normative
files. The historical absence claims above describe the audit checkpoint and
cannot be reproduced from the current checkout; the validator therefore checks
that this report remains marked superseded and that the replacement tools,
resource-template route, and bundled asset manifest exist.
