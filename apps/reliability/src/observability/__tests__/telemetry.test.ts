import { InMemoryTelemetrySink, createCorrelationId } from '../telemetry';

describe('telemetry', () => {
  it('stores structured events without losing correlation data', async () => {
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
      attributes: { latencyMs: 12 },
    });

    expect(sink.events).toHaveLength(1);
    expect(sink.events[0].correlationId).toBe(correlationId);
    expect(sink.events[0].traceId).toBe('trace-1');
    expect(sink.events[0].agentId).toBe('ci-agent');
  });

  it('generates non-empty correlation IDs', () => {
    const first = createCorrelationId();
    const second = createCorrelationId();
    expect(first).toBeTruthy();
    expect(second).toBeTruthy();
    expect(first).not.toBe(second);
  });
});
