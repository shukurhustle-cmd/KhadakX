import { Controller, Get, HttpStatus, Res } from '@nestjs/common';
import { Response } from 'express';
import { HealthService } from './health.service';

@Controller()
export class HealthController {
  constructor(private readonly health: HealthService) {}

  @Get('health')
  async healthCheck() {
    return this.health.liveness();
  }

  @Get('ready')
  async readinessCheck(@Res({ passthrough: true }) response: Response) {
    const result = await this.health.readiness();
    if (result.status === 'not_ready') {
      response.status(HttpStatus.SERVICE_UNAVAILABLE);
    }
    return result;
  }
}
