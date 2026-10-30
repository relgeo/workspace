# Markdown surfaces bounded in-scope selection

**Date:** 2026-10-30  
**Task:** `select-and-bound-in-scope-capability-debt--1182565605`  
**Status:** bounded active selection; selection is not implementation or
completion evidence  
**Owner boundary:** `remark-relgeo` owns preview/embed transformation,
diagnostic/fallback policy, and preview output safety. `remark-relgeo-hl` owns
source-preserving highlighting and its failure boundary. The official website
owns Markdown consumer assembly and provenance assertions. `spec/id`, core,
renderer-svg, and language-service remain semantic authorities where named
below.

## Decision

This tranche selects eight actionable gaps from the expected capability
catalog, implementation audit, and implementation-gap backlog. It is bounded
to safe local Markdown transformation and the official website consumer:
preview wrapper correctness, source-highlighting recovery, block-scoped
diagnostics, caller-selected failure policy, generated-output safety,
per-block isolation, and package/spec provenance.

The selection does not require npm publication, registry installation, a
deployed-site smoke, or a release-order decision. The current status symbols
are intake values from the audit/backlog; this record does not promote any
capability to `✔️`.

## Evidence and selection inputs

| Input | Role in this selection |
| --- | --- |
| [Expected capability catalog](./expected-capability-catalog.md) | Defines stable expected IDs, normative owners, source-of-truth paths, and plugin/website boundaries. |
| [Implementation audit](./implementation-audit.md) | Records the observed source/test paths, confirmed highlighter defect, partial contracts, and verification limits. |
| [Implementation-gap backlog](./implementation-gap-backlog.md) | Supplies candidate task IDs, status symbols, owners, dependencies, scope, and acceptance targets. |
| [`remark-relgeo/`](../../../remark-relgeo/) and [`remark-relgeo-hl/`](../../../remark-relgeo-hl/) | Primary package boundaries for implementation, package tests, and local build/lint evidence. |
| [`relgeo.github.io/`](../../../relgeo.github.io/) | Official Markdown consumer boundary for AST assembly, output assertions, and provenance checks. |

## Bounded active selection

Each row has one expected capability ID, one backlog candidate, an honest
status symbol, an owner, source-of-truth path, observed implementation/test
path, contract boundary, and explicit acceptance behavior. Dependencies are
sequencing constraints, not additional scope.

| Selected task / expected ID | Status | Owner | Source of truth | Observed implementation / test paths | Contract boundary | Explicit acceptance behavior |
| --- | --- | --- | --- | --- | --- | --- |
| `MD-TASK-005` — clean preview wrapper integration (`MD-PREVIEW-004`) | `🌗` | `remark-relgeo` + website | [`expected-capability-catalog.md`](./expected-capability-catalog.md) (`MD-PREVIEW-004`); [`implementation-audit.md`](./implementation-audit.md) row `MD-PREVIEW-004`; [`implementation-gap-backlog.md`](./implementation-gap-backlog.md) row `MD-TASK-005`; unified/mdast and rehype contracts | [`remark-relgeo/src/index.ts`](../../../remark-relgeo/src/index.ts); [`remark-relgeo/test/remark-relgeo.test.mjs`](../../../remark-relgeo/test/remark-relgeo.test.mjs); [`relgeo.github.io/astro.config.mjs`](../../../relgeo.github.io/astro.config.mjs); [`relgeo.github.io/scripts/assert-built-output.mjs`](../../../relgeo.github.io/scripts/assert-built-output.mjs) | The plugin transforms only the matching code node; the website owns the rehype assembly. The result must not rely on an invalid `pre > div` shape or take over surrounding Markdown rendering. | Valid and failed preview blocks compile into the agreed wrapper without `pre > div` nesting; headings, paragraphs, lists, and adjacent fences remain intact in a real remark/rehype fixture and the website built-output assertion passes. |
| `MD-TASK-006` — highlighter service-failure fallback (`MD-HL-002`) | `⚠️` | `remark-relgeo-hl` + language-service | [`remark-relgeo-hl/README.md`](../../../remark-relgeo-hl/README.md); [`expected-capability-catalog.md`](./expected-capability-catalog.md) (`MD-HL-002`); [`implementation-audit.md`](./implementation-audit.md) row `MD-HL-002`; backlog row `MD-TASK-006` | [`remark-relgeo-hl/src/index.ts`](../../../remark-relgeo-hl/src/index.ts); [`remark-relgeo-hl/src/render.ts`](../../../remark-relgeo-hl/src/render.ts); [`remark-relgeo-hl/src/__tests__/remark_relgeo_hl.test.ts`](../../../remark-relgeo-hl/src/__tests__/remark_relgeo_hl.test.ts) | Language-service owns token semantics; the highlighter owns containment and source projection. A token-service exception must not become a whole-document Markdown failure. | Injected `getSemanticTokens()` failure completes the transform, preserves the original source as safe `pre > code` text, marks the bounded fallback state, and leaves unrelated blocks transformable. |
| `MD-TASK-008` — structured Markdown diagnostic DTO (`MD-DIAG-001`) | `❌` | Both plugins + spec/core | [`spec/id/core/06-error-model.md`](../../../spec/id/core/06-error-model.md); [`expected-capability-catalog.md`](./expected-capability-catalog.md) (`MD-DIAG-001`); [`implementation-audit.md`](./implementation-audit.md) row `MD-DIAG-001`; backlog row `MD-TASK-008` | [`remark-relgeo/src/index.ts`](../../../remark-relgeo/src/index.ts); [`remark-relgeo-hl/src/index.ts`](../../../remark-relgeo-hl/src/index.ts); both package test directories; core diagnostic/error paths cited by the audit | Spec/core remain authoritative for diagnostic codes and meaning. Plugins add Markdown block context and source location; they must not invent a second semantic error taxonomy. | Invalid or failed blocks expose a stable serializable diagnostic containing code/category, severity, message, and block/source location according to an explicit nullable rule; valid neighboring blocks remain usable and serialization tests pass. |
| `MD-TASK-009` — actionable diagnostic fallback (`MD-DIAG-002`) | `🌗` | `remark-relgeo` + website | [`docs/plans/05-public-docs-and-playground-hardening.md`](../../plans/05-public-docs-and-playground-hardening.md); [`expected-capability-catalog.md`](./expected-capability-catalog.md) (`MD-DIAG-002`); [`implementation-audit.md`](./implementation-audit.md) row `MD-DIAG-002`; backlog row `MD-TASK-009` | [`remark-relgeo/src/index.ts`](../../../remark-relgeo/src/index.ts); [`remark-relgeo/test/remark-relgeo.test.mjs`](../../../remark-relgeo/test/remark-relgeo.test.mjs); [`relgeo.github.io/scripts/assert-built-output.mjs`](../../../relgeo.github.io/scripts/assert-built-output.mjs) | The plugin owns safe diagnostic payload and source/fallback projection; website owns final visual presentation. Diagnostics must remain readable without exposing unsafe markup or swallowing source context. | A malformed preview emits the structured diagnostic from `MD-TASK-008` plus readable fallback/source context; the official site assertion confirms visible, actionable output and no preview-source leakage in successful pages. |
| `MD-TASK-011` — strict/tolerant policy option (`MD-DIAG-004`) | `❌` | `remark-relgeo` + website/build owner | [`spec/id/core/06-error-model.md`](../../../spec/id/core/06-error-model.md); [`expected-capability-catalog.md`](./expected-capability-catalog.md) (`MD-DIAG-004`); [`implementation-audit.md`](./implementation-audit.md) row `MD-DIAG-004`; backlog row `MD-TASK-011` | [`remark-relgeo/src/index.ts`](../../../remark-relgeo/src/index.ts); [`remark-relgeo/package.json`](../../../remark-relgeo/package.json); [`remark-relgeo/test/remark-relgeo.test.mjs`](../../../remark-relgeo/test/remark-relgeo.test.mjs) | The caller selects build behavior; core/spec still own semantic validity. Tolerant mode must preserve a safe diagnostic/fallback, while strict mode may fail deliberately and deterministically. | Documented default and option values are validated; tolerant mode emits fallback plus diagnostic without throwing, strict mode fails with the same stable diagnostic, and non-target Markdown remains unaffected in both modes. |
| `MD-TASK-018` — generated-output sanitization policy (`MD-ASSET-003`) | `🌗` | Both plugins + renderer/website host | [`expected-capability-catalog.md`](./expected-capability-catalog.md) (`MD-ASSET-003`); [`implementation-audit.md`](./implementation-audit.md) row `MD-ASSET-003`; [`implementation-gap-backlog.md`](./implementation-gap-backlog.md) row `MD-TASK-018`; [`remark-relgeo-hl/src/render.ts`](../../../remark-relgeo-hl/src/render.ts) escaping helpers | [`remark-relgeo/src/index.ts`](../../../remark-relgeo/src/index.ts); [`remark-relgeo-hl/src/render.ts`](../../../remark-relgeo-hl/src/render.ts); preview/highlighter package tests; website output assertions | Source text and metadata are untrusted. The plugin/host boundary must define whether custom SVG is rejected, sanitized, or explicitly trusted; no path may emit executable HTML/SVG/URL content accidentally. | Security fixtures covering source, metadata, token text, URLs, and custom preview output produce only the agreed safe projection; no script/event-handler/unsafe-URL payload crosses the HTML/SVG boundary, while valid preview/highlight output remains unchanged. |
| `MD-TASK-021` — contextual error boundary (`MD-ERR-001`) | `🌗` | Both plugins | [`spec/id/core/06-error-model.md`](../../../spec/id/core/06-error-model.md); [`expected-capability-catalog.md`](./expected-capability-catalog.md) (`MD-ERR-001`); [`implementation-audit.md`](./implementation-audit.md) row `MD-ERR-001`; backlog row `MD-TASK-021` | [`remark-relgeo/src/index.ts`](../../../remark-relgeo/src/index.ts); [`remark-relgeo-hl/src/index.ts`](../../../remark-relgeo-hl/src/index.ts); both package test suites; conformance fixtures | Each plugin isolates failures to the matching fenced block. Semantic error vocabulary remains delegated; the Markdown layer owns block context, safe fallback, and continuation of unrelated nodes. | A document containing valid, malformed, non-RelGeo, and service-failing blocks produces deterministic contextual output for each affected block; one failure never removes or corrupts neighboring blocks, and strict mode is the only deliberate whole-build failure path. |
| `MD-TASK-024` — website provenance/version assertions (`MD-WEB-003`) | `🌗` | Website + spec/package owners | [`docs/compatibility-matrix.json`](../../compatibility-matrix.json); [`expected-capability-catalog.md`](./expected-capability-catalog.md) (`MD-WEB-003`); [`implementation-audit.md`](./implementation-audit.md) row `MD-WEB-003`; backlog row `MD-TASK-024` | [`relgeo.github.io/astro.config.mjs`](../../../relgeo.github.io/astro.config.mjs); [`relgeo.github.io/package.json`](../../../relgeo.github.io/package.json); [`relgeo.github.io/pnpm-lock.yaml`](../../../relgeo.github.io/pnpm-lock.yaml); localized Markdown content and built-output scripts | `spec/id` and the compatibility matrix are normative; packages expose their declared line; the website consumes and asserts provenance. This task does not publish or install packages. | A local website check fails or reports a clear mismatch when package/spec provenance or the `0.5.x` compatibility line disagrees; current EN/ID Markdown output continues to build with the asserted plugin contract. |

## Sequencing and dependency boundary

The intended implementation order is:

1. `MD-TASK-006` establishes source-preserving highlighter recovery.
2. `MD-TASK-008` defines the shared diagnostic projection, followed by
   `MD-TASK-009` and `MD-TASK-011` for visible fallback and caller-selected
   policy.
3. `MD-TASK-021` applies the failure boundary across both plugins, with
   `MD-TASK-018` securing generated output at the same boundary.
4. `MD-TASK-005` repairs the preview/rehype wrapper contract and
   `MD-TASK-024` adds the website provenance assertion over the resulting
   consumer path.

These are sequencing constraints, not additional selected capabilities. The
implementation task may refine dependencies only when a source/test
prerequisite is demonstrated.

## Deliberately excluded from active implementation

| Excluded item | Status | Reason |
| --- | --- | --- |
| All other `🌗`, `❌`, or `⚠️` candidate rows | current audit/backlog symbol | Visible backlog work remains outside this bounded tranche; it is not silently promoted or reclassified. |
| `MD-TASK-026` / `MD-REL-001` and `MD-TASK-027` / `MD-SSR-004` | `🌗` | Fresh consumer, pack/install, and workspace-independence evidence are release/delivery follow-ups and are intentionally not prerequisites here. |
| `MD-VERIFY-001` / `MD-SSR-003` and `MD-VERIFY-002` / `MD-REL-002` | `unverified` | Alternate-host ordering and registry/release parity are observational verification, not active implementation in this tranche. |
| `MD-TASK-025` / `MD-WEB-004` | `🌗` | Public deployment, responsive/mobile, and physical assistive-technology evidence are consumer verification scope; mobile/physical AT is explicitly deferred. |
| `MD-A11Y-003` | `not applicable` | Static plugin output has no interactive controls or focus-management surface; any future controls belong to the host. |
| Any `➖` capability | `➖` | Boundary/non-goal work is not converted into implementation debt. |
| Any `⏸️` capability or deferred decision | `⏸️` | Held scope remains held; no implementation task is inferred from it. |

No `➖` or `⏸️` item is treated as active implementation work.

## Status accounting

| Check | Result |
| --- | ---: |
| Selected capability IDs | 8 |
| Selected `🌗` rows | 5 (`MD-PREVIEW-004`, `MD-DIAG-002`, `MD-ASSET-003`, `MD-ERR-001`, `MD-WEB-003`) |
| Selected `❌` rows | 2 (`MD-DIAG-001`, `MD-DIAG-004`) |
| Selected `⚠️` rows | 1 (`MD-HL-002`) |
| Selected `➖` or `⏸️` rows | 0 |
| Selected IDs with owner, source path, boundary, and acceptance behavior | 8/8 |

The status accounting intentionally keeps `MD-HL-002` in the separate `⚠️`
bucket. No status is promoted by this record.

Changing this record or the backlog is not implementation evidence. Each
selected row requires focused source/test evidence and a fresh audit,
reconciliation, and status review before its symbol changes.
