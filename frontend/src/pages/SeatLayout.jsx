import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { showAPI, bookingAPI, userAPI } from '../lib/api';
import { ArrowLeft, Users, Clock, Calendar, MapPin, Ticket, Armchair, Check } from 'lucide-react';
import toast from 'react-hot-toast';

const SeatLayout = () => {
    const { id: movieId, date: showId } = useParams();
    const navigate = useNavigate();
    const { user } = useUser();
    const [show, setShow] = useState(null);
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [booking, setBooking] = useState(false);
    const [bookingSuccess, setBookingSuccess] = useState(false);

    useEffect(() => {
        fetchShowDetails();
    }, [showId]);

    const fetchShowDetails = async () => {
        try {
            const response = await showAPI.getShowById(showId);
            if (response.success) {
                setShow(response.data);
            } else {
                toast.error('Show not found');
                navigate(`/movie/${movieId}`);
            }
            setLoading(false);
        } catch (error) {
            toast.error('Failed to fetch show details');
            setLoading(false);
        }
    };

    const generateSeats = () => {
        const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
        const seatsPerRow = 10;
        const seats = [];

        rows.forEach(row => {
            for (let i = 1; i <= seatsPerRow; i++) {
                seats.push({
                    id: `${row}${i}`,
                    row,
                    number: i,
                    isOccupied: show?.occupiedSeats?.includes(`${row}${i}`) || false,
                    price: show?.showPrice || 0
                });
            }
        });

        return seats;
    };

    const handleSeatClick = (seat) => {
        if (seat.isOccupied) return;

        const seatId = seat.id;
        const isSelected = selectedSeats.find(s => s.id === seatId);

        if (isSelected) {
            setSelectedSeats(selectedSeats.filter(s => s.id !== seatId));
        } else {
            if (selectedSeats.length >= 6) {
                toast.error('You can select maximum 6 seats');
                return;
            }
            setSelectedSeats([...selectedSeats, seat]);
        }
    };

    const handleBooking = async () => {
        if (!user) {
            toast.error('Please sign in to book tickets');
            return;
        }

        if (selectedSeats.length === 0) {
            toast.error('Please select at least one seat');
            return;
        }

        // Navigate to payment page with booking details
        navigate('/payment', {
            state: {
                bookingDetails: {
                    userId: user.id,
                    showId: show._id,
                    seats: selectedSeats.map(seat => ({
                        row: seat.row,
                        number: seat.number,
                        price: seat.price
                    })),
                    totalAmount: getTotalAmount(),
                    movieTitle: show.movie.title,
                    theater: show.theater,
                    showDateTime: `${formatDate(show.showDate)} ${formatTime(show.showTime)}`
                }
            }
        });
    };

    const getTotalAmount = () => {
        return selectedSeats.reduce((total, seat) => total + seat.price, 0);
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
            weekday: 'long',
            day: 'numeric',
            month: 'short'
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="loader"></div>
            </div>
        );
    }

    if (!show) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-white mb-4">Show not found</h2>
                    <button
                        onClick={() => navigate(`/movie/${movieId}`)}
                        className="btn btn-primary"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    // Booking Success Animation
    if (bookingSuccess) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="w-24 h-24 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6 animate-pulse">
                        <Check className="w-12 h-12 text-green-500" />
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-2">Booking Confirmed!</h2>
                    <p className="text-gray-400">Redirecting to your bookings...</p>
                </div>
            </div>
        );
    }

    const seats = generateSeats();

    return (
        <div className="min-h-screen pt-24 pb-16">
            <div className="container-custom">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center gap-4 mb-8">
                    <button
                        onClick={() => navigate(`/movie/${movieId}`)}
                        className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors w-fit"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        <span>Back</span>
                    </button>

                    <div className="flex-1">
                        <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">{show.movie.title}</h1>
                        <div className="flex flex-wrap items-center gap-4 text-gray-400">
                            <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-primary" />
                                <span>{formatDate(show.showDate)}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4 text-primary" />
                                <span>{formatTime(show.showTime)}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-primary" />
                                <span>{show.theater}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Seat Layout */}
                    <div className="lg:col-span-3">
                        <div className="card p-6 md:p-8">
                            {/* Screen */}
                            <div className="text-center mb-10">
                                <div className="screen inline-block mb-4">
                                    SCREEN
                                </div>
                                <p className="text-sm text-gray-500">All eyes this way please!</p>
                            </div>

                            {/* Legend */}
                            <div className="flex justify-center gap-6 mb-8">
                                <div className="flex items-center gap-2">
                                    <div className="seat seat-available w-6 h-6">
                                        <Armchair className="w-4 h-4" />
                                    </div>
                                    <span className="text-sm text-gray-400">Available</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="seat seat-selected w-6 h-6">
                                        <Armchair className="w-4 h-4" />
                                    </div>
                                    <span className="text-sm text-gray-400">Selected</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="seat seat-occupied w-6 h-6">
                                        <Armchair className="w-4 h-4" />
                                    </div>
                                    <span className="text-sm text-gray-400">Occupied</span>
                                </div>
                            </div>

                            {/* Seats Grid */}
                            <div className="space-y-2 overflow-x-auto pb-4">
                                {['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'].map(row => (
                                    <div key={row} className="flex items-center justify-center gap-2 min-w-fit">
                                        <span className="w-8 text-center font-bold text-gray-500 text-sm">{row}</span>
                                        <div className="flex gap-1.5">
                                            {seats.filter(seat => seat.row === row).map(seat => {
                                                const isSelected = selectedSeats.find(s => s.id === seat.id);
                                                return (
                                                    <button
                                                        key={seat.id}
                                                        onClick={() => handleSeatClick(seat)}
                                                        disabled={seat.isOccupied}
                                                        className={`seat ${seat.isOccupied
                                                            ? 'seat-occupied'
                                                            : isSelected
                                                                ? 'seat-selected'
                                                                : 'seat-available'
                                                            }`}
                                                        title={seat.isOccupied ? 'Occupied' : `Seat ${seat.id} - ₹${seat.price}`}
                                                    >
                                                        {seat.number}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                        <span className="w-8 text-center font-bold text-gray-500 text-sm">{row}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Booking Summary */}
                    <div className="lg:col-span-1">
                        <div className="card p-6 sticky top-24">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                                    <Ticket className="w-6 h-6 text-primary" />
                                </div>
                                <h3 className="text-xl font-bold text-white">Booking Summary</h3>
                            </div>

                            <div className="space-y-4 mb-6">
                                <div className="flex justify-between text-gray-400">
                                    <span>Movie</span>
                                    <span className="text-white font-medium text-right max-w-[150px] truncate">{show.movie.title}</span>
                                </div>
                                <div className="flex justify-between text-gray-400">
                                    <span>Date</span>
                                    <span className="text-white">{formatDate(show.showDate)}</span>
                                </div>
                                <div className="flex justify-between text-gray-400">
                                    <span>Time</span>
                                    <span className="text-white">{formatTime(show.showTime)}</span>
                                </div>
                                <div className="flex justify-between text-gray-400">
                                    <span>Theater</span>
                                    <span className="text-white">{show.theater}</span>
                                </div>
                                <div className="border-t border-white/10 pt-4">
                                    <div className="flex justify-between text-gray-400 mb-2">
                                        <span>Seats</span>
                                        <span className="text-white">
                                            {selectedSeats.length > 0
                                                ? selectedSeats.map(seat => seat.id).join(', ')
                                                : 'None selected'
                                            }
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-gray-400">
                                        <span>Price/seat</span>
                                        <span className="text-white">₹{show.showPrice}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="border-t border-white/10 pt-4 mb-6">
                                <div className="flex justify-between items-center">
                                    <span className="text-lg font-bold text-white">Total</span>
                                    <span className="text-3xl font-bold text-primary">₹{getTotalAmount()}</span>
                                </div>
                                <p className="text-sm text-gray-500 mt-1">
                                    {selectedSeats.length} seat(s) × ₹{show.showPrice}
                                </p>
                            </div>

                            <button
                                onClick={handleBooking}
                                disabled={selectedSeats.length === 0 || booking}
                                className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${selectedSeats.length === 0 || booking
                                    ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                                    : 'btn btn-primary'
                                    }`}
                            >
                                {booking ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        Processing...
                                    </span>
                                ) : (
                                    `Book ${selectedSeats.length} Ticket${selectedSeats.length !== 1 ? 's' : ''}`
                                )}
                            </button>

                            {!user && (
                                <p className="text-sm text-gray-500 mt-4 text-center">
                                    Please sign in to book tickets
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SeatLayout;