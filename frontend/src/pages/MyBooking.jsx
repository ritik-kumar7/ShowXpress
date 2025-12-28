import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { bookingAPI } from '../lib/api';
import { Calendar, Clock, MapPin, Ticket, X, Download, QrCode, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { generateTicketReceipt } from '../lib/receiptGenerator';
import './MyBooking.css';

const MyBooking = () => {
    const { user } = useUser();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [cancellingBooking, setCancellingBooking] = useState(null);

    useEffect(() => {
        if (user) {
            fetchUserBookings();
        } else {
            setLoading(false);
        }
    }, [user]);

    const fetchUserBookings = async () => {
        try {
            const response = await bookingAPI.getUserBookings(user.id);
            if (response.success) {
                setBookings(response.data);
            }
            setLoading(false);
        } catch (error) {
            toast.error('Failed to fetch bookings');
            setLoading(false);
        }
    };

    const handleCancelBooking = async (bookingId) => {
        if (!confirm('Are you sure you want to cancel this booking?')) return;

        setCancellingBooking(bookingId);
        try {
            const response = await bookingAPI.cancelBooking(bookingId);
            if (response.success) {
                toast.success('Booking cancelled successfully');
                fetchUserBookings();
            } else {
                toast.error(response.message || 'Failed to cancel booking');
            }
        } catch (error) {
            toast.error('Failed to cancel booking');
        } finally {
            setCancellingBooking(null);
        }
    };

    const formatTime = (timeString) => {
        return new Date(timeString).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const canCancelBooking = (showTime, showDate) => {
        const showDateTime = new Date(`${showDate} ${showTime}`);
        const now = new Date();
        const timeDiff = showDateTime.getTime() - now.getTime();
        const hoursDiff = timeDiff / (1000 * 3600);
        return hoursDiff > 2;
    };

    // Check if show has already been completed (passed)
    const isShowCompleted = (showTime, showDate) => {
        if (!showTime || !showDate) return false;

        // Parse the show date
        const showDateObj = new Date(showDate);

        // Parse the show time (it might be an ISO string)
        const timeObj = new Date(showTime);
        const hours = timeObj.getHours();
        const minutes = timeObj.getMinutes();

        // Combine date and time
        const showDateTime = new Date(showDateObj);
        showDateTime.setHours(hours, minutes, 0, 0);

        const now = new Date();

        console.log('Show DateTime:', showDateTime, 'Now:', now, 'Is Completed:', showDateTime < now);

        return showDateTime < now;
    };

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center pt-24">
                <div className="text-center">
                    <div className="w-20 h-20 rounded-full bg-surface-light flex items-center justify-center mx-auto mb-6">
                        <Ticket className="w-10 h-10 text-gray-500" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">Please Sign In</h2>
                    <p className="text-gray-400">You need to sign in to view your bookings</p>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="min-h-screen pt-24 pb-16">
                <div className="container-custom">
                    <div className="skeleton h-12 w-64 mb-8"></div>
                    <div className="space-y-6">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="skeleton h-48 rounded-2xl"></div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-24 pb-16 relative overflow-hidden">
            {/* Background Elements */}
            <div className="blur-circle -top-48 -right-48 opacity-20"></div>

            <div className="container-custom relative z-10">
                {/* Header */}
                <div className="flex items-center gap-4 mb-10">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center">
                        <Ticket className="w-7 h-7 text-white" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-white">My Bookings</h1>
                        <p className="text-gray-400">Manage your movie tickets</p>
                    </div>
                </div>

                {bookings.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="w-20 h-20 rounded-full bg-surface-light flex items-center justify-center mx-auto mb-6">
                            <Ticket className="w-10 h-10 text-gray-500" />
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-2">No Bookings Found</h2>
                        <p className="text-gray-400 mb-6">You haven't booked any tickets yet</p>
                        <a href="/movies" className="btn btn-primary">
                            Browse Movies
                        </a>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {bookings.map(booking => {
                            const isCancelled = booking.status === 'cancelled';
                            const canCancel = !isCancelled && canCancelBooking(booking.show?.showTime, booking.show?.showDate);
                            const isCompleted = !isCancelled && isShowCompleted(booking.show?.showTime, booking.show?.showDate);

                            return (
                                <div
                                    key={booking._id}
                                    className={`booking-card ${isCancelled ? 'opacity-60' : ''}`}
                                >
                                    <div className="flex flex-col md:flex-row">
                                        {/* Movie Poster */}
                                        <div className="booking-movie-poster">
                                            <img
                                                src={`https://image.tmdb.org/t/p/w500${booking.movie?.poster_path}`}
                                                alt={booking.movie?.title}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>

                                        {/* Booking Details */}
                                        <div className="flex-1 booking-movie-details">
                                            <div className="booking-header">
                                                <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                                                    <div>
                                                        <h3 className="text-2xl font-bold text-white mb-3">{booking.movie?.title}</h3>
                                                        <div className={`badge ${isCancelled ? 'badge-error' : isCompleted ? 'badge-watched' : 'badge-success'}`}>
                                                            {isCancelled ? 'Cancelled' : isCompleted ? 'Watched' : 'Confirmed'}
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-3xl font-bold text-primary">₹{booking.totalAmount}</p>
                                                        <p className="text-sm text-gray-500">Total Amount</p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="booking-info-grid">
                                                <div className="booking-info-item">
                                                    <div className="flex items-center gap-2 text-gray-400 mb-2">
                                                        <Calendar className="w-5 h-5 text-primary" />
                                                        <span className="font-medium">Date</span>
                                                    </div>
                                                    <span className="text-white font-semibold">{formatDate(booking.show?.showDate)}</span>
                                                </div>
                                                <div className="booking-info-item">
                                                    <div className="flex items-center gap-2 text-gray-400 mb-2">
                                                        <Clock className="w-5 h-5 text-primary" />
                                                        <span className="font-medium">Time</span>
                                                    </div>
                                                    <span className="text-white font-semibold">{formatTime(booking.show?.showTime)}</span>
                                                </div>
                                                <div className="booking-info-item">
                                                    <div className="flex items-center gap-2 text-gray-400 mb-2">
                                                        <MapPin className="w-5 h-5 text-primary" />
                                                        <span className="font-medium">Theater</span>
                                                    </div>
                                                    <span className="text-white font-semibold">{booking.show?.theater}</span>
                                                </div>
                                                <div className="booking-info-item">
                                                    <div className="flex items-center gap-2 text-gray-400 mb-2">
                                                        <Ticket className="w-5 h-5 text-primary" />
                                                        <span className="font-medium">Seats</span>
                                                    </div>
                                                    <span className="text-white font-semibold">{booking.seats?.length} seat(s)</span>
                                                </div>
                                            </div>

                                            {/* Seats */}
                                            <div className="booking-seats-container">
                                                <p className="text-sm text-gray-400 mb-3 font-medium">Booked Seats</p>
                                                <div className="booking-seats-grid">
                                                    {booking.seats?.map((seat, index) => (
                                                        <span
                                                            key={index}
                                                            className="booking-seat-badge"
                                                        >
                                                            {seat.row}{seat.number}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Footer */}
                                            <div className="booking-footer">
                                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                                    <div className="text-sm text-gray-500">
                                                        <p>Booking ID: <span className="text-gray-400 font-mono">{booking._id}</span></p>
                                                        <p>Booked on: {new Date(booking.createdAt).toLocaleDateString()}</p>
                                                    </div>

                                                    {/* Show "Watched" Message for Completed Shows */}
                                                    {isCompleted && (
                                                        <div className="watched-message">
                                                            <CheckCircle className="w-5 h-5 text-green-400" />
                                                            <div>
                                                                <p className="text-green-400 font-semibold">You watched this show!</p>
                                                                <p className="text-gray-400 text-sm">Thank you for booking with ShowXpress</p>
                                                            </div>
                                                        </div>
                                                    )}

                                                    <div className="booking-actions">
                                                        {!isCancelled && (
                                                            <button
                                                                className="btn btn-secondary text-sm"
                                                                onClick={() => {
                                                                    try {
                                                                        generateTicketReceipt({
                                                                            bookingId: booking._id,
                                                                            bookingDate: booking.createdAt,
                                                                            movieTitle: booking.movie?.title || 'N/A',
                                                                            theater: booking.show?.theater || 'N/A',
                                                                            showDate: formatDate(booking.show?.showDate),
                                                                            showTime: formatTime(booking.show?.showTime),
                                                                            seats: booking.seats || [],
                                                                            totalAmount: booking.totalAmount,
                                                                            paymentMethod: booking.paymentStatus === 'paid' ? 'Card' : 'Pending',
                                                                            transactionId: booking.paymentIntentId || 'N/A'
                                                                        });
                                                                        toast.success('Receipt downloaded!');
                                                                    } catch (error) {
                                                                        console.error('Error generating receipt:', error);
                                                                        toast.error('Failed to download receipt');
                                                                    }
                                                                }}
                                                            >
                                                                <Download className="w-4 h-4" />
                                                                Download
                                                            </button>
                                                        )}

                                                        {canCancel && (
                                                            <button
                                                                onClick={() => handleCancelBooking(booking._id)}
                                                                disabled={cancellingBooking === booking._id}
                                                                className="btn btn-outline text-sm border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                                                            >
                                                                <X className="w-4 h-4" />
                                                                {cancellingBooking === booking._id ? 'Cancelling...' : 'Cancel'}
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyBooking;