import mongoose, { Schema, Document } from 'mongoose';
import { UserRole } from './User';

export type AuditAction =
  | 'LOGIN'
  | 'LOGOUT'
  | 'VIEW_ORDERS'
  | 'VIEW_ORDER_DETAILS'
  | 'VIEW_PAYMENTS'
  | 'VIEW_TRANSACTIONS'
  | 'VIEW_WEBHOOKS'
  | 'CANCEL_ORDER'
  | 'RETRY_PAYMENT'
  | 'ADD_OPERATIONAL_NOTE'
  | 'RUN_PAYMENT_SCENARIO'
  | 'TRIGGER_TEST_WEBHOOK'
  | 'REPLAY_WEBHOOK'
  | 'VIEW_SANDBOX_STATUS';

export interface IAuditLog extends Document {
  userId?: string;
  userEmail: string;
  userRole: UserRole;
  action: AuditAction;
  resource?: string;
  ip?: string;
  result: 'SUCCESS' | 'FAILURE';
  details?: Record<string, unknown>;
  createdAt: Date;
}

const AuditLogSchema = new Schema<IAuditLog>(
  {
    userId: { type: String, index: true },
    userEmail: { type: String, required: true, index: true },
    userRole: { type: String, enum: ['OPERATIONS', 'SANDBOX_ADMIN'], required: true, index: true },
    action: { type: String, required: true, index: true },
    resource: { type: String, index: true },
    ip: { type: String },
    result: { type: String, enum: ['SUCCESS', 'FAILURE'], required: true, index: true },
    details: { type: Schema.Types.Mixed },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const AuditLog = mongoose.model<IAuditLog>('AuditLog', AuditLogSchema);
