# Markdown Surfaces Expected-versus-Observed Reconciliation

**Reconciliation date:** 2026-11-13
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
| `✅ implemented` | 27 |
| `⏸️ deferred` | 10 |
| `⚠️ broken` | 0 |
| `❌ absent` | 0 |
| `➖ not applicable` | 1 |
The remaining deferred rows are explicit scope decisions, not hidden failures.
Each has an owner, non-blocking rationale, and reopen condition in the final
closure report and status matrix. Registry parity, public deployment/mobile
readability, and physical assistive-technology checks remain separate
boundaries.

## 3. One-to-one reconciliation register

The audit trace for every row is the matching ID in
[the current audit disposition](./implementation-audit.md#capability-by-capability-disposition).
The paths and probes named in the trace are evidence, not additional expected
capabilities.

| ID | Expected user outcome | Result | Implementation status | Evidence status | Scope decision | Audit evidence / gap |
| --- | --- | --- | --- | --- | --- | --- |
| `MD-FENCE-001` | Recognize `relgeo`/`rg` fences without touching other languages. | `✅ implemented` | `implemented` | `verified-local` | in scope | Package defaults remain `relgeo` for preview and `rg` for highlighting; explicit overrides, non-target isolation, and focused alias tests pass. |
| `MD-FENCE-002` | Preserve source, whitespace, info metadata, and block boundaries. | `✅ implemented` | `implemented` | `verified-local` | in scope | Focused preview AST tests preserve exact source, metadata, position, and surrounding nodes; highlighter fallback preserves source text. |
| `MD-FENCE-003` | Process mixed and multiple blocks deterministically. | `✅ implemented` | `implemented` | `verified-local` | in scope | Repeated mixed target/non-target/malformed blocks produce identical transformed trees and preserve block order/isolation. |
| `MD-PREVIEW-001` | Render a valid RelGeo fence as an embeddable preview. | `✅ implemented` | `implemented` | `verified-local` | in scope | `remark-relgeo` delegates to core and renderer-SVG; safe SVG data-URI checks, package tests, conformance, and website assertions pass. |
| `MD-PREVIEW-002` | Keep model preview as default with explicit sheet/view selection. | `✅ implemented` | `implemented` | `verified-local` | in scope | Default model preview, canonical sheet selection, metadata pass-through, invalid metadata fallback, and strict failure are covered; view selection remains defined by canonical sheet/view DSL definitions, with no standalone plugin `view` option. |
| `MD-PREVIEW-003` | Reuse canonical parse, validation, resolution, and rendering semantics. | `✅ implemented` | `implemented` | `verified-local` | boundary only — core/renderer own semantics | Source calls `compileRelGeo` and `renderToSVG`; semantic replay uses the renderer comparator, while fixture SVG bytes remain reviewable output snapshots only. |
| `MD-PREVIEW-004` | Preserve surrounding headings, paragraphs, lists, links, and adjacent Markdown. | `✅ implemented` | `implemented` | `verified-local` | in scope | The website rehype helper now replaces the generated outer `pre` with the preview wrapper; localized built-output assertions confirm clean structure and surrounding Markdown remains intact. |
| `MD-HL-001` | Highlight RelGeo source with readable semantic token output. | `✅ implemented` | `implemented` | `verified-local` | in scope | Highlighter emits `pre > code`, line wrappers, token spans, and stable classes; tests and site output assert token kinds. |
| `MD-HL-002` | Keep partial or invalid source visible without crashing the build. | `✅ implemented` | `implemented` | `verified-local` | in scope | Token-service failures now produce a source-preserving `pre > code` fallback with `HIGHLIGHT_SERVICE_FAILED` diagnostic; strict mode remains the explicit throw path. |
| `MD-HL-003` | Keep token classes, whitespace, line breaks, and copy/wrap behavior stable. | `✅ implemented` | `implemented` | `verified-local` | in scope | `rg-line`, `data-line`, token-kind classes, whitespace text nodes, and escaping are implemented and consumed by site CSS. |
| `MD-HL-004` | Keep highlighting isolated from semantic resolution and preview success. | `✅ implemented` | `implemented` | `verified-local` | boundary only — lexical contract follows language-service | Explicit service opt-out now emits source-preserving lexical `pre > code` without core/renderer; service failure and strict behavior remain bounded by focused tests. |
| `MD-DIAG-001` | Emit structured diagnostic code, severity, message, and location. | `✅ implemented` | `implemented` | `verified-local` | boundary only — vocabulary from spec/core | Both plugins serialize stable code, severity, message, phase, and fenced-block/source location in `data-relgeo-diagnostic`; focused tests cover preview and highlighter failures. |
| `MD-DIAG-002` | Render actionable source/build diagnostics while retaining readable fallback. | `✅ implemented` | `implemented` | `verified-local` | in scope — host owns visual presentation | Preview errors retain visible fallback text and structured payload; highlighter failures preserve readable source, and the website consumer asserts successful output remains source-free. |
| `MD-DIAG-003` | Preserve a valid preview when a runtime diagnostic is non-fatal. | `✅ implemented` | `implemented` | `verified-local` | in scope | Fixture 14 produces a stable `RUNTIME_CONSTRAINT_VIOLATION` warning while tolerant output retains the valid preview image; strict mode throws explicitly. |
| `MD-DIAG-004` | Offer an explicit tolerant versus strict failure policy. | `✅ implemented` | `implemented` | `verified-local` | in scope | Both plugin boundaries document a tolerant default and strict policy; focused tests prove fallback versus deterministic `RemarkRelgeoError`/`RemarkRelgeoHlError` behavior. |
| `MD-OPT-001` | Document option schema, defaults, and safe instance reuse. | `✅ implemented` | `implemented` | `verified-local` | in scope | README/types document defaults and validation; invalid known values fail deterministically, unknown keys are ignored/not forwarded, and focused package tests cover the contract. |
| `MD-OPT-002` | Pass through DSL version, profile, view, and sheet selection. | `⏸️ deferred` | `deferred` | `deferred-scope` | explicit hold — remark-relgeo + spec/core | Current profile/sheet/unit behavior is tested; version/view option expansion waits for an approved core/spec API contract. |
| `MD-OPT-003` | Configure controlled output/presentation and code-class behavior. | `⏸️ deferred` | `deferred` | `deferred-scope` | explicit hold — both plugins + renderer/website | Fixed inline asset strategy and bounded custom-output rejection are the accepted 0.5.x boundary; configurable strategy/general sanitizer waits for a separate policy. |
| `MD-OPT-004` | Configure diagnostic and fallback policy for invalid input. | `✅ implemented` | `implemented` | `verified-local` | in scope | `failurePolicy` documents and tests tolerant fallback versus strict failure for preview errors; no release or deployment dependency is required. |
| `MD-SSR-001` | Execute safely in SSR and static builds without browser globals. | `✅ implemented` | `implemented` | `verified-local` | in scope | Generic Node unified/SSR harness and Astro static build pass without browser globals; malformed preview remains block-scoped. |
| `MD-SSR-002` | Produce deterministic output for identical source and options. | `✅ implemented` | `implemented` | `verified-local` | in scope | Exact SVG/highlight fixture checks and the inspected repeated static build are stable; all options and hosts are not covered. |
| `MD-SSR-003` | Support a documented unified/remark ordering contract. | `✅ implemented` | `implemented` | `verified-local` | in scope — consumer ordering | Generic host harness executes and asserts `remark-parse → remark-relgeo-hl → remark-relgeo → remark-rehype → host normalization → stringify`, including highlight-before-preview ordering. |
| `MD-SSR-004` | Provide reproducible public package exports and types to a fresh consumer. | `✅ implemented` | `implemented` | `verified-local` | in scope | Packed artifacts expose ESM/CJS/types and a fresh temporary consumer installs and loads both without sibling-source paths; registry parity remains separate. |
| `MD-ASSET-001` | Use a deterministic inline or asset URL policy across local, Pages, and SSR builds. | `⏸️ deferred` | `deferred` | `deferred-scope` | explicit hold — remark-relgeo + website | Deterministic inline data URI is the accepted 0.5.x policy; alternate asset modes require a future concrete host requirement. |
| `MD-ASSET-002` | Avoid implicit filesystem or network dependencies. | `✅ implemented` | `implemented` | `verified-local` | in scope | Plugin source reads source/meta and caller hooks only; no filesystem or network access appears in the default path. |
| `MD-ASSET-003` | Safely escape/sanitize generated HTML, SVG, and URLs. | `⏸️ deferred` | `deferred` | `deferred-scope` | explicit hold — both plugins + host | Normal paths and bounded executable-tag/handler/URL rejection are verified; a general sanitizer/URL policy requires separate security scope. |
| `MD-A11Y-001` | Give preview output accessible wrapper and SVG naming/context. | `✅ implemented` | `implemented` | `verified-local` | in scope — plugin plus website | Preview emits deterministic `figure`/`role`/`aria-label`/`img alt` semantics and escaped SVG title/description metadata; preview contract and website assertions pass. |
| `MD-A11Y-002` | Keep source, errors, and fallback readable without color-only meaning. | `⏸️ deferred` | `deferred` | `deferred-scope` | explicit hold — both plugins + website | Readable source/error fallback is locally verified; broader non-color/ARIA contract and physical AT run require a separately approved accessibility scope. |
| `MD-A11Y-003` | Avoid accidental focus traps or interaction requirements in static embeds. | `➖ not applicable` | `not applicable` | `not-applicable` | not applicable — no plugin-owned controls | Current transforms emit no interactive controls or focus management. Future controls require a separate host capability decision. |
| `MD-ERR-001` | Handle malformed input and unsupported fences contextually and safely. | `✅ implemented` | `implemented` | `verified-local` | in scope | Preview and highlighter isolate failure to the matching fenced block, serialize context, and preserve neighboring blocks in tolerant mode; strict mode is explicit. |
| `MD-ERR-002` | Distinguish active, legacy, and future DSL version policy. | `⏸️ deferred` | `deferred` | `deferred-scope` | explicit hold — remark-relgeo + spec/core | Core policy and safe visible fallback are implemented; stable plugin-specific error code waits for shared vocabulary governance. |
| `MD-ERR-003` | Map runtime/render failures to readable, safe, non-partial output. | `⏸️ deferred` | `deferred` | `deferred-scope` | explicit hold — remark-relgeo + core/renderer | Safe placeholder and strict adapter error are verified; broader taxonomy/non-fatal projection waits for a cross-surface core contract. |
| `MD-WEB-001` | Consume highlighting and preview on the correct website documentation surfaces. | `✅ implemented` | `implemented` | `verified-local` | boundary only — website owns presentation | EN/ID docs use `rg` for source and `relgeo` for rendered output; Astro registers both plugins and disables built-in highlighting. |
| `MD-WEB-002` | Carry tested Markdown output into the Pages artifact. | `✅ implemented` | `implemented` | `verified-local` | boundary only — website/delivery owner | Website build, output assertions, Playground assembly, and Pages artifact checks pass locally; deployed smoke is not current evidence. |
| `MD-WEB-003` | Keep spec provenance and package version explicit in website content. | `✅ implemented` | `implemented` | `verified-local` | boundary only — website/spec/package owners | Both plugin outputs expose DSL/package-line/plugin provenance and the website built-output assertion compares them with `docs/compatibility-matrix.json`; clean registry parity remains separate. |
| `MD-WEB-004` | Preserve localized routes, responsive technical readability, and public subpath compatibility. | `⏸️ deferred` | `deferred` | `deferred-scope` | explicit hold — website owner | Local EN/ID routes and CSS pass; public deployment/mobile/AT evidence is outside the local closure boundary. |
| `MD-REL-001` | Provide independent public APIs, docs, examples, and ordering/error guidance. | `⏸️ deferred` | `deferred` | `deferred-scope` | explicit hold — package owners | Runtime metadata, README, exports, types, and packed consumer are verified; broader docs/test-depth expansion is follow-on maintenance. |
| `MD-REL-002` | Conform to the DSL compatibility line and ecosystem release order. | `⏸️ deferred` | `deferred` | `deferred-scope` | explicit hold — release/package owners | Workspace metadata and release order are documented; registry publication/install parity is explicitly outside no-publish closure scope. |

## 4. Reconciliation findings and handoff

The join makes the current gap map explicit:

- `MD-HL-002` is now implemented on the local package boundary: a
  language-service exception preserves source text and emits a structured
  fallback diagnostic; strict mode remains an explicit caller choice.
- `MD-PREVIEW-004` is now implemented at the official website boundary: the
  rehype helper replaces the generated outer `pre` with the preview wrapper.
- `MD-DIAG-001`, `MD-DIAG-002`, `MD-DIAG-003`, `MD-DIAG-004`, `MD-ERR-001`,
  and `MD-WEB-003` have focused package/consumer evidence and are promoted to
  `✅ implemented`. `MD-DIAG-003` uses core's retained-scene constraint
  violation as a warning payload; the preview image is not dropped in tolerant
  mode and strict mode remains an explicit caller policy.
- The current local package evidence is remark-relgeo 16/16 tests and
  remark-relgeo-hl 10 Vitest tests plus 1 Node package-boundary test; the
  refreshed shared pipeline passes 677/677 assertions across 33 fixtures.
  Generic-host, package-boundary, preview-contract, and Website/Pages consumer
  validators also pass. Registry/public and physical browser/AT evidence remain
  separate boundaries.
- `MD-A11Y-003` is the only `➖` row because the current plugin boundary owns no
  interactive controls. It is not a substitute for any missing accessibility
  output capability.
- Generic SSR, clean registry/package parity, deployed public smoke, and
  physical accessibility checks remain evidence limitations or deferred scope;
  they are not converted to implementation absence without a failed target
  observation.
- The 2026-11-13 conformance refresh closes `MD-SSR-001`, `MD-SSR-003`,
  `MD-SSR-004`, and `MD-A11Y-001` with direct generic-host, packed-consumer,
  preview-contract, and conformance evidence. The 2026-11-04 implementation
  refresh closes `MD-FENCE-001`,
  `MD-FENCE-002`, `MD-FENCE-003`, `MD-PREVIEW-002`, `MD-HL-004`, and
  `MD-OPT-001` with package source and focused tests. Registry parity, public
  deployment, Node 24 parity, and physical accessibility remain external or
  deferred evidence boundaries and do not downgrade the locally verified rows.

This reconciliation is ready to feed the downstream Markdown status matrix and
gap backlog. Implementation work remains separate from this evidence register.

The pre-implementation contract and acceptance lock for the seven selected
P0/P1 rows is recorded in the [Markdown gap backlog contract section](./implementation-gap-backlog.md#contract-and-acceptance-lock--selected-tranche-2026-11-04).
It preserves the `0.5.x` compatibility line and separates local implementation
acceptance from generic-host, registry, deployed, and physical-accessibility
evidence that is not currently verified.

## 5. Primary evidence

- [Expected capability catalog](./expected-capability-catalog.md)
- [Implementation audit evidence](./implementation-audit.md)
- [Historical Markdown capability matrix](./capability-matrix.md)
- [Maturation master plan](../../MATURATION-MASTER-PLAN.md)
- [Compatibility matrix](../../compatibility-matrix.json)
- [Public docs and Playground hardening plan](../../plans/05-public-docs-and-playground-hardening.md)
