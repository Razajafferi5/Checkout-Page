import { Request, Response, NextFunction } from 'express';
import { dataStore } from '../config/dataStore';
import { paymentService } from '../services/payment/payment.service';
import { logAuditEvent } from '../middleware/auth';
import { logger } from '../utils/logger';

export async function getOperationsStats(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const stats = await dataStore.getPaymentStats();

    await logAuditEvent(req, 'VIEW_ORDERS', 'operations_stats', 'SUCCESS');

    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (err) {
    logger.error('Failed to get operations stats', err);
    next(err);
  }
}

export async function getOperationsOrders(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const limit = parseInt(req.query.limit as string, 10) || 50;
    const skip = parseInt(req.query.skip as string, 10) || 0;
    const status = req.query.status as string;
    const search = req.query.search as string;

    const { orders, total } = await dataStore.getAllOrders(status, search, skip, limit);

    await logAuditEvent(req, 'VIEW_ORDERS', 'operations_orders_list', 'SUCCESS', { total, limit, skip });

    res.status(200).json({
      success: true,
      data: {
        orders,
        total,
        limit,
        skip,
      },
    });
  } catch (err) {
    logger.error('Failed to get operations orders', err);
    next(err);
  }
}

export async function getOperationsOrderDetails(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { orderNumber } = req.params;
    const order = await dataStore.getOrderByNumber(orderNumber);

    if (!order) {
      res.status(404).json({
        success: false,
        error: { code: 'ORDER_NOT_FOUND', message: `Order ${orderNumber} not found.` },
      });
      return;
    }

    const payment = await dataStore.getPaymentByOrderId(order._id.toString());

    await logAuditEvent(req, 'VIEW_ORDER_DETAILS', orderNumber, 'SUCCESS');

    res.status(200).json({
      success: true,
      data: {
        order,
        payment,
      },
    });
  } catch (err) {
    logger.error(`Failed to get order details for ${req.params.orderNumber}`, err);
    next(err);
  }
}

export async function getOperationsPayments(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const limit = parseInt(req.query.limit as string, 10) || 50;
    const skip = parseInt(req.query.skip as string, 10) || 0;
    const status = req.query.status as string;
    const search = req.query.search as string;

    const { payments, total } = await dataStore.getAllPayments(status, search, skip, limit);

    await logAuditEvent(req, 'VIEW_PAYMENTS', 'operations_payments_list', 'SUCCESS', { total });

    res.status(200).json({
      success: true,
      data: {
        payments,
        total,
        limit,
        skip,
      },
    });
  } catch (err) {
    logger.error('Failed to get operations payments', err);
    next(err);
  }
}

export async function getOperationsTransactions(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const limit = parseInt(req.query.limit as string, 10) || 50;
    const skip = parseInt(req.query.skip as string, 10) || 0;
    const search = req.query.search as string;

    const { payments, total } = await dataStore.getAllPayments(undefined, search, skip, limit);

    // Map unified transactions
    const transactions = await Promise.all(
      payments.map(async p => {
        const order = await dataStore.getOrderByNumber(p.orderNumber);
        return {
          id: p._id,
          orderId: p.orderId,
          orderNumber: p.orderNumber,
          customerName: order ? `${order.customer.firstName} ${order.customer.lastName}` : 'Customer',
          customerEmail: order ? order.customer.email : 'N/A',
          amount: p.amount,
          currency: p.currency,
          provider: p.provider,
          providerPaymentId: p.providerPaymentId,
          providerReference: p.providerReference,
          paymentStatus: p.status,
          orderStatus: order ? order.status : 'UNKNOWN',
          createdAt: p.createdAt,
          updatedAt: p.updatedAt,
          failureReason: p.failureReason,
        };
      })
    );

    await logAuditEvent(req, 'VIEW_TRANSACTIONS', 'operations_transactions_list', 'SUCCESS', { total });

    res.status(200).json({
      success: true,
      data: {
        transactions,
        total,
        limit,
        skip,
      },
    });
  } catch (err) {
    logger.error('Failed to get operations transactions', err);
    next(err);
  }
}

export async function getOperationsWebhooks(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const limit = parseInt(req.query.limit as string, 10) || 50;
    const skip = parseInt(req.query.skip as string, 10) || 0;

    const { events, total } = await dataStore.getAllWebhookEvents(limit, skip);

    await logAuditEvent(req, 'VIEW_WEBHOOKS', 'operations_webhooks_list', 'SUCCESS', { total });

    res.status(200).json({
      success: true,
      data: {
        events,
        total,
        limit,
        skip,
      },
    });
  } catch (err) {
    logger.error('Failed to get operations webhooks', err);
    next(err);
  }
}

export async function addOrderOperationalNote(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { orderNumber } = req.params;
    const { note } = req.body;

    if (!note || !note.trim()) {
      res.status(400).json({
        success: false,
        error: { code: 'INVALID_NOTE', message: 'Note text is required.' },
      });
      return;
    }

    const author = req.user ? `${req.user.firstName} ${req.user.lastName} (${req.user.role})` : 'Operations';
    const updatedOrder = await dataStore.addOrderNote(orderNumber, note.trim(), author);

    if (!updatedOrder) {
      res.status(404).json({
        success: false,
        error: { code: 'ORDER_NOT_FOUND', message: `Order ${orderNumber} not found.` },
      });
      return;
    }

    await logAuditEvent(req, 'ADD_OPERATIONAL_NOTE', orderNumber, 'SUCCESS', { note });

    res.status(200).json({
      success: true,
      data: {
        order: updatedOrder,
        message: 'Operational note recorded.',
      },
    });
  } catch (err) {
    logger.error(`Failed to add note to order ${req.params.orderNumber}`, err);
    next(err);
  }
}

export async function cancelOperationsOrder(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { orderNumber } = req.params;
    const { reason } = req.body;

    const order = await dataStore.getOrderByNumber(orderNumber);
    if (!order) {
      res.status(404).json({
        success: false,
        error: { code: 'ORDER_NOT_FOUND', message: `Order ${orderNumber} not found.` },
      });
      return;
    }

    if (order.status === 'COMPLETED' || order.paymentStatus === 'PAID') {
      res.status(400).json({
        success: false,
        error: { code: 'ORDER_ALREADY_PAID', message: 'Cannot cancel an already completed and paid order.' },
      });
      return;
    }

    const payment = await dataStore.getPaymentByOrderId(order._id.toString());
    if (payment) {
      await paymentService.cancelPayment(payment.providerPaymentId);
    } else {
      order.status = 'CANCELLED';
      order.paymentStatus = 'CANCELLED';
      await dataStore.createOrder(order);
    }

    // Add note and timeline
    const author = req.user ? `${req.user.firstName} (${req.user.role})` : 'Operations';
    await dataStore.addOrderNote(orderNumber, `Cancelled by ${author}. Reason: ${reason || 'Customer request'}`, author);
    await dataStore.addOrderTimeline(orderNumber, {
      title: 'Order Cancelled',
      description: `Cancelled via Operations Console. ${reason ? `Reason: ${reason}` : ''}`,
      timestamp: new Date(),
      state: 'failure',
    });

    await logAuditEvent(req, 'CANCEL_ORDER', orderNumber, 'SUCCESS', { reason });

    const freshOrder = await dataStore.getOrderByNumber(orderNumber);
    res.status(200).json({
      success: true,
      data: {
        order: freshOrder,
        message: `Order ${orderNumber} cancelled successfully.`,
      },
    });
  } catch (err) {
    logger.error(`Failed to cancel order ${req.params.orderNumber}`, err);
    next(err);
  }
}

export async function retryOperationsPayment(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { paymentId } = req.params;
    const payment = await dataStore.getPaymentByIdOrProviderId(paymentId);

    if (!payment) {
      res.status(404).json({
        success: false,
        error: { code: 'PAYMENT_NOT_FOUND', message: `Payment ${paymentId} not found.` },
      });
      return;
    }

    if (payment.status === 'PAID') {
      res.status(400).json({
        success: false,
        error: { code: 'ALREADY_PAID', message: 'Payment is already paid and completed.' },
      });
      return;
    }

    // Transition back to PENDING for re-initiation
    payment.status = 'PENDING';
    payment.failureReason = undefined;
    await dataStore.updatePayment(payment);
    await dataStore.updateOrderStatus(payment.orderNumber, 'PENDING_PAYMENT', 'PENDING');

    await dataStore.addPaymentTimeline(payment.providerPaymentId, {
      title: 'Payment Re-queued for Handshake',
      description: 'Operations user initiated payment handshake retry.',
      timestamp: new Date(),
      state: 'processing',
    });

    await logAuditEvent(req, 'RETRY_PAYMENT', payment.providerPaymentId, 'SUCCESS');

    res.status(200).json({
      success: true,
      data: {
        payment,
        message: 'Payment retry initiated.',
      },
    });
  } catch (err) {
    logger.error(`Failed to retry payment ${req.params.paymentId}`, err);
    next(err);
  }
}

export async function getOperationsAuditLogs(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const limit = parseInt(req.query.limit as string, 10) || 50;
    const skip = parseInt(req.query.skip as string, 10) || 0;

    const { logs, total } = await dataStore.getAuditLogs(limit, skip);

    res.status(200).json({
      success: true,
      data: {
        logs,
        total,
        limit,
        skip,
      },
    });
  } catch (err) {
    logger.error('Failed to get audit logs', err);
    next(err);
  }
}
