# Language Specification Implementation and Evidence Audit

**Tanggal audit:** 2026-10-30
**Baseline kontrak:** RelGeo DSL `0.5`
**Expected baseline:** [`language-specification/expected-capability-catalog.md`](./expected-capability-catalog.md)
**Normative owner:** `relgeo/spec`
**Evidence/orchestration owner:** `relgeo/workspace`

Published views: [reconciliation](./reconciliation.md),
[status matrix](./status-matrix.md), dan
[implementation-gap backlog](./implementation-gap-backlog.md).

## 1. Kesimpulan audit

Kontrak bahasa memiliki implementasi runtime yang luas pada parser, validator,
graph/evaluator, resolver, renderer, language-service, CLI, dan fixture runner.
Namun implementasi belum dapat disebut parity penuh terhadap expected catalog:

- **Implemented pada boundary yang diperiksa:** root structure, version gate,
  parse/validation dasar, dependency ordering, expression/reference runtime,
  object identity, geometry queries, placement tertentu, dan command surface.
- **Partial:** sebagian besar geometry/presentation/composition/collection,
  evaluator/unit policy, placement/anchor vocabulary, diagnostics coverage,
  metadata, serta cross-consumer parity. Source ada, tetapi coverage active
  fixture atau consumer tidak seluas kontrak spec.
- **Broken:** structured diagnostic contract belum konsisten karena sebagian
  jalur resolver masih melempar raw `Error`; SVG escaping untuk bidang
  dimension/annotation masih tercatat sebagai defect pada renderer boundary.
- **Absent:** machine-readable normative catalog tunggal yang dihasilkan dari
  spec tidak ditemukan. Ini menyebabkan parser, validator, language-service,
  dan renderer menyimpan vocabulary terpisah.
- **Deferred:** evaluator/unit fixture 16 tetap `capability`; full presentation
  parity, Flutter runtime/AT evidence, mobile delivery, dan release automation
  tidak dipromosikan oleh audit ini.
- **Unverified:** current canonical CI, registry/public deployment, fresh
  browser/Flutter/native-host evidence, serta beberapa combinations/edge cases.

Status implementation di bawah tidak sama dengan status verification. `partial`
berarti source/runtime ada tetapi expected surface belum lengkap atau belum
dipromosikan. `unverified` berarti evidence tidak cukup; bukan bukti bahwa
implementasi gagal.

## 2. Taxonomy status

| Status | Arti audit |
| --- | --- |
| `implemented` | Source/runtime tersedia dan boundary yang dinilai memiliki test atau fixture langsung. Tidak berarti seluruh consumer parity. |
| `partial` | Sebagian capability tersedia, tetapi subfeature, consumer, active fixture, atau contract coverage masih kurang. |
| `broken` | Mismatch/defect terkonfirmasi pada boundary yang diperiksa. |
| `absent` | Expected contract/implementation tidak ditemukan pada discovery boundary. |
| `deferred` | Sengaja belum dipromosikan atau bukan scope aktif berdasarkan decision/manifest. |
| `not applicable` | Di luar kontrak/scope line ini; tidak dihitung sebagai implementation gap. |
| `unverified` | Tidak ada evidence current yang cukup atau environment/host yang diperlukan tidak tersedia. |

Verification tier:

- `direct-local`: command dijalankan pada checkout ini;
- `source+tests`: source dan test yang relevan diperiksa, tetapi tidak semua
  suite dijalankan pada turn ini;
- `historical/local`: evidence tercatat pada audit/plan sebelumnya;
- `not verified`: current CI, registry, deployment, atau host runtime belum
  diverifikasi.

## 3. Discovery coverage report

| Discovery category | Source yang diperiksa | Coverage yang ditemukan | Batas evidence |
| --- | --- | --- | --- |
| Normative contract | `spec/id/README.md`, `spec/id/core/01–06`, `syntax/07–12`, `geometry/13–21`, `presentation/22–26`, `appendix/27-summary.md` | seluruh bab kontrak dan index source-of-truth | Markdown spec tidak memiliki catalog machine-readable tunggal; index label memiliki inkonsistensi informative/normative |
| Repository/ownership | `docs/MATURATION-MASTER-PLAN.md`, `docs/REPOSITORY-MAP.md` | boundary `spec → geometry → core → renderer/language-service/CLI → consumers`, compatibility line 0.5.x | root docs tidak membuktikan current child CI/deployment |
| Expected baseline | `docs/capability-map/language-specification/expected-capability-catalog.md` | 53 ID expected dipakai sebagai daftar audit | catalog ini bukan evidence implementasi |
| Parser-facing contract | `core/src/parser.ts`, `core/src/validator.ts`, `core/src/types.ts` | root sections, object types, modes, version, fields, validation | field vocabulary diduplikasi dari spec dan tidak generated |
| Runtime resolver | `core/src/graph.ts`, `evaluator.ts`, `units.ts`, `resolver/**` | dependency, expressions, units, anchors, primitives, operations, constraints, errors | coverage tersebar; beberapa raw `Error` dan expected combinations tanpa fixture khusus |
| Geometry runtime | `geometry/src/`, `geometry/src/__tests__/` | 2D primitives, curves, intersections, polygon/boolean library surface | library test tidak otomatis membuktikan DSL mapping |
| SVG serialization | `renderer-svg/src/index.ts`, `primitives.ts`, renderer tests | resolved scene, primitives, sheets, metadata, escaping checks | dimension/annotation escaping gap tercatat; browser insertion tidak diverifikasi |
| Language authoring intelligence | `language-service/src/service.ts`, `schema.ts`, `completions.ts`, `tokens.ts`, tests | diagnostics, schema, completion, semantic tokens, version enum | catalog consumer-side, bukan generated dari spec |
| CLI/menu/command | `cli/src/index.ts`, `cli/README.md`, `cli/docs/README.md` | `info`, `compile`, `check`/`validate`, JSON/SVG/graph, `--profile`, `--param`, `--unit`, `--sheet`, `-o` | current registry install/package smoke tidak dijalankan |
| Markdown surfaces | `remark-relgeo/src/index.ts`, `remark-relgeo-hl/src/index.ts`, package tests | preview/embed dan highlighting | bukan full semantic IDE; fallback/host evidence terpisah |
| Browser UI/workbench | `playground/docs/UX-UI-AUDIT-AND-PLAN.md`, `playground/src/`, `playground/src/__tests__/`, manifest surfaces | editor, preview, inspector, graph, layers, diagnostics, persistence/share/export | local unit/build evidence is current; browser E2E, public host, and real AT run are not verified |
| Website/routes | `relgeo.github.io/src/`, `docs/REPOSITORY-MAP.md`, master plan | `/docs/language-spec/`, docs shell, `/playground/`, Markdown rendering | local Astro check/build is current; Pages artifact/deployment is not verified |
| Desktop/agent consumer | `flutter/lib/`, `flutter/test/`, `mcp/`, `docs/plans/11-mcp-agent-integration.md` | workbench projection, semantic fixture boundary, session/agent contract assumptions | Flutter local tests pass; native/device runtime, MCP SDK/transport, and callable service evidence are not verified |
| Fixtures and expected outputs | `fixtures/manifest.json`, `fixtures/reference/`, `fixtures/expected/` | 20 fixtures: legacy, active, invalid, runtime-diagnostic, runtime-error, candidate | fixtures hanya membuktikan declared surfaces dan cases |
| Conformance runner | `scripts/run-conformance-fixtures.mjs`, `scripts/check-compatibility.mjs`, `scripts/audit-compatibility-behavior.mjs` | manifest policy, parser/version, snapshots, CLI/plugins/diagnostics | local built artifacts bukan fresh public/CI proof |
| Configuration and package boundary | `package.json`, `pnpm-workspace.yaml`, child `package.json`/`pubspec.yaml`, `tsconfig`/Vite/Astro/Playwright configs, `.gitmodules`, `.github/workflows/` | compatibility line, engine/toolchain declarations, workspace/package boundaries, build/test entrypoints, and CI wiring are discoverable | configuration proves declared boundary only; it does not prove that every configured workflow or external service ran |
| Platform services and host adapters | `playground/src/worker.ts`, `indexeddb-persistence.ts`, `clipboard.ts`, `share-code.ts`; website Astro routes/content loader; `flutter/lib/src/ui/` method-channel/window/menu/session files; `mcp/lib/src/contract/` and `mcp/tool/` | browser worker/storage/share, website language-spec routes, Flutter host lifecycle/menus/session bridge, and MCP contract/transport seams are mapped to language consumers | local unit/widget evidence is separate from browser/device, native host, transport, and public deployment evidence |
| Decision/scope | `docs/decisions/07-cross-repo-open-decisions.md`, plans 04/06/07/11 | boolean promotion, semantic SVG parity, Flutter/mobile posture, fixture status | decision history tidak memperluas active contract secara otomatis |

Discovery coverage mencakup source, test, UI/menu/command, shortcut/route,
config/platform service, runtime, fixture, dan docs. Tidak ada claim bahwa
setiap consumer/deployment variation telah dieksekusi.

## 4. Direct verification

Commands dijalankan dari root workspace pada 2026-10-30:

| Command | Result | Interpretation |
| --- | --- | --- |
| `pnpm conformance:fixtures` | **PASS — 260/260 across 20 fixtures** | Manifest, active/legacy/candidate/invalid/runtime diagnostics, JSON/SVG snapshots, language-service, plugins, dan CLI boundary lulus pada local built artifacts. |
| `pnpm --filter @relgeo/core test` | **PASS — 44 files, 427 tests** | Parser, validator, graph/evaluator, resolver, geometry, components, constraints, units, and error behavior suite lulus. |
| `pnpm --filter @relgeo/language-service test` | **PASS — 66 tests** | Schema, completion, diagnostics, tokens, and version policy consumer suite lulus. |
| `pnpm --filter @relgeo/cli test` | **PASS — 9 tests** | CLI command/output/diagnostic boundary suite lulus. |
| `pnpm --filter relgeo-playground test` | **PASS — 15 files, 93 tests** | Worker, editor/preview state, inspector/graph, persistence, clipboard/share, and UI helper contracts lulus locally. This is source/unit evidence, not current browser E2E or public-host evidence. |
| `pnpm --filter relgeo-docs-site check` | **PASS — 23 files, 0 errors, 0 warnings, 0 hints** | Astro route/content/config type-check covers the website language-spec route and docs shell locally; it is not a Pages deployment proof. |
| `pnpm --filter relgeo-playground build` | **PASS — Vite production build** | TypeScript and Vite production bundle generated locally; it is not a hosted artifact or browser-runtime proof. |
| `pnpm --filter relgeo-docs-site build` | **PASS — 138 static pages** | Astro generated the language-spec routes, docs routes, Playground route, and sitemap locally; it is not a deployed Pages proof. |
| `flutter test` (from `flutter/`) | **PASS — 302 tests** | Workbench, shared fixtures, resolver/evaluator, diagnostics, menus, lifecycle, viewport, SVG export, and accessibility semantics pass locally; golden-tag warnings are non-failing. This is local Flutter test evidence, not native device/runtime smoke evidence. |
| `dart test` / direct Dart SDK test (from `mcp/`) | **NOT VERIFIED — environment unavailable** | Wrapper attempted to update `/Users/agusmade/development/flutter/bin/cache/engine.stamp`; direct SDK retry could not resolve `lints` from `pub.dev` and also hit a denied telemetry metadata write. No MCP test conclusion is inferred from these environment failures. |

Semua command berbasis Node mengeluarkan warning bahwa checkout memakai Node
`22.23.2`, sementara root meminta Node `>=24`. Karena itu hasil Node di atas
adalah `direct-local`, bukan canonical release/CI evidence. Flutter test adalah
local Dart/Flutter evidence; MCP test tetap `not verified` karena environment
blocked. Evidence historis tambahan
yang dibaca dari audit sebelumnya: geometry `66/66`, renderer `79/79`,
remark-relgeo `5/5`, dan remark-relgeo-hl `3/3`; suite tersebut tidak dijadikan
hasil current turn.

## 5. Per-capability comparison

Kolom `Evidence` berisi path source/test/fixture yang menguatkan status. `Gap`
menjelaskan perbedaan antara expected capability dan realization yang diaudit.

### A. Authoring language dan document structure

| ID | Implementation status | Verification status | Evidence | Gap / finding |
| --- | --- | --- | --- | --- |
| `LANG-001` | `implemented` | `direct-local` | `spec/id/core/01-overview.md`; `core/src/parser.ts`; fixtures 10–20 | YAML/text authoring dan parse pipeline ada; grammar tetap tersebar di parser/schema, bukan generated. |
| `LANG-002` | `partial` | `direct-local` | `spec/id/core/04–05`; `core/src/graph.ts`, `resolver/index.ts`; core tests | Relation-first/deterministic runtime ada, tetapi full normative syntax dan negative no-solver boundary tidak punya satu conformance map. |
| `DOC-001` | `implemented` | `direct-local` | `spec/id/core/02-document-structure.md`; parser/validator; fixture 10 | Root sections dan minimal document diterima pada bounded parser contract; no generated section schema. |
| `DOC-002` | `implemented` | `direct-local` | `spec/id/core/03-scene.md`; `core/src/units.ts`; `unit_system.test.ts`, `sheet_view.test.ts` | Scene/unit/origin/orientation/autosize/padding tersedia; combinations viewport belum exhaustive. |
| `DOC-003` | `partial` | `source+tests` | `spec/id/editorial-guide.md`, spec READMEs, example fixtures | Readability/editorial guidance ada, tetapi index informative/normative labeling tidak konsisten. |

### B. Declarations, types, expressions, dan evaluation

| ID | Implementation status | Verification status | Evidence | Gap / finding |
| --- | --- | --- | --- | --- |
| `DECL-001` | `partial` | `direct-local` | `spec/id/syntax/08-parameters.md`; `core/src/evaluator.ts`, `structured_parameters.test.ts`, fixture 16 | Parameters/defaults/structured values ada; evaluator/unit fixture 16 tetap candidate dan belum active cross-consumer contract. |
| `DECL-002` | `implemented` | `direct-local` | `spec/id/syntax/09-constants.md`; `core/src/resolver/values.ts`, resolver tests | Constants scalar/structured/array dan ordering tersedia; exhaustive immutability/override negatives belum shared fixture. |
| `DECL-003` | `implemented` | `direct-local` | `spec/id/syntax/10-derived.md`; `evaluator.ts`, `derived_geo_access.test.ts` | Derived read-only, query references, and local scope tersedia; full circular/reference error inventory belum centralized. |
| `DECL-004` | `partial` | `source+tests` | `spec/id/syntax/11-profiles.md`; CLI `--profile`; core parser/evaluator | Profile path ada, tetapi active fixture/consumer coverage untuk profile override tidak lengkap. |
| `TYPE-001` | `partial` | `direct-local` | `spec/id/syntax/07-type-system.md`; `core/src/units.ts`, evaluator tests, fixture 16 | Scalar types/unit normalization tersedia; evaluator/unit promotion dan all coercion combinations belum active. |
| `TYPE-002` | `partial` | `direct-local` | type-system spec; `core/src/types.ts`, `eval-context.ts`, collection/anchor tests | Structured runtime types ada; path-ref/frame/bbox/collection behavior tidak seluruhnya dikunci active. |
| `EXPR-001` | `implemented` | `direct-local` | `spec/id/syntax/12-expressions.md`; `core/src/evaluator.ts`, evaluator tests | Arithmetic/precedence runtime lulus core suite; normative function coverage belum generated. |
| `EXPR-002` | `implemented` | `direct-local` | expressions spec; evaluator tests and parser validation | Comparison/logical/ternary subset ada; statement-level control flow correctly remains out of scope. |
| `EXPR-003` | `implemented` | `direct-local` | expressions/evaluation-order spec; `graph.ts`, `eval-context.ts`, reference tests | Symbol/property/index/anchor references resolve; some collection/query edge errors remain raw or uncatalogued. |
| `EVAL-001` | `implemented` | `direct-local` | `core/src/graph.ts`, `resolver/index.ts`, `group_cycles.test.ts`, conformance | Topological deterministic resolution and graph output exist; no single shared fixture covers every cycle category. |
| `EVAL-002` | `partial` | `direct-local` | `core/src/units.ts`, `units.test.ts`, CLI `--unit`, fixture 16 | Unit normalization exists; target-unit/evaluator behavior remains candidate for promotion. |

### C. Geometry, composition, placement, dan anchors

| ID | Implementation status | Verification status | Evidence | Gap / finding |
| --- | --- | --- | --- | --- |
| `OBJ-001` | `implemented` | `direct-local` | object-model spec; `core/src/parser.ts`, `resolver/objects.ts`, `types.ts`; fixture snapshots | Stable IDs/common dispatch/dependency edges exist; generated object schema is absent. |
| `GEO-001` | `partial` | `direct-local` | geometry spec; `resolver/primitives/point.ts`, `geometry.test.ts`, intersection tests | Point modes and intersections exist; full field/anchor/degenerate matrix is not active. |
| `GEO-002` | `partial` | `source+tests` | geometry spec; resolver primitives/geometry tests | Line modes/anchors exist; every tangent/direction error and consumer path not shared-conformance covered. |
| `GEO-003` | `partial` | `direct-local` | shape resolver, geometry tests, fixture 10/15 | Rect/circle/ellipse exist and are tested; all holes/placement/property combinations are not active. |
| `GEO-004` | `partial` | `source+tests` | `spec/id/geometry/14-geometry-objects.md`; shape/path resolver and tests | Curves/path/polygon/text are implemented in runtime; active expected snapshots cover only a subset. |
| `GEO-005` | `partial` | `source+tests` | path holes/fillet/initial-segment tests; geometry spec | Closed path, holes, joins, and corner processing exist; topology/degenerate behavior and cross-renderer parity remain incomplete. |
| `COMP-001` | `partial` | `source+tests` | group resolver, `group_anchors.test.ts`, `group_cycles.test.ts`, legacy fixtures 04/06 | Group hierarchy and transforms exist; active v0.5 coverage and all post-transform anchor combinations are limited. |
| `COMP-002` | `partial` | `source+tests` | clone resolver, legacy fixture 05, composition tests | Clone exists; active fixture and explicit clone metadata/identity contract are limited. |
| `COMP-003` | `partial` | `source+tests` | component resolver, `component.test.ts`, syntax 08–10 | Components/params/local derived/exports exist; active snapshots do not cover all export and nested-scope behavior. |
| `PLACE-001` | `partial` | `source+tests` | `spec/id/geometry/17-placement.md`; `smart_placement.test.ts`, resolver utils | Generic placement modes exist; full multi-anchor/inside/offset vocabulary lacks shared coverage. |
| `PLACE-002` | `implemented` | `direct-local` | placement spec; `point_on_path.test.ts`, anchor resolver, fixture examples | Point/anchor placement path exists and is tested in core boundary. |
| `PLACE-003` | `partial` | `source+tests` | placement spec; path resolver/query tests | `on.path` and parameterization exist; all path domains/tangent/error cases are not active. |
| `PLACE-004` | `implemented` | `source+tests` | `on.frame` spec; `frame_placement.test.ts`, `tangent_normal.test.ts` | Frame placement has focused tests; consumer/fixture parity remains limited. |
| `ANCH-001` | `partial` | `source+tests` | anchors spec; `resolver/anchors.ts`, group/custom-anchor tests | Named anchors and world access exist; spec vocabulary is broader than active fixture evidence. |

### D. Collections, queries, dan constraints

| ID | Implementation status | Verification status | Evidence | Gap / finding |
| --- | --- | --- | --- | --- |
| `COLL-001` | `partial` | `source+tests` | repeat resolver, `repeat_divide.test.ts`, `repeat_grid_revisi.test.ts` | Repeat modes exist; identity/along/polar/grid combinations not all active. |
| `COLL-002` | `partial` | `source+tests` | divide/split resolvers, `split.test.ts`, `repeat_divide.test.ts` | Divide/split exists; result shape/pick/collection contract lacks full shared fixture coverage. |
| `COLL-003` | `partial` | `direct-local` | operation resolver, fixture 15, runtime-error fixtures 19/20, decision records | Limited line intersection and rectangle intersect/subtract boundary is active; union/xor, broader operands, multipart/degenerate cases are not active. |
| `COLL-004` | `partial` | `direct-local` | `eval-context.ts`, `spec/id/geometry/19-collections.md`, evaluator tests | count/first/last/index access exists; empty/out-of-range raw error paths and ordering cases are not uniformly catalogued. |
| `QUERY-001` | `implemented` | `source+tests` | `spec/id/geometry/20-geometry-queries.md`, evaluator/query tests | Main scalar/bbox queries exist and are exercised; no exhaustive spec-function report. |
| `QUERY-002` | `partial` | `source+tests` | evaluator path functions, `point_on_path.test.ts`, `tangent_normal.test.ts`, intersection tests | Broad path/transform query surface exists; domain errors, precision policy, and every function's consumer parity are incomplete. |
| `CON-001` | `partial` | `source+tests` | `resolver/constraints.ts`, constraints tests, `spec/id/geometry/21-constraints.md` | Equal/parallel/perpendicular/tangent paths exist; active shared runtime diagnostic centers on align and does not cover all types equally. |
| `CON-002` | `partial` | `direct-local` | fixture 14, `constraints_diagnostics.test.ts`, `core/src/resolver/constraints.ts` | Structured violation for align is verified; full error-code/object/path coverage is incomplete. |

### E. Presentation and metadata

| ID | Implementation status | Verification status | Evidence | Gap / finding |
| --- | --- | --- | --- | --- |
| `PRES-001` | `partial` | `historical/local` | dimension spec; `resolver/primitives/dimension.ts`, `dimension_annotation.test.ts`, legacy fixtures | Dimension kinds exist, mostly exercised by v0.4 fixtures; active v0.5 presentation coverage is thin. |
| `PRES-002` | `partial` | `historical/local` | annotation spec; `resolver/primitives/annotation.ts`, dimension/annotation tests, renderer primitives | Annotation/leader exists; active cross-consumer and escaping coverage is incomplete. |
| `PRES-003` | `partial` | `source+tests` | roles spec; renderer primitives and role tests/fixtures | Role semantics/defaults exist; browser/Flutter presentation parity and all role combinations are not current evidence. |
| `PRES-004` | `partial` | `source+tests` | views/sheets spec; `sheet_view.test.ts`, validator, CLI `--sheet`, legacy fixtures | Views/sheets resolve/render; active v0.5 and current host evidence are incomplete. |
| `META-001` | `partial` | `direct-local` | metadata spec; resolver object metadata, renderer, fixture 10/legacy presentation fixtures | Metadata exists and is intended non-geometric; complete field/consumer behavior and security boundary are not uniform. |
| `META-002` | `partial` | `direct-local` | `resolver/inherit.ts`, `inherit_resolution.test.ts`, language schema/completions, legacy fixture 07 | Presets/inherit and `styles` alias exist; alias provenance and all merge/error cases are not generated/active. |

### F. Diagnostics, error model, serialization, and compatibility

| ID | Implementation status | Verification status | Evidence | Gap / finding |
| --- | --- | --- | --- | --- |
| `DIAG-001` | `partial` | `direct-local` | error-model spec; parser/validator/resolver errors; fixtures 11–14, 17–20 | Main parse/validation/runtime diagnostics exist; not every normative phase/code has fixture and consumer parity. |
| `DIAG-002` | `broken` | `direct-local` | `core/src/resolver/eval-context.ts`, `resolver/objects.ts`, `primitives/divide.ts`, error-model spec | Several paths still throw raw `Error` while expected model requires structured code/path/phase; confirmed contract inconsistency. |
| `ERR-001` | `partial` | `direct-local` | evaluation/error-model specs; tolerant/validation mode tests; fixture 14/19/20 | Error phases and tolerant vs compile modes exist; full fail-safe and code coverage across consumers is incomplete. |
| `SER-001` | `partial` | `direct-local` | CLI `compile` JSON path; expected JSON snapshots; `run-conformance-fixtures.mjs` | JSON serialization exists and snapshots are reviewable, but canonical field ordering/number/error serialization is not a normative generated contract. |
| `SER-002` | `broken` | `direct-local` | renderer `index.ts`/`primitives.ts`, SVG snapshots/security checks, legacy sheet XML fixture | SVG output exists and no-executable-markup checks pass for declared fixtures; dimension/annotation escaping defect remains recorded, so full safe serialization contract is broken. |
| `VER-001` | `implemented` | `direct-local` | parser version constants/handling; language-service schema; fixtures 17/18; manifest | Explicit version, omitted default, and unsupported version rejection are implemented and conformance-tested. |
| `VER-002` | `implemented` | `direct-local` | `fixtures/manifest.json`, parser tests, compatibility checker, fixtures 01–09/17–18 | Active 0.5, legacy 0.4, regression-only 0.1–0.3, future rejection are represented; policy is duplicated across consumers. |
| `VER-003` | `partial` | `source+tests` | `metaPresets`/`styles` in parser/resolver/schema/completions and metadata spec | Backward alias/fallback exists; provenance and semantic parity of every alias are not centrally checked. |
| `VER-004` | `implemented` | `direct-local` | manifest status policy; conformance runner; 20 fixture entries | active, supported-legacy, invalid, runtime-diagnostic, runtime-error, capability statuses are machine-readable and enforced. |

## 6. Explicit status register beyond per-ID rows

| Classification | Audit finding | Evidence/decision |
| --- | --- | --- |
| `absent` | Single generated machine-readable normative language catalog | No generated catalog found in `spec/`, `docs/`, or package source; parser/schema/completion sets remain separate. |
| `broken` | Structured error payload parity | Raw `Error` paths remain in resolver/evaluator context despite normative structured error model. |
| `broken` | Full SVG safe serialization boundary | Existing renderer audit records dimension/annotation escaping gap; current fixture checks do not cover every presentation field. |
| `deferred` | Evaluator/unit active contract promotion | Fixture 16 is `capability`; passing snapshot/conformance does not promote it. |
| `deferred` | Flutter mobile delivery and native runtime/accessibility evidence | Decision 07 explicitly defers Android/iOS; desktop runtime smoke and AT remain separate evidence. |
| `unverified` | Current canonical CI, registry, public Pages, current browser/Flutter/MCP runtime | Local evidence is not promoted to external/canonical evidence. |
| `not applicable` | 3D, animation/timeline, statement-level scripting/control flow, general constraint solver | Explicitly excluded by `spec/id/appendix/27-summary.md` and core semantic guarantees. |

## 7. Consumer assumptions and product wiring

These are assumptions observed at consumer boundaries, not new language source
of truth:

| Consumer | UI/menu/command/route assumption | Audit result |
| --- | --- | --- |
| CLI | `info`, `compile`, `check`/`validate`; JSON/SVG/graph; profile/param/unit/sheet flags | Implemented and locally tested; registry/package and Node 24 verification unverified. |
| Language-service/editor | root completion, type/object schema, version enum, diagnostics, semantic tokens | Implemented local suite; schema vocabulary is manually maintained and can drift from spec. |
| Markdown | fenced source → preview SVG and syntax highlighting | Implemented in package tests and fixture runner; not a full resolve/diagnostics UI. |
| Playground | editor → worker resolve → preview, inspector, graph, diagnostics, persistence/share/export | Source and 93 local tests cover the workflow; current browser E2E/Pages run remains not verified. |
| Website | `/docs/language-spec/` presents spec; `/playground/` hosts authoring surface | Astro check passes locally; website is presentation/deployment layer, not normative owner; current built/public artifact remains not verified. |
| Flutter | workbench menus/editor/viewport/inspector/diagnostics and semantic fixture projection | 302 local tests pass; non-publishable desktop/web scope, fixture 15 active limited boundary, fixture 16 candidate; native host/device runtime evidence remains not verified. |
| MCP/agent | typed session/resource/tool bridge, no filesystem-write ownership in language contract | Contract/bridge planning exists; SDK/transport/production callable runtime not verified. |

## 8. Findings and next actions

1. Keep the 53-row expected catalog immutable while creating downstream audit
   views; do not let current implementation shrink expected scope.
2. Add a generated or checked vocabulary boundary from `spec/id/` to parser,
   validator, language-service schema/completions, and renderer field sets.
3. Normalize raw resolver/evaluator errors into the structured error model and
   add shared fixtures per normative error-code table.
4. Fix and regression-test dimension/annotation escaping before claiming safe
   SVG serialization parity.
5. Decide whether `SER-001` JSON shape and `SER-002` SVG semantic fields are
   normative language contracts or consumer output contracts; record the
   decision before changing `PENDING-AUDIT`/partial status.
6. Expand active fixtures for profiles, evaluator/units, composition exports,
   placement/anchors, collections, all constraint kinds, views/sheets, and
   presentation roles; preserve fixture 16 as candidate until promotion review.
7. Re-run the relevant gates on Node `>=24`, current child pointers, canonical
   CI, public registry/Pages, and available Flutter/browser hosts before
   converting local evidence into release claims.

## 9. Source register

Required evidence reviewed:

- [`docs/MATURATION-MASTER-PLAN.md`](../../MATURATION-MASTER-PLAN.md)
- [`docs/REPOSITORY-MAP.md`](../../REPOSITORY-MAP.md)
- [`docs/decisions/07-cross-repo-open-decisions.md`](../../decisions/07-cross-repo-open-decisions.md)
- [`spec/`](../../../spec)
- [`fixtures/manifest.json`](../../../fixtures/manifest.json)
- [`fixtures/reference/`](../../../fixtures/reference)
- [`scripts/run-conformance-fixtures.mjs`](../../../scripts/run-conformance-fixtures.mjs)
- [`scripts/check-compatibility.mjs`](../../../scripts/check-compatibility.mjs)
- [`package.json`](../../../package.json), [`pnpm-workspace.yaml`](../../../pnpm-workspace.yaml), child package/toolchain manifests, and `.github/workflows/`
- [`playground/src/worker.ts`](../../../playground/src/worker.ts), [`playground/src/indexeddb-persistence.ts`](../../../playground/src/indexeddb-persistence.ts), [`playground/src/clipboard.ts`](../../../playground/src/clipboard.ts), [`playground/src/share-code.ts`](../../../playground/src/share-code.ts)
- [`relgeo.github.io/src/pages/[lang]/docs/language-spec/`](../../relgeo.github.io/src/pages/%5Blang%5D/docs/language-spec/), [`flutter/lib/src/mcp/workbench_agent_bridge.dart`](../../../flutter/lib/src/mcp/workbench_agent_bridge.dart), and [`mcp/lib/src/contract/`](../../../mcp/lib/src/contract)
- package/source/test boundaries listed in §3

Existing surface audits were used as observational evidence after the expected
catalog was created; they were not used to define the expected capability list.
