# Renderer-SVG coverage validation and handoff

**Tanggal:** 2026-11-05
**Status:** focused validation checkpoint selesai; local target evidence ready for validation
**Boundary:** `relgeo/renderer-svg` pada compatibility line RelGeo DSL `0.5.x`

## Current verification refresh — 2026-11-05

The following checks were rerun against the current uncommitted worktree after
the renderer-local implementation and consumer-map changes. They are evidence
for behavior and consumer boundaries; raw SVG byte equality is not used as a
cross-host parity contract.

| Command | Result | Evidence boundary |
| --- | --- | --- |
| `pnpm --filter @relgeo/renderer-svg build && pnpm --filter @relgeo/renderer-svg test -- --run && node scripts/run-renderer-semantic-replay.mjs` | PASS target command — build, renderer tests, and 4 separate-process replay fixtures; current run recorded below | Renderer package, security/escaping, semantic projection/replay, and built export boundary |
| `pnpm run conformance:fixtures` | PASS — 345 checks across 24 fixtures | Workspace fixture manifest, diagnostics, security, semantic serialization, CLI, Markdown, preview, and canonical fixture consumers |
| `pnpm --filter @relgeo/cli test -- --run` | PASS — 38 tests | CLI render, sheet/view selection, diagnostics, and error consumer boundary |
| `pnpm --filter @relgeo/remark-relgeo test` | PASS — 16 tests | Markdown preview, safe-SVG data URI, diagnostics, and renderer consumer boundary |
| `pnpm --filter @relgeo/remark-relgeo-hl test` | PASS — 10 Vitest tests plus package-boundary test | Highlighting consumer boundary |
| `pnpm --filter relgeo-playground test` | PASS — 17 files, 107 tests | Worker, preview, options, selection, safe SVG, and DOM-boundary unit coverage |
| `pnpm --dir relgeo.github.io test` | PASS — docs-site built-output and content-integrity assertions | Website generated routes, locale parity, frontmatter, and internal-link boundary |
| `pnpm --filter @relgeo/cli build` | PASS | CLI build boundary |
| `pnpm --filter @relgeo/remark-relgeo build` | PASS | Markdown preview build boundary |
| `pnpm --filter @relgeo/remark-relgeo-hl build` | PASS | Highlighting build boundary |
| `pnpm --filter relgeo-playground build` | PASS | Playground production build; Vite emitted a non-failing chunk-size warning |
| `pnpm --dir relgeo.github.io build` | PASS — 138 pages | Website build boundary |
| `pnpm --filter @relgeo/remark-relgeo lint && pnpm --filter @relgeo/remark-relgeo-hl lint && pnpm --dir relgeo.github.io check` | PASS — 0 Astro errors/warnings/hints | Changed consumer static checks |
| `pnpm run integration:gate -- --local` | NOT VERIFIED — gate requires Node `>=24`, local runtime is `22.23.2` | Consumer integration gate was not executed; this is an environment limitation, not target parity failure evidence |
| `pnpm run verify:baseline` / `pnpm run verify:baseline:strict` | NOT GREEN — each reports 14 baseline failures | Existing manifest/gitlink and version drift plus intentionally dirty renderer worktree; not a renderer behavior failure |

Environment: Node `22.23.2`, pnpm `10.33.3`, workspace root HEAD
`73040b83ebb16f9da8e30a08053697751ed18c09`, renderer submodule HEAD
`8cd2e06c5a8de5a85918ef82fc2aa3291f1ad493`. All passing package commands are
`verified-local`; the repository engine warning is retained as a qualifier.
Browser E2E, canonical Node, public registry artifacts, native/Flutter, and
cross-host parity remain separate unverified/deferred boundaries.

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
| Tests/fixtures | Renderer tests, core/CLI/Playground/remark tests, fixture reference/expected/manifest, conformance runner | Current refresh: renderer 102/102, Playground 107/107, CLI 38/38, remark 16/16 + 10/10, conformance 298/298 across 23 fixtures. Historical counts remain only in dated audit sections. |
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

No expected row remains `🌗`, `❌`, or `⚠️` at the current renderer boundary.
The resolved sheet/error, semantic, and security rows remain historical backlog
evidence rather than active unimplemented work; `➖` and `⏸️` boundaries remain
outside the implementation selection. If a future audit discovers a new
expected gap, it must add one explicit ID and one corresponding backlog task
rather than silently reusing a closed row.

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
| Workspace root | Git `HEAD` `73040b83ebb16f9da8e30a08053697751ed18c09`; uncommitted worktree | Renderer and consumer capability documentation plus the local verification commands listed above. |
| `renderer-svg/` | Submodule `HEAD` `8cd2e06c5a8de5a85918ef82fc2aa3291f1ad493`; uncommitted source/test changes | Typed render errors, semantic projection API, escaping regressions, renderer tests/build, and replay comparator. |
| Downstream consumer boundaries | CLI `8f57709fd56a43eaef27e5b1320a5af713f67125`; remark-relgeo `50866756c4b50adac64a2acdb4692300aa7871be`; remark-relgeo-hl `6d109a96a265f64b8934e13e4d9e1e1ae1e8b028`; Playground `fad88630f2fcac77e78045e78550e3b05c3ef5db`; website `c5ca17f06476fd2beeb4a48e971265a0e57495c7` | Consumer tests/builds and capability-map alignment were checked at these local revisions. |
| External delivery/runtime | Not invoked | No npm/pub.dev publication, production deployment, registry install, Flutter/native host, or deferred external platform was used as a prerequisite. |

The renderer-scope changes include `src/types.ts`, `src/primitives.ts`,
`src/semantic.ts`, `src/utils.ts`, focused renderer tests, the semantic replay
script at `scripts/run-renderer-semantic-replay.mjs`, and the capability-map
documents linked below. The root worktree also contains unrelated dirty paths in other packages and
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

- Closure: retain the passing sheet/view error, semantic projection, security,
  sizing, and safe-preview regressions; all 33 expected renderer rows are
  closed at the observed implementation boundary;
- P1: retain the deterministic replay/comparator checks and rerun browser smoke
  when a host permits the preview server; the renderer-owned semantic projection
  API and local cross-process comparator are implemented, while cross-consumer
  comparison remains separate;
- verification: run canonical Node >=24, browser, registry/public, Flutter,
  and native/accessibility checks according to their owners;
- after implementation or evidence changes, repeat audit and reconciliation
  before changing any matrix status.

Current conclusion: renderer package behavior, semantic replay, canonical
fixture conformance, and changed consumer checks are passing locally. All 33
expected renderer capabilities and shared renderer mappings are `✔️` at the
observed boundary. Node `>=24`, browser, canonical CI/public, native/Flutter,
and cross-host checks remain explicitly `not verified` evidence qualifiers,
not implementation failures.

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
