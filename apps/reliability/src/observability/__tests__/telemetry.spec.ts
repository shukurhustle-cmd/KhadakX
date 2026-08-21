import { InMemoryTelemetrySink, createCorrelationId } from '../telemetry';

describe('telemetry', () => {
  it('retains correlation and trace data', async () => {
    const sink = new InMemoryTelemetrySink();
    const correlationId = createCorrelationId();
    await sink.emit({
      eventId: 'evt-1',
      occurredAt: '2026-08-21T00:00:00Z',
      service: 'reliability',
      environment: 'test',
      eventType: 'health.check',
      severity: 'info',
      correlationId,
      traceId: 'trace-1',
      agentId: 'ci-agent',
    });
    expect(sink.events).toHaveLength(1);
    expect(sink.events[0].correlationId).toBe(correlationId);
    expect(sink.events[0].traceId).toBe('trace-1');
    expect(sink.events[0].agentId).toBe('ci-agent');
  });

  it('generates non-empty unique correlation IDs', () => {
    const first = createCorrelationId();
    const second = createCorrelationId();
    expect(first).toBeTruthy();
    expect(second).toBeTruthy();
    expect(first).not.toBe(second);
  });
});
