import { Request, Response, NextFunction } from 'express';
import { dataStore } from '../config/dataStore';
import { ENV } from '../config/env';

export async function getAdminStats(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const stats = await dataStore.getPaymentStats();

    res.json({
      success: true,
      data: {
        ...stats,
        paymentMode: ENV.PAYMENT_MODE,
        payoneerConfigured: Boolean(
          ENV.PAYONEER.MERCHANT_CODE &&
          ENV.PAYONEER.API_TOKEN &&
          ENV.PAYONEER.MERCHANT_CODE !== 'YOUR_SANDBOX_MERCHANT_CODE'
        ),
      },
    });
  } catch (err) {
    next(err);
  }
}

export async function getAdminPayments(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { status, search, limit = '50', page = '1' } = req.query;

    const pageSize = parseInt(limit as string, 10);
    const currentPage = parseInt(page as string, 10);
    const skip = (currentPage - 1) * pageSize;

    const { payments, total } = await dataStore.getAllPayments(
      status as string,
      search as string,
      skip,
      pageSize
    );

    res.json({
      success: true,
      data: {
        payments,
        total,
        page: currentPage,
        totalPages: Math.ceil(total / pageSize) || 1,
      },
    });
  } catch (err) {
    next(err);
  }
}

export async function getAdminOrders(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { status, search, limit = '50', page = '1' } = req.query;

    const pageSize = parseInt(limit as string, 10);
    const currentPage = parseInt(page as string, 10);
    const skip = (currentPage - 1) * pageSize;

    const { orders, total } = await dataStore.getAllOrders(
      status as string,
      search as string,
      skip,
      pageSize
    );

    res.json({
      success: true,
      data: {
        orders,
        total,
        page: currentPage,
        totalPages: Math.ceil(total / pageSize) || 1,
      },
    });
  } catch (err) {
    next(err);
  }
}

export async function triggerSeed(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    await dataStore.seedProducts();
    res.json({
      success: true,
      data: {
        message: 'Database seeded successfully with sample products.',
      },
    });
  } catch (err) {
    next(err);
  }
}
