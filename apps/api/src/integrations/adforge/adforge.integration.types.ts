export type KhadakxVertical =
  | 'restaurant'
  | 'real_estate'
  | 'healthcare'
  | 'services'
  | 'other';

export interface AdforgeBusinessContext {
  businessId: string;
  vertical: KhadakxVertical;
  displayName: string;
  capabilities: string[];
  marketing: {
    description?: string;
    websiteUrl?: string;
    phone?: string;
    city?: string;
    country?: string;
  };
  source: 'khadakx';
}

export interface AdforgeEvent {
  eventId: string;
  eventType:
    | 'business.updated'
    | 'product.updated'
    | 'campaign.requested'
    | 'lead.created'
    | 'order.created';
  businessId: string;
  occurredAt: string;
  payload: Record<string, unknown>;
}
