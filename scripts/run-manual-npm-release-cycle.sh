#!/usr/bin/env bash

set -euo pipefail

usage() {
  cat <<'USAGE'
Usage:
  scripts/run-manual-npm-release-cycle.sh <version> <package-dir>...
  scripts/run-manual-npm-release-cycle.sh --publish <version> <package-dir>...

Examples:
  scripts/run-manual-npm-release-cycle.sh 0.5.2 core language-service
  scripts/run-manual-npm-release-cycle.sh --publish 0.5.2 core language-service

The package directories must be listed in the release order recorded in
docs/compatibility-matrix.json. The script never creates a release record,
bumps versions, commits, or pushes changes.
USAGE
}

if [[ $# -lt 2 ]]; then
  usage >&2
  exit 2
fi

publish=0
if [[ "$1" == "--publish" ]]; then
  publish=1
  shift
fi

if [[ $# -lt 2 ]]; then
  usage >&2
  exit 2
fi

version="$1"
shift
package_dirs=("$@")

if [[ ! "$version" =~ ^0\.5\.[0-9]+$ ]]; then
  echo "Release version must stay on the 0.5.x compatibility line: $version" >&2
  exit 2
fi

repo_root="$(git rev-parse --show-toplevel)"
cd "$repo_root"

if [[ ! -f "docs/releases/${version}.json" ]]; then
  echo "Missing docs/releases/${version}.json" >&2
  echo "Create and review the planned release record before running this script." >&2
  exit 1
fi

if [[ ! -f "docs/releases/${version}.md" ]]; then
  echo "Missing docs/releases/${version}.md" >&2
  echo "Create and review the human-readable release record before running this script." >&2
  exit 1
fi

if [[ -n "$(git status --short)" ]]; then
  echo "Working tree is not clean. Commit intended release changes first." >&2
  git status --short >&2
  exit 1
fi

if ! npm whoami >/dev/null; then
  echo "npm authentication is not active. Run: npm login" >&2
  exit 1
fi

mkdir -p ".local/release-${version}"
report_dir=".local/release-${version}"

run_step() {
  local name="$1"
  shift
  echo
  echo "==> ${name}"
  "$@" 2>&1 | tee "${report_dir}/${name// /-}.log"
}

run_step "record-check" pnpm run release:record:check "$version"
run_step "candidate-audit" pnpm run release:candidate:audit -- --version="$version"
run_step "build" pnpm run build
run_step "release-audit" pnpm run release:audit
run_step "strict-baseline" pnpm run verify:baseline:strict
run_step "compatibility" pnpm run compatibility:check
run_step "local-integration" pnpm run integration:gate -- --local

echo
echo "Pre-publish checks passed for ${version}."
printf 'Publish order: '
printf '%s ' "${package_dirs[@]}"
echo

if [[ "$publish" -ne 1 ]]; then
  echo "Dry preparation complete; no package was published."
  echo "Review ${report_dir}/ and rerun with --publish only when ready."
  exit 0
fi

for package_dir in "${package_dirs[@]}"; do
  if [[ ! -d "$package_dir" ]]; then
    echo "Package directory does not exist: $package_dir" >&2
    exit 1
  fi

  echo
  echo "==> Publishing ${package_dir}"
  (
    cd "$package_dir"
    npm publish --access public
  ) 2>&1 | tee "${report_dir}/publish-${package_dir//\//-}.log"
done

run_step "registry-verification" pnpm run release:verify-published
run_step "public-integration" pnpm run integration:public

echo
echo "Publish and post-publish verification completed for ${version}."
echo "Update the release record with package results and evidence, then commit it."
