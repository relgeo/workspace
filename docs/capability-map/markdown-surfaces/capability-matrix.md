# Markdown surfaces capability matrix

> **Coverage statement — 2026-11-04.** This matrix covers `remark-relgeo` and
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
| Audit date | 2026-11-04 |
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

## Current reconciliation overlay — 2026-11-04

The inventory and priority notes below preserve the 2026-11-03 broad-surface
snapshot for audit history. This overlay is the current status for the selected
implementation tranche and downstream consumer boundary; it is aligned with
the status matrix, reconciliation, implementation audit, and coverage handoff.

| Current status | Count |
|---|---:|
| Implemented | 23 |
| Partial | 14 |
| Broken | 0 |
| Absent | 0 |
| Not applicable | 1 |
| Partial rows with unverified external evidence | 3 |

| Current row group | Status | Evidence boundary |
|---|---|---|
| `MD-FENCE-001`, `MD-FENCE-002`, `MD-FENCE-003` | ✔️ implemented / verified-local | Fence defaults/overrides, source and metadata preservation, and mixed-block determinism pass package and shared-pipeline checks. |
| `MD-PREVIEW-002` | ✔️ implemented / verified-local | Canonical model preview, sheet selection, metadata validation, tolerant placeholder, and strict failure pass focused tests and conformance. |
| `MD-HL-004` | ✔️ implemented / verified-local | Explicit service opt-out and service failure preserve readable source in `pre > code`; strict behavior is tested. |
| `MD-OPT-001` | ✔️ implemented / verified-local | README/types/runtime validation agree on defaults, known invalid values, unknown keys, and safe reuse. |
| `MD-DIAG-003` | ✔️ implemented / verified-local | Runtime warning retains valid preview in tolerant mode and strict mode remains explicit. |
| `MD-SSR-004` | 🌗 partial / unverified-external | Local build, package boundary, and `npm pack` pass; clean temporary consumer install and registry parity remain unverified. |
| `MD-SSR-003`, `MD-REL-002` | 🌗 partial / unverified-external | Astro/local ordering and package metadata are observed; generic-host and registry/public verification remain external follow-ups. |

Current consumer evidence is local: remark-relgeo 16/16 tests,
remark-relgeo-hl 10 Vitest plus 1 Node package-boundary test, shared conformance
298/298 across 23 fixtures, and the Astro consumer with 0 diagnostics and 138
pages. The full integration runner requires Node 24+ and is environment
unavailable on the current Node 22.23.2 host; no CI, registry, deployment, or
public claim is inferred.

## Historical capability inventory — 2026-11-03

| Capability | Status | Evidence | Gap / limitation | Consumer | Dependency | Next action |
|---|---:|---|---|---|---|---|
| Detect relgeo fence and emit preview-only output | ✔️ | remark-relgeo/src/index.ts; 5/5 package tests; docs-site assertions | No source exposure in success path; only current mdast code-node shape is tested | Astro docs-site and remark consumers | mdast/unist visitor | Retain stable output contract and add a real unified integration fixture |
| Compile through core and render through renderer-svg | ✔️ | compileRelGeo + renderToSVG calls; preview test decodes SVG data URI | Inherited core/renderer support is bounded by their contracts; no package-level typed error taxonomy | Preview/embed consumers | @relgeo/core, @relgeo/renderer-svg | Track compatibility against core/renderer release line |
| Fence metadata: padding, unit, sheet, profile | 🌗 | Source parser and test for padding, unit, sheet; profile is passed through | Unknown keys are ignored; invalid numeric values are silently omitted; no exhaustive option matrix | Docs authors and site content | Core compile options; renderer sheet support | Add invalid/unknown/profile cases and define strictness policy |
| Custom preview render hook | ✔️ | RemarkRelgeoOptions.renderPreview; test 3 | Hook returns arbitrary SVG string and is not validated/sanitized by plugin | Advanced remark consumers | Consumer-owned renderer | Document trust boundary and whether raw hook output is allowed |
| Safe preview fallback on render failure | ✔️ | Catch in source; test 4; site build asserts no preview-error in built pages | Error class/source is not typed; message policy is not separated into author/system modes | Docs build pipeline | Core/renderer errors | Add structured error metadata if consumers need actionable reporting |
| Detect rg fence and preserve readable source | ✔️ | remark-relgeo-hl/src/index.ts; docs-site built assertion; README output contract | No package test currently proves non-rg isolation, whitespace, or metadata preservation | Astro docs-site and generic remark consumers | mdast/unist visitor | Add a dedicated test suite for basic output contract |
| Semantic token spans from language-service | ✔️ | getSemanticTokens integration; 6 highlighter tests; docs-site output assertion | Plugin does not own token taxonomy; coverage follows language-service | Syntax docs and CSS styling | @relgeo/language-service, core parser | Keep token taxonomy versioned at the language-service boundary |
| Stable line/token classes and data attributes | ✔️ | rg-line, relgeo-hl__token--*, data-line, data-token-kind; site CSS and built assertions | Token kind naming is coupled to language-service taxonomy; no compatibility policy for renames | Site CSS, downstream Markdown styling | Token taxonomy | Version/document taxonomy before adding or renaming classes |
| Cross-consumer token taxonomy contract | ⏸️ | remark-relgeo-hl delegates token kinds to language-service; development plan lists taxonomy design as an active concern | No independently versioned contract says which token kinds downstream CSS may rely on across language-service releases | Docs-site and future Markdown consumers | language-service token API; package release policy | Decide and document stable versus experimental token classes before broad adoption |
| HTML escaping for exported helper | 🌗 | escapeHtml and buildHighlightedHtml in render.ts | Raw-string API has no tests; class/token values are interpolated from semantic data | Consumers calling exported helper | Language-service token kinds | Add boundary tests for source, block IDs, and unexpected token kinds |
| Highlight fallback when language service fails | ✔️ | Injected service failure test; source-preserving fallback; strict-mode test; deterministic repeated transform test | No independent lexical fallback mode; bounded plain-source fallback is the contract | Any consumer with unavailable/broken language service | Peer dependency and runtime service | Preserve fallback payload and strict/tolerant policy |
| Preserve valid preview with non-fatal runtime diagnostics | ✔️ | Fixture 14; 9 remark-relgeo tests; tolerant preview and strict warning tests | Core constraint warning vocabulary is projected by remark-relgeo; broader runtime taxonomy remains core-owned | Docs authors and Markdown hosts | @relgeo/core, @relgeo/renderer-svg | Keep diagnostic payload stable and retain image output |
| Preview/highlight separation | ✔️ | Separate fences, packages, READMEs, docs content, and site assertions that preview has no source | Pairing both requires consumer configuration; plugins do not coordinate them | Authors choosing source vs rendered artifact | Both package APIs | Keep boundaries explicit in docs and versioning |
| Official Astro integration | ✔️ | astro.config.mjs, English/Indonesian markdown examples, pnpm test, pnpm check | Current evidence uses workspace symlinked packages; no clean registry install | relgeo.github.io | Astro, remark, rehype, both plugins | Verify a clean lockfile install in CI/release workflow |
| Public package metadata and exports | 🌗 | Manifests, dist, README, MIT license, ESM/CJS/types, public publish config | Publish readiness is metadata-only; no pack/publish/consumer install evidence | npm consumers | npm registry and release process | Run package pack/install smoke from a clean temp consumer |
| Independent remark-relgeo-hl test coverage | ✔️ | 6 Vitest tests; build/lint; source-preserving and deterministic failure-injection coverage | Lexical fallback independent of semantic service remains out of scope | Package maintainers and downstream consumers | Vitest/test fixtures | Extend only when a new public token contract is agreed |
| Full language-service/parser semantic guarantee | ➖ | Plugin delegates to language-service/core; spec is authoritative | Not a Markdown plugin responsibility; plugin tests should observe, not redefine language semantics | Core/language-service owners | spec, core, language-service | Keep semantic contract in core/language-service matrices |
| Registry parity with workspace consumer | ⚠️ | Workspace plugin/site are 0.5.0 but core/language-service source are 0.5.1; site lockfile records 0.5.0 while local node_modules symlink to workspace sources | Local site pass is not clean registry-only proof | npm users and published docs site | Package release/version synchronization | Add clean install/package-consumer evidence and reconcile version line |
| Raw SVG/PNG asset production from Markdown plugin | ➖ | remark-relgeo emits an image data URI; plans exclude general export formats | General asset pipeline is outside plugin contract | Site asset pipeline | Renderer/export strategy | Do not expand without a concrete consumer requirement |

## Historical priority and dependency order

1. **P1 — verify release boundary:** run clean package pack/install smoke and
   reconcile local workspace 0.5.1 dependencies with the site lockfile's 0.5.0
   registry resolution.
2. **P1 — harden preview metadata:** specify invalid/unknown option behavior and
   test profile, sheet selection, and unit conversion explicitly.
3. **P2 — add generic unified integration evidence:** prove the AST transforms
   through an actual remark/rehype pipeline outside current synthetic-tree tests.

## Historical conclusion

The Markdown surfaces are real and consumed by the official site. Preview/embed
and highlighting now have focused package tests, delegated canonical semantics,
safe fallback behavior, and stable diagnostic output. Non-fatal runtime warnings
retain valid preview images in tolerant mode while strict mode remains explicit.
The local checks therefore verify workspace-linked integration, not a clean
registry release or complete cross-repository package parity.
