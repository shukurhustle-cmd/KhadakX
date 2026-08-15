import { Injectable, Logger } from '@nestjs/common';
import { createHmac } from 'node:crypto';
import { AdforgeBusinessContext, AdforgeEvent } from './adforge.integration.types';

@Injectable()
export class AdforgeIntegrationService {
  private readonly logger = new Logger(AdforgeIntegrationService.name);

  getStatus() {
    return {
      status: process.env.ADFORGE_WEBHOOK_URL && process.env.ADFORGE_WEBHOOK_SECRET ? 'ready' : 'degraded',
      source: 'khadakx',
      target: 'adforge',
      contractVersion: '1.3',
      outboundEventsEnabled: Boolean(process.env.ADFORGE_WEBHOOK_URL && process.env.ADFORGE_WEBHOOK_SECRET),
      contextSyncEnabled: true,
      delivery: process.env.ADFORGE_WEBHOOK_URL ? 'signed-webhook' : 'not-configured',
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

  async deliverEvent(event: AdforgeEvent) {
    if (!this.validateEvent(event)) {
      throw new Error('Invalid AdForge event envelope');
    }

    const url = process.env.ADFORGE_WEBHOOK_URL;
    const secret = process.env.ADFORGE_WEBHOOK_SECRET;
    if (!url || !secret) {
      return { delivered: false, configured: false, eventId: event.eventId };
    }

    const body = JSON.stringify(event);
    const signature = createHmac('sha256', secret).update(body).digest('hex');
    let lastError = 'unknown delivery error';

    for (let attempt = 1; attempt <= 3; attempt += 1) {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 10000);
      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'content-type': 'application/json',
            'x-khadakx-signature': `sha256=${signature}`,
            'x-khadakx-event-id': event.eventId,
            'x-khadakx-contract-version': '1.3',
          },
          body,
          signal: controller.signal,
        });

        if (response.ok) {
          return { delivered: true, configured: true, eventId: event.eventId, statusCode: response.status };
        }

        lastError = `AdForge returned HTTP ${response.status}`;
        if (response.status < 500 && response.status !== 429) break;
      } catch (error) {
        lastError = error instanceof Error ? error.message : 'delivery request failed';
      } finally {
        clearTimeout(timeout);
      }

      await new Promise((resolve) => setTimeout(resolve, 500 * 2 ** (attempt - 1)));
    }

    this.logger.error(`AdForge delivery failed for ${event.eventId}: ${lastError}`);
    return { delivered: false, configured: true, eventId: event.eventId, error: lastError };
  }
}
