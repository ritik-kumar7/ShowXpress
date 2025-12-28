import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { movieAPI, showAPI } from '../lib/api';
import { Calendar, Clock, Star, Users, ArrowLeft, Play, Heart } from 'lucide-react';
import toast from 'react-hot-toast';
import './MovieDetails.css';

const MovieDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useUser();
    const [movie, setMovie] = useState(null);
    const [shows, setShows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [hasAttemptedFetch, setHasAttemptedFetch] = useState(false);
    const [selectedDate, setSelectedDate] = useState('');
    const [isFavorite, setIsFavorite] = useState(false);

    useEffect(() => {
        fetchMovieDetails();
        fetchShows();
    }, [id]);

    const fetchMovieDetails = async () => {
        try {
            const response = await movieAPI.getMovieDetails(id);
            if (response.success) {
                setMovie(response.data);
            } else {
                setHasAttemptedFetch(true);
                setLoading(false);
            }
        } catch (error) {
            toast.error('Failed to fetch movie details');
            setHasAttemptedFetch(true);
            setLoading(false);
        }
    };

    const fetchShows = async () => {
        try {
            const response = await showAPI.getShowsByMovie(id);
            if (response.success) {
                setShows(response.data);
                // Set default date to first available show date
                if (response.data.length > 0) {
                    setSelectedDate(response.data[0].showDate);
                }
            }
        } catch (error) {
            toast.error('Failed to fetch shows');
        } finally {
            // Only set loading to false after both requests complete
            setHasAttemptedFetch(true);
            setLoading(false);
        }
    };

    // Check if movie is in favorites
    useEffect(() => {
        if (user && movie) {
            const savedFavorites = localStorage.getItem(`favorites_${user.id}`);
            if (savedFavorites) {
                const favorites = JSON.parse(savedFavorites);
                setIsFavorite(favorites.some(fav => fav.id === movie.id));
            }
        }
    }, [user, movie]);

    const toggleFavorite = () => {
        if (!user) {
            toast.error('Please sign in to add favorites');
            return;
        }

        const savedFavorites = localStorage.getItem(`favorites_${user.id}`);
        let favorites = savedFavorites ? JSON.parse(savedFavorites) : [];

        if (isFavorite) {
            // Remove from favorites
            favorites = favorites.filter(fav => fav.id !== movie.id);
            toast.success('Removed from favorites');
        } else {
            // Add to favorites
            favorites.push({
                id: movie.id,
                title: movie.title,
                poster_path: movie.poster_path,
                backdrop_path: movie.backdrop_path,
                vote_average: movie.vote_average,
                release_date: movie.release_date,
                overview: movie.overview
            });
            toast.success('Added to favorites!');
        }

        localStorage.setItem(`favorites_${user.id}`, JSON.stringify(favorites));
        setIsFavorite(!isFavorite);
    };

    const handleShowSelect = (showId) => {
        navigate(`/movie/${id}/${showId}`);
    };

    // Filter shows that haven't passed yet
    const getActiveShows = () => {
        const now = new Date();
        return shows.filter(show => {
            const showDateTime = new Date(`${show.showDate}T${new Date(show.showTime).toTimeString().slice(0, 8)}`);
            return showDateTime > now;
        });
    };

    const getUniqueShowDates = () => {
        const activeShows = getActiveShows();
        const dates = [...new Set(activeShows.map(show => show.showDate))];
        return dates.sort();
    };

    const getShowsForDate = (date) => {
        const activeShows = getActiveShows();
        return activeShows.filter(show => show.showDate === date);
    };

    const formatTime = (timeString) => {
        return new Date(timeString).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    };

    const formatDateShort = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            weekday: 'short',
            day: 'numeric',
            month: 'short'
        });
    };

    if (loading || !movie) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="loader"></div>
            </div>
        );
    }

    if (hasAttemptedFetch && !movie) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-white mb-4">Movie not found</h2>
                    <button
                        onClick={() => navigate('/')}
                        className="btn btn-primary"
                    >
                        Go Home
                    </button>
                </div>
            </div>
        );
    }

    // Ensure movie data exists before rendering
    if (!movie) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="loader"></div>
            </div>
        );
    }

    const backdropUrl = `https://image.tmdb.org/t/p/original${movie.backdrop_path}`;
    const posterUrl = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
    const rating = movie.vote_average?.toFixed(1) || 'N/A';
    const runtime = movie.runtime ? `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m` : 'N/A';

    return (
        <div className="min-h-screen">
            {/* Hero Section with Backdrop */}
            <div className="relative min-h-[70vh]">
                {/* Background Image */}
                <div className="absolute inset-0">
                    <img
                        src={backdropUrl}
                        alt={movie.title}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-transparent"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent"></div>
                </div>

                {/* Content */}
                <div className="relative z-10 container-custom pb-12" style={{ paddingTop: '100px' }}>
                    {/* Back Button */}
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        <span>Back</span>
                    </button>

                    <div className="flex flex-col md:flex-row gap-8">
                        {/* Poster */}
                        <div className="flex-shrink-0">
                            <img
                                src={posterUrl}
                                alt={movie.title}
                                className="w-72 object-cover rounded-2xl shadow-2xl ring-1 ring-white/10"
                                style={{ height: '450px' }}
                            />
                        </div>

                        {/* Info */}
                        <div className="flex-1 pt-4">
                            {/* Title */}
                            <h1 className="text-4xl md:text-5xl font-bold text-white" style={{ marginBottom: '16px' }}>
                                {movie.title}
                            </h1>

                            {/* Tagline */}
                            {movie.tagline && (
                                <p className="text-xl text-gray-400 italic" style={{ marginBottom: '24px' }}>
                                    "{movie.tagline}"
                                </p>
                            )}

                            {/* Meta Info Row */}
                            <div className="flex flex-wrap items-center gap-4" style={{ marginBottom: '20px' }}>
                                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg glass">
                                    <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                                    <span className="text-white font-semibold">{rating}</span>
                                    <span className="text-gray-500">/10</span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-300">
                                    <Calendar className="w-5 h-5 text-primary" />
                                    <span>{new Date(movie.release_date).getFullYear()}</span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-300">
                                    <Clock className="w-5 h-5 text-primary" />
                                    <span>{runtime}</span>
                                </div>
                            </div>

                            {/* Genres */}
                            <div className="flex flex-wrap gap-2" style={{ marginBottom: '20px' }}>
                                {movie.genres?.map(genre => (
                                    <span
                                        key={genre.id}
                                        className="px-4 py-1.5 rounded-full text-sm font-medium bg-primary/20 text-primary border border-primary/30"
                                    >
                                        {genre.name}
                                    </span>
                                ))}
                            </div>

                            {/* Overview */}
                            <p className="text-gray-400 text-lg leading-relaxed max-w-2xl" style={{ marginBottom: '28px' }}>
                                {movie.overview}
                            </p>

                            {/* Action Buttons */}
                            <div className="flex flex-wrap gap-4" style={{ marginTop: '8px' }}>
                                <button
                                    onClick={() => document.getElementById('show-times')?.scrollIntoView({ behavior: 'smooth' })}
                                    className="btn btn-primary text-lg px-8"
                                >
                                    <Play className="w-5 h-5 fill-white" />
                                    Book Tickets
                                </button>
                                <button
                                    onClick={toggleFavorite}
                                    className={`btn ${isFavorite ? 'btn-primary' : 'btn-secondary'}`}
                                >
                                    <Heart className={`w-5 h-5 ${isFavorite ? 'fill-white' : ''}`} />
                                    {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Cast Section */}
            {movie.cast && movie.cast.length > 0 && (
                <section className="py-12 relative">
                    <div className="container-custom">
                        <h2 className="text-2xl font-bold text-white mb-6">Cast</h2>
                        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-track-surface scrollbar-thumb-primary">
                            {movie.cast.slice(0, 10).map(actor => (
                                <div key={actor.id} className="flex-shrink-0 w-32 text-center">
                                    <div className="w-32 h-32 rounded-full overflow-hidden mb-3 ring-2 ring-white/10 mx-auto">
                                        {actor.profile_path ? (
                                            <img
                                                src={`https://image.tmdb.org/t/p/w200${actor.profile_path}`}
                                                alt={actor.name}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-surface-light flex items-center justify-center text-2xl font-bold text-gray-500">
                                                {actor.name?.charAt(0)}
                                            </div>
                                        )}
                                    </div>
                                    <p className="font-medium text-white text-sm mb-1 line-clamp-1">{actor.name}</p>
                                    <p className="text-xs text-gray-500 line-clamp-1">{actor.character}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Show Times Section */}
            <section id="show-times" className="showtimes-section">
                <div className="container-custom">
                    <div className="showtimes-header">
                        <div className="showtimes-header-icon">
                            <Clock className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h2 className="showtimes-title">Show Times</h2>
                            <p className="showtimes-subtitle">Select your preferred date and time</p>
                        </div>
                    </div>

                    {getUniqueShowDates().length === 0 ? (
                        <div className="no-shows-card">
                            <div className="no-shows-icon">
                                <Calendar className="w-10 h-10 text-gray-500" />
                            </div>
                            <h3 className="no-shows-title">No Shows Available</h3>
                            <p className="no-shows-text">Check back later for show times</p>
                        </div>
                    ) : (
                        <div className="showtimes-content">
                            {/* Date Selection */}
                            <div className="date-selector">
                                {getUniqueShowDates().map(date => (
                                    <button
                                        key={date}
                                        onClick={() => setSelectedDate(date)}
                                        className={`date-btn ${selectedDate === date ? 'active' : ''}`}
                                    >
                                        <Calendar className="w-4 h-4" />
                                        <span>{formatDateShort(date)}</span>
                                    </button>
                                ))}
                            </div>

                            {/* Show Times Grid */}
                            {selectedDate && (
                                <div className="showtime-cards-grid">
                                    {getShowsForDate(selectedDate).map(show => {
                                        const availableSeats = show.totalSeats - show.occupiedSeats.length;
                                        const isSoldOut = availableSeats <= 0;

                                        return (
                                            <div
                                                key={show._id}
                                                className={`showtime-card ${isSoldOut ? 'sold-out' : ''}`}
                                            >
                                                <div className="showtime-card-header">
                                                    <div className="showtime-time-block">
                                                        <span className="showtime-time">{formatTime(show.showTime)}</span>
                                                        <span className="showtime-theater">{show.theater}</span>
                                                    </div>
                                                    <div className="showtime-price-block">
                                                        <span className="showtime-price">₹{show.showPrice}</span>
                                                        <span className="showtime-price-label">per seat</span>
                                                    </div>
                                                </div>

                                                <div className="showtime-seats-info">
                                                    <Users className="w-4 h-4" />
                                                    <span className={`seats-count ${availableSeats > 20 ? 'high' : availableSeats > 0 ? 'low' : 'none'}`}>
                                                        {isSoldOut ? 'Sold Out' : `${availableSeats} seats available`}
                                                    </span>
                                                </div>

                                                <button
                                                    onClick={() => handleShowSelect(show._id)}
                                                    disabled={isSoldOut}
                                                    className={`showtime-book-btn ${isSoldOut ? 'disabled' : ''}`}
                                                >
                                                    {isSoldOut ? 'Sold Out' : 'Select Seats'}
                                                </button>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
};

export default MovieDetails;