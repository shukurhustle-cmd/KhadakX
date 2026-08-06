export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'SUPER_ADMIN' | 'ADMIN' | 'MANAGER' | 'STAFF' | 'WAITER' | 'KITCHEN' | 'CASHIER' | 'CUSTOMER';
  phone?: string;
  restaurantId?: string;
  branchId?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Restaurant {
  id: string;
  name: string;
  slug: string;
  logo?: string;
  banner?: string;
  description?: string;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  cuisine: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface MenuItem {
  id: string;
  name: string;
  description?: string;
  price: number;
  category: string;
  subCategory?: string;
  image?: string;
  arModel?: string;
  isAvailable: boolean;
  isFeatured: boolean;
  isVeg: boolean;
  calories?: number;
  prepTime?: number;
  restaurantId: string;
  createdAt: Date;
  updatedAt: Date;
  addons?: MenuAddon[];
}

export interface MenuAddon {
  id: string;
  name: string;
  price: number;
  isRequired: boolean;
  maxSelect?: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  total: number;
  subtotal: number;
  tax?: number;
  discount?: number;
  status: 'PENDING' | 'CONFIRMED' | 'PREPARING' | 'READY' | 'COMPLETED' | 'CANCELLED';
  type: 'DINE_IN' | 'TAKEAWAY' | 'DELIVERY';
  tableId?: string;
  customerId?: string;
  staffId?: string;
  waiterId?: string;
  branchId: string;
  restaurantId: string;
  items: OrderItem[];
  payments: Payment[];
  prepTime?: number;
  readyAt?: Date;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  note?: string;
  menuItemId: string;
  menuItem: MenuItem;
  addons?: any;
  status: 'PENDING' | 'PREPARING' | 'READY' | 'COMPLETED';
}

export interface Payment {
  id: string;
  amount: number;
  method: 'CASH' | 'CARD' | 'UPI' | 'QR' | 'RAZORPAY';
  status: 'PENDING' | 'SUCCESS' | 'FAILED' | 'REFUNDED';
  transactionId?: string;
  razorpayId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  statusCode?: number;
}