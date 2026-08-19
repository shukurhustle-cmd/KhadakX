import type { IncidentSeverity } from './tat';

export interface ReliabilityEvent {
  eventId: string;
  occurredAt: Date;
  agentId: string;
  agentVersion: string;
  eventType: string;
  severity: IncidentSeverity;
  correlationId: string;
  workflow?: string;
  operation?: string;
  status?: string;
  evidenceReference?: string;
}
