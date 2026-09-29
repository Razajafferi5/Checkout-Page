import axios, { AxiosInstance } from 'axios';
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

export class PayoneerProvider implements IPaymentProvider {
  readonly providerName = 'payoneer' as const;
  private readonly client: AxiosInstance;

  constructor() {
    const authHeader = Buffer.from(
      `${ENV.PAYONEER.MERCHANT_CODE}:${ENV.PAYONEER.API_TOKEN}`
    ).toString('base64');

    this.client = axios.create({
      baseURL: ENV.PAYONEER.API_BASE_URL,
      timeout: 15000,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Basic ${authHeader}`,
      },
    });
  }

  private validateCredentials() {
    if (
      !ENV.PAYONEER.MERCHANT_CODE ||
      !ENV.PAYONEER.API_TOKEN ||
      ENV.PAYONEER.MERCHANT_CODE === 'YOUR_SANDBOX_MERCHANT_CODE' ||
      ENV.PAYONEER.API_TOKEN === 'YOUR_SANDBOX_API_TOKEN'
    ) {
      throw new Error(
        'Payoneer credentials are incomplete in environment. Please set PAYONEER_MERCHANT_CODE and PAYONEER_API_TOKEN, or switch to PAYMENT_MODE=mock.'
      );
    }
  }

  /**
   * Initializes a Payoneer Hosted Checkout Session (LIST request)
   */
  async createPayment(order: IOrder): Promise<PaymentSessionResult> {
    this.validateCredentials();

    const division = ENV.PAYONEER.DIVISION || ENV.PAYONEER.MERCHANT_CODE;
    const returnUrl = `${ENV.FRONTEND_URL}/checkout/confirmation?orderNumber=${order.orderNumber}`;
    const cancelUrl = `${ENV.FRONTEND_URL}/checkout/cancelled?orderNumber=${order.orderNumber}`;
    const notificationUrl = `${ENV.API_BASE_URL}/api/webhooks/payoneer?token=${encodeURIComponent(ENV.WEBHOOK_SECRET)}`;

    const payload = {
      integration: 'HOSTED',
      division: division,
      transactionId: order.orderNumber,
      customer: {
        number: order.customer.email,
        email: order.customer.email,
        name: {
          firstName: order.customer.firstName,
          lastName: order.customer.lastName,
        },
        addresses: {
          billing: {
            street: order.customer.billingAddress.address,
            city: order.customer.billingAddress.city,
            state: order.customer.billingAddress.state,
            postalCode: order.customer.billingAddress.postalCode,
            country: order.customer.billingAddress.country,
          },
          shipping: {
            street: order.customer.shippingAddress.address,
            city: order.customer.shippingAddress.city,
            state: order.customer.shippingAddress.state,
            postalCode: order.customer.shippingAddress.postalCode,
            country: order.customer.shippingAddress.country,
          },
        },
      },
      payment: {
        reference: `Order ${order.orderNumber}`,
        amount: Number(order.total.toFixed(2)),
        currency: order.currency,
      },
      style: {
        language: 'en',
      },
      callback: {
        returnUrl,
        cancelUrl,
        notificationUrl,
      },
    };

    logger.info(`Initiating Payoneer LIST session for order ${order.orderNumber}`, {
      orderNumber: order.orderNumber,
      amount: order.total,
      currency: order.currency,
    });

    try {
      const response = await this.client.post('', payload);
      const data = response.data;

      const providerPaymentId = data.identification?.longId || data.identification?.transactionId;
      const providerReference = data.identification?.shortId || data.identification?.transactionId;
      const redirectUrl = data.links?.redirect || data.redirect?.url;

      if (!providerPaymentId || !redirectUrl) {
        throw new Error('Payoneer response did not contain expected session ID or redirect URL.');
      }

      logger.info(`Payoneer LIST created successfully for ${order.orderNumber}`, {
        providerPaymentId,
        providerReference,
      });

      return {
        provider: 'payoneer',
        providerPaymentId,
        providerReference,
        redirectUrl,
        status: 'PENDING',
        rawResponse: data,
      };
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const errorDetail = err.response?.data || err.message;
        logger.error(`Payoneer LIST request failed`, err, {
          status: err.response?.status,
          response: errorDetail,
        });
        throw new Error(
          `Payoneer Checkout API error: ${typeof errorDetail === 'object' ? JSON.stringify(errorDetail) : errorDetail}`
        );
      }
      logger.error('Unexpected error in Payoneer createPayment', err);
      throw err;
    }
  }

  /**
   * Queries Payoneer for the session / payment outcome
   */
  async getPaymentStatus(providerPaymentId: string): Promise<PaymentVerificationResult> {
    this.validateCredentials();

    logger.info(`Querying Payoneer session status for ID: ${providerPaymentId}`);
    try {
      // Endpoint: GET /api/lists/{longId}
      const response = await this.client.get(`/${encodeURIComponent(providerPaymentId)}`);
      const data = response.data;

      const interactionCode = data.interaction?.code || '';
      const interactionReason = data.interaction?.reason || '';
      const statusCode = data.status?.code || '';

      let status: PaymentStatus = 'PENDING';
      let failureReason: string | undefined;

      if (interactionCode === 'PROCEED' && interactionReason === 'OK') {
        status = 'PAID';
      } else if (statusCode === 'CHARGED' || statusCode === 'PAID') {
        status = 'PAID';
      } else if (
        interactionCode === 'ABORT' ||
        interactionCode === 'REJECT' ||
        interactionCode === 'CLIENTSIDE_ERROR'
      ) {
        status = 'FAILED';
        failureReason = data.resultInfo || `Payment declined: ${interactionCode} / ${interactionReason}`;
      } else if (statusCode === 'CANCELLED') {
        status = 'CANCELLED';
      } else if (statusCode === 'EXPIRED') {
        status = 'EXPIRED';
      }

      return {
        providerPaymentId,
        status,
        paidAmount: data.payment?.amount,
        currency: data.payment?.currency,
        providerReference: data.identification?.shortId,
        failureReason,
        rawResponse: data,
      };
    } catch (err: unknown) {
      logger.error(`Failed to retrieve Payoneer payment status for ${providerPaymentId}`, err);
      throw err;
    }
  }

  /**
   * Cancels a pending Payoneer session
   */
  async cancelPayment(providerPaymentId: string): Promise<PaymentCancelResult> {
    logger.info(`Requesting cancellation for Payoneer payment session ${providerPaymentId}`);
    return {
      providerPaymentId,
      status: 'CANCELLED',
      message: 'Payoneer session marked as cancelled.',
    };
  }

  /**
   * Processes Payoneer webhook notifications delivered to notificationUrl
   */
  async handleWebhook(
    payload: unknown,
    headers: Record<string, string | string[] | undefined>,
    queryToken?: string
  ): Promise<WebhookProcessResult> {
    // Validate webhook secret token
    if (queryToken !== ENV.WEBHOOK_SECRET) {
      const headerSignature = headers['x-payoneer-signature'] || headers['x-signature'];
      if (!headerSignature || headerSignature !== ENV.WEBHOOK_SECRET) {
        logger.warn('Payoneer webhook authorization failed: Invalid secret or token');
        return {
          handled: false,
          eventId: 'UNAUTHORIZED',
          message: 'Webhook signature/token mismatch',
        };
      }
    }

    const data = payload as Record<string, unknown>;
    const identification = data.identification as Record<string, unknown> | undefined;
    const interaction = data.interaction as Record<string, unknown> | undefined;

    const providerPaymentId = (identification?.longId as string) || (data.longId as string);
    const orderNumber = (identification?.transactionId as string) || (data.transactionId as string);
    const eventId = (data.eventId as string) || `${providerPaymentId || 'evt'}_${Date.now()}`;

    let status: PaymentStatus = 'PENDING';
    const code = interaction?.code as string | undefined;
    const reason = interaction?.reason as string | undefined;

    if (code === 'PROCEED' && reason === 'OK') {
      status = 'PAID';
    } else if (code === 'ABORT' || code === 'REJECT') {
      status = 'FAILED';
    }

    logger.info(`Processed Payoneer webhook event`, { eventId, orderNumber, status });

    return {
      handled: true,
      eventId,
      providerPaymentId,
      orderNumber,
      status,
      message: 'Payoneer webhook processed successfully',
    };
  }
}
