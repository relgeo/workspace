# RelGeo Language Specification Capability Matrix

**Status:** compatibility entry point; the canonical 53-row reporting view is
[`status-matrix.md`](./status-matrix.md)

**As of:** 2026-11-04  
**Surface:** `language-specification/`  
**Owner:** `relgeo/spec` with `relgeo/core` and downstream consumer owners  
**Compatibility line:** `0.5.x`

This file exists for consumers that expect the generic `capability-matrix.md`
entry point. It intentionally does not duplicate the 53-row matrix. The
expected-versus-observed join remains [`reconciliation.md`](./reconciliation.md),
the source/test findings remain [`implementation-audit.md`](./implementation-audit.md),
and implementation work remains [`implementation-gap-backlog.md`](./implementation-gap-backlog.md).

## Current capability status

| Status | Count | Meaning |
| --- | ---: | --- |
| `✔️` | 16 | Implemented at the audited boundary with direct evidence. |
| `🌗` | 36 | Partial implementation, coverage, consumer parity, or promotion evidence. |
| `⚠️` | 1 | Confirmed mismatch at the audited public boundary (`DIAG-002`). |
| `❌` | 0 | No expected capability is currently classified absent in the one-to-one join. |
| `➖` | 0 | No whole capability is outside the active language-spec scope. |
| `⏸️` | 0 | No whole capability is held; deferred sub-boundaries remain explicit in the rows. |

These counts are copied from the status matrix and must be changed there first.
Local evidence does not become CI, registry, public, browser, native-host, or
MCP evidence by implication.

## Current evidence and boundary slice

| Boundary | Current evidence | Remaining limitation / next action |
| --- | --- | --- |
| Normative vocabulary and schema projection | `pnpm run language-spec:check` passes; 34 `spec/id` documents checked | Extend the checked projection to the broader object/renderer field vocabulary. |
| Core runtime and structured diagnostics | Core `469` tests, CLI `36`, and language-service `82` pass; structured phase/code/path regressions are covered | Complete the raw internal throw inventory and cross-consumer diagnostic mapping; keep `DIAG-002` broken until then. |
| Renderer and semantic SVG | Renderer `90` tests, dist boundary, hostile-input/security checks, CLI/Markdown consumers, and conformance `298/298` pass locally | Broader Playground/browser/native-host semantic parity remains unverified; byte-identical SVG is out of scope. |
| Downstream TypeScript consumers | Root `pnpm test` passes all 9 workspace projects; Playground `104` tests; website build/check/assertions pass with `138` pages | Node `>=24` integration gate, public Pages provenance, and registry evidence remain separate promotion gates. |
| Flutter and MCP boundaries | Flutter/MCP boundaries are documented in the handoff and reconciliation | Flutter SDK host writes, MCP transport/runtime, and native/device evidence remain unverified/deferred. |

## P0/P1 implementation-closability slice

Selection is a work queue, not completion. The full capability status for every
ID remains in [`status-matrix.md`](./status-matrix.md), and the contract/acceptance
boundary is frozen in [`reconciliation.md#0-contract-and-acceptance-lock`](./reconciliation.md#0-contract-and-acceptance-lock).

| Gap | IDs | Current status | Owner | Next action |
| --- | --- | --- | --- | --- |
| `GAP-001` | `LANG-002`, `DOC-003`, `TYPE-001`, `TYPE-002`, `VER-003` | `🌗` | `relgeo/spec` + workspace consumers | Extend vocabulary/drift coverage beyond the current checked projection. |
| `GAP-002` | `DECL-001`, `DECL-004`, `EVAL-002` | `🌗` | `relgeo/core` + CLI | Keep fixture 16 promotion decision-gated; add the shared active contract only after review. |
| `GAP-003` | `GEO-001`–`GEO-005` | `🌗` | `relgeo/geometry` + core | Add per-object mode, degenerate, and topology fixtures. |
| `GAP-007` | `QUERY-002` | `🌗` | core + geometry | Define query domain/tolerance fixtures and negative cases. |
| `GAP-008` | `CON-001`, `CON-002` | `🌗` | core | Add shared constraint diagnostics and no-mutation fixtures. |
| `GAP-009` | `PRES-001`, `PRES-002` | `🌗` | renderer-svg + core | Extend dimension/annotation kind and host/consumer snapshots. |
| `GAP-011` | `DIAG-001`, `DIAG-002`, `ERR-001` | `🌗` + `⚠️` | core + language-service + CLI | Normalize remaining raw throws and complete phase/code/path mapping. |
| `GAP-013` | `SER-002` | `🌗` | renderer-svg | Extend semantic escaping regression through Playground/current-host consumers. |

## Evidence handoff

- [Status matrix](./status-matrix.md) — canonical capability-first rows.
- [Expected catalog](./expected-capability-catalog.md) — expected ID set.
- [Reconciliation](./reconciliation.md) — one-to-one expected/observed join and
  contract lock.
- [Implementation audit](./implementation-audit.md) — source, test, fixture,
  consumer, and limitation findings.
- [Implementation-gap backlog](./implementation-gap-backlog.md) — owners,
  source of truth, acceptance behavior, and next actions.
- [Coverage validation handoff](./coverage-validation-handoff.md) — current
  commands and explicit local/CI/public/native evidence separation.

