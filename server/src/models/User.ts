import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export type UserRole = 'OPERATIONS' | 'SANDBOX_ADMIN';

export type Permission =
  | 'VIEW_ORDERS'
  | 'VIEW_PAYMENTS'
  | 'VIEW_TRANSACTIONS'
  | 'VIEW_WEBHOOKS'
  | 'VIEW_CUSTOMERS'
  | 'RETRY_PAYMENT'
  | 'CANCEL_ORDER'
  | 'ADD_NOTE'
  | 'RUN_PAYMENT_TEST'
  | 'RUN_WEBHOOK_TEST'
  | 'REPLAY_WEBHOOK'
  | 'VIEW_SANDBOX_STATUS'
  | 'RUN_MOCK_SCENARIOS';

export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  OPERATIONS: [
    'VIEW_ORDERS',
    'VIEW_PAYMENTS',
    'VIEW_TRANSACTIONS',
    'VIEW_WEBHOOKS',
    'VIEW_CUSTOMERS',
    'RETRY_PAYMENT',
    'CANCEL_ORDER',
    'ADD_NOTE',
  ],
  SANDBOX_ADMIN: [
    'VIEW_ORDERS',
    'VIEW_PAYMENTS',
    'VIEW_TRANSACTIONS',
    'VIEW_WEBHOOKS',
    'RUN_PAYMENT_TEST',
    'RUN_WEBHOOK_TEST',
    'REPLAY_WEBHOOK',
    'VIEW_SANDBOX_STATUS',
    'RUN_MOCK_SCENARIOS',
  ],
};

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  active: boolean;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    passwordHash: { type: String, required: true },
    role: {
      type: String,
      enum: ['OPERATIONS', 'SANDBOX_ADMIN'],
      required: true,
      default: 'OPERATIONS',
      index: true,
    },
    active: { type: Boolean, default: true, index: true },
    lastLogin: { type: Date },
  },
  { timestamps: true }
);

// Method to verify password
UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.passwordHash);
};

// Helper to hash password
export async function hashPassword(plainText: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(plainText, salt);
}

export const User = mongoose.model<IUser>('User', UserSchema);
