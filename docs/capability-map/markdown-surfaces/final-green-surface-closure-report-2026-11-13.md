# Final Markdown green-surface closure report — 2026-11-13

## Decision

The Markdown scope is green at the declared implementation boundary:

| Status | Count | Meaning |
| --- | ---: | --- |
| `✔️` | 27 | Implemented and locally evidenced. |
| `⏸️` | 10 | Explicitly held by scope, product-contract, or external-evidence decision. |
| `➖` | 1 | Explicitly not applicable: no plugin-owned interactive controls. |
| `🌗` | 0 | No partial status remains in the final matrix. |
| `❌` | 0 | No absent capability remains. |
| `⚠️` | 0 | No confirmed broken capability remains. |

This is a status decision over the 38 expected catalog IDs, not a claim that
registry publication, production deployment, or physical accessibility testing
occurred. The complete row-level join is in the [status matrix](./status-matrix.md)
and [reconciliation](./reconciliation.md).

## Explicit non-blocking scope decisions

| ID | Owner | Decision and rationale | Reopen condition |
| --- | --- | --- | --- |
| `MD-OPT-002` | `remark-relgeo` + spec/core | Hold version/view option expansion until the core/spec public option contract is approved; current profile/sheet/unit behavior remains tested. | Approved option-surface decision. |
| `MD-OPT-003` | both plugins + renderer/website | Hold configurable asset strategy and general custom-SVG sanitizer; the fixed inline strategy and bounded rejection are the accepted 0.5.x boundary. | Approved sanitizer/asset policy. |
| `MD-ASSET-001` | `remark-relgeo` + website | Hold alternate asset modes; deterministic inline data URI is the current contract. | Concrete alternate-host asset requirement. |
| `MD-ASSET-003` | both plugins + host | Hold a general sanitizer/URL policy; executable tags, handlers, and unsafe URL forms are already rejected at the bounded boundary. | Separately specified security/sanitizer scope. |
| `MD-A11Y-002` | both plugins + website | Hold broader non-color/ARIA contract and physical AT validation; static text/error fallback is locally readable and tested. | Approved semantic contract and device/AT scope. |
| `MD-ERR-002` | `remark-relgeo` + spec/core | Hold plugin-specific version error category until shared error-vocabulary governance is settled; safe contextual fallback is implemented. | Shared diagnostic-vocabulary decision. |
| `MD-ERR-003` | `remark-relgeo` + core/renderer | Hold broader failure taxonomy/non-fatal projection until the cross-surface core contract exists; safe placeholder and strict adapter error are implemented. | Approved cross-surface failure taxonomy. |
| `MD-WEB-004` | Website owner | Hold public deployment, mobile readability, and physical AT evidence; local EN/ID routes and CSS are verified. | Public/device validation scope becomes available. |
| `MD-REL-001` | package owners | Hold broader docs/test-depth expansion as follow-on maintenance; runtime metadata, README, exports, types, and packed consumer are verified. | Approved docs/test-depth tranche. |
| `MD-REL-002` | release/package owners | Hold registry publication/install parity because no-publish and no-registry are explicit goal boundaries; workspace metadata and release order are documented. | Separate release/registry verification task. |

`MD-A11Y-003` remains `➖` with the explicit decision that static plugin output
owns no controls or focus management. If controls are introduced, it reopens as
a host capability rather than silently remaining not applicable.

## Goal-level acceptance review

- Every expected catalog ID appears exactly once in the reconciliation and
  status matrix: 38 rows, 0 missing, 0 duplicate, 0 observed-only.
- Shared Markdown, renderer, language-service, package, and Website/Pages
  claims are joined in the [cross-surface evidence map](../cross-surface/markdown-conformance-evidence-map-2026-11-13.md).
- Mutative implementation tasks retain their package/consumer/conformance
  evidence in the [conformance report](./conformance-report-2026-11-13.md),
  implementation audit, and closure-boundary freeze. This final audit changes
  only status dispositions and closure records; it does not invent runtime
  evidence.

## Validation record index

| Evidence | Local record |
| --- | --- |
| Package and consumer reports | `scripts/validate-markdown-package-boundary.mjs`; `relgeo.github.io/scripts/validate-markdown-consumer.mjs` |
| Shared conformance report | `scripts/run-conformance-fixtures.mjs`: `677 passed, 0 failed across 33 fixtures` |
| Safety/accessibility and generic host | `scripts/validate-markdown-preview-contract.mjs`; `scripts/validate-markdown-generic-host.mjs` |
| Before/after reconciliation | `before-state-snapshot-2026-11-13.md` → this report, status matrix, and reconciliation |
| Cross-surface closure | `../cross-surface/markdown-conformance-evidence-map-2026-11-13.md`; `cross-surface-impact-register.md` |

