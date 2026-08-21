import { HealthService } from './health.service';

describe('HealthService', () => {
  it('reports liveness without requiring the database', async () => {
    const service = new HealthService({} as any);

    await expect(service.liveness()).resolves.toEqual({
      status: 'ok',
      service: 'khadakx-api',
    });
  });

  it('reports readiness when the database dependency is reachable', async () => {
    const prisma = { $queryRaw: jest.fn().mockResolvedValue([{ ok: 1 }]) };
    const service = new HealthService(prisma as any);

    await expect(service.readiness()).resolves.toEqual({
      status: 'ready',
      service: 'khadakx-api',
      dependencies: { database: 'ok' },
    });
    expect(prisma.$queryRaw).toHaveBeenCalledTimes(1);
  });

  it('reports not-ready when the database dependency is unavailable', async () => {
    const prisma = { $queryRaw: jest.fn().mockRejectedValue(new Error('db unavailable')) };
    const service = new HealthService(prisma as any);

    await expect(service.readiness()).resolves.toEqual({
      status: 'not_ready',
      service: 'khadakx-api',
      dependencies: { database: 'error' },
    });
  });
});
