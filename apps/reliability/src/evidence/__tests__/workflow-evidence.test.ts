import { conclusionFromGitHub } from '../workflow-evidence';
import { incidentsFromWorkflowEvidence } from '../incident-builder';

describe('workflow evidence', () => {
  it('normalizes known GitHub conclusions', () => {
    expect(conclusionFromGitHub('success')).toBe('success');
    expect(conclusionFromGitHub('failure')).toBe('failure');
    expect(conclusionFromGitHub('timed_out')).toBe('unknown');
  });

  it('turns failed workflow runs into structured incidents', () => {
    const incidents = incidentsFromWorkflowEvidence({
      capturedAt: '2026-08-18T00:00:00Z',
      repository: 'owner/repo',
      commitSha: 'abc',
      runs: [{
        runId: 123,
        workflowName: 'Build',
        conclusion: 'failure',
        jobs: [{
          workflowRunId: 123,
          workflowName: 'Build',
          jobId: 456,
          jobName: 'build (web)',
          status: 'completed',
          conclusion: 'failure',
          logRef: 'run/123/job/456',
        }],
      }],
    }, 'ci-agent');

    expect(incidents).toHaveLength(1);
    expect(incidents[0].severity).toBe('P1');
    expect(incidents[0].evidence[0].ref).toBe('run/123/job/456');
  });
});
