import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/app';
import { dataStore } from '../src/config/dataStore';
import { Application } from 'express';

describe('PayFlow RBAC, Authentication & Sandbox Bench Architecture', () => {
  let app: Application;
  let operationsToken: string;
  let sandboxToken: string;
  let testOrderNumber: string;

  beforeAll(async () => {
    app = createApp();
    await dataStore.seedProducts();
    await dataStore.seedUsers();
  });

  describe('1. Public Customer Access (Zero Login Required)', () => {
    it('Customer can browse product catalog without authentication', async () => {
      const res = await request(app).get('/api/products');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });

    it('Customer can create an order without authentication', async () => {
      const products = await dataStore.getAllProducts();
      const payload = {
        customer: {
          firstName: 'Public',
          lastName: 'Customer',
          email: 'public.customer@example.com',
          phone: '+1 555-0100',
          shippingAddress: {
            address: '123 Market St',
            city: 'San Francisco',
            state: 'CA',
            postalCode: '94105',
            country: 'US',
          },
          billingAddress: {
            address: '123 Market St',
            city: 'San Francisco',
            state: 'CA',
            postalCode: '94105',
            country: 'US',
          },
        },
        items: [{ productId: products[0]._id.toString(), quantity: 1 }],
      };

      const res = await request(app).post('/api/orders').send(payload);
      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.orderNumber).toBeDefined();
      testOrderNumber = res.body.data.orderNumber;
    });

    it('Customer cannot access internal Operations endpoints without login (401)', async () => {
      const res = await request(app).get('/api/operations/orders');
      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('UNAUTHORIZED');
    });

    it('Customer cannot access internal Sandbox Bench endpoints without login (401)', async () => {
      const res = await request(app).get('/api/sandbox/status');
      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('UNAUTHORIZED');
    });
  });

  describe('2. Authentication & Credential Security', () => {
    it('Fails login with invalid password', async () => {
      const res = await request(app).post('/api/auth/login').send({
        email: 'ops@payflow.internal',
        password: 'WrongPassword123!',
      });
      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('INVALID_CREDENTIALS');
    });

    it('Operations user can login successfully with valid credentials', async () => {
      const res = await request(app).post('/api/auth/login').send({
        email: 'ops@payflow.internal',
        password: 'PayFlowOps2026!',
      });
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.token).toBeDefined();
      expect(res.body.data.user.role).toBe('OPERATIONS');
      operationsToken = res.body.data.token;
    });

    it('Sandbox Admin user can login successfully with valid credentials', async () => {
      const res = await request(app).post('/api/auth/login').send({
        email: 'sandbox@payflow.internal',
        password: 'PayFlowSandbox2026!',
      });
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.token).toBeDefined();
      expect(res.body.data.user.role).toBe('SANDBOX_ADMIN');
      sandboxToken = res.body.data.token;
    });

    it('GET /api/auth/me returns authenticated profile', async () => {
      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${operationsToken}`);
      expect(res.status).toBe(200);
      expect(res.body.data.user.email).toBe('ops@payflow.internal');
      expect(res.body.data.user.role).toBe('OPERATIONS');
    });

    it('Rejects request with corrupted / forged token', async () => {
      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', 'Bearer forged_token_value_abc');
      expect(res.status).toBe(401);
      expect(res.body.error.code).toBe('INVALID_TOKEN');
    });
  });

  describe('3. Role-Based Access Control (RBAC)', () => {
    it('Operations user can access operations dashboard metrics', async () => {
      const res = await request(app)
        .get('/api/operations/stats')
        .set('Authorization', `Bearer ${operationsToken}`);
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.totalOrders).toBeDefined();
    });

    it('Operations user CANNOT access Sandbox Bench endpoints (403 Forbidden)', async () => {
      const res = await request(app)
        .get('/api/sandbox/status')
        .set('Authorization', `Bearer ${operationsToken}`);
      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('FORBIDDEN');
    });

    it('Operations user CANNOT trigger payment scenarios (403 Forbidden)', async () => {
      const res = await request(app)
        .post('/api/sandbox/payment-scenarios')
        .set('Authorization', `Bearer ${operationsToken}`)
        .send({ scenario: 'SUCCESS' });
      expect(res.status).toBe(403);
      expect(res.body.error.code).toBe('FORBIDDEN');
    });

    it('Operations user can add operational note to order', async () => {
      const res = await request(app)
        .post(`/api/operations/orders/${testOrderNumber}/notes`)
        .set('Authorization', `Bearer ${operationsToken}`)
        .send({ note: 'Customer verified address via phone.' });
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.order.notes).toBeDefined();
    });

    it('Sandbox Admin can access both Sandbox Bench and Operations overview', async () => {
      const sbxRes = await request(app)
        .get('/api/sandbox/status')
        .set('Authorization', `Bearer ${sandboxToken}`);
      expect(sbxRes.status).toBe(200);
      expect(sbxRes.body.data.environment).toBeDefined();

      const opsRes = await request(app)
        .get('/api/operations/stats')
        .set('Authorization', `Bearer ${sandboxToken}`);
      expect(opsRes.status).toBe(200);
    });
  });

  describe('4. Sandbox Bench Payment Scenario Lab', () => {
    it('Sandbox Admin can execute SUCCESS scenario with full timeline', async () => {
      const res = await request(app)
        .post('/api/sandbox/payment-scenarios')
        .set('Authorization', `Bearer ${sandboxToken}`)
        .send({
          scenario: 'SUCCESS',
          amount: 249.99,
          customerName: 'Sarah Connor',
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.order.paymentStatus).toBe('PAID');
      expect(res.body.data.order.status).toBe('PROCESSING');
      expect(Array.isArray(res.body.data.timeline)).toBe(true);
      expect(res.body.data.timeline.length).toBeGreaterThanOrEqual(4);
    });

    it('Sandbox Admin can execute FAILED scenario with custom decline reason', async () => {
      const res = await request(app)
        .post('/api/sandbox/payment-scenarios')
        .set('Authorization', `Bearer ${sandboxToken}`)
        .send({
          scenario: 'FAILED',
          amount: 89.99,
          failureReason: 'Card issuer 3D-Secure challenge cancelled',
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.order.paymentStatus).toBe('FAILED');
      expect(res.body.data.order.status).toBe('PAYMENT_FAILED');
    });

    it('Sandbox Admin can execute CANCELLED scenario', async () => {
      const res = await request(app)
        .post('/api/sandbox/payment-scenarios')
        .set('Authorization', `Bearer ${sandboxToken}`)
        .send({ scenario: 'CANCELLED' });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.order.paymentStatus).toBe('CANCELLED');
    });
  });

  describe('5. Webhook Lab & Idempotency Replay', () => {
    let triggeredEventId: string;

    it('Sandbox Admin can trigger test webhook through real payment service', async () => {
      const res = await request(app)
        .post('/api/sandbox/webhooks/test')
        .set('Authorization', `Bearer ${sandboxToken}`)
        .send({ eventType: 'payment.completed' });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.eventId).toBeDefined();
      triggeredEventId = res.body.data.eventId;
    });

    it('Replaying the same webhook event ID verifies idempotency (duplicate ignored)', async () => {
      const res = await request(app)
        .post('/api/sandbox/webhooks/replay')
        .set('Authorization', `Bearer ${sandboxToken}`)
        .send({ eventId: triggeredEventId });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.duplicate).toBe(true);
      expect(res.body.data.message).toContain('Duplicate event safely ignored');
    });
  });

  describe('6. Logout and Audit Trail', () => {
    it('Logout logs audit record and completes', async () => {
      const res = await request(app)
        .post('/api/auth/logout')
        .set('Authorization', `Bearer ${operationsToken}`);
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it('Operations user can view audit logs', async () => {
      const res = await request(app)
        .get('/api/operations/audit-logs')
        .set('Authorization', `Bearer ${sandboxToken}`);
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data.logs)).toBe(true);
      expect(res.body.data.logs.length).toBeGreaterThan(0);
    });
  });
});
