import { IdempotencyStore } from '../idempotency-store';

describe('IdempotencyStore', () => {
  it('returns the same completed result for a duplicate key', async () => {
    const store = new IdempotencyStore<string>();
    let executions = 0;
    const operation = async () => {
      executions += 1;
      return 'created';
    };

    const first = await store.execute('order:abc', operation);
    const second = await store.execute('order:abc', operation);

    expect(first).toBe('created');
    expect(second).toBe('created');
    expect(executions).toBe(1);
  });

  it('does not cache failed operations', async () => {
    const store = new IdempotencyStore<string>();
    let executions = 0;

    await expect(store.execute('payment:abc', async () => {
      executions += 1;
      throw new Error('temporary failure');
    })).rejects.toThrow('temporary failure');

    await expect(store.execute('payment:abc', async () => {
      executions += 1;
      return 'paid';
    })).resolves.toBe('paid');

    expect(executions).toBe(2);
  });

  it('rejects concurrent duplicate execution while the first operation is running', async () => {
    const store = new IdempotencyStore<string>();
    let executions = 0;
    let release!: () => void;
    const gate = new Promise<void>((resolve) => { release = resolve; });

    const operation = async () => {
      executions += 1;
      await gate;
      return 'done';
    };

    const first = store.execute('webhook:event-1', operation);
    const second = store.execute('webhook:event-1', operation);

    await expect(second).rejects.toThrow('idempotency key is already in progress');
    release();
    await expect(first).resolves.toBe('done');
    expect(executions).toBe(1);
  });
});
