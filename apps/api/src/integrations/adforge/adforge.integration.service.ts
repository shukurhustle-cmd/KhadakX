import { Injectable } from '@nestjs/common';
import { AdforgeBusinessContext, AdforgeEvent } from './adforge.integration.types';

@Injectable()
export class AdforgeIntegrationService {
  getStatus() {
    return {
      status: 'ready',
      source: 'khadakx',
      target: 'adforge',
      contractVersion: '1.0',
      outboundEventsEnabled: false,
    };
  }

  buildBusinessContext(input: Omit<AdforgeBusinessContext, 'source'>): AdforgeBusinessContext {
    return {
      ...input,
      source: 'khadakx',
    };
  }

  validateEvent(event: AdforgeEvent) {
    return Boolean(
      event?.eventId &&
      event?.eventType &&
      event?.businessId &&
      event?.occurredAt,
    );
  }
}
