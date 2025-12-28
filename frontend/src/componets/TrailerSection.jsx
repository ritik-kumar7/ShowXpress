import React, { useState, useEffect, useRef } from 'react'
import { Play, X, Volume2, VolumeX, Star, Clock, Film } from 'lucide-react'
import { movieAPI } from '../lib/api'
import './TrailerSection.css'

const TrailerSection = () => {
    const [movies, setMovies] = useState([])
    const [selectedMovie, setSelectedMovie] = useState(null)
    const [trailerKey, setTrailerKey] = useState(null)
    const [loading, setLoading] = useState(true)
    const [isPlaying, setIsPlaying] = useState(false)
    const [isMuted, setIsMuted] = useState(true)
    const playerRef = useRef(null)

    useEffect(() => {
        fetchPopularMovies()
    }, [])

    const fetchPopularMovies = async () => {
        try {
            const response = await movieAPI.getPopular()
            if (response.success && response.data.length > 0) {
                const moviesData = response.data.slice(0, 8)
                setMovies(moviesData)
                setSelectedMovie(moviesData[0])
                // Fetch trailer for first movie
                fetchTrailer(moviesData[0].id)
            }
        } catch (error) {
            console.error('Failed to fetch popular movies:', error)
        } finally {
            setLoading(false)
        }
    }

    const fetchTrailer = async (movieId) => {
        try {
            const response = await movieAPI.getMovieDetails(movieId)
            if (response.success && response.data.videos?.length > 0) {
                const trailer = response.data.videos.find(
                    v => v.type === 'Trailer' && v.site === 'YouTube'
                ) || response.data.videos[0]
                setTrailerKey(trailer?.key || null)
            } else {
                setTrailerKey(null)
            }
        } catch (error) {
            console.error('Failed to fetch trailer:', error)
            setTrailerKey(null)
        }
    }

    const handleMovieSelect = (movie) => {
        setSelectedMovie(movie)
        setIsPlaying(false)
        fetchTrailer(movie.id)
    }

    const handlePlayTrailer = () => {
        if (trailerKey) {
            setIsPlaying(true)
        }
    }

    if (loading) {
        return (
            <section className="popular-section py-20">
                <div className="container-custom">
                    <div className="skeleton h-10 w-64 mb-8 mx-auto"></div>
                    <div className="skeleton aspect-video rounded-2xl mb-6"></div>
                    <div className="grid grid-cols-4 gap-4">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="skeleton aspect-video rounded-xl"></div>
                        ))}
                    </div>
                </div>
            </section>
        )
    }

    const year = selectedMovie?.release_date?.split('-')[0] || ''

    return (
        <section className="popular-section py-20 relative overflow-hidden">
            {/* Background Elements */}
            <div className="popular-bg-glow"></div>

            <div className="container-custom relative z-10">
                {/* Section Header */}
                <div className="text-center mb-10">
                    <div className="trending-badge">
                        <Film className="w-5 h-5 text-primary" />
                        <span>Trending Now</span>
                    </div>
                    <h2 className="popular-title">Popular Movies</h2>
                    <p className="popular-description">
                        Discover the most popular movies everyone's talking about
                    </p>
                </div>

                {/* Featured Movie with Trailer */}
                {selectedMovie && (
                    <div className="featured-trailer-container">
                        <div className="featured-trailer">
                            {isPlaying && trailerKey ? (
                                <iframe
                                    ref={playerRef}
                                    src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&mute=${isMuted ? 1 : 0}&controls=1&rel=0`}
                                    title={selectedMovie.title}
                                    className="featured-trailer-video"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                />
                            ) : (
                                <>
                                    <img
                                        src={`https://image.tmdb.org/t/p/original${selectedMovie.backdrop_path}`}
                                        alt={selectedMovie.title}
                                        className="featured-trailer-image"
                                    />

                                    {/* Gradient Overlay */}
                                    <div className="featured-trailer-overlay"></div>

                                    {/* Play Button - only show if trailer is available */}
                                    {trailerKey ? (
                                        <button
                                            className="featured-play-btn"
                                            onClick={handlePlayTrailer}
                                        >
                                            <div className="featured-play-icon">
                                                <Play className="w-8 h-8 text-white fill-white ml-1" />
                                            </div>
                                            <span className="featured-play-text">Watch Trailer</span>
                                        </button>
                                    ) : (
                                        <div className="featured-play-btn" style={{ cursor: 'default' }}>
                                            <div className="featured-play-icon" style={{ opacity: 0.5 }}>
                                                <Play className="w-8 h-8 text-white fill-white ml-1" />
                                            </div>
                                            <span className="featured-play-text">Loading Trailer...</span>
                                        </div>
                                    )}

                                    {/* Movie Info */}
                                    <div className="featured-info">
                                        <h3 className="featured-info-title">{selectedMovie.title}</h3>
                                        <div className="featured-info-meta">
                                            <span className="featured-meta-item">
                                                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                                                {selectedMovie.vote_average?.toFixed(1)}
                                            </span>
                                            <span className="featured-meta-divider">•</span>
                                            <span>{year}</span>
                                        </div>
                                        <p className="featured-info-overview">
                                            {selectedMovie.overview}
                                        </p>
                                    </div>
                                </>
                            )}

                            {/* Mute Toggle for Playing Video */}
                            {isPlaying && trailerKey && (
                                <button
                                    className="featured-mute-btn"
                                    onClick={() => setIsMuted(!isMuted)}
                                >
                                    {isMuted ? (
                                        <VolumeX className="w-5 h-5" />
                                    ) : (
                                        <Volume2 className="w-5 h-5" />
                                    )}
                                </button>
                            )}

                            {/* Close Button for Playing Video */}
                            {isPlaying && (
                                <button
                                    className="featured-close-btn"
                                    onClick={() => setIsPlaying(false)}
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            )}
                        </div>
                    </div>
                )}

                {/* Movie Thumbnails */}
                <div className="popular-thumbnails">
                    <p className="thumbnails-label">Select a movie to watch trailer</p>
                    <div className="thumbnails-grid">
                        {movies.map((movie) => (
                            <div
                                key={movie.id}
                                className={`thumbnail-card ${selectedMovie?.id === movie.id ? 'active' : ''}`}
                                onClick={() => handleMovieSelect(movie)}
                            >
                                <img
                                    src={`https://image.tmdb.org/t/p/w500${movie.backdrop_path || movie.poster_path}`}
                                    alt={movie.title}
                                    className="thumbnail-image"
                                />
                                <div className="thumbnail-overlay">
                                    <Play className="w-6 h-6 text-white" />
                                </div>
                                <div className="thumbnail-info">
                                    <span className="thumbnail-title">{movie.title}</span>
                                </div>
                                {selectedMovie?.id === movie.id && (
                                    <div className="thumbnail-active-indicator"></div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}

export default TrailerSection