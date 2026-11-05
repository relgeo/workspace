# RelGeo renderer-svg capability status matrix

**Tanggal:** 2026-11-05
**Surface:** `renderer-svg/`  
**Owner:** `relgeo/renderer-svg`  
**Compatibility line:** RelGeo DSL `0.5.x`

This is the canonical status view for the 33 IDs in the
[expected capability catalog](./expected-capability-catalog.md). The detailed
capability-first view remains available in the
[capability matrix](./capability-matrix.md); source findings are in the
[implementation audit](./implementation-audit.md), and one-to-one expected/
observed reconciliation is in [reconciliation](./reconciliation.md).
The owner/source-of-truth/classification/remaining-boundary join for these
rows and the shared renderer mappings is frozen in the
[closure-boundary register](./reconciliation.md#02-frozen-closure-boundary-register--2026-11-05).

Status is implementation/reconciliation state. Evidence qualifiers such as
`verified-local`, `partial-local`, and `not-verified` are not status symbols;
browser, Node `>=24`, registry/public, CI, Flutter, and native-host limits stay
explicit rather than becoming `❌`.

| Status | Meaning |
| --- | --- |
| `✔️` | Implemented at the observed boundary. |
| `🌗` | Partial implementation, contract coverage, consumer coverage, or evidence. |
| `❌` | Expected at this boundary but absent; none in the current 33-row join. |
| `➖` | Not applicable to renderer ownership. |
| `⏸️` | Held by scope/promotion/dependency decision. |
| `⚠️` | Confirmed defect or contract mismatch. |

## Closure verdict — 2026-11-05

The frozen renderer closure boundary contains all 33 expected renderer IDs plus
shared mappings `GAP-009` and `GAP-013`. Status is based on the observed
implementation/reconciliation result; `partial-local` and `not-verified`
qualifiers remain attached to evidence and do not reopen an implemented
renderer contract.

| Accounting point | `✔️` | `🌗` | `❌` | `⚠️` | Decision |
| --- | ---: | ---: | ---: | ---: | --- |
| Before closure refresh (2026-11-04) | 32 | 1 | 0 | 0 | `SVG-INTEG-002` was held as an evidence-only partial row. |
| After closure refresh (2026-11-05) | 33 | 0 | 0 | 0 | Worker → renderer → safe preview wiring is implemented locally; browser-host proof remains `not-verified`. |

Remaining `➖` and `⏸️` decisions are explicit non-renderer boundaries: parser,
resolver, and geometry ownership plus raw-byte/typography equality are `➖`;
broad boolean union/xor and topology expansion are `⏸️` pending promotion and
fixtures. Node `>=24`, browser E2E, CI/public, Flutter, and native-host runs
are evidence-only `not-verified` findings, not status gaps.

## P0/P1 triage handoff

The 2026-11-05 closure refresh covers the scene/sheet sizing and traversal
rows, the style/dimension/annotation/presentation-safety contract, and the
worker-to-renderer safe preview contract with direct renderer, fixture, core,
CLI, Playground, website, and conformance evidence. All 33 expected renderer
rows are now `✔️`; `SVG-INTEG-002` retains a `partial-local` browser evidence
qualifier but is no longer an implementation-status gap.
`SVG-ERR-001`, `SVG-INTEG-004`,
`SVG-SHEET-002`, and `SVG-SEC-001` are retained as local regression handoffs;
`SVG-INTEG-002` has a consumer/browser evidence qualifier only. Shared `GAP-009` and
`GAP-013` are closed at the renderer boundary and remain mapped for their
consumer/source-gap evidence. Owners, source-of-truth
paths, acceptance tests, and initial statuses are recorded in the
[P0/P1 implementation-closability triage](./implementation-gap-backlog.md#p0p1-implementation-closability-triage).

This selection does not promote any status. It also does not make npm/pub.dev
release, production deployment, Node-24/CI, browser/native-host evidence, or
Flutter execution a local implementation prerequisite. Broad boolean expansion
remains `⏸️` and the Markdown diagnostic transport row is not renderer-owned.

## Capability status

| ID | Capability | Status | Evidence / current finding | Owner | Priority / next action |
| --- | --- | --- | --- | --- | --- |
| `SVG-API-001` | Public resolved-scene API returns SVG | `✔️` | `verified-local`; exports, tests, dist boundary | renderer-svg | P1 release; verify Node-24/public package |
| `SVG-API-002` | Node-safe and browser-embeddable SVG | `✔️` | `partial-local`; no DOM dependency, browser runtime unverified | renderer-svg + hosts | P1 runtime; canonical browser smoke |
| `SVG-SCENE-001` | Valid root and deterministic empty scene | `✔️` | `partial-local`; fallback/tests, no dedicated snapshot | renderer-svg | P2 coverage; retain regression |
| `SVG-SCENE-002` | Bounds/padding/origin/orientation viewBox | `✔️` | `verified-local`; semantic tests/snapshots | renderer-svg | P1 parity; preserve assertions |
| `SVG-SCENE-003` | Width/height and physical/export dimensions | `✔️` | `verified-local`; default/physical sizing, viewBox, preserveAspectRatio, and scene immutability regression | renderer-svg + core/CLI/Playground | P1; retain host evidence separately |
| `SVG-PRIM-001` | Point and line projection | `✔️` | `verified-local`; tests and fixtures 10/15 | renderer-svg | P2 coverage |
| `SVG-PRIM-002` | Rect/circle/ellipse projection | `✔️` | `verified-local`; tests and shared fixtures | renderer-svg | P2 coverage |
| `SVG-PRIM-003` | Arc/quadratic/cubic projection | `✔️` | `verified-local`; emitter tests | renderer-svg + geometry | P2 parity |
| `SVG-PRIM-004` | Polygon/text identity and placement | `✔️` | `verified-local`; tests and fixture 10 | renderer-svg | P2 parity |
| `SVG-PATH-001` | Paths, islands, holes, even-odd fill | `✔️` | `verified-local`; path tests and fixtures 10/15 | renderer-svg + geometry/core | P1 parity; retain bounded topology |
| `SVG-BOOLEAN-001` | Approved intersection/subtract projection | `✔️` | `verified-local`; fixture 15/conformance | renderer-svg + core/geometry | P1 scope; preserve boundary |
| `SVG-BOOLEAN-002` | Empty/multipart boolean failures | `✔️` | `verified-local`; fixtures 19/20 and CLI | renderer-svg + core | P1 errors; preserve codes |
| `SVG-COMP-001` | Recursive composition | `✔️` | `verified-local`; composition tests | renderer-svg + core | P1 coverage; add active fixture |
| `SVG-COMP-002` | Stable collection order and IDs | `✔️` | `partial-local`; rendering/order tested | renderer-svg + core | P1 parity; promotion boundary |
| `SVG-TRANS-001` | Transform chains | `✔️` | `verified-local`; transform tests | renderer-svg + core | P2 parity |
| `SVG-LAYER-001` | Role/visibility/defaults | `✔️` | `partial-local`; filters/classes/defaults | renderer-svg + hosts | P1 consumer; palette evidence |
| `SVG-LAYER-002` | Inspection hooks and overlays | `✔️` | `partial-local`; hooks exist, combinations thin | renderer-svg + Playground | P1 consumer; bounded fixtures |
| `SVG-STYLE-001` | Safe stroke/fill/style defaults | `✔️` | `partial-local`; emitters/tests | renderer-svg | P1 security; retain escaping |
| `SVG-STYLE-002` | Typography/arrow/multiline/annotation fallback | `✔️` | `verified-local`; finite fallbacks, multiline order, safe presentation serialization | renderer-svg | P0; retain regression and host metric boundary |
| `SVG-META-001` | Inspection-safe metadata projection | `✔️` | `verified-local`; data attributes/tests | renderer-svg + hosts | P1 parity; explicit promotion only |
| `SVG-META-002` | Metadata non-authoritative | `✔️` | `partial-local`; design covered, invariant snapshot absent | renderer-svg + core | P1 integrity; add invariant test |
| `SVG-DIM-001` | Linear/radius/diameter/angular dimensions | `✔️` | `verified-local`; all supported kinds, multiline labels, placement, fallback, and hostile-value safety | renderer-svg + core | P0; retain regression and host metric boundary |
| `SVG-ANNOT-001` | Target/leader/placement/multiline annotations | `✔️` | `verified-local`; target fallback, leader/place projection, multiline order, semantic invariants, and hostile-value safety | renderer-svg + Playground | P0; retain regression and browser boundary |
| `SVG-SHEET-001` | Sheet border, view placement, title block, sizing | `✔️` | `verified-local`; fixtures 02/03/09, placement/scale, title block, CLI/conformance, non-mutating scene regression | renderer-svg + CLI/core | P1; retain host evidence separately |
| `SVG-SHEET-002` | Explicit missing sheet/view errors | `✔️` | `verified-local`; typed renderer/CLI failures | renderer-svg + core/CLI | P0; retain `SVG-FIX-001` |
| `SVG-DET-001` | Stable order/IDs/semantic serialization | `✔️` | `verified-local`; typed replay comparator, projection tests, and separate-process canonical fixture replay | renderer-svg + core/parity | P1; retain host evidence separately |
| `SVG-ERR-001` | Invalid-option/target/shape handling | `✔️` | `verified-local`; negative tests and typed errors | renderer-svg + core/CLI | P0; retain `SVG-TASK-007` regression |
| `SVG-SEC-001` | XML/text/attribute escaping | `✔️` | `verified-local`; renderer security suite and 298 conformance checks | renderer-svg + Playground | P0; retain `SVG-FIX-002`, browser evidence separate |
| `SVG-EXPORT-001` | SVG string export | `✔️` | `partial-local`; build/tarball local, registry unverified | renderer-svg + release | P1 release; public package proof |
| `SVG-INTEG-001` | CLI compile-to-SVG/sheet boundary | `✔️` | `verified-local`; CLI 36/36 and conformance | renderer-svg + CLI | P1 integration |
| `SVG-INTEG-002` | Playground worker → DOM preview | `✔️` | `partial-local`; worker/renderer/safe preview wiring is implemented and covered locally; browser E2E remains not-verified (`EPERM`) | renderer-svg + Playground | P0 regression retained; host smoke remains evidence-only |
| `SVG-INTEG-003` | Shared fixture/conformance participation | `✔️` | `verified-local`; 298/298 checks | workspace + renderer-svg | P1 governance |
| `SVG-INTEG-004` | Renderer semantic projection anchors | `✔️` | `verified-local`; public typed projection/tests | renderer-svg + parity owners | P1 parity; consumer comparator separate |

## Shared and downstream boundary rows

These rows are not silently folded into the 33 expected renderer count. The
shared rows remain part of the renderer closure boundary; the Markdown row is
retained as a related consumer gap and is not renderer-owned.

| ID | Class | Status | Evidence / current finding | Owner / source of truth | Remaining boundary / decision |
| --- | --- | --- | --- | --- | --- |
| `GAP-009` | `shared` | `✔️` at renderer boundary | `verified-local`; presentation fixture, renderer/security checks, semantic invariants, and mapped CLI evidence | renderer + core; `spec/id/presentation/22-dimension.md`, `23-annotation.md`, `26-metadata.md`; language-spec gap row | Renderer contract is closed; Markdown/host/public cross-surface evidence remains separate; retain shared mapping |
| `GAP-013` | `shared` | `✔️` at renderer boundary | `verified-local`; security/conformance no-executable-markup assertions and safe metadata serialization | renderer; presentation fixture, `security.test.ts`, language-spec gap row | Renderer serialization is closed; consumer/browser/public evidence remains separate; retain shared mapping |
| `MD-DIAG-003` | `consumer` | `❌` at Markdown boundary | Target runtime-diagnostic fixture exists; Markdown AST fixture and tolerant/strict assertions are still required | `remark-relgeo` + core; fixture 14 and Markdown AST contract | Outside renderer-owned closure, but retained as downstream dependency/evidence row |

## Boundary findings kept separate

| Finding | Status | Owner / next action |
| --- | --- | --- |
| Parsing, validation, dependency resolution, geometry solving | `➖` | core/spec; do not create renderer task |
| Raw SVG byte equality, whitespace, attribute order, exact font metrics | `➖` | outside semantic parity contract |
| Broad boolean union/xor, non-rectangle operands, topology expansion | `⏸️` | workspace + core/geometry/Flutter; requires promotion decision |
| Browser E2E, Node `>=24`, registry/public, CI/canonical, Flutter/native checks | `? not-verified` | workspace + consumer owners; run on supported host |
| `MD-DIAG-003` tolerant Markdown diagnostic transport | `❌` at Markdown boundary | remark-relgeo + core; add Markdown AST fixture, not renderer work |

For the complete 33-row owner/source/evidence/boundary register, use
[reconciliation §0.2](./reconciliation.md#02-frozen-closure-boundary-register--2026-11-05).

## Source links

- [Expected catalog](./expected-capability-catalog.md)
- [Implementation audit](./implementation-audit.md)
- [Reconciliation](./reconciliation.md)
- [Detailed capability matrix](./capability-matrix.md)
- [Implementation-gap backlog](./implementation-gap-backlog.md)
- [Coverage validation handoff](./coverage-validation-handoff.md)
