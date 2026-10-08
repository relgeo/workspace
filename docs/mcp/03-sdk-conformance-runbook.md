# SDK conformance runbook

This is the reproducible follow-up for the SDK portion of the transport spike.
It is deliberately isolated from `mcp/pubspec.yaml`, so a failed or
incompatible candidate cannot alter the RelGeo package lock or desktop app.

## Shared fixture

Both candidates must be driven through this exact sequence:

```text
initialize(protocolVersion=2025-11-25)
notifications/initialized
tools/list
tools/call(name=relgeo_fixture_echo, message="same wire contract")
resources/list
resources/read(uri=relgeo://fixture/provenance)
```

The dependency-free fixture sequence is already executable with:

```text
cd mcp
dart pub get
dart test
dart run tool/run_transport_conformance.dart --stdio-only
```

## Candidate A — `dart_mcp`

Create a temporary Dart package outside the repository, add the pinned
candidate version, and implement the smallest server using `MCPServer`, its
`ToolsSupport`/`ResourcesSupport` mixins, and `stdioChannel`. Run the same
fixture client against the resulting executable. For HTTP, use the candidate's
Streamable HTTP handler and bind only `127.0.0.1`.

Record:

- package and Dart SDK versions resolved;
- initialize response protocol version;
- `tools/list` schema and `resources/read` result;
- stdio exit/diagnostic behavior;
- HTTP response content type and required headers;
- whether the same server can satisfy the legacy fixture without a custom
  compatibility adapter.

## Candidate B — `mcp_dart`

Repeat the exact same sequence in an isolated package using the candidate's
server registration APIs and its stdio/Streamable HTTP transports. Run its
documented `conformance`/inspection command in addition to the shared fixture.
Test both the initialization-era profile used by this fixture and the modern
profile supported by the current SDK documentation; do not mix results from
the two profiles.

## Acceptance gate

Pin a candidate only if it passes:

1. shared fixture over stdio;
2. shared fixture over Streamable HTTP at `127.0.0.1`;
3. invalid tool arguments produce a protocol error, not a process crash;
4. missing/mismatched HTTP protocol metadata is rejected;
5. remote bind is unavailable by configuration and by runtime guard;
6. Inspector CLI can list tools and read the fixture resource.

Until all six checks have evidence, `mcp/pubspec.yaml` must remain SDK-neutral.
