import dotenv from 'dotenv';
import path from 'path';

// Load root or server .env
dotenv.config({ path: path.resolve(process.cwd(), '../.env') });
dotenv.config();

export const ENV = {
  PORT: parseInt(process.env.PORT || '5000', 10),
  NODE_ENV: process.env.NODE_ENV || 'development',
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:5173',
  API_BASE_URL: process.env.API_BASE_URL || 'http://localhost:5000',
  MONGODB_URI: process.env.MONGODB_URI || '',
  PAYMENT_MODE: (process.env.PAYMENT_MODE || 'mock').toLowerCase() as 'mock' | 'payoneer',
  
  // Official Payoneer Configuration
  PAYONEER: {
    IS_SANDBOX: process.env.PAYONEER_SANDBOX !== 'false',
    API_BASE_URL: process.env.PAYONEER_API_BASE_URL || 'https://api.sandbox.oscato.com/api/lists',
    MERCHANT_CODE: process.env.PAYONEER_MERCHANT_CODE || '',
    API_TOKEN: process.env.PAYONEER_API_TOKEN || '',
    DIVISION: process.env.PAYONEER_DIVISION || '',
  },

  WEBHOOK_SECRET: process.env.WEBHOOK_SECRET || 'payflow_default_webhook_secret_key',

  // Authentication & Internal Security
  JWT_SECRET: process.env.JWT_SECRET || 'payflow_secure_jwt_fintech_token_secret_key_2026',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '8h',

  // Internal Seed User Defaults
  OPERATIONS_ADMIN_EMAIL: process.env.OPERATIONS_ADMIN_EMAIL || 'ops@payflow.internal',
  OPERATIONS_ADMIN_PASSWORD: process.env.OPERATIONS_ADMIN_PASSWORD || 'PayFlowOps2026!',
  SANDBOX_ADMIN_EMAIL: process.env.SANDBOX_ADMIN_EMAIL || 'sandbox@payflow.internal',
  SANDBOX_ADMIN_PASSWORD: process.env.SANDBOX_ADMIN_PASSWORD || 'PayFlowSandbox2026!',
};
