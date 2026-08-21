export class IdempotencyStore<T> {
  private readonly completed = new Map<string, T>();
  private readonly inProgress = new Set<string>();

  async execute(key: string, operation: () => Promise<T>): Promise<T> {
    if (!key.trim()) throw new Error('idempotency key is required');

    if (this.completed.has(key)) return this.completed.get(key) as T;

    if (this.inProgress.has(key)) {
      throw new Error('idempotency key is already in progress');
    }

    this.inProgress.add(key);
    try {
      const result = await operation();
      this.completed.set(key, result);
      return result;
    } finally {
      this.inProgress.delete(key);
    }
  }

  hasCompleted(key: string): boolean {
    return this.completed.has(key);
  }

  clear(key?: string): void {
    if (key === undefined) {
      this.completed.clear();
      this.inProgress.clear();
      return;
    }
    this.completed.delete(key);
    this.inProgress.delete(key);
  }
}
