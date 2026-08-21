export type CircuitState = 'closed' | 'open' | 'half-open';

export interface CircuitBreakerOptions {
  failureThreshold: number;
  recoveryTimeoutMs: number;
}

export interface CircuitSnapshot {
  state: CircuitState;
  failures: number;
  openedAt?: number;
}

export class CircuitBreaker {
  private state: CircuitState = 'closed';
  private failures = 0;
  private openedAt?: number;

  constructor(private readonly options: CircuitBreakerOptions) {
    if (options.failureThreshold < 1) throw new Error('failureThreshold must be >= 1');
    if (options.recoveryTimeoutMs < 0) throw new Error('recoveryTimeoutMs must be >= 0');
  }

  snapshot(now = Date.now()): CircuitSnapshot {
    if (this.state === 'open' && this.openedAt !== undefined && now - this.openedAt >= this.options.recoveryTimeoutMs) {
      this.state = 'half-open';
    }
    return { state: this.state, failures: this.failures, openedAt: this.openedAt };
  }

  canExecute(now = Date.now()): boolean {
    return this.snapshot(now).state !== 'open';
  }

  recordSuccess(): void {
    this.state = 'closed';
    this.failures = 0;
    this.openedAt = undefined;
  }

  recordFailure(now = Date.now()): void {
    this.failures += 1;
    if (this.failures >= this.options.failureThreshold) {
      this.state = 'open';
      this.openedAt = now;
    }
  }

  async execute<T>(operation: () => Promise<T>, fallback: () => Promise<T>, now = Date.now()): Promise<T> {
    if (!this.canExecute(now)) return fallback();
    try {
      const result = await operation();
      this.recordSuccess();
      return result;
    } catch (error) {
      this.recordFailure(now);
      if (!this.canExecute(now)) return fallback();
      throw error;
    }
  }
}
