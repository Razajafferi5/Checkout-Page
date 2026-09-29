import { Router } from 'express';
import { createOrder, getOrderByNumber } from '../controllers/order.controller';
import { validateOrderInput } from '../middleware/validator';

const router = Router();

router.post('/', validateOrderInput, createOrder);
router.get('/:orderNumber', getOrderByNumber);

export default router;
