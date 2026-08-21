import { CircuitBreaker } from '../circuit-breaker';

describe('CircuitBreaker', () => {
  it('opens after repeated failures and uses fallback', async () => {
    const breaker = new CircuitBreaker({ failureThreshold: 2, recoveryTimeoutMs: 1000 });
    const fallback = jest.fn().mockResolvedValue('fallback');

    await expect(breaker.execute(async () => { throw new Error('down'); }, fallback, 100)).rejects.toThrow('down');
    await expect(breaker.execute(async () => { throw new Error('down'); }, fallback, 200)).resolves.toBe('fallback');
    await expect(breaker.execute(async () => 'live', fallback, 300)).resolves.toBe('fallback');
    expect(fallback).toHaveBeenCalledTimes(2);
    expect(breaker.snapshot(300).state).toBe('open');
  });

  it('allows a recovery probe after the timeout', async () => {
    const breaker = new CircuitBreaker({ failureThreshold: 1, recoveryTimeoutMs: 1000 });
    const fallback = jest.fn().mockResolvedValue('fallback');

    await expect(breaker.execute(async () => { throw new Error('down'); }, fallback, 100)).resolves.toBe('fallback');
    expect(breaker.snapshot(500).state).toBe('open');
    expect(breaker.snapshot(1100).state).toBe('half-open');
    await expect(breaker.execute(async () => 'recovered', fallback, 1100)).resolves.toBe('recovered');
    expect(breaker.snapshot(1100).state).toBe('closed');
  });
});
