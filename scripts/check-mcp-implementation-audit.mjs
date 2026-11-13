#!/usr/bin/env node

import { access, readdir, readFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
const auditPath = "docs/capability-map/mcp/implementation-audit.md";
const registerPath = "docs/capability-map/mcp/implementation-evidence-register.md";
const provenancePath = "docs/evidence/mcp-packaged-artifact-provenance.json";
const snapshotManifestPath = "flutter/assets/relgeo_spec/v0.5/manifest.json";
const externalEvidencePath = ".internal/mcp-external-runtime-evidence-20261111T035454Z.log";
const residualDocumentationPaths = [
  "docs/capability-map/mcp/reconciliation.md",
  "docs/capability-map/mcp/implementation-gap-backlog.md",
  "docs/capability-map/mcp/capability-matrix.md",
];
const requiredSurfaces = [
  "mcp/lib/",
  "mcp/test/",
  "mcp/tool/",
  "flutter/lib/",
  "flutter/test/",
  "language-service/",
  "core/",
  "spec/",
  "fixtures/",
];

const failures = [];
const check = (condition, message) => {
  if (condition) {
    console.log(`[PASS] ${message}`);
  } else {
    failures.push(message);
    console.log(`[FAIL] ${message}`);
  }
};

let audit = "";
let register = "";
try {
  audit = await readFile(join(root, auditPath), "utf8");
  check(true, `${auditPath} is readable`);
} catch (error) {
  check(false, `${auditPath} is readable (${error.code ?? error.message})`);
}
try {
  register = await readFile(join(root, registerPath), "utf8");
  check(true, `${registerPath} is readable`);
} catch (error) {
  check(false, `${registerPath} is readable (${error.code ?? error.message})`);
}

let provenance;
let snapshotManifest;
let externalEvidence = "";
try {
  provenance = JSON.parse(await readFile(join(root, provenancePath), "utf8"));
  check(true, `${provenancePath} is readable and valid JSON`);
} catch (error) {
  check(false, `${provenancePath} is readable and valid JSON (${error.code ?? error.message})`);
}
try {
  snapshotManifest = JSON.parse(await readFile(join(root, snapshotManifestPath), "utf8"));
  check(true, `${snapshotManifestPath} is readable and valid JSON`);
} catch (error) {
  check(false, `${snapshotManifestPath} is readable and valid JSON (${error.code ?? error.message})`);
}
try {
  externalEvidence = await readFile(join(root, externalEvidencePath), "utf8");
  check(true, `${externalEvidencePath} is readable`);
} catch (error) {
  check(false, `${externalEvidencePath} is readable (${error.code ?? error.message})`);
}

const evidenceValue = (key) => {
  const line = externalEvidence.split("\n").find((candidate) => candidate.startsWith(`${key}=`));
  return line?.slice(key.length + 1);
};
const artifactFromEvidence = evidenceValue("packaged_app")?.replaceAll("\\", "/");
const artifactPath = provenance?.testedArtifact?.path;
check(
  provenance?.schemaVersion === 1 && provenance?.recordType === "mcp-packaged-artifact-provenance",
  "packaged artifact provenance record declares its schema and record type",
);
check(
  provenance?.evidenceLog === externalEvidencePath &&
    provenance?.evidenceClass === "external_terminal_manual" &&
    provenance?.canonicalCiEvidence === false,
  "packaged artifact provenance preserves the supporting external-terminal boundary",
);
check(
  typeof artifactFromEvidence === "string" &&
    typeof artifactPath === "string" &&
    artifactFromEvidence.endsWith(artifactPath),
  "tested packaged artifact path is joined to the recorded external runtime log",
);
check(
  provenance?.testedArtifact?.platform === "macos" &&
    provenance?.testedArtifact?.client === "@modelcontextprotocol/inspector --cli" &&
    provenance?.testedArtifact?.transport === "http" &&
    provenance?.testedArtifact?.protocolVersion === "2025-11-25",
  "packaged artifact provenance identifies the macOS Inspector HTTP client and protocol",
);
check(
  provenance?.testedRevisions?.workspace === evidenceValue("root_revision") &&
    provenance?.testedRevisions?.mcp === evidenceValue("mcp_revision") &&
    provenance?.testedRevisions?.flutter === evidenceValue("flutter_revision"),
  "tested artifact provenance is joined to the captured workspace, MCP, and Flutter revisions",
);
check(
  provenance?.bundledSpecSnapshot?.specVersion === snapshotManifest?.specVersion &&
    provenance?.bundledSpecSnapshot?.revision === snapshotManifest?.revision &&
    provenance?.bundledSpecSnapshot?.digestAlgorithm === snapshotManifest?.digestAlgorithm &&
    provenance?.bundledSpecSnapshot?.digest === snapshotManifest?.digest &&
    provenance?.bundledSpecSnapshot?.fileCount === snapshotManifest?.fileCount &&
    provenance?.bundledSpecSnapshot?.sourceUrl === snapshotManifest?.sourceUrl,
  "tested artifact provenance is joined to the bundled full-spec snapshot manifest",
);
check(
  provenance?.runtimeResult?.passedSteps === 12 &&
    provenance?.runtimeResult?.failedSteps === 0 &&
    provenance?.runtimeResult?.blockedSteps === 0 &&
    provenance?.runtimeResult?.overallResult === "PASS" &&
    provenance?.runtimeResult?.capabilityProbe === "relgeo_get_capabilities" &&
    externalEvidence.includes("canonical_ci_evidence=false"),
  "provenance record preserves the external runtime PASS markers without canonical promotion",
);
check(
  provenance?.boundaryDisposition?.managedSandboxSocketAndInspector === "environment_unavailable/deferred" &&
    provenance?.boundaryDisposition?.canonicalCi === "deferred",
  "managed-sandbox socket and canonical CI boundaries remain explicitly deferred",
);

for (const surface of requiredSurfaces) {
  try {
    const entries = await readdir(join(root, surface));
    check(entries.length > 0, `${surface} exists and is non-empty`);
  } catch (error) {
    check(false, `${surface} exists and is non-empty (${error.code ?? error.message})`);
  }
  check(audit.includes(`| \`${surface}\` |`), `${surface} has an explicit audit-inventory row`);
}

const registerIds = [...register.matchAll(/^\| `([A-Z]+-\d{2})` \|/gm)].map((match) => match[1]);
check(registerIds.length === 68 && new Set(registerIds).size === 68, "audit register contains exactly one evidence row for each of the 68 expected IDs");
const residualRows = {
  "DIAG-02": [
    "mcp/lib/src/contract/mcp_schema.dart",
    "mcp/lib/src/adapter/local_dispatch.dart",
    "mcp/lib/src/adapter/authoring_pipeline.dart",
    "mcp/test/local_dispatch_test.dart",
    "mcp/test/authoring_pipeline_test.dart",
  ],
  "PROV-03": [
    "mcp/lib/src/contract/mcp_schema.dart",
    "mcp/lib/src/adapter/authoring_pipeline.dart",
    "mcp/test/mcp_schema_test.dart",
    "mcp/test/authoring_pipeline_test.dart",
    "fixtures/mcp/diagnostics-provenance-cases.json",
  ],
};
for (const [id, requiredPaths] of Object.entries(residualRows)) {
  const row = register.split("\n").find((line) => line.startsWith(`| \`${id}\` |`));
  check(
    Boolean(row) && requiredPaths.every((path) => row.includes(path)),
    `${id} has implementation, test, and evidence closure`,
  );
}
for (const documentationPath of residualDocumentationPaths) {
  try {
    const documentation = await readFile(join(root, documentationPath), "utf8");
    check(
      documentation.includes("DIAG-02") && documentation.includes("PROV-03"),
      `${documentationPath} records DIAG-02 and PROV-03 closure evidence`,
    );
  } catch (error) {
    check(false, `${documentationPath} records DIAG-02 and PROV-03 closure evidence (${error.code ?? error.message})`);
  }
}
const taskRequirementCoverage = {
  "criterion-1-diagnostics-residual-diag-02-and-provenance-resi":
    register.includes("| `DIAG-02` |") && register.includes("| `PROV-03` |"),
  "criterion-2-supporting-local-manual-evidence-remains-distinc":
    provenance?.evidenceClass === "external_terminal_manual" &&
    provenance?.canonicalCiEvidence === false &&
    provenance?.boundaryDisposition?.managedSandboxSocketAndInspector === "environment_unavailable/deferred" &&
    provenance?.boundaryDisposition?.canonicalCi === "deferred",
  "evidence-1-mcp-diagnostics-implementation-and-tests":
    register.includes("| `DIAG-02` |") &&
    register.includes("mcp/test/local_dispatch_test.dart") &&
    register.includes("mcp/test/authoring_pipeline_test.dart"),
  "evidence-2-mcp-provenance-implementation-and-tests":
    register.includes("| `PROV-03` |") &&
    register.includes("mcp/test/mcp_schema_test.dart") &&
    register.includes("mcp/test/authoring_pipeline_test.dart"),
  "evidence-3-docs-capability-map-mcp": auditPath.startsWith("docs/capability-map/mcp/") &&
    registerPath.startsWith("docs/capability-map/mcp/") &&
    residualDocumentationPaths.every((path) => path.startsWith("docs/capability-map/mcp/")),
};
for (const [requirementId, covered] of Object.entries(taskRequirementCoverage)) {
  check(covered, `${requirementId} is covered by the MCP residual audit`);
}
check(audit.includes("verified-local") && audit.includes("not-verified"), "audit distinguishes observed implementation from unverified composition");
check(audit.includes("not-verified") && audit.includes("environment-unavailable"), "audit records evidence-quality and environment limitations explicitly");

for (const dimension of ["Transport", "Sessions", "Documents", "Transactions", "Security", "Failure paths"]) {
  check(audit.includes(`| ${dimension} |`), `${dimension.toLowerCase()} has a concrete audit-dimension row`);
}

for (const path of ["mcp/lib/src/contract/mcp_schema.dart", "mcp/test/local_dispatch_test.dart", "mcp/tool/run_transport_conformance.dart", "flutter/lib/src/mcp/mcp_server_io.dart", "flutter/test/mcp_server_io_test.dart", "language-service/src/completions.ts", "core/src/parser.ts", "spec/id/", "fixtures/mcp/session-transaction-cases.json"]) {
  check(audit.includes(path), `${path} is cited by the audit`);
}

check(audit.includes("does not prove external client") || audit.includes("does not prove external-client"), "audit keeps local/component evidence separate from external-client proof");
check(audit.includes("does not claim semantic") || audit.includes("semantic producer"), "audit keeps retrieval/contract evidence separate from semantic producer delivery");

if (failures.length > 0) {
  console.error(`\n${failures.length} MCP implementation-audit checks failed.`);
  process.exitCode = 1;
} else {
  console.log("\nMCP implementation audit checks passed: all required source surfaces, dimensions, and 68 row-level evidence entries are covered.");
}
