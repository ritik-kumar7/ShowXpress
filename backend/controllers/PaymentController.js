import Stripe from 'stripe';
import dotenv from 'dotenv';

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Create payment intent
export const createPaymentIntent = async (req, res) => {
    try {
        const { amount, bookingDetails } = req.body;

        // Create a PaymentIntent with the order amount and currency
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(amount * 100), // Stripe expects amount in cents/paise
            currency: 'inr',
            automatic_payment_methods: {
                enabled: true,
                allow_redirects: 'always'
            },
            metadata: {
                userId: bookingDetails.userId,
                showId: bookingDetails.showId,
                seats: JSON.stringify(bookingDetails.seats),
            },
        });

        res.status(200).json({
            success: true,
            clientSecret: paymentIntent.client_secret,
            paymentIntentId: paymentIntent.id,
        });
    } catch (error) {
        console.error('Error creating payment intent:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create payment intent',
            error: error.message,
        });
    }
};

// Verify payment status
export const verifyPayment = async (req, res) => {
    try {
        const { paymentIntentId } = req.body;

        const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

        if (paymentIntent.status === 'succeeded') {
            res.status(200).json({
                success: true,
                message: 'Payment verified successfully',
                paymentIntent,
            });
        } else {
            res.status(400).json({
                success: false,
                message: 'Payment not completed',
                status: paymentIntent.status,
            });
        }
    } catch (error) {
        console.error('Error verifying payment:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to verify payment',
            error: error.message,
        });
    }
};

// Create booking after successful payment
export const createBookingAfterPayment = async (req, res) => {
    try {
        const { paymentIntentId, bookingData } = req.body;

        // Verify payment first
        const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

        if (paymentIntent.status !== 'succeeded') {
            return res.status(400).json({
                success: false,
                message: 'Payment not completed',
            });
        }

        // Payment verified, proceed with booking
        // This will be handled by the booking controller
        res.status(200).json({
            success: true,
            message: 'Payment verified, proceed with booking',
            paymentIntent,
        });
    } catch (error) {
        console.error('Error in payment verification:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to process payment',
            error: error.message,
        });
    }
};
