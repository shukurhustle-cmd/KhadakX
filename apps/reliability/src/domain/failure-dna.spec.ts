import { buildFailureFingerprint } from './failure-dna';

describe('buildFailureFingerprint', () => {
  it('is deterministic and ignores human-readable error wording', () => {
    const first = buildFailureFingerprint({
      workflow: 'runtime-e2e',
      service: 'adforge',
      operation: 'webhook',
      errorClass: 'timeout',
      environment: 'staging',
    });
    const second = buildFailureFingerprint({
      workflow: 'runtime-e2e',
      service: 'adforge',
      operation: 'webhook',
      errorClass: 'timeout',
      environment: 'staging',
    });

    expect(first).toBe(second);
    expect(first).toMatch(/^runtime-e2e:adforge:webhook:timeout:staging$/);
  });
});
