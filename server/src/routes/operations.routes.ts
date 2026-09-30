import { Router } from 'express';
import {
  getOperationsStats,
  getOperationsOrders,
  getOperationsOrderDetails,
  getOperationsPayments,
  getOperationsTransactions,
  getOperationsWebhooks,
  addOrderOperationalNote,
  cancelOperationsOrder,
  retryOperationsPayment,
  getOperationsAuditLogs,
} from '../controllers/operations.controller';
import { authenticateUser, requireRole } from '../middleware/auth';

export const operationsRoutes = Router();

// All operations endpoints require authentication and either OPERATIONS or SANDBOX_ADMIN role
operationsRoutes.use(authenticateUser);
operationsRoutes.use(requireRole('OPERATIONS', 'SANDBOX_ADMIN'));

// Operations metrics & list endpoints
operationsRoutes.get('/stats', getOperationsStats);
operationsRoutes.get('/orders', getOperationsOrders);
operationsRoutes.get('/orders/:orderNumber', getOperationsOrderDetails);
operationsRoutes.get('/payments', getOperationsPayments);
operationsRoutes.get('/transactions', getOperationsTransactions);
operationsRoutes.get('/webhooks', getOperationsWebhooks);
operationsRoutes.get('/audit-logs', getOperationsAuditLogs);

// Operational actions
operationsRoutes.post('/orders/:orderNumber/notes', addOrderOperationalNote);
operationsRoutes.post('/orders/:orderNumber/cancel', cancelOperationsOrder);
operationsRoutes.post('/payments/:paymentId/retry', retryOperationsPayment);
