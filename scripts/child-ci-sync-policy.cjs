'use strict';

const SPECS = Object.freeze({
  flutter: Object.freeze({ repository: 'flutter', path: 'flutter', workflow: '.github/workflows/flutter-ci.yml' }),
  playground: Object.freeze({ repository: 'playground', path: 'playground', workflow: '.github/workflows/playground-ci.yml' }),
  mcp: Object.freeze({ repository: 'mcp', path: 'mcp', workflow: '.github/workflows/mcp-ci.yml' }),
});

function validateDispatchMetadata(input) {
  const legacyFlutter = input.eventType === 'flutter_ci_succeeded';
  const submodule = String(input.payloadSubmodule || input.inputSubmodule || (legacyFlutter ? 'flutter' : '')).trim().toLowerCase();
  const spec = SPECS[submodule];
  if (!spec) return { ok: false, errors: [`Unsupported submodule: ${submodule || '<empty>'}`] };

  const sha = String(input.payloadSha || input.inputSha || '').trim().toLowerCase();
  const runId = String(input.payloadRunId || input.inputRunId || '').trim();
  const payloadRepository = String(input.payloadRepository || '').trim();
  const payloadPath = String(input.payloadPath || '').trim();
  const payloadWorkflow = String(input.payloadWorkflow || '').trim();
  const payloadBranch = String(input.payloadBranch || '').trim();
  const errors = [];

  if (!/^[0-9a-f]{40}$/.test(sha)) errors.push(`Invalid ${submodule} SHA: ${sha || '<empty>'}`);
  if (!/^\d+$/.test(runId)) errors.push(`Invalid ${submodule} run ID: ${runId || '<empty>'}`);
  if (payloadRepository && payloadRepository !== `relgeo/${spec.repository}`) {
    errors.push(`Payload repository ${payloadRepository} does not match relgeo/${spec.repository}`);
  }
  if (payloadPath && payloadPath !== spec.path) errors.push(`Payload path ${payloadPath} does not match ${spec.path}`);
  const legacyWorkflowName = legacyFlutter && payloadWorkflow === 'Flutter CI';
  if (payloadWorkflow && payloadWorkflow !== spec.workflow && !legacyWorkflowName) {
    errors.push(`Payload workflow ${payloadWorkflow} does not match ${spec.workflow}`);
  }
  if (payloadBranch && payloadBranch !== 'main' && payloadBranch !== 'refs/heads/main') {
    errors.push(`Payload branch ${payloadBranch} is not refs/heads/main`);
  }

  return errors.length > 0
    ? { ok: false, errors }
    : {
        ok: true,
        submodule,
        repository: spec.repository,
        path: spec.path,
        workflow: spec.workflow,
        sha,
        runId,
        syncBranch: `automation/submodule-ci-${submodule}-${sha}`,
      };
}

function validateWorkflowRun({ run, expectedSha, expectedWorkflow, sourceRepository }) {
  const failures = [];
  if (run?.head_sha !== expectedSha) failures.push(`head SHA ${run?.head_sha || '<empty>'} does not match ${expectedSha}`);
  if (run?.status !== 'completed') failures.push(`status is ${run?.status || '<empty>'}`);
  if (run?.conclusion !== 'success') failures.push(`conclusion is ${run?.conclusion || run?.status || '<empty>'}`);
  if (run?.event !== 'push' || run?.head_branch !== 'main') failures.push(`run source is ${run?.event || '<empty>'}/${run?.head_branch || '<empty>'}, expected push/main`);
  if (run?.path !== expectedWorkflow) failures.push(`workflow path is ${run?.path || '<empty>'}, expected ${expectedWorkflow}`);
  if (run?.head_repository?.full_name !== `relgeo/${sourceRepository}`) {
    failures.push(`run repository is ${run?.head_repository?.full_name || '<empty>'}`);
  }
  return failures.length > 0 ? { ok: false, failures } : { ok: true };
}

function validateSynchronizationCandidate({ currentSha, requestedSha, fetchedSha, checkoutSha, gitlinkSha, childDirty = false, rootDirty = false }) {
  const failures = [];
  if (currentSha === requestedSha) return { ok: true, changed: false, failures };
  if (fetchedSha !== requestedSha) failures.push(`FETCH_HEAD ${fetchedSha || '<empty>'} does not match requested SHA ${requestedSha}`);
  if (checkoutSha !== requestedSha) failures.push(`checkout ${checkoutSha || '<empty>'} does not match requested SHA ${requestedSha}`);
  if (gitlinkSha && gitlinkSha !== requestedSha) failures.push(`gitlink ${gitlinkSha} does not match requested SHA ${requestedSha}`);
  if (childDirty) failures.push('child checkout is dirty');
  if (rootDirty) failures.push('root checkout is dirty');
  return failures.length > 0 ? { ok: false, changed: false, failures } : { ok: true, changed: true, failures };
}

function validateProvenance({ sourceSha, baselineChildRevision, gitlinkRevision, runConclusion, rootRevision, baselineRootRevision }) {
  const failures = [];
  if (runConclusion !== 'success') failures.push(`provenance conclusion is ${runConclusion || '<empty>'}`);
  if (baselineChildRevision !== sourceSha) failures.push(`baseline child revision ${baselineChildRevision || '<empty>'} does not match ${sourceSha}`);
  if (gitlinkRevision !== sourceSha) failures.push(`gitlink revision ${gitlinkRevision || '<empty>'} does not match ${sourceSha}`);
  if (!rootRevision || baselineRootRevision !== rootRevision) failures.push('baseline root revision does not match the checked-out root revision');
  return failures.length > 0 ? { ok: false, failures } : { ok: true };
}

module.exports = {
  SPECS,
  validateDispatchMetadata,
  validateWorkflowRun,
  validateSynchronizationCandidate,
  validateProvenance,
};
