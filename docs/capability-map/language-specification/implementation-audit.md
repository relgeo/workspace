# Language Specification Implementation and Evidence Audit

**Tanggal audit:** 2026-11-07
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
Namun implementasi lokal belum dapat disebut canonical host parity terhadap
expected catalog:

- **Implemented pada boundary yang diperiksa:** root structure, version gate,
  parse/validation dasar, dependency ordering, expression/reference runtime,
  object identity, geometry queries, placement tertentu, dan command surface.
- **Implemented pada boundary lokal:** seluruh 53 expected capability rows kini
  memiliki source, focused test, dan active/shared fixture evidence pada
  boundary yang diperiksa. Cross-host parity dan canonical CI tetap merupakan
  evidence boundary terpisah.
- **Broken:** tidak ada lagi pada audited Core/language-service/CLI/Markdown/
  renderer public boundaries; Node 24, CI, Flutter/MCP, dan native-host tetap
  merupakan evidence boundary terpisah.
- **Outside the frozen capability boundary:** generated machine-readable
  catalog tooling is not a separate language capability; `spec/id/` remains the
  normative source and the checked workspace catalog is its audit projection.
- **Unverified externally:** canonical Node-24/CI/host evidence for the active
  evaluator/unit fixture, Flutter runtime/AT evidence, mobile delivery, and
  release automation tidak dipromosikan oleh audit ini.
- **Unverified:** current canonical CI, registry/public deployment, fresh
  browser/Flutter/native-host evidence, serta beberapa combinations/edge cases.

Status implementation di bawah tidak sama dengan status verification eksternal.
`implemented` berarti kontrak memiliki source, focused regression, fixture, dan
local consumer evidence pada boundary audit; `unverified` berarti
host/canonical evidence belum tersedia, bukan bukti bahwa implementasi gagal.

## 1.1 Audit refresh for the bounded active selection

The current checkout was rechecked against the selected backlog rows and the
new presentation fixture. This checkpoint ran locally on Node `22.23.2` with
pnpm `10.33.3`, although the repository declares Node `>=24`; they are direct
local source evidence only, not canonical CI or host-parity claims.

| Check | Result | Evidence interpretation |
| --- | --- | --- |
| Renderer package test invocation | `110 passed` across `7` files | Dimension/annotation rendering, semantic projection/replay errors, the v0.5 escaping fixture, and SVG security coverage execute locally. |
| Core package test invocation | `579 passed` across `51` files | Resolver, validation-mode, tolerant-mode, structured-type, coercion, dimension/annotation, structured-error, and constraint diagnostics suites execute locally, including repeat/sheet boundary path regressions. |
| Language-service package test invocation | `91 passed` across `2` files | Schema, completions, tokens, diagnostics, and geometry-operation vocabulary behavior execute locally; the checked projection covers the v0.5 object-operation surface. |
| CLI package test/build | `40 passed`; build evidence remains local | CLI compile/render/error paths execute locally; this does not establish a published-package or external-host claim. |
| Markdown consumer tests | `16 passed` for `remark-relgeo`; `10` source tests plus `1` package-boundary test for `remark-relgeo-hl` | Markdown preview and syntax-highlighting consumers execute locally, including safe fallback behavior; current browser/site host evidence remains separate. |
| Local package builds | Core, renderer, language-service, CLI, and Markdown consumers passed | TypeScript/tsup artifacts build from the modified sources locally; canonical CI remains unverified. |
| Root conformance runner | `677 passed, 0 failed across 33 fixtures` | Manifest, active/legacy/invalid/runtime/capability fixture policy, core/renderer/CLI/language-service/Markdown integration all pass locally. Fixtures 16, 24, 30, 31, 32, and 33 are active; fixture 29 covers invalid structured types, fixture 30 covers metadata inherit/alias propagation, and fixture 33 covers presentation/metadata/serialization. |
| Flutter spec snapshot | `35` Markdown files and manifest digest match; drift test passes | The bundled Flutter snapshot is synchronized from `spec/id`; this proves generated-asset consistency, not Flutter host/runtime or MCP evidence. |
| CI workflow inspection | Node `24` and pnpm-based compatibility/integration jobs are declared | `.github/workflows/integration.yml` and `sync-validated-submodule-after-ci.yml` provide available CI definitions, but no remote CI run was executed or independently verified in this audit. |

The new active fixture and regression evidence promote the eight
presentation/metadata/serialization rows to implemented on the audited local
boundary. Host and canonical-CI limitations remain explicit below:

- `GAP-001` is locally closed as `✔️` for the bounded v0.5 vocabulary surface:
  the deterministic check covers spec sections, scalar/structured types,
  aliases, document status labels, all 26 object types, and the six geometry
  operation field sets across the Core parser and language-service schema /
  completions. Broader renderer presentation-field generation and external
  consumer parity remain separate residual boundaries.
- `GAP-009` is locally closed as `✔️`: fixture 33 covers all dimension kinds,
  basic/leader/target annotations, hostile text/metadata, and CLI/Markdown
  conformance; renderer security and semantic projection tests pass.
- `GAP-011` is locally closed as `✔️`: the raw production inventory for the
  audited boundaries is clean, repeat/sheet boundary paths are regression
  covered, and Core/LS/CLI/Markdown/conformance mapping passes. Node 24,
  canonical CI, Flutter/MCP, and native-host evidence remains not verified.
- `GAP-013` is locally closed as `✔️`: fixture 33 and renderer semantic/security
  checks prove safe projection and escaped hostile values, with CLI/Markdown
  consumer conformance passing. Browser/native-host parity remains separate.

No npm/pub.dev publishing, production deployment, public host, or deferred
native/mobile platform was used as an audit prerequisite.

## 1.2 Current implementation refresh — GAP-011

**Refresh date:** 2026-11-06. The core implementation now preserves an existing
structured boundary error when `resolveGeometry()` returns from validation or
another typed phase, including errors raised by per-object resolver helpers.
Previously, resolver catches could re-wrap a `ValidationError` or another
structured error as `ResolveError`, changing the public phase from its original
value. The change is in `core/src/evaluator.ts`, `core/src/resolver/index.ts`,
`core/src/resolver/primitives/utils.ts`, and `core/src/resolver/values.ts`, with
regression coverage in `core/src/__tests__/diagnostics.test.ts` and
`core/src/__tests__/structured_errors.test.ts`.

The evaluator boundary now also preserves compatible structured `Error`
instances supplied by callbacks, and `INVALID_COLLECTION_ACCESS` is classified
as a runtime diagnostic rather than a generic resolve diagnostic. These cases
are covered in `core/src/__tests__/diagnostics.test.ts`.

The divide and clone resolver helpers now emit structured `ResolveError`
instances with field-level paths for invalid counts and missing targets; these
boundaries are covered in `core/src/__tests__/structured_errors.test.ts`.

Repeat helper validation now follows the same structured boundary for target,
spacing, and count failures, while already-structured evaluator errors remain
untouched.

Collection access and component export failures from the resolver evaluation
context now preserve their runtime/resolve phase, object identity, and object
path instead of relying on evaluator fallback normalization.

Current local evidence for this refresh:

- core: `579 passed`, including the structured phase/path assertions;
  `pnpm --filter @relgeo/core lint` passes;
- CLI: `40 passed`;
- language-service: `91 passed`.

This is a real producer-boundary fix, not a status-only documentation change.
The 2026-11-06 follow-up removes the remaining raw `Error` constructor in the
repeat producer, attaches indexed paths to sheet expression failures, and
types Markdown configuration failures. `GAP-011` is locally closed; external
Node-24/CI/Flutter/MCP/native-host evidence remains a separate limitation, not
an implementation blocker. Node `22.23.2` versus the repository's Node `>=24`
requirement remains a local-evidence limitation.

## 1.3 Current implementation refresh — GAP-002

**Refresh date:** 2026-11-06. The core validator now checks profile overrides
against the declared parameter surface before evaluation. An undeclared profile
key is rejected as `UNKNOWN_FIELD`, and a value incompatible with a typed
parameter reuses the default-value contract and is rejected as
`TYPE_MISMATCH`. This follows the normative rule that profiles may override
parameters only; constants and styling are not profile surfaces. The change is
in `core/src/validator.ts`, with v0.5 regression coverage in
`core/src/__tests__/parameter_type_validation.test.ts`.

The focused core run passes `572` tests across `50` files, including valid
length/angle profile overrides, incompatible typed overrides, undeclared or
constant-backed profile keys, and malformed override maps. Existing shorthand
profile resolution and unknown-profile rejection remain covered by
`core/src/__tests__/resolver.test.ts`. The shared fixture-16 contract is now
promoted to `active` for the bounded v0.5 surface after Core, CLI,
language-service, renderer, conformance, and targeted Flutter semantic evidence
passed locally. Node-24/canonical CI and native-host verification remain
separate evidence boundaries. No compatibility-line or normative spec change
was made.

## 1.4 Audit contract dan retained-gap rule

Audit ini memiliki satu row untuk setiap ID pada expected catalog. Setiap row
wajib memuat implementation classification, verification tier, source/spec path
atau section, concrete evidence, dan gap/finding. `implemented` hanya berarti
boundary yang diperiksa memiliki source/runtime dan evidence langsung; itu tidak
menutup subfeature, consumer parity, atau environment-unavailable evidence.

Dokumentasi normatif saja tidak dapat mengubah `partial`, `broken`, `deferred`,
atau `unverified` menjadi `implemented`. Gap tetap dipertahankan bila test,
fixture, consumer, host, atau promotion evidence belum memenuhi kontraknya.
Pemeriksaan deterministiknya adalah `pnpm run language-spec:audit:check`; command
ini memvalidasi one-to-one coverage terhadap expected catalog dan reconciliation,
source path/section, evidence, serta non-empty classification gap.

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
| Normative contract | `spec/id/**/*.md` (35 documents), including `spec/id/README.md`, `core/01–07`, `syntax/07–12`, `geometry/13–21`, `presentation/22–26`, and `appendix/27-summary.md` | seluruh bab kontrak, closure contracts, editorial/index, dan appendix source-of-truth | Markdown spec tidak memiliki catalog machine-readable tunggal; index label memiliki inkonsistensi informative/normative |
| Repository/ownership | `docs/MATURATION-MASTER-PLAN.md`, `docs/REPOSITORY-MAP.md` | boundary `spec → geometry → core → renderer/language-service/CLI → consumers`, compatibility line 0.5.x | root docs tidak membuktikan current child CI/deployment |
| Expected baseline | `docs/capability-map/language-specification/expected-capability-catalog.md` | 53 ID expected dipakai sebagai daftar audit | catalog ini bukan evidence implementasi |
| Parser-facing contract | `core/src/parser.ts`, `core/src/validator.ts`, `core/src/types.ts` | root sections, object types, modes, version, fields, validation | field vocabulary diduplikasi dari spec dan tidak generated |
| Runtime resolver | `core/src/graph.ts`, `evaluator.ts`, `units.ts`, `resolver/**` | dependency, expressions, units, anchors, primitives, operations, constraints, errors | public error boundaries are structured; some edge combinations still need dedicated fixtures |
| Geometry runtime | `geometry/src/`, `geometry/src/__tests__/` | 2D primitives, curves, intersections, polygon/boolean library surface | library test tidak otomatis membuktikan DSL mapping |
| SVG serialization | `renderer-svg/src/index.ts`, `primitives.ts`, renderer tests | resolved scene, primitives, sheets, metadata, escaping checks | dimension/annotation escaping gap tercatat; browser insertion tidak diverifikasi |
| Language authoring intelligence | `language-service/src/service.ts`, `schema.ts`, `completions.ts`, `tokens.ts`, tests | diagnostics, schema, completion, semantic tokens, version enum | catalog consumer-side, bukan generated dari spec |
| CLI/menu/command | `cli/src/index.ts`, `cli/README.md`, `cli/docs/README.md` | `info`, `compile`, `check`/`validate`, JSON/SVG/graph, `--profile`, `--param`, `--unit`, `--sheet`, `-o` | current registry install/package smoke tidak dijalankan |
| Markdown surfaces | `remark-relgeo/src/index.ts`, `remark-relgeo-hl/src/index.ts`, package tests | preview/embed dan highlighting | bukan full semantic IDE; fallback/host evidence terpisah |
| Browser UI/workbench | `playground/docs/UX-UI-AUDIT-AND-PLAN.md`, `playground/src/`, `playground/src/__tests__/`, manifest surfaces | editor, preview, inspector, graph, layers, diagnostics, persistence/share/export | local unit/build evidence is current; browser E2E, public host, and real AT run are not verified |
| Website/routes | `relgeo.github.io/src/`, `docs/REPOSITORY-MAP.md`, master plan | `/docs/language-spec/`, docs shell, `/playground/`, Markdown rendering | local Astro check/build is current; Pages artifact/deployment is not verified |
| Desktop/agent consumer | `flutter/lib/`, `flutter/test/`, `mcp/`, `docs/plans/11-mcp-agent-integration.md` | workbench projection, semantic fixture boundary, session/agent contract assumptions | Flutter CI and MCP local loopback/tool tests pass at their recorded pointers; target-device runtime, packaged MCP/client interoperability, and semantic service integration remain not verified |
| Fixtures and expected outputs | `fixtures/manifest.json`, `fixtures/reference/`, `fixtures/expected/` | 20 fixtures: legacy, active, invalid, runtime-diagnostic, runtime-error, candidate | fixtures hanya membuktikan declared surfaces dan cases |
| Conformance runner | `scripts/run-conformance-fixtures.mjs`, `scripts/check-compatibility.mjs`, `scripts/audit-compatibility-behavior.mjs` | manifest policy, parser/version, snapshots, CLI/plugins/diagnostics | local built artifacts bukan fresh public/CI proof |
| Configuration and package boundary | `package.json`, `pnpm-workspace.yaml`, child `package.json`/`pubspec.yaml`, `tsconfig`/Vite/Astro/Playwright configs, `.gitmodules`, `.github/workflows/` | compatibility line, engine/toolchain declarations, workspace/package boundaries, build/test entrypoints, and CI wiring are discoverable | configuration proves declared boundary only; it does not prove that every configured workflow or external service ran |
| Platform services and host adapters | `playground/src/worker.ts`, `indexeddb-persistence.ts`, `clipboard.ts`, `share-code.ts`; website Astro routes/content loader; `flutter/lib/src/ui/` method-channel/window/menu/session files; `mcp/lib/src/contract/` and `mcp/tool/` | browser worker/storage/share, website language-spec routes, Flutter host lifecycle/menus/session bridge, and MCP contract/transport seams are mapped to language consumers | local unit/widget evidence is separate from browser/device, native host, transport, and public deployment evidence |
| Decision/scope | `docs/decisions/07-cross-repo-open-decisions.md`, plans 04/06/07/11 | boolean promotion, semantic SVG parity, Flutter/mobile posture, fixture status | decision history tidak memperluas active contract secara otomatis |

Discovery coverage mencakup source, test, UI/menu/command, shortcut/route,
config/platform service, runtime, fixture, dan docs. Tidak ada claim bahwa
setiap consumer/deployment variation telah dieksekusi.

## 4. Historical direct verification baseline (2026-10-30)

The following commands were the original audit baseline. The current refresh is
recorded in sections 1.2–1.3 and in the current coverage handoff; these
historical counts are retained for traceability and are not the current claim.

| Command | Result | Interpretation |
| --- | --- | --- |
| `pnpm conformance:fixtures` | **PASS — 677/677 across 33 fixtures** | Manifest, active/legacy/candidate/invalid/runtime diagnostics, JSON/SVG snapshots, language-service, plugins, and CLI boundary pass on local built artifacts. Fixture 30 covers nested metadata inherit and alias propagation; fixture 31 covers geometry/composition/placement/query closure. |
| `pnpm --filter @relgeo/core test` | **PASS — 44 files, 427 tests** | Parser, validator, graph/evaluator, resolver, geometry, components, constraints, units, and error behavior suite lulus. |
| `pnpm --filter @relgeo/language-service test` | **PASS — 66 tests** | Schema, completion, diagnostics, tokens, and version policy consumer suite lulus. |
| `pnpm --filter @relgeo/cli test` | **PASS — 9 tests** | CLI command/output/diagnostic boundary suite lulus. |
| `pnpm --filter relgeo-playground test` | **PASS — 15 files, 93 tests** | Worker, editor/preview state, inspector/graph, persistence, clipboard/share, and UI helper contracts lulus locally. This is source/unit evidence, not current browser E2E or public-host evidence. |
| `pnpm --filter relgeo-docs-site check` | **PASS — 23 files, 0 errors, 0 warnings, 0 hints** | Astro route/content/config type-check covers the website language-spec route and docs shell locally; it is not a Pages deployment proof. |
| `pnpm --filter relgeo-playground build` | **PASS — Vite production build** | TypeScript and Vite production bundle generated locally; it is not a hosted artifact or browser-runtime proof. |
| `pnpm --filter relgeo-docs-site build` | **PASS — 138 static pages** | Astro generated the language-spec routes, docs routes, Playground route, and sitemap locally; it is not a deployed Pages proof. |
| `flutter test` (from `flutter/`) | **PASS — 327 tests** | Workbench, shared fixtures, resolver/evaluator, diagnostics, menus, lifecycle, viewport, SVG export, and accessibility semantics pass locally; golden-tag warnings are non-failing. This is local Flutter test evidence, not native device/runtime smoke evidence. |
| `dart test` / direct Dart SDK test (from `mcp/`) | **PASS — direct Dart SDK runner; Flutter wrapper remains unavailable** | The direct SDK command passed all MCP tests. The Flutter wrapper separately attempted to update the external SDK cache and is environment-unavailable; no transport/host claim is inferred. |

Semua command berbasis Node mengeluarkan warning bahwa checkout memakai Node
`22.23.2`, sementara root meminta Node `>=24`. Karena itu hasil Node di atas
adalah `direct-local`, bukan canonical release/CI evidence. Flutter wrapper
runtime remains environment-unavailable; the direct MCP Dart result is current
local protocol evidence. Historical counts are retained as provenance only;
current counts are recorded in sections 1.1 and the coverage handoff.

## 5. Per-capability comparison

Kolom `Evidence` berisi path source/test/fixture yang menguatkan status. `Gap`
menjelaskan perbedaan antara expected capability dan realization yang diaudit.

### A. Authoring language dan document structure

| ID | Implementation status | Verification status | Evidence | Gap / finding |
| --- | --- | --- | --- | --- |
| `LANG-001` | `implemented` | `direct-local` | `spec/id/core/01-overview.md`; `core/src/parser.ts`; fixtures 10–20 | YAML/text authoring dan parse pipeline ada; grammar tetap tersebar di parser/schema, bukan generated. |
| `LANG-002` | `implemented` | `direct-local` | `spec/id/core/04–05`; checked vocabulary/coercion catalog; `core/src/graph.ts`, `core/src/evaluator.ts`; graph/evaluator tests | Relation-first deterministic runtime and checked vocabulary/coercion boundary are covered locally; host/CI parity remains separate. |
| `DOC-001` | `implemented` | `direct-local` | `spec/id/core/02-document-structure.md`; parser/validator; fixture 10 | Root sections dan minimal document diterima pada bounded parser contract; no generated section schema. |
| `DOC-002` | `implemented` | `direct-local` | `spec/id/core/03-scene.md`; `core/src/units.ts`; `unit_system.test.ts`, `sheet_view.test.ts` | Scene/unit/origin/orientation/autosize/padding tersedia; combinations viewport belum exhaustive. |
| `DOC-003` | `implemented` | `direct-local` | `spec/id/editorial-guide.md`, spec READMEs, `scripts/check-language-spec-vocabulary.mjs` | Status labels and the rule that informative examples cannot extend DSL vocabulary are checked by the vocabulary test/check; examples remain informative by contract. |

### B. Declarations, types, expressions, dan evaluation

| ID | Implementation status | Verification status | Evidence | Gap / finding |
| --- | --- | --- | --- | --- |
| `DECL-001` | `implemented` | `direct-local` | `spec/id/syntax/08-parameters.md`; `core/src/evaluator.ts`, `core/src/resolver/values.ts`, `structured_parameters.test.ts`, CLI tests, Flutter shared conformance, active fixture 16 | Typed defaults, structured values, profile overrides, target-unit evaluation, and derived placement are active and locally cross-consumer verified; canonical Node-24/CI/native-host evidence remains separate. |
| `DECL-002` | `implemented` | `direct-local` | `spec/id/syntax/09-constants.md`; `core/src/resolver/values.ts`, resolver tests | Constants scalar/structured/array dan ordering tersedia; exhaustive immutability/override negatives belum shared fixture. |
| `DECL-003` | `implemented` | `direct-local` | `spec/id/syntax/10-derived.md`; `evaluator.ts`, `derived_geo_access.test.ts` | Derived read-only, query references, and local scope tersedia; full circular/reference error inventory belum centralized. |
| `DECL-004` | `implemented` | `direct-local` | `spec/id/syntax/11-profiles.md`; `core/src/validator.ts`, profile validator/resolver tests, CLI profile tests, fixture 28, active fixture 16 | Profile-only overrides are validated and exercised; constants, structure, unknown keys, and incompatible values retain stable negative boundaries. |
| `TYPE-001` | `implemented` | `direct-local` | `spec/id/syntax/07-type-system.md`; checked coercion catalog; `core/src/validator.ts`, `core/src/evaluator.ts`, evaluator and parameter tests | v0.5 numeric boundary covers contextual length addition, scalar multiplication/division, and structured `TYPE_MISMATCH` rejection for length² and number÷length. |
| `TYPE-002` | `implemented` | `direct-local` | `spec/id/syntax/07-type-system.md`; checked structured catalog; `core/src/validator.ts`, parameter test, fixture 29 | frame2d, bbox2d, collection, and path-ref shapes have explicit validation and a shared negative conformance fixture; query-host parity remains separate. |
| `EXPR-001` | `implemented` | `direct-local` | `spec/id/syntax/12-expressions.md`; `core/src/evaluator.ts`, evaluator tests | Arithmetic/precedence runtime lulus core suite; normative function coverage belum generated. |
| `EXPR-002` | `implemented` | `direct-local` | `spec/id/syntax/12-expressions.md`; evaluator tests and parser validation | Comparison/logical/ternary subset ada; statement-level control flow correctly remains out of scope. |
| `EXPR-003` | `implemented` | `direct-local` | `spec/id/syntax/12-expressions.md`, `spec/id/core/04-evaluation-order.md`; `graph.ts`, `eval-context.ts`, reference tests | Symbol/property/index/anchor references resolve; some collection/query edge combinations still need dedicated fixture inventory. |
| `EVAL-001` | `implemented` | `direct-local` | `spec/id/core/04-evaluation-order.md`; `core/src/graph.ts`, `resolver/index.ts`, `group_cycles.test.ts`, conformance | Topological deterministic resolution and graph output exist; no single shared fixture covers every cycle category. |
| `EVAL-002` | `implemented` | `direct-local` | `spec/id/core/03-scene.md`, `spec/id/syntax/07-type-system.md`; `core/src/units.ts`, evaluator/unit tests, CLI `--unit`, active fixture 16, Flutter shared conformance | Unit normalization, target-unit evaluation, and derived geometry are deterministic on the bounded v0.5 fixture; canonical Node-24/CI/native-host evidence remains separate. |

### C. Geometry, composition, placement, dan anchors

| ID | Implementation status | Verification status | Evidence | Gap / finding |
| --- | --- | --- | --- | --- |
| `OBJ-001` | `implemented` | `direct-local` | `spec/id/geometry/13-object-model.md` and `15-composition-objects.md`; `core/src/parser.ts`, `resolver/objects.ts`, `types.ts`; language-service schema/completions; vocabulary drift regression | Stable IDs/common dispatch/dependency edges exist; all 26 v0.5 object types, including six geometry operations, are checked across the parser and language-service consumer projections. |
| `GEO-001` | `implemented` | `direct-local` | `spec/id/geometry/14-geometry-objects.md`; fixture 31, point/intersection tests, polar/cartesian move validation | Active fixture 31 covers absolute/relative point construction and typed path/intersection projections; deterministic negative boundaries remain in Core tests. |
| `GEO-002` | `implemented` | `source+tests` | `spec/id/geometry/14-geometry-objects.md`; fixture 31, line/tangent tests, non-positive length regression | Fixture 31 covers from-to and direction-length modes; structured invalid-length and tangent diagnostics remain directly tested. |
| `GEO-003` | `implemented` | `source+tests` | `spec/id/geometry/14-geometry-objects.md`; fixture 31, shape resolver, degeneracy/hole/placement tests | Fixture 31 covers rect/circle/ellipse dimensions, placement, anchors, and holes with resolved JSON/SVG semantic snapshots. |
| `GEO-004` | `implemented` | `source+tests` | `spec/id/geometry/14-geometry-objects.md`; fixture 31 arc/quadratic/cubic/path/polygon/text, resolver tests | Every supported v0.5 curve/path/text kind has active shared projection evidence; unsupported variants remain covered by explicit validator boundaries. |
| `GEO-005` | `implemented` | `source+tests` | `spec/id/geometry/14-geometry-objects.md`; fixture 31 closed path/hole, path holes/fillet/closure tests | Closed path closure and hole topology are active in the shared semantic snapshot without implicit repair. |
| `COMP-001` | `implemented` | `source+tests` | `spec/id/geometry/15-composition-objects.md`; fixture 31 group transform, group/nested-anchor tests, renderer/CLI snapshots | Active group fixture preserves hierarchy and deterministic world projection after transform. |
| `COMP-002` | `implemented` | `source+tests` | `spec/id/geometry/15-composition-objects.md`; fixture 31 clone, `clone_contract.test.ts`, metadata and composition tests | Active clone snapshot plus Core regression proves identity, inherited geometry, metadata, and transformed projection. |
| `COMP-003` | `implemented` | `source+tests` | `spec/id/geometry/15-composition-objects.md`, `spec/id/syntax/08-parameters.md`–`10-derived.md`; fixture 31 component, `component.test.ts` | Active component fixture covers scoped parameter/export projection; nested private-member blocking and dependency-order regressions remain directly tested. |
| `PLACE-001` | `implemented` | `source+tests` | `spec/id/geometry/17-placement.md`; fixture 31 topLeft/inside/custom-anchor modes, `smart_placement.test.ts`, structured negative tests | Shared placement fixture covers generic placement and inside margin while Core tests retain unsupported-combination diagnostics. |
| `PLACE-002` | `implemented` | `direct-local` | `spec/id/geometry/17-placement.md`; `point_on_path.test.ts`, anchor resolver, fixture examples | Point/anchor placement path exists and is tested in core boundary. |
| `PLACE-003` | `implemented` | `source+tests` | `spec/id/geometry/17-placement.md`; fixture 31 `on.path`, `frame_placement.test.ts`, namespace-specific unknown-anchor/field regressions | Active path placement snapshot proves deterministic t-domain and explicit-anchor behavior; domain/unknown-field negatives remain stable. |
| `PLACE-004` | `implemented` | `source+tests` | `spec/id/geometry/17-placement.md`; `frame_placement.test.ts`, `tangent_normal.test.ts` | Frame placement has focused tests; consumer/fixture parity remains limited. |
| `ANCH-001` | `implemented` | `source+tests` | `spec/id/geometry/18-anchors.md`; fixture 31 custom anchor/world access, `resolver/anchors.ts`, group/custom-anchor and structured-error tests | Active anchor projection proves typed named-anchor access before/after transform; missing-anchor diagnostics retain stable paths. |

### D. Collections, queries, dan constraints

| ID | Implementation status | Verification status | Evidence | Gap / finding |
| --- | --- | --- | --- | --- |
| `COLL-001` | `implemented` | `source+tests+fixture` | `spec/id/geometry/16-collection-objects.md`; fixtures 24 and 32, `semantic_contract_fixtures.test.ts`, `repeat_divide.test.ts`, `repeat_grid_revisi.test.ts` | Linear/grid repeat context, deterministic child identity/order, and collection projections are asserted in the active fixture and Core regression suite. |
| `COLL-002` | `implemented` | `source+tests+fixture` | `spec/id/geometry/16-collection-objects.md`; fixture 32, `split.test.ts`, `repeat_divide.test.ts`, structured-error regressions | Divide and split collection/path result shapes, pick behavior, stable IDs, first/last/index access, and invalid count/split boundaries are asserted. |
| `COLL-003` | `implemented` | `source+tests+fixture` | `spec/id/geometry/16-collection-objects.md`; fixtures 15, 19, 20, 24, and 32, boolean tests, decision records | The approved v0.5 union/xor/intersect/subtract boundary is covered by active snapshots and explicit empty/multipart runtime errors; unsupported topology remains bounded by the decision. |
| `COLL-004` | `implemented` | `source+tests+fixture` | `eval-context.ts`, `spec/id/geometry/19-collections.md`; fixture 32, evaluator tests, `repeat_divide.test.ts`, structured-error regressions | Stable ordering, count/first/last/index, empty behavior, structured index failures, and no implicit mutation are asserted across the shared fixture and Core suite. |
| `QUERY-001` | `implemented` | `source+tests` | `spec/id/geometry/20-geometry-queries.md`, evaluator/query tests | Main scalar/bbox queries exist and are exercised; no exhaustive spec-function report. |
| `QUERY-002` | `implemented` | `source+tests` | `spec/id/geometry/20-geometry-queries.md`; fixture 31 `pointAt`/`tangentAt`/`toWorld`, evaluator/path/frame/intersection tests | Active query fixture provides typed deterministic path/transform values; domain and tolerance negatives remain directly covered. |
| `CON-001` | `implemented` | `source+tests+fixture` | `spec/id/geometry/21-constraints.md`; fixture 32, `validator.ts`, `resolver/constraints.ts`, `constraints_diagnostics.test.ts`, geometry/constraint tests | Equal/parallel/perpendicular/tangent valid and degenerate paths plus structural unknown-reference guards are asserted in one active relation matrix without solver mutation. |
| `CON-002` | `implemented` | `source+tests+fixture` | `spec/id/geometry/21-constraints.md`, `spec/id/core/06-error-model.md`; fixtures 14 and 32, `constraints_diagnostics.test.ts`, `semantic_contract_fixtures.test.ts`, `resolver/constraints.ts` | Violation payloads retain type/path/involved objects/expected/actual fields, deterministic order, and unchanged resolved geometry; conformance covers the active consumer path. |

### E. Presentation and metadata

| ID | Implementation status | Verification status | Evidence | Gap / finding |
| --- | --- | --- | --- | --- |
| `PRES-001` | `implemented` | `source+tests+fixture` | `spec/id/presentation/22-dimension.md`; `resolver/primitives/dimension.ts`, `dimension_annotation.test.ts`, fixture 33, renderer security/semantic tests, conformance runner | Linear/radius/diameter/angle kinds, labels, roles, placement, and safe projection are covered by active v0.5 evidence. |
| `PRES-002` | `implemented` | `source+tests+fixture` | `spec/id/presentation/23-annotation.md`; `resolver/primitives/annotation.ts`, fixture 33, renderer security tests, CLI/Markdown conformance | Basic, leader, target fallback, hostile text, and dynamic attributes are covered without executable markup. |
| `PRES-003` | `implemented` | `source+tests+fixture` | `spec/id/presentation/24-drawing-roles.md`; fixture 33 role set, renderer role tests, semantic SVG projection | Role identity, visibility/defaults, and role metadata are preserved in the active resolved/rendered boundary. |
| `PRES-004` | `implemented` | `source+tests+fixture` | `spec/id/presentation/25-views-sheets.md`; `sheet_view.test.ts`, fixture 33, validator, CLI and semantic renderer conformance | Active v0.5 view scale/filter and portrait sheet topLeft/center placement are covered without model mutation. |
| `META-001` | `implemented` | `source+tests+fixture` | `spec/id/presentation/26-metadata.md`; fixture 33, metadata invariance Core regression, renderer semantic/security tests | Document/object metadata is carried safely and geometry remains invariant when metadata is removed. |
| `META-002` | `implemented` | `source+tests+fixture` | `spec/id/presentation/26-metadata.md`; `resolver/inherit.ts`, `inherit_resolution.test.ts`, schema/completions, fixtures 30 and 33 | Ordered `metaPresets`/`styles` alias chains and local override precedence are active and deterministic. |

### F. Diagnostics, error model, serialization, and compatibility

| ID | Implementation status | Verification status | Evidence | Gap / finding |
| --- | --- | --- | --- | --- |
| `DIAG-001` | `implemented` | `direct-local` | `spec/id/core/06-error-model.md`; parser/validator/resolver errors; fixtures 11–14, 17–20; Core 579, language-service 91, CLI 40, Markdown 18, and conformance 677/677 across 33 fixtures | Parse, validate, resolve, runtime, and constraint diagnostics now have deterministic phase/code/severity/message mapping with stable path/range projection across the audited consumers. Node 24/CI/Flutter/MCP/native-host evidence remains not verified. |
| `DIAG-002` | `implemented` | `direct-local` | `spec/id/core/06-error-model.md`, `spec/id/core/07-closure-contracts.md`; `core/src/errors.ts`, `core/src/resolver/index.ts`, `core/src/resolver/primitives/repeat.ts`, `language-service/src/service.ts`, `cli/src/index.ts`, `remark-relgeo/src/index.ts`; raw-throw inventory; Core tests 579, CLI tests 40, language-service tests 91, Markdown tests 18 | All audited public boundaries normalize unknown failures; repeat non-finite lengths and sheet expressions retain stable code/phase/path/object context, Markdown configuration failures are typed, and no raw `Error` constructor remains in audited production sources. Node 24/CI/Flutter/MCP/native-host evidence remains not verified. |
| `ERR-001` | `implemented` | `direct-local` | `spec/id/core/04-evaluation-order.md`, `spec/id/core/06-error-model.md`; tolerant/validation mode tests; fixtures 14/19/20; CLI, language-service, and Markdown fail-safe tests | Editor/tolerant recovery remains bounded, validate/compile are strict, runtime compile failures do not emit output, and consumer adapters preserve structured diagnostics. Host preview/native evidence remains not verified. |
| `SER-001` | `implemented` | `source+tests+fixture` | `spec/id/core/05-semantic-guarantees.md`, `spec/id/core/07-closure-contracts.md`; Core serializer/replay tests, fixture 33 expected JSON, CLI/conformance | Canonical resolved-scene JSON preserves identity/order, finite numbers, metadata/views/sheets, and deterministic replay on the active boundary. |
| `SER-002` | `implemented` | `source+tests+fixture` | `spec/id/presentation/22-dimension.md`–`26-metadata.md`; renderer semantic/security tests, fixture 33, SVG snapshot, CLI/Markdown conformance | Safe semantic SVG preserves geometry/roles/placement and escapes hostile values; raw SVG byte equality remains out of contract. |
| `VER-001` | `implemented` | `direct-local` | `spec/id/core/02-document-structure.md`; parser version constants/handling; language-service schema; fixtures 17/18; manifest | Explicit version, omitted default, and unsupported version rejection are implemented and conformance-tested. |
| `VER-002` | `implemented` | `direct-local` | `spec/id/core/02-document-structure.md`; `fixtures/manifest.json`, parser tests, compatibility checker, fixtures 01–09/17–18 | Active 0.5, legacy 0.4, regression-only 0.1–0.3, future rejection are represented; policy is duplicated across consumers. |
| `VER-003` | `implemented` | `source+tests` | `spec/id/presentation/26-metadata.md`; checked alias catalog; resolver/schema/completion sources and semantic-equivalence regression | `styles`/`style` and `metaPresets`/`metaPreset` aliases retain bounded semantics and are compared against canonical metadata in the focused core test; downstream host parity remains separate. |
| `VER-004` | `implemented` | `direct-local` | `spec/id/core/07-closure-contracts.md`; manifest status policy; conformance runner; 20 fixture entries | active, supported-legacy, invalid, runtime-diagnostic, runtime-error, capability statuses are machine-readable and enforced. |

## 6. Explicit status register beyond per-ID rows

| Classification | Audit finding | Evidence/decision |
| --- | --- | --- |
| `local-green` | All 53 frozen capability rows | Source, focused regression, fixture/conformance, and consumer evidence are present on the audited local boundary; status matrix is `53 ✔️ · 0 🌗 · 0 ❌ · 0 ➖ · 0 ⏸️ · 0 ⚠️`. |
| `external-follow-up` | Generated catalog tooling and broader consumer/host parity | `spec/id/` remains normative; checked catalogs are audit projections. Node 24/CI, browser/native-host, Flutter wrapper, MCP transport, and publication evidence remain separate. |
| `broken` | Audited local public boundaries | None remains in Core, language-service, CLI, Markdown, or renderer public boundaries after the current regression tranche. |
| `partial` | Frozen local capability rows | None; any future partial status must be backed by a new audit finding rather than inferred from unavailable hosts. |
| `deferred` | Evaluator/unit active contract promotion | Fixture 16 is active on the bounded local contract; canonical Node-24/CI/host promotion remains a separate evidence boundary. |
| `deferred` | Flutter mobile delivery and native runtime/accessibility evidence | Decision 07 explicitly defers Android/iOS; desktop runtime smoke and AT remain separate evidence. |
| `unverified` | Current canonical CI, registry, public Pages, current browser/Flutter/MCP runtime | Local evidence is not promoted to external/canonical evidence. |
| `not applicable` | 3D, animation/timeline, statement-level scripting/control flow, general constraint solver | Explicitly excluded by `spec/id/appendix/27-summary.md` and core semantic guarantees. |

## 7. Consumer assumptions and product wiring

These are assumptions observed at consumer boundaries, not new language source
of truth:

| Consumer | UI/menu/command/route assumption | Audit result |
| --- | --- | --- |
| CLI | `info`, `compile`, `check`/`validate`; JSON/SVG/graph; profile/param/unit/sheet flags | Implemented and locally tested; registry/package and Node 24 verification unverified. |
| Language-service/editor | root completion, type/object schema, version enum, diagnostics, semantic tokens | Implemented local suite; the checked v0.5 object-operation projection catches schema/completion drift, while renderer presentation-field generation remains separate. |
| Markdown | fenced source → preview SVG and syntax highlighting | Implemented in package tests and fixture runner; not a full resolve/diagnostics UI. |
| Playground | editor → worker resolve → preview, inspector, graph, diagnostics, persistence/share/export | Source and 108 local tests cover the workflow; current browser E2E/Pages run remains not verified. |
| Website | `/docs/language-spec/` presents spec; `/playground/` hosts authoring surface | Astro check passes locally; website is presentation/deployment layer, not normative owner; current built/public artifact remains not verified. |
| Flutter | workbench menus/editor/viewport/inspector/diagnostics and semantic fixture projection | Spec snapshot and local semantic evidence are current; Flutter wrapper/runtime is environment-unavailable because the SDK cache is outside the writable workspace, and native host/device evidence remains not verified. |
| MCP/agent | typed session/resource/tool bridge, no filesystem-write ownership in language contract | Direct Dart SDK protocol/session/spec-index tests pass; MCP transport/production callable runtime remains not verified. |

## 8. Findings and next actions

1. Keep the 53-row expected catalog immutable while creating downstream audit
   views; do not let current implementation shrink expected scope.
2. Preserve the checked vocabulary boundary from `spec/id/` through parser and
   language-service schema/completions, and keep the workspace catalog as a
   checked projection rather than a competing normative source.
3. Preserve the structured resolver/evaluator boundary and add shared fixtures
   for any new normative error-code or consumer mapping cases.
4. Keep fixture 16 and fixture 33 as regression anchors for profiles,
   evaluator/units, presentation, metadata, and serialization changes.
5. Re-run the relevant gates on Node `>=24`, canonical CI, and available
   Flutter/browser/MCP hosts before converting local evidence into release or
   host-parity claims.

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
- [`relgeo.github.io/src/pages/[lang]/docs/language-spec/`](../../../relgeo.github.io/src/pages/%5Blang%5D/docs/language-spec/), [`flutter/lib/src/mcp/workbench_agent_bridge.dart`](../../../flutter/lib/src/mcp/workbench_agent_bridge.dart), and [`mcp/lib/src/contract/`](../../../mcp/lib/src/contract)
- package/source/test boundaries listed in §3

Existing surface audits were used as observational evidence after the expected
catalog was created; they were not used to define the expected capability list.
