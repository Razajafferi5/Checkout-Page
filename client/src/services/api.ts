import axios from 'axios';
import { Product, Order, Payment, ApiResponse, AdminStats, CustomerInfo, PaymentStatus } from '../types';

const API_BASE = '/api';

const client = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const api = {
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

  async getAdminStats(): Promise<AdminStats> {
    const res = await client.get<ApiResponse<AdminStats>>('/admin/stats');
    return res.data.data;
  },

  async getAdminPayments(status?: string, search?: string): Promise<{ payments: Payment[]; total: number }> {
    const params: Record<string, string> = {};
    if (status && status !== 'ALL') params.status = status;
    if (search) params.search = search;

    const res = await client.get<ApiResponse<{ payments: Payment[]; total: number }>>('/admin/payments', { params });
    return res.data.data;
  },

  async getAdminOrders(status?: string, search?: string): Promise<{ orders: Order[]; total: number }> {
    const params: Record<string, string> = {};
    if (status && status !== 'ALL') params.status = status;
    if (search) params.search = search;

    const res = await client.get<ApiResponse<{ orders: Order[]; total: number }>>('/admin/orders', { params });
    return res.data.data;
  },

  async triggerSeed(): Promise<void> {
    await client.post('/admin/seed');
  },
};
