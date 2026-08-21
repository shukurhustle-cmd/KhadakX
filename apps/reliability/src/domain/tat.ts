export type IncidentSeverity = 'P0' | 'P1' | 'P2' | 'P3' | 'P4';

const TARGET_MINUTES: Record<IncidentSeverity, number> = {
  P0: 60,
  P1: 240,
  P2: 480,
  P3: 1440,
  P4: 1440,
};

/** Returns the target deadline. P4 is treated as one calendar business-day window. */
export function calculateTatDeadline(severity: IncidentSeverity, detectedAt: Date): Date {
  return new Date(detectedAt.getTime() + TARGET_MINUTES[severity] * 60_000);
}
