# CLI Coverage Validation and Handoff

**Tanggal validasi:** 2026-10-30
**Scope:** expected catalog → implementation audit → reconciliation → status matrix → implementation-gap backlog
**Required context:** [`docs/REPOSITORY-MAP.md`](../../REPOSITORY-MAP.md), [`docs/MATURATION-MASTER-PLAN.md`](../../MATURATION-MASTER-PLAN.md)

## 1. Hasil validasi

Baseline CLI siap untuk review manusia sebagai dokumentasi dan evidence map.
Validasi ini **tidak** menyatakan surface CLI, package delivery, registry, CI,
atau canonical runtime lengkap.

Klaim yang aman:

- expected catalog menetapkan **35 capability ID** sebelum audit implementasi;
- implementation audit mencatat discovery source dan membandingkan **35/35 ID**;
- reconciliation dan status matrix masing-masing memiliki **35 row**, tanpa
  missing, extra, atau duplicate ID;
- matrix retains **21 `✔️`, 9 `🌗`, 4 `❌`, and 0 `⚠️`**; one
  `⏸️` ditahan sebagai keputusan scope dan `➖` hanya dipakai untuk boundary
  non-CLI;
- backlog mempertahankan **17 candidate implementation task records** from
  the intake tranche; **13 remain non-green** in the current matrix and four
  selected records now carry post-implementation evidence;
- dokumentasi ini, matrix, dan backlog tidak memperbaiki implementasi atau
  mengubah gap menjadi selesai.

## 2. Rantai artefak

| Artefak | Fungsi | Hasil validasi |
| --- | --- | --- |
| [Expected CLI capability catalog](./expected-capability-catalog.md) | Expected set dari user journey, target pengguna, workflow, DSL, roadmap, release contract, dan keputusan scope sebelum audit | 35 unique IDs; setiap row memiliki outcome, requirement basis, scope decision, owner/source of truth, dan verification status |
| [CLI implementation audit](./implementation-audit.md) | Observed source, executable, command/help, tests, fixtures, consumers, package, docs, runtime, and release evidence | Discovery coverage §2; 35/35 IDs; status, evidence tier, parity, scope, and limitations recorded |
| [CLI expected-versus-observed reconciliation](./reconciliation.md) | One-to-one join expected-versus-observed | 35/35 rows; no missing/extra/duplicate; implementation/evidence/scope separated |
| [CLI status matrix](./status-matrix.md) | Capability-first reporting view | 35 rows; complete status legend; evidence, gap, owner, dependency, risk, next action |
| [CLI implementation-gap backlog](./implementation-gap-backlog.md) | Candidate implementation goals/tasks | 17 task records retained from intake; 13 remain non-green in the current matrix, and each record has explicit scope, priority, owner, dependency, acceptance evidence, risk, and next action |
| [CLI bounded in-scope selection](./in-scope-selection.md) | Bounded intake for the next implementation tranche | 11 selected rows with owner, source path, contract boundary, and acceptance behavior; no `➖` or `⏸️` row selected |
| [Historical CLI capability matrix](./capability-matrix.md) | Prior command/output inventory | Retained as historical evidence, not used as the expected-set source |

## 3. Coverage and integrity checklist

| Check | Result | Evidence / interpretation |
| --- | --- | --- |
| Coverage report exists | PASS | Audit §2 records source/entrypoint, help/command, package, tests, fixtures, consumers, docs/roadmap/release, normative contract, and config/platform/runtime categories. |
| Required discovery categories recorded | PASS | Audit §2 covers source, test, fixture, consumer/command, package/delivery, docs/roadmap, delegated contract, runtime/config/platform, and ownership boundaries. |
| Capability-family coverage | PASS | Audit §5 and the matrix cover all 35 IDs across discovery/input/inspection (9), validation/rendering/output (9), diagnostics/exits/errors (6), configuration/automation/scripting (6), and packaging/compatibility/delivery (5). |
| Expected IDs represented | PASS | Catalog, reconciliation, and status matrix each contain 35 unique CLI IDs. |
| Post-implementation status join | PASS | Expected catalog, audit, and status matrix agree on all 35 symbols; all 17 backlog capability rows agree with the current matrix, including four selected rows promoted to `✔️` and one to `🌗`. |
| One reconciliation per expected ID | PASS | 35 expected = 35 reconciled; missing/extra/duplicate = 0. |
| Matrix is capability-first | PASS | Rows are keyed by expected capability ID and user capability, not by source module or test file. |
| Full status legend | PASS | Matrix explains `✔️`, `🌗`, `❌`, `➖`, `⏸️`, `⚠️`, and `?`; `?` remains an evidence limitation rather than an implementation result. |
| Evidence classes separated | PASS | The inventory protocol defines E0 docs/claim; the audit records E1 source/static, E2 local test/probe, E3 local cross-surface/conformance, E4 CI/canonical, E5 public/deployed, and `not verified`; matrix/reconciliation preserve the distinction. |
| Scope decisions preserved | PASS | Catalog and audit retain `in scope`, `boundary only`, `expected-but-missing`, `held`, and `not applicable`; UI/editor/delegated semantics are not converted into CLI absence. |
| Implementation versus evidence separated | PASS | Local passing tests do not promote Node 24, CI, registry, cross-OS, or public evidence; absent expected implementation remains `❌`. |
| Limitation stated | PASS | Audit and matrix record Node 22 local runtime versus Node >=24 requirement, current CI/public registry absence, cross-OS/TTY limits, bounded fixture coverage, and historical evidence limits. |
| Current evidence refresh retained | PASS | Audit §6 and the matrix checkpoint record the current 23/23 CLI revalidation, build, conformance, compatibility, and direct boundary probes without promoting them to Node 24, CI, registry, or public evidence. |
| Unresolved questions recorded | PASS | §5 lists scope, protocol, diagnostics, schema, and canonical-runtime decisions that remain open. |
| Backlog scope and priority explicit | PASS | The backlog has dedicated scope and `P0`/`P1`/`P2` fields; held, not-applicable, and environment-only findings remain outside candidate implementation tasks. |
| Required paths resolve | PASS | `docs/capability-map`, [`docs/REPOSITORY-MAP.md`](../../REPOSITORY-MAP.md), [`docs/MATURATION-MASTER-PLAN.md`](../../MATURATION-MASTER-PLAN.md), compatibility matrix, and release plan are present and linked. |
| Implementation handoff separated | PASS | Backlog explicitly says candidate tasks are not active goals and documentation does not close a gap. |
| Completeness claim avoided | PASS | This handoff describes a bounded audit and explicitly does not claim the CLI surface or delivery environments are complete. |

## 4. Discovery coverage boundary

The audit inspected the minimum CLI discovery boundary required by the
inventory protocol and repository map:

1. `cli/src/index.ts`, `cli/bin/relgeo.js`, `cli/tsup.config.ts`, built `cli/dist/`,
   and `cli/package.json` for command, entrypoint, option, output, and package
   ownership;
2. root help/version, subcommand help, Commander declarations, negative
   command/option probes, and the executable bootstrap;
3. `cli/src/__tests__/cli.test.ts` and the package test/build scripts;
4. `fixtures/manifest.json`, reference/expected fixture outputs, and
   `scripts/run-conformance-fixtures.mjs` for shared fixture and exact CLI
   output/error assertions;
5. root integration/release scripts, `.github/workflows/integration.yml`,
   package tarball metadata, and `docs/plans/03-npm-release-guard.md`;
6. root `README.md`, `cli/README.md`, `cli/docs/README.md`, website CLI docs,
   `docs/REPOSITORY-MAP.md`, and `docs/MATURATION-MASTER-PLAN.md` for user
   journey, ownership, command, and roadmap context;
7. `spec/id/README.md`, document structure, and error model for delegated DSL
   version, validation, and diagnostic semantics;
8. package scripts, `.node-version`, Node/pnpm probes, filesystem temp paths,
   stdout/stderr behavior, and absence checks for config/watch services.

This is a coverage report for the declared CLI boundary, not proof that every
shell, operating system, TTY, package installation, public registry, current
CI revision, or option combination has been executed. A missing environment
result is `?`/`not verified`, not evidence that an implementation is absent.

## 5. Unresolved questions for human decision

These questions must not be silently resolved by changing a status or adding a
backlog row:

| ID | Question | Affected capabilities / artefacts |
| --- | --- | --- |
| `Q-CLI-001` | Is a named `open` command required, or is path selection through `info`/`compile`/`check` the intended CLI contract? | `CLI-OPEN-001`, catalog, status matrix, backlog |
| `Q-CLI-002` | What are the exact stdin, path precedence, empty-input, encoding, and output-stream rules for shell pipelines? | `CLI-IN-002`, `CLI-IN-003`, `CLI-OUT-004`, `CLI-AUTO-003` |
| `Q-CLI-003` | Which diagnostic envelope, exit-code taxonomy, and stdout/stderr/no-color contract should automation rely on? | `CLI-DIAG-001`, `CLI-DIAG-003`, `CLI-EXIT-001`, `CLI-AUTO-003` |
| `Q-CLI-004` | Are JSON resolved-scene and graph outputs versioned CLI contracts or delegated consumer serialization views? | `CLI-OUT-001`, `CLI-OUT-003`, compatibility matrix, core |
| `Q-CLI-005` | Should config and document watch be active 0.5 CLI promises, bounded roadmap items, or explicit non-goals? | `CLI-CONFIG-001`, `CLI-CONFIG-002`, `CLI-AUTO-002` |
| `Q-CLI-006` | When can Node >=24, current CI, clean registry installation, and cross-OS/TTY checks be rerun for the current revision? | `CLI-PACK-001`, `CLI-PACK-004`, `CLI-AUTO-001`, evidence tier |
| `Q-CLI-007` | Is a long-running/JSON-RPC CLI protocol in scope, and what security/lifecycle contract would authorize it? | `CLI-AUTO-004`, catalog scope decision, protocol owners |

## 6. Implementation handoff

Implementation remains a separate goal/task concern. The backlog retains 17
intake records; four selected records now have source, focused-test, and audit
evidence (`CLI-TASK-003`, `CLI-TASK-010`, `CLI-TASK-011`, and
`CLI-TASK-012`). `CLI-TASK-009` is implemented only to a partial evidence
boundary and remains non-green.

Recommended order for the remaining 13 non-green records is:

1. complete input precedence/encoding, render-option and sheet matrices, file
   output behavior, phase-aware diagnostics, machine-mode coverage, and stream
   snapshots (`CLI-TASK-004` through `CLI-TASK-009`, `CLI-TASK-016`);
2. resolve product scope and then address init, open, configuration, and watch
   (`CLI-TASK-001`, `CLI-TASK-002`, `CLI-TASK-013`, `CLI-TASK-014`,
   `CLI-TASK-015`);
3. run canonical Node >=24 and registry/recovery verification when that
   environment is available (`CLI-TASK-017`).

Each remaining candidate must produce source changes plus executable
tests/fixtures and fresh audit evidence before its capability can move from
`🌗`, `❌`, or `⚠️`. This handoff does not create, start, or silently complete
any implementation goal.

## 7. Changed repository boundary and evidence handoff

| Boundary | Recorded state |
| --- | --- |
| Root repository | `/Users/agusmade/projects/relgeo-workspace`, observed root revision `1cfa865`; working tree contains the CLI capability documentation changes and other pre-existing workspace changes. |
| CLI repository boundary | `cli/`, observed CLI revision `7a6c0ce` (`v0.5.0` submodule baseline); working tree changes are in `src/index.ts`, `src/__tests__/cli.test.ts`, `README.md`, and `docs/README.md`. |
| Commit boundary | No commit, tag, push, npm publication, or registry mutation was created or assumed by this handoff. The evidence describes the current working tree relative to the recorded revisions. |
| Reproducible local evidence | CLI tests 23/23; explicit TypeScript analyzer; CJS/ESM build; conformance 260/260; compatibility 283/283; compatibility audit 10/10; scoped release audit 106/106; `git diff --check`. |
| Environment-limited evidence | The local integration gate stopped at its Node >=24 preflight because the environment provides Node 22.23.2. Node 24 CI, registry install, cross-OS/TTY, and public-package evidence remain `?`/not verified. |
| Scope exclusions | No npm/pub.dev publication, production deployment, deferred daemon/JSON-RPC host, browser UI, or mobile platform service was used as a prerequisite. |

## 8. Required evidence index

- [`docs/REPOSITORY-MAP.md`](../../REPOSITORY-MAP.md)
- [`docs/MATURATION-MASTER-PLAN.md`](../../MATURATION-MASTER-PLAN.md)
- [`docs/compatibility-matrix.json`](../../compatibility-matrix.json)
- [`docs/plans/03-npm-release-guard.md`](../../plans/03-npm-release-guard.md)
- [`INVENTORY-PROTOCOL.md`](../INVENTORY-PROTOCOL.md)
- [`SURFACE-DISCOVERY-LEDGER.md`](../SURFACE-DISCOVERY-LEDGER.md)
- [`fixtures/manifest.json`](../../../fixtures/manifest.json)
