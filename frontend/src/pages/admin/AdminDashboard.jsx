import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { showAPI, bookingAPI } from '../../lib/api';
import {
    Plus, Trash2, Edit2, Calendar, Film, Ticket, TrendingUp,
    LayoutDashboard, LogOut, Users, Eye
} from 'lucide-react';
import toast from 'react-hot-toast';
import AddShowModal from './AddShowModal';
import BookingDetailsModal from './BookingDetailsModal';
import { useAdmin } from '../../context/AdminContext';
import './AdminDashboard.css';

const AdminDashboard = () => {
    const [shows, setShows] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingShow, setEditingShow] = useState(null);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [activeTab, setActiveTab] = useState('shows');
    const [stats, setStats] = useState({
        totalShows: 0,
        totalBookings: 0,
        totalRevenue: 0,
        todayBookings: 0
    });

    const { admin, logout } = useAdmin();
    const navigate = useNavigate();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [showsResponse, bookingsResponse] = await Promise.all([
                showAPI.getAllShows(),
                bookingAPI.getAllBookings()
            ]);

            if (showsResponse.success) {
                setShows(showsResponse.data);
            }

            if (bookingsResponse.success) {
                setBookings(bookingsResponse.data);
                calculateStats(showsResponse.data, bookingsResponse.data);
            }

            setLoading(false);
        } catch (error) {
            toast.error('Failed to fetch data');
            setLoading(false);
        }
    };

    const calculateStats = (showsData, bookingsData) => {
        const today = new Date().toDateString();
        const todayBookings = bookingsData.filter(booking =>
            new Date(booking.createdAt).toDateString() === today
        ).length;

        const totalRevenue = bookingsData
            .filter(booking => booking.status === 'confirmed')
            .reduce((sum, booking) => sum + booking.totalAmount, 0);

        setStats({
            totalShows: showsData.length,
            totalBookings: bookingsData.length,
            totalRevenue,
            todayBookings
        });
    };

    const handleDeleteShow = async (showId) => {
        if (!confirm('Are you sure you want to delete this show?')) return;

        try {
            const response = await showAPI.deleteShow(showId);
            if (response.success) {
                toast.success('Show deleted successfully');
                fetchData();
            } else {
                toast.error(response.message || 'Failed to delete show');
            }
        } catch (error) {
            toast.error('Failed to delete show');
        }
    };

    const handleEditShow = (show) => {
        setEditingShow(show);
        setShowAddModal(true);
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
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="loader"></div>
            </div>
        );
    }

    const statCards = [
        {
            label: 'Total Shows',
            value: stats.totalShows,
            icon: Film,
            color: '#3b82f6',
            bgColor: 'bg-blue-500/20'
        },
        {
            label: 'Total Bookings',
            value: stats.totalBookings,
            icon: Ticket,
            color: '#22c55e',
            bgColor: 'bg-green-500/20'
        },
        {
            label: 'Total Revenue',
            value: `₹${stats.totalRevenue.toLocaleString()}`,
            icon: TrendingUp,
            color: '#eab308',
            bgColor: 'bg-yellow-500/20'
        },
        {
            label: "Today's Bookings",
            value: stats.todayBookings,
            icon: Calendar,
            color: '#a855f7',
            bgColor: 'bg-purple-500/20'
        },
    ];

    return (
        <div className="min-h-screen pt-6 pb-16">
            {/* Header */}
            <div className="admin-header">
                <div className="container-custom py-6">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center">
                                <LayoutDashboard className="w-7 h-7 text-white" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold admin-title">Admin Dashboard</h1>
                                <p className="text-gray-400">Welcome, {admin?.name || 'Admin'}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => {
                                    setEditingShow(null);
                                    setShowAddModal(true);
                                }}
                                className="btn btn-primary"
                            >
                                <Plus className="w-5 h-5" />
                                Add Show
                            </button>
                            <button
                                onClick={() => {
                                    logout();
                                    navigate('/admin/login');
                                    toast.success('Logged out successfully');
                                }}
                                className="btn bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/30"
                            >
                                <LogOut className="w-5 h-5" />
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container-custom">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {statCards.map((stat, index) => (
                        <div key={index} className="stat-card">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-400 text-sm mb-1">{stat.label}</p>
                                    <p className="text-2xl font-bold text-white">{stat.value}</p>
                                </div>
                                <div className={`stat-icon ${stat.bgColor}`}>
                                    <stat.icon className="w-6 h-6" style={{ color: stat.color }} />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Tabs */}
                <div className="admin-tabs mb-6">
                    <button
                        onClick={() => setActiveTab('shows')}
                        className={`admin-tab ${activeTab === 'shows' ? 'active' : ''}`}
                    >
                        <Film className="w-4 h-4" />
                        All Shows
                    </button>
                    <button
                        onClick={() => setActiveTab('bookings')}
                        className={`admin-tab ${activeTab === 'bookings' ? 'active' : ''}`}
                    >
                        <Ticket className="w-4 h-4" />
                        Recent Bookings
                    </button>
                </div>

                {/* Shows Table */}
                {activeTab === 'shows' && (
                    <div className="admin-table-container">
                        <div className="overflow-x-auto">
                            <table className="table-dark">
                                <thead>
                                    <tr>
                                        <th>Movie</th>
                                        <th>Date & Time</th>
                                        <th>Theater</th>
                                        <th>Price</th>
                                        <th>Seats</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {shows.length === 0 ? (
                                        <tr>
                                            <td colSpan={6} className="text-center py-12 text-gray-500">
                                                No shows found. Add your first show!
                                            </td>
                                        </tr>
                                    ) : (
                                        shows.map(show => (
                                            <tr key={show._id}>
                                                <td>
                                                    <div className="flex items-center gap-3">
                                                        <img
                                                            src={`https://image.tmdb.org/t/p/w200${show.movie?.poster_path}`}
                                                            alt={show.movie?.title}
                                                            className="w-12 h-16 object-cover rounded-lg"
                                                        />
                                                        <div>
                                                            <p className="font-medium text-white">{show.movie?.title}</p>
                                                            <p className="text-sm text-gray-500">{show.movie?.runtime} min</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>
                                                    <p className="text-white">{formatDate(show.showDate)}</p>
                                                    <p className="text-sm text-gray-500">{formatTime(show.showTime)}</p>
                                                </td>
                                                <td className="text-gray-300">{show.theater}</td>
                                                <td className="text-primary font-medium">₹{show.showPrice}</td>
                                                <td>
                                                    <span className={`${show.totalSeats - (show.occupiedSeats?.length || 0) > 20 ? 'text-green-500' : show.totalSeats - (show.occupiedSeats?.length || 0) > 0 ? 'text-yellow-500' : 'text-red-500'}`}>
                                                        {show.totalSeats - (show.occupiedSeats?.length || 0)}/{show.totalSeats}
                                                    </span>
                                                </td>
                                                <td>
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            onClick={() => handleEditShow(show)}
                                                            className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-primary transition-colors"
                                                        >
                                                            <Edit2 className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteShow(show._id)}
                                                            className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-red-500 transition-colors"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Bookings Table */}
                {activeTab === 'bookings' && (
                    <div className="admin-table-container">
                        <div className="overflow-x-auto">
                            <table className="table-dark">
                                <thead>
                                    <tr>
                                        <th>Customer</th>
                                        <th>Movie</th>
                                        <th>Seats</th>
                                        <th>Amount</th>
                                        <th>Status</th>
                                        <th>Date</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {bookings.length === 0 ? (
                                        <tr>
                                            <td colSpan={7} className="text-center py-12 text-gray-500">
                                                No bookings found.
                                            </td>
                                        </tr>
                                    ) : (
                                        bookings.slice(0, 20).map(booking => (
                                            <tr key={booking._id} className="cursor-pointer" onClick={() => setSelectedBooking(booking)}>
                                                <td>
                                                    <div className="flex items-center gap-3">
                                                        {booking.userInfo?.image ? (
                                                            <img
                                                                src={booking.userInfo.image}
                                                                alt={booking.userInfo.name}
                                                                className="w-10 h-10 rounded-full object-cover"
                                                            />
                                                        ) : (
                                                            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                                                                <Users className="w-5 h-5 text-primary" />
                                                            </div>
                                                        )}
                                                        <div>
                                                            <p className="text-white font-medium">{booking.userInfo?.name || 'Unknown User'}</p>
                                                            <p className="text-gray-500 text-sm">{booking.userInfo?.email || booking.user}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="text-white">{booking.movie?.title}</td>
                                                <td className="text-gray-300">
                                                    {booking.seats?.map(seat => `${seat.row}${seat.number}`).join(', ')}
                                                </td>
                                                <td className="text-primary font-medium">₹{booking.totalAmount}</td>
                                                <td>
                                                    <span className={`badge ${booking.status === 'confirmed'
                                                        ? 'badge-success'
                                                        : 'badge-error'
                                                        }`}>
                                                        {booking.status}
                                                    </span>
                                                </td>
                                                <td className="text-gray-400">{formatDate(booking.createdAt)}</td>
                                                <td>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setSelectedBooking(booking);
                                                        }}
                                                        className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-primary transition-colors"
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>

            {/* Add/Edit Show Modal */}
            {showAddModal && (
                <AddShowModal
                    editingShow={editingShow}
                    onClose={() => {
                        setShowAddModal(false);
                        setEditingShow(null);
                    }}
                    onSuccess={() => {
                        setShowAddModal(false);
                        setEditingShow(null);
                        fetchData();
                    }}
                />
            )}

            {/* Booking Details Modal */}
            {selectedBooking && (
                <BookingDetailsModal
                    booking={selectedBooking}
                    onClose={() => setSelectedBooking(null)}
                />
            )}
        </div>
    );
};

export default AdminDashboard;