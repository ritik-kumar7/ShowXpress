import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { clerkMiddleware } from '@clerk/express'
import { serve } from "inngest/express";
import { inngest, functions } from "./inngest/index.js";

import connectDb from "./config/db.js";
import showRouter from "./routes/showRoutes.js";
import userRouter from "./routes/userRoutes.js";
import bookingRouter from "./routes/bookingRoutes.js";
import adminRouter from "./routes/adminRoutes.js";
import paymentRouter from "./routes/paymentRoutes.js";

dotenv.config();
const app = express();

const port = process.env.PORT || 4000;

// CORS configuration for production
const allowedOrigins = [
    process.env.FRONTEND_URL, // set this in Vercel (e.g., https://show-xpress7.vercel.app)
    "https://show-xpress.vercel.app",
    "https://show-xpress7.vercel.app",
    "http://localhost:5173",
    "http://localhost:3000"
].filter(Boolean);

const corsOptions = {
    origin: function(origin, callback) {
        // allow requests with no origin (e.g., server-to-server or curl)
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin)) return callback(null, true);
        // if in development allow any origin to make local testing easier
        if (process.env.NODE_ENV !== 'production') return callback(null, true);
        callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept"]
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

app.use(express.json());
app.use(clerkMiddleware());

// Connect to database
connectDb();

// Routes
app.use("/api/inngest", serve({ client: inngest, functions }));
app.use("/api/show", showRouter);
app.use("/api/user", userRouter);
app.use("/api/booking", bookingRouter);
app.use("/api/admin", adminRouter);
app.use("/api/payment", paymentRouter);

// Health check
app.get('/api/health', (req, res) => {
    res.json({ success: true, message: 'Server is running!' });
});

// Root endpoint
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'ShowXpress API',
        endpoints: {
            health: '/api/health',
            shows: '/api/show',
            bookings: '/api/booking',
            admin: '/api/admin',
            payment: '/api/payment'
        }
    });
});

// For Vercel serverless
export default app;

// For local development
if (process.env.NODE_ENV !== 'production') {
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
}
