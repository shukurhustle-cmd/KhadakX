export type IncidentStatus =
  | 'detected'
  | 'investigating'
  | 'mitigated'
  | 'resolved'
  | 'verified'
  | 'escalated';

export type IncidentConfidence = 'low' | 'medium' | 'high' | 'verified';

export interface IncidentEvidenceRef {
  kind: 'workflow-log' | 'commit' | 'pull-request' | 'artifact' | 'runtime';
  ref: string;
  summary?: string;
}

export interface IncidentSolution {
  summary: string;
  rootCause?: string;
  fixCommit?: string;
  permanentFix: boolean;
  verifiedAt?: string;
  verificationRefs?: string[];
}

export interface IncidentRecord {
  id: string;
  agentId: string;
  workflow?: string;
  repository?: string;
  branch?: string;
  commitSha?: string;
  severity: 'P0' | 'P1' | 'P2' | 'P3' | 'P4';
  status: IncidentStatus;
  title: string;
  failureDna: string;
  detectedAt: string;
  tatDeadline: string;
  occurrenceCount: number;
  confidence: IncidentConfidence;
  evidence: IncidentEvidenceRef[];
  solution?: IncidentSolution;
  parentIncidentId?: string;
  tags?: string[];
}
