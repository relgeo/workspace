# Website and Pages root verification report

**Captured:** 2026-11-13
**Workspace:** `/Users/agusmade/projects/relgeo-workspace`

This tracked report makes the root verification evidence inspectable from a
tracked file. It records the observed command output and the structured local
integration result directly below.

## Root conformance fixtures

Command:

```text
/bin/zsh -lc '/opt/homebrew/bin/pnpm run conformance:fixtures'
```

Observed terminal summary:

```text
summary: 677 passed, 0 failed across 33 fixtures
```

## Local integration gate

The local integration gate produced these observed values:

| Field | Value |
| --- | --- |
| `mode` | `local-workspace` |
| `passed` | `false` |
| `blocker.blockerClass` | `environment-unavailable` |
| `evidence.toolchain.node` | `v22.23.2` |
| `evidence.limitations` | `declared Node.js minimum is 24` |
| `summary.blocked` | `1` |

This is a managed execution-environment limitation, not a Website runtime
failure. Integration stages requiring Node.js 24 are not verified here.
