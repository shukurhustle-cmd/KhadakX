import { InMemoryEvidenceStore } from '../evidence-store';

describe('InMemoryEvidenceStore', () => {
  it('retains workflow and incident evidence in insertion order', async () => {
    const store = new InMemoryEvidenceStore();
    const workflow = {
      capturedAt: '2026-08-18T00:00:00Z',
      repository: 'owner/repo',
      commitSha: 'abc',
      runs: [],
    };
    const incident = {
      id: 'INC-1',
      agentId: 'ci-agent',
      severity: 'P2' as const,
      status: 'detected' as const,
      title: 'test',
      failureDna: 'test',
      detectedAt: '2026-08-18T00:00:00Z',
      tatDeadline: '2026-08-18T01:00:00Z',
      occurrenceCount: 1,
      confidence: 'high' as const,
      evidence: [],
    };

    await store.appendWorkflowEvidence(workflow);
    await store.appendIncident(incident);

    expect(store.workflows).toEqual([workflow]);
    expect(store.incidents).toEqual([incident]);
  });
});
