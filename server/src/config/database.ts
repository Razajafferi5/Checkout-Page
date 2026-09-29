import mongoose from 'mongoose';
import { ENV } from './env';
import { logger } from '../utils/logger';
import { initInMemoryData } from './dataStore';

export async function connectDatabase(): Promise<typeof mongoose | null> {
  const uri = ENV.MONGODB_URI;

  if (uri && uri.trim().length > 0) {
    try {
      logger.info(`Connecting to configured MongoDB URI: ${uri.replace(/\/\/([^:]+):([^@]+)@/, '//$1:***@')}`);
      const conn = await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 3000,
      });
      logger.info(`MongoDB connected successfully: ${conn.connection.host}/${conn.connection.name}`);
      return conn;
    } catch (err) {
      logger.warn(
        'Could not connect to external MongoDB URI. Automatically switching to PayFlow fast in-memory persistence store.',
        { error: (err as Error).message }
      );
    }
  } else {
    logger.info('No external MONGODB_URI configured. Starting PayFlow fast in-memory persistence store.');
  }

  // Initialize in-memory store
  initInMemoryData();
  logger.info('PayFlow in-memory data store initialized with pre-seeded product catalog.');
  return null;
}

export async function disconnectDatabase(): Promise<void> {
  if (mongoose.connection.readyState === 1) {
    await mongoose.disconnect();
  }
}
