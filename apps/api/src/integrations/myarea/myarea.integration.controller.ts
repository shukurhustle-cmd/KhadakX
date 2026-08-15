import { Body, Controller, Get, Post } from '@nestjs/common';
import { AdforgeIntegrationService } from '../adforge/adforge.integration.service';
import { MyareaIntegrationService } from './myarea.integration.service';
import {
  MyareaEventEnvelope,
  MyareaListingSnapshot,
  MyareaOrderSnapshot,
  MyareaVendorSnapshot,
} from './myarea.integration.types';

@Controller('integrations/myarea')
export class MyareaIntegrationController {
  constructor(
    private readonly service: MyareaIntegrationService,
    private readonly adforge: AdforgeIntegrationService,
  ) {}

  @Get('health')
  health() {
    return this.service.getStatus();
  }

  @Post('vendor/context')
  vendorContext(@Body() vendor: MyareaVendorSnapshot) {
    const context = this.service.vendorToBusinessContext(vendor);
    return { valid: Boolean(context.businessId && context.displayName), context };
  }

  @Post('listing/event')
  async listingEvent(@Body() listing: MyareaListingSnapshot) {
    const event = this.service.listingToEvent(listing);
    const validation = this.service.validateMappedEvent(event);
    if (!validation.valid) return validation;
    return { ...validation, delivery: await this.adforge.deliverEvent(event) };
  }

  @Post('order/event')
  async orderEvent(@Body() order: MyareaOrderSnapshot) {
    const event = this.service.orderToEvent(order);
    const validation = this.service.validateMappedEvent(event);
    if (!validation.valid) return validation;
    return { ...validation, delivery: await this.adforge.deliverEvent(event) };
  }

  @Post('events/normalize')
  async normalizeEvent(@Body() event: MyareaEventEnvelope) {
    const normalized = this.service.normalizeEvent(event);
    const validation = this.service.validateMappedEvent(normalized);
    if (!validation.valid) return validation;
    return { ...validation, delivery: await this.adforge.deliverEvent(normalized) };
  }
}
