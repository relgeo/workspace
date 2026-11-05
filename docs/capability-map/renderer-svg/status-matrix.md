# RelGeo renderer-svg capability status matrix

**Tanggal:** 2026-11-04  
**Surface:** `renderer-svg/`  
**Owner:** `relgeo/renderer-svg`  
**Compatibility line:** RelGeo DSL `0.5.x`

This is the canonical status view for the 33 IDs in the
[expected capability catalog](./expected-capability-catalog.md). The detailed
capability-first view remains available in the
[capability matrix](./capability-matrix.md); source findings are in the
[implementation audit](./implementation-audit.md), and one-to-one expected/
observed reconciliation is in [reconciliation](./reconciliation.md).

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

## P0/P1 triage handoff

The 2026-11-04 backlog triage covers every P0/P1 candidate or confirmed
follow-up row currently listed in the backlog. Six rows are
implementation-closable from this checkout:
`SVG-SCENE-003`, `SVG-STYLE-002`, `SVG-DIM-001`, `SVG-ANNOT-001`,
`SVG-SHEET-001`, and `SVG-DET-001`. `SVG-ERR-001`, `SVG-INTEG-004`,
`SVG-SHEET-002`, and `SVG-SEC-001` are retained as local regression handoffs;
`SVG-INTEG-002` is consumer/browser evidence only. Shared `GAP-009` and
`GAP-013` are implementation-closable contract mappings to the same renderer
queue. Owners, source-of-truth
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
| `SVG-SCENE-003` | Width/height and physical/export dimensions | `🌗` | `partial-local`; sizing paths exist, matrix incomplete | renderer-svg + hosts | P1; `SVG-TASK-001` |
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
| `SVG-STYLE-002` | Typography/arrow/multiline/annotation fallback | `🌗` | `verified-local`; safe presentation, exact metrics bounded | renderer-svg | P0; `SVG-TASK-002` |
| `SVG-META-001` | Inspection-safe metadata projection | `✔️` | `verified-local`; data attributes/tests | renderer-svg + hosts | P1 parity; explicit promotion only |
| `SVG-META-002` | Metadata non-authoritative | `✔️` | `partial-local`; design covered, invariant snapshot absent | renderer-svg + core | P1 integrity; add invariant test |
| `SVG-DIM-001` | Linear/radius/diameter/angular dimensions | `🌗` | `verified-local`; placement/security covered, exhaustive consumer coverage partial | renderer-svg + core | P0; `SVG-TASK-003` |
| `SVG-ANNOT-001` | Target/leader/placement/multiline annotations | `🌗` | `verified-local`; semantic projection/security covered, host evidence partial | renderer-svg + Playground | P0; `SVG-TASK-004` |
| `SVG-SHEET-001` | Sheet border, view placement, title block, sizing | `🌗` | `partial-local`; mostly legacy 0.4 evidence | renderer-svg + CLI/core | P1; `SVG-TASK-005` |
| `SVG-SHEET-002` | Explicit missing sheet/view errors | `✔️` | `verified-local`; typed renderer/CLI failures | renderer-svg + core/CLI | P0; retain `SVG-FIX-001` |
| `SVG-DET-001` | Stable order/IDs/semantic serialization | `🌗` | `verified-local`; local projection/replay, no full cross-host suite | renderer-svg + core/parity | P1; `SVG-TASK-006` |
| `SVG-ERR-001` | Invalid-option/target/shape handling | `✔️` | `verified-local`; negative tests and typed errors | renderer-svg + core/CLI | P0; retain `SVG-TASK-007` regression |
| `SVG-SEC-001` | XML/text/attribute escaping | `✔️` | `verified-local`; renderer security suite and 298 conformance checks | renderer-svg + Playground | P0; retain `SVG-FIX-002`, browser evidence separate |
| `SVG-EXPORT-001` | SVG string export | `✔️` | `partial-local`; build/tarball local, registry unverified | renderer-svg + release | P1 release; public package proof |
| `SVG-INTEG-001` | CLI compile-to-SVG/sheet boundary | `✔️` | `verified-local`; CLI 36/36 and conformance | renderer-svg + CLI | P1 integration |
| `SVG-INTEG-002` | Playground worker → DOM preview | `🌗` | `partial-local`; browser E2E not-verified (`EPERM`) | renderer-svg + Playground | P0 evidence; host smoke only |
| `SVG-INTEG-003` | Shared fixture/conformance participation | `✔️` | `verified-local`; 298/298 checks | workspace + renderer-svg | P1 governance |
| `SVG-INTEG-004` | Renderer semantic projection anchors | `✔️` | `verified-local`; public typed projection/tests | renderer-svg + parity owners | P1 parity; consumer comparator separate |

## Boundary findings kept separate

| Finding | Status | Owner / next action |
| --- | --- | --- |
| Parsing, validation, dependency resolution, geometry solving | `➖` | core/spec; do not create renderer task |
| Raw SVG byte equality, whitespace, attribute order, exact font metrics | `➖` | outside semantic parity contract |
| Broad boolean union/xor, non-rectangle operands, topology expansion | `⏸️` | workspace + core/geometry/Flutter; requires promotion decision |
| Browser E2E, Node `>=24`, registry/public, CI/canonical, Flutter/native checks | `? not-verified` | workspace + consumer owners; run on supported host |
| `MD-DIAG-003` tolerant Markdown diagnostic transport | `❌` at Markdown boundary | remark-relgeo + core; add Markdown AST fixture, not renderer work |

## Source links

- [Expected catalog](./expected-capability-catalog.md)
- [Implementation audit](./implementation-audit.md)
- [Reconciliation](./reconciliation.md)
- [Detailed capability matrix](./capability-matrix.md)
- [Implementation-gap backlog](./implementation-gap-backlog.md)
- [Coverage validation handoff](./coverage-validation-handoff.md)
