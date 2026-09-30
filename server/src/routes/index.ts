import { Router } from 'express';
import productRoutes from './product.routes';
import orderRoutes from './order.routes';
import paymentRoutes from './payment.routes';
import webhookRoutes from './webhook.routes';
import adminRoutes from './admin.routes';
import healthRoutes from './health.routes';

import { authRoutes } from './auth.routes';
import { operationsRoutes } from './operations.routes';
import { sandboxRoutes } from './sandbox.routes';

const router = Router();

router.use('/health', healthRoutes);
router.use('/auth', authRoutes);
router.use('/operations', operationsRoutes);
router.use('/sandbox', sandboxRoutes);
router.use('/products', productRoutes);
router.use('/orders', orderRoutes);
router.use('/payments', paymentRoutes);
router.use('/webhooks', webhookRoutes);
router.use('/admin', adminRoutes);

export default router;
