import { KhadakxVertical } from '../adforge/adforge.integration.types';

export interface MyareaVendorSnapshot {
  vendorId: string;
  businessName: string;
  description?: string;
  phone?: string;
  email?: string;
  logo?: string;
  banner?: string;
  vertical?: KhadakxVertical;
  categoryId?: string;
  subCategoryId?: string;
  status?: string;
  plan?: string;
  rating?: number;
  reviewCount?: number;
  totalOrders?: number;
  totalRevenue?: number;
  isOpen?: boolean;
  address?: { line1?: string; city?: string; pincode?: string };
  location?: { coordinates?: [number, number] };
  websiteUrl?: string;
  socialChannels?: Record<string, string>;
}

export interface MyareaListingSnapshot {
  listingId: string;
  vendorId: string;
  title: string;
  description?: string;
  price: number;
  mrp?: number;
  unit?: string;
  images?: string[];
  imageUrl?: string;
  categoryId?: string;
  subCategoryId?: string;
  status?: string;
  isCartable?: boolean;
  inStock?: boolean;
  stockCount?: number;
  rating?: number;
  reviewCount?: number;
  tags?: string[];
}

export interface MyareaOrderSnapshot {
  orderId: string;
  orderNumber?: string;
  customerId: string;
  vendorId: string;
  status: string;
  totalAmount: number;
  paymentStatus?: string;
  itemCount?: number;
  occurredAt?: string;
}

export interface MyareaEventEnvelope {
  eventId: string;
  eventType:
    | 'vendor.updated'
    | 'listing.updated'
    | 'order.created'
    | 'order.status_changed'
    | 'customer.updated';
  vendorId?: string;
  customerId?: string;
  occurredAt: string;
  payload: Record<string, unknown>;
}
