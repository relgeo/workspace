const TRANSIENT_FAILURE_PATTERN = /(?:ECONNRESET|ECONNREFUSED|EAI_AGAIN|ETIMEDOUT|timed? ?out|timeout|socket hang up|network|fetch failed|rate limit|\b429\b|\b502\b|\b503\b|\b504\b)/i;
const ENVIRONMENT_FAILURE_PATTERN = /(?:requires Node(?:\.js)?|unsupported engine|operation not permitted|permission denied|command not found|no such file|cannot find module|browser.*(?:not found|missing))/i;

export const EVIDENCE_SCHEMA_VERSION = 1;

export const EVIDENCE_CLASSES = Object.freeze([
  "local-workspace",
  "public-registry",
  "ci-canonical",
  "manual",
  "public-deployment",
  "baseline-snapshot",
]);

export const EVIDENCE_STATES = Object.freeze([
  "current",
  "historical",
  "unverified",
]);

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

export const DECISION_STATES = Object.freeze([
  "not-required",
  "approved",
  "pending",
  "rejected",
  "stale",
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
    const needsDecision = decisionRequired || blockerClass === "pending-human-decision";
    return {
      blockerClass,
      retryable: retryable ?? blockerClass === "transient",
      remediation: remediationFor(blockerClass),
      decisionRequired: needsDecision,
      decisionNeeded: needsDecision,
    };
  }

  if (decisionRequired) {
    return {
      blockerClass: "pending-human-decision",
      retryable: false,
      remediation: remediationFor("pending-human-decision"),
      decisionRequired: true,
      decisionNeeded: true,
    };
  }

  if (dependencyUnavailable) {
    return {
      blockerClass: "dependency-unavailable",
      retryable: false,
      remediation: remediationFor("dependency-unavailable"),
      decisionRequired: false,
      decisionNeeded: false,
    };
  }

  const text = error + "\n" + output;
  if (environmentUnavailable || prerequisite || ENVIRONMENT_FAILURE_PATTERN.test(text)) {
    return {
      blockerClass: "environment-unavailable",
      retryable: false,
      remediation: remediationFor("environment-unavailable"),
      decisionRequired: false,
      decisionNeeded: false,
    };
  }

  const isTransient = retryable ?? TRANSIENT_FAILURE_PATTERN.test(text);
  return {
    blockerClass: isTransient ? "transient" : "target-defect",
    retryable: isTransient,
    remediation: remediationFor(isTransient ? "transient" : "target-defect"),
    decisionRequired: false,
    decisionNeeded: false,
  };
}

/**
 * Central promotion/scope decision gate. It reuses the existing public-safe
 * blocker fields so callers remain backward-compatible with current reports.
 */
export function evaluateDecisionGate({
  required = false,
  status = "not-required",
} = {}) {
  if (!DECISION_STATES.includes(status)) {
    throw new Error("Unknown decision state: " + status);
  }
  if (!required) {
    return {
      allowed: true,
      decisionState: status,
      dependencyStatus: "none",
      decisionRequired: false,
      decisionNeeded: false,
      blockerClass: null,
      retryable: false,
    };
  }
  if (status === "approved") {
    return {
      allowed: true,
      decisionState: status,
      dependencyStatus: "ready",
      decisionRequired: false,
      decisionNeeded: false,
      blockerClass: null,
      retryable: false,
    };
  }
  return {
    allowed: false,
    decisionState: status,
    dependencyStatus: "blocked",
    ...classifyFailure({
      blockerClass: "pending-human-decision",
      decisionRequired: true,
    }),
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
  evidenceState = "current",
  capturedAt = new Date().toISOString(),
  workspaceRevision,
  baselineName,
  baselineCapturedAt = null,
  compatibilityLine,
  toolchain = {},
  childRevisions = {},
  runId = null,
  artifact = null,
  command = null,
  limitations = [],
} = {}) {
  if (!evidenceClass) throw new Error("evidenceClass is required");
  if (!EVIDENCE_CLASSES.includes(evidenceClass)) {
    throw new Error("Unknown evidence class: " + evidenceClass);
  }
  if (!EVIDENCE_STATES.includes(evidenceState)) {
    throw new Error("Unknown evidence state: " + evidenceState);
  }
  if (!capturedAt) throw new Error("capturedAt is required");
  return {
    schemaVersion: EVIDENCE_SCHEMA_VERSION,
    evidenceClass,
    evidenceState,
    capturedAt,
    workspaceRevision: workspaceRevision ?? "unknown",
    baseline: {
      name: baselineName ?? "unknown",
      capturedAt: baselineCapturedAt,
      compatibilityLine: compatibilityLine ?? "unknown",
    },
    testedRevisions: {
      root: workspaceRevision ?? "unknown",
      children: { ...childRevisions },
    },
    toolchain: {
      node: toolchain.node ?? process.version,
      pnpm: toolchain.pnpm ?? null,
    },
    run: { id: runId },
    artifact,
    command,
    limitations: [...limitations],
  };
}

/**
 * Historical evidence is immutable context, never a current claim. Current
 * evidence is only eligible when its root/baseline/child revisions match the
 * revisions being claimed; toolchain or limitation gaps remain visible.
 */
export function assessEvidenceFreshness({
  evidence,
  workspaceRevision,
  baselineName,
  childRevisions = {},
} = {}) {
  const reasons = [];
  if (!evidence || typeof evidence !== "object") {
    return { current: false, reasons: ["missing-evidence"] };
  }
  if (evidence.evidenceState === "historical") reasons.push("historical-evidence");
  if (evidence.evidenceState !== "current") reasons.push("not-current-state");
  if (workspaceRevision && evidence.testedRevisions?.root !== workspaceRevision) {
    reasons.push("root-revision-mismatch");
  }
  if (baselineName && evidence.baseline?.name !== baselineName) {
    reasons.push("baseline-name-mismatch");
  }
  for (const [path, revision] of Object.entries(childRevisions)) {
    if (evidence.testedRevisions?.children?.[path] !== revision) {
      reasons.push("child-revision-mismatch:" + path);
    }
  }
  return { current: reasons.length === 0, reasons };
}

export function assertCurrentEvidence(options = {}) {
  const assessment = assessEvidenceFreshness(options);
  if (!assessment.current) {
    throw new Error("Evidence is not eligible for a current claim: " + assessment.reasons.join(", "));
  }
  return assessment;
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
  const attemptLinks = [];
  let firstFailure = null;
  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    let result;
    try {
      result = execute(attempt) ?? {};
    } catch (error) {
      result = {
        passed: false,
        error: error instanceof Error ? error.message : String(error),
      };
    }
    const previousAttempt = attempts.at(-1) ?? null;
    const attemptId = "attempt-" + attempt;
    const normalized = {
      ...result,
      attempt,
      attemptId,
      previousAttemptId: previousAttempt?.attemptId ?? null,
      passed: result.passed === true,
    };
    if (normalized.passed) {
      attempts.push(normalized);
      attemptLinks.push({
        attemptId,
        attempt,
        previousAttemptId: normalized.previousAttemptId,
        linkedToFirstFailure: firstFailure?.attemptId ?? null,
      });
      break;
    }

    const failure = classify(normalized);
    const classified = { ...normalized, ...failure };
    if (!firstFailure) firstFailure = { ...classified };
    attempts.push(classified);
    attemptLinks.push({
      attemptId,
      attempt,
      previousAttemptId: classified.previousAttemptId,
      linkedToFirstFailure: firstFailure.attemptId,
    });
    if (!classified.retryable || attempt >= maxAttempts) break;
    sleep(backoffMs * attempt);
  }

  const finalAttempt = attempts.at(-1) ?? { passed: false, attempt: 0 };
  return {
    passed: finalAttempt.passed === true,
    attempts,
    finalAttempt,
    firstFailure,
    attemptLinks,
    retryPolicy: {
      maxAttempts,
      backoffMs,
      attemptsUsed: attempts.length,
      exhausted: !finalAttempt.passed && attempts.length >= maxAttempts,
    },
  };
}
