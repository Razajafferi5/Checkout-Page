import { Router, Request, Response } from 'express';
import mongoose from 'mongoose';
import { ENV } from '../config/env';

const router = Router();

router.get('/', (_req: Request, res: Response) => {
  const dbState = mongoose.connection.readyState;
  const dbStatusMap: Record<number, string> = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
  };

  res.json({
    success: true,
    data: {
      status: 'UP',
      timestamp: new Date().toISOString(),
      database: dbStatusMap[dbState] || 'unknown',
      paymentMode: ENV.PAYMENT_MODE,
      version: '1.0.0',
    },
  });
});

export default router;
