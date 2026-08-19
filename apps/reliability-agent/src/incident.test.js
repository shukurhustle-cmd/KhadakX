import test from 'node:test';
import assert from 'node:assert/strict';
import { classifyIncident } from './incident.js';

test('classifies a failed GitHub Actions step as a CI incident', () => {
  const incident = classifyIncident({
    source: 'github-actions',
    workflow: 'Runtime E2E',
    job: 'AdForge Runtime E2E',
    step: 'Setup pnpm',
    conclusion: 'failure',
    log: 'Multiple versions of pnpm specified'
  });

  assert.equal(incident.category, 'ci');
  assert.equal(incident.severity, 'high');
  assert.equal(incident.requiresApproval, false);
});

test('classifies production authentication failures as high-risk', () => {
  const incident = classifyIncident({
    source: 'production',
    component: 'authentication',
    error: 'JWT validation failed'
  });

  assert.equal(incident.category, 'production');
  assert.equal(incident.severity, 'critical');
  assert.equal(incident.requiresApproval, true);
});
