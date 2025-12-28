const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

// Movie APIs
export const movieAPI = {
    getNowPlaying: async () => {
        const response = await fetch(`${API_BASE_URL}/show/now-playing`);
        return response.json();
    },

    getPopular: async () => {
        const response = await fetch(`${API_BASE_URL}/show/popular`);
        return response.json();
    },

    getMovieDetails: async (movieId) => {
        const response = await fetch(`${API_BASE_URL}/show/movie/${movieId}`);
        return response.json();
    }
};

// Show APIs
export const showAPI = {
    getAllShows: async () => {
        const response = await fetch(`${API_BASE_URL}/show/all`);
        return response.json();
    },

    getShowsByMovie: async (movieId) => {
        const response = await fetch(`${API_BASE_URL}/show/movie/${movieId}/shows`);
        return response.json();
    },

    getShowById: async (showId) => {
        const response = await fetch(`${API_BASE_URL}/show/${showId}`);
        return response.json();
    },

    addShow: async (showData) => {
        const response = await fetch(`${API_BASE_URL}/show/add-show`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(showData),
        });
        return response.json();
    },

    deleteShow: async (showId) => {
        const response = await fetch(`${API_BASE_URL}/show/${showId}`, {
            method: 'DELETE',
        });
        return response.json();
    },

    updateShow: async (showId, showData) => {
        const response = await fetch(`${API_BASE_URL}/show/${showId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(showData),
        });
        return response.json();
    }
};

// User APIs
export const userAPI = {
    createUser: async (userData) => {
        const response = await fetch(`${API_BASE_URL}/user/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        });
        return response.json();
    },

    getUserByClerkId: async (clerkId) => {
        const response = await fetch(`${API_BASE_URL}/user/${clerkId}`);
        return response.json();
    }
};

// Booking APIs
export const bookingAPI = {
    createBooking: async (bookingData) => {
        const response = await fetch(`${API_BASE_URL}/booking/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(bookingData),
        });
        return response.json();
    },

    getUserBookings: async (userId) => {
        const response = await fetch(`${API_BASE_URL}/booking/user/${userId}`);
        return response.json();
    },

    cancelBooking: async (bookingId) => {
        const response = await fetch(`${API_BASE_URL}/booking/cancel/${bookingId}`, {
            method: 'PUT',
        });
        return response.json();
    },

    getAllBookings: async () => {
        const response = await fetch(`${API_BASE_URL}/booking/all`);
        return response.json();
    },

    getAllUsers: async () => {
        const response = await fetch(`${API_BASE_URL}/booking/users`);
        return response.json();
    }
};

// Admin APIs
export const adminAPI = {
    login: async (email, password) => {
        const response = await fetch(`${API_BASE_URL}/admin/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });
        return response.json();
    },

    register: async (name, email, password) => {
        const response = await fetch(`${API_BASE_URL}/admin/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, email, password }),
        });
        return response.json();
    },

    getProfile: async (token) => {
        const response = await fetch(`${API_BASE_URL}/admin/profile`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
        return response.json();
    }
};

// Payment APIs
export const paymentAPI = {
    createPaymentIntent: async (amount, bookingDetails) => {
        const response = await fetch(`${API_BASE_URL}/payment/create-payment-intent`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ amount, bookingDetails }),
        });
        return response.json();
    },

    verifyPayment: async (paymentIntentId) => {
        const response = await fetch(`${API_BASE_URL}/payment/verify-payment`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ paymentIntentId }),
        });
        return response.json();
    }
};