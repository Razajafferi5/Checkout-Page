import { createApp } from './app';
import { connectDatabase } from './config/database';
import { dataStore } from './config/dataStore';
import { ENV } from './config/env';
import { logger } from './utils/logger';

async function bootstrap() {
  try {
    logger.info('Starting PayFlow Backend Server...');
    await connectDatabase();

    // Ensure catalog products are initialized
    const products = await dataStore.getAllProducts();
    if (products.length === 0) {
      logger.info('Initializing catalog with sample products...');
      await dataStore.seedProducts();
    }

    const app = createApp();

    const server = app.listen(ENV.PORT, () => {
      logger.info(`PayFlow Server running on port ${ENV.PORT} [Environment: ${ENV.NODE_ENV}]`);
      logger.info(`Payment Provider Mode: ${ENV.PAYMENT_MODE.toUpperCase()}`);
      if (ENV.PAYMENT_MODE === 'payoneer') {
        logger.info(`Payoneer Sandbox: ${ENV.PAYONEER.IS_SANDBOX ? 'ENABLED' : 'LIVE PRODUCTION'}`);
        logger.info(`Payoneer Merchant Code: ${ENV.PAYONEER.MERCHANT_CODE || 'NOT CONFIGURED'}`);
      } else {
        logger.info('Running in isolated MOCK SANDBOX mode for rapid offline testing & demo.');
      }
    });

    const shutdown = async (signal: string) => {
      logger.info(`Received ${signal}. Gracefully closing HTTP server...`);
      server.close(() => {
        logger.info('HTTP server closed.');
        process.exit(0);
      });
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
  } catch (err) {
    logger.error('Fatal server bootstrap failure', err);
    process.exit(1);
  }
}

bootstrap();
