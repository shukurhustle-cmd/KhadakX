import { ServiceUnavailableException } from '@nestjs/common';
import { HealthService } from './health.service';

const queryRaw = jest.fn();
const disconnect = jest.fn();

jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn().mockImplementation(() => ({ queryRaw, $queryRaw: queryRaw, $disconnect: disconnect })),
}));

describe('HealthService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('reports liveness without touching the database', () => {
    const service = new HealthService();

    expect(service.liveness()).toEqual({ status: 'ok', service: 'khadakx-api' });
    expect(queryRaw).not.toHaveBeenCalled();
  });

  it('reports readiness when the database responds', async () => {
    queryRaw.mockResolvedValueOnce([{ '?column?': 1 }]);
    const service = new HealthService();

    await expect(service.readiness()).resolves.toEqual({
      status: 'ready',
      service: 'khadakx-api',
      database: 'ok',
    });
  });

  it('fails readiness with 503 semantics when the database is unavailable', async () => {
    queryRaw.mockRejectedValueOnce(new Error('database unavailable'));
    const service = new HealthService();

    await expect(service.readiness()).rejects.toBeInstanceOf(ServiceUnavailableException);
  });
});
