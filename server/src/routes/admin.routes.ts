import { Router } from 'express';
import {
  getAdminStats,
  getAdminPayments,
  getAdminOrders,
  triggerSeed,
} from '../controllers/admin.controller';

const router = Router();

router.get('/stats', getAdminStats);
router.get('/payments', getAdminPayments);
router.get('/orders', getAdminOrders);
router.post('/seed', triggerSeed);

export default router;
