import { evaluateHealth } from '../health';

describe('health evaluation', () => {
  it('is ready when all required dependencies are healthy', () => {
    const result = evaluateHealth([
      { name: 'database', required: true, healthy: true, latencyMs: 12 },
      { name: 'adforge', required: false, healthy: true },
    ], '2026-08-21T00:00:00Z');

    expect(result.state).toBe('green');
    expect(result.live).toBe(true);
    expect(result.ready).toBe(true);
  });

  it('is not ready when a required dependency fails', () => {
    const result = evaluateHealth([
      { name: 'database', required: true, healthy: false, detail: 'timeout' },
      { name: 'adforge', required: false, healthy: true },
    ]);

    expect(result.state).toBe('red');
    expect(result.live).toBe(true);
    expect(result.ready).toBe(false);
  });

  it('remains ready but warns when an optional dependency fails', () => {
    const result = evaluateHealth([
      { name: 'database', required: true, healthy: true },
      { name: 'adforge', required: false, healthy: false },
    ]);

    expect(result.state).toBe('yellow');
    expect(result.ready).toBe(true);
  });
});
