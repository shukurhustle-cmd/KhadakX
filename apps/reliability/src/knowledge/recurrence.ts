export interface RecurrenceSignal {
  failureDna: string;
  occurrences: number;
  firstSeenAt: string;
  lastSeenAt: string;
  previousFixes: number;
  permanentFixes: number;
}

export type RecurrenceLevel = 'new' | 'recurring' | 'chronic';

export function classifyRecurrence(signal: RecurrenceSignal): RecurrenceLevel {
  if (signal.occurrences <= 1) return 'new';
  if (signal.permanentFixes === 0 && signal.occurrences >= 3) return 'chronic';
  return 'recurring';
}
