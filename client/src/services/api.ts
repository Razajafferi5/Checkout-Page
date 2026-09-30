import axios from 'axios';
import {
  Product,
  Order,
  Payment,
  ApiResponse,
  AdminStats,
  CustomerInfo,
  PaymentStatus,
  User,
  WebhookEventRecord,
  AuditLogRecord,
  SandboxStatus,
  SandboxTransaction,
  TimelineEvent,
} from '../types';

const API_BASE = '/api';

const client = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Automatically inject JWT token from localStorage if present
client.interceptors.request.use(config => {
  const token = localStorage.getItem('payflow_token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const api = {
  // PUBLIC CUSTOMER API
  async getHealth(): Promise<{ status: string; paymentMode: string }> {
    const res = await client.get<ApiResponse<{ status: string; paymentMode: string }>>('/health');
    return res.data.data;
  },

  async getProducts(): Promise<Product[]> {
    const res = await client.get<ApiResponse<Product[]>>('/products');
    return res.data.data;
  },

  async getProductById(id: string): Promise<Product> {
    const res = await client.get<ApiResponse<Product>>(`/products/${id}`);
    return res.data.data;
  },

  async createOrder(payload: {
    customer: CustomerInfo;
    items: { productId: string; quantity: number }[];
  }): Promise<Order> {
    const res = await client.post<ApiResponse<Order>>('/orders', payload);
    return res.data.data;
  },

  async getOrderByNumber(orderNumber: string): Promise<{ order: Order; payment: Payment | null }> {
    const res = await client.get<ApiResponse<{ order: Order; payment: Payment | null }>>(`/orders/${orderNumber}`);
    return res.data.data;
  },

  async createPayment(orderId: string): Promise<{
    paymentId: string;
    orderNumber: string;
    provider: string;
    providerPaymentId: string;
    redirectUrl: string;
    amount: number;
    currency: string;
    status: PaymentStatus;
  }> {
    const res = await client.post<ApiResponse<{
      paymentId: string;
      orderNumber: string;
      provider: string;
      providerPaymentId: string;
      redirectUrl: string;
      amount: number;
      currency: string;
      status: PaymentStatus;
    }>>('/payments/create', { orderId });
    return res.data.data;
  },

  async getPaymentStatus(paymentIdOrProviderId: string): Promise<Payment> {
    const res = await client.get<ApiResponse<Payment>>(`/payments/${paymentIdOrProviderId}`);
    return res.data.data;
  },

  async cancelPayment(paymentId: string): Promise<Payment> {
    const res = await client.post<ApiResponse<Payment>>(`/payments/${paymentId}/cancel`);
    return res.data.data;
  },

  async simulateMockAction(paymentId: string, action: PaymentStatus, reason?: string): Promise<Payment> {
    const res = await client.post<ApiResponse<Payment>>('/payments/mock-action', {
      paymentId,
      action,
      reason,
    });
    return res.data.data;
  },

  // AUTHENTICATION API
  auth: {
    async login(email: string, password: string): Promise<{ token: string; user: User }> {
      const res = await client.post<ApiResponse<{ token: string; user: User }>>('/auth/login', {
        email,
        password,
      });
      return res.data.data;
    },

    async logout(): Promise<void> {
      await client.post('/auth/logout');
    },

    async getMe(): Promise<User> {
      const res = await client.get<ApiResponse<{ user: User }>>('/auth/me');
      return res.data.data.user;
    },
  },

  // OPERATIONS API
  operations: {
    async getStats(): Promise<AdminStats> {
      const res = await client.get<ApiResponse<AdminStats>>('/operations/stats');
      return res.data.data;
    },

    async getOrders(
      status?: string,
      search?: string,
      limit: number = 50,
      skip: number = 0
    ): Promise<{ orders: Order[]; total: number }> {
      const params: Record<string, string | number> = { limit, skip };
      if (status && status !== 'ALL') params.status = status;
      if (search) params.search = search;

      const res = await client.get<ApiResponse<{ orders: Order[]; total: number }>>('/operations/orders', {
        params,
      });
      return res.data.data;
    },

    async getOrderDetails(orderNumber: string): Promise<{ order: Order; payment: Payment | null }> {
      const res = await client.get<ApiResponse<{ order: Order; payment: Payment | null }>>(
        `/operations/orders/${orderNumber}`
      );
      return res.data.data;
    },

    async getPayments(
      status?: string,
      search?: string,
      limit: number = 50,
      skip: number = 0
    ): Promise<{ payments: Payment[]; total: number }> {
      const params: Record<string, string | number> = { limit, skip };
      if (status && status !== 'ALL') params.status = status;
      if (search) params.search = search;

      const res = await client.get<ApiResponse<{ payments: Payment[]; total: number }>>('/operations/payments', {
        params,
      });
      return res.data.data;
    },

    async getTransactions(
      search?: string,
      limit: number = 50,
      skip: number = 0
    ): Promise<{
      transactions: Array<{
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
        paymentStatus: PaymentStatus;
        orderStatus: string;
        createdAt: string;
        updatedAt: string;
        failureReason?: string;
      }>;
      total: number;
    }> {
      const params: Record<string, string | number> = { limit, skip };
      if (search) params.search = search;

      const res = await client.get<ApiResponse<any>>('/operations/transactions', { params });
      return res.data.data;
    },

    async getWebhooks(
      limit: number = 50,
      skip: number = 0
    ): Promise<{ events: WebhookEventRecord[]; total: number }> {
      const res = await client.get<ApiResponse<{ events: WebhookEventRecord[]; total: number }>>(
        '/operations/webhooks',
        { params: { limit, skip } }
      );
      return res.data.data;
    },

    async addOrderNote(orderNumber: string, note: string): Promise<Order> {
      const res = await client.post<ApiResponse<{ order: Order; message: string }>>(
        `/operations/orders/${orderNumber}/notes`,
        { note }
      );
      return res.data.data.order;
    },

    async cancelOrder(orderNumber: string, reason?: string): Promise<Order> {
      const res = await client.post<ApiResponse<{ order: Order; message: string }>>(
        `/operations/orders/${orderNumber}/cancel`,
        { reason }
      );
      return res.data.data.order;
    },

    async retryPayment(paymentId: string): Promise<Payment> {
      const res = await client.post<ApiResponse<{ payment: Payment; message: string }>>(
        `/operations/payments/${paymentId}/retry`
      );
      return res.data.data.payment;
    },

    async getAuditLogs(
      limit: number = 50,
      skip: number = 0
    ): Promise<{ logs: AuditLogRecord[]; total: number }> {
      const res = await client.get<ApiResponse<{ logs: AuditLogRecord[]; total: number }>>(
        '/operations/audit-logs',
        { params: { limit, skip } }
      );
      return res.data.data;
    },
  },

  // SANDBOX BENCH API
  sandbox: {
    async getStatus(): Promise<SandboxStatus> {
      const res = await client.get<ApiResponse<SandboxStatus>>('/sandbox/status');
      return res.data.data;
    },

    async getTransactions(
      limit: number = 50,
      skip: number = 0
    ): Promise<{ transactions: SandboxTransaction[]; total: number }> {
      const res = await client.get<ApiResponse<{ transactions: SandboxTransaction[]; total: number }>>(
        '/sandbox/transactions',
        { params: { limit, skip } }
      );
      return res.data.data;
    },

    async runScenario(payload: {
      scenario: 'SUCCESS' | 'FAILED' | 'PENDING' | 'CANCELLED' | 'EXPIRED';
      productId?: string;
      amount?: number;
      customerName?: string;
      customerEmail?: string;
      failureReason?: string;
    }): Promise<{
      order: Order;
      payment: Payment;
      scenario: string;
      timeline: TimelineEvent[];
      message: string;
    }> {
      const res = await client.post<ApiResponse<{
        order: Order;
        payment: Payment;
        scenario: string;
        timeline: TimelineEvent[];
        message: string;
      }>>('/sandbox/payment-scenarios', payload);
      return res.data.data;
    },

    async triggerWebhook(payload: {
      eventType: string;
      orderNumber?: string;
      paymentId?: string;
    }): Promise<{
      eventId: string;
      eventType: string;
      result: any;
      event: WebhookEventRecord;
      message: string;
    }> {
      const res = await client.post<ApiResponse<{
        eventId: string;
        eventType: string;
        result: any;
        event: WebhookEventRecord;
        message: string;
      }>>('/sandbox/webhooks/test', payload);
      return res.data.data;
    },

    async replayWebhook(eventId: string): Promise<{
      eventId: string;
      duplicate: boolean;
      message: string;
      originalEvent: WebhookEventRecord;
    }> {
      const res = await client.post<ApiResponse<{
        eventId: string;
        duplicate: boolean;
        message: string;
        originalEvent: WebhookEventRecord;
      }>>('/sandbox/webhooks/replay', { eventId });
      return res.data.data;
    },
  },

  // LEGACY ADMIN WRAPPERS (for backwards compatibility)
  async getAdminStats(): Promise<AdminStats> {
    const res = await client.get<ApiResponse<AdminStats>>('/operations/stats');
    return res.data.data;
  },

  async getAdminPayments(status?: string, search?: string): Promise<{ payments: Payment[]; total: number }> {
    return this.operations.getPayments(status, search);
  },

  async getAdminOrders(status?: string, search?: string): Promise<{ orders: Order[]; total: number }> {
    return this.operations.getOrders(status, search);
  },

  async triggerSeed(): Promise<void> {
    await client.post('/admin/seed');
  },
};
