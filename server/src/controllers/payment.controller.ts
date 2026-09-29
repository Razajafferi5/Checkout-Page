import { Request, Response, NextFunction } from 'express';
import { paymentService } from '../services/payment/payment.service';
import { Payment } from '../models/Payment';
import { AppError } from '../middleware/errorHandler';
import { PaymentStatus } from '../models/Order';

export async function createPayment(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { orderId } = req.body;

    if (!orderId) {
      throw new AppError('Order ID is required to initiate payment.', 400, 'MISSING_ORDER_ID');
    }

    const { payment, redirectUrl } = await paymentService.createPayment(orderId);

    res.status(201).json({
      success: true,
      data: {
        paymentId: payment._id,
        orderNumber: payment.orderNumber,
        provider: payment.provider,
        providerPaymentId: payment.providerPaymentId,
        redirectUrl,
        amount: payment.amount,
        currency: payment.currency,
        status: payment.status,
      },
    });
  } catch (err) {
    next(err);
  }
}

export async function getPaymentStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;
    const payment = await paymentService.verifyPayment(id);

    res.json({
      success: true,
      data: payment,
    });
  } catch (err) {
    next(err);
  }
}

export async function cancelPayment(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;
    const payment = await paymentService.cancelPayment(id);

    res.json({
      success: true,
      data: payment,
    });
  } catch (err) {
    next(err);
  }
}

export async function simulateMockAction(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { paymentId, action, reason } = req.body;

    if (!paymentId || !action) {
      throw new AppError('paymentId and action are required.', 400, 'INVALID_SIMULATION_PARAMS');
    }

    const validActions: PaymentStatus[] = ['PAID', 'FAILED', 'CANCELLED', 'PENDING'];
    if (!validActions.includes(action as PaymentStatus)) {
      throw new AppError(
        `Invalid action: ${action}. Must be one of: ${validActions.join(', ')}`,
        400,
        'INVALID_SIMULATION_ACTION'
      );
    }

    const payment = await paymentService.simulateMockAction(
      paymentId,
      action as PaymentStatus,
      reason || (action === 'FAILED' ? 'Simulated card decline (test mode)' : undefined)
    );

    res.json({
      success: true,
      data: payment,
    });
  } catch (err) {
    next(err);
  }
}
