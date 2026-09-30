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
  notes?: OrderNote[];
  timeline?: TimelineEvent[];
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
  timeline?: TimelineEvent[];
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

export type UserRole = 'OPERATIONS' | 'SANDBOX_ADMIN';

export type Permission =
  | 'VIEW_ORDERS'
  | 'VIEW_PAYMENTS'
  | 'VIEW_TRANSACTIONS'
  | 'VIEW_WEBHOOKS'
  | 'VIEW_CUSTOMERS'
  | 'RETRY_PAYMENT'
  | 'CANCEL_ORDER'
  | 'ADD_NOTE'
  | 'RUN_PAYMENT_TEST'
  | 'RUN_WEBHOOK_TEST'
  | 'REPLAY_WEBHOOK'
  | 'VIEW_SANDBOX_STATUS'
  | 'RUN_MOCK_SCENARIOS';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  permissions: Permission[];
  lastLogin?: string;
}

export interface TimelineEvent {
  title: string;
  description?: string;
  timestamp: string;
  state: 'success' | 'processing' | 'failure' | 'neutral';
}

export interface OrderNote {
  text: string;
  author: string;
  createdAt: string;
}

export interface WebhookEventRecord {
  _id: string;
  provider: string;
  eventId: string;
  eventType: string;
  payload: Record<string, unknown>;
  processed: boolean;
  processedAt?: string;
  error?: string;
  createdAt: string;
}

export interface AuditLogRecord {
  _id: string;
  userId?: string;
  userEmail: string;
  userRole: UserRole;
  action: string;
  resource?: string;
  ip?: string;
  result: 'SUCCESS' | 'FAILURE';
  details?: Record<string, unknown>;
  createdAt: string;
}

export interface SandboxStatus {
  environment: 'MOCK_SANDBOX' | 'PAYONEER_SANDBOX';
  provider: string;
  mode: string;
  isSandbox: boolean;
  payoneerConfigured: boolean;
  testTransactions: number;
  successfulTests: number;
  failedTests: number;
  pendingTests: number;
  cancelledTests: number;
}

export interface SandboxTransaction {
  id: string;
  orderId: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  amount: number;
  currency: string;
  provider: string;
  providerPaymentId: string;
  providerReference?: string;
  status: PaymentStatus;
  orderStatus: OrderStatus;
  timeline: TimelineEvent[];
  metadata?: Record<string, unknown>;
  failureReason?: string;
  createdAt: string;
}
