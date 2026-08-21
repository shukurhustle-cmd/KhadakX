import type { IncidentRecord } from '../knowledge/incident-record';
import type { WorkflowEvidenceSummary } from './workflow-evidence';

export function incidentsFromWorkflowEvidence(
  evidence: WorkflowEvidenceSummary,
  agentId: string,
): IncidentRecord[] {
  const incidents: IncidentRecord[] = [];

  for (const run of evidence.runs) {
    if (run.conclusion === 'success' || run.conclusion === 'skipped') continue;

    incidents.push({
      id: `workflow-${run.runId}`,
      agentId,
      workflow: run.workflowName,
      repository: evidence.repository,
      commitSha: evidence.commitSha,
      severity: run.conclusion === 'failure' ? 'P1' : 'P2',
      status: 'detected',
      title: `${run.workflowName} ${run.conclusion}`,
      failureDna: `${run.workflowName}:${run.conclusion}`,
      detectedAt: evidence.capturedAt,
      tatDeadline: evidence.capturedAt,
      occurrenceCount: 1,
      confidence: 'high',
      evidence: run.jobs.map((job) => ({
        kind: 'workflow-log' as const,
        ref: job.logRef ?? `${run.runId}/${job.jobId}`,
        summary: `${job.jobName}: ${job.conclusion}`,
      })),
    });
  }

  return incidents;
}
