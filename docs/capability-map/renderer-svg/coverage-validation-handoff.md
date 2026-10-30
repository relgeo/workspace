# Renderer-SVG coverage validation and handoff

**Tanggal:** 2026-10-30
**Status:** validation checkpoint selesai; surface belum dinyatakan lengkap
**Boundary:** `relgeo/renderer-svg` pada compatibility line RelGeo DSL `0.5.x`

Dokumen ini memvalidasi catalog expected, audit implementation, reconciliation,
status matrix, dan gap backlog. Ia memeriksa coverage dan keterlacakan artefak;
ia bukan bukti bahwa gap implementasi sudah ditutup.

## 1. Validation result

| Check | Result | Evidence / interpretation |
| --- | --- | --- |
| Expected capability IDs | PASS | 33 unique IDs pada expected catalog. |
| Audit ID join | PASS | 33 audit rows; tidak ada expected ID yang hilang atau duplicate. |
| Reconciliation join | PASS | 33 rows; setiap expected ID memiliki tepat satu result. |
| Matrix coverage | PASS | 33 capability-first rows; status sama dengan reconciliation. |
| Backlog derivation | PASS | 9 historical candidate tasks untuk the rows that were `🌗`/`❌` at backlog creation; source ID tidak hilang/duplicate. |
| Confirmed defect retention | PASS | No selected `⚠️` remains open; `SVG-SEC-001` and `SVG-SHEET-002` are recorded as local fixes, with historical follow-up rows retained. |
| Legend | PASS | Matrix memuat `✔️`, `🌗`, `❌`, `➖`, `⏸️`, `⚠️`; evidence memakai `verified-local`, `partial-local`, `not-verified`. |
| Local Markdown links | PASS | Link/path pada matrix dan backlog resolve ke file lokal yang ada. |
| Required source paths | PASS | Repository map, master plan, catalog, audit, reconciliation, matrix, backlog, fixture manifest, dan compatibility matrix tersedia/tertaut. |

Validation script juga memeriksa bahwa matrix dan backlog tidak memiliki trailing
whitespace, compatibility matrix dan fixture manifest dapat diparse, serta
status matrix tidak berbeda dari reconciliation.

## 2. Discovery coverage validation

Audit current mencatat seluruh kategori discovery minimum berikut. Coverage ini
berarti sumber sudah diperiksa dan batas evidence ditulis; bukan berarti semua
behavior pada sumber tersebut sudah lengkap.

| Discovery category | Sources / boundary checked | Current result |
| --- | --- | --- |
| Source/API | `renderer-svg/src` index, primitives, utils, escape, types; package/build config; core resolver; CLI; remark; Playground worker/Preview | Public API, emitters, options, escaping, resolved-scene handoff, CLI, plugin, dan worker imports inspected. |
| Tests/fixtures | Renderer tests, core/CLI/Playground/remark tests, fixture reference/expected/manifest, conformance runner | Renderer 88/88, Playground 93/93, CLI 10/10, remark 5/5 + 3/3, conformance 260/260 across 20 fixtures. |
| UI/menu/command/route | CLI info/compile/check/validate; Playground selector, toolbar, inspector, overlays, DOM insertion | Host wiring inspected; renderer owns no UI/menu/shortcut/route. Browser E2E remains not verified. |
| Platform/security/runtime | Node entrypoints, browser worker/DOM path, dynamic HTML insertion, XML escaping, physical mode, diagnostic overlay | Local build/test and current hostile-value security checks pass; typed sheet/error handling and semantic projection are renderer-local; fresh browser/native/accessibility runtime not verified. |
| Delivery/operations | Package scripts, dist boundary, root integration gate, release/compatibility scripts, npm pack | Build and 9-file tarball dry-run pass; registry/public/current CI not verified for this audit revision. |
| Ownership/documentation | `REPOSITORY-MAP`, master plan, compatibility matrix, catalog, plan 07, decisions 07/08, package/consumer READMEs, fixture manifest | Ownership, 0.5 compatibility, parity policy, fixture status, consumer boundaries, and raw-byte non-goal are traceable. |

Scope terms explicitly covered are scene rendering, primitives, transforms,
styles, dimensions, layers, composition, semantic parity, deterministic output,
error handling, export boundary, browser/Node use, and consumer integration.

### Capability-category coverage proof

The expected catalog declares six capability categories. The audit and
reconciliation retain every category and every ID; the counts below sum to all
33 expected rows.

| Catalog category | Expected ID families | Expected rows | Audit/reconciliation coverage | Result |
| --- | --- | ---: | --- | --- |
| A. Public boundary and scene root | `SVG-API-*`, `SVG-SCENE-*` | 5 | `renderer-svg/src/index.ts`, `types.ts`, renderer tests; reconciliation rows A IDs | PASS |
| B. Primitive and semantic geometry projection | `SVG-PRIM-*`, `SVG-PATH-*`, `SVG-BOOLEAN-*` | 7 | `renderer-svg/src/primitives.ts`, shared fixtures 10/15/19/20, conformance; reconciliation rows B IDs | PASS |
| C. Composition, transforms, and layers | `SVG-COMP-*`, `SVG-TRANS-*`, `SVG-LAYER-*` | 5 | recursive renderer/transform utilities, Playground options/overlays; reconciliation rows C IDs | PASS |
| D. Styles and semantic metadata | `SVG-STYLE-*`, `SVG-META-*` | 4 | style/metadata utilities, security tests, metadata fixtures; reconciliation rows D IDs | PASS |
| E. Dimensions, annotations, views, and sheets | `SVG-DIM-*`, `SVG-ANNOT-*`, `SVG-SHEET-*` | 4 | dimension/annotation emitters, sheet fixtures 02–09, CLI `--sheet`; reconciliation rows E IDs | PASS |
| F. Determinism, error, security, and delivery boundary | `SVG-DET-*`, `SVG-ERR-*`, `SVG-SEC-*`, `SVG-EXPORT-*`, `SVG-INTEG-*` | 8 | renderer/package config, CLI/worker, conformance, security/packaging evidence; reconciliation rows F IDs | PASS |
| **Total** | **all `SVG-*` expected IDs** | **33** | **33 audit rows → 33 reconciliation rows → 33 matrix rows** | **PASS** |

The category proof is bounded to the declared catalog. It proves review and
traceability of the source categories and capability families, not that every
possible renderer behavior, platform, or presentation combination is complete.

## 3. ID, legend, evidence, and scope checks

Implementation, evidence, and scope are separate axes throughout the artifact set:

- implementation is recorded in the audit, reconciliation result, and matrix;
- evidence is `verified-local`, `partial-local`, or `not-verified`; local Node
  22 passes do not become canonical Node >=24 evidence;
- scope is recorded in reconciliation and boundary findings; `➖` is not used
  to hide absence, and `⏸️` is not used to hide an implementation gap;
- no expected row currently remains `❌` or `⚠️`; the selected sheet/error and
  semantic-projection rows are `✔️ implemented-local`;
- dynamic SVG escaping is `✔️ fixed-local` in the current renderer worktree,
  while browser and canonical-runtime evidence remain separate.

Required trace chain:

`expected catalog ID → audit ID row → reconciliation result → matrix row → backlog task (when 🌗/❌)`

Every remaining `🌗` expected row has exactly one candidate backlog task. The
resolved sheet/error, semantic, and security rows remain historical backlog
evidence rather than active unimplemented work; `➖` and `⏸️` boundaries remain
outside the implementation selection.

## 4. Limitations that remain open

| Limitation | Status | Consequence |
| --- | --- | --- |
| Local toolchain | Node `22.23.2` is below repository requirement `>=24`. | Local passes are local evidence only, not canonical runtime proof. |
| Browser/runtime | Source path and Playground wiring inspected; E2E attempted but sandbox preview-server bind returned `EPERM`. | Browser visual/DOM behavior remains not verified; this is an environment limitation, not target-failure evidence. |
| Public delivery | npm pack dry-run passes; fresh registry/public artifact not verified. | Export/package readiness is not a public-release claim. |
| Native/consumer parity | Flutter/native/accessibility and cross-host checks not reproduced here. | Semantic parity and platform usability remain bounded/unverified. |
| Legacy sheet evidence | Most direct sheet evidence is legacy 0.4. | Active 0.5 sheet support needs backlog fixture before broad parity claim. |
| Semantic contract | Raw SVG bytes, whitespace, attribute order, and exact font metrics are outside universal contract. | Acceptance must use approved semantic anchors and tolerance. |
| Boolean expansion | Union/xor, non-rectangle operands, degenerate/topology expansion are deferred. | Generic serialization is not evidence of promoted parity. |

None of these limitations is converted into `❌` without an implementation
observation. The current selected renderer boundary has no open `❌` or `⚠️`
row; limitations are retained as evidence qualifiers and separate consumer
follow-ups.

## 5. Evidence and change boundary

The reproducible evidence in this handoff is scoped to the following current
checkout boundaries:

| Boundary | Revision / state | Evidence scope |
| --- | --- | --- |
| Workspace root | Git `HEAD` `1cfa86553d7adb18179c6b3e1a33618a179b1414`; uncommitted worktree | Renderer capability documentation and the local verification commands listed in the audit. |
| `renderer-svg/` | Submodule `HEAD` `3b667804e88a51544c75df2f76b74184de128262`; uncommitted source/test/docs changes | Typed render errors, semantic projection API, escaping regressions, renderer tests/build. |
| Downstream consumer tests | Uncommitted changes in `playground/src/__tests__/examples.test.ts` and `remark-relgeo/test/remark-relgeo.test.mjs` | Current-example worker contract and preview-pipeline compatibility with explicit sheet selection. |
| External delivery/runtime | Not invoked | No npm/pub.dev publication, production deployment, registry install, Flutter/native host, or deferred external platform was used as a prerequisite. |

The renderer-scope uncommitted changes include `src/index.ts`, `src/types.ts`,
`src/primitives.ts`, `src/semantic.ts`, focused renderer tests/fixtures,
`renderer-svg/README.md`, and the capability-map documents linked below. The
root worktree also contains unrelated dirty paths in other packages and
capability surfaces; those paths are not claimed as renderer evidence and were
not staged or committed by this handoff.

## 6. Unresolved questions

1. Should the semantic projection API for `SVG-INTEG-004` be owned by
   `renderer-svg`, a shared parity package, or a workspace-level adapter?
2. What exact width/height, physical-unit, print, preserveAspectRatio, and
   typography contract is required across CLI, browser, and export surfaces?
3. Which error code and ownership contract should govern unknown sheets and
   missing views at renderer, core, and CLI boundaries?
4. When should the active v0.5 sheet fixture be promoted from legacy evidence
   to a cross-consumer contract?
5. Which canonical Node >=24/browser/public/Flutter runs are required before
   `partial-local` evidence can be upgraded?

## 7. Handoff

Implementation work remains separate from this validation artifact. The next
work must be tracked as goals/tasks using the backlog, not closed by editing
documentation:

- P0/P1: retain the passing sheet/view error, semantic projection, and
  security regressions; continue bounded typography/dimension/annotation
  evidence and active v0.5 sheet coverage where owners promote it;
- P1: add deterministic replay/comparator checks and rerun browser smoke when
  a host permits the preview server; the renderer-owned semantic projection API
  is implemented and cross-consumer comparison remains separate;
- verification: run canonical Node >=24, browser, registry/public, Flutter,
  and native/accessibility checks according to their owners;
- after implementation or evidence changes, repeat audit and reconciliation
  before changing any matrix status.

Current conclusion: the renderer baseline and gap map are validated for the
inspected discovery boundary, but the renderer surface is **not complete**,
**not fully verified**, and **not closed for implementation**.

## Source links

- [Expected capability catalog](./expected-capability-catalog.md)
- [Implementation audit](./implementation-audit.md)
- [Expected-versus-observed reconciliation](./reconciliation.md)
- [Capability matrix](./capability-matrix.md)
- [Implementation-gap backlog](./implementation-gap-backlog.md)
- [Repository map](../../REPOSITORY-MAP.md)
- [Maturation master plan](../../MATURATION-MASTER-PLAN.md)
- [Compatibility matrix](../../compatibility-matrix.json)
- [Fixture manifest](../../../fixtures/manifest.json)
