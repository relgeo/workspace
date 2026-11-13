# Markdown cross-surface impact register

**Freeze:** 2026-11-13  
**Owner:** `relgeo/workspace` orchestration with the named surface owners  
**Scope:** the 38 expected Markdown capability IDs

This register describes where each expected capability crosses a repository or
runtime boundary. It prevents a package-local result from being promoted to a
website, renderer, language-service, package-artifact, or public-host claim
without the corresponding evidence. Capability status remains canonical in the
[status matrix](./status-matrix.md).

## Source-of-truth and evidence inventory

| Boundary | Source paths | Test/fixture paths | Package/consumer metadata | Required evidence class |
| --- | --- | --- | --- | --- |
| Preview plugin | `remark-relgeo/src/index.ts`, `remark-relgeo/README.md`, `DEVELOPMENT-PLAN.md` | `remark-relgeo/test/*.test.mjs`; `fixtures/manifest.json` preview projections | `remark-relgeo/package.json`, `dist/`, exports/types | Package source plus focused AST/safety tests; cross-surface fixture evidence is separate |
| Highlight plugin | `remark-relgeo-hl/src/index.ts`, `src/render.ts`, README/development plan | `remark-relgeo-hl/src/__tests__/remark_relgeo_hl.test.ts`; `test/package-boundary.test.mjs`; highlight fixture projections | `remark-relgeo-hl/package.json`, `dist/`, exports/types | Source-preserving token/fallback tests and package boundary checks |
| Language-service | `language-service/src/protocol.ts`, `src/service.ts` | `language-service/src/__tests__/{protocol,language_service,document_lifecycle}.test.ts` | `language-service/package.json`; peer dependency contract | Token/diagnostic vocabulary evidence; service failure remains a highlighter containment case |
| Renderer safety | `renderer-svg/src/{escape,semantic,index,primitives}.ts` | `renderer-svg/src/__tests__/{security,semantic_contract,semantic_projection,renderer}.test.ts`; presentation-escaping fixture | `renderer-svg/package.json`; SVG semantic contract in fixture manifest | Safe semantic projection and transport safety; raw SVG bytes are not parity proof |
| Canonical fixtures | `fixtures/manifest.json`, `fixtures/reference/`, `fixtures/expected/` | `scripts/run-conformance-fixtures.mjs` | `standaloneStrategy` and compatibility-line fields in manifest | Root conformance result plus named fixture IDs; candidates are not silently active |
| Package boundary | both plugin `package.json`, `tsconfig.json`, README, `LICENSE`, generated `dist/` | both package test suites and `test/package-boundary.test.mjs` | `exports`, `types`, `main`, `module`, `files`, scripts, dependency/peerDependency declarations | Clean local build/pack/type/export checks; registry install is separate |
| Website/Pages | `relgeo.github.io/astro.config.mjs`, localized docs content, `.github/workflows/pages.yml` | `scripts/assert-built-output.mjs`, `assert-content-integrity.mjs`, `assert-pages-artifact.mjs` | `relgeo.github.io/package.json`, `pnpm-lock.yaml`, compatibility matrix | Astro/static artifact and provenance assertions; deployed/public smoke is separate |
| Normative contract | `spec/id/core/06-error-model.md`, `spec/id/presentation/25-views-sheets.md`, `26-metadata.md`, `docs/compatibility-matrix.json` | shared invalid/runtime/presentation fixtures and language-service diagnostics | compatibility line `0.5`, package line `0.5.x` | Semantic meaning and version policy come from spec/core; plugins only project context |

## Capability-family impact register

| Impact ID / capability family | Expected IDs covered | Primary owner | Downstream surfaces affected | Evidence requirement | Freeze disposition |
| --- | --- | --- | --- | --- | --- |
| `MD-XI-FENCE` fence recognition/preservation | `MD-FENCE-001`–`003` | both plugins | unified AST, website Markdown, canonical fixtures | Alias, source/metadata, mixed-block determinism tests | Implemented local; retain regression |
| `MD-XI-PREVIEW` preview production/structure | `MD-PREVIEW-001`–`004` | `remark-relgeo`; core/renderer semantic owners | renderer-svg, rehype/website, Pages artifact | Canonical compile/render path, wrapper structure, semantic replay, consumer assertions | `MD-PREVIEW-001/002/003` locally implemented; `MD-PREVIEW-004` wrapper boundary retained |
| `MD-XI-HL` source highlighting/fallback | `MD-HL-001`–`004` | `remark-relgeo-hl`; language-service token owner | language-service, website CSS, copyable `pre > code` | Token projection plus injected service absence/throw fallback | Implemented local; service failure never destroys source |
| `MD-XI-DIAG` diagnostics and failure policy | `MD-DIAG-001`–`004` | both plugins + spec/core | website error presentation, build owner, source location | Stable DTO serialization, runtime warning fixture, tolerant/strict tests | Implemented local; semantic vocabulary remains spec/core-owned |
| `MD-XI-OPT` options and presentation policy | `MD-OPT-001`–`004` | package owners + website/build owner | caller configuration, renderer options, compatibility line | README/types/defaults/validation and option behavior tests | `MD-OPT-002`/`003` remain mapped to `MD-TASK-013`/`014`; other rows implemented |
| `MD-XI-SSR` static/SSR/package execution | `MD-SSR-001`–`004` | both packages + website | generic unified/rehype hosts, Astro, fresh consumers | Node/static execution, ordering fixture, packed ESM/CJS/types consumer | `MD-SSR-001`/`003`/`004` locally verified by generic host and fresh packed-consumer contracts; registry parity remains separate |
| `MD-XI-ASSET` asset and output safety | `MD-ASSET-001`–`003` | plugin + renderer/host owners | data URI/Pages base, HTML/SVG/URL boundary | URL/base policy and malicious source/meta/custom-output fixtures | `MD-ASSET-001`/`003` → `MD-TASK-017`/`018`; no general sanitizer claim is inferred |
| `MD-XI-A11Y` preview/source accessibility | `MD-A11Y-001`–`003` | plugin + website host | generated SVG/wrapper, error/source semantics, static focus boundary | HTML semantics and non-color assertions; physical AT separately classified | `MD-A11Y-001` locally implemented; `MD-A11Y-002` → `MD-TASK-020`; `MD-A11Y-003` explicit not applicable |
| `MD-XI-ERR` contextual and versioned failures | `MD-ERR-001`–`003` | plugins + spec/core/renderer | block isolation, compatibility policy, website fallback | Per-block malformed/service/runtime/version fixtures | `MD-ERR-002`/`003` → `MD-TASK-022`/`023`; `MD-ERR-001` implemented local |
| `MD-XI-WEB` Website/Pages consumption | `MD-WEB-001`–`004` | `relgeo.github.io` | localized docs, routes, CSS, Pages artifact/public host | EN/ID build, output/provenance/artifact assertions, public smoke where available | `MD-WEB-004` → `MD-TASK-025`; deployment/physical checks are not implementation prerequisites |
| `MD-XI-REL` package/release contract | `MD-REL-001`–`002` | package/release owners | fresh consumer, compatibility matrix, registry | README/options/errors, pack/install, version/release-order evidence | `MD-REL-001` → `MD-TASK-026`; `MD-REL-002` → `MD-VERIFY-002`; publish remains out of scope |

## Non-green closure join at freeze

The final matrix has 0 `🌗`, 0 `❌`, and 0 `⚠️` rows, plus 10 explicit `⏸️`
scope holds. Each held row has one owner, non-blocking rationale, and reopen
condition in the final closure report; external verification is deliberately
labelled as such and is not disguised as implementation work.

| Capability | Owner | Source path | Evidence requirement | Next closure task/disposition |
| --- | --- | --- | --- | --- |
| `MD-OPT-002` | `remark-relgeo` + spec/core | `remark-relgeo/src/index.ts`; presentation spec; compatibility matrix | Supported version/profile/view/sheet projection plus stable future-version behavior | `MD-TASK-013` |
| `MD-OPT-003` | both plugins + website | both plugin sources; renderer safety; website consumer | Controlled output/asset policy and custom-hook safety | `MD-TASK-014` |
| `MD-SSR-001` | both plugins + website | package sources; Astro config; `scripts/validate-markdown-generic-host.mjs` | Standalone non-browser unified/SSR execution | Closed locally; retain generic-host regression evidence |
| `MD-SSR-003` | package + website owners | generic-host-contract.md; package docs | Generic remark → rehype ordering fixture | closed locally; retain `MD-VERIFY-001` as regression evidence |
| `MD-SSR-004` | both package owners | both `package.json`, `dist/`, package-boundary tests, `scripts/validate-markdown-package-boundary.mjs` | Fresh packed ESM/CJS/types consumer with no workspace-relative dependency | Closed locally; retain `MD-TASK-027` as regression evidence |
| `MD-ASSET-001` | `remark-relgeo` + website | preview output; Astro/Pages assembly | Deterministic inline/base URL policy | `MD-TASK-017` |
| `MD-ASSET-003` | both plugins + renderer/host | preview safety; highlighter escaping; renderer security tests | Source/meta/custom output cannot cross HTML/SVG/URL boundary unsafely | `MD-TASK-018` |
| `MD-A11Y-001` | `remark-relgeo` + website | preview output; renderer metadata; website CSS | Preview role/name/description and wrapper semantics | Closed locally by preview contract; retain semantic regression evidence |
| `MD-A11Y-002` | both plugins + website | highlighter render; website accessibility CSS/assertions | Non-color source/error/fallback semantics | `MD-TASK-020` |
| `MD-ERR-002` | `remark-relgeo` + spec/core | core error model; compatibility matrix | Active/legacy/future version category and source context | `MD-TASK-022` |
| `MD-ERR-003` | `remark-relgeo` + core/renderer | preview failure mapping; renderer safety | Typed safe runtime/render failure projection | `MD-TASK-023` |
| `MD-WEB-004` | website owner | localized docs, Astro routes, Pages scripts | Route/subpath/readability and separately classified public/AT evidence | `MD-TASK-025` |
| `MD-REL-001` | each package owner | package README/metadata/exports | Independent docs/options/errors and external consumer smoke | `MD-TASK-026` |
| `MD-REL-002` | release/package owners | compatibility matrix and package metadata | Published/version/release-order parity | `MD-VERIFY-002` external verification |

This register is the cross-surface impact evidence for the catalog freeze. It
does not close any row, authorize publishing, or turn unavailable external
evidence into a target defect.

## Final closure note — 2026-11-13

Cross-surface evidence is complete for the local closure boundary: package
tests/exports, language-service fallback, renderer safety/metadata, generic
unified ordering, and Website/Pages artifacts are linked by the conformance
report and evidence map. The ten remaining `⏸️` rows are deliberate holds for
product contracts, sanitizer/asset policy, public/device validation, or
registry/release work. They are non-blocking because those boundaries are
explicitly outside the current implementation goal.

## Preview/embed closure change record — 2026-11-13

The preview contract was tightened across the package and its consumers:

- `renderer-svg` now escapes optional SVG `<title>` and `<desc>` metadata.
- `remark-relgeo` declares the only supported asset strategy as
  `inline-data-uri`, rejects external or executable SVG/URL forms in custom
  output, and emits a deterministic `figure` wrapper with `role`,
  `aria-label`, image `alt`, and escaped accessible SVG metadata.
- `relgeo.github.io` built-output assertions now verify the wrapper and image
  semantics, while the generic host contract keeps package-level ordering and
  asset behavior explicit.

The focused package and renderer tests are the proof boundary for these
changes; production deployment and assistive-technology testing remain
separate external checks.
