import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface HealthResponse {
  status: 'ok' | 'ready' | 'not_ready';
  service: 'khadakx-api';
  dependencies?: {
    database: 'ok' | 'error';
  };
}

@Injectable()
export class HealthService {
  constructor(private readonly prisma: PrismaService) {}

  async liveness(): Promise<HealthResponse> {
    return {
      status: 'ok',
      service: 'khadakx-api',
    };
  }

  async readiness(): Promise<HealthResponse> {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      return {
        status: 'ready',
        service: 'khadakx-api',
        dependencies: { database: 'ok' },
      };
    } catch {
      return {
        status: 'not_ready',
        service: 'khadakx-api',
        dependencies: { database: 'error' },
      };
    }
  }
}
