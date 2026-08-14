import { Body, Controller, Get, Post } from '@nestjs/common';
import { MyareaIntegrationService } from './myarea.integration.service';
import {
  MyareaEventEnvelope,
  MyareaListingSnapshot,
  MyareaOrderSnapshot,
  MyareaVendorSnapshot,
} from './myarea.integration.types';

@Controller('integrations/myarea')
export class MyareaIntegrationController {
  constructor(private readonly service: MyareaIntegrationService) {}

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
  listingEvent(@Body() listing: MyareaListingSnapshot) {
    const event = this.service.listingToEvent(listing);
    return this.service.validateMappedEvent(event);
  }

  @Post('order/event')
  orderEvent(@Body() order: MyareaOrderSnapshot) {
    const event = this.service.orderToEvent(order);
    return this.service.validateMappedEvent(event);
  }

  @Post('events/normalize')
  normalizeEvent(@Body() event: MyareaEventEnvelope) {
    const normalized = this.service.normalizeEvent(event);
    return this.service.validateMappedEvent(normalized);
  }
}
