import { Injectable } from '@nestjs/common';
import { AdforgeIntegrationService } from '../adforge/adforge.integration.service';
import { AdforgeBusinessContext, AdforgeEvent } from '../adforge/adforge.integration.types';
import { MyareaEventEnvelope, MyareaListingSnapshot, MyareaOrderSnapshot, MyareaVendorSnapshot } from './myarea.integration.types';

@Injectable()
export class MyareaIntegrationService {
  constructor(private readonly adforge: AdforgeIntegrationService) {}

  getStatus() {
    const adforge = this.adforge.getStatus();
    return {
      status: adforge.outboundEventsEnabled ? 'ready' : 'degraded',
      source: 'myarea',
      bridge: 'khadakx',
      target: 'adforge',
      contractVersion: '1.2',
      inboundNormalizationEnabled: true,
      outboundDeliveryEnabled: adforge.outboundEventsEnabled,
      adforgeDelivery: adforge.delivery,
    };
  }

  vendorToBusinessContext(vendor: MyareaVendorSnapshot): AdforgeBusinessContext {
    return this.adforge.buildBusinessContext({
      businessId: vendor.vendorId, vertical: vendor.vertical ?? 'other', displayName: vendor.businessName,
      capabilities: ['myarea_marketplace', 'customer_discovery', 'products', 'services', 'ordering', 'offers', 'reviews', 'qr_menu', 'rides', ...(vendor.websiteUrl ? ['website'] : []), ...(vendor.socialChannels ? ['social_channels'] : [])],
      marketing: { description: vendor.description, websiteUrl: vendor.websiteUrl, phone: vendor.phone, city: vendor.address?.city, country: 'IN' },
    });
  }

  listingToEvent(listing: MyareaListingSnapshot): AdforgeEvent {
    return { eventId: `myarea-listing-${listing.listingId}`, eventType: 'product.updated', businessId: listing.vendorId, occurredAt: new Date().toISOString(), payload: { source: 'myarea', ...listing } };
  }

  orderToEvent(order: MyareaOrderSnapshot): AdforgeEvent {
    return { eventId: `myarea-order-${order.orderId}`, eventType: 'order.created', businessId: order.vendorId, occurredAt: order.occurredAt ?? new Date().toISOString(), payload: { source: 'myarea', ...order } };
  }

  normalizeEvent(event: MyareaEventEnvelope): AdforgeEvent {
    const map: Record<MyareaEventEnvelope['eventType'], AdforgeEvent['eventType']> = {
      'vendor.updated': 'business.updated', 'listing.updated': 'product.updated', 'order.created': 'order.created',
      'order.status_changed': 'order.updated', 'customer.updated': 'lead.created', 'review.created': 'review.created', 'ride.created': 'ride.created',
    };
    return { eventId: event.eventId, eventType: map[event.eventType], businessId: event.vendorId ?? 'platform', occurredAt: event.occurredAt, payload: { source: 'myarea', customerId: event.customerId, vendorId: event.vendorId, originalEventType: event.eventType, ...event.payload } };
  }

  validateMappedEvent(event: AdforgeEvent) { return { valid: this.adforge.validateEvent(event), event }; }
}
