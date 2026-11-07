# Language Specification Non-Green Closure Ledger

**Audit date:** 2026-11-06  
**Boundary:** the frozen 53-ID catalog in [`expected-capability-catalog.md`](./expected-capability-catalog.md)  
**Purpose:** prerequisite ledger for implementation work; this file does not
change the status matrix and does not close any gap.

This ledger was reconciled against the 2026-11-07 verification evidence and is
currently empty: all 53 catalog rows are green on the audited local boundary.
Rows remain in the expected catalog and status matrix; this file only lists
future non-green implementation work and does not replace either source.
The status, owner, source of truth, and
gap wording are reconciled from the [status matrix](./status-matrix.md),
[implementation audit](./implementation-audit.md),
[reconciliation](./reconciliation.md), and
[implementation-gap backlog](./implementation-gap-backlog.md). Acceptance
behavior is the measurable contract from the expected catalog; evidence
boundaries deliberately distinguish local source/tests from cross-consumer,
host, CI, and promotion evidence.

## Ledger

| ID / status | Owner and normative source | Affected repositories / consumers | Acceptance behavior | Test / fixture target | Evidence boundary | Dependency |
| --- | --- | --- | --- | --- | --- | --- |
| *(none)* | — | — | No non-green capability rows remain on the audited local boundary. | Keep this ledger synchronized if a future audit reopens a row. | Node-24 CI, clean checkout, browser/native-host, and some Flutter/MCP evidence remain separate verification boundaries. | — |

## Rebaseline invariants

- The ledger has exactly 0 capability rows: every `🌗` and `⚠️` row in the
  status matrix would be listed here, and currently none remain.
- `❌` is included in the schema but currently has zero rows; a future absent
  capability must be added here before implementation work starts.
- This ledger is not a second normative source. `spec/id/` owns meaning; the
  expected catalog owns scope; the matrix owns current status; this file only
  joins implementation planning fields.
- No status, scope, owner, or gap is promoted by this file. A row can move out
  of this ledger only after source changes, targeted tests/fixtures, and the
  stated evidence boundary are independently verified and the canonical matrix
  is deliberately updated.

## Validation

The ledger is valid only when these checks continue to pass:

- `pnpm run language-spec:audit:check`
- `pnpm run language-spec:catalog:check`
- `pnpm run compatibility:check`
- `pnpm test`
- `pnpm run spec:snapshot:check && pnpm run spec:snapshot:test`

These checks refresh evidence only. Environment-unavailable Node 24,
Flutter/MCP, and clean-checkout boundaries remain explicit limitations and are
not silently converted into canonical external evidence.
