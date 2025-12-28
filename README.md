# 🎬 ShowXpress - Movie Ticket Booking System

A modern, full-stack movie ticket booking application built with the MERN stack, featuring real-time seat selection, secure payment processing, and a premium user experience.

![ShowXpress](https://img.shields.io/badge/ShowXpress-Movie%20Booking-ff4565?style=for-the-badge)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)

## ✨ Features

### 🎥 Movie Management
- **Browse Movies**: Explore now playing, popular, and upcoming movies
- **Movie Details**: View comprehensive movie information including cast, ratings, and trailers
- **Search & Filter**: Find movies by title, genre, or release date
- **Favorites**: Save your favorite movies for quick access

### 🎫 Booking System
- **Real-time Seat Selection**: Interactive seat layout with live availability
- **Multiple Shows**: Choose from various showtimes and theaters
- **Smart Pricing**: Dynamic pricing based on seat type and show timing
- **Booking History**: Track all your past and upcoming bookings

### 💳 Payment Integration
- **Stripe Integration**: Secure payment processing with Stripe
- **Multiple Payment Methods**: Support for credit/debit cards
- **Payment Verification**: Automatic payment confirmation and booking creation
- **Receipt Generation**: Download professional PDF receipts for all bookings

### 👤 User Management
- **Clerk Authentication**: Secure user authentication and authorization
- **User Profiles**: Manage personal information and preferences
- **Booking Management**: View, track, and manage all bookings
- **Role-based Access**: Admin and user role separation

### 🎨 Premium UI/UX
- **Modern Design**: Glassmorphism effects and smooth animations
- **Dark Theme**: Eye-friendly dark mode interface
- **Responsive**: Fully responsive design for all devices
- **Loading States**: Smooth loading animations and transitions

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **React Router** - Client-side routing
- **Clerk** - Authentication
- **Stripe Elements** - Payment UI
- **Lucide React** - Icons
- **React Hot Toast** - Notifications
- **jsPDF** - PDF generation
- **Axios** - HTTP client

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **Stripe** - Payment processing
- **Clerk** - Authentication
- **Inngest** - Background jobs
- **Cors** - Cross-origin resource sharing

### External APIs
- **TMDB API** - Movie data and images
- **Stripe API** - Payment processing
- **Clerk API** - User management

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **MongoDB** (local or Atlas)
- **Git**

You'll also need accounts for:
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- [Clerk](https://clerk.com/)
- [Stripe](https://stripe.com/)
- [TMDB](https://www.themoviedb.org/settings/api)
- [Inngest](https://www.inngest.com/)

## 🚀 Installation

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/movieTicketBooking.git
cd movieTicketBooking
```

### 2. Install Dependencies

**Install root dependencies:**
```bash
npm install
```

**Install backend dependencies:**
```bash
cd backend
npm install
cd ..
```

**Install frontend dependencies:**
```bash
cd frontend
npm install
cd ..
```

### 3. Environment Variables

Create `.env` files in both `backend` and `frontend` directories:

**Backend `.env`:**
```env
# MongoDB
MONGO_URI=your_mongodb_connection_string

# Clerk
CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

# Inngest
INNGEST_EVENT_KEY=your_inngest_event_key
INNGEST_SIGNING_KEY=your_inngest_signing_key

# TMDB
TMDB_API_KEY=your_tmdb_api_key

# Stripe
STRIPE_SECRET_KEY=your_stripe_secret_key

# Server
PORT=5000
```

**Frontend `.env`:**
```env
VITE_API_URL=http://localhost:5000/api
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

### 4. Run the Application

**Development mode (runs both frontend and backend):**
```bash
npm run dev
```

**Or run separately:**

**Backend:**
```bash
cd backend
npm start
```

**Frontend:**
```bash
cd frontend
npm run dev
```

The application will be available at:
- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:5000

## 📁 Project Structure

```
movieTicketBooking/
├── backend/
│   ├── controllers/      # Request handlers
│   ├── models/          # Database models
│   ├── routes/          # API routes
│   ├── inngest/         # Background jobs
│   ├── middleware/      # Custom middleware
│   └── server.js        # Entry point
├── frontend/
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   ├── pages/       # Page components
│   │   ├── lib/         # Utilities and helpers
│   │   ├── App.jsx      # Main app component
│   │   └── main.jsx     # Entry point
│   └── public/          # Static assets
├── .gitignore
├── package.json
└── README.md
```

## 🔑 API Endpoints

### Movies
- `GET /api/show/now-playing` - Get now playing movies
- `GET /api/show/popular` - Get popular movies
- `GET /api/show/upcoming` - Get upcoming movies
- `GET /api/show/movie/:id` - Get movie details
- `GET /api/show/movie/:movieId/shows` - Get shows for a movie

### Bookings
- `POST /api/booking/create` - Create a new booking
- `GET /api/booking/user/:userId` - Get user bookings
- `GET /api/booking/:id` - Get booking details
- `PUT /api/booking/:id/cancel` - Cancel a booking

### Payments
- `POST /api/payment/create-payment-intent` - Create Stripe payment intent
- `POST /api/payment/verify` - Verify payment status

### Admin
- `POST /api/admin/register` - Register admin
- `POST /api/admin/login` - Admin login
- `GET /api/admin/stats` - Get dashboard statistics

## 🎨 Features in Detail

### Seat Selection
- Interactive seat map with real-time availability
- Color-coded seats (available, selected, occupied)
- Seat type differentiation (Regular, Premium, VIP)
- Dynamic pricing based on seat type
- Maximum seat limit per booking

### Payment Flow
1. User selects seats and proceeds to payment
2. Payment intent created on backend
3. Stripe Elements renders payment form
4. User enters payment details
5. Payment confirmed and verified
6. Booking created in database
7. Receipt generated and available for download

### Receipt Generation
- Professional PDF format
- Includes all booking details
- QR code for theater verification
- Downloadable from success page and booking history
- Branded with ShowXpress design

## 🔒 Security

- **Authentication**: Clerk handles secure user authentication
- **Payment**: Stripe ensures PCI-compliant payment processing
- **Environment Variables**: Sensitive data stored in .env files
- **CORS**: Configured to allow only specific origins
- **Input Validation**: Server-side validation for all inputs

## 🧪 Testing

### Test Payment
Use Stripe test cards for testing payments:
- **Success**: `4242 4242 4242 4242`
- **Decline**: `4000 0000 0000 0002`
- **3D Secure**: `4000 0027 6000 3184`

Use any future expiry date, any 3-digit CVC, and any postal code.

## 📱 Responsive Design

The application is fully responsive and works seamlessly on:
- 📱 Mobile devices (320px and up)
- 📱 Tablets (768px and up)
- 💻 Laptops (1024px and up)
- 🖥️ Desktops (1440px and up)

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Ritik Kumar**

- GitHub: [@ritik-kumar7](https://github.com/ritik-kumar7)
- LinkedIn: [@ritik-kumar7](https://linkedin.com/in/ritik-kumar7)

## 🙏 Acknowledgments

- [TMDB](https://www.themoviedb.org/) for movie data
- [Stripe](https://stripe.com/) for payment processing
- [Clerk](https://clerk.com/) for authentication
- [MongoDB](https://www.mongodb.com/) for database
- [Inngest](https://www.inngest.com/) for background jobs

## 📞 Support

For support, email support@showxpress.com or open an issue in the repository.

---

<div align="center">
  Made with ❤️ by Ritik Kumar
  <br>
  <br>
  ⭐ Star this repository if you found it helpful!
</div>
