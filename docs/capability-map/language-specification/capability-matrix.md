# RelGeo Language Specification Capability Matrix

**Status:** compatibility entry point; the canonical 53-row reporting view is
[`status-matrix.md`](./status-matrix.md)

**As of:** 2026-11-07
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
| `✔️` | 53 | Implemented at the audited local boundary with direct source, regression, fixture, and consumer evidence. |
| `🌗` | 0 | No partial whole-capability row remains on the audited local boundary. |
| `⚠️` | 0 | No mismatch remains on the audited local boundary. |
| `❌` | 0 | No expected capability is currently classified absent in the one-to-one join. |
| `➖` | 0 | No whole capability is outside the active language-spec scope. |
| `⏸️` | 0 | No whole capability is held; deferred sub-boundaries remain explicit in the rows. |

These counts are copied from the status matrix and must be changed there first.
Local evidence does not become CI, registry, public, browser, native-host, or
MCP evidence by implication.

## Current evidence and boundary slice

| Boundary | Current evidence | Remaining limitation / next action |
| --- | --- | --- |
| Normative vocabulary and schema projection | `pnpm run language-spec:check` passes; 35 `spec/id` documents checked | Object/renderer field promotion remains bounded by explicit fixture contracts. |
| Core runtime and structured diagnostics | Core `579` tests, CLI `40`, and language-service `90` pass; structured phase/code/path regressions are covered | Canonical CI and clean-checkout evidence remain separate. |
| Renderer and semantic SVG | Renderer `72` focused tests, hostile-input/security checks, CLI/Markdown consumers, and conformance `677/677` across 33 fixtures pass locally | Broader Playground/browser/native-host semantic parity remains unverified; byte-identical SVG is out of scope. |
| Downstream TypeScript consumers | Root `pnpm test` passes all 9 workspace projects; Playground `107` tests; website build/check/assertions pass | Node `>=24` integration gate, public Pages provenance, and registry evidence remain separate promotion gates. |
| Flutter and MCP boundaries | Flutter/MCP boundaries are documented in the handoff and reconciliation | Flutter SDK host writes, MCP transport/runtime, and native/device evidence remain unverified/deferred. |

## P0/P1 implementation-closability slice

Selection is a work queue, not completion. The full capability status for every
ID remains in [`status-matrix.md`](./status-matrix.md), and the contract/acceptance
boundary is frozen in [`reconciliation.md#0-contract-and-acceptance-lock`](./reconciliation.md#0-contract-and-acceptance-lock).

| Gap | IDs | Current status | Owner | Next action |
| --- | --- | --- | --- | --- |
| `GAP-001` | `LANG-002`, `DOC-003`, `TYPE-001`, `TYPE-002`, `VER-003` | `🌗` | `relgeo/spec` + workspace consumers | Extend vocabulary/drift coverage beyond the current checked projection. |
| `GAP-002` | `DECL-001`, `DECL-004`, `EVAL-002` | `✔️` | `relgeo/core` + CLI | Fixture 16 active for the bounded local v0.5 contract; preserve explicit Node-24/CI/native-host evidence boundary. |
| `GAP-003` | `GEO-001`–`GEO-005` | `✔️` locally | `relgeo/geometry` + core | Preserve fixture 31 and explicit host boundaries. |
| `GAP-007` | `QUERY-002` | `✔️` locally | core + geometry | Preserve fixture 31 query domain/tolerance evidence. |
| `GAP-008` | `CON-001`, `CON-002` | `✔️` locally | core | Preserve fixture 32 diagnostics and no-mutation evidence. |
| `GAP-009` | `PRES-001`, `PRES-002` | `✔️` locally | renderer-svg + core | Preserve fixture 33 dimension/annotation/security snapshots. |
| `GAP-010` | `PRES-003`, `PRES-004`, `META-001`, `META-002` | `✔️` locally | spec + core + renderer-svg | Preserve fixture 33 roles/views/sheets/metadata evidence. |
| `GAP-011` | `DIAG-001`, `DIAG-002`, `ERR-001` | `✔️` locally | core + language-service + CLI | Preserve structured diagnostic boundary; canonical CI remains separate. |
| `GAP-012` | `SER-001` | `✔️` locally | spec + core + CLI | Preserve fixture 33 canonical JSON replay evidence. |
| `GAP-013` | `SER-002` | `✔️` locally | renderer-svg | Preserve fixture 33 semantic SVG security evidence; raw bytes are out of scope. |

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
