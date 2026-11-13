#!/usr/bin/env node

import { access, readFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
const auditPath = "docs/capability-map/mcp/residual-audit-2026-11-12.md";
const freezePath = "docs/capability-map/mcp/freeze-2026-11-12.md";
const backlogPath = "docs/capability-map/mcp/implementation-gap-backlog.md";
const matrixPath = "docs/capability-map/mcp/status-matrix.md";
const expected = ["VAL-03", "TRAN-03", "DEL-03", "DEL-04", "DEL-05", "DEL-06"];
const expectedStatus = {
  "VAL-03": "⏸️ / environment-unavailable-deferred",
  "TRAN-03": "⏸️ / environment-unavailable-deferred",
  "DEL-03": "⏸️ / environment-unavailable-deferred",
  "DEL-04": "⏸️ / environment-unavailable-deferred",
  "DEL-05": "⏸️ / environment-unavailable-deferred",
  "DEL-06": "⏸️ / environment-unavailable-deferred",
};
const evidenceIdArg = process.argv.find((argument) => argument.startsWith("--evidence-id="));
const evidenceId = evidenceIdArg?.slice("--evidence-id=".length) ?? "unspecified";

const failures = [];
const pass = (_message) => {};
const fail = (message) => failures.push(message);

async function read(relativePath) {
  try {
    return await readFile(join(root, relativePath), "utf8");
  } catch (error) {
    fail(`${relativePath} is readable (${error.code ?? error.message})`);
    return "";
  }
}

async function pathExists(relativePath) {
  try {
    await access(join(root, relativePath));
    return true;
  } catch {
    return false;
  }
}

const [audit, freeze, backlog, matrix] = await Promise.all([
  read(auditPath),
  read(freezePath),
  read(backlogPath),
  read(matrixPath),
]);

const rows = audit
  .split("\n")
  .filter((line) => /^\| `[A-Z]+-\d{2}` \|/.test(line))
  .map((line) => line.split("|").slice(1, -1).map((cell) => cell.trim()));

if (rows.length === expected.length) pass("audit contains exactly six residual rows");
else fail(`audit contains ${rows.length} residual rows; expected ${expected.length}`);

const ids = rows.map((row) => row[0]?.replaceAll("`", ""));
if (ids.join(",") === expected.join(",")) pass("residual IDs match the frozen set in order");
else fail(`residual IDs do not match frozen set: ${ids.join(",")}`);

if (new Set(ids).size === ids.length) pass("residual IDs are unique");
else fail("residual IDs are duplicated");

const pathReferences = (cell) =>
  [...cell.matchAll(/`([^`]+)`/g)]
    .map((match) => match[1])
    .filter((reference) => reference.includes("/"));

for (const row of rows) {
  const [id, rawStatus, lane, owner, source, tests, evidence, finding, closure] = row;
  const status = rawStatus?.replaceAll("`", "");
  if (!expected.includes(id?.replaceAll("`", ""))) continue;
  const normalizedId = id.replaceAll("`", "");
  if (!owner || !source || !tests || !evidence || !finding || !closure) {
    fail(`${normalizedId} is missing owner/source/test/evidence/finding/closure mapping`);
    continue;
  }
  if (status !== expectedStatus[normalizedId]) {
    fail(`${normalizedId} status drift: ${status}; expected ${expectedStatus[normalizedId]}`);
  }
  if (!["evidence-closeable", "decision-deferred", "environment-deferred"].includes(lane)) {
    fail(`${normalizedId} has an invalid closure lane: ${lane}`);
  }
  for (const [label, cell] of [["source", source], ["test/fixture", tests], ["evidence", evidence]]) {
    const references = pathReferences(cell);
    if (references.length === 0) {
      fail(`${normalizedId} has no ${label} path reference`);
      continue;
    }
    for (const reference of references) {
      if (await pathExists(reference)) pass(`${normalizedId} ${label} path exists: ${reference}`);
      else fail(`${normalizedId} ${label} path missing: ${reference}`);
    }
  }
  if (/closed|implemented|passed/i.test(finding) && !/not verified|not canonical|not established|not promoted|unavailable/i.test(finding)) {
    fail(`${normalizedId} finding appears to promote closure without boundary qualification`);
  }
  if (/closed|implemented/i.test(closure)) fail(`${normalizedId} closure condition is already marked closed`);
}

for (const revision of [
  "47c8b526dcf67197d0e5546a310b68dafcdf97fc",
  "824b46eccabd77da37bb37fa72b1c4a0e019442f",
  "1b894663778af002675e253049c8a793c5cea8b9",
]) {
  if (audit.includes(revision) && freeze.includes(revision)) pass(`baseline revision is joined: ${revision}`);
  else fail(`baseline revision is not joined in audit and freeze: ${revision}`);
}

for (const id of expected) {
  if (freeze.includes(`| \`${id}\` |`) && backlog.includes(`| \`${id}\` |`) && matrix.includes(`| \`${id}\` |`)) {
    pass(`${id} is present in freeze, backlog, and status matrix`);
  } else {
    fail(`${id} is missing from freeze, backlog, or status matrix`);
  }
}

if (audit.includes("node scripts/check-mcp-residual-audit.mjs") && audit.includes("Execution and validation record")) {
  pass("audit contains a task-specific execution/validation record");
} else {
  fail("audit execution/validation record is missing");
}

if (failures.length > 0) {
  for (const failure of failures) console.error(`[FAIL] ${failure}`);
  process.exit(1);
}

console.log(`MCP residual audit: PASS (6 one-to-one mappings; source/test/evidence paths present; baseline and deferred boundaries recorded; evidence_id=${evidenceId})`);
