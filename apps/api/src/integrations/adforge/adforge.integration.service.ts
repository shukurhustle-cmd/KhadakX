import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { createHmac, randomUUID } from 'node:crypto';
import { PrismaService } from '../../prisma/prisma.service';
import { AdforgeBusinessContext, AdforgeEvent, KhadakxVertical } from './adforge.integration.types';

@Injectable()
export class AdforgeIntegrationService {
  private readonly logger = new Logger(AdforgeIntegrationService.name);

  constructor(private readonly prisma: PrismaService) {}

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

  async launchFromBusiness(businessId: string, objective = 'Launch and grow the business') {
    const business = await this.prisma.business.findUnique({
      where: { id: businessId },
      include: {
        entitlements: true,
        blueprints: { orderBy: { version: 'desc' }, take: 1 },
      },
    });

    if (!business) throw new NotFoundException('Business not found');

    const blueprint = business.blueprints[0];
    const vertical = this.normalizeVertical(business.industry);
    const context = this.buildBusinessContext({
      businessId: business.id,
      vertical,
      displayName: business.name,
      capabilities: business.entitlements.filter((item) => item.status === 'ACTIVE').map((item) => item.module),
      marketing: {
        description: business.description || undefined,
        websiteUrl: business.website || undefined,
        phone: business.phone || undefined,
        city: business.city || undefined,
        country: business.country,
      },
    });

    const event: AdforgeEvent = {
      eventId: randomUUID(),
      eventType: 'campaign.requested',
      businessId: business.id,
      occurredAt: new Date().toISOString(),
      payload: {
        objective,
        context,
        blueprint: blueprint?.payload || {},
        blueprintVersion: blueprint?.version || 0,
      },
    };

    const delivery = await this.deliverEvent(event);
    return { accepted: delivery.delivered, configured: delivery.configured, event, delivery };
  }

  async deliverEvent(event: AdforgeEvent) {
    if (!this.validateEvent(event)) throw new Error('Invalid AdForge event envelope');

    const url = process.env.ADFORGE_WEBHOOK_URL;
    const secret = process.env.ADFORGE_WEBHOOK_SECRET;
    if (!url || !secret) return { delivered: false, configured: false, eventId: event.eventId };

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

        if (response.ok) return { delivered: true, configured: true, eventId: event.eventId, statusCode: response.status };
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

  private normalizeVertical(industry?: string | null): KhadakxVertical {
    const value = String(industry || '').toLowerCase();
    if (value.includes('restaurant') || value.includes('food')) return 'restaurant';
    if (value.includes('real') && value.includes('estate')) return 'real_estate';
    if (value.includes('hospital') || value.includes('clinic') || value.includes('health')) return 'healthcare';
    if (value.includes('service') || value.includes('agency')) return 'services';
    return 'other';
  }
}
