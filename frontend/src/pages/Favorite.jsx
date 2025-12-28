import React, { useState, useEffect } from 'react'
import { useUser } from '@clerk/clerk-react'
import { Heart, Star, Trash2, Calendar, Film } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const Favorite = () => {
    const { user } = useUser()
    const navigate = useNavigate()
    const [favorites, setFavorites] = useState([])

    useEffect(() => {
        // Load favorites from localStorage
        const savedFavorites = localStorage.getItem(`favorites_${user?.id}`)
        if (savedFavorites) {
            setFavorites(JSON.parse(savedFavorites))
        }
    }, [user])

    const removeFavorite = (movieId) => {
        const updatedFavorites = favorites.filter(movie => movie.id !== movieId)
        setFavorites(updatedFavorites)
        localStorage.setItem(`favorites_${user?.id}`, JSON.stringify(updatedFavorites))
    }

    const handleMovieClick = (movieId) => {
        navigate(`/movie/${movieId}`)
        window.scrollTo(0, 0)
    }

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center pt-24">
                <div className="text-center">
                    <div className="w-20 h-20 rounded-full bg-surface-light flex items-center justify-center mx-auto mb-6">
                        <Heart className="w-10 h-10 text-gray-500" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">Please Sign In</h2>
                    <p className="text-gray-400">You need to sign in to view your favorite movies</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen pt-24 pb-16 relative overflow-hidden">
            {/* Background Elements */}
            <div className="blur-circle -top-48 -right-48 opacity-20"></div>

            <div className="container-custom relative z-10">
                {/* Header */}
                <div className="flex items-center gap-4 mb-10">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-red-500 to-pink-600 flex items-center justify-center">
                        <Heart className="w-7 h-7 text-white fill-white" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-white">My Favorites</h1>
                        <p className="text-gray-400">{favorites.length} movies saved</p>
                    </div>
                </div>

                {favorites.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="w-20 h-20 rounded-full bg-surface-light flex items-center justify-center mx-auto mb-6">
                            <Heart className="w-10 h-10 text-gray-500" />
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-2">No Favorites Yet</h2>
                        <p className="text-gray-400 mb-6">Start adding movies to your favorites by clicking the heart icon</p>
                        <button
                            onClick={() => navigate('/movies')}
                            className="btn btn-primary"
                        >
                            Browse Movies
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                        {favorites.map(movie => (
                            <div key={movie.id} className="card group">
                                <div className="card-image aspect-[2/3] relative">
                                    <img
                                        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                                        alt={movie.title}
                                        className="w-full h-full object-cover cursor-pointer"
                                        onClick={() => handleMovieClick(movie.id)}
                                    />

                                    {/* Rating Badge */}
                                    <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-lg glass">
                                        <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                                        <span className="text-sm font-semibold text-white">{movie.vote_average?.toFixed(1)}</span>
                                    </div>

                                    {/* Remove Button */}
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            removeFavorite(movie.id);
                                        }}
                                        className="absolute top-3 left-3 p-2 rounded-lg bg-red-500/80 text-white hover:bg-red-600 transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>

                                    {/* Overlay */}
                                    <div className="card-overlay flex flex-col justify-end p-4">
                                        <button
                                            onClick={() => handleMovieClick(movie.id)}
                                            className="btn btn-primary w-full opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            View Details
                                        </button>
                                    </div>
                                </div>

                                <div className="p-4">
                                    <h3 className="font-semibold text-white text-lg mb-2 line-clamp-1 group-hover:text-primary transition-colors">
                                        {movie.title}
                                    </h3>
                                    <div className="flex items-center gap-2 text-gray-400 text-sm">
                                        <Calendar className="w-4 h-4" />
                                        <span>{new Date(movie.release_date).getFullYear()}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default Favorite