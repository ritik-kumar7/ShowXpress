import Booking from "../models/BookingModel.js";
import Show from "../models/ShowModel.js";
import MoviesModel from "../models/MoviesModel.js";
import User from "../models/UserModels.js";

// Create a new booking
const createBooking = async (req, res) => {
    try {
        const { userId, showId, seats, paymentIntentId } = req.body;

        // Get show details
        const show = await Show.findById(showId).populate('movie');
        if (!show) {
            return res.status(404).json({
                success: false,
                message: "Show not found"
            });
        }

        // Check if seats are available
        const occupiedSeats = show.occupiedSeats || [];
        const requestedSeats = seats.map(seat => `${seat.row}${seat.number}`);

        const conflictSeats = requestedSeats.filter(seat =>
            occupiedSeats.includes(seat)
        );

        if (conflictSeats.length > 0) {
            return res.status(400).json({
                success: false,
                message: "Some seats are already booked",
                conflictSeats
            });
        }

        // Calculate total amount
        const totalAmount = seats.reduce((sum, seat) => sum + seat.price, 0);

        // Create booking
        const booking = await Booking.create({
            user: userId,
            show: showId,
            movie: show.movie._id,
            seats,
            totalAmount,
            paymentIntentId: paymentIntentId || null,
            paymentStatus: paymentIntentId ? 'paid' : 'pending'
        });

        // Update occupied seats in show
        show.occupiedSeats = [...occupiedSeats, ...requestedSeats];
        await show.save();

        const populatedBooking = await Booking.findById(booking._id)
            .populate('show')
            .populate('movie');

        return res.status(201).json({
            success: true,
            message: "Booking created successfully",
            data: populatedBooking
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

// Get user bookings
const getUserBookings = async (req, res) => {
    try {
        const { userId } = req.params;

        const bookings = await Booking.find({ user: userId })
            .populate({
                path: 'show',
                populate: {
                    path: 'movie'
                }
            })
            .populate('movie')
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            data: bookings
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

// Cancel booking
const cancelBooking = async (req, res) => {
    try {
        const { bookingId } = req.params;

        const booking = await Booking.findById(bookingId);
        if (!booking) {
            return res.status(404).json({
                success: false,
                message: "Booking not found"
            });
        }

        if (booking.status === 'cancelled') {
            return res.status(400).json({
                success: false,
                message: "Booking already cancelled"
            });
        }

        // Update booking status
        booking.status = 'cancelled';
        await booking.save();

        // Free up seats in show
        const show = await Show.findById(booking.show);
        const bookedSeats = booking.seats.map(seat => `${seat.row}${seat.number}`);
        show.occupiedSeats = show.occupiedSeats.filter(seat =>
            !bookedSeats.includes(seat)
        );
        await show.save();

        return res.status(200).json({
            success: true,
            message: "Booking cancelled successfully"
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

// Get all bookings (admin) - with user info
const getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.find()
            .populate({
                path: 'show',
                populate: {
                    path: 'movie'
                }
            })
            .populate('movie')
            .sort({ createdAt: -1 });

        // Enrich bookings with user info
        const enrichedBookings = await Promise.all(
            bookings.map(async (booking) => {
                const bookingObj = booking.toObject();
                const userInfo = await User.findOne({ clerkId: booking.user });
                bookingObj.userInfo = userInfo ? {
                    name: userInfo.name,
                    email: userInfo.email,
                    image: userInfo.image
                } : null;
                return bookingObj;
            })
        );

        return res.status(200).json({
            success: true,
            data: enrichedBookings
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

// Get all users (admin)
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().sort({ createdAt: -1 });
        return res.status(200).json({
            success: true,
            data: users
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

export { createBooking, getUserBookings, cancelBooking, getAllBookings, getAllUsers };