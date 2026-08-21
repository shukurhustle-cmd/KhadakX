import type { IncidentRecord } from '../knowledge/incident-record';
import type { WorkflowEvidenceSummary } from './workflow-evidence';

export interface EvidenceStore {
  appendWorkflowEvidence(evidence: WorkflowEvidenceSummary): Promise<void>;
  appendIncident(incident: IncidentRecord): Promise<void>;
}

export class InMemoryEvidenceStore implements EvidenceStore {
  readonly workflows: WorkflowEvidenceSummary[] = [];
  readonly incidents: IncidentRecord[] = [];

  async appendWorkflowEvidence(evidence: WorkflowEvidenceSummary): Promise<void> {
    this.workflows.push(evidence);
  }

  async appendIncident(incident: IncidentRecord): Promise<void> {
    this.incidents.push(incident);
  }
}
