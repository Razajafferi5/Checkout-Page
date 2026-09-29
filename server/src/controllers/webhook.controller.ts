import { Request, Response, NextFunction } from 'express';
import { paymentService } from '../services/payment/payment.service';
import { logger } from '../utils/logger';

export async function handlePayoneerWebhook(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const queryToken = typeof req.query.token === 'string' ? req.query.token : undefined;

    logger.info('Incoming Payoneer webhook notification received', {
      headers: req.headers,
      queryTokenPresent: Boolean(queryToken),
    });

    const result = await paymentService.handleWebhookNotification(
      req.body,
      req.headers as Record<string, string | string[] | undefined>,
      queryToken
    );

    if (!result.success) {
      res.status(401).json({
        success: false,
        error: {
          code: 'WEBHOOK_VERIFICATION_FAILED',
          message: result.message,
        },
      });
      return;
    }

    // Always acknowledge with 200 OK so Payoneer doesn't repeatedly retry
    res.status(200).json({
      success: true,
      data: {
        message: result.message,
        duplicate: result.duplicate || false,
      },
    });
  } catch (err) {
    logger.error('Failed to process Payoneer webhook', err);
    next(err);
  }
}
