import { Injectable } from '@nestjs/common';
import { AdforgeIntegrationService } from '../adforge/adforge.integration.service';
import { AdforgeBusinessContext, AdforgeEvent } from '../adforge/adforge.integration.types';
import {
  MyareaEventEnvelope,
  MyareaListingSnapshot,
  MyareaOrderSnapshot,
  MyareaVendorSnapshot,
} from './myarea.integration.types';

@Injectable()
export class MyareaIntegrationService {
  constructor(private readonly adforge: AdforgeIntegrationService) {}

  getStatus() {
    return {
      status: 'ready',
      source: 'myarea',
      bridge: 'khadakx',
      target: 'adforge',
      contractVersion: '1.0',
      inboundNormalizationEnabled: true,
      outboundDeliveryEnabled: false,
    };
  }

  vendorToBusinessContext(vendor: MyareaVendorSnapshot): AdforgeBusinessContext {
    const city = vendor.address?.city;
    return this.adforge.buildBusinessContext({
      businessId: vendor.vendorId,
      vertical: vendor.vertical ?? 'other',
      displayName: vendor.businessName,
      capabilities: [
        'myarea_listing',
        ...(vendor.isOpen === undefined || vendor.isOpen ? ['customer_discovery'] : []),
        ...(vendor.totalOrders && vendor.totalOrders > 0 ? ['transaction_history'] : []),
        ...(vendor.websiteUrl ? ['website'] : []),
        ...(vendor.socialChannels ? ['social_channels'] : []),
      ],
      marketing: {
        description: vendor.description,
        websiteUrl: vendor.websiteUrl,
        phone: vendor.phone,
        city,
        country: 'IN',
      },
    });
  }

  listingToEvent(listing: MyareaListingSnapshot): AdforgeEvent {
    return {
      eventId: `myarea-listing-${listing.listingId}`,
      eventType: 'product.updated',
      businessId: listing.vendorId,
      occurredAt: new Date().toISOString(),
      payload: {
        source: 'myarea',
        listingId: listing.listingId,
        title: listing.title,
        description: listing.description,
        price: listing.price,
        mrp: listing.mrp,
        unit: listing.unit,
        images: listing.images,
        imageUrl: listing.imageUrl,
        categoryId: listing.categoryId,
        subCategoryId: listing.subCategoryId,
        status: listing.status,
        isCartable: listing.isCartable,
        inStock: listing.inStock,
        stockCount: listing.stockCount,
        rating: listing.rating,
        reviewCount: listing.reviewCount,
        tags: listing.tags,
      },
    };
  }

  orderToEvent(order: MyareaOrderSnapshot): AdforgeEvent {
    return {
      eventId: `myarea-order-${order.orderId}`,
      eventType: 'order.created',
      businessId: order.vendorId,
      occurredAt: order.occurredAt ?? new Date().toISOString(),
      payload: {
        source: 'myarea',
        orderId: order.orderId,
        orderNumber: order.orderNumber,
        customerId: order.customerId,
        status: order.status,
        totalAmount: order.totalAmount,
        paymentStatus: order.paymentStatus,
        itemCount: order.itemCount,
      },
    };
  }

  normalizeEvent(event: MyareaEventEnvelope): AdforgeEvent {
    const mappedType: AdforgeEvent['eventType'] =
      event.eventType === 'vendor.updated'
        ? 'business.updated'
        : event.eventType === 'listing.updated'
          ? 'product.updated'
          : event.eventType === 'customer.updated'
            ? 'lead.created'
            : 'order.created';

    return {
      eventId: event.eventId,
      eventType: mappedType,
      businessId: event.vendorId ?? 'unknown',
      occurredAt: event.occurredAt,
      payload: {
        source: 'myarea',
        customerId: event.customerId,
        vendorId: event.vendorId,
        originalEventType: event.eventType,
        ...event.payload,
      },
    };
  }

  validateMappedEvent(event: AdforgeEvent) {
    return {
      valid: this.adforge.validateEvent(event),
      event,
    };
  }
}
