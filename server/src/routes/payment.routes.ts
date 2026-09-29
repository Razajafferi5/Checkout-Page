import { Router } from 'express';
import {
  createPayment,
  getPaymentStatus,
  cancelPayment,
  simulateMockAction,
} from '../controllers/payment.controller';

const router = Router();

router.post('/create', createPayment);
router.get('/:id', getPaymentStatus);
router.post('/:id/cancel', cancelPayment);
router.post('/mock-action', simulateMockAction);

export default router;
