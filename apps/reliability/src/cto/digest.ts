import type { IncidentRecord } from '../knowledge/incident-record';

export interface AgentHealthSummary {
  agentId: string;
  reliabilityPercent: number;
  activeIncidents: number;
  recurringIncidents: number;
  averageResolutionMinutes?: number;
}

export interface CtoDigest {
  generatedAt: string;
  systemReliabilityPercent: number;
  activeIncidents: IncidentRecord[];
  agentHealth: AgentHealthSummary[];
  tatBreaches: string[];
  ctoAttentionRequired: boolean;
  recommendation: string;
}

export function needsCtoAttention(digest: CtoDigest): boolean {
  return digest.ctoAttentionRequired || digest.tatBreaches.length > 0 || digest.activeIncidents.some((i) => i.severity === 'P0');
}
