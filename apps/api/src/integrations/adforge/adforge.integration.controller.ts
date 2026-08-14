import { Body, Controller, Get, Post } from '@nestjs/common';
import { AdforgeIntegrationService } from './adforge.integration.service';
import { AdforgeBusinessContext, AdforgeEvent } from './adforge.integration.types';

@Controller('integrations/adforge')
export class AdforgeIntegrationController {
  constructor(private readonly service: AdforgeIntegrationService) {}

  @Get('health')
  health() {
    return this.service.getStatus();
  }

  @Post('context/validate')
  validateContext(@Body() context: Omit<AdforgeBusinessContext, 'source'>) {
    const normalized = this.service.buildBusinessContext(context);
    return { valid: Boolean(normalized.businessId && normalized.displayName), context: normalized };
  }

  @Post('events/validate')
  validateEvent(@Body() event: AdforgeEvent) {
    return { valid: this.service.validateEvent(event), event };
  }
}
