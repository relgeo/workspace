# Audit implementasi RelGeo spec

> **Audit coverage statement — 2026-10-29.** This evidence log inspects
> normative spec chapters and the mapped core, geometry, renderer, language
> service, CLI, Markdown, Playground, website, Flutter, fixture, and
> cross-repository boundaries. It records contract/source/test/workflow
> evidence, not an exhaustive claim over every consumer or deployment; current
> CI/canonical, platform, and public checks remain `not verified` where stated.
> See [inventory protocol](../../INVENTORY-PROTOCOL.md); a missing finding is not
> evidence of absence.

Status dokumen: audit target, 2026-10-29  
Surface: `spec/` dan consumer non-MCP yang membaca atau mengeksekusi kontrak DSL  
Compatibility line: RelGeo DSL `0.5.x`  
Owner kontrak: `relgeo/spec`  
Owner orkestrasi evidence: `relgeo/workspace`

Dokumen ini adalah evidence log untuk [spec capability matrix](./spec-capability-matrix-2026-10-29.md). Ia bukan kontrak baru. Makna bahasa tetap bersumber dari `spec/id/`; source code, fixture, dan roadmap hanya membuktikan atau membatasi implementasi consumer.

## Scope, owner, dan batas verifikasi

| Area audit | Owner/source of truth | Source path | Boundary yang diperiksa | Batas verifikasi |
| --- | --- | --- | --- | --- |
| Kontrak normatif | `relgeo/spec` | `spec/id/` | struktur dokumen, syntax, semantic guarantees, error model, geometry, presentation | Markdown spec tidak menyediakan catalog machine-readable tunggal; coverage per capability masih perlu disimpulkan dari consumer/fixture |
| Orkestrasi evidence | `relgeo/workspace` | `docs/REPOSITORY-MAP.md`, `fixtures/manifest.json`, `scripts/run-conformance-fixtures.mjs` | owner fixture, compatibility line, cross-surface fixture runner | runner memakai artefak `dist/`; tidak membuktikan semua source branch atau deployment terbaru |
| Runtime core | `relgeo/core` | `core/src/parser.ts`, `core/src/validator.ts`, `core/src/resolver/` | parse, validation, resolve, version policy, diagnostics | verifikasi lokal berjalan pada Node `22.23.2`, sementara root meminta Node `>=24`; test lulus tetapi toolchain canonical belum direproduksi pada turn ini |
| Geometry | `relgeo/geometry` | `geometry/src/` | matematika 2D, vector, curves, intersections, polygon operations | unit tests package tidak dengan sendirinya membuktikan seluruh mapping DSL ke geometry runtime |
| SVG renderer | `relgeo/renderer-svg` | `renderer-svg/src/index.ts`, `renderer-svg/src/primitives.ts` | resolved scene ke SVG, escaping, sheets/annotations | tidak membuktikan semua kombinasi presentation spec atau browser rendering |
| Language service | `relgeo/language-service` | `language-service/src/service.ts`, `schema.ts`, `completions.ts`, `tokens.ts` | diagnostics, completion, schema, semantic tokens | vocabulary dan schema adalah consumer-side data; parity otomatis dengan setiap bab spec belum tersedia |
| CLI | `relgeo/cli` | `cli/src/index.ts` | `info`, `compile`, `check/validate`, JSON/SVG/graph output | CLI test tidak membuktikan packaging/install dari registry pada audit ini |
| Markdown plugins | `relgeo/remark-relgeo`, `relgeo/remark-relgeo-hl` | `remark-relgeo/src/index.ts`, `remark-relgeo-hl/src/index.ts` | preview SVG dan source highlighting | plugin surface sengaja lebih kecil dari seluruh DSL; tidak menjadi source of truth |
| Playground | `relgeo/playground` | `playground/src/`, `playground/e2e/` | editor → compile → preview/diagnostic | tidak direrun pada audit ini; historical/local/public evidence tetap diberi label historical atau not verified |
| Website | `relgeo/relgeo.github.io` | `relgeo.github.io/src/`, `relgeo.github.io/docs/` | publikasi docs/spec dan embedding Playground | deployment/public browser tidak diverifikasi ulang pada turn ini |
| Flutter | `relgeo/flutter` | `flutter/lib/`, `flutter/test/`, `docs/flutter-capability-matrix.json` | non-Node consumer, semantic projection, SVG export | tidak direrun pada audit ini; CI evidence pada docs bersifat historical; candidate evaluator/unit belum dipromosikan |
| Cross-repository gate | `relgeo/workspace` | `docs/plans/01-cross-repo-integration-gate.md`, `scripts/run-conformance-fixtures.mjs`, `docs/integration-baseline.json` | fixture ownership, package order, child repository orchestration | current CI/remote run bukan hasil fresh dari audit ini; hanya local conformance runner yang diverifikasi langsung |

## Temuan implementasi aktual

### Kontrak normatif

`spec/id/README.md` menetapkan `RelGeo DSL v0.5` sebagai spec aktif, mengarahkan urutan baca `core → syntax → geometry → presentation → appendix`, dan menyatakan bahwa `id/` adalah source of truth. Bab `core`, `syntax`, `geometry`, dan `presentation` yang mendefinisikan behavior diberi label `Normative`; README folder hanya berstatus `Informative Index`.

Kontrak yang benar-benar teridentifikasi dari source spec:

- root document dan section opsional `scene`, `parameters`, `constants`, `derived`, `profiles`, `metaPresets`, `styles`, `components`, `objects`, `constraints`, `meta`, `sheets`, dan `views` (`spec/id/core/02-document-structure.md:5-73`);
- evaluation order deterministik dan dependency graph, termasuk `CIRCULAR_DEPENDENCY`, post-resolve constraints, dan annotation stage (`spec/id/core/04-evaluation-order.md:5-49`);
- semantic guarantees berupa deterministic resolution, stable identity, dependency ordering, explicit relations, unit/numerical semantics, serta batas bahwa RelGeo bukan general constraint solver (`spec/id/core/05-semantic-guarantees.md:5-52`);
- structured error model dengan code dan document path, hard validation/resolution errors, serta runtime constraint diagnostics (`spec/id/core/06-error-model.md:5-124`);
- typed values, parameters, constants, derived values, profiles, expressions, geometry references, dan coercion (`spec/id/syntax/07-type-system.md:5-368`, `08-parameters.md`, `09-constants.md`, `10-derived.md`, `11-profiles.md`, `12-expressions.md`);
- geometry objects, composition/operation objects, collections, placement, anchors, queries, dan constraints (`spec/id/geometry/13-object-model.md` sampai `21-constraints.md`);
- dimension, annotation, drawing roles, views/sheets, dan metadata sebagai presentation layer (`spec/id/presentation/22-dimension.md` sampai `26-metadata.md`).

### Consumer evidence

| Surface | Evidence aktual | Status audit | Batas klaim |
| --- | --- | --- | --- |
| `core` | parser menormalkan/default version, menolak unknown top-level field/object type, memanggil validator; `compileRelGeo` menjalankan parse → validate → resolve; validator memeriksa constraints dan views/sheets (`core/src/parser.ts:144-267`, `core/src/resolver/index.ts:22-46`, `core/src/validator.ts:110-129`, `1392-1665`) | tersedia dan teruji | tidak berarti seluruh bab spec sudah punya fixture khusus |
| `geometry` | package exported sebagai dependency core; tests package lulus `66/66` | tersedia dan teruji | matematika library bukan bukti parser/DSL exposure untuk setiap primitive |
| `renderer-svg` | `SVGRenderer`/`renderToSVG` dan primitive dimension/annotation tersedia (`renderer-svg/src/index.ts:14-20,352-358`, `primitives.ts:36-537`) | tersedia dan teruji | SVG output tidak membuktikan visual parity browser |
| `language-service` | service menyediakan diagnostics, semantic tokens, completion; vocabulary/schema exported (`language-service/src/service.ts:124-207,285-553`, `language-service/src/index.ts:1-4`) | tersedia dan teruji | schema/token catalog diduplikasi dari source spec, belum generated |
| `cli` | command `info`, `compile`, `check`/`validate`; format JSON/SVG/graph dan diagnostic code/path (`cli/src/index.ts:113-243`) | tersedia dan teruji | tidak ada command MCP; tidak termasuk scope spec runtime |
| Markdown preview | `remarkRelgeo` mengompilasi source lalu merender SVG data URI (`remark-relgeo/src/index.ts:76-108`), test `5/5` lulus | tersedia dan teruji | preview adalah presentation consumer, bukan full authoring IDE |
| Markdown highlighting | `remarkRelgeoHl` memakai `RelGeoLanguageService.getSemanticTokens` (`remark-relgeo-hl/src/index.ts:21-55`), test `3/3` lulus | tersedia dan teruji | highlighting tidak memvalidasi semantic resolution |
| Playground/website | manifest active fixture mencantumkan keduanya; historical docs menyebut browser/Pages smoke | sebagian; not verified fresh | current deployment/runtime tidak diverifikasi pada turn ini |
| Flutter | shared fixture manifest mencantumkan Flutter untuk boolean/evaluator candidates; historical compatibility matrix/CI evidence ada | sebagian; candidate boundary tetap ditahan | no fresh Flutter run; evaluator/unit fixture 16 tetap `capability` |

## Direct verification recorded in this audit

Commands were run from the workspace root. All results below are scoped to the command, not a universal release claim.

| Command | Result | Evidence meaning |
| --- | --- | --- |
| `pnpm --filter @relgeo/core test` | PASS — 44 files, 427 tests | core parser/validator/resolver test suite executes |
| `pnpm --filter @relgeo/geometry test` | PASS — 4 files, 66 tests | geometry package tests execute |
| `pnpm --filter @relgeo/language-service test` | PASS — 1 file, 66 tests | diagnostics/completion/token/schema consumer tests execute |
| `pnpm --filter @relgeo/renderer-svg test` | PASS — 6 files, 79 tests | SVG renderer tests execute |
| `pnpm --filter @relgeo/cli test` | PASS — 1 file, 9 tests | CLI consumer tests execute |
| `pnpm --filter @relgeo/remark-relgeo test` | PASS — 5 tests | preview plugin tests execute |
| `pnpm --filter @relgeo/remark-relgeo-hl test` | PASS — 1 file, 3 tests | highlighting plugin tests execute |
| `pnpm conformance:fixtures` | PASS — 260/260 across 20 fixtures | active, invalid, runtime-diagnostic, runtime-error, plugin, CLI, SVG and candidate fixture boundaries execute from built artifacts |

The shell emitted an engine warning because the checkout runs Node `22.23.2` while root metadata requires `>=24`. No test failed because of it. Node-version canonicality, Flutter SDK execution, browser deployment, and remote CI are therefore `not verified` by this audit.

## Material gaps and dependencies

1. The normative contract is Markdown-only. Parser field sets, validator anchors, language-service schema/completions, and renderer support are maintained in separate code catalogs. A generated or checked machine-readable vocabulary is not present in the audited paths.
2. Fixture conformance is strong for the 20-entry baseline, but a passing fixture is evidence for declared surfaces only; it is not an exhaustive proof of every normative object, expression, error code, or presentation combination.
3. `v05-evaluator-units-candidate` remains `capability` in `fixtures/manifest.json`; its snapshot and local conformance pass do not promote it to active contract. The dependency for promotion is an explicit cross-consumer decision and parity evidence, especially Flutter.
4. The spec index labels are editorially inconsistent: `spec/id/*/README.md` says `Informative Index`, while the listed chapters say `Normative` and `spec/id/README.md` says the tree is the active contract. This is a confirmed documentation problem, not an implementation failure.
5. Presentation is documented as part of active `v0.5`, but several shared fixtures are explicitly legacy `v0.4` and presentation-heavy. Current active coverage therefore proves only a subset of presentation semantics.
