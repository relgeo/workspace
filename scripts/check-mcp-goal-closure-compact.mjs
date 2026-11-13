#!/usr/bin/env node

import { spawnSync } from "node:child_process";

const checks = [
  ["catalog", ["scripts/check-mcp-capability-catalog.mjs"], "MCP capability catalog checks passed"],
  ["residual", ["scripts/check-mcp-residual-audit.mjs", "--evidence-id=mcp-goal-1794436648601740-final"], "MCP residual audit: PASS"],
  ["actionable", ["scripts/check-mcp-actionable-closure.mjs"], "MCP actionable closure: PASS"],
  ["boundaries", ["scripts/check-mcp-evidence-boundaries.mjs"], "MCP evidence boundary reconciliation: PASS"],
  ["task-specific", ["scripts/check-mcp-task-specific-verification.mjs"], "MCP task-specific verification artifact: PASS"],
];

const failures = [];
for (const [id, args, marker] of checks) {
  const result = spawnSync(process.execPath, args, {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  });
  const output = `${result.stdout ?? ""}\n${result.stderr ?? ""}`;
  if (result.status !== 0 || !output.includes(marker)) {
    failures.push(`${id}: exit=${result.status}; marker=${output.includes(marker)}`);
  }
}

if (failures.length > 0) {
  for (const failure of failures) console.error(`[FAIL] ${failure}`);
  process.exit(1);
}

console.log("MCP goal closure compact verification: PASS");
console.log("catalog=PASS; residual=PASS; actionable=PASS; boundaries=PASS; task-specific=PASS");
console.log("evidence=revision-pinned supporting-local; canonical-ci/packaged-runtime/interoperability=deferred");
