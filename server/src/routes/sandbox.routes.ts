import { Router } from 'express';
import {
  getSandboxStatus,
  getSandboxTransactions,
  runPaymentScenario,
  triggerTestWebhook,
  replayWebhookEvent,
} from '../controllers/sandbox.controller';
import { authenticateUser, requireRole } from '../middleware/auth';

export const sandboxRoutes = Router();

// All sandbox endpoints require authentication and SANDBOX_ADMIN role
sandboxRoutes.use(authenticateUser);
sandboxRoutes.use(requireRole('SANDBOX_ADMIN'));

// Sandbox Status & Transactions
sandboxRoutes.get('/status', getSandboxStatus);
sandboxRoutes.get('/transactions', getSandboxTransactions);

// Payment Scenario Lab
sandboxRoutes.post('/payment-scenarios', runPaymentScenario);

// Webhook Lab & Idempotency Testing
sandboxRoutes.post('/webhooks/test', triggerTestWebhook);
sandboxRoutes.post('/webhooks/replay', replayWebhookEvent);
