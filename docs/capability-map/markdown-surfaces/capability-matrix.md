# Markdown surfaces capability matrix

> **Coverage statement — 2026-10-29.** This matrix covers `remark-relgeo` and
> `remark-relgeo-hl` source/test/package boundaries plus the official website
> consumer, using plugin source, tests, manifests, core/language-service/spec
> inputs, and Astro build evidence. It inventories preview/embed and source
> highlighting delivery, not the entire DSL or arbitrary Markdown hosts.
> Current registry, CI/canonical, public deployment, and host compatibility
> checks remain `not verified` where stated; a missing row is not evidence of
> absence.
> See [inventory protocol](../INVENTORY-PROTOCOL.md) for status axes and evidence tiers.

## Matrix metadata

| Field | Value |
|---|---|
| Surfaces | @relgeo/remark-relgeo and @relgeo/remark-relgeo-hl |
| Audit owner | Plugin repositories + official Astro docs-site consumer |
| Audit date | 2026-10-29 |
| Source of truth | Plugin source/tests/manifests, language-service token API, core/spec contracts, docs-site config/content/assertions |
| Evidence freshness | Local package/site checks passed against workspace-linked dependencies. Registry-only installation, publish, and clean cross-repository consumer parity are not verified. |

## Status legend

| Status | Meaning |
|---|---|
| ✔️ | Implemented and directly exercised by source/tests/consumer evidence for the bounded capability. |
| 🌗 | Implemented or consumed, but coverage, portability, or contract evidence is partial. |
| ❌ | Expected capability is absent or contradicted at the current boundary. |
| ➖ | Deliberately outside this plugin responsibility or acceptance target. |
| ⏸️ | Intentionally held pending contract, test, consumer, or release decision. |
| ⚠️ | Confirmed defect, mismatch, or evidence inconsistency. |

not verified is an evidence state for checks not run in this audit; it is not a
status symbol.

## Capability inventory

| Capability | Status | Evidence | Gap / limitation | Consumer | Dependency | Next action |
|---|---:|---|---|---|---|---|
| Detect relgeo fence and emit preview-only output | ✔️ | remark-relgeo/src/index.ts; 5/5 package tests; docs-site assertions | No source exposure in success path; only current mdast code-node shape is tested | Astro docs-site and remark consumers | mdast/unist visitor | Retain stable output contract and add a real unified integration fixture |
| Compile through core and render through renderer-svg | ✔️ | compileRelGeo + renderToSVG calls; preview test decodes SVG data URI | Inherited core/renderer support is bounded by their contracts; no package-level typed error taxonomy | Preview/embed consumers | @relgeo/core, @relgeo/renderer-svg | Track compatibility against core/renderer release line |
| Fence metadata: padding, unit, sheet, profile | 🌗 | Source parser and test for padding, unit, sheet; profile is passed through | Unknown keys are ignored; invalid numeric values are silently omitted; no exhaustive option matrix | Docs authors and site content | Core compile options; renderer sheet support | Add invalid/unknown/profile cases and define strictness policy |
| Custom preview render hook | ✔️ | RemarkRelgeoOptions.renderPreview; test 3 | Hook returns arbitrary SVG string and is not validated/sanitized by plugin | Advanced remark consumers | Consumer-owned renderer | Document trust boundary and whether raw hook output is allowed |
| Safe preview fallback on render failure | ✔️ | Catch in source; test 4; site build asserts no preview-error in built pages | Error class/source is not typed; message policy is not separated into author/system modes | Docs build pipeline | Core/renderer errors | Add structured error metadata if consumers need actionable reporting |
| Detect rg fence and preserve readable source | ✔️ | remark-relgeo-hl/src/index.ts; docs-site built assertion; README output contract | No package test currently proves non-rg isolation, whitespace, or metadata preservation | Astro docs-site and generic remark consumers | mdast/unist visitor | Add a dedicated test suite for basic output contract |
| Semantic token spans from language-service | 🌗 | getSemanticTokens integration; language-service token source/tests; docs-site output assertion | Plugin does not own token taxonomy; coverage follows language-service; no highlight package tests/snapshots | Syntax docs and CSS styling | @relgeo/language-service, core parser | Add mocked token fixtures and end-to-end source preservation tests |
| Stable line/token classes and data attributes | ✔️ | rg-line, relgeo-hl__token--*, data-line, data-token-kind; site CSS and built assertions | Token kind naming is coupled to language-service taxonomy; no compatibility policy for renames | Site CSS, downstream Markdown styling | Token taxonomy | Version/document taxonomy before adding or renaming classes |
| Cross-consumer token taxonomy contract | ⏸️ | remark-relgeo-hl delegates token kinds to language-service; development plan lists taxonomy design as an active concern | No independently versioned contract says which token kinds downstream CSS may rely on across language-service releases | Docs-site and future Markdown consumers | language-service token API; package release policy | Decide and document stable versus experimental token classes before broad adoption |
| HTML escaping for exported helper | 🌗 | escapeHtml and buildHighlightedHtml in render.ts | Raw-string API has no tests; class/token values are interpolated from semantic data | Consumers calling exported helper | Language-service token kinds | Add boundary tests for source, block IDs, and unexpected token kinds |
| Highlight fallback when language service fails | ⚠️ | Confirmed synthetic throw; README and development plan promise fallback | No try/catch and no source-only fallback; failure can abort Markdown transform | Any consumer with unavailable/broken language service | Peer dependency and runtime service | Implement and test fallback before claiming resilient readiness |
| Preview/highlight separation | ✔️ | Separate fences, packages, READMEs, docs content, and site assertions that preview has no source | Pairing both requires consumer configuration; plugins do not coordinate them | Authors choosing source vs rendered artifact | Both package APIs | Keep boundaries explicit in docs and versioning |
| Official Astro integration | ✔️ | astro.config.mjs, English/Indonesian markdown examples, pnpm test, pnpm check | Current evidence uses workspace symlinked packages; no clean registry install | relgeo.github.io | Astro, remark, rehype, both plugins | Verify a clean lockfile install in CI/release workflow |
| Public package metadata and exports | 🌗 | Manifests, dist, README, MIT license, ESM/CJS/types, public publish config | Publish readiness is metadata-only; no pack/publish/consumer install evidence | npm consumers | npm registry and release process | Run package pack/install smoke from a clean temp consumer |
| Independent remark-relgeo-hl test coverage | ❌ | Package has lint/build scripts but no test script or test files; plan lists snapshot/basic tests as open | Build success cannot establish output/fallback behavior | Package maintainers and downstream consumers | Vitest/test fixtures | Add tests for fence, whitespace, mock tokens, fallback, and HTML escaping |
| Full language-service/parser semantic guarantee | ➖ | Plugin delegates to language-service/core; spec is authoritative | Not a Markdown plugin responsibility; plugin tests should observe, not redefine language semantics | Core/language-service owners | spec, core, language-service | Keep semantic contract in core/language-service matrices |
| Registry parity with workspace consumer | ⚠️ | Workspace plugin/site are 0.5.0 but core/language-service source are 0.5.1; site lockfile records 0.5.0 while local node_modules symlink to workspace sources | Local site pass is not clean registry-only proof | npm users and published docs site | Package release/version synchronization | Add clean install/package-consumer evidence and reconcile version line |
| Raw SVG/PNG asset production from Markdown plugin | ➖ | remark-relgeo emits an image data URI; plans exclude general export formats | General asset pipeline is outside plugin contract | Site asset pipeline | Renderer/export strategy | Do not expand without a concrete consumer requirement |

## Priority and dependency order

1. **P0 — fix highlight resilience:** add source-preserving fallback around
   getSemanticTokens and tests for service failure.
2. **P0 — add highlight package tests:** cover fence isolation, whitespace,
   token spans, escaping, and output snapshots; this is independent of changing
   the language-service implementation.
3. **P1 — verify release boundary:** run clean package pack/install smoke and
   reconcile local workspace 0.5.1 dependencies with the site lockfile's 0.5.0
   registry resolution.
4. **P1 — harden preview metadata:** specify invalid/unknown option behavior and
   test profile, sheet selection, and unit conversion explicitly.
5. **P2 — add generic unified integration evidence:** prove the AST transforms
   through an actual remark/rehype pipeline outside current synthetic-tree tests.

## Conclusion

The Markdown surfaces are real and consumed by the official site. Preview/embed
is the stronger implementation: it has package tests, a delegated core/renderer
pipeline, safe render fallback, and site assertions. Highlighting has a working
semantic-token path and stable output classes, but remains partial because it has
no package tests and its documented language-service failure fallback is absent.
The local site checks therefore verify workspace-linked integration, not a clean
registry release or complete cross-repository package parity.
