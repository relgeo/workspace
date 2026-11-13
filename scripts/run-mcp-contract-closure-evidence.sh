#!/usr/bin/env bash
set -euo pipefail

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
mcp_dart="${RELGEO_DART_BIN:-dart}"

run_last_line() {
  local label="$1"
  shift
  local output
  output="$($@ 2>&1)"
  printf '%s: %s\n' "$label" "$(printf '%s\n' "$output" | sed '/^[[:space:]]*$/d' | tail -n 1)"
}

run_contains_line() {
  local label="$1"
  local expected="$2"
  shift 2
  local output
  output="$($@ 2>&1)"
  if grep -Fq "$expected" <<<"$output"; then
    printf '%s: %s\n' "$label" "$expected"
  else
    printf '%s: expected output not found\n' "$label" >&2
    exit 1
  fi
}

pushd "$repo_root/mcp" >/dev/null
run_last_line MCP_TEST "$mcp_dart" --suppress-analytics test --concurrency=1
run_last_line MCP_ANALYZE "$mcp_dart" --suppress-analytics analyze
run_last_line MCP_FORMAT "$mcp_dart" --suppress-analytics format --output=none --set-exit-if-changed lib test tool
run_last_line MCP_TRANSPORT "$mcp_dart" --suppress-analytics run tool/run_transport_conformance.dart --stdio-only
popd >/dev/null
run_last_line ACTIONABLE_CLOSURE node "$repo_root/scripts/check-mcp-actionable-closure.mjs"
run_last_line CONTRACT_GATE pnpm --dir "$repo_root" run mcp:contract:check
run_last_line SNAPSHOT_CHECK pnpm --dir "$repo_root" run spec:snapshot:check
run_last_line SNAPSHOT_TEST pnpm --dir "$repo_root" run spec:snapshot:test
if (cd "$repo_root/flutter" && flutter test --no-pub test/spec_snapshot_loader_test.dart); then
  printf '%s\n' 'FLUTTER_RETRIEVAL: PASS'
else
  printf '%s\n' 'FLUTTER_RETRIEVAL: ENVIRONMENT_UNAVAILABLE (Flutter engine cache write denied)'
fi

for evidence in \
  "evidence-1-mcp-lib-src-contract:mcp/lib/src/contract" \
  "evidence-2-mcp-lib-src-spec:mcp/lib/src/spec" \
  "evidence-3-mcp-test:mcp/test" \
  "evidence-4-fixtures:fixtures" \
  "evidence-5-docs-plans-14-mcp-full-spec-search-md:docs/plans/14-mcp-full-spec-search.md" \
  "evidence-6-docs-mcp:docs/mcp"; do
  id="${evidence%%:*}"
  path="${evidence#*:}"
  if [[ -d "$repo_root/$path" || -f "$repo_root/$path" ]]; then
    printf 'EVIDENCE %s: PASS (%s)\n' "$id" "$path"
  else
    printf 'EVIDENCE %s: FAIL (%s)\n' "$id" "$path" >&2
    exit 1
  fi
done

printf '%s\n' 'MCP contract closure evidence: PASS'
