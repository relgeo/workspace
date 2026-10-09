# Dart SDK and transport spike

Status: evidence collected; dependency intentionally not locked.

This spike sets up comparison of the two Dart MCP candidates against one
protocol fixture and keeps the fixture independent from either SDK. The product
runtime remains Dart inside RelGeo Desktop; MCP Inspector is a developer
validation tool only.

## Candidate comparison

| Candidate | Evidence | Stdio | Streamable HTTP | Assessment |
| --- | --- | --- | --- | --- |
| `dart_mcp` 0.5.2 | Official Dart `labs.dart.dev` package; Dart SDK minimum 3.7 | Supported | Marked 🚧 and described as 2026-07-28-only, without legacy fallback | Keep as an official-Dart fallback; it does not yet satisfy the desktop HTTP requirement without additional adapter work. |
| `mcp_dart` 2.4.2 | Third-party package; Dart SDK minimum 3.4; docs expose protocol profiles, transport guides, and conformance commands | Supported | Server/client supported; stable profile prefers 2026-07-28 and falls back to initialization-era peers | First candidate for a real SDK conformance run because its transport/security surface matches the desktop spike; still do not lock until the fixture and Inspector checks pass. |

SDK adapter execution status for both candidates: **pending**. Neither package is
present in the workspace dependency graph, so this task does not claim an SDK
conformance pass based only on published documentation.

The isolated execution steps and acceptance gate for the eventual SDK adapters
are in [`03-sdk-conformance-runbook.md`](03-sdk-conformance-runbook.md).

Provisional transport decision: keep `stdio` for a standalone child process and
keep Streamable HTTP bound to `127.0.0.1` for a desktop-connected server. Do
not enable remote HTTP, and do not choose a package until an SDK adapter passes
the same fixture on both paths.

Primary evidence:

- [`dart_mcp` pub.dev versions](https://pub.dev/packages/dart_mcp/versions)
- [`dart_mcp` repository API/transport notes](https://github.com/dart-lang/ai/tree/main/pkgs/dart_mcp)
- [`mcp_dart` pub.dev documentation](https://pub.dev/documentation/mcp_dart/latest/)
- [`mcp_dart` getting-started transport example](https://github.com/leehack/mcp_dart/blob/main/doc/getting-started.md)

Decision for this task: do not add `dart_mcp` or `mcp_dart` to
`mcp/pubspec.yaml`. The package currently contains only RelGeo contracts and a
wire fixture. The fixture has been exercised directly over stdio; SDK-adapter
runs are intentionally recorded as pending rather than inferred from package
documentation. A later conformance task can add one candidate in an isolated
spike branch/package, compare the exact same fixture, and then pin the chosen
version with evidence.

## Shared protocol fixture

The fixture targets the initialization-era MCP `2025-11-25` profile, which both
candidate documentation exposes and which is explicit and easy to replay:

1. `initialize` with protocol version, empty capabilities, and client info;
2. `notifications/initialized`;
3. `tools/list` and the typed `relgeo_fixture_echo` schema;
4. `tools/call` with structured content;
5. `resources/list`;
6. `resources/read` with `source`, `sourceUrl`, `specVersion`, and `revision`.

The exact request sequence is in
[`protocol_conformance.dart`](../../mcp/tool/protocol_conformance.dart). The
same sequence is sent through both implementations in
[`run_transport_conformance.dart`](../../mcp/tool/run_transport_conformance.dart).
The fixture server is in
[`mcp_fixture_server.dart`](../../mcp/tool/mcp_fixture_server.dart).

MCP semantics are transport-independent: stdio carries newline-delimited
JSON-RPC messages, while Streamable HTTP sends each request as a POST to one
MCP endpoint and returns JSON or a request-scoped SSE stream. The official
transport overview states that the protocol messages are the same across
bindings; the Streamable HTTP guidance also requires localhost binding for
local servers and Origin/authentication protections.

Evidence: [official transport overview](https://github.com/modelcontextprotocol/modelcontextprotocol/blob/main/docs/specification/2026-07-28/basic/transports/index.mdx), [official Streamable HTTP security and POST rules](https://github.com/modelcontextprotocol/modelcontextprotocol/blob/main/docs/specification/draft/basic/transports/streamable-http.mdx), and [2025-11-25 lifecycle handshake](https://github.com/modelcontextprotocol/modelcontextprotocol/blob/main/docs/specification/2025-11-25/basic/lifecycle.mdx).

## Results in this workspace

The pure-Dart fixture package passes analyzer and unit tests. The native stdio
round trip passes:

```text
dart run tool/run_transport_conformance.dart --stdio-only
stdio fixture conformance: PASS
```

The full harness then attempts the same sequence over HTTP. In this managed
execution environment, binding a local socket is denied by the sandbox with
`SocketException: Operation not permitted` for `127.0.0.1`; this is an
environment limitation, not a protocol assertion. On a normal desktop runner,
the command is:

```text
dart run tool/run_transport_conformance.dart
```

The HTTP fixture refuses `--host 0.0.0.0` and any host other than
`127.0.0.1`, so remote HTTP is not enabled by the spike.

## MCP Inspector evidence

The official Inspector provides web, CLI, and TUI clients. Its CLI supports
stdio commands plus HTTP `tools/list`, `tools/call`, and `resources/list` checks;
the Inspector docs show the same workflow. It is intentionally not a RelGeo
runtime dependency because the current Inspector launcher runs through `npx`
and requires Node. This preserves the Plan 11 requirement that RelGeo Desktop
does not require Node/npm.

Validation command for a desktop/CI environment with Node installed:

```text
npx @modelcontextprotocol/inspector --cli dart run tool/mcp_fixture_server.dart --transport stdio --method tools/list
```

Node 22.23.2, npm 10.9.8, and npx are present as developer tooling in this
workspace, but `timeout 15 npx --yes @modelcontextprotocol/inspector --version`
returned exit 124 without output. The package could not be resolved/started by
the managed shell, so the fixture conformance above remains the dependency-free
protocol evidence and Inspector is still a follow-up cross-client check. Node/
npm are not part of the RelGeo Desktop runtime decision.

Evidence: [official Inspector guide](https://github.com/modelcontextprotocol/docs/blob/main/docs/tools/inspector.mdx), [Inspector CLI guide](https://github.com/modelcontextprotocol/inspector/blob/main/clients/cli/README.md).

## Flutter toolchain baseline

The current workspace baseline is:

```text
Dart SDK:       3.11.5 stable, macos_arm64
Flutter config: 3.41.9 (existing package configuration)
RelGeo SDK:     ^3.11.5
MCP package:    workspace path dependency ../mcp; standalone Flutter CI checks out relgeo/mcp at the same sibling path
```

The Flutter wrapper could not run its normal `pub get`/test preflight in this
managed environment because the SDK cache is read-only outside the workspace
(`engine.stamp`/`lockfile`). The new pure-Dart fixture and analyzer run through
the direct Dart SDK. Full Flutter/desktop HTTP conformance remains a validation
step on a writable desktop toolchain.

## Evidence matrix

| Acceptance evidence | Status | Reproduction / interpretation |
| --- | --- | --- |
| Same protocol fixture over stdio | PASS | `dart test` and `dart run tool/run_transport_conformance.dart --stdio-only` |
| Same protocol fixture over localhost Streamable HTTP | ENVIRONMENT-GATED | Harness/server are implemented; this sandbox rejects `127.0.0.1` socket bind with `Operation not permitted`. |
| Remote HTTP disabled | PASS | `--host 0.0.0.0` exits 64 with `remote HTTP is disabled`; server only binds loopback. |
| Candidate SDK comparison | DOCUMENTED / SDK RUN PENDING | Candidate capabilities and versions are recorded from published primary docs; neither dependency is in production `pubspec.yaml`. |
| MCP Inspector | ENVIRONMENT-GATED | Node/npm exist, but `npx --yes @modelcontextprotocol/inspector --version` timed out after 15 seconds with exit 124 and no output. |
| Flutter baseline | RECORDED | Dart 3.11.5 macOS arm64, existing Flutter config 3.41.9, RelGeo SDK constraint `^3.11.5`. |

This matrix is the boundary of the current spike. A future writable desktop/CI
run can replace the two environment-gated rows and execute the isolated SDK
runbook without changing the package contract or enabling remote access.
