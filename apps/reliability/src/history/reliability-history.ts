import type { IncidentRecord, IncidentSolution } from '../knowledge/incident-record';

export interface ReliabilityHistoryEntry {
  incident: IncidentRecord;
  solution?: IncidentSolution;
  recordedAt: string;
}

export interface ReliabilityHistoryRepository {
  record(entry: ReliabilityHistoryEntry): Promise<void>;
  findByFailureDna(failureDna: string): Promise<ReliabilityHistoryEntry[]>;
  countByFailureDna(failureDna: string): Promise<number>;
}

export class InMemoryReliabilityHistory implements ReliabilityHistoryRepository {
  private readonly entries: ReliabilityHistoryEntry[] = [];

  async record(entry: ReliabilityHistoryEntry): Promise<void> {
    this.entries.push(entry);
  }

  async findByFailureDna(failureDna: string): Promise<ReliabilityHistoryEntry[]> {
    return this.entries.filter((entry) => entry.incident.failureDna === failureDna);
  }

  async countByFailureDna(failureDna: string): Promise<number> {
    return (await this.findByFailureDna(failureDna)).length;
  }
}
