import path from "node:path";

export const PUBLIC_BOUNDARY_CONTRACT = "public-boundary-v1";

const FORBIDDEN_SEGMENT = /(^|\/)(?:node_modules|\.git|\.local|private|scratch|tmp|cache)(\/|$)/i;
const FORBIDDEN_FILENAME = /(^|\/)(?:\.env(?:\..*)?|[^/]+\.(?:pem|key|secret))$/i;
const SECRET_CONTENT = /(?:-----BEGIN [A-Z ]*PRIVATE KEY-----|\b(?:PRIVATE_KEY|ACCESS_TOKEN|NPM_TOKEN|GITHUB_TOKEN|WORKSPACE_DISPATCH_TOKEN|SUBMODULE_CI_VERIFY_TOKEN)\b)/;

function normalizeEntryPath(value) {
  if (typeof value !== "string" || value.length === 0) {
    return { path: String(value ?? ""), reason: "path-not-string" };
  }

  const normalized = value.replaceAll("\\", "/");
  const driveAbsolute = /^[A-Za-z]:\//.test(normalized);
  const parentTraversal = normalized === ".." || normalized.startsWith("../") || normalized.includes("/../");
  if (path.posix.isAbsolute(normalized) || driveAbsolute || parentTraversal) {
    return { path: normalized, reason: "absolute-or-parent-traversal" };
  }
  if (FORBIDDEN_SEGMENT.test(normalized)) {
    return { path: normalized, reason: "private-or-generated-directory" };
  }
  if (FORBIDDEN_FILENAME.test(normalized)) {
    return { path: normalized, reason: "credential-or-environment-file" };
  }
  return null;
}

/**
 * Inspect public-relative entries and optional text contents without exposing
 * the content itself in the diagnostic result.
 */
export function inspectPublicEntries(entries = [], { contents = [] } = {}) {
  const violations = [];
  const normalizedEntries = entries.map((entry) => typeof entry === "string" ? { path: entry } : entry ?? {});

  for (const entry of normalizedEntries) {
    const violation = normalizeEntryPath(entry.path);
    if (violation) violations.push(violation);
  }

  for (const content of contents) {
    const entryPath = typeof content === "string" ? "unknown" : content?.path;
    const text = typeof content === "string" ? content : content?.content;
    const pathViolation = normalizeEntryPath(entryPath);
    if (pathViolation) violations.push(pathViolation);
    if (typeof text !== "string") {
      violations.push({ path: String(entryPath ?? ""), reason: "content-not-string" });
      continue;
    }
    if (SECRET_CONTENT.test(text)) {
      violations.push({ path: String(entryPath ?? ""), reason: "credential-like-content" });
    }
  }

  violations.sort((left, right) => `${left.path}:${left.reason}`.localeCompare(`${right.path}:${right.reason}`));
  return {
    contract: PUBLIC_BOUNDARY_CONTRACT,
    passed: violations.length === 0,
    entriesChecked: normalizedEntries.length,
    contentsChecked: contents.length,
    violations,
  };
}
