import React from 'react';
import { X, User, Film, Calendar, Clock, MapPin, CreditCard, Ticket, Mail, CheckCircle, XCircle } from 'lucide-react';
import './BookingDetailsModal.css';

const BookingDetailsModal = ({ booking, onClose }) => {
    if (!booking) return null;

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatTime = (timeString) => {
        return new Date(timeString).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    };

    return (
        <div
            className="modal-overlay"
            onClick={(e) => {
                if (e.target === e.currentTarget) {
                    onClose();
                }
            }}
        >
            <div
                className="modal-content p-0 max-w-4xl"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="relative overflow-hidden">
                    {booking.movie?.poster_path && (
                        <div className="h-52 overflow-hidden rounded-t-2xl relative">
                            <img
                                src={`https://image.tmdb.org/t/p/w780${booking.movie.backdrop_path || booking.movie.poster_path}`}
                                alt={booking.movie?.title}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-[#12121a]"></div>
                        </div>
                    )}
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onClose();
                        }}
                        className="absolute top-5 right-5 p-3.5 rounded-full bg-black/70 hover:bg-primary/80 transition-all duration-300 backdrop-blur-md border-2 border-white/20 hover:border-primary/50 shadow-xl hover:shadow-primary/30 hover:scale-110 z-50"
                    >
                        <X className="w-6 h-6 text-white" />
                    </button>

                    {/* Movie Title Overlay */}
                    <div className="absolute bottom-8 left-8 right-8 flex items-end gap-6">
                        {booking.movie?.poster_path && (
                            <div className="relative">
                                <img
                                    src={`https://image.tmdb.org/t/p/w200${booking.movie.poster_path}`}
                                    alt={booking.movie?.title}
                                    className="w-28 h-40 object-cover rounded-2xl shadow-2xl border-3 border-white/30"
                                />
                                <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-black/20 to-transparent"></div>
                            </div>
                        )}
                        <div className="flex-1">
                            <h2 className="text-3xl font-bold text-white mb-2">{booking.movie?.title || 'Movie'}</h2>
                            <div className="flex items-center gap-5 text-base text-gray-300">
                                {booking.movie?.runtime && (
                                    <span className="flex items-center gap-1.5">
                                        <Clock className="w-5 h-5" />
                                        {booking.movie.runtime} min
                                    </span>
                                )}
                                {booking.movie?.genres && (
                                    <span>{booking.movie.genres.slice(0, 2).join(', ')}</span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-10 space-y-10">
                    {/* Status Badge */}
                    <div className="flex items-center justify-between">
                        <div className={`flex items-center gap-3 px-6 py-3 rounded-full text-sm font-semibold shadow-lg ${booking.status === 'confirmed'
                            ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                            : 'bg-red-500/20 text-red-400 border border-red-500/30'
                            }`}>
                            {booking.status === 'confirmed' ? (
                                <CheckCircle className="w-5 h-5" />
                            ) : (
                                <XCircle className="w-5 h-5" />
                            )}
                            {booking.status === 'confirmed' ? 'Booking Confirmed' : 'Booking Cancelled'}
                        </div>
                        <div className="text-right">
                            <p className="text-gray-500 text-xs uppercase tracking-wide">Booked on</p>
                            <p className="text-gray-300 text-sm font-medium">
                                {formatDate(booking.createdAt)}
                            </p>
                        </div>
                    </div>

                    {/* User Info */}
                    <div className="bg-gradient-to-r from-white/5 to-white/10 rounded-2xl p-6 border border-white/10">
                        <h3 className="text-sm font-semibold text-gray-400 mb-4 flex items-center gap-2 uppercase tracking-wide">
                            <User className="w-4 h-4" /> Customer Details
                        </h3>
                        <div className="flex items-center gap-5">
                            {booking.userInfo?.image ? (
                                <img
                                    src={booking.userInfo.image}
                                    alt={booking.userInfo.name}
                                    className="w-16 h-16 rounded-full object-cover border-3 border-primary/40 shadow-lg"
                                />
                            ) : (
                                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center border-2 border-primary/30">
                                    <User className="w-8 h-8 text-primary" />
                                </div>
                            )}
                            <div className="flex-1">
                                <p className="text-white font-semibold text-lg">{booking.userInfo?.name || 'Unknown User'}</p>
                                <p className="text-gray-400 flex items-center gap-2 mt-1">
                                    <Mail className="w-4 h-4" />
                                    {booking.userInfo?.email || booking.user}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Show Details */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="bg-gradient-to-br from-white/8 to-white/4 rounded-2xl p-5 border border-white/10">
                            <div className="flex items-center gap-3 text-gray-400 text-sm mb-2">
                                <Calendar className="w-5 h-5 text-primary" />
                                <span className="uppercase tracking-wide font-medium">Date</span>
                            </div>
                            <p className="text-white font-bold text-lg">
                                {booking.show?.showDate ? formatDate(booking.show.showDate) : 'N/A'}
                            </p>
                        </div>
                        <div className="bg-gradient-to-br from-white/8 to-white/4 rounded-2xl p-5 border border-white/10">
                            <div className="flex items-center gap-3 text-gray-400 text-sm mb-2">
                                <Clock className="w-5 h-5 text-primary" />
                                <span className="uppercase tracking-wide font-medium">Time</span>
                            </div>
                            <p className="text-white font-bold text-lg">
                                {booking.show?.showTime ? formatTime(booking.show.showTime) : 'N/A'}
                            </p>
                        </div>
                        <div className="bg-gradient-to-br from-white/8 to-white/4 rounded-2xl p-5 border border-white/10">
                            <div className="flex items-center gap-3 text-gray-400 text-sm mb-2">
                                <MapPin className="w-5 h-5 text-primary" />
                                <span className="uppercase tracking-wide font-medium">Theater</span>
                            </div>
                            <p className="text-white font-bold text-lg">{booking.show?.theater || 'N/A'}</p>
                        </div>
                        <div className="bg-gradient-to-br from-primary/20 to-primary/10 rounded-2xl p-5 border border-primary/30">
                            <div className="flex items-center gap-3 text-primary text-sm mb-2">
                                <CreditCard className="w-5 h-5" />
                                <span className="uppercase tracking-wide font-medium">Total Amount</span>
                            </div>
                            <p className="text-primary font-bold text-2xl">₹{booking.totalAmount}</p>
                        </div>
                    </div>

                    {/* Seats */}
                    <div className="bg-gradient-to-r from-white/8 to-white/4 rounded-2xl p-6 border border-white/10">
                        <h3 className="text-sm font-semibold text-gray-400 mb-4 flex items-center gap-2 uppercase tracking-wide">
                            <Ticket className="w-5 h-5 text-primary" />
                            Booked Seats ({booking.seats?.length || 0} {booking.seats?.length === 1 ? 'Seat' : 'Seats'})
                        </h3>
                        <div className="flex flex-wrap gap-3">
                            {booking.seats?.map((seat, index) => (
                                <span
                                    key={index}
                                    className="px-4 py-2 bg-gradient-to-r from-primary/30 to-primary/20 text-primary rounded-xl text-sm font-bold border border-primary/40 shadow-lg"
                                >
                                    {seat.row}{seat.number}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Booking ID */}
                    <div className="text-center pt-4 border-t border-white/10">
                        <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Booking Reference</p>
                        <p className="text-gray-300 text-sm font-mono bg-white/5 px-4 py-2 rounded-lg inline-block">{booking._id}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookingDetailsModal;
