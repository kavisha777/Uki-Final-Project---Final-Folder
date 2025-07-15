import express from 'express';
import { createCheckoutSession, stripeWebhook,createRentCheckoutSession } from '../controllers/paymentController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/create-checkout-session', authMiddleware(), createCheckoutSession);
router.post('/create-rent-session', authMiddleware(), createRentCheckoutSession);

router.post('/webhook', stripeWebhook);


export default router;
