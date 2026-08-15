import { Injectable } from '@nestjs/common';
import { AdforgeBusinessContext, AdforgeEvent } from './adforge.integration.types';

@Injectable()
export class AdforgeIntegrationService {
  getStatus() {
    return {
      status: 'ready',
      source: 'khadakx',
      target: 'adforge',
      contractVersion: '1.2',
      outboundEventsEnabled: Boolean(process.env.ADFORGE_WEBHOOK_URL),
      contextSyncEnabled: true,
    };
  }

  buildBusinessContext(input: Omit<AdforgeBusinessContext, 'source'>): AdforgeBusinessContext {
    return { ...input, source: 'khadakx' };
  }

  validateEvent(event: AdforgeEvent) {
    return Boolean(event?.eventId && event?.eventType && event?.businessId && event?.occurredAt);
  }

  buildMarketingBrief(context: AdforgeBusinessContext, objective: string) {
    return {
      source: 'khadakx',
      businessId: context.businessId,
      vertical: context.vertical,
      businessName: context.displayName,
      objective,
      capabilities: context.capabilities,
      marketing: context.marketing,
    };
  }
}
