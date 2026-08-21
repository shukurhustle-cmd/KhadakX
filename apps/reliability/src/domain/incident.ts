import type { IncidentSeverity } from './tat';

export type IncidentStatus =
  | 'OPEN'
  | 'INVESTIGATING'
  | 'MITIGATED'
  | 'RESOLVED'
  | 'ESCALATED';

export interface ReliabilityIncident {
  id: string;
  severity: IncidentSeverity;
  status: IncidentStatus;
  fingerprint: string;
  title: string;
  detectedAt: Date;
  tatDeadline: Date;
  agentId: string;
  agentVersion: string;
  workflow?: string;
  correlationId: string;
  diagnosisConfidence?: number;
}
