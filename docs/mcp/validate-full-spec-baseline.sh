#!/usr/bin/env bash
set -euo pipefail

audit_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$audit_root"

fail() {
  printf 'baseline audit check failed: %s\n' "$1" >&2
  exit 1
}

test -s docs/mcp/05-full-spec-search-baseline-audit.md || \
  fail 'baseline audit document is missing or empty'
test -s docs/capability-map/mcp/implementation-audit.md || \
  fail 'capability-map audit document is missing or empty'

markdown_count="$(rg --files spec/id -g '*.md' | wc -l | tr -d ' ')"
normative_count="$(rg -l 'Status dokumen: `Normative`' spec/id -g '*.md' | wc -l | tr -d ' ')"
test "$markdown_count" = 34 || fail "expected 34 spec Markdown files, found $markdown_count"
test "$normative_count" = 26 || fail "expected 26 normative files, found $normative_count"

rg -q 'Superseded for the current checkout' docs/mcp/05-full-spec-search-baseline-audit.md || \
  fail 'historical audit is not marked superseded'
rg -q 'relgeo_search_spec' mcp/lib/src/adapter/local_dispatch.dart || \
  fail 'current full-spec search tool is missing'
rg -q 'relgeo_get_spec_section' mcp/lib/src/adapter/local_dispatch.dart || \
  fail 'current section retrieval tool is missing'
rg -q 'resources/templates/list' mcp/lib/src/adapter/local_dispatch.dart || \
  fail 'MCP section resource template route is missing'
test -s flutter/assets/relgeo_spec/v0.5/manifest.json || \
  fail 'current Flutter spec snapshot manifest is missing'

printf 'historical baseline audit: PASS (34 Markdown, 26 normative; current full-spec retrieval and bundled snapshot are present)\n'
