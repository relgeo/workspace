#!/usr/bin/env bash

# Run MCP transport, Inspector, security, and packaged-runtime checks from a
# normal terminal. This script does not mutate source, Git, SuClos state, or
# publish anything. It records external/manual evidence only.

set -u
set -o pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
MCP_DIR="$ROOT_DIR/mcp"
FLUTTER_DIR="$ROOT_DIR/flutter"
INTERNAL_DIR="$ROOT_DIR/.internal"

timestamp="$(date -u +%Y%m%dT%H%M%SZ)"
output_path="$INTERNAL_DIR/mcp-external-runtime-evidence-${timestamp}.log"
skip_desktop=0
desktop_endpoint=""

usage() {
  cat <<'EOF'
Usage:
  ./scripts/run-mcp-external-runtime-evidence.sh [options]

Options:
  --output PATH             Write the evidence log to PATH.
  --desktop-endpoint URL    Use an already enabled packaged-app MCP endpoint.
  --skip-desktop            Skip packaged-app/Inspector smoke (not a full run).
  -h, --help                Show this help.

The full run performs:
  - MCP Dart analyze, tests, stdio, and loopback HTTP conformance
  - Flutter dependency lock, analyzer, and MCP host tests
  - MCP Inspector against an isolated fixture server
  - local security check without authorization
  - a release desktop build on the current host where supported
  - MCP Inspector against the enabled packaged desktop app

For the packaged-app step, launch the built app, choose
Workbench -> MCP Server..., enable it, then provide the endpoint and token
when prompted. The token is never written to the log.

Environment overrides:
  RELGEO_DART_BIN    Dart executable used for MCP checks.
  RELGEO_FLUTTER_BIN Flutter executable used for Flutter checks.
  RELGEO_NPX_BIN     npx executable used for MCP Inspector checks.
EOF
}

while (($# > 0)); do
  case "$1" in
    --output)
      if (($# < 2)); then
        echo "--output requires a path" >&2
        exit 64
      fi
      output_path="$2"
      shift 2
      ;;
    --desktop-endpoint)
      if (($# < 2)); then
        echo "--desktop-endpoint requires a URL" >&2
        exit 64
      fi
      desktop_endpoint="$2"
      shift 2
      ;;
    --skip-desktop)
      skip_desktop=1
      shift
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    *)
      echo "Unknown argument: $1" >&2
      usage >&2
      exit 64
      ;;
  esac
done

mkdir -p "$(dirname "$output_path")"
: > "$output_path"

passed_steps=0
failed_steps=0
blocked_steps=0

log() {
  printf '%s\n' "$*" | tee -a "$output_path"
}

log_command() {
  local arg
  printf '$' | tee -a "$output_path"
  for arg in "$@"; do
    printf ' %q' "$arg" | tee -a "$output_path"
  done
  printf '\n' | tee -a "$output_path"
}

run_step() {
  local label="$1"
  local cwd="$2"
  shift 2

  log ""
  log "=== STEP START: ${label} ==="
  log "cwd=${cwd}"
  log_command "$@"

  (
    cd "$cwd" || exit 126
    "$@"
  ) 2>&1 | tee -a "$output_path"
  local status=${PIPESTATUS[0]}

  if [[ $status -eq 0 ]]; then
    passed_steps=$((passed_steps + 1))
    log "=== STEP PASS: ${label} ==="
  elif [[ $status -eq 126 || $status -eq 127 ]]; then
    blocked_steps=$((blocked_steps + 1))
    log "=== STEP BLOCKED: ${label} (exit ${status}) ==="
  else
    failed_steps=$((failed_steps + 1))
    log "=== STEP FAIL: ${label} (exit ${status}) ==="
  fi
  return 0
}

resolve_executable() {
  local override="$1"
  local command_name="$2"
  if [[ -n "$override" ]]; then
    printf '%s\n' "$override"
    return 0
  fi
  command -v "$command_name" 2>/dev/null || return 1
}

dart_bin="$(resolve_executable "${RELGEO_DART_BIN:-}" dart || true)"
flutter_bin="$(resolve_executable "${RELGEO_FLUTTER_BIN:-}" flutter || true)"
npx_bin="$(resolve_executable "${RELGEO_NPX_BIN:-}" npx || true)"

if [[ -z "$dart_bin" && -n "$flutter_bin" ]]; then
  flutter_bin_dir="$(cd "$(dirname "$flutter_bin")" && pwd)"
  candidate_dart="$flutter_bin_dir/cache/dart-sdk/bin/dart"
  if [[ -x "$candidate_dart" ]]; then
    dart_bin="$candidate_dart"
  fi
fi

cleanup() {
  if [[ -n "${fixture_pid:-}" ]]; then
    kill "$fixture_pid" 2>/dev/null || true
    wait "$fixture_pid" 2>/dev/null || true
  fi
  if [[ -n "${fixture_tmp:-}" && -f "$fixture_tmp" ]]; then
    rm -f "$fixture_tmp"
  fi
}
trap cleanup EXIT INT TERM

log "MCP_EXTERNAL_RUNTIME_EVIDENCE_START"
log "recorded_at_utc=$(date -u +%Y-%m-%dT%H:%M:%SZ)"
log "evidence_class=external_terminal_manual"
log "evidence_boundary=maintainer_terminal_outside_managed_sandbox"
log "root_dir=$ROOT_DIR"
log "mcp_dir=$MCP_DIR"
log "flutter_dir=$FLUTTER_DIR"
log "log_path=$output_path"

if [[ -d "$ROOT_DIR/.git" || -f "$ROOT_DIR/.git" ]]; then
  log "root_revision=$(git -C "$ROOT_DIR" rev-parse HEAD 2>/dev/null || printf unavailable)"
  log "mcp_revision=$(git -C "$MCP_DIR" rev-parse HEAD 2>/dev/null || printf unavailable)"
  log "flutter_revision=$(git -C "$FLUTTER_DIR" rev-parse HEAD 2>/dev/null || printf unavailable)"
  log "root_worktree=$(git -C "$ROOT_DIR" status --short 2>/dev/null | tr '\n' ';' || printf unavailable)"
  log "mcp_worktree=$(git -C "$MCP_DIR" status --short 2>/dev/null | tr '\n' ';' || printf unavailable)"
  log "flutter_worktree=$(git -C "$FLUTTER_DIR" status --short 2>/dev/null | tr '\n' ';' || printf unavailable)"
fi

if [[ -n "$dart_bin" ]]; then
  log "dart_bin=$dart_bin"
  run_step "MCP Dart analyzer" "$MCP_DIR" "$dart_bin" --suppress-analytics analyze
  run_step "MCP pure-Dart tests" "$MCP_DIR" "$dart_bin" --suppress-analytics test
  run_step "MCP stdio and remote-bind conformance" "$MCP_DIR" "$dart_bin" --suppress-analytics run tool/run_transport_conformance.dart --stdio-only
  run_step "MCP loopback Streamable HTTP conformance" "$MCP_DIR" "$dart_bin" --suppress-analytics run tool/run_transport_conformance.dart
else
  blocked_steps=$((blocked_steps + 4))
  log "=== BLOCKED: Dart executable not found; set RELGEO_DART_BIN or put dart/flutter on PATH ==="
fi

if [[ -n "$flutter_bin" ]]; then
  log "flutter_bin=$flutter_bin"
  run_step "Flutter dependency lock" "$FLUTTER_DIR" "$flutter_bin" pub get --enforce-lockfile
  run_step "Flutter analyzer" "$FLUTTER_DIR" "$flutter_bin" analyze --no-fatal-warnings --no-fatal-infos
  run_step "Flutter MCP host and loopback tests" "$FLUTTER_DIR" "$flutter_bin" test --no-pub test/spec_snapshot_loader_test.dart test/workbench_agent_bridge_test.dart test/mcp_server_io_test.dart
else
  blocked_steps=$((blocked_steps + 3))
  log "=== BLOCKED: Flutter executable not found; set RELGEO_FLUTTER_BIN or put flutter on PATH ==="
fi

fixture_tmp="$(mktemp "${TMPDIR:-/tmp}/relgeo-mcp-fixture.XXXXXX")"
if [[ -n "$dart_bin" && -n "$npx_bin" ]]; then
  log ""
  log "=== STEP START: MCP Inspector fixture tools/list ==="
  log "cwd=$MCP_DIR"
  log "fixture_transport=http"
  (
    cd "$MCP_DIR" || exit 126
    "$dart_bin" --suppress-analytics run tool/mcp_fixture_server.dart \
      --transport http --host 127.0.0.1 --port 0 >"$fixture_tmp" 2>&1
  ) &
  fixture_pid=$!
  fixture_endpoint=""
  for _ in $(seq 1 100); do
    if [[ -s "$fixture_tmp" ]]; then
      fixture_endpoint="$(sed -n 's/^MCP_FIXTURE_READY //p' "$fixture_tmp" | head -n 1)"
      [[ -n "$fixture_endpoint" ]] && break
    fi
    sleep 0.1
  done
  if [[ -z "$fixture_endpoint" ]]; then
    cat "$fixture_tmp" | tee -a "$output_path"
    failed_steps=$((failed_steps + 1))
    log "=== STEP FAIL: MCP Inspector fixture tools/list (fixture did not start) ==="
  else
    log "fixture_endpoint=$fixture_endpoint"
    "$npx_bin" --yes @modelcontextprotocol/inspector --cli \
      --server-url "$fixture_endpoint" --transport http \
      --protocol-era legacy --method tools/list --format json \
      2>&1 | tee -a "$output_path"
    inspector_status=${PIPESTATUS[0]}
    if [[ $inspector_status -eq 0 ]]; then
      passed_steps=$((passed_steps + 1))
      log "=== STEP PASS: MCP Inspector fixture tools/list ==="
    else
      failed_steps=$((failed_steps + 1))
      log "=== STEP FAIL: MCP Inspector fixture tools/list (exit ${inspector_status}) ==="
    fi
  fi
else
  blocked_steps=$((blocked_steps + 1))
  log "=== STEP BLOCKED: MCP Inspector fixture (dart or npx unavailable) ==="
fi

if [[ $skip_desktop -eq 0 ]]; then
  if [[ -n "$flutter_bin" && "$(uname -s)" == "Darwin" ]]; then
    run_step "Flutter macOS release packaged build" "$FLUTTER_DIR" "$flutter_bin" build macos --release --no-pub
    app_path="$(find "$FLUTTER_DIR/build/macos" -type d -name '*.app' -print 2>/dev/null | head -n 1)"
    if [[ -n "$app_path" && -x "$app_path/Contents/MacOS/$(basename "$app_path" .app)" ]]; then
      log "packaged_app=$app_path"
    elif [[ -n "$app_path" ]]; then
      log "packaged_app=$app_path"
      log "packaged_app_executable=not_found_or_named_differently"
    else
      log "packaged_app=not_found"
    fi
  else
    blocked_steps=$((blocked_steps + 1))
    log "=== STEP BLOCKED: packaged desktop build requires Flutter on macOS or a target-specific runner ==="
  fi

  if [[ -z "$desktop_endpoint" && -t 0 ]]; then
    log ""
    log "Packaged-app smoke requires a running desktop app with MCP enabled."
    log "Launch the packaged app, choose Workbench -> MCP Server..., enable it,"
    log "then press Enter here to provide its endpoint and token."
    read -r -p "Press Enter when the packaged app MCP server is enabled... " _
    read -r -p "MCP endpoint URL: " desktop_endpoint
  fi

  if [[ -n "$desktop_endpoint" && -n "$npx_bin" && -t 0 ]]; then
    read -r -s -p "MCP bearer token (input hidden; never logged): " desktop_token
    printf '\n'
    log ""
    log "=== STEP START: packaged-app security without authorization ==="
    log "endpoint=$desktop_endpoint"
    unauth_body="$(mktemp "${TMPDIR:-/tmp}/relgeo-mcp-unauth.XXXXXX")"
    unauth_code="$(curl -sS -o "$unauth_body" -w '%{http_code}' \
      -X POST "$desktop_endpoint" \
      -H 'Accept: application/json, text/event-stream' \
      -H 'Content-Type: application/json' \
      -H 'MCP-Protocol-Version: 2025-11-25' \
      --data '{"jsonrpc":"2.0","id":1,"method":"tools/list"}' 2>>"$output_path" || printf '000')"
    log "unauthorized_http_status=$unauth_code"
    if [[ "$unauth_code" == "401" || "$unauth_code" == "403" ]]; then
      passed_steps=$((passed_steps + 1))
      log "=== STEP PASS: packaged-app security without authorization ==="
    else
      failed_steps=$((failed_steps + 1))
      log "=== STEP FAIL: packaged-app security without authorization ==="
      sed -n '1,80p' "$unauth_body" | tee -a "$output_path"
    fi
    rm -f "$unauth_body"

    log ""
    log "=== STEP START: packaged-app Inspector tools/list ==="
    log "endpoint=$desktop_endpoint"
    log_command "$npx_bin" --yes @modelcontextprotocol/inspector --cli \
      --server-url "$desktop_endpoint" --transport http \
      --header 'Authorization: Bearer <redacted>' \
      --header 'MCP-Protocol-Version: 2025-11-25' \
      --method tools/list --format json
    "$npx_bin" --yes @modelcontextprotocol/inspector --cli \
      --server-url "$desktop_endpoint" --transport http \
      --header "Authorization: Bearer $desktop_token" \
      --header 'MCP-Protocol-Version: 2025-11-25' \
      --method tools/list --format json 2>&1 | tee -a "$output_path"
    inspector_status=${PIPESTATUS[0]}
    if [[ $inspector_status -eq 0 ]]; then
      passed_steps=$((passed_steps + 1))
      log "=== STEP PASS: packaged-app Inspector tools/list ==="
    else
      failed_steps=$((failed_steps + 1))
      log "=== STEP FAIL: packaged-app Inspector tools/list (exit ${inspector_status}) ==="
    fi

    log ""
    log "=== STEP START: packaged-app Inspector get_capabilities ==="
    log_command "$npx_bin" --yes @modelcontextprotocol/inspector --cli \
      --server-url "$desktop_endpoint" --transport http \
      --header 'Authorization: Bearer <redacted>' \
      --header 'MCP-Protocol-Version: 2025-11-25' \
      --method tools/call --tool-name relgeo_get_capabilities --format json
    "$npx_bin" --yes @modelcontextprotocol/inspector --cli \
      --server-url "$desktop_endpoint" --transport http \
      --header "Authorization: Bearer $desktop_token" \
      --header 'MCP-Protocol-Version: 2025-11-25' \
      --method tools/call --tool-name relgeo_get_capabilities --format json \
      2>&1 | tee -a "$output_path"
    inspector_status=${PIPESTATUS[0]}
    if [[ $inspector_status -eq 0 ]]; then
      passed_steps=$((passed_steps + 1))
      log "=== STEP PASS: packaged-app Inspector get_capabilities ==="
    else
      failed_steps=$((failed_steps + 1))
      log "=== STEP FAIL: packaged-app Inspector get_capabilities (exit ${inspector_status}) ==="
    fi
    unset desktop_token
  else
    blocked_steps=$((blocked_steps + 1))
    log "=== STEP BLOCKED: packaged-app Inspector smoke requires an interactive endpoint/token and npx ==="
  fi
else
  log "=== STEP SKIP: packaged-app smoke disabled by --skip-desktop ==="
fi

log ""
log "MCP_EXTERNAL_RUNTIME_EVIDENCE_SUMMARY"
log "passed_steps=$passed_steps"
log "failed_steps=$failed_steps"
log "blocked_steps=$blocked_steps"
log "supporting_evidence_log=$output_path"
log "canonical_ci_evidence=false"

if ((failed_steps == 0 && blocked_steps == 0)); then
  log "overall_result=PASS"
  log "MCP_EXTERNAL_RUNTIME_EVIDENCE_END"
  exit 0
fi

if ((failed_steps > 0)); then
  log "overall_result=FAIL"
else
  log "overall_result=ENVIRONMENT_UNAVAILABLE_OR_INCOMPLETE"
fi
log "MCP_EXTERNAL_RUNTIME_EVIDENCE_END"
exit 1
