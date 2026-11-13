# Markdown before-state snapshot — 2026-11-13

**Task:** `freeze-markdown-closure-boundary-and-rebaseline-the-complete-expected-catalog--3417556758`

This is the immutable before-state record for the Markdown closure tranche. It
was captured before the 2026-11-13 documentation freeze edits. The hashes bind
the snapshot to the exact source documents that were audited; the row register
below keeps the actionable status set reviewable without copying mutable
downstream documents into this record.

## Repository boundary

| Boundary | Revision | Working tree at capture |
| --- | --- | --- |
| `relgeo/workspace` | `fcc7b348b8e775861cc25829db188e1bd3303f9e` | clean |
| `remark-relgeo` | `59385a094654c92d060141dc1cc045d07591c880` | clean |
| `remark-relgeo-hl` | `6d109a96a265f64b8934e13e4d9e1e1ae1e8b028` | clean |
| `language-service` | `962d17a0fed048c2fb89ef239063d92dfbcfe44e` | clean |
| `renderer-svg` | `07f4b1e4a126752138d2c984ae066df62ea7fb9e` | clean |
| `relgeo.github.io` | `c5ca17f06476fd2beeb4a48e971265a0e57495c7` | clean |

## Exact input documents

| Input | SHA-256 at capture |
| --- | --- |
| [`expected-capability-catalog.md`](./expected-capability-catalog.md) | `22038d9cf6800b7c89ae3c861e72f22d12fa86cabcf743d8baf623e73756b046` |
| [`status-matrix.md`](./status-matrix.md) | `8285d3386262df1e55b8306058de221bea397a287a9bebef50fbec65b05c0eac` |
| [`implementation-gap-backlog.md`](./implementation-gap-backlog.md) | `ee6793b2e96eb0d6d9bd268676ecc8fe06d20aaf221bd74c4a75d3bdc893dbfe` |
| [`implementation-audit.md`](./implementation-audit.md) | `8bbf7169f59a9ffb575f6447da57d851bb3b0f37d5ff11bc12ca58ead22eda99` |
| [`reconciliation.md`](./reconciliation.md) | `7ce141f20250fe7dd38b13e2f615c176d1d15fff6949cf2b620e345dd5316492` |

## Before-state counts

The status matrix contained 38 rows with 38 unique capability IDs:

| Status | Count | Meaning at capture |
| --- | ---: | --- |
| `✔️` | 23 | Implemented on the audited local boundary |
| `🌗` | 14 | Partial implementation, contract, or evidence coverage |
| `❌` | 0 | No absent row at capture |
| `⚠️` | 0 | No confirmed broken row at capture |
| `➖` | 1 | `MD-A11Y-003`, explicitly not applicable to plugin-owned static output |
| `⏸️` | 0 | No held expected row |

## Non-green rows captured before implementation

| Capability ID | Status | Owner boundary | Closure task or disposition |
| --- | --- | --- | --- |
| `MD-OPT-002` | `🌗` | `remark-relgeo` + spec/core | `MD-TASK-013` |
| `MD-OPT-003` | `🌗` | both plugins + website | `MD-TASK-014` |
| `MD-SSR-001` | `🌗` | both plugins + website | `MD-TASK-016` |
| `MD-SSR-003` | `🌗` | package + website | `MD-VERIFY-001` — external verification, not implementation blocker |
| `MD-SSR-004` | `🌗` | both package owners | `MD-TASK-027` |
| `MD-ASSET-001` | `🌗` | `remark-relgeo` + website | `MD-TASK-017` |
| `MD-ASSET-003` | `🌗` | both plugins + renderer/host | `MD-TASK-018` |
| `MD-A11Y-001` | `🌗` | `remark-relgeo` + website | `MD-TASK-019` |
| `MD-A11Y-002` | `🌗` | both plugins + website | `MD-TASK-020` |
| `MD-ERR-002` | `🌗` | `remark-relgeo` + spec/core | `MD-TASK-022` |
| `MD-ERR-003` | `🌗` | `remark-relgeo` + core/renderer | `MD-TASK-023` |
| `MD-WEB-004` | `🌗` | website | `MD-TASK-025` |
| `MD-REL-001` | `🌗` | each package owner | `MD-TASK-026` |
| `MD-REL-002` | `🌗` | release/package owners | `MD-VERIFY-002` — external registry/release verification |

No `❌` or `⚠️` row existed at capture, so no such row required a fabricated
closure task. Any new non-green status after this snapshot must be added to the
freeze register before implementation proceeds.

## Backlog state at capture

- Candidate implementation task register: `MD-TASK-001` through
  `MD-TASK-027`.
- External verification follow-ups: `MD-VERIFY-001` and `MD-VERIFY-002`.
- The 14 non-green status rows above were the only rows requiring active task
  or explicit verification disposition.
- Release publication, registry parity, deployed-site smoke, and physical
  assistive-technology checks were evidence boundaries, not hidden
  implementation prerequisites.

This file is a historical input record. It must not be edited to make a later
status appear green.
