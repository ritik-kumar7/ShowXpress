import React, { useState, useEffect } from 'react';
import { movieAPI, showAPI } from '../../lib/api';
import { X, Search, Film, Calendar, Clock, IndianRupee, Building2, Plus, Edit2, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

const AddShowModal = ({ onClose, onSuccess, editingShow }) => {
    const [movies, setMovies] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedMovie, setSelectedMovie] = useState(null);
    const [showData, setShowData] = useState({
        showPrice: '',
        showDate: '',
        theater: 'PVR Cinemas'
    });
    const [showTimes, setShowTimes] = useState(['']); // Array of time slots
    const [loading, setLoading] = useState(false);
    const [searchLoading, setSearchLoading] = useState(false);

    const isEditing = !!editingShow;

    useEffect(() => {
        if (editingShow) {
            // Pre-fill form for editing (single time only)
            setSelectedMovie(editingShow.movie);
            const showTime = new Date(editingShow.showTime);
            setShowData({
                showPrice: editingShow.showPrice.toString(),
                showDate: editingShow.showDate,
                theater: editingShow.theater
            });
            setShowTimes([showTime.toTimeString().slice(0, 5)]);
        } else {
            fetchPopularMovies();
        }
    }, [editingShow]);

    const fetchPopularMovies = async () => {
        setSearchLoading(true);
        try {
            const response = await movieAPI.getPopular();
            if (response.success) {
                setMovies(response.data);
            }
        } catch (error) {
            toast.error('Failed to fetch movies');
        } finally {
            setSearchLoading(false);
        }
    };

    const handleMovieSelect = (movie) => {
        setSelectedMovie(movie);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setShowData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleTimeChange = (index, value) => {
        const newTimes = [...showTimes];
        newTimes[index] = value;
        setShowTimes(newTimes);
    };

    const addTimeSlot = () => {
        setShowTimes([...showTimes, '']);
    };

    const removeTimeSlot = (index) => {
        if (showTimes.length > 1) {
            const newTimes = showTimes.filter((_, i) => i !== index);
            setShowTimes(newTimes);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!selectedMovie) {
            toast.error('Please select a movie');
            return;
        }

        // Filter out empty time slots
        const validTimes = showTimes.filter(time => time.trim() !== '');

        if (!showData.showPrice || validTimes.length === 0 || !showData.showDate) {
            toast.error('Please fill all required fields including at least one show time');
            return;
        }

        setLoading(true);
        try {
            if (isEditing) {
                // Update existing show (single time)
                const response = await showAPI.updateShow(editingShow._id, {
                    showPrice: parseFloat(showData.showPrice),
                    showTime: new Date(`${showData.showDate}T${validTimes[0]}`).toISOString(),
                    showDate: showData.showDate,
                    theater: showData.theater
                });

                if (response.success) {
                    toast.success('Show updated successfully!');
                    onSuccess();
                } else {
                    toast.error(response.message || 'Failed to update show');
                }
            } else {
                // Add multiple shows
                let successCount = 0;
                let failCount = 0;

                for (const time of validTimes) {
                    try {
                        const response = await showAPI.addShow({
                            movieId: selectedMovie.id,
                            showPrice: parseFloat(showData.showPrice),
                            showTime: new Date(`${showData.showDate}T${time}`).toISOString(),
                            showDate: showData.showDate,
                            theater: showData.theater
                        });

                        if (response.success) {
                            successCount++;
                        } else {
                            failCount++;
                        }
                    } catch (error) {
                        failCount++;
                    }
                }

                if (successCount > 0) {
                    toast.success(`${successCount} show${successCount > 1 ? 's' : ''} added successfully!`);
                    onSuccess();
                }
                if (failCount > 0) {
                    toast.error(`Failed to add ${failCount} show${failCount > 1 ? 's' : ''}`);
                }
            }
        } catch (error) {
            toast.error(isEditing ? 'Failed to update show' : 'Failed to add shows');
        } finally {
            setLoading(false);
        }
    };

    const filteredMovies = movies.filter(movie =>
        movie.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getTodayDate = () => {
        return new Date().toISOString().split('T')[0];
    };

    const theaters = [
        'PVR Cinemas',
        'INOX',
        'IMAX',
        'Cinepolis',
        'Carnival Cinemas',
        'Miraj Cinemas',
        'Fun Cinemas'
    ];

    return (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
            <div className="modal-content max-w-5xl">
                {/* Header */}
                <div className="modal-header">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center shadow-lg">
                                <Film className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-white">
                                    {isEditing ? 'Edit Show' : 'Add New Show'}
                                </h2>
                                <p className="text-gray-400 text-sm">
                                    {isEditing ? 'Update show details' : 'Create a new movie show'}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-3 rounded-xl hover:bg-white/10 text-gray-400 hover:text-white transition-all duration-200 hover:scale-105"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="modal-body">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Left Column - Movie Selection */}
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <Film className="w-5 h-5 text-primary" />
                                <h3 className="text-lg font-semibold text-white">
                                    {isEditing ? 'Selected Movie' : 'Select Movie'}
                                </h3>
                            </div>

                            {/* Search (only when adding) */}
                            {!isEditing && (
                                <div className="relative mb-6">
                                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5 pointer-events-none" />
                                    <input
                                        type="text"
                                        placeholder="Search for movies by title..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="input-dark pl-14 pr-4 py-3 text-base"
                                    />
                                </div>
                            )}

                            {/* Selected Movie Preview */}
                            {selectedMovie && (
                                <div className="mb-6 p-5 rounded-2xl bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/30 shadow-lg">
                                    <div className="flex items-center gap-5">
                                        <div className="relative">
                                            <img
                                                src={`https://image.tmdb.org/t/p/w200${selectedMovie.poster_path}`}
                                                alt={selectedMovie.title}
                                                className="w-20 h-28 object-cover rounded-xl shadow-md"
                                            />
                                            <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                                                <span className="text-white text-xs font-bold">✓</span>
                                            </div>
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-bold text-white text-lg mb-1">{selectedMovie.title}</h4>
                                            <div className="flex items-center gap-4 text-sm text-gray-400">
                                                <span className="flex items-center gap-1">
                                                    <Calendar className="w-4 h-4" />
                                                    {new Date(selectedMovie.release_date).getFullYear()}
                                                </span>
                                                {selectedMovie.runtime && (
                                                    <span className="flex items-center gap-1">
                                                        <Clock className="w-4 h-4" />
                                                        {selectedMovie.runtime} min
                                                    </span>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-1 mt-2">
                                                <span className="text-yellow-400">★</span>
                                                <span className="text-sm text-gray-300">
                                                    {selectedMovie.vote_average?.toFixed(1) || 'N/A'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Movie List (only when adding) */}
                            {!isEditing && (
                                <div className="max-h-80 overflow-y-auto rounded-2xl border border-white/10 bg-black/20">
                                    {searchLoading ? (
                                        <div className="p-12 text-center">
                                            <div className="loader mx-auto mb-4"></div>
                                            <p className="text-gray-400">Loading movies...</p>
                                        </div>
                                    ) : filteredMovies.length === 0 ? (
                                        <div className="p-12 text-center">
                                            <Film className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                                            <p className="text-gray-400">No movies found</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-2 p-3">
                                            {filteredMovies.map(movie => (
                                                <button
                                                    key={movie.id}
                                                    type="button"
                                                    onClick={() => handleMovieSelect(movie)}
                                                    className={`w-full p-4 text-left rounded-xl transition-all duration-200 ${selectedMovie?.id === movie.id
                                                        ? 'bg-primary/20 border-2 border-primary/50 shadow-lg'
                                                        : 'hover:bg-white/8 border-2 border-transparent hover:border-white/10'
                                                        }`}
                                                >
                                                    <div className="flex items-center gap-4">
                                                        <img
                                                            src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                                                            alt={movie.title}
                                                            className="w-12 h-16 object-cover rounded-lg shadow-sm"
                                                        />
                                                        <div className="flex-1">
                                                            <h4 className="font-semibold text-white text-sm mb-1">{movie.title}</h4>
                                                            <div className="flex items-center gap-3 text-xs text-gray-400">
                                                                <span>{new Date(movie.release_date).getFullYear()}</span>
                                                                <span className="flex items-center gap-1">
                                                                    <span className="text-yellow-400">★</span>
                                                                    {movie.vote_average?.toFixed(1)}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        {selectedMovie?.id === movie.id && (
                                                            <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                                                                <span className="text-white text-xs font-bold">✓</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Right Column - Show Details */}
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <Calendar className="w-5 h-5 text-primary" />
                                <h3 className="text-lg font-semibold text-white">Show Details</h3>
                            </div>

                            <div className="space-y-6">
                                {/* Theater */}
                                <div className="form-group">
                                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-300 mb-3">
                                        <Building2 className="w-5 h-5 text-primary" />
                                        Theater
                                    </label>
                                    <select
                                        name="theater"
                                        value={showData.theater}
                                        onChange={handleInputChange}
                                        className="input-dark cursor-pointer py-3"
                                    >
                                        {theaters.map(theater => (
                                            <option key={theater} value={theater}>{theater}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Date */}
                                <div className="form-group">
                                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-300 mb-3">
                                        <Calendar className="w-5 h-5 text-primary" />
                                        Show Date *
                                    </label>
                                    <input
                                        type="date"
                                        name="showDate"
                                        value={showData.showDate}
                                        onChange={handleInputChange}
                                        min={getTodayDate()}
                                        required
                                        className="input-dark py-3"
                                    />
                                </div>

                                {/* Multiple Show Times */}
                                <div className="form-group">
                                    <div className="flex items-center justify-between mb-3">
                                        <label className="flex items-center gap-2 text-sm font-semibold text-gray-300">
                                            <Clock className="w-5 h-5 text-primary" />
                                            Show Times * {!isEditing && `(${showTimes.filter(t => t).length} time${showTimes.filter(t => t).length !== 1 ? 's' : ''})`}
                                        </label>
                                        {!isEditing && (
                                            <button
                                                type="button"
                                                onClick={addTimeSlot}
                                                className="btn btn-secondary text-xs px-3 py-1.5 flex items-center gap-1 hover:bg-primary/20 hover:border-primary/50"
                                            >
                                                <Plus className="w-3.5 h-3.5" />
                                                Add Time
                                            </button>
                                        )}
                                    </div>
                                    <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
                                        {showTimes.map((time, index) => (
                                            <div key={index} className="flex items-center gap-3">
                                                <div className="flex-1 relative">
                                                    <Clock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5 pointer-events-none" />
                                                    <input
                                                        type="time"
                                                        value={time}
                                                        onChange={(e) => handleTimeChange(index, e.target.value)}
                                                        required
                                                        className="input-dark pl-14 py-3 w-full"
                                                        placeholder="Select time"
                                                    />
                                                </div>
                                                {!isEditing && showTimes.length > 1 && (
                                                    <button
                                                        type="button"
                                                        onClick={() => removeTimeSlot(index)}
                                                        className="p-3 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/30 hover:border-red-500/50 transition-all"
                                                    >
                                                        <Trash2 className="w-5 h-5" />
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                    {!isEditing && (
                                        <p className="text-xs text-gray-500 mt-3 flex items-center gap-1">
                                            <span className="text-primary">💡</span>
                                            Add multiple show times to create several shows at once for the same movie
                                        </p>
                                    )}
                                </div>

                                {/* Price */}
                                <div className="form-group">
                                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-300 mb-3">
                                        <IndianRupee className="w-5 h-5 text-primary" />
                                        Ticket Price (₹) *
                                    </label>
                                    <div className="relative">
                                        <IndianRupee className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5 pointer-events-none" />
                                        <input
                                            type="number"
                                            name="showPrice"
                                            value={showData.showPrice}
                                            onChange={handleInputChange}
                                            min="50"
                                            max="2000"
                                            step="10"
                                            required
                                            placeholder="Enter ticket price (e.g., 250)"
                                            className="input-dark pl-14 py-3"
                                        />
                                    </div>
                                    <p className="text-xs text-gray-500 mt-2">Price should be between ₹50 and ₹2000</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="modal-footer">
                        <div className="flex flex-col sm:flex-row justify-end gap-4">
                            <button
                                type="button"
                                onClick={onClose}
                                className="btn btn-secondary px-8 py-3 order-2 sm:order-1"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading || !selectedMovie}
                                className="btn btn-primary px-8 py-3 disabled:opacity-50 disabled:cursor-not-allowed order-1 sm:order-2 shadow-lg"
                            >
                                {loading ? (
                                    <span className="flex items-center gap-3">
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        {isEditing ? 'Updating Show...' : 'Creating Show...'}
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-3">
                                        {isEditing ? <Edit2 className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                                        {isEditing ? 'Update Show' : 'Create Show'}
                                    </span>
                                )}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddShowModal;