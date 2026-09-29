import mongoose, { Schema, Document, Types } from 'mongoose';
import { PaymentStatus } from './Order';

export type PaymentProviderType = 'mock' | 'payoneer';

export interface IPayment extends Document {
  orderId: Types.ObjectId;
  orderNumber: string;
  provider: PaymentProviderType;
  providerPaymentId: string;
  providerReference?: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  failureReason?: string;
  metadata?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

const PaymentSchema = new Schema<IPayment>(
  {
    orderId: { type: Schema.Types.ObjectId, ref: 'Order', required: true, index: true },
    orderNumber: { type: String, required: true, index: true },
    provider: { type: String, enum: ['mock', 'payoneer'], required: true, index: true },
    providerPaymentId: { type: String, required: true, unique: true, index: true },
    providerReference: { type: String, index: true },
    amount: { type: Number, required: true, min: 0 },
    currency: { type: String, required: true, default: 'USD', uppercase: true },
    status: {
      type: String,
      enum: ['PENDING', 'PROCESSING', 'PAID', 'FAILED', 'CANCELLED', 'EXPIRED', 'REFUNDED'],
      default: 'PENDING',
      index: true,
    },
    failureReason: { type: String },
    metadata: { type: Schema.Types.Mixed },
  },
  { timestamps: true }
);

export const Payment = mongoose.model<IPayment>('Payment', PaymentSchema);
