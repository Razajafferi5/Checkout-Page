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
};
