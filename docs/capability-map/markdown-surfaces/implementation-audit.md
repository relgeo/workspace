# Markdown surfaces implementation audit

> **Audit coverage statement — 2026-10-29.** This evidence log inspects both
> Markdown plugins, their tests/manifests, core/language-service/spec inputs,
> and the official website consumer/build. It is bounded to preview/embed and
> highlighting paths, not the whole DSL or every host; current CI/canonical,
> registry, public deployment, and host compatibility remain `not verified`
> where stated. See [inventory protocol](../INVENTORY-PROTOCOL.md).

## Audit metadata

| Field | Value |
|---|---|
| Surfaces | remark-relgeo preview/embed and remark-relgeo-hl source highlighting |
| Audit date | 2026-10-29 |
| Owners | Each plugin child repository; workspace/docs-site owns cross-repository consumer evidence |
| Source paths | remark-relgeo/src/, remark-relgeo/test/, remark-relgeo/package.json, remark-relgeo-hl/src/, remark-relgeo-hl/package.json, relgeo.github.io/astro.config.mjs, relgeo.github.io/scripts/assert-built-output.mjs, relgeo.github.io/src/content/docs/*/markdown-surfaces.md, language-service/src/, core/src/, spec/ |
| Intended consumers | Unified/remark Markdown pipelines and the official Astro docs site |
| Verification boundary | Source inspection, package lint/build/tests, docs-site astro check, and existing built-output assertions were run. No fresh registry publish or clean external installation was performed. |

## Audit findings

| Area | Actual implementation | Evidence | Boundary / finding |
|---|---|---|---|
| Preview fence detection | remark-relgeo/src/index.ts visits mdast code nodes and matches lang === relgeo (configurable fence). | remark-relgeo/test/remark-relgeo.test.mjs tests 1 and 5; README output contract. | Preview-only; other fences are left untouched and successful output does not expose the source block. |
| Preview compile/render pipeline | renderPreviewFromPipeline calls @relgeo/core.compileRelGeo, then @relgeo/renderer-svg.renderToSVG; padding, sheet, unit, and profile are passed through. | remark-relgeo/src/index.ts lines 76-86; test 2; package dependencies. | Semantics are delegated to core/renderer rather than copied into the plugin. Unknown meta keys are ignored. |
| Preview AST/output | Successful transform writes div + img, SVG data URI, stable classes, data-relgeo-* attributes, lazy loading, and async decoding. | Tests 1-3; docs-site build assertion lines 46-50; site CSS. | Stable for the current docs-site, but not a promise of raw SVG byte parity or universal HTML accessibility policy. |
| Preview failure handling | Transform catches compile/render exceptions and emits a placeholder with Preview unavailable plus the error message. | Test 4; README; source lines 102-156. | Whole-document transform is protected, but errors are not typed into author/system categories. |
| Highlight fence detection | remark-relgeo-hl/src/index.ts matches lang === rg (configurable), sets pre > code, and preserves source through line/token children. | README; source lines 21-56; docs-site assertions lines 40-44. | Source-oriented output is separate from preview. |
| Semantic token integration | Highlight plugin calls RelGeoLanguageService.getSemanticTokens and maps spans through buildHighlightedChildren; render.ts also provides HTML output helpers. | remark-relgeo-hl/src/index.ts line 31; render.ts; language-service/src/service.ts lines 213-215; language-service token tests. | Token taxonomy comes from language-service. The plugin has no local test suite or mock-token snapshot. |
| Highlight output safety | render.ts escapes HTML text and block IDs in buildHighlightedHtml; AST children are text nodes for source fragments. | render.ts lines 18-24 and 60-83; TypeScript lint/build. | Direct AST path is safe for source text. The exported raw-string helper has no package tests. |
| Highlight fallback | README/plan say semantic failure should retain readable source, but remarkRelgeoHl calls getSemanticTokens without a catch or fallback path. | Synthetic language-service probe confirmed the transform throws synthetic language-service failure; source line 31. | Confirmed implementation/documentation mismatch and the main blocker for resilient highlight readiness. |
| Official docs-site consumption | relgeo.github.io/astro.config.mjs registers [remarkRelgeoHl, remarkRelgeo], disables Astro syntax highlighting, then unwraps custom blocks in rehype. Markdown docs contain rg and relgeo examples in English and Indonesian. | astro.config.mjs lines 44-46; src/content/docs/{en,id}/markdown-surfaces.md; scripts/assert-built-output.mjs lines 40-50. | Real consumer; assertions cover one of each surface, semantic token markup, preview image markup, and no preview source exposure. |
| Spec/core integration | Preview uses @relgeo/core + renderer; highlight uses @relgeo/language-service, which imports core parser/validator and tokenizes source. | Plugin manifests, language-service/src/service.ts, spec/id/README.md, core/src/parser.ts. | Plugins do not define language semantics; compatibility is inherited from selected package versions and active spec/core contract. |
| Package readiness | Both packages expose ESM/CJS/types, files dist, public publish config, README, license, homepage, repository metadata, and lint/build scripts. | Both package.json files; package build outputs. | Publish metadata exists, but no fresh pack/publish/consumer-install evidence was run. remark-relgeo-hl has no test script despite README referring to tests. |
| Version/consumer provenance | Local plugins/site are v0.5.0; workspace core/language-service are v0.5.1; site lockfile resolves registry package line v0.5.0, while local site node_modules symlinks to workspace plugin sources. | Package manifests, relgeo.github.io/pnpm-lock.yaml, symlink inspection, docs/integration-baseline.json. | Local docs-site checks exercise workspace-linked code, not a clean registry-only consumer. Registry/package parity is not verified. |

## Verification results

| Command | Result | Scope |
|---|---|---|
| pnpm test in remark-relgeo/ | PASS, 5/5 tests | Preview output, metadata/options, custom hook, fallback, fence isolation |
| pnpm lint && pnpm build in remark-relgeo/ | PASS | TypeScript and ESM/CJS/type declaration build |
| pnpm lint && pnpm build in remark-relgeo-hl/ | PASS | TypeScript and ESM/CJS/type declaration build |
| pnpm test in relgeo.github.io/ | PASS | Existing built-output assertions for both Markdown surfaces |
| pnpm check in relgeo.github.io/ | PASS, 0 errors/warnings/hints | Astro/content/type check |
| Synthetic getSemanticTokens throw probe | CONFIRMED throw | Demonstrates missing documented fallback in highlight plugin |

All commands emitted a locale warning from the shell, but no command failed for
that reason. No source or package files became dirty; capability-map artifacts
are maintained in the root `docs/capability-map/` documentation boundary.

---

## Current audit refresh — 2026-10-30

This section is the current evidence record for the expected catalog in
[`markdown-surfaces/expected-capability-catalog.md`](./expected-capability-catalog.md).
The 2026-10-29 summary above is retained as historical evidence; this refresh
corrects its stale statement about highlighter test files and adds one-to-one
coverage for all 38 expected IDs.

### Audit boundary and status vocabulary

The audit covers `remark-relgeo`, `remark-relgeo-hl`, their package/test
boundaries, the shared fixture runner, the official Astro consumer, and the
relevant spec/core/language-service contracts. It does not claim that every
arbitrary Markdown host, npm registry installation, deployed public runtime, or
physical assistive-technology target was verified.

| Status | Meaning in this audit |
| --- | --- |
| `implemented` | Source and a direct test, fixture, or consumer assertion cover the expected behavior at the inspected boundary. |
| `partial` | A usable slice exists, but an expected branch, contract, consumer, or verification layer is missing. |
| `broken` | The documented or expected behavior is contradicted by a reproducible failure. |
| `absent` | No implementation or evidence of the expected capability was found at this boundary. |
| `deferred` | Explicitly postponed by an accepted scope decision; not treated as an implementation defect. |
| `not applicable` | The expected row is a boundary-only responsibility that the current plugin is not expected to implement. |
| `unverified` | The capability may exist, but the required external/clean-host evidence was not run. |

`deferred` is used for physical/mobile accessibility verification in the
discovery report and remains separate from package implementation status.
Environment-unavailable evidence is not converted into a package failure.

### Discovery coverage report

| Discovery category | Locations inspected | Coverage result |
| --- | --- | --- |
| Source/API | `remark-relgeo/src/index.ts`; `remark-relgeo-hl/src/index.ts`; `remark-relgeo-hl/src/render.ts` | Complete for both plugin entrypoints and exported rendering helper. |
| Package config/build | Both `package.json`, `tsconfig.json`, README, LICENSE, DEVELOPMENT-PLAN, generated `dist/` | Complete for metadata, exports, dependencies, scripts, and documented boundaries. |
| Unit/package tests | `remark-relgeo/test/remark-relgeo.test.mjs`; `remark-relgeo-hl/src/__tests__/remark_relgeo_hl.test.ts` | Both suites inspected and run; preview 5 tests, highlighter 3 tests. Coverage is not a full expected-ID suite. |
| Shared fixtures | `fixtures/manifest.json`; `fixtures/expected/`; `scripts/run-conformance-fixtures.mjs` | Active, invalid, runtime-diagnostic, and candidate fixture paths inspected; runner exercises both plugins for selected fixtures. No dedicated Markdown fixture for every error/options/accessibility branch. |
| Remark/rehype integration | `relgeo.github.io/astro.config.mjs`; Astro Markdown config; `unwrapCustomCodeBlocks()` | Real Astro consumer inspected and built. Preview wrapper is not unwrapped by the current rehype helper. |
| Website content/routes | `src/content/docs/{en,id}/markdown-surfaces.md`, getting-started/current-capabilities/CLI links; generated `/en/` and `/id/` Markdown routes | Both public language surfaces and route links inspected; static build and built-output assertions pass. |
| Website styling/accessibility | `relgeo.github.io/src/styles/site.css`, `src/styles/accessibility.css`, built HTML | CSS tokens and focus/reduced-motion rules inspected; generated preview has `alt`, but no SVG title/desc and is nested under `pre`. Physical screen-reader verification is deferred. |
| Artifact/delivery | `.github/workflows/pages.yml`; `assert-built-output.mjs`; `assert-pages-artifact.mjs`; `smoke-public-site.mjs` | Website build/assertions and assembled Pages artifact verified locally; fresh deployed public smoke was not run in this audit. |
| UI/menu/command/shortcut | Plugin source and package scripts; website routes | No plugin-owned UI, menu, shortcut, or command exists; package commands are build/lint/test. Website owns navigation and route surface. This category is `not applicable` to plugin internals. |
| Config/platform/service | plugin options, Astro env `RELGEO_DOCS_SITE_URL`/`RELGEO_DOCS_BASE`, language-service peer, core/renderer runtime calls | Node/static build path verified; generic SSR hosts and clean registry service resolution remain unverified. |
| Normative/docs/roadmap | `docs/MATURATION-MASTER-PLAN.md`, `docs/compatibility-matrix.json`, plan 05, package READMEs/development plans, spec error/version/presentation chapters | Source-of-truth and scope boundaries inspected; expected IDs come from the preceding catalog, not this audit. |

### External verification dispositions

These rows make evidence state explicit where it is not an implementation status
of either plugin:

| Surface/evidence | Disposition | Basis |
| --- | --- | --- |
| Generic SSR host and non-Astro unified/rehype pipeline | `unverified` | Only the official Astro static consumer was executed; no standalone generic pipeline fixture or alternate SSR host was run. |
| Clean npm registry install, pack, and external consumer parity | `unverified` | Local package/site checks pass, but this audit did not publish, fetch, or install from the registry. |
| Deployed public-site smoke | `unverified` | `smoke-public-site.mjs` requires an external deployment URL; local Pages artifact assertions passed instead. |
| Physical mobile, VoiceOver, TalkBack, and Safari touch validation | `deferred` | Accepted product scope explicitly defers mobile and physical assistive-technology validation; browser/AX automation is not treated as equivalent evidence. |
| Plugin-owned UI, menu, command, shortcut, or focus-management surface | `not applicable` | The packages transform Markdown AST; website navigation and any interactive host controls belong to consumers. |

### Verification execution

| Command or probe | Result | Evidence boundary |
| --- | --- | --- |
| `npm run lint` in `remark-relgeo` | PASS | TypeScript source/type boundary. |
| `npm run build` in `remark-relgeo` | PASS | ESM/CJS plus declaration output generated. |
| `npm test` in `remark-relgeo` | PASS, 5/5 | Preview success, metadata, custom hook, fallback, and non-`relgeo` isolation. |
| `npm run lint` in `remark-relgeo-hl` | PASS | TypeScript source/type boundary. |
| `npm run build` in `remark-relgeo-hl` | PASS | ESM/CJS plus declaration output generated. |
| `npm test` in `remark-relgeo-hl` | PASS, 3/3 | Semantic token output, non-`rg` isolation, and exported HTML helper. |
| `node scripts/run-conformance-fixtures.mjs` | PASS, 260/260 across 20 fixtures | Shared active/invalid/runtime-error/candidate checks; exact highlight digest and preview SVG for selected fixtures. |
| `npm run check` in `relgeo.github.io` | PASS, 0 errors/warnings/hints | Astro/content/type check. |
| `npm run build` in `relgeo.github.io` | PASS, 138 pages | Static Markdown consumer build. |
| `npm test` in `relgeo.github.io` | PASS | Built-output assertions for localized Markdown surfaces, highlight/preview markers, accessibility shell, and no preview error in built pages. |
| `npm run build` in `playground` + official artifact copy + `npm run test:pages-artifact` | PASS; 3 Playground assets checked | Pages assembly path from `.github/workflows/pages.yml`; verifies assembled artifact, not only website `dist`. |
| Synthetic preview invalid-version probe | PASS as fallback observation | `relgeo` produces `preview-error` placeholder and visible error text for DSL `0.6`; no structured code/severity/location. |
| Synthetic highlighter service-failure probe | CONFIRMED failure | Injected `getSemanticTokens()` throw aborts transform; no source-only fallback. |
| Clean registry install/pack/publish smoke | NOT RUN | Registry parity and fresh external consumer remain `unverified`. |
| Fresh deployed public smoke and physical AT | NOT RUN / deferred | `smoke-public-site.mjs` requires an external URL; physical mobile and VoiceOver/TalkBack are accepted deferred scope. |

### Capability-by-capability disposition

| ID | Status | Observed implementation and evidence | Gap, defect, or verification limit |
| --- | --- | --- | --- |
| `MD-FENCE-001` | `partial` | Preview default is `relgeo`; highlighter default is `rg`; each supports a configurable single `fence` option. | The expected alias contract is split across packages rather than a documented shared alias set; no alias matrix test. |
| `MD-FENCE-002` | `partial` | Both visit mdast `code` nodes, preserve `code.value` for their output path, retain `meta` in `data-relgeo-meta`, and highlighter preserves line text. | Preview intentionally removes source, and whitespace/info preservation is not tested through a real remark/rehype pipeline. |
| `MD-FENCE-003` | `partial` | `unist-util-visit` processes every matching code node without package-global state; conformance covers selected fixtures. | No dedicated multi-block/mixed-Markdown test or exact ordering assertion. |
| `MD-PREVIEW-001` | `implemented` | `remark-relgeo` compiles with `@relgeo/core`, renders with `@relgeo/renderer-svg`, emits a preview marker/image, and passes package, conformance, and website assertions. | Only current mdast/HTML consumer path is directly exercised. |
| `MD-PREVIEW-002` | `partial` | Default output is lightweight model preview; `sheet`, `profile`, and `unit` metadata reach runtime and `sheetId` is tested. | No explicit view selection; print/sheet semantics are only partially exposed and no full option contract exists. |
| `MD-PREVIEW-003` | `implemented` | Source delegates to `compileRelGeo` and `renderToSVG`; conformance compares preview image SVG exactly to the preview pipeline snapshot. | Cross-version/registry parity is not independently verified. |
| `MD-PREVIEW-004` | `partial` | Transform mutates only matching code nodes; website content around the examples builds. | Astro output is `<pre><div class="relgeo-preview__canvas">…</div></pre>` because `unwrapCustomCodeBlocks()` only unwraps a `pre` child with class `relgeo-preview`/`relgeo-hl`; surrounding semantics are therefore not fully clean. |
| `MD-HL-001` | `implemented` | `remark-relgeo-hl` produces `pre > code`, line wrappers, semantic token spans, and stable classes; tests and site output assert token kinds. | Token completeness follows language-service coverage rather than a separately versioned Markdown taxonomy. |
| `MD-HL-002` | `broken` | Invalid-looking source remains visible when language service returns tokens; text fragments are AST text nodes. | A synthetic language-service throw propagates from line 31 and aborts the transform despite README/development-plan fallback promise. |
| `MD-HL-003` | `implemented` | `rg-line`, `data-line`, `data-token-kind`, class prefix, whitespace text nodes, and escaped helper output are implemented; CSS consumes the classes. | No snapshot/compatibility policy for class/token renames; raw helper has limited direct tests. |
| `MD-HL-004` | `partial` | Highlighter calls language-service tokenization and does not import renderer; invalid source can still be tokenized. | Peer runtime failure is not isolated, and language-service itself is coupled to core semantics; no independent bounded/fallback mode. |
| `MD-DIAG-001` | `absent` | Preview catches exceptions and highlighter consumes token spans, but neither plugin emits a structured diagnostic envelope. | No severity, stable error code, source range, or block-scoped diagnostic node is produced. |
| `MD-DIAG-002` | `partial` | Preview error creates visible `Preview unavailable.` plus exception message; source/highlighter remains readable on its normal path. | Error is plain text, not structured/actionable; highlighter service failure aborts instead of rendering fallback. |
| `MD-DIAG-003` | `absent` | Core/renderer may support runtime diagnostics and shared runner verifies them elsewhere. | Preview plugin only receives a compiled scene or thrown error; no non-fatal diagnostic path preserves preview plus diagnostic. |
| `MD-DIAG-004` | `absent` | Current behavior is implicitly tolerant for preview exceptions. | No strict/tolerant option or documented policy switch; invalid meta is silently ignored. |
| `MD-OPT-001` | `partial` | TypeScript interfaces expose `classPrefix`, `fence`, render hook, and language service; preview parses `padding`, `profile`, `sheet`, `unit`. | Defaults exist in code/README, but invalid values/unknown keys are not diagnosed and options are not tested exhaustively. |
| `MD-OPT-002` | `partial` | `profile`, `sheet`, and `unit` pass through; source version is handled by core. | No plugin option for version or view selection; future version becomes a generic placeholder error. |
| `MD-OPT-003` | `partial` | `classPrefix`, custom preview hook, and highlighter class prefix are configurable. | No configurable asset strategy/base URL; custom hook accepts arbitrary SVG string without validation. |
| `MD-OPT-004` | `absent` | Preview always catches and substitutes a placeholder. | No caller-selected fallback/diagnostic policy and no strict build failure mode. |
| `MD-SSR-001` | `partial` | Package source uses Node-compatible compile/render and no browser globals; Astro static build succeeds. | Generic SSR/other unified hosts were not run; data URI and runtime dependencies are only verified in Astro/local Node. |
| `MD-SSR-002` | `implemented` | Exact preview SVG and highlight digest checks pass for selected shared fixtures; repeated static build is deterministic in the inspected run. | Determinism is not proven for all options, custom hooks, or arbitrary hosts. |
| `MD-SSR-003` | `unverified` | Astro config successfully orders `remarkRelgeoHl`, `remarkRelgeo`, then `rehype` unwrap; website build passes. | No standalone remark-parse → remark-rehype → rehype-stringify integration fixture or documented ordering matrix outside Astro. |
| `MD-SSR-004` | `partial` | Both packages build ESM/CJS/types, expose `dist`, and have public package metadata. | No fresh `npm pack`/registry install/temporary consumer proof; local site uses workspace-linked resolution in the inspected checkout. |
| `MD-ASSET-001` | `partial` | Preview uses deterministic `data:image/svg+xml;charset=utf-8` URI and Pages artifact carries it. | Asset mode is fixed, not configurable; no external/relative asset-base policy for large previews or alternate hosts. |
| `MD-ASSET-002` | `implemented` | Plugin source performs no filesystem or network access; inputs are source/meta and caller hook only. | A caller-supplied custom render hook remains an explicit trust boundary. |
| `MD-ASSET-003` | `partial` | Source text is represented as AST text and helper escapes HTML text/block IDs; renderer conformance checks no executable markup. | Custom raw SVG hook is trusted; no plugin-level sanitization or URL policy is defined. |
| `MD-A11Y-001` | `partial` | Preview image has `alt="Rendered RelGeo preview"`; site has accessible shell and CSS. | No SVG `title`/`desc`, figure/caption semantics, or source-derived label; current Astro wrapper nests `div` under `pre`. |
| `MD-A11Y-002` | `partial` | Source is text-selectable, errors are visible, and image has alt; website focus/reduced-motion assertions pass. | No explicit non-color token semantics/ARIA contract and no physical screen-reader verification. |
| `MD-A11Y-003` | `not applicable` | Current plugin output has no interactive controls, focus management, or embed keyboard UI. | Any future controls belong to a separately scoped host/consumer capability. |
| `MD-ERR-001` | `partial` | Preview catches compile/render exceptions; non-matching fences are untouched; tests cover a safe placeholder. | Highlighter has no service-failure catch; option syntax errors and block location context are not reported. |
| `MD-ERR-002` | `partial` | Core produces an unsupported-version message and preview converts it to a placeholder; compatibility matrix declares active/legacy/future policy. | Plugin does not expose stable diagnostic code/category or preserve a structured version classification. |
| `MD-ERR-003` | `partial` | Preview fallback avoids partial HTML from failed compile/render; conformance verifies safe SVG for successful fixtures. | Error output is untyped, custom SVG hook is trusted, and non-fatal runtime diagnostic mapping is absent. |
| `MD-WEB-001` | `implemented` | English/Indonesian docs intentionally use `rg` for source and `relgeo` for rendered artifact; Astro registers both and disables built-in syntax highlighting. | Current consumer is the official site; generic MDX/Next/other host examples are not verified. |
| `MD-WEB-002` | `implemented` | Static website build, built-output assertions, Playground assembly, and Pages artifact assertions pass locally. | Fresh deployed smoke was not run in this audit; local artifact uses current workspace build. |
| `MD-WEB-003` | `partial` | Site content identifies Markdown as non-normative; spec content is loaded separately; package/matrix line is 0.5.x. | Site lockfile and local linked dependencies need clean registry parity evidence; plugin output exposes no provenance field. |
| `MD-WEB-004` | `partial` | EN/ID routes build, localized navigation and technical CSS assertions pass, and `/docs/markdown-surfaces/` is linked from docs. | Public deployment and physical/mobile readability are not current evidence; mobile/VoiceOver work is explicitly deferred. |
| `MD-REL-001` | `partial` | Both packages have README, examples, license, repository metadata, exports, types, and build/test scripts. | `remark-relgeo-hl` has only 3 unit tests and no clean external consumer/pack smoke; package docs do not fully specify error/options contracts. |
| `MD-REL-002` | `unverified` | Manifests and compatibility matrix declare both packages at `0.5.0` on line `0.5`, and release order places highlighter before preview. | Registry publication/install parity and version synchronization with core/language-service are not verified in this audit. |

### Fresh local verification — 2026-10-30

The following checks were rerun against the current workspace checkout after
the catalog/audit refresh. These are local evidence only; they do not promote
registry, CI, deployed-site, or physical assistive-technology status.

| Command | Result | Evidence boundary |
|---|---|---|
| `npm test` in `remark-relgeo/` | PASS, 5/5 | Preview success, metadata/options, custom hook, safe compile fallback, and non-`relgeo` isolation. |
| `npm run lint` and `npm run build` in `remark-relgeo/` | PASS | TypeScript check plus ESM/CJS/declaration output. |
| `npm test` in `remark-relgeo-hl/` | PASS, 3/3 | Semantic token output, non-`rg` isolation, and exported HTML helper. |
| `npm run lint` and `npm run build` in `remark-relgeo-hl/` | PASS | TypeScript check plus ESM/CJS/declaration output. |
| `npm run conformance:fixtures` at workspace root | PASS, 260/260 across 20 fixtures | Shared active, invalid, runtime-diagnostic, runtime-error, and candidate checks; includes exact Markdown preview/highlight projections for selected fixtures. |
| `npm run check` in `relgeo.github.io/` | PASS, 0 errors/warnings/hints | Astro/content/type boundary for the official consumer. |
| `npm run build` in `relgeo.github.io/` | PASS, 138 pages | Static EN/ID docs consumer and route generation. |
| `npm test` in `relgeo.github.io/` | PASS | `scripts/assert-built-output.mjs` validates localized Markdown surfaces, token markup, preview image markup, and preview source non-exposure. |
| Synthetic unsupported-version preview probe | PASS as fallback observation | `remark-relgeo` emits `data-relgeo-kind="preview-error"` and visible fallback text for `version: 0.6`. |
| Synthetic language-service failure probe | CONFIRMED defect | Injected `getSemanticTokens()` failure propagates from `remark-relgeo-hl`; no source-only fallback is emitted. |

The shell emitted a locale warning (`LC_ALL=C.UTF-8` unavailable) for these
commands, but every command completed with exit code 0. No implementation
source or child-repository working tree changes were introduced by the checks.

### Status summary

| Status | Count |
| --- | ---: |
| `implemented` | 8 |
| `partial` | 22 |
| `broken` | 1 |
| `absent` | 4 |
| `not applicable` | 1 |
| `unverified` | 2 |
| `deferred` | 0 implementation rows; physical/mobile AT evidence is deferred in the discovery report |
| **Total expected IDs** | **38** |

### Audit conclusion and handoff

The preview path is the stronger implementation: it delegates semantics to the
canonical core/renderer, has direct tests, shared-fixture exact output evidence,
and a safe compile/render placeholder. Its main current integration defect is
the website's invalid/undesirable `pre > div` wrapper and its lack of structured
diagnostics/options policy.

The highlighter has a real semantic-token path and stable output classes, but is
`broken` for its documented service-failure fallback: one thrown language-service
error aborts the Markdown transform. It also lacks a broad package-level test
matrix even though the current three tests pass.

The next reconciliation task should join all 38 IDs to this audit without
deleting absent capabilities. It should keep implementation, verification, and
scope axes separate, and should treat the Pages artifact pass as consumer
evidence—not as proof of clean npm registry parity or physical accessibility.
