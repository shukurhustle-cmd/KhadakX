import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { HealthService } from './health.service';

@Controller('health')
export class HealthController {
  constructor(private readonly health: HealthService) {}

  @Get()
  liveness() {
    return this.health.liveness();
  }

  @Get('ready')
  @HttpCode(HttpStatus.OK)
  async readiness() {
    const result = await this.health.readiness();
    if (result.status !== 'ready') {
      return result;
    }
    return result;
  }
}
