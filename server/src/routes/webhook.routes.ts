import { Router } from 'express';
import { handlePayoneerWebhook } from '../controllers/webhook.controller';

const router = Router();

// Payoneer webhook notification endpoint
router.post('/payoneer', handlePayoneerWebhook);

export default router;
