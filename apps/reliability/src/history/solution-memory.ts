import type { IncidentRecord, IncidentSolution } from '../knowledge/incident-record';
import type { ReliabilityHistoryRepository } from './reliability-history';

export interface HistoricalMatch {
  occurrenceCount: number;
  previousSolutions: IncidentSolution[];
  permanentFixes: number;
}

export async function findHistoricalSolution(
  repository: ReliabilityHistoryRepository,
  incident: IncidentRecord,
): Promise<HistoricalMatch> {
  const entries = await repository.findByFailureDna(incident.failureDna);
  const solutions = entries.flatMap((entry) => entry.solution ? [entry.solution] : []);
  return {
    occurrenceCount: entries.length,
    previousSolutions: solutions,
    permanentFixes: solutions.filter((solution) => solution.permanentFix).length,
  };
}
