#!/usr/bin/env bash

# Run MCP transport/host checks from a normal user terminal and retain a
# reproducible supporting-evidence log. This script never publishes, commits,
# pushes, edits source, or changes the SuClos goal state.

set -u
set -o pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
MCP_DIR="$ROOT_DIR/mcp"
FLUTTER_DIR="$ROOT_DIR/flutter"

usage() {
  cat <<'EOF'
Usage:
  ./scripts/run-mcp-manual-transport-evidence.sh [--output PATH]

Options:
  --output PATH  Write the evidence log to PATH instead of .internal/.
  -h, --help     Show this help.

Environment overrides:
  RELGEO_DART_BIN    Dart executable used for the pure-Dart MCP checks.
  RELGEO_FLUTTER_BIN Flutter executable used for the Flutter checks.

The command runs:
  - MCP Dart analyze and tests
  - stdio plus remote-bind guard conformance
  - full loopback Streamable HTTP conformance
  - Flutter analyze
  - selected Flutter MCP consumer tests, including the real loopback server

The resulting log is supporting local evidence. It is not a CI/public
validation record until a maintainer or SuClos explicitly records it.
EOF
}

timestamp="$(date -u +%Y%m%dT%H%M%SZ)"
output_path="$ROOT_DIR/.internal/mcp-manual-transport-evidence-${timestamp}.log"

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

failed_steps=0
blocked_steps=0
passed_steps=0

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

dart_bin="${RELGEO_DART_BIN:-}"
if [[ -z "$dart_bin" ]]; then
  dart_bin="$(resolve_executable "" dart || true)"
fi

flutter_bin="${RELGEO_FLUTTER_BIN:-}"
if [[ -z "$flutter_bin" ]]; then
  flutter_bin="$(resolve_executable "" flutter || true)"
fi

if [[ -z "$dart_bin" && -n "$flutter_bin" ]]; then
  flutter_bin_dir="$(cd "$(dirname "$flutter_bin")" && pwd)"
  candidate_dart="$flutter_bin_dir/cache/dart-sdk/bin/dart"
  if [[ -x "$candidate_dart" ]]; then
    dart_bin="$candidate_dart"
  fi
fi

log "MCP_MANUAL_TRANSPORT_EVIDENCE_START"
log "recorded_at_utc=$(date -u +%Y-%m-%dT%H:%M:%SZ)"
log "evidence_class=supporting_local_manual"
log "evidence_boundary=manual_terminal_outside_managed_sandbox"
log "root_dir=$ROOT_DIR"
log "mcp_dir=$MCP_DIR"
log "flutter_dir=$FLUTTER_DIR"
log "log_path=$output_path"

if [[ -d "$ROOT_DIR/.git" || -f "$ROOT_DIR/.git" ]]; then
  root_revision="$(git -C "$ROOT_DIR" rev-parse HEAD 2>/dev/null || printf 'unavailable')"
  mcp_revision="$(git -C "$MCP_DIR" rev-parse HEAD 2>/dev/null || printf 'unavailable')"
  flutter_revision="$(git -C "$FLUTTER_DIR" rev-parse HEAD 2>/dev/null || printf 'unavailable')"
  log "root_revision=$root_revision"
  log "mcp_revision=$mcp_revision"
  log "flutter_revision=$flutter_revision"
fi

if [[ -n "$dart_bin" ]]; then
  log "dart_bin=$dart_bin"
  run_step "MCP Dart analyzer" "$MCP_DIR" "$dart_bin" --suppress-analytics analyze
  run_step "MCP pure-Dart tests" "$MCP_DIR" "$dart_bin" --suppress-analytics test
  run_step "MCP stdio and remote-bind conformance" "$MCP_DIR" "$dart_bin" --suppress-analytics run tool/run_transport_conformance.dart --stdio-only
  run_step "MCP full loopback Streamable HTTP conformance" "$MCP_DIR" "$dart_bin" --suppress-analytics run tool/run_transport_conformance.dart
else
  blocked_steps=$((blocked_steps + 4))
  log "=== BLOCKED: Dart executable not found; set RELGEO_DART_BIN or put dart/flutter on PATH ==="
fi

if [[ -n "$flutter_bin" ]]; then
  log "flutter_bin=$flutter_bin"
  run_step "Flutter dependency lock" "$FLUTTER_DIR" "$flutter_bin" pub get --enforce-lockfile
  run_step "Flutter analyzer" "$FLUTTER_DIR" "$flutter_bin" analyze --no-fatal-warnings --no-fatal-infos
  run_step "Flutter MCP consumer and loopback tests" "$FLUTTER_DIR" "$flutter_bin" test --no-pub test/spec_snapshot_loader_test.dart test/workbench_agent_bridge_test.dart test/mcp_server_io_test.dart
else
  blocked_steps=$((blocked_steps + 3))
  log "=== BLOCKED: Flutter executable not found; set RELGEO_FLUTTER_BIN or put flutter on PATH ==="
fi

log ""
log "MCP_MANUAL_TRANSPORT_EVIDENCE_SUMMARY"
log "passed_steps=$passed_steps"
log "failed_steps=$failed_steps"
log "blocked_steps=$blocked_steps"
log "supporting_evidence_log=$output_path"

if ((failed_steps == 0 && blocked_steps == 0)); then
  log "overall_result=PASS"
  log "MCP_MANUAL_TRANSPORT_EVIDENCE_END"
  exit 0
fi

if ((failed_steps > 0)); then
  log "overall_result=FAIL"
else
  log "overall_result=ENVIRONMENT_UNAVAILABLE"
fi
log "MCP_MANUAL_TRANSPORT_EVIDENCE_END"
exit 1
