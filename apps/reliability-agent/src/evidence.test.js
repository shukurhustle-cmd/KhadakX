import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeEvidence } from './evidence.js';

test('normalizes a GitHub Actions failure into searchable evidence', () => {
  const evidence = normalizeEvidence({
    source: 'github-actions',
    repository: 'shukurhustle-cmd/KhadakX',
    workflow: 'Runtime E2E',
    runId: 2,
    job: 'AdForge Runtime E2E',
    step: 'Setup pnpm',
    conclusion: 'failure',
    commitSha: 'abc123',
    log: 'Multiple versions of pnpm specified'
  });

  assert.deepEqual(evidence, {
    source: 'github-actions',
    repository: 'shukurhustle-cmd/KhadakX',
    workflow: 'Runtime E2E',
    runId: 2,
    job: 'AdForge Runtime E2E',
    step: 'Setup pnpm',
    conclusion: 'failure',
    commitSha: 'abc123',
    signature: 'multiple versions of pnpm specified',
    redactedLog: 'Multiple versions of pnpm specified'
  });
});

test('redacts common secret-bearing values before evidence is persisted', () => {
  const evidence = normalizeEvidence({
    source: 'github-actions',
    workflow: 'Runtime E2E',
    log: 'Authorization: Bearer super-secret-token; api_key=abc123'
  });

  assert.equal(evidence.redactedLog.includes('super-secret-token'), false);
  assert.equal(evidence.redactedLog.includes('abc123'), false);
  assert.match(evidence.redactedLog, /Bearer \[REDACTED\]/);
  assert.match(evidence.redactedLog, /api_key=\[REDACTED\]/);
});
