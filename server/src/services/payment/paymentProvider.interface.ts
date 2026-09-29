import { IOrder, PaymentStatus } from '../../models/Order';

export interface PaymentSessionResult {
  provider: 'mock' | 'payoneer';
  providerPaymentId: string;
  providerReference?: string;
  redirectUrl: string;
  status: PaymentStatus;
  rawResponse?: Record<string, unknown>;
}

export interface PaymentVerificationResult {
  providerPaymentId: string;
  status: PaymentStatus;
  paidAmount?: number;
  currency?: string;
  providerReference?: string;
  failureReason?: string;
  rawResponse?: Record<string, unknown>;
}

export interface PaymentCancelResult {
  providerPaymentId: string;
  status: PaymentStatus;
  message: string;
}

export interface WebhookProcessResult {
  handled: boolean;
  eventId: string;
  providerPaymentId?: string;
  orderNumber?: string;
  status?: PaymentStatus;
  message?: string;
}

export interface IPaymentProvider {
  readonly providerName: 'mock' | 'payoneer';
  createPayment(order: IOrder): Promise<PaymentSessionResult>;
  getPaymentStatus(providerPaymentId: string): Promise<PaymentVerificationResult>;
  cancelPayment(providerPaymentId: string): Promise<PaymentCancelResult>;
  handleWebhook(payload: unknown, headers: Record<string, string | string[] | undefined>, queryToken?: string): Promise<WebhookProcessResult>;
}
