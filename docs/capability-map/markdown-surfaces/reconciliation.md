# Markdown Surfaces Expected-versus-Observed Reconciliation

**Reconciliation date:** 2026-10-30
**Expected source:** [`markdown-surfaces/expected-capability-catalog.md`](./expected-capability-catalog.md)
**Observed source:** [`markdown-surfaces/implementation-audit.md`](./implementation-audit.md)
**Policy/context sources:** [`MATURATION-MASTER-PLAN.md`](../../MATURATION-MASTER-PLAN.md), [`compatibility-matrix.json`](../../compatibility-matrix.json), and [`05-public-docs-and-playground-hardening.md`](../../plans/05-public-docs-and-playground-hardening.md)

## 1. Reconciliation rule

This document is the explicit ID-based join between the expected catalog and
the implementation audit evidence. The expected catalog was completed before
implementation comparison. Every expected ID is retained exactly once,
including capabilities for which the audit found no implementation.

An absent capability remains `❌`; it is never changed to `➖` merely because
implementation or evidence is missing. `➖` is reserved for a deliberate
boundary decision, currently only the non-interactive-control row
`MD-A11Y-003`.

The dimensions below are intentionally independent:

| Dimension | Meaning |
| --- | --- |
| `Result` | Compact reconciliation outcome for the expected user outcome. |
| `Implementation status` | The audit's observed status: `implemented`, `partial`, `broken`, `absent`, `deferred`, `not applicable`, or `unverified`. |
| `Evidence status` | Strength and reach of the evidence: local direct checks, partial local checks, external evidence not run, or deferred physical validation. |
| `Scope decision` | Whether the capability is in the plugin scope, a cross-boundary responsibility, or explicitly not applicable. |

### Result legend

| Result | Meaning |
| --- | --- |
| `✅ implemented` | The expected outcome is implemented at the audited boundary. |
| `🌗 partial` | A usable slice exists, but part of the contract, consumer, fallback, or evidence is missing. |
| `⚠️ broken` | A reproducible defect contradicts the expected or documented behavior. |
| `❌ absent` | The expected capability is not implemented at this boundary. The row remains explicit. |
| `⏸️ deferred` | The capability is intentionally postponed by scope or dependency decision. |
| `➖ not applicable` | The capability is outside the current plugin responsibility. This is not a synonym for absent. |

## 2. Coverage and reconciliation counts

| Check | Result |
| --- | ---: |
| Expected catalog rows | 38 |
| Reconciliation rows | 38 |
| Missing expected IDs | 0 |
| Duplicate reconciliation IDs | 0 |
| Observed-only IDs | 0 |
| `✅ implemented` | 8 |
| `🌗 partial` | 24 |
| `⚠️ broken` | 1 |
| `❌ absent` | 4 |
| `➖ not applicable` | 1 |
The two external-boundary rows are `🌗 partial` implementation results because
the local Astro/workspace slice is observed while the required external
boundary remains unverified. Their separate evidence value is
`unverified-external`; they are not reclassified as absent. Physical mobile and
assistive-technology checks remain deferred evidence for the relevant
accessibility rows.

## 3. One-to-one reconciliation register

The audit trace for every row is the matching ID in
[the current audit disposition](./implementation-audit.md#capability-by-capability-disposition).
The paths and probes named in the trace are evidence, not additional expected
capabilities.

| ID | Expected user outcome | Result | Implementation status | Evidence status | Scope decision | Audit evidence / gap |
| --- | --- | --- | --- | --- | --- | --- |
| `MD-FENCE-001` | Recognize `relgeo`/`rg` fences without touching other languages. | `🌗 partial` | `partial` | `partial-local` | in scope | Both plugins support one configurable fence (`relgeo` or `rg`); no shared alias contract or alias matrix test. |
| `MD-FENCE-002` | Preserve source, whitespace, info metadata, and block boundaries. | `🌗 partial` | `partial` | `partial-local` | in scope | Matching mdast code nodes retain metadata and highlighter text; full remark/rehype preservation is not directly tested. |
| `MD-FENCE-003` | Process mixed and multiple blocks deterministically. | `🌗 partial` | `partial` | `partial-local` | in scope | `unist-util-visit` isolates matching nodes and selected fixtures pass; no dedicated mixed-block ordering test. |
| `MD-PREVIEW-001` | Render a valid RelGeo fence as an embeddable preview. | `✅ implemented` | `implemented` | `verified-local` | in scope | `remark-relgeo` delegates to core and renderer-SVG; package tests, conformance, and website assertions pass. |
| `MD-PREVIEW-002` | Keep model preview as default with explicit sheet/view selection. | `🌗 partial` | `partial` | `partial-local` | in scope | `sheet`, `profile`, and `unit` metadata reach the renderer; no explicit view option or complete presentation contract. |
| `MD-PREVIEW-003` | Reuse canonical parse, validation, resolution, and rendering semantics. | `✅ implemented` | `implemented` | `verified-local` | boundary only — core/renderer own semantics | Source calls `compileRelGeo` and `renderToSVG`; fixture output matches the canonical preview path. |
| `MD-PREVIEW-004` | Preserve surrounding headings, paragraphs, lists, links, and adjacent Markdown. | `🌗 partial` | `partial` | `verified-local` | in scope | Transform targets only matching code nodes and the site builds, but current output remains under `pre > div` because the unwrap helper expects a different wrapper class. |
| `MD-HL-001` | Highlight RelGeo source with readable semantic token output. | `✅ implemented` | `implemented` | `verified-local` | in scope | Highlighter emits `pre > code`, line wrappers, token spans, and stable classes; tests and site output assert token kinds. |
| `MD-HL-002` | Keep partial or invalid source visible without crashing the build. | `⚠️ broken` | `broken` | `verified-local` | in scope | Normal invalid source remains readable, but an injected `getSemanticTokens()` throw aborts the transform; documented fallback is not implemented. |
| `MD-HL-003` | Keep token classes, whitespace, line breaks, and copy/wrap behavior stable. | `✅ implemented` | `implemented` | `verified-local` | in scope | `rg-line`, `data-line`, token-kind classes, whitespace text nodes, and escaping are implemented and consumed by site CSS. |
| `MD-HL-004` | Keep highlighting isolated from semantic resolution and preview success. | `🌗 partial` | `partial` | `partial-local` | boundary only — lexical contract follows language-service | The plugin uses language-service tokenization and no renderer, but service failure is not isolated and no independent fallback mode exists. |
| `MD-DIAG-001` | Emit structured diagnostic code, severity, message, and location. | `❌ absent` | `absent` | `verified-local` | boundary only — vocabulary from spec/core | Neither plugin emits a structured diagnostic envelope, source range, severity, or stable code. |
| `MD-DIAG-002` | Render actionable source/build diagnostics while retaining readable fallback. | `🌗 partial` | `partial` | `partial-local` | in scope — host owns visual presentation | Preview shows `Preview unavailable.` and an exception message, but the payload is plain text and highlighter service failure aborts. |
| `MD-DIAG-003` | Preserve a valid preview when a runtime diagnostic is non-fatal. | `❌ absent` | `absent` | `verified-local` | in scope | Preview receives a compiled scene or thrown error; no non-fatal diagnostic path preserves preview plus diagnostic. |
| `MD-DIAG-004` | Offer an explicit tolerant versus strict failure policy. | `❌ absent` | `absent` | `verified-local` | in scope | No strict/tolerant option or documented policy switch exists; invalid metadata is silently ignored. |
| `MD-OPT-001` | Document option schema, defaults, and safe instance reuse. | `🌗 partial` | `partial` | `partial-local` | in scope | Interfaces and README expose options, but invalid values, unknown keys, and exhaustive defaults are not diagnosed or tested. |
| `MD-OPT-002` | Pass through DSL version, profile, view, and sheet selection. | `🌗 partial` | `partial` | `partial-local` | in scope | Profile/sheet/unit pass through and core handles version; no plugin version/view option, and future version becomes a generic placeholder. |
| `MD-OPT-003` | Configure controlled output/presentation and code-class behavior. | `🌗 partial` | `partial` | `partial-local` | in scope | Class prefixes and custom render hook are configurable; asset strategy/base URL is not, and raw custom SVG is trusted. |
| `MD-OPT-004` | Configure diagnostic and fallback policy for invalid input. | `❌ absent` | `absent` | `verified-local` | in scope | Preview always catches and substitutes a placeholder; callers cannot select warning/fallback versus hard-failure behavior. |
| `MD-SSR-001` | Execute safely in SSR and static builds without browser globals. | `🌗 partial` | `partial` | `partial-local; generic host unverified` | in scope | Node-compatible source and official Astro static build pass; standalone unified/SSR hosts were not run. |
| `MD-SSR-002` | Produce deterministic output for identical source and options. | `✅ implemented` | `implemented` | `verified-local` | in scope | Exact SVG/highlight fixture checks and the inspected repeated static build are stable; all options and hosts are not covered. |
| `MD-SSR-003` | Support a documented unified/remark ordering contract. | `🌗 partial` | `partial` | `unverified-external` | in scope — consumer ordering | Astro registers highlighter, preview, and rehype unwrap successfully, but no standalone remark-parse → remark-rehype → rehype-stringify fixture or alternate host was run. |
| `MD-SSR-004` | Provide reproducible public package exports and types to a fresh consumer. | `🌗 partial` | `partial` | `unverified-external` | in scope | ESM/CJS/types and local exports build; fresh `npm pack`/registry install/temporary consumer parity was not run. |
| `MD-ASSET-001` | Use a deterministic inline or asset URL policy across local, Pages, and SSR builds. | `🌗 partial` | `partial` | `verified-local` | in scope | Preview uses deterministic SVG data URIs and the Pages artifact carries them; strategy is fixed and not configurable. |
| `MD-ASSET-002` | Avoid implicit filesystem or network dependencies. | `✅ implemented` | `implemented` | `verified-local` | in scope | Plugin source reads source/meta and caller hooks only; no filesystem or network access appears in the default path. |
| `MD-ASSET-003` | Safely escape/sanitize generated HTML, SVG, and URLs. | `🌗 partial` | `partial` | `partial-local` | in scope | AST text and helper escaping are safe on the normal path; caller-supplied raw SVG is trusted and has no sanitizer/URL policy. |
| `MD-A11Y-001` | Give preview output accessible wrapper and SVG naming/context. | `🌗 partial` | `partial` | `partial-local` | in scope — plugin plus website | Preview has an alt label and the site shell passes checks, but no SVG title/desc, figure semantics, source-derived label, or clean wrapper. |
| `MD-A11Y-002` | Keep source, errors, and fallback readable without color-only meaning. | `🌗 partial` | `partial` | `partial-local; physical AT deferred` | in scope | Text fallback, visible errors, alt text, and CSS checks exist; no explicit non-color token/ARIA contract or physical screen-reader run. |
| `MD-A11Y-003` | Avoid accidental focus traps or interaction requirements in static embeds. | `➖ not applicable` | `not applicable` | `not-applicable` | not applicable — no plugin-owned controls | Current transforms emit no interactive controls or focus management. Future controls require a separate host capability decision. |
| `MD-ERR-001` | Handle malformed input and unsupported fences contextually and safely. | `🌗 partial` | `partial` | `verified-local` | in scope | Preview catches compile/render exceptions and non-matching fences are untouched; highlighter has no service-failure catch and lacks block location context. |
| `MD-ERR-002` | Distinguish active, legacy, and future DSL version policy. | `🌗 partial` | `partial` | `verified-local` | in scope — projection of spec/core policy | Core produces an unsupported-version message and preview shows it, but the plugin exposes no stable diagnostic category/code. |
| `MD-ERR-003` | Map runtime/render failures to readable, safe, non-partial output. | `🌗 partial` | `partial` | `partial-local` | in scope — core/renderer failure projection | Preview avoids partial HTML with a placeholder, but errors are untyped, custom SVG is trusted, and non-fatal runtime diagnostics are absent. |
| `MD-WEB-001` | Consume highlighting and preview on the correct website documentation surfaces. | `✅ implemented` | `implemented` | `verified-local` | boundary only — website owns presentation | EN/ID docs use `rg` for source and `relgeo` for rendered output; Astro registers both plugins and disables built-in highlighting. |
| `MD-WEB-002` | Carry tested Markdown output into the Pages artifact. | `✅ implemented` | `implemented` | `verified-local` | boundary only — website/delivery owner | Website build, output assertions, Playground assembly, and Pages artifact checks pass locally; deployed smoke is not current evidence. |
| `MD-WEB-003` | Keep spec provenance and package version explicit in website content. | `🌗 partial` | `partial` | `partial-local` | boundary only — website/spec/package owners | Website separates normative spec content and declares the 0.5 line, but clean lockfile/registry parity and plugin provenance fields are not verified. |
| `MD-WEB-004` | Preserve localized routes, responsive technical readability, and public subpath compatibility. | `🌗 partial` | `partial` | `partial-local; public/physical checks deferred` | boundary only — website owner | EN/ID routes, navigation, CSS, and local build pass; deployed public smoke and physical/mobile readability are not current evidence. |
| `MD-REL-001` | Provide independent public APIs, docs, examples, and ordering/error guidance. | `🌗 partial` | `partial` | `partial-local` | in scope | Both packages expose metadata, README, exports, types, and scripts; highlighter has only three unit tests and docs omit full options/error contracts. |
| `MD-REL-002` | Conform to the DSL compatibility line and ecosystem release order. | `🌗 partial` | `partial` | `unverified-external` | in scope — release contract | Manifests and compatibility matrix declare 0.5.0/0.5 and highlighter-before-preview order; registry publication/install parity was not verified. |

## 4. Reconciliation findings and handoff

The join makes the current gap map explicit:

- `MD-HL-002` is a confirmed broken fallback: a language-service exception
  aborts the highlighter transform instead of preserving source text.
- `MD-PREVIEW-004` is partial at the official website boundary because the
  current rehype helper leaves a `pre > div` wrapper around preview output.
- `MD-DIAG-001`, `MD-DIAG-003`, `MD-DIAG-004`, and `MD-OPT-004` remain explicit
  `❌` rows: no implementation was found for structured diagnostics, non-fatal
  diagnostic preservation, strict/tolerant policy, or caller-selected fallback
  policy.
- `MD-A11Y-003` is the only `➖` row because the current plugin boundary owns no
  interactive controls. It is not a substitute for any missing accessibility
  output capability.
- Generic SSR, clean registry/package parity, deployed public smoke, and
  physical accessibility checks remain evidence limitations or deferred scope;
  they are not converted to implementation absence without a failed target
  observation.

This reconciliation is ready to feed the downstream Markdown status matrix and
gap backlog. Implementation work remains separate from this evidence register.

## 5. Primary evidence

- [Expected capability catalog](./expected-capability-catalog.md)
- [Implementation audit evidence](./implementation-audit.md)
- [Historical Markdown capability matrix](./capability-matrix.md)
- [Maturation master plan](../../MATURATION-MASTER-PLAN.md)
- [Compatibility matrix](../../compatibility-matrix.json)
- [Public docs and Playground hardening plan](../../plans/05-public-docs-and-playground-hardening.md)
