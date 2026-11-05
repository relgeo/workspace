# RelGeo renderer-svg detailed capability matrix

> Compatibility/detail view for the canonical
> [renderer-svg status matrix](./status-matrix.md). The rows and evidence
> below remain the detailed capability-first reporting view.

> **Coverage statement — 2026-11-05.** Capability-first view for the 33 IDs in
> the expected catalog, joined to the implementation audit and reconciliation.
> Local evidence is separate from browser, Node >=24, registry, public, and
> native-platform verification. Documentation never counts as implementation.

**Surface:** `renderer-svg/`

**Owner:** `relgeo/renderer-svg`

**Compatibility line:** `0.5.x`

**Expected catalog:** [expected catalog](./expected-capability-catalog.md)

**Audit:** [implementation audit](./implementation-audit.md)

**Reconciliation:** [expected-versus-observed reconciliation](./reconciliation.md)
**Backlog:** [implementation-gap backlog](./implementation-gap-backlog.md)
**Closure register:** [frozen closure-boundary register](./reconciliation.md#02-frozen-closure-boundary-register--2026-11-05)

## Status and evidence rules

| Status | Meaning |
| --- | --- |
| `✔️` | Expected capability implemented at the observed boundary. |
| `🌗` | Partial implementation or contract/consumer/evidence coverage. |
| `❌` | Expected capability absent at the observed boundary; remains explicit. |
| `➖` | Not applicable to renderer ownership; not an implementation gap. |
| `⏸️` | Deferred by scope, promotion, or dependency decision. |
| `⚠️` | Confirmed defect or contract mismatch. |

`Status` is implementation status. `Evidence` is `verified-local`,
`partial-local`, or `not-verified`. `Scope` is kept in the reconciliation
register. An unavailable consumer or environment must not turn `❌` into `➖`.

## Closure verdict — 2026-11-05

Before the final closure refresh, the 33-row expected join was `32 ✔️ / 1 🌗 /
0 ❌ / 0 ⚠️`; the partial row was `SVG-INTEG-002`. After the refresh, the
expected renderer boundary is `33 ✔️ / 0 🌗 / 0 ❌ / 0 ⚠️`. The Playground
worker-to-renderer-to-safe-preview contract is implemented and locally covered;
browser-host execution remains a `partial-local` evidence qualifier only.
Shared `GAP-009` and `GAP-013` are also `✔️` at the renderer boundary. Explicit
`➖` and `⏸️` findings remain outside the expected renderer rows and are listed
in the reconciliation register with owners and promotion decisions.

## Capability-first matrix

| ID | Capability | Status | Evidence | Gap / limitation | Owner | Dependency | Risk | Next action |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `SVG-API-001` | Public resolved-scene API returns SVG markup. | `✔️` | `verified-local`: exports, tests, dist | Registry/public install unverified. | renderer-svg | ResolvedScene; geometry | P1 release | Run Node >=24 package boundary. |
| `SVG-API-002` | Node-safe renderer supplies browser-embeddable SVG. | `✔️` | `partial-local`: no DOM dependency, Node build | Browser runtime unverified. | renderer-svg + hosts | Node/browser policy | P1 runtime | Run canonical browser smoke. |
| `SVG-SCENE-001` | Valid SVG root and deterministic empty-scene result. | `✔️` | `partial-local`: fallback and tests | No dedicated empty snapshot. | renderer-svg | Root and bounds | P2 coverage | Add snapshot if promoted. |
| `SVG-SCENE-002` | Viewport/viewBox uses bounds, padding, origin, orientation. | `✔️` | `verified-local`: semantic tests/snapshots | Cross-browser visual parity incomplete. | renderer-svg | Scene bbox/orientation | P1 parity | Keep semantic assertions current. |
| `SVG-SCENE-003` | Width/height and physical/export dimensions preserve geometry. | `✔️` | `verified-local`: default/physical sizing regression, fixture coverage | Browser print/layout and host visual parity remain evidence-only; semantic geometry is unchanged. | renderer-svg + core/CLI/Playground | Units; viewBox; layout | P1 contract | Preserve sizing/context assertions; verify host evidence separately. |
| `SVG-PRIM-001` | Point and line projection preserves coordinates/endpoints. | `✔️` | `verified-local`: tests, fixtures 10/15 | Point-display combinations limited. | renderer-svg | Resolved point/line | P2 coverage | Maintain primitive assertions. |
| `SVG-PRIM-002` | Rect, circle, ellipse preserve resolved dimensions. | `✔️` | `verified-local`: tests, shared fixtures | Metadata combinations not exhaustive. | renderer-svg | Resolved primitive types | P2 coverage | Add contract-relevant edge fixtures. |
| `SVG-PRIM-003` | Arc, quadratic, cubic projection preserves curves. | `✔️` | `verified-local`: emitter tests | Cross-consumer curve comparison bounded. | renderer-svg + geometry | Paths; tolerance | P2 parity | Preserve curve snapshots. |
| `SVG-PRIM-004` | Polygon and text preserve identity and placement. | `✔️` | `verified-local`: tests, fixture 10 | Exact font metrics are surface-specific. | renderer-svg | Text/style policy | P2 parity | Separate placement from font metrics. |
| `SVG-PATH-001` | Open/closed paths, islands, holes, even-odd fill. | `✔️` | `verified-local`: path tests, fixtures 10/15 | Topology remains core-owned. | renderer-svg + geometry/core | Segments and holes | P1 parity | Add promoted topology fixture. |
| `SVG-BOOLEAN-001` | Approved line-line and rectangle intersect/subtract projection. | `✔️` | `verified-local`: fixture 15, conformance | Broader booleans out of boundary. | renderer-svg + core/geometry | Decision 08; fixture 15 | P1 scope | Preserve fixture; do not infer broad parity. |
| `SVG-BOOLEAN-002` | Empty/multipart boolean failure semantics survive boundary. | `✔️` | `verified-local`: fixtures 19/20, CLI | Broader boolean expansion not renderer-owned. | renderer-svg + core | Runtime error contract | P1 errors | Keep upstream codes stable. |
| `SVG-COMP-001` | Recursive group, clone, component, nested composition. | `✔️` | `verified-local`: composition tests | Active v0.5 fixture depth limited. | renderer-svg + core | Object graph; transforms | P1 coverage | Add active v0.5 fixture. |
| `SVG-COMP-002` | Collections retain stable order and IDs. | `✔️` | `partial-local`: rendering and ordering | Multi-result semantic promotion inactive. | renderer-svg + core | Collection identity/order | P1 parity | Add promotion-boundary fixture. |
| `SVG-TRANS-001` | Translate, rotate, scale, mirror, transform chains. | `✔️` | `verified-local`: transform tests | Cross-consumer tolerance bounded. | renderer-svg + core | Resolved transform chain | P2 parity | Preserve order assertions. |
| `SVG-LAYER-001` | Role/visibility filtering and role defaults. | `✔️` | `partial-local`: filters/classes/defaults | Palette parity not fully verified. | renderer-svg + hosts | RenderOptions; role policy | P1 consumer | Re-run palette checks. |
| `SVG-LAYER-002` | Inspection hooks for IDs, labels, anchors, bounds, topology. | `✔️` | `partial-local`: overlays/hooks | Overlay combinations lack fixtures. | renderer-svg + Playground | Render options; inspection UI | P1 consumer | Add bounded overlay fixtures. |
| `SVG-STYLE-001` | Safe stroke, fill, width, opacity, dash, role defaults. | `✔️` | `partial-local`: style emitters/tests | Host presentation remains best-effort. | renderer-svg | Style and role policy | P1 security | Keep attributes escaped and tested. |
| `SVG-STYLE-002` | Text/font/arrow/multiline/annotation fallback. | `✔️` | `verified-local`: 102 renderer tests, finite fallback and security assertions | Bounded fallback, multiline order, and safe dynamic presentation serialization are closed; exact typography metrics vary by surface. | renderer-svg | Text metrics; dim/annotation | P1 typography | Retain regression; host metric parity remains separate. |
| `SVG-META-001` | Inspection-safe projection of selected metadata. | `✔️` | `verified-local`: data attributes/tests | Cross-consumer promotion boundary-only. | renderer-svg + hosts | Metadata contract | P1 parity | Promote fields with explicit tests. |
| `SVG-META-002` | Metadata remains non-authoritative for geometry/identity. | `✔️` | `partial-local`: projection design | No dedicated invariant snapshot. | renderer-svg + core | Scene immutability | P1 integrity | Add metadata-removal invariant test. |
| `SVG-DIM-001` | Linear, radius, diameter, angular dimensions. | `✔️` | `verified-local`: 102 renderer tests, semantic projection tests, fixtures, security | Supported kinds, endpoints/measurements, multiline labels, fallback placement, hostile presentation values, and semantic placement are covered; exact font metrics remain renderer-local. | renderer-svg | Dimension model; metrics | P1 placement | Preserve semantic placement assertions; keep cross-consumer metric evidence separate. |
| `SVG-ANNOT-001` | Target, leader, placement, multiline, fallback annotations. | `✔️` | `verified-local`: 102 renderer tests, semantic projection tests, fixtures, security | Target fallback, leader/place projection, multiline order, hostile presentation escaping, and semantic invariants are covered; browser DOM evidence remains separate. | renderer-svg | Annotation model; metrics | P1 placement | Preserve placement/security assertions; keep browser evidence separate. |
| `SVG-SHEET-001` | Page border, placement/scale, title block, sheet sizing. | `✔️` | `verified-local`: fixtures 02/03/09, renderer regressions, CLI, conformance | Cross-host print/browser rendering and Node >=24 remain separate evidence; resolved model geometry is non-mutated. | renderer-svg + CLI/core | Views/sheets; units; bbox | P1 release | Preserve active renderer contract; retain host evidence separately. |
| `SVG-SHEET-002` | Unknown sheet/view selection fails explicitly. | `✔️` | `verified-local`: renderer and CLI negative tests | Typed missing-sheet/view errors replace model fallback and silent view skips. | renderer-svg + core/CLI | Selector and error contract | P0 correctness | Preserve deterministic missing-sheet/view errors. |
| `SVG-DET-001` | Stable order, IDs, serialization, semantic projection. | `✔️` | `verified-local`: typed replay comparator, projection tests, conformance, and separate-process canonical fixture replay | Schema/version, bbox, object order, IDs, kinds, topology, endpoints, transforms, and normalized numbers are compared semantically; raw SVG bytes and typography are excluded. | renderer-svg + core/parity | Canonical serializer; Node >=24 | P1 parity | Preserve comparator; retain Node >=24/cross-host evidence separately. |
| `SVG-ERR-001` | Explicit invalid-option, missing-view, unsupported-shape handling. | `✔️` | `verified-local`: renderer and CLI negative tests | Typed errors cover invalid options, missing composition targets, missing sheets/views, unsupported shapes, and upstream diagnostics. | renderer-svg + core/CLI | Error taxonomy; boundary policy | P0 correctness | Preserve deterministic error propagation. |
| `SVG-SEC-001` | XML/text/attribute escaping prevents executable SVG. | `✔️` | `verified-local`: 102 renderer tests, 298 conformance checks | Current renderer worktree escapes dynamic fontFamily/fill/text/metadata values; browser E2E was attempted but preview-server binding returned `EPERM`, so DOM insertion remains not-verified. | renderer-svg + Playground | Untrusted metadata; DOM insertion | P1 follow-up | Preserve escaping regressions; verify browser boundary on a host that permits local preview binding. |
| `SVG-EXPORT-001` | SVG string export for stdout, files, docs, web. | `✔️` | `partial-local`: SVG and 9-file tarball | Registry/public artifact unverified. | renderer-svg + release | Package exports; registry | P1 release | Run Node >=24 pack/install checks. |
| `SVG-INTEG-001` | CLI compile-to-SVG and selected-sheet boundary. | `✔️` | `verified-local`: CLI 36/36, conformance | CLI owns parsing/file I/O. | renderer-svg + CLI | Core resolve; CLI options | P1 integration | Preserve format/sheet assertions. |
| `SVG-INTEG-002` | Playground worker → renderer → DOM preview/inspection. | `✔️` | `partial-local`: Playground 107/107 tests, build; browser E2E not-verified | Worker/DOM/sheet/overlay wiring is implemented and covered locally; `pnpm --filter relgeo-playground test:e2e` could not bind `127.0.0.1:4173` (`EPERM`), and public runtime remains unverified. | renderer-svg + Playground | Worker; DOM; core | P0 consumer | Retain safe-preview regression; run browser smoke on a host that permits the preview server. |
| `SVG-INTEG-003` | Shared fixture/conformance participation across statuses. | `✔️` | `verified-local`: 298/298 checks across 23 fixtures | Capability fixtures are not automatic support. | workspace + renderer-svg | Manifest; conformance runner | P1 governance | Keep fixture and capability status separate. |
| `SVG-INTEG-004` | Renderer-owned semantic projection anchors for comparators. | `✔️` | `verified-local`: public projection API and semantic tests | Versioned typed projection exposes identity, kind/order, endpoints, segments, rings/holes, normalized values, transforms, and tolerance; cross-consumer comparison remains separate. | renderer-svg + parity owners | Semantic schema; tolerance; Flutter | P1 parity | Preserve projection schema and add consumer comparator evidence separately. |

## Boundary findings kept separate

| Status | Boundary finding | Handling |
| --- | --- | --- |
| `➖` | Parsing, validation, dependency resolution, geometry solving. | Core/spec ownership; not renderer absence. |
| `➖` | Raw SVG byte parity, universal attribute order, whitespace, font metrics. | Outside semantic parity contract. |
| `➖` | Website direct package ownership and native file service. | Consumer/platform boundary. |
| `⏸️` | Broad boolean union/xor, non-rectangle operands, topology expansion. | Held by Decision 08 and promotion fixtures. |
| `?` | Browser E2E, Node >=24, registry/public, CI/canonical, Flutter/native checks. | Verification follow-up, not absence. |

## Evidence summary

| Evidence check | Result |
| --- | --- |
| Renderer tests | 102/102 local pass; Node 22.23.2 is below required Node >=24. |
| Renderer build | CJS, ESM, and DTS build locally. |
| Shared conformance | 298/298 checks across 23 fixtures. |
| CLI | 38/38 local tests pass. |
| Playground | 107/107 tests and production build pass locally; browser E2E not-verified because preview-server binding returned `EPERM`. |
| Markdown consumers | remark-relgeo build/test/lint pass (16/16 tests); remark-relgeo-hl build/test/lint pass (10 Vitest plus package-boundary test). |
| Package boundary | `npm pack --dry-run --json`: 9 files; public install unverified. |
| Direct probes | Repeated render equal; missing sheet and malicious attribute defects reproduced. |

## Source links

- [Expected catalog](./expected-capability-catalog.md)
- [Implementation audit](./implementation-audit.md)
- [Reconciliation](./reconciliation.md)
- [Implementation-gap backlog](./implementation-gap-backlog.md)
- [Maturation master plan](../../MATURATION-MASTER-PLAN.md)
- [Compatibility matrix](../../compatibility-matrix.json)
- [Flutter capability promotion and SVG parity](../../plans/07-flutter-capability-promotion-and-svg-parity.md)
- [Fixture manifest](../../../fixtures/manifest.json)
