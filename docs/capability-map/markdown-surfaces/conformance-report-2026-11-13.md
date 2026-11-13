# Markdown conformance report — 2026-11-13

This report is the shared local evidence record for the 38-row Markdown
reconciliation. It joins package, renderer, language-service, generic-host,
package-boundary, and Website/Pages checks without promoting registry,
deployment, Node 24, or physical accessibility evidence.

## Gate results

| Boundary | Command | Observed result |
| --- | --- | --- |
| Shared fixtures and package/consumer projection | `node scripts/run-conformance-fixtures.mjs` | `677 passed, 0 failed across 33 fixtures` |
| Preview safety/accessibility contract | `node scripts/validate-markdown-preview-contract.mjs` | `PASS markdown-preview-contract-v1 rendererMetadata=escaped pluginSafety=bounded assetStrategy=inline-data-uri accessibility=figure-label-alt websiteAssertions=present changeRecord=present` |
| Highlighter/language-service evidence | `node scripts/validate-markdown-hl-evidence.mjs` | `PASS root-relative markdown-hl evidence files=4 sourceGuards=5 fallbackFixtures=4 tests=14` |
| Generic unified/SSR host | `node scripts/validate-markdown-generic-host.mjs` | `PASS markdown-generic-host-v3 ... relativeOrder=highlight<preview ... browserGlobals=none statusRows=2 contract=explicit` |
| Packed package boundary | `node scripts/validate-markdown-package-boundary.mjs` | `PASS markdown-package-boundary-v2 consumer=fresh-temp install=offline packages=@relgeo/remark-relgeo:esm+cjs+types,@relgeo/remark-relgeo-hl:esm+cjs+types packedDependencies=16 siblingSourcePaths=none` |
| Website/Pages consumer | `cd relgeo.github.io && node scripts/validate-markdown-consumer.mjs` | `PASS markdown-consumer-v2 ... locales=en,id highlight=2 preview=2 provenance=synchronized pagesArtifact=present officialPagesAssertion=executed ... scope=local hostedDeployment=external-unverified` |

All commands above completed successfully in the local workspace boundary. The
shared conformance command is the source for the 677/0 fixture result; the
compact validators are independent contract checks and do not replace the
package or Website test suites.

## Reconciliation result

- Expected catalog: 38 IDs.
- Reconciliation: 38 unique rows, 0 missing, 0 duplicate, 0 observed-only.
- Current local status: 27 `✅`, 0 `🌗`, 0 `⚠️`, 0 `❌`, 10 `⏸️`, 1 `➖`.
- Newly closed by this refresh: `MD-SSR-001`, `MD-SSR-003`, `MD-SSR-004`, and
  `MD-A11Y-001`.
- Remaining held rows retain explicit owner, non-blocking rationale, and reopen
  condition in the final closure report, backlog, and cross-surface register.

## Boundary limitations

Registry publication/install parity, deployed public smoke, Node 24 parity, and
physical/mobile/assistive-technology validation are not claimed here. These
limitations remain evidence boundaries and are not implementation failures.
