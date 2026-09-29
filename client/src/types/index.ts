export interface Product {
  _id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  currency: string;
  image: string;
  category: string;
  stock: number;
  active: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface CustomerAddress {
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface CustomerInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  shippingAddress: CustomerAddress;
  billingAddress: CustomerAddress;
}

export type OrderStatus = 'PENDING_PAYMENT' | 'PROCESSING' | 'COMPLETED' | 'CANCELLED' | 'PAYMENT_FAILED';
export type PaymentStatus = 'PENDING' | 'PROCESSING' | 'PAID' | 'FAILED' | 'CANCELLED' | 'EXPIRED' | 'REFUNDED';

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  subtotal: number;
}

export interface Order {
  _id: string;
  orderNumber: string;
  customer: CustomerInfo;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  tax: number;
  shipping: number;
  total: number;
  currency: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Payment {
  _id: string;
  orderId: string;
  orderNumber: string;
  provider: 'mock' | 'payoneer';
  providerPaymentId: string;
  providerReference?: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  failureReason?: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: {
    code: string;
    message: string;
  };
}

export interface AdminStats {
  totalOrders: number;
  successfulPayments: number;
  pendingPayments: number;
  failedPayments: number;
  cancelledPayments: number;
  totalRevenue: number;
  paymentMode: 'mock' | 'payoneer';
  payoneerConfigured: boolean;
}
