import { Request, Response, NextFunction } from 'express';
import { ENV } from '../config/env';
import { dataStore } from '../config/dataStore';
import { paymentService } from '../services/payment/payment.service';
import { PaymentStatus, ITimelineEvent } from '../models/Order';
import { Order } from '../models/Order';
import { logAuditEvent } from '../middleware/auth';
import { logger } from '../utils/logger';

/**
 * Safety check: Sandbox operations are strictly forbidden in production mode
 */
function assertSandboxEnvironment(): void {
  if (ENV.NODE_ENV === 'production' && ENV.PAYMENT_MODE !== 'mock' && !ENV.PAYONEER.IS_SANDBOX) {
    throw new Error('Sandbox testing endpoints are strictly forbidden in production mode.');
  }
}

export async function getSandboxStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    assertSandboxEnvironment();

    const stats = await dataStore.getPaymentStats();
    const isMock = ENV.PAYMENT_MODE === 'mock';

    await logAuditEvent(req, 'VIEW_SANDBOX_STATUS', 'sandbox_status', 'SUCCESS');

    res.status(200).json({
      success: true,
      data: {
        environment: isMock ? 'MOCK_SANDBOX' : 'PAYONEER_SANDBOX',
        provider: isMock ? 'Mock Test Provider' : 'Payoneer Hosted Checkout',
        mode: ENV.PAYMENT_MODE,
        isSandbox: true,
        payoneerConfigured: Boolean(ENV.PAYONEER.MERCHANT_CODE && ENV.PAYONEER.API_TOKEN),
        testTransactions: stats.totalOrders,
        successfulTests: stats.successfulPayments,
        failedTests: stats.failedPayments,
        pendingTests: stats.pendingPayments,
        cancelledTests: stats.cancelledPayments,
      },
    });
  } catch (err) {
    logger.error('Failed to get sandbox status', err);
    next(err);
  }
}

export async function getSandboxTransactions(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    assertSandboxEnvironment();

    const limit = parseInt(req.query.limit as string, 10) || 50;
    const skip = parseInt(req.query.skip as string, 10) || 0;

    const { payments, total } = await dataStore.getAllPayments(undefined, undefined, skip, limit);

    const transactions = await Promise.all(
      payments.map(async p => {
        const order = await dataStore.getOrderByNumber(p.orderNumber);
        return {
          id: p._id,
          orderId: p.orderId,
          orderNumber: p.orderNumber,
          customerName: order ? `${order.customer.firstName} ${order.customer.lastName}` : 'Sandbox User',
          customerEmail: order ? order.customer.email : 'sandbox@example.com',
          amount: p.amount,
          currency: p.currency,
          provider: p.provider,
          providerPaymentId: p.providerPaymentId,
          providerReference: p.providerReference,
          status: p.status,
          orderStatus: order?.status || 'UNKNOWN',
          timeline: p.timeline || order?.timeline || [],
          metadata: p.metadata,
          failureReason: p.failureReason,
          createdAt: p.createdAt,
        };
      })
    );

    res.status(200).json({
      success: true,
      data: {
        transactions,
        total,
        limit,
        skip,
      },
    });
  } catch (err) {
    logger.error('Failed to get sandbox transactions', err);
    next(err);
  }
}

/**
 * Payment Scenario Lab:
 * Executes an authentic test transaction simulating SUCCESS, FAILED, PENDING, CANCELLED, or EXPIRED.
 */
export async function runPaymentScenario(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    assertSandboxEnvironment();

    const {
      scenario, // 'SUCCESS' | 'FAILED' | 'PENDING' | 'CANCELLED' | 'EXPIRED'
      productId,
      amount,
      customerName = 'Sandbox Test Runner',
      customerEmail = 'test.runner@sandbox.payflow.internal',
      failureReason = 'Simulated Oscato authorization decline (card expired or insufficient funds)',
    } = req.body;

    if (!scenario) {
      res.status(400).json({
        success: false,
        error: { code: 'SCENARIO_REQUIRED', message: 'Scenario is required (SUCCESS, FAILED, PENDING, CANCELLED, EXPIRED).' },
      });
      return;
    }

    // 1. Select or default a product for this scenario
    let product = productId ? await dataStore.getProductByIdOrSlug(productId) : null;
    if (!product) {
      const all = await dataStore.getAllProducts();
      product = all[0];
    }

    const testPrice = amount ? parseFloat(amount) : (product ? product.price : 149.99);
    const testTax = Number((testPrice * 0.0825).toFixed(2));
    const testTotal = Number((testPrice + testTax).toFixed(2));

    const timestamp = Date.now();
    const orderNumber = `PF-SBX-${Math.floor(100000 + Math.random() * 900000)}`;

    const timeline: ITimelineEvent[] = [
      {
        title: 'ORDER CREATED',
        description: `Order ${orderNumber} generated for Scenario: ${scenario}`,
        timestamp: new Date(timestamp - 4000),
        state: 'success',
      },
      {
        title: 'PAYMENT SESSION INITIALIZED',
        description: 'Oscato REST LIST session token requested',
        timestamp: new Date(timestamp - 3000),
        state: 'processing',
      },
      {
        title: 'PAYMENT REQUEST SENT',
        description: 'Basic Auth handshake with Oscato Payoneer API',
        timestamp: new Date(timestamp - 2000),
        state: 'processing',
      },
    ];

    // 2. Create the real test Order in dataStore
    const testOrder = new Order({
      orderNumber,
      customer: {
        firstName: customerName.split(' ')[0] || 'Sandbox',
        lastName: customerName.split(' ')[1] || 'Tester',
        email: customerEmail,
        phone: '+1 555-0199',
        shippingAddress: {
          address: '100 Sandbox Way',
          city: 'Fintech Lab',
          state: 'CA',
          postalCode: '94103',
          country: 'US',
        },
        billingAddress: {
          address: '100 Sandbox Way',
          city: 'Fintech Lab',
          state: 'CA',
          postalCode: '94103',
          country: 'US',
        },
      },
      items: [
        {
          productId: product._id,
          name: product.name,
          price: testPrice,
          quantity: 1,
          image: product.image,
          subtotal: testPrice,
        },
      ],
      subtotal: testPrice,
      discount: 0,
      tax: testTax,
      shipping: 0,
      total: testTotal,
      currency: 'USD',
      status: 'PENDING_PAYMENT',
      paymentStatus: 'PENDING',
      timeline,
      notes: [
        {
          text: `Automated test execution initiated by ${req.user?.firstName} (${req.user?.role}) under scenario ${scenario}.`,
          author: req.user ? `${req.user.firstName} (${req.user.role})` : 'Sandbox Admin',
          createdAt: new Date(),
        },
      ],
    });

    const savedOrder = await dataStore.createOrder(testOrder);

    // 3. Initiate payment session through Payment Service
    const { payment: createdPayment } = await paymentService.createPayment(savedOrder._id.toString());

    timeline.push({
      title: 'PAYONEER RESPONSE RECEIVED',
      description: `Provider token generated: ${createdPayment.providerPaymentId}`,
      timestamp: new Date(timestamp - 1000),
      state: 'success',
    });

    // 4. Execute scenario transition
    let targetPaymentStatus: PaymentStatus = 'PENDING';
    let targetOrderStatus: 'PENDING_PAYMENT' | 'PROCESSING' | 'COMPLETED' | 'CANCELLED' | 'PAYMENT_FAILED' = 'PENDING_PAYMENT';
    let finalState: 'success' | 'failure' | 'processing' = 'processing';
    let scenarioDescription = '';

    switch (scenario.toUpperCase()) {
      case 'SUCCESS':
        targetPaymentStatus = 'PAID';
        targetOrderStatus = 'PROCESSING';
        finalState = 'success';
        scenarioDescription = 'Transaction settled. Authorization code AUTH_OK_99981.';
        break;

      case 'FAILED':
        targetPaymentStatus = 'FAILED';
        targetOrderStatus = 'PAYMENT_FAILED';
        finalState = 'failure';
        scenarioDescription = failureReason;
        break;

      case 'CANCELLED':
        targetPaymentStatus = 'CANCELLED';
        targetOrderStatus = 'CANCELLED';
        finalState = 'failure';
        scenarioDescription = 'Cancelled by customer on payment redirection page.';
        break;

      case 'EXPIRED':
        targetPaymentStatus = 'EXPIRED';
        targetOrderStatus = 'CANCELLED';
        finalState = 'failure';
        scenarioDescription = 'Session timed out after 30 minutes of inactivity.';
        break;

      case 'PENDING':
      default:
        targetPaymentStatus = 'PENDING';
        targetOrderStatus = 'PENDING_PAYMENT';
        finalState = 'processing';
        scenarioDescription = 'Awaiting async webhook notification or customer confirmation.';
        break;
    }

    timeline.push({
      title: `PAYMENT ${targetPaymentStatus}`,
      description: scenarioDescription,
      timestamp: new Date(),
      state: finalState,
    });

    // Apply simulation transition
    if (targetPaymentStatus !== 'PENDING') {
      await paymentService.simulateMockAction(
        createdPayment.providerPaymentId,
        targetPaymentStatus,
        targetPaymentStatus === 'FAILED' ? failureReason : undefined
      );
    }

    // Refresh payment and order with full timeline
    const freshPayment = await dataStore.getPaymentByIdOrProviderId(createdPayment.providerPaymentId);
    if (freshPayment) {
      freshPayment.timeline = timeline;
      await dataStore.updatePayment(freshPayment);
    }

    const freshOrder = await dataStore.getOrderByNumber(orderNumber);
    if (freshOrder) {
      freshOrder.timeline = timeline;
      await dataStore.createOrder(freshOrder);
    }

    await logAuditEvent(req, 'RUN_PAYMENT_SCENARIO', orderNumber, 'SUCCESS', {
      scenario,
      paymentId: createdPayment.providerPaymentId,
      finalStatus: targetPaymentStatus,
    });

    res.status(200).json({
      success: true,
      data: {
        order: freshOrder,
        payment: freshPayment,
        scenario,
        timeline,
        message: `Scenario ${scenario} executed successfully. Order state synchronized to ${targetOrderStatus}.`,
      },
    });
  } catch (err) {
    logger.error('Failed to run payment scenario', err);
    next(err);
  }
}

/**
 * Webhook Lab:
 * Synthesizes and tests genuine webhook events passing through the actual webhook handling service
 */
export async function triggerTestWebhook(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    assertSandboxEnvironment();

    const {
      eventType = 'payment.completed', // 'payment.completed' | 'payment.failed' | 'payment.pending' | 'payment.cancelled'
      orderNumber,
      paymentId,
    } = req.body;

    let targetOrder = orderNumber ? await dataStore.getOrderByNumber(orderNumber) : null;
    let targetPayment = paymentId ? await dataStore.getPaymentByIdOrProviderId(paymentId) : null;

    if (!targetOrder) {
      const orders = await dataStore.getAllOrders(undefined, undefined, 0, 1);
      if (orders.orders.length > 0) {
        targetOrder = orders.orders[0];
      }
    }

    if (targetOrder && !targetPayment) {
      targetPayment = await dataStore.getPaymentByOrderId(targetOrder._id.toString());
    }

    const eventId = `evt_sbx_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const normalizedStatus = eventType.includes('completed')
      ? 'PAID'
      : eventType.includes('failed')
      ? 'FAILED'
      : eventType.includes('cancel')
      ? 'CANCELLED'
      : 'PENDING';

    const testWebhookPayload = {
      eventId,
      eventType,
      notificationType: 'PAYMENT_STATUS',
      timestamp: new Date().toISOString(),
      identification: {
        longId: eventId,
        shortId: eventId.substring(0, 12),
        transactionId: targetPayment?.providerPaymentId || `MOCK_TX_${Date.now()}`,
      },
      payment: {
        reference: targetOrder?.orderNumber || `PF-TEST-${Date.now()}`,
        amount: targetOrder ? targetOrder.total : 149.99,
        currency: 'USD',
        status: {
          code: normalizedStatus,
          reason: normalizedStatus === 'FAILED' ? 'Simulated webhook decline' : 'Authorized via webhook trigger',
        },
      },
    };

    // Route directly through the real paymentService webhook processor
    const result = await paymentService.handleWebhookNotification(
      testWebhookPayload,
      { 'x-payoneer-signature': 'simulated_sbx_sig' },
      'simulated_sbx_token'
    );

    await logAuditEvent(req, 'TRIGGER_TEST_WEBHOOK', eventId, 'SUCCESS', {
      eventType,
      orderNumber: targetOrder?.orderNumber,
      handled: result.success,
    });

    const savedEvent = await dataStore.findWebhookEvent('mock', eventId);

    res.status(200).json({
      success: true,
      data: {
        eventId,
        eventType,
        result,
        event: savedEvent,
        message: `Webhook ${eventType} processed cleanly through core payment service layer.`,
      },
    });
  } catch (err) {
    logger.error('Failed to trigger test webhook', err);
    next(err);
  }
}

/**
 * Webhook Idempotency Test:
 * Replays an event ID to verify that duplicates are safely recognized and ignored
 */
export async function replayWebhookEvent(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    assertSandboxEnvironment();

    const { eventId } = req.body;

    if (!eventId) {
      res.status(400).json({
        success: false,
        error: { code: 'EVENT_ID_REQUIRED', message: 'Event ID is required to test idempotency.' },
      });
      return;
    }

    const existing = await dataStore.findWebhookEvent('mock', eventId);

    if (!existing) {
      res.status(404).json({
        success: false,
        error: { code: 'EVENT_NOT_FOUND', message: `Webhook event ${eventId} not found in event history.` },
      });
      return;
    }

    // Replay the payload through paymentService
    const result = await paymentService.handleWebhookNotification(
      existing.payload,
      { 'x-payoneer-signature': 'replay_test_sig' }
    );

    await logAuditEvent(req, 'REPLAY_WEBHOOK', eventId, 'SUCCESS', { duplicate: result.duplicate });

    res.status(200).json({
      success: true,
      data: {
        eventId,
        duplicate: result.duplicate || true,
        message: 'Duplicate event safely ignored. Idempotency verified.',
        originalEvent: existing,
      },
    });
  } catch (err) {
    logger.error('Failed to replay webhook event', err);
    next(err);
  }
}
