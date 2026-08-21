export type WorkflowConclusion = 'success' | 'failure' | 'cancelled' | 'skipped' | 'neutral' | 'unknown';

export interface WorkflowJobEvidence {
  workflowRunId: number;
  workflowName: string;
  jobId: number;
  jobName: string;
  status: string;
  conclusion: WorkflowConclusion;
  completedAt?: string;
  logRef?: string;
}

export interface WorkflowEvidenceSummary {
  capturedAt: string;
  repository: string;
  commitSha: string;
  runs: Array<{
    runId: number;
    workflowName: string;
    conclusion: WorkflowConclusion;
    jobs: WorkflowJobEvidence[];
  }>;
}

export function conclusionFromGitHub(value: string | null | undefined): WorkflowConclusion {
  switch (value) {
    case 'success':
    case 'failure':
    case 'cancelled':
    case 'skipped':
    case 'neutral':
      return value;
    default:
      return 'unknown';
  }
}
