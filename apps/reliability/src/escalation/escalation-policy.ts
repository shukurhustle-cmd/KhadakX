export type EscalationTarget = 'main-agent' | 'cto' | 'human-engineer';

export interface EscalationInput {
  severity: 'P0' | 'P1' | 'P2' | 'P3' | 'P4';
  tatMinutesRemaining: number;
  specialistAttempts: number;
  agentDisagreement: boolean;
  securityOrDataRisk: boolean;
}

export function escalationTarget(input: EscalationInput): EscalationTarget {
  if (input.securityOrDataRisk || input.severity === 'P0') return 'human-engineer';
  if (input.agentDisagreement || input.tatMinutesRemaining <= 20) return 'cto';
  if (input.specialistAttempts >= 2 || input.severity === 'P1') return 'main-agent';
  return 'main-agent';
}
