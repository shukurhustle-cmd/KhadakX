import { calculateTatDeadline, type IncidentSeverity } from './tat';

describe('calculateTatDeadline', () => {
  const detectedAt = new Date('2026-08-19T10:00:00.000Z');

  const cases: Array<[IncidentSeverity, number]> = [
    ['P0', 60],
    ['P1', 240],
    ['P2', 480],
    ['P3', 1440],
  ];

  it.each(cases)('%s uses the approved resolution target', (severity, minutes) => {
    expect(calculateTatDeadline(severity, detectedAt).toISOString()).toBe(
      new Date(detectedAt.getTime() + minutes * 60_000).toISOString(),
    );
  });

  it('gives P4 a business-day target', () => {
    expect(calculateTatDeadline('P4', detectedAt).toISOString()).toBe(
      '2026-08-20T10:00:00.000Z',
    );
  });
});
