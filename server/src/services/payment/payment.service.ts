import { IPaymentProvider } from './paymentProvider.interface';
import { PayoneerProvider } from './payoneer.provider';
import { MockPaymentProvider } from './mock.provider';
import { PaymentStatus } from '../../models/Order';
import { Payment, IPayment } from '../../models/Payment';
import { WebhookEvent } from '../../models/WebhookEvent';
import { dataStore } from '../../config/dataStore';
import { ENV } from '../../config/env';
import { logger } from '../../utils/logger';

export class PaymentService {
  private readonly provider: IPaymentProvider;

  constructor() {
    if (ENV.PAYMENT_MODE === 'payoneer') {
      logger.info('Initializing PaymentService with Official PayoneerProvider');
      this.provider = new PayoneerProvider();
    } else {
      logger.info('Initializing PaymentService with MockPaymentProvider (Demo Sandbox Mode)');
      this.provider = new MockPaymentProvider();
    }
  }

  getProviderName(): 'mock' | 'payoneer' {
    return this.provider.providerName;
  }

  /**
   * Initializes a payment session for a given Order
   */
  async createPayment(orderId: string): Promise<{ payment: IPayment; redirectUrl: string }> {
    const order = await dataStore.getOrderById(orderId);
    if (!order) {
      throw new Error(`Order ${orderId} not found`);
    }

    if (order.status === 'COMPLETED' || order.paymentStatus === 'PAID') {
      throw new Error('This order has already been paid for and completed.');
    }

    // Check if an existing PENDING payment exists for this order
    const existingPayment = await dataStore.getPaymentByOrderId(order._id.toString());

    if (existingPayment && existingPayment.status === 'PENDING') {
      logger.info(`Reusing existing pending payment record ${existingPayment._id} for order ${order.orderNumber}`);
      const session = await this.provider.createPayment(order);
      existingPayment.providerPaymentId = session.providerPaymentId;
      existingPayment.providerReference = session.providerReference;
      existingPayment.metadata = session.rawResponse;
      await dataStore.updatePayment(existingPayment);

      return {
        payment: existingPayment,
        redirectUrl: session.redirectUrl,
      };
    }

    // Call provider
    const session = await this.provider.createPayment(order);

    // Save payment entity
    const payment = new Payment({
      orderId: order._id,
      orderNumber: order.orderNumber,
      provider: session.provider,
      providerPaymentId: session.providerPaymentId,
      providerReference: session.providerReference,
      amount: order.total,
      currency: order.currency,
      status: session.status,
      metadata: session.rawResponse,
    });

    const savedPayment = await dataStore.createPayment(payment);

    // Link payment to order
    order.paymentId = savedPayment._id as typeof order.paymentId;
    order.paymentStatus = 'PENDING';
    await dataStore.updateOrderStatus(order.orderNumber, 'PENDING_PAYMENT', 'PENDING');

    logger.info(`Created payment ${savedPayment._id} for order ${order.orderNumber} with provider ${session.provider}`);

    return {
      payment: savedPayment,
      redirectUrl: session.redirectUrl,
    };
  }

  /**
   * Verifies and synchronizes payment status with provider
   */
  async verifyPayment(paymentIdOrProviderId: string): Promise<IPayment> {
    const payment = await dataStore.getPaymentByIdOrProviderId(paymentIdOrProviderId);

    if (!payment) {
      throw new Error(`Payment ${paymentIdOrProviderId} not found`);
    }

    // If already in terminal state, return current record
    if (payment.status === 'PAID') {
      return payment;
    }

    const verification = await this.provider.getPaymentStatus(payment.providerPaymentId);

    // Update payment if status changed
    if (verification.status !== payment.status) {
      payment.status = verification.status;
      if (verification.failureReason) payment.failureReason = verification.failureReason;
      if (verification.providerReference) payment.providerReference = verification.providerReference;
      if (verification.rawResponse) payment.metadata = { ...payment.metadata, ...verification.rawResponse };
      await dataStore.updatePayment(payment);

      // Sync Order
      await this.syncOrderStatus(payment.orderNumber, payment.status);
    }

    return payment;
  }

  /**
   * Cancels payment
   */
  async cancelPayment(paymentId: string): Promise<IPayment> {
    const payment = await dataStore.getPaymentByIdOrProviderId(paymentId);
    if (!payment) {
      throw new Error(`Payment ${paymentId} not found`);
    }

    if (payment.status === 'PAID') {
      throw new Error('Cannot cancel an already completed payment.');
    }

    await this.provider.cancelPayment(payment.providerPaymentId);

    payment.status = 'CANCELLED';
    await dataStore.updatePayment(payment);

    await this.syncOrderStatus(payment.orderNumber, 'CANCELLED');

    logger.info(`Payment ${payment._id} marked as CANCELLED`);
    return payment;
  }

  /**
   * Developer / Demo action to simulate status transition in mock mode
   */
  async simulateMockAction(paymentId: string, action: PaymentStatus, reason?: string): Promise<IPayment> {
    if (this.provider.providerName !== 'mock') {
      throw new Error('Simulation action is only permitted in mock payment mode.');
    }

    const payment = await dataStore.getPaymentByIdOrProviderId(paymentId);
    if (!payment) {
      throw new Error(`Payment ${paymentId} not found`);
    }

    MockPaymentProvider.setMockStatus(payment.providerPaymentId, action, reason);

    payment.status = action;
    if (reason) payment.failureReason = reason;
    await dataStore.updatePayment(payment);

    await this.syncOrderStatus(payment.orderNumber, action);

    logger.info(`[MOCK MODE] State simulated to ${action} for payment ${payment._id}`);
    return payment;
  }

  /**
   * Idempotent webhook handler
   */
  async handleWebhookNotification(
    payload: unknown,
    headers: Record<string, string | string[] | undefined>,
    queryToken?: string
  ): Promise<{ success: boolean; message: string; duplicate?: boolean }> {
    const rawPayload = (payload || {}) as Record<string, unknown>;
    const tempEventId =
      (rawPayload.eventId as string) ||
      ((rawPayload.identification as Record<string, unknown>)?.longId as string) ||
      `evt_${Date.now()}`;

    // 1. Check idempotency: Have we already processed this webhook?
    const existingEvent = await dataStore.findWebhookEvent(this.provider.providerName, tempEventId);

    if (existingEvent && existingEvent.processed) {
      logger.info(`Duplicate webhook ignored: Event ID ${tempEventId}`);
      return {
        success: true,
        message: 'Duplicate webhook event already processed.',
        duplicate: true,
      };
    }

    // 2. Delegate to provider
    const result = await this.provider.handleWebhook(payload, headers, queryToken);

    if (!result.handled) {
      return {
        success: false,
        message: result.message || 'Webhook verification failed',
      };
    }

    // 3. Persist webhook event record
    const eventRecord =
      existingEvent ||
      new WebhookEvent({
        provider: this.provider.providerName,
        eventId: result.eventId,
        eventType: result.status ? `payment.${result.status.toLowerCase()}` : 'payment.updated',
        payload: rawPayload,
      });

    try {
      if (result.orderNumber && result.status) {
        await this.syncOrderStatus(result.orderNumber, result.status);

        // Also update payment record if present
        if (result.providerPaymentId) {
          const p = await dataStore.getPaymentByIdOrProviderId(result.providerPaymentId);
          if (p) {
            p.status = result.status;
            await dataStore.updatePayment(p);
          }
        }
      }

      eventRecord.processed = true;
      eventRecord.processedAt = new Date();
      await dataStore.saveWebhookEvent(eventRecord);

      return {
        success: true,
        message: 'Webhook processed successfully',
      };
    } catch (err: unknown) {
      eventRecord.processed = false;
      eventRecord.error = (err as Error).message;
      await dataStore.saveWebhookEvent(eventRecord);
      throw err;
    }
  }

  /**
   * Synchronizes Order status based on PaymentStatus
   */
  private async syncOrderStatus(orderNumber: string, paymentStatus: PaymentStatus): Promise<void> {
    let orderStatus: 'PENDING_PAYMENT' | 'PROCESSING' | 'COMPLETED' | 'CANCELLED' | 'PAYMENT_FAILED' = 'PENDING_PAYMENT';

    switch (paymentStatus) {
      case 'PAID':
        orderStatus = 'PROCESSING';
        break;
      case 'FAILED':
        orderStatus = 'PAYMENT_FAILED';
        break;
      case 'CANCELLED':
      case 'EXPIRED':
      case 'REFUNDED':
        orderStatus = 'CANCELLED';
        break;
      default:
        orderStatus = 'PENDING_PAYMENT';
        break;
    }

    await dataStore.updateOrderStatus(orderNumber, orderStatus, paymentStatus);
    logger.info(`Order ${orderNumber} synchronized to status ${orderStatus} (paymentStatus: ${paymentStatus})`);
  }
}

export const paymentService = new PaymentService();
