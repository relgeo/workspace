# MCP setup, operations, and compatibility closure — 2026-11-12

This task closes the actionable local setup/operations/compatibility contract
and dispositioned boundaries that cannot run in the current environment. It
does not claim packaged-app or external-client interoperability.

All actionable local residuals in this task have source, fixture, and test
evidence. The remaining rows are boundary-only dispositions: no source change
can produce standalone, cross-host, external-client, packaged-runtime,
canonical-release, or live-client proof while those runtime boundaries are
unavailable.

## Evidence revision pin

The evidence below is tied to the revisions observed in this checkout:

| Checkout | Revision |
| --- | --- |
| Workspace root | `47c8b526dcf67197d0e5546a310b68dafcdf97fc` |
| MCP child | `824b46eccabd77da37bb37fa72b1c4a0e019442f` |
| Flutter child | `1b894663778af002675e253049c8a793c5cea8b9` |
| Spec child | `26ff53278d77d916b0e0e6c26ca9ab496232fbc0` |

## Local evidence mapping

| Surface | Implementation/test evidence | Fixture case |
| --- | --- | --- |
| Protocol initialize, version negotiation, invalid request | `mcp/tool/protocol_fixture.dart`; `mcp/test/protocol_fixture_test.dart` | `protocol-negotiation-and-invalid-request` |
| Loopback/origin/security policy | `flutter/lib/src/mcp/mcp_server_io.dart`; `flutter/test/mcp_server_io_test.dart` | `loopback-and-remote-origin-policy` |
| Session stop and token revocation | `mcp/lib/src/contract/session_bridge.dart`; `mcp/test/local_dispatch_test.dart` | `session-stop-token-revocation` |
| Token redaction and explicit permission | `mcp/lib/src/contract/mcp_schema.dart`; `mcp/test/mcp_schema_test.dart`; Flutter HTTP tests | `setup-token-redaction-and-permission` |

## Deferred boundary disposition

| Boundary | Status | Owner | Remediation | Claim limit |
| --- | --- | --- | --- | --- |
| Standalone executable (`TRAN-03`) | `⏸️ / environment-unavailable-deferred` | MCP transport owner | Resolve `DEL-01`; if accepted, add executable and run stdio gate | Stdio fixture is not standalone delivery evidence |
| External client/Inspector (`DEL-03`) | `⏸️ / environment-unavailable-deferred` | MCP transport/conformance owner | Run initialize/negotiation/tools/resources/security with an available client | Local protocol tests are not interoperability proof |
| Packaged desktop runtime (`DEL-04`) | `⏸️ / environment-unavailable-deferred` | Flutter delivery owner | Launch supported artifact and record authenticated call/security/stop | Draft artifact metadata is not packaged runtime smoke |
| Live setup/client flow (`DEL-06`) | `⏸️ / environment-unavailable-deferred` | Flutter host + MCP docs owner | Run endpoint/token/permission/limitation walkthrough with compatible client | Local setup contract is not end-user client proof |
| Canonical release provenance (`DEL-05`) | `⏸️ / environment-unavailable-deferred` | Workspace release owner | Join MCP/Flutter/spec revisions, artifact, OS/run/checksums at release boundary | Supporting manual evidence remains non-canonical |

## Execution and validation record

| Command | Boundary | Result |
| --- | --- | --- |
| `node scripts/check-mcp-setup-operations-compatibility-closure.mjs --evidence-id=suclos-mcp-setup-operations-2026-11-12-r2` | SuClos local repository validator | PASS — `MCP setup/operations/compatibility closure: PASS (local protocol/security evidence joined; no partial rows remain; unavailable runtime boundary recorded; evidence_id=suclos-mcp-setup-operations-2026-11-12-r2; evidence_scope=setup-operations-compatibility)` |
| `dart test test/protocol_fixture_test.dart test/mcp_schema_test.dart test/local_dispatch_test.dart` | MCP protocol/security/session and fixture-alignment tests | PASS — `00:00 +46: All tests passed!`; includes `protocol negotiation accepts the 2025-06-18 compatibility boundary` |
| `flutter test --no-pub test/mcp_server_io_test.dart` | Flutter setup/operations transport boundary | Supporting local/manual evidence previously recorded `00:00 +3: All tests passed!`; the current Codex App Server managed sandbox cannot start the Flutter tool because it cannot update `/Users/agusmade/development/flutter/bin/cache/engine.stamp` (`Operation not permitted`). This boundary is explicitly environment-unavailable/deferred here; no source failure is inferred. |

The matrix retains `VAL-03` as the single cross-host evidence-bound residual;
it is outside this setup/operations/compatibility disposition and remains
`⏸️ / environment-unavailable-deferred` until the named host boundary is
available. No partial status is used for this boundary. The local/manual Flutter
result remains supporting evidence and is not promoted to managed-sandbox or
packaged-runtime proof.
