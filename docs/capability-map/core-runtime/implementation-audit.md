# Core Runtime implementation audit

> **Current package/evaluator checkpoint — 2026-10-31:** Current root gitlink is core `690278e02746c6c3470166cf233e1ec8b4a9eb11`, with the evaluator division-by-zero syntax-only fix in `31347e4`. That fix returns a non-zero placeholder when evaluation is only serving syntax validation; it avoids reporting division-by-zero for an expression that has not actually been evaluated and has a focused regression case. The operator reports that `@relgeo/core@0.5.2` was successfully published to npm. This Codex shell cannot find Node/pnpm, so I have not independently run the current core suite or a fresh registry install. The Node 22 results below are dated historical evidence, not current-pointer verification.

**Audit checkpoint:** 2026-10-31
**Status:** current local implementation/evidence audit; not a release, registry,
CI, browser, or Flutter-host claim
**Owner package:** `relgeo/core`
**Evidence orchestration:** `relgeo/workspace`
**Compatibility line:** RelGeo DSL `0.5`

This is the current audit entry point for the Core Runtime surface. The dated
source/evidence log retained from the previous flat layout is the
[archived audit log](./archive/implementation-audit-legacy.md); its detailed
section traces remain useful historical evidence but are not treated as proof
of the current checkout. The [reconciliation](./reconciliation.md) and
[status matrix](./status-matrix.md) retain the one-to-one 38-ID result.

## Audited boundary and method

The audit inspected the expected catalog, bounded backlog selection, current
`core/` source and tests, shared fixture manifest/runner, compatibility matrix,
and available consumer projections. The execution path was parse → validate →
dependency graph/evaluate → resolve → post-resolve diagnostics → semantic scene
output. Consumer behavior is counted only at the named boundary; missing
external evidence is recorded as unverified rather than inferred absent.

The Core submodule was not clean during this checkpoint. Its local working tree
contained the selected contract changes in `src/parser.ts`,
`src/resolver/index.ts`, `src/resolver/types.ts`, `src/validator.ts`,
`src/types.ts`, `src/errors.ts`, `src/diagnostics.ts`, and
`src/projection.ts`, plus focused tests, at submodule HEAD
`070defe7fb79146f9b56289faefd9fa52b886260`. Results below therefore describe
the inspected working tree, not a committed or published artifact.

## Current local evidence

| Command / source | Result | Evidence boundary and limitation |
| --- | --- | --- |
| `pnpm run lint` in `core/` | **PASS — TypeScript `tsc --noEmit`** | Current working-tree source and declarations type-check locally. |
| `pnpm test` in `core/` | **PASS — 47 test files, 436 tests** | Parser, validator, evaluator, graph, resolver, units, constraints, structured-error, diagnostic-aggregation, and projection tests execute locally. |
| `pnpm run build` in `core/` | **PASS — CJS, ESM, and declaration output** | Rebuilt the local Core `dist/` used by the subsequent conformance run; this is not package publication evidence. |
| `pnpm test` in `language-service/` | **PASS — 1 test file, 66 tests** | Direct diagnostic/editor consumer tests pass against the local Core workspace dependency. |
| `pnpm test` and `pnpm run test:dist` in `renderer-svg/` | **PASS — 82 tests plus 1 distribution-boundary test** | Renderer semantic projection and built-package boundary remain compatible locally. |
| `pnpm test` in `cli/` | **PASS — 1 test file, 9 tests** | CLI parse/resolve/error projection remains compatible with the rebuilt Core output. |
| Consumer `lint`/`build` in `language-service/`, `renderer-svg/`, and `cli/` | **PASS — TypeScript checks and local package builds** | Local consumer artifacts compile; this is not registry-install or production-host evidence. |
| `node scripts/run-conformance-fixtures.mjs` | **PASS — 260/260 across 20 fixtures** | Active, legacy, invalid, runtime-diagnostic, runtime-error, renderer, language-service, highlighting, preview, Markdown, and CLI projections pass from local built artifacts. |
| `pnpm run compatibility:check` | **PASS — 283/283** | Compatibility line, package metadata, dependency ranges, fixture policy, and consumer declarations pass locally. |
| Expected catalog → reconciliation → matrix | **PASS — 38/38, no missing/duplicate/extra IDs** | Status view is 23 `✔️`, 14 `🌗`, 0 `❌`, and 1 `⚠️`; scope/evidence findings remain separate. |

All commands ran with Node `22.23.2` while the workspace requests Node
`>=24`; the package-manager engine warning did not fail the local commands.
Node `>=24`, current remote CI, registry/public package installation, browser
E2E, and Flutter host execution remain `? unverified`. No npm/pub.dev publish,
production deployment, or deferred external platform was required for this
checkpoint.

## Reproducible evidence and handoff boundary

The evidence above is reproducible from the current checkout with these
independent commands:

| Boundary | Command | Recorded result |
| --- | --- | --- |
| Core source | `cd core && pnpm run lint` | TypeScript check passed. |
| Core source | `cd core && pnpm test` | 47 test files and 436 tests passed. |
| Core package | `cd core && pnpm run build` | CJS, ESM, and declaration builds passed. |
| Direct consumers | `pnpm test`, `pnpm run lint`, and `pnpm run build` in `language-service/`, `renderer-svg/`, and `cli/` | Language service 66 tests; renderer 82 tests plus 1 distribution-boundary test; CLI 9 tests; consumer checks/builds passed. |
| Shared integration | `node scripts/run-conformance-fixtures.mjs` | 260/260 checks passed across 20 fixtures. |
| Compatibility | `pnpm run compatibility:check` | 283/283 checks passed. |

Revision and working-tree boundary:

- Workspace root `HEAD`: `1cfa86553d7adb18179c6b3e1a33618a179b1414`.
- Core submodule `HEAD`: `070defe7fb79146f9b56289faefd9fa52b886260`.
- No root or Core commit was created for this task; the evidence describes
  working-tree changes, not a published or committed artifact.
- In-scope root documentation changes are under
  `docs/capability-map/core-runtime/`, including the expected catalog, audit,
  reconciliation, matrix, backlog, coverage handoff, and bounded selection.
- Core working-tree changes are `README.md`, public exports, parser,
  validator, resolver/error types, diagnostic normalization and aggregation,
  canonical projection, and focused tests under `src/`.
- The root checkout also contains unrelated changes in geometry,
  language-specification, package metadata, and other consumer paths; those
  changes were preserved and are not attributed to this Core Runtime handoff.

Remaining-gap ownership handoff:

- `relgeo/core`: expand source-range mapping and diagnostic fault coverage for
  `CORE-INPUT-002`, `CORE-DIAG-001`, and `CORE-DIAG-002`; complete the emitted
  error-code catalog and raw-throw regressions for `CORE-ERROR-003`; and add
  consumer comparator/migration evidence for `CORE-RESOLVE-005`.
- `relgeo/spec` plus workspace/consumer owners: review the semantic projection,
  source-location, severity/origin, and compatibility boundaries before any
  status promotion.
- Workspace/consumer owners: obtain Node `>=24`, current CI, browser, Flutter,
  registry, and public-artifact evidence when those environments are available;
  none is required for this local handoff.
- Fixture 16 remains `⏸️` pending human promotion and shared snapshots.
  General constraint solving/automatic geometry mutation remains `➖` and is
  not an implementation task.

## Current findings against the bounded active selection

The selected rows and their owners, normative paths, contract boundaries, and
acceptance behavior are recorded in
[in-scope-selection.md](./in-scope-selection.md). Their current statuses and
evidence are synchronized below:

| ID | Status | Current evidence | Honest interpretation |
| --- | --- | --- | --- |
| `CORE-INPUT-002` | `🌗` | `core/src/parser.ts`, `core/src/types.ts`, parser tests, and conformance diagnostics | Structured parsing is present, but no public source-range AST contract is established. |
| `CORE-DIAG-001` | `🌗` | `core/src/types.ts`, `core/src/errors.ts`, `core/src/diagnostics.ts`, parser/validator/resolver tests, and invalid/runtime fixtures | Stable code/message/path/phase/severity/range normalization is exposed, but complete source mapping and all raw internal paths remain bounded. |
| `CORE-DIAG-002` | `🌗` | `core/src/diagnostics.ts`, `collectDiagnostics` tests, and strict resolver regression tests | Core now owns bounded deterministic aggregation for parse and independent local validation faults; broader fault coverage and consumer projection remain follow-up work. |
| `CORE-ERROR-003` | `⚠️` | `BOOLEAN_EMPTY_RESULT` is represented and normalized at the public boundary; evaluator still contains raw and prefixed `Error` paths and the emitted-code catalog is not exhaustive | Runtime behavior is preserved, but exhaustive public taxonomy/type agreement remains a confirmed contract-drift risk. |
| `CORE-RESOLVE-005` | `🌗` | `core/src/resolver/index.ts`, `core/src/projection.ts`, projection tests, conformance, and renderer/CLI consumers | A versioned canonical projection is available at the core boundary; existing consumers are not yet migrated to require that projection. |

The remaining catalog statuses are retained from the current reconciliation:
`✔️` means directly evidenced at the inspected boundary, `🌗` means partial
contract/coverage/parity, `❌` means verified absence at the expected boundary,
and `⚠️` means confirmed defect or contract drift. `➖` general constraint
solving/automatic geometry mutation and `⏸️` fixture-16 promotion remain
excluded from implementation; external/canonical evidence remains `?`.

## Full-catalog handoff

The [status matrix](./status-matrix.md) and [reconciliation](./reconciliation.md)
contain the complete 38-row catalog join. The [implementation-gap backlog](./implementation-gap-backlog.md)
contains 15 candidate tasks, while the bounded selection contains five active
candidate rows. The selected implementation adds bounded evidence for
diagnostic aggregation and semantic projection, but does not promote any
selected capability to `✔️`; the remaining taxonomy drift and consumer/source
range boundaries stay visible in the matrix and backlog.

## Primary evidence

- [Expected capability catalog](./expected-capability-catalog.md)
- [Bounded in-scope selection](./in-scope-selection.md)
- [Implementation-gap backlog](./implementation-gap-backlog.md)
- [Expected-versus-observed reconciliation](./reconciliation.md)
- [Status matrix](./status-matrix.md)
- [Archived detailed audit log](./archive/implementation-audit-legacy.md)
- [`core/`](../../../core)
- [`fixtures/manifest.json`](../../../fixtures/manifest.json)
