import express from 'express';
import { createPaymentIntent, verifyPayment, createBookingAfterPayment } from '../controllers/PaymentController.js';

const paymentRouter = express.Router();

// Create payment intent
paymentRouter.post('/create-payment-intent', createPaymentIntent);

// Verify payment
paymentRouter.post('/verify-payment', verifyPayment);

// Create booking after payment
paymentRouter.post('/create-booking-after-payment', createBookingAfterPayment);

export default paymentRouter;
