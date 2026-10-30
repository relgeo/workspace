# SDK conformance runbook

This is the reproducible follow-up for the SDK portion of the transport spike.
It is deliberately isolated from `mcp/pubspec.yaml`, so a failed or
incompatible candidate cannot alter the RelGeo package lock or desktop app.

## Scope boundary

This runbook validates protocol/adapter behavior only. It does not authorize
or require npm/pub.dev publication, a remote MCP endpoint, production
deployment, or image creation/editing. The MCP package remains pure Dart and
private; Flutter is the local host/asset bridge. Plan 13's generated JSON
catalog is outside this retrieval gate. Inspector and loopback HTTP checks are
developer/desktop evidence and remain environment-gated until a permitted host
can execute them.

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

## RelGeo full-spec adapter wire checks

The pure-Dart adapter is exercised independently of either candidate SDK. A
host constructs `SpecSectionIndex` from the pinned `spec/id/` snapshot and
passes it to both `RelGeoMcpToolDispatcher` and
`RelGeoMcpResourceStore`. The JSON-RPC conformance cases are:

1. `tools/list` advertises `relgeo_search_spec`,
   `relgeo_get_spec_section`, the legacy `relgeo_find_syntax` alias, and
   `relgeo_get_capabilities` only when the snapshot is loaded;
2. `tools/call` returns bounded search results with snapshot revision/digest
   and complete section content with section provenance;
3. a valid no-result query succeeds with `matches: []` and `noResults: true`;
4. a requested `specVersion` different from the pinned snapshot returns JSON-RPC
   `-32602` with requested and available versions;
5. a canonical retrieval call without a snapshot returns `-32001` with an
   explicit pinned-local-snapshot requirement;
6. `resources/list` exposes the concrete index resource;
   `resources/templates/list` exposes the section URI template; and
   `resources/read` returns the same snapshot metadata and section identity.

These checks are covered by `mcp/test/local_dispatch_test.dart`. They are
adapter-boundary evidence, not evidence that either external SDK has been
selected or that localhost HTTP socket binding is available in every sandbox.

## Full-spec retrieval quality evidence

The checked-in Flutter asset bundle is exercised directly with the same
`relGeoSpecSearchFixtures` catalog used by the pure-Dart contract:

```text
cd flutter
flutter test --no-pub test/spec_snapshot_loader_test.dart
```

The test covers the current 34-file snapshot and verifies:

- Indonesian/English intent for `kotak rect rectangle`,
  `parameters constants`, `point on path placement`, and presentation terms;
- every expected section ID in the fixture catalog, including the honest
  no-result query;
- ambiguous placement results with shared revision/digest and per-section
  source URLs;
- complete `rect` section retrieval bounded before the next peer heading;
- normative provenance for rules and informative provenance for `README.md`.

Observed result: **PASS** on the checked-in asset bundle. The adapter tests
also verify that desktop examples remain `source: example` and
`normative: false`, while full-spec sections remain `source: spec`.

Live MCP Inspector/Codex Desktop workflow and loopback Streamable HTTP remain
**NOT VERIFIED / ENVIRONMENT-GATED** in the managed runner: the existing
transport spike records that local socket binding is denied and the Inspector
`npx` probe timed out. This does not invalidate the deterministic offline
retrieval evidence above; the writable desktop run remains the final external
smoke step.
