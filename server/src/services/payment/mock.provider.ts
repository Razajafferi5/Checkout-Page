import { IOrder, PaymentStatus } from '../../models/Order';
import {
  IPaymentProvider,
  PaymentSessionResult,
  PaymentVerificationResult,
  PaymentCancelResult,
  WebhookProcessResult,
} from './paymentProvider.interface';
import { ENV } from '../../config/env';
import { logger } from '../../utils/logger';

// In-memory registry for mock state overrides during interactive testing
const mockPaymentStore = new Map<
  string,
  {
    status: PaymentStatus;
    orderNumber: string;
    amount: number;
    currency: string;
    failureReason?: string;
  }
>();

export class MockPaymentProvider implements IPaymentProvider {
  readonly providerName = 'mock' as const;

  /**
   * Initializes a simulated payment session
   */
  async createPayment(order: IOrder): Promise<PaymentSessionResult> {
    const mockId = `MOCK_LIST_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const mockRef = `MOCK_REF_${Math.floor(100000 + Math.random() * 900000)}`;

    // Store in mock memory
    mockPaymentStore.set(mockId, {
      status: 'PENDING',
      orderNumber: order.orderNumber,
      amount: order.total,
      currency: order.currency,
    });

    // Provide a simulated redirect URL to the frontend's mock sandbox gateway page
    const redirectUrl = `${ENV.FRONTEND_URL}/checkout/mock-gateway?paymentId=${mockId}&orderNumber=${order.orderNumber}`;

    logger.info(`[MOCK MODE] Payment session initialized for order ${order.orderNumber}`, {
      mockPaymentId: mockId,
      amount: order.total,
      redirectUrl,
    });

    return {
      provider: 'mock',
      providerPaymentId: mockId,
      providerReference: mockRef,
      redirectUrl,
      status: 'PENDING',
      rawResponse: {
        mode: 'MOCK_SANDBOX',
        simulationNotice: 'This payment session is operating in isolated mock development mode.',
        orderNumber: order.orderNumber,
      },
    };
  }

  /**
   * Retrieves the current simulated state of the payment
   */
  async getPaymentStatus(providerPaymentId: string): Promise<PaymentVerificationResult> {
    const stored = mockPaymentStore.get(providerPaymentId);

    if (!stored) {
      return {
        providerPaymentId,
        status: 'PENDING',
      };
    }

    return {
      providerPaymentId,
      status: stored.status,
      paidAmount: stored.amount,
      currency: stored.currency,
      failureReason: stored.failureReason,
      rawResponse: {
        mode: 'MOCK_SANDBOX',
        mockRecord: stored,
      },
    };
  }

  /**
   * Marks mock payment as cancelled
   */
  async cancelPayment(providerPaymentId: string): Promise<PaymentCancelResult> {
    const stored = mockPaymentStore.get(providerPaymentId);
    if (stored) {
      stored.status = 'CANCELLED';
      mockPaymentStore.set(providerPaymentId, stored);
    }

    logger.info(`[MOCK MODE] Payment ${providerPaymentId} cancelled by customer`);
    return {
      providerPaymentId,
      status: 'CANCELLED',
      message: 'Simulated payment was cancelled.',
    };
  }

  /**
   * Developer helper: trigger mock action (SUCCESS, FAILED, CANCELLED, PENDING)
   */
  static setMockStatus(
    providerPaymentId: string,
    status: PaymentStatus,
    failureReason?: string
  ): void {
    const stored = mockPaymentStore.get(providerPaymentId);
    if (stored) {
      stored.status = status;
      if (failureReason) stored.failureReason = failureReason;
      mockPaymentStore.set(providerPaymentId, stored);
    }
  }

  /**
   * Handles simulated webhook payload
   */
  async handleWebhook(
    payload: unknown,
    _headers: Record<string, string | string[] | undefined>,
    _queryToken?: string
  ): Promise<WebhookProcessResult> {
    const data = payload as {
      eventId?: string;
      providerPaymentId?: string;
      orderNumber?: string;
      status?: PaymentStatus;
      failureReason?: string;
    };

    const eventId = data.eventId || `mock_evt_${Date.now()}`;
    const status = data.status || 'PAID';

    if (data.providerPaymentId) {
      MockPaymentProvider.setMockStatus(data.providerPaymentId, status, data.failureReason);
    }

    logger.info(`[MOCK MODE] Webhook simulated successfully for ${data.orderNumber || data.providerPaymentId}`, {
      eventId,
      status,
    });

    return {
      handled: true,
      eventId,
      providerPaymentId: data.providerPaymentId,
      orderNumber: data.orderNumber,
      status,
      message: `[MOCK MODE] Event processed with status ${status}`,
    };
  }
}
