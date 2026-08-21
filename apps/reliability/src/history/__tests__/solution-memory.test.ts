import { findHistoricalSolution } from '../solution-memory';
import { InMemoryReliabilityHistory } from '../reliability-history';

const incident = {
  id: 'INC-1',
  agentId: 'ci-agent',
  severity: 'P1' as const,
  status: 'detected' as const,
  title: 'Build failed',
  failureDna: 'build:dependency-missing',
  detectedAt: '2026-08-18T00:00:00Z',
  tatDeadline: '2026-08-18T01:00:00Z',
  occurrenceCount: 1,
  confidence: 'high' as const,
  evidence: [],
};

describe('solution memory', () => {
  it('finds previous solutions by Failure DNA', async () => {
    const history = new InMemoryReliabilityHistory();
    await history.record({
      incident,
      recordedAt: '2026-08-18T00:10:00Z',
      solution: {
        summary: 'Declare missing dependency',
        permanentFix: true,
        rootCause: 'Package dependency was undeclared',
        verifiedAt: '2026-08-18T00:20:00Z',
      },
    });

    const match = await findHistoricalSolution(history, incident);
    expect(match.occurrenceCount).toBe(1);
    expect(match.previousSolutions).toHaveLength(1);
    expect(match.permanentFixes).toBe(1);
  });
});
