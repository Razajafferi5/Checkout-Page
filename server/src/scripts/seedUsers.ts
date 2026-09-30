import { connectDatabase } from '../config/database';
import { dataStore } from '../config/dataStore';
import { logger } from '../utils/logger';

export async function runUserSeed() {
  logger.info('Starting internal user provisioning script...');

  try {
    await connectDatabase();
    const { opsUser, sandboxUser } = await dataStore.seedUsers();

    logger.info('====================================================');
    logger.info('  PAYFLOW INTERNAL USER SEED COMPLETED SUCCESSFULLY  ');
    logger.info('====================================================');
    logger.info(`[OPERATIONS USER]:    ${opsUser.email} (Role: ${opsUser.role})`);
    logger.info(`[SANDBOX ADMIN USER]: ${sandboxUser.email} (Role: ${sandboxUser.role})`);
    logger.info('Status: ACTIVE');
    logger.info('====================================================');
  } catch (err) {
    logger.error('Failed to provision internal users', err);
    process.exit(1);
  }
}

if (require.main === module) {
  runUserSeed().then(() => process.exit(0));
}
