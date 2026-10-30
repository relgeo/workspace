const TRANSIENT_FAILURE_PATTERN = /(?:ECONNRESET|ECONNREFUSED|EAI_AGAIN|ETIMEDOUT|timed? ?out|timeout|socket hang up|network|fetch failed|rate limit|\b429\b|\b502\b|\b503\b|\b504\b)/i;
const ENVIRONMENT_FAILURE_PATTERN = /(?:requires Node(?:\.js)?|unsupported engine|operation not permitted|permission denied|command not found|no such file|cannot find module|browser.*(?:not found|missing))/i;

export const EVIDENCE_SCHEMA_VERSION = 1;

export const BLOCKER_CLASSES = Object.freeze([
  "target-defect",
  "transient",
  "dependency-unavailable",
  "environment-unavailable",
  "pending-human-decision",
]);

export const DEPENDENCY_STATUSES = Object.freeze([
  "ready",
  "blocked",
  "not-run",
  "none",
]);

export const DEFAULT_RETRY_POLICY = Object.freeze({
  maxAttempts: 2,
  backoffMs: 250,
});

export function classifyFailure({
  blockerClass,
  dependencyUnavailable = false,
  decisionRequired = false,
  environmentUnavailable = false,
  error = "",
  output = "",
  prerequisite = false,
  retryable = undefined,
} = {}) {
  if (blockerClass && !BLOCKER_CLASSES.includes(blockerClass)) {
    throw new Error("Unknown blocker class: " + blockerClass);
  }

  if (blockerClass) {
    return {
      blockerClass,
      retryable: retryable ?? blockerClass === "transient",
      remediation: remediationFor(blockerClass),
      decisionRequired: decisionRequired || blockerClass === "pending-human-decision",
    };
  }

  if (decisionRequired) {
    return {
      blockerClass: "pending-human-decision",
      retryable: false,
      remediation: remediationFor("pending-human-decision"),
      decisionRequired: true,
    };
  }

  if (dependencyUnavailable) {
    return {
      blockerClass: "dependency-unavailable",
      retryable: false,
      remediation: remediationFor("dependency-unavailable"),
      decisionRequired: false,
    };
  }

  const text = error + "\n" + output;
  if (environmentUnavailable || prerequisite || ENVIRONMENT_FAILURE_PATTERN.test(text)) {
    return {
      blockerClass: "environment-unavailable",
      retryable: false,
      remediation: remediationFor("environment-unavailable"),
      decisionRequired: false,
    };
  }

  const isTransient = retryable ?? TRANSIENT_FAILURE_PATTERN.test(text);
  return {
    blockerClass: isTransient ? "transient" : "target-defect",
    retryable: isTransient,
    remediation: remediationFor(isTransient ? "transient" : "target-defect"),
    decisionRequired: false,
  };
}

function remediationFor(blockerClass) {
  return {
    "target-defect": "Fix the owning stage or contract failure before rerunning.",
    transient: "Retry within the bounded budget, then preserve the first failure for diagnosis.",
    "dependency-unavailable": "Restore or declare the missing dependency/service before dependent work.",
    "environment-unavailable": "Run on the declared toolchain/host or record the environment limitation.",
    "pending-human-decision": "Obtain the named maintainer decision before promotion or scope change.",
  }[blockerClass];
}

export function createEvidenceEnvelope({
  evidenceClass,
  workspaceRevision,
  baselineName,
  compatibilityLine,
  toolchain = {},
  limitations = [],
} = {}) {
  if (!evidenceClass) throw new Error("evidenceClass is required");
  return {
    schemaVersion: EVIDENCE_SCHEMA_VERSION,
    evidenceClass,
    workspaceRevision: workspaceRevision ?? "unknown",
    baseline: {
      name: baselineName ?? "unknown",
      compatibilityLine: compatibilityLine ?? "unknown",
    },
    toolchain: {
      node: toolchain.node ?? process.version,
      pnpm: toolchain.pnpm ?? null,
    },
    limitations: [...limitations],
  };
}

function sleepSync(milliseconds) {
  if (milliseconds <= 0) return;
  const buffer = new SharedArrayBuffer(4);
  Atomics.wait(new Int32Array(buffer), 0, 0, milliseconds);
}

export function runWithBoundedAttemptsSync(execute, {
  maxAttempts = DEFAULT_RETRY_POLICY.maxAttempts,
  backoffMs = DEFAULT_RETRY_POLICY.backoffMs,
  sleep = sleepSync,
  classify = classifyFailure,
} = {}) {
  if (!Number.isInteger(maxAttempts) || maxAttempts < 1) {
    throw new Error("maxAttempts must be a positive integer");
  }

  const attempts = [];
  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    const result = execute(attempt) ?? {};
    const normalized = {
      ...result,
      attempt,
      passed: result.passed === true,
    };
    if (normalized.passed) {
      attempts.push(normalized);
      break;
    }

    const failure = classify(normalized);
    const classified = { ...normalized, ...failure };
    attempts.push(classified);
    if (!classified.retryable || attempt >= maxAttempts) break;
    sleep(backoffMs * attempt);
  }

  const finalAttempt = attempts.at(-1) ?? { passed: false, attempt: 0 };
  return {
    passed: finalAttempt.passed === true,
    attempts,
    finalAttempt,
  };
}
