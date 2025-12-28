import express from "express";
import { createBooking, getUserBookings, cancelBooking, getAllBookings, getAllUsers } from "../controllers/BookingController.js";

const bookingRouter = express.Router();

bookingRouter.post('/create', createBooking);
bookingRouter.get('/user/:userId', getUserBookings);
bookingRouter.put('/cancel/:bookingId', cancelBooking);
bookingRouter.get('/all', getAllBookings);
bookingRouter.get('/users', getAllUsers);

export default bookingRouter;