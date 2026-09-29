import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MockPaymentProvider } from '../src/services/payment/mock.provider';
import { PayoneerProvider } from '../src/services/payment/payoneer.provider';
import { generateOrderNumber, generatePaymentReference } from '../src/utils/orderNumber';
import { IOrder } from '../src/models/Order';
import { Types } from 'mongoose';
import request from 'supertest';
import { createApp } from '../src/app';

describe('1. Business Utilities & Identifiers', () => {
  it('Generates formatted order numbers matching PF-YYYY-XXXXXX', () => {
    const orderNum = generateOrderNumber();
    const currentYear = new Date().getFullYear();
    expect(orderNum).toMatch(new RegExp(`^PF-${currentYear}-\\d{6}$`));
  });

  it('Generates unique payment reference strings', () => {
    const ref1 = generatePaymentReference();
    const ref2 = generatePaymentReference();
    expect(ref1).toMatch(/^PAY-[A-Z0-9]+-[A-Z0-9]+$/);
    expect(ref1).not.toBe(ref2);
  });
});

const mockOrder = {
  _id: new Types.ObjectId(),
  orderNumber: 'PF-2026-112233',
  customer: {
    firstName: 'Alex',
    lastName: 'Morgan',
    email: 'alex@example.com',
    phone: '+1 555-0199',
    shippingAddress: {
      address: '100 Innovation Way',
      city: 'Austin',
      state: 'TX',
      postalCode: '78701',
      country: 'US',
    },
    billingAddress: {
      address: '100 Innovation Way',
      city: 'Austin',
      state: 'TX',
      postalCode: '78701',
      country: 'US',
    },
  },
  items: [],
  subtotal: 149.99,
  discount: 0,
  tax: 12.37,
  shipping: 0,
  total: 162.36,
  currency: 'USD',
  status: 'PENDING_PAYMENT',
  paymentStatus: 'PENDING',
} as unknown as IOrder;

describe('2. Payment Provider Abstraction (Mock Sandbox Provider)', () => {
  const provider = new MockPaymentProvider();

  it('createPayment returns a valid session with redirectUrl', async () => {
    const session = await provider.createPayment(mockOrder);
    expect(session.provider).toBe('mock');
    expect(session.providerPaymentId).toContain('MOCK_LIST_');
    expect(session.redirectUrl).toContain('/checkout/mock-gateway');
    expect(session.status).toBe('PENDING');
  });

  it('getPaymentStatus returns updated state after setMockStatus', async () => {
    const session = await provider.createPayment(mockOrder);
    const initial = await provider.getPaymentStatus(session.providerPaymentId);
    expect(initial.status).toBe('PENDING');

    MockPaymentProvider.setMockStatus(session.providerPaymentId, 'PAID');
    const updated = await provider.getPaymentStatus(session.providerPaymentId);
    expect(updated.status).toBe('PAID');
    expect(updated.paidAmount).toBe(162.36);
  });

  it('cancelPayment transitions state to CANCELLED', async () => {
    const session = await provider.createPayment(mockOrder);
    const cancelRes = await provider.cancelPayment(session.providerPaymentId);
    expect(cancelRes.status).toBe('CANCELLED');

    const statusCheck = await provider.getPaymentStatus(session.providerPaymentId);
    expect(statusCheck.status).toBe('CANCELLED');
  });

  it('handleWebhook processes simulated webhook payloads', async () => {
    const session = await provider.createPayment(mockOrder);
    const webhookRes = await provider.handleWebhook(
      {
        eventId: 'evt_test_101',
        providerPaymentId: session.providerPaymentId,
        orderNumber: mockOrder.orderNumber,
        status: 'PAID',
      },
      {}
    );

    expect(webhookRes.handled).toBe(true);
    expect(webhookRes.status).toBe('PAID');

    const statusCheck = await provider.getPaymentStatus(session.providerPaymentId);
    expect(statusCheck.status).toBe('PAID');
  });
});

describe('3. PayoneerProvider Security & Credential Isolation', () => {
  it('PayoneerProvider protects against unconfigured environments', async () => {
    const payoneer = new PayoneerProvider();
    await expect(payoneer.createPayment(mockOrder)).rejects.toThrow(
      /Payoneer credentials are incomplete/i
    );
  });
});

describe('4. Input Validation & Error Handling Contract', () => {
  const app = createApp();

  it('POST /api/orders rejects request with missing customer', async () => {
    const res = await request(app).post('/api/orders').send({});
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('INVALID_CUSTOMER');
  });

  it('POST /api/orders rejects invalid email address', async () => {
    const res = await request(app).post('/api/orders').send({
      customer: {
        firstName: 'Jane',
        lastName: 'Doe',
        email: 'invalid-email-string',
        phone: '12345678',
        shippingAddress: {
          address: 'A',
          city: 'B',
          state: 'C',
          postalCode: 'D',
          country: 'US',
        },
      },
      items: [{ productId: new Types.ObjectId().toString(), quantity: 1 }],
    });
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.error.message).toContain('valid email');
  });

  it('POST /api/orders rejects empty items cart', async () => {
    const res = await request(app).post('/api/orders').send({
      customer: {
        firstName: 'Jane',
        lastName: 'Doe',
        email: 'jane@example.com',
        phone: '12345678',
        shippingAddress: {
          address: 'A',
          city: 'B',
          state: 'C',
          postalCode: 'D',
          country: 'US',
        },
      },
      items: [],
    });
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('EMPTY_CART');
  });

  it('GET /api/health returns UP status and active payment mode', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.status).toBe('UP');
    expect(res.body.data.paymentMode).toBeDefined();
  });

  it('Returns structured 404 for unknown routes', async () => {
    const res = await request(app).get('/api/unknown-endpoint');
    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('NOT_FOUND');
  });
});
