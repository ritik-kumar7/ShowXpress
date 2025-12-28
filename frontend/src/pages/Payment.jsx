import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { paymentAPI, bookingAPI, userAPI } from '../lib/api';
import { useUser } from '@clerk/clerk-react';
import { ArrowLeft, CreditCard, Lock, Check, AlertCircle, Ticket } from 'lucide-react';
import toast from 'react-hot-toast';
import { generateTicketReceipt } from '../lib/receiptGenerator';
import './Payment.css';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const CheckoutForm = ({ bookingDetails, onSuccess }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [processing, setProcessing] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        setProcessing(true);
        setErrorMessage('');

        try {
            const { error, paymentIntent } = await stripe.confirmPayment({
                elements,
                redirect: 'if_required',
            });

            if (error) {
                setErrorMessage(error.message);
                toast.error(error.message);
                setProcessing(false);
            } else if (paymentIntent && paymentIntent.status === 'succeeded') {
                // Payment successful, create booking
                await onSuccess(paymentIntent.id);
            }
        } catch (err) {
            setErrorMessage('Payment failed. Please try again.');
            toast.error('Payment failed. Please try again.');
            setProcessing(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="payment-form-card">
                <div className="payment-card-header">
                    <div className="payment-icon-wrapper">
                        <CreditCard />
                    </div>
                    <div>
                        <h3 className="payment-card-title">Payment Details</h3>
                        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
                            Choose your preferred payment method
                        </p>
                    </div>
                </div>

                {/* Payment Method Icons */}
                <div style={{
                    display: 'flex',
                    gap: '1rem',
                    marginBottom: '1.5rem',
                    padding: '1rem',
                    background: 'rgba(248, 69, 101, 0.05)',
                    borderRadius: '12px',
                    border: '1px solid rgba(248, 69, 101, 0.1)'
                }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        color: 'rgba(255,255,255,0.8)',
                        fontSize: '0.85rem',
                        fontWeight: '600'
                    }}>
                        <span>💳</span> Cards
                    </div>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        color: 'rgba(255,255,255,0.8)',
                        fontSize: '0.85rem',
                        fontWeight: '600'
                    }}>
                        <span>📱</span> UPI
                    </div>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        color: 'rgba(255,255,255,0.8)',
                        fontSize: '0.85rem',
                        fontWeight: '600'
                    }}>
                        <span>🏦</span> Net Banking
                    </div>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        color: 'rgba(255,255,255,0.8)',
                        fontSize: '0.85rem',
                        fontWeight: '600'
                    }}>
                        <span>💰</span> Wallets
                    </div>
                </div>

                <div className="stripe-elements-container">
                    <PaymentElement
                        options={{
                            layout: {
                                type: 'tabs',
                                defaultCollapsed: false,
                            }
                        }}
                    />
                </div>

                {errorMessage && (
                    <div className="payment-error">
                        <AlertCircle className="payment-error-icon" />
                        <p className="payment-error-text">{errorMessage}</p>
                    </div>
                )}

                <button
                    type="submit"
                    disabled={!stripe || processing}
                    className="payment-submit-btn"
                >
                    {processing ? (
                        <>
                            <div className="payment-spinner"></div>
                            <span>Processing Payment...</span>
                        </>
                    ) : (
                        <>
                            <Lock size={20} />
                            <span>Pay ₹{bookingDetails.totalAmount}</span>
                        </>
                    )}
                </button>

                <div className="payment-secure-badge">
                    <Lock size={18} />
                    <span>Secured by Stripe • 256-bit SSL Encryption</span>
                </div>
            </div>
        </form>
    );
};

const Payment = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useUser();
    const [clientSecret, setClientSecret] = useState('');
    const [loading, setLoading] = useState(true);
    const [bookingSuccess, setBookingSuccess] = useState(false);
    const bookingDetails = location.state?.bookingDetails;

    useEffect(() => {
        if (!bookingDetails) {
            toast.error('No booking details found');
            navigate('/');
            return;
        }

        createPaymentIntent();
    }, []);

    const createPaymentIntent = async () => {
        try {
            const response = await paymentAPI.createPaymentIntent(
                bookingDetails.totalAmount,
                {
                    userId: bookingDetails.userId,
                    showId: bookingDetails.showId,
                    seats: bookingDetails.seats,
                }
            );

            if (response.success) {
                setClientSecret(response.clientSecret);
            } else {
                toast.error('Failed to initialize payment');
                navigate(-1);
            }
        } catch (error) {
            toast.error('Failed to initialize payment');
            navigate(-1);
        } finally {
            setLoading(false);
        }
    };

    const handlePaymentSuccess = async (paymentIntentId) => {
        try {
            // Create or update user in backend
            await userAPI.createUser({
                clerkId: user.id,
                name: user.fullName || user.firstName + ' ' + user.lastName,
                email: user.emailAddresses[0].emailAddress,
                image: user.imageUrl,
            });

            // Create booking with payment intent ID
            const bookingData = {
                userId: bookingDetails.userId,
                showId: bookingDetails.showId,
                seats: bookingDetails.seats,
                paymentIntentId: paymentIntentId,
            };

            const response = await bookingAPI.createBooking(bookingData);

            if (response.success) {
                // Store payment intent ID in booking details for receipt
                bookingDetails.paymentIntentId = paymentIntentId;
                bookingDetails.bookingId = response.data._id;

                setBookingSuccess(true);
                toast.success('Payment successful! Booking confirmed!');
                setTimeout(() => {
                    navigate('/my-booking');
                }, 5000); // 5 seconds - gives time to download receipt
            } else {
                toast.error(response.message || 'Booking failed');
            }
        } catch (error) {
            toast.error('Booking failed. Please contact support.');
        }
    };

    if (loading) {
        return (
            <div className="payment-loading">
                <div className="loading-spinner"></div>
            </div>
        );
    }

    if (bookingSuccess) {
        return (
            <div className="payment-success">
                <div className="success-content">
                    <div className="success-icon-wrapper">
                        <Check />
                    </div>
                    <h2 className="success-title">Payment Successful!</h2>
                    <p className="success-message">
                        Your booking has been confirmed. You will receive a confirmation email shortly.
                    </p>

                    {/* Download Receipt Button */}
                    <button
                        onClick={() => {
                            try {
                                generateTicketReceipt({
                                    bookingId: bookingDetails.bookingId || `BK${Date.now()}`,
                                    bookingDate: new Date().toISOString(),
                                    movieTitle: bookingDetails.movieTitle,
                                    theater: bookingDetails.theater,
                                    showDate: bookingDetails.showDateTime.split(' ')[0] + ' ' + bookingDetails.showDateTime.split(' ')[1] + ' ' + bookingDetails.showDateTime.split(' ')[2],
                                    showTime: bookingDetails.showDateTime.split(' ').slice(-2).join(' '),
                                    seats: bookingDetails.seats,
                                    totalAmount: bookingDetails.totalAmount,
                                    paymentMethod: 'Card',
                                    transactionId: bookingDetails.paymentIntentId
                                });
                                toast.success('Receipt downloaded!');
                            } catch (error) {
                                console.error('Error generating receipt:', error);
                                toast.error('Failed to download receipt');
                            }
                        }}
                        style={{
                            marginTop: '2rem',
                            padding: '1rem 2rem',
                            background: 'linear-gradient(135deg, #f84565 0%, #d63854 100%)',
                            border: 'none',
                            borderRadius: '12px',
                            color: 'white',
                            fontSize: '1rem',
                            fontWeight: '600',
                            cursor: 'pointer',
                            boxShadow: '0 8px 30px rgba(248, 69, 101, 0.4)',
                            transition: 'all 0.3s ease',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            margin: '2rem auto 0'
                        }}
                        onMouseOver={(e) => {
                            e.currentTarget.style.transform = 'translateY(-2px)';
                            e.currentTarget.style.boxShadow = '0 12px 40px rgba(248, 69, 101, 0.5)';
                        }}
                        onMouseOut={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = '0 8px 30px rgba(248, 69, 101, 0.4)';
                        }}
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                            <polyline points="7 10 12 15 17 10"></polyline>
                            <line x1="12" y1="15" x2="12" y2="3"></line>
                        </svg>
                        Download Receipt
                    </button>

                    <p className="success-message" style={{ marginTop: '1.5rem', fontSize: '0.95rem' }}>
                        Redirecting to your bookings...
                    </p>
                </div>
            </div>
        );
    }

    if (!bookingDetails) {
        return null;
    }

    const appearance = {
        theme: 'night',
        variables: {
            colorPrimary: '#f84565',
            colorBackground: 'rgba(255, 255, 255, 0.03)',
            colorText: '#ffffff',
            colorDanger: '#ef4444',
            colorSuccess: '#10b981',
            fontFamily: 'Outfit, system-ui, sans-serif',
            spacingUnit: '4px',
            borderRadius: '14px',
            fontSizeBase: '16px',
            fontWeightNormal: '500',
        },
        rules: {
            '.Input': {
                backgroundColor: 'rgba(255, 255, 255, 0.03)',
                border: '1.5px solid rgba(255, 255, 255, 0.1)',
                padding: '14px',
                color: '#ffffff',
                fontSize: '16px',
            },
            '.Input:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                borderColor: 'rgba(248, 69, 101, 0.3)',
            },
            '.Input:focus': {
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                borderColor: '#f84565',
                boxShadow: '0 0 0 3px rgba(248, 69, 101, 0.1)',
            },
            '.Label': {
                color: 'rgba(255, 255, 255, 0.8)',
                fontSize: '14px',
                fontWeight: '600',
                marginBottom: '8px',
            },
            '.Error': {
                color: '#fca5a5',
                fontSize: '14px',
            },
        },
    };

    return (
        <div className="payment-page">
            <div className="payment-container">
                {/* Header */}
                <div className="payment-header">
                    <button onClick={() => navigate(-1)} className="payment-back-btn">
                        <ArrowLeft size={20} />
                        <span>Back</span>
                    </button>
                    <h1 className="payment-title">Complete Payment</h1>
                </div>

                <div className="payment-grid">
                    {/* Payment Form */}
                    <div>
                        {clientSecret && (
                            <Elements stripe={stripePromise} options={{ clientSecret, appearance }}>
                                <CheckoutForm
                                    bookingDetails={bookingDetails}
                                    onSuccess={handlePaymentSuccess}
                                />
                            </Elements>
                        )}
                    </div>

                    {/* Order Summary */}
                    <div>
                        <div className="order-summary-card">
                            <h3 className="order-summary-title">Order Summary</h3>

                            <div>
                                <div className="summary-item">
                                    <span className="summary-label">Movie</span>
                                    <span className="summary-value truncate">
                                        {bookingDetails.movieTitle}
                                    </span>
                                </div>

                                <div className="summary-item">
                                    <span className="summary-label">Theater</span>
                                    <span className="summary-value">{bookingDetails.theater}</span>
                                </div>

                                <div className="summary-item">
                                    <span className="summary-label">Date & Time</span>
                                    <span className="summary-value">{bookingDetails.showDateTime}</span>
                                </div>

                                <div className="summary-item">
                                    <span className="summary-label">Seats</span>
                                    <div className="summary-seats">
                                        {bookingDetails.seats.map((seat, index) => (
                                            <span key={index} className="seat-badge">
                                                {seat.row}{seat.number}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div className="summary-item">
                                    <span className="summary-label">Quantity</span>
                                    <span className="summary-value">
                                        {bookingDetails.seats.length} ticket{bookingDetails.seats.length > 1 ? 's' : ''}
                                    </span>
                                </div>
                            </div>

                            <div className="summary-total summary-item">
                                <span className="summary-total-label">Total Amount</span>
                                <span className="summary-total-amount">
                                    ₹{bookingDetails.totalAmount}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Payment;
