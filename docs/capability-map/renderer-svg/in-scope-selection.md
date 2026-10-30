# Renderer-SVG bounded in-scope selection

**Date:** 2026-10-30  
**Status:** bounded active selection; selection is not implementation or
completion evidence  
**Task:** `select-and-bound-in-scope-capability-debt--1181343984`  
**Owner boundary:** `relgeo/renderer-svg` owns SVG projection and serialization.
Core, CLI, Playground, and parity owners remain explicit collaborators where
the contract crosses their boundary.

## Decision

This tranche selects seven actionable gaps from the expected catalog, the
implementation audit/reconciliation, and the implementation-gap backlog. The
selection is bounded to renderer-owned correctness and semantic-output
anchors that can be implemented and exercised locally without package
publishing, registry installation, deployment, or a canonical Node/Flutter
runtime.

The selected statuses are preserved as observed and are refreshed below after
implementation. `🌗` remains partial where contract or consumer evidence is
still bounded; locally implemented rows are marked `✔️ implemented-local` or
`✔️ fixed-local`. `➖` and `⏸️` remain outside active implementation.
Raw SVG byte equality is not an acceptance condition.

Audit/implementation refresh note: the current renderer worktree now has
local evidence for the selected security, sheet/error, and semantic-projection
boundaries. These statuses do not claim a committed, published, canonical
Node, browser-runtime, or cross-consumer comparator result.

## Evidence and selection inputs

| Input | Role in this selection |
| --- | --- |
| [Expected capability catalog](./expected-capability-catalog.md) | Defines the stable expected IDs, normative source paths, owner boundary, and renderer contract limits. |
| [Implementation audit](./implementation-audit.md) | Supplies observed source/test paths, confirmed defects, partial coverage, and evidence limitations. |
| [Capability matrix](./capability-matrix.md) and [reconciliation](./reconciliation.md) | Supplies the current honest status symbol and separates implementation status from evidence and scope. |
| [Implementation-gap backlog](./implementation-gap-backlog.md) | Supplies the candidate task IDs, owners, dependencies, and acceptance targets from which this tranche is selected. |
| [`renderer-svg/`](../../../renderer-svg/) | Renderer source and focused tests are the primary implementation boundary. |

## Bounded active selection

Each row has one expected capability ID, one backlog task or confirmed-defect
follow-up, an owner, source-of-truth path, observed implementation/test path,
contract boundary, and explicit acceptance behavior.

| Selected task / expected ID | Current status | Owner | Source of truth | Observed implementation / test paths | Contract boundary | Explicit acceptance behavior |
| --- | --- | --- | --- | --- | --- | --- |
| `SVG-FIX-002` — complete dynamic SVG escaping (`SVG-SEC-001`) | `✔️ fixed-local` | `relgeo/renderer-svg` with Playground consumer owner | [`spec/id/core/06-error-model.md`](../../../spec/id/core/06-error-model.md); [`docs/plans/07-flutter-capability-promotion-and-svg-parity.md` §7](../../plans/07-flutter-capability-promotion-and-svg-parity.md); catalog row `SVG-SEC-001`; backlog follow-up `SVG-FIX-002` | [`renderer-svg/src/escape.ts`](../../../renderer-svg/src/escape.ts); [`renderer-svg/src/utils.ts`](../../../renderer-svg/src/utils.ts); [`renderer-svg/src/primitives.ts`](../../../renderer-svg/src/primitives.ts); [`renderer-svg/src/__tests__/security.test.ts`](../../../renderer-svg/src/__tests__/security.test.ts); [`playground/src/components/Preview.tsx`](../../../playground/src/components/Preview.tsx) | Every dynamic text, XML attribute, metadata, style, dimension, and annotation value crossing the SVG string boundary is escaped or rejected. DOM insertion remains a Playground host concern; no executable markup may be emitted by the renderer. | Hostile `fontFamily`, `fill`, metadata, label, and text values remain data in SVG output; 88 renderer tests and 260 conformance checks prove no executable element or attribute for the exercised paths. |
| `SVG-TASK-002` — close typography/presentation serialization (`SVG-STYLE-002`) | `🌗` | `relgeo/renderer-svg` | [`spec/id/presentation/22-dimension.md`](../../../spec/id/presentation/22-dimension.md); [`spec/id/presentation/23-annotation.md`](../../../spec/id/presentation/23-annotation.md); Decision 08 §11; catalog row `SVG-STYLE-002`; backlog task `SVG-TASK-002` | [`renderer-svg/src/primitives.ts`](../../../renderer-svg/src/primitives.ts) `renderText`/`renderDimension`/`renderAnnotation`; [`renderer-svg/src/utils.ts`](../../../renderer-svg/src/utils.ts); renderer security and presentation fixtures | Renderer-local font, arrow, multiline, and fallback policy only. Exact font metrics, line wrapping, and cross-runtime typography parity remain outside this contract. | Text, dimension, and annotation presentation uses deterministic fallback values and safe encoded attributes; style regression tests cover omitted and hostile presentation fields without changing resolved geometry. |
| `SVG-TASK-003` — harden dimension projection (`SVG-DIM-001`) | `🌗` | `relgeo/renderer-svg` with core dimension-model owner | [`spec/id/presentation/22-dimension.md`](../../../spec/id/presentation/22-dimension.md); catalog row `SVG-DIM-001`; backlog task `SVG-TASK-003` | [`renderer-svg/src/primitives.ts`](../../../renderer-svg/src/primitives.ts) `renderDimension`; [`renderer-svg/src/__tests__/reference_fixtures.test.ts`](../../../renderer-svg/src/__tests__/reference_fixtures.test.ts); dimension fixtures and security probe cited by the audit | Renderer projects resolved linear, radius, diameter, and angular dimensions; core owns dimension meaning and resolved geometry. Renderer must not recompute or mutate measurement semantics. | Focused fixtures assert extension/leader placement, labels, arrow/style fallback, and safe dynamic attributes for all supported dimension kinds; semantic geometry and existing fixture-15 behavior remain unchanged. |
| `SVG-TASK-004` — harden annotation projection (`SVG-ANNOT-001`) | `🌗` | `relgeo/renderer-svg` with Playground consumer owner | [`spec/id/presentation/23-annotation.md`](../../../spec/id/presentation/23-annotation.md); catalog row `SVG-ANNOT-001`; backlog task `SVG-TASK-004` | [`renderer-svg/src/primitives.ts`](../../../renderer-svg/src/primitives.ts) `renderAnnotation`; [`fixtures/reference/02-mixed-presentational-sheet.yaml`](../../../fixtures/reference/02-mixed-presentational-sheet.yaml); [`fixtures/reference/06-nested-structural-sheet.yaml`](../../../fixtures/reference/06-nested-structural-sheet.yaml) | Renderer owns annotation SVG projection and fallback placement. Core owns target/reference resolution; Playground owns DOM mounting and diagnostic UI. Exact text metrics remain renderer-local. | Target/leader/place, multiline order, fallback placement, and hostile font/fill/label values pass renderer tests and the DOM-boundary safety checks without executable markup or geometry mutation. |
| `SVG-FIX-001` — explicit missing sheet/view failure (`SVG-SHEET-002`) | `✔️ fixed-local` | `relgeo/renderer-svg` with core/CLI owners | [`spec/id/presentation/25-views-sheets.md` §25.5](../../../spec/id/presentation/25-views-sheets.md); [`spec/id/core/06-error-model.md`](../../../spec/id/core/06-error-model.md); catalog row `SVG-SHEET-002`; backlog follow-up `SVG-FIX-001` | [`renderer-svg/src/index.ts`](../../../renderer-svg/src/index.ts) `render`/`renderSheet`; [`renderer-svg/src/__tests__/renderer.test.ts`](../../../renderer-svg/src/__tests__/renderer.test.ts); [`cli/src/__tests__/cli.test.ts`](../../../cli/src/__tests__/cli.test.ts) | Renderer owns deterministic sheet/view selection failure; core owns resolved sheet/view validity and error taxonomy; CLI owns argument parsing and exit/reporting. No silent fallback to model rendering or skipped view is allowed. | Unknown `sheetId` and missing view references return stable actionable errors; renderer and CLI negative tests prove no model fallback, silent skip, or partial misleading page. |
| `SVG-TASK-007` — complete renderer error contract (`SVG-ERR-001`) | `✔️ implemented-local` | `relgeo/renderer-svg` with core/CLI owners | [`spec/id/core/06-error-model.md`](../../../spec/id/core/06-error-model.md); [`fixtures/manifest.json`](../../../fixtures/manifest.json); catalog row `SVG-ERR-001`; backlog task `SVG-TASK-007` | [`renderer-svg/src/index.ts`](../../../renderer-svg/src/index.ts); [`renderer-svg/src/__tests__/renderer.test.ts`](../../../renderer-svg/src/__tests__/renderer.test.ts); [`cli/src/__tests__/cli.test.ts`](../../../cli/src/__tests__/cli.test.ts); fixtures 11–14 and 17–20 | Renderer distinguishes empty scene, malformed/unsupported render input, missing composition target, missing sheet/view, and upstream runtime diagnostics. It does not parse DSL or invent repairs. | Negative renderer tests cover invalid options, missing sheet/view, unsupported resolved shape, and upstream diagnostic propagation with deterministic error behavior; existing active, legacy, invalid, and runtime fixtures retain their status. |
| `SVG-TASK-009` — expose semantic projection anchors (`SVG-INTEG-004`) | `✔️ implemented-local` | `relgeo/renderer-svg` with parity owners | [`docs/decisions/07-cross-repo-open-decisions.md` §5](../../decisions/07-cross-repo-open-decisions.md); [`docs/decisions/08-boolean-intersection-contract-review.md` §§3, 6](../../decisions/08-boolean-intersection-contract-review.md); plan 07 §7; catalog row `SVG-INTEG-004`; backlog task `SVG-TASK-009` | [`renderer-svg/src/semantic.ts`](../../../renderer-svg/src/semantic.ts); [`renderer-svg/src/types.ts`](../../../renderer-svg/src/types.ts); [`renderer-svg/src/__tests__/semantic_projection.test.ts`](../../../renderer-svg/src/__tests__/semantic_projection.test.ts); [`renderer-svg/README.md`](../../../renderer-svg/README.md) | The renderer exposes a small versioned semantic projection of identity, kind, primitive/path topology, endpoints/rings, and geometry values/tolerance. Comparator policy and Flutter execution remain consumer/parity evidence, not renderer ownership. Raw SVG bytes are explicitly excluded. | A public, typed projection/adapter has documented fields and versioning; focused fixtures compare approved semantic anchors and preserve stable ordering/numeric policy. Tests prove semantic equivalence without requiring equal whitespace, attribute order, marker markup, or serialized path bytes. |

## Sequencing and dependency boundary

The intended implementation order is:

1. `SVG-FIX-002` + `SVG-TASK-002` establish one safe dynamic-attribute and
   presentation serialization path.
2. `SVG-TASK-003` and `SVG-TASK-004` consume that path for dimensions and
   annotations; their semantic placement remains resolved-scene driven.
3. `SVG-FIX-001` + `SVG-TASK-007` close missing-target and renderer error
   behavior without changing core parsing or resolution.
4. `SVG-TASK-009` defines the smallest renderer-owned semantic projection and
   its local fixture contract; cross-consumer parity runs remain follow-up
   evidence.

These are sequencing constraints, not extra scope. The selected work does not
require npm publishing, registry installation, deployment, browser E2E, Node
>=24, Flutter SDK access, or changes to the upstream reference implementation.

## Deliberately excluded from active implementation

The following remain visible candidate or verification work and are not active
in this bounded tranche:

| Excluded item | Status | Reason |
| --- | --- | --- |
| `SVG-SCENE-003` / `SVG-TASK-001` | `🌗` | Physical/export context matrix is useful but host-layout dependent; it is not required to close the selected safety/error/semantic anchors. |
| `SVG-SHEET-001` / `SVG-TASK-005` | `🌗` | Active v0.5 sheet fixture promotion is separate from the selected missing-target correctness defect. |
| `SVG-DET-001` / `SVG-TASK-006` | `🌗` | Cross-host replay requires canonical runtime evidence; local repeated-render evidence remains visible but is not promoted. |
| `SVG-INTEG-002` / `SVG-TASK-008` | `🌗` | Browser E2E and fresh public runtime are verification/consumer work, not a prerequisite for renderer-local changes. |
| `➖` parsing, validation, dependency resolution, geometry solving, universal raw-byte parity, and native file service | `➖` | These are outside renderer ownership or explicitly outside the semantic SVG contract. |
| Broad boolean union/xor, non-rectangle operands, and topology expansion | `⏸️` | Decision 08 and promotion fixtures hold this expansion; no renderer task is created here. |
| Browser E2E, Node >=24, registry/public artifact, CI/canonical, and Flutter/native checks | `?` not verified | These remain evidence follow-ups and must not be relabeled as implementation absence or completion. |

No `➖` or `⏸️` item is treated as active implementation work.

## Status accounting

| Check | Result |
| --- | ---: |
| Selected capability IDs | 7 |
| Selected `🌗` rows | 3 (`SVG-STYLE-002`, `SVG-DIM-001`, `SVG-ANNOT-001`) |
| Selected `⚠️` rows currently remaining | 0 |
| Selected `❌` rows | 0 |
| Selected `✔️ implemented/fixed-local` rows | 4 (`SVG-SEC-001`, `SVG-SHEET-002`, `SVG-ERR-001`, `SVG-INTEG-004`) |
| Selected `➖` or `⏸️` rows | 0 |
| Selected IDs with owner, source path, boundary, and acceptance behavior | 7/7 |

Changing this record, the backlog, or the matrix is not implementation
evidence. Each selected row requires the source/test/runtime evidence stated
above and a fresh status-matrix, audit, and reconciliation review before its
symbol changes.
