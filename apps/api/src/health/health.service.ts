import { Injectable, OnModuleDestroy, ServiceUnavailableException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class HealthService implements OnModuleDestroy {
  private readonly prisma = new PrismaClient();

  async onModuleDestroy() {
    await this.prisma.$disconnect();
  }

  liveness() {
    return { status: 'ok', service: 'khadakx-api' };
  }

  async readiness() {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      return { status: 'ready', service: 'khadakx-api', database: 'ok' };
    } catch {
      throw new ServiceUnavailableException({
        status: 'not_ready',
        service: 'khadakx-api',
        database: 'unavailable',
      });
    }
  }
}
