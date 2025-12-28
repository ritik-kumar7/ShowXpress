import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Play, Star, Clock, Calendar, ArrowRight, Info } from 'lucide-react'
import { movieAPI } from '../lib/api'
import './HeroSection.css'

const HeroSection = () => {
    const navigate = useNavigate()
    const [featuredMovie, setFeaturedMovie] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchFeaturedMovie()
    }, [])

    const fetchFeaturedMovie = async () => {
        try {
            const response = await movieAPI.getNowPlaying()
            if (response.success && response.data?.length > 0) {
                // Get a random movie from the top 5
                const topMovies = response.data.slice(0, 5)
                const randomMovie = topMovies[Math.floor(Math.random() * topMovies.length)]

                // Fetch full details
                const detailsResponse = await movieAPI.getMovieDetails(randomMovie.id)
                if (detailsResponse.success) {
                    setFeaturedMovie(detailsResponse.data)
                } else {
                    setFeaturedMovie(randomMovie)
                }
            }
        } catch (error) {
            console.error('Failed to fetch featured movie:', error)
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <div className="hero">
                <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent">
                    <div className="container-custom h-full flex items-center">
                        <div className="space-y-6 max-w-2xl">
                            <div className="skeleton h-8 w-48"></div>
                            <div className="skeleton h-16 w-96"></div>
                            <div className="skeleton h-24 w-full"></div>
                            <div className="flex gap-4">
                                <div className="skeleton h-14 w-40"></div>
                                <div className="skeleton h-14 w-40"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    if (!featuredMovie) {
        return (
            <div className="hero bg-gradient-to-br from-surface to-background">
                <div className="container-custom text-center">
                    <h1 className="text-5xl md:text-7xl font-bold mb-6 gradient-text">
                        CineBook
                    </h1>
                    <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
                        Book your favorite movies with the best seats in town.
                        Premium cinema experience awaits you.
                    </p>
                    <button
                        onClick={() => navigate('/movies')}
                        className="btn btn-primary text-lg px-8 py-4"
                    >
                        Browse Movies
                        <ArrowRight className="w-5 h-5" />
                    </button>
                </div>
            </div>
        )
    }

    const backdropUrl = `https://image.tmdb.org/t/p/original${featuredMovie.backdrop_path}`
    const genres = featuredMovie.genres?.map(g => g.name).join(' • ') || 'Action • Adventure'
    const rating = featuredMovie.vote_average?.toFixed(1) || 'N/A'
    const runtime = featuredMovie.runtime ? `${Math.floor(featuredMovie.runtime / 60)}h ${featuredMovie.runtime % 60}m` : '2h 30m'
    const year = featuredMovie.release_date?.split('-')[0] || '2024'

    return (
        <div className="hero relative">
            {/* Background Image */}
            <div className="hero-background">
                <img
                    src={backdropUrl}
                    alt={featuredMovie.title}
                    className="w-full h-full object-cover"
                />
                {/* Gradient Overlays - Much lighter for better visibility */}
                <div className="absolute inset-0 bg-gradient-to-r from-background/60 via-background/20 to-transparent"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent"></div>
            </div>

            {/* Content */}
            <div className="hero-content pt-24">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6">
                    <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
                    <span className="text-sm font-medium text-gray-300">Now Showing</span>
                </div>

                {/* Title */}
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4 leading-tight">
                    {featuredMovie.title}
                </h1>

                {/* Meta Info */}
                <div className="flex flex-wrap items-center gap-4 mb-6 text-gray-300">
                    <div className="flex items-center gap-1">
                        <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                        <span className="font-semibold text-white">{rating}</span>
                        <span className="text-gray-500">/10</span>
                    </div>
                    <div className="w-1 h-1 bg-gray-500 rounded-full"></div>
                    <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{year}</span>
                    </div>
                    <div className="w-1 h-1 bg-gray-500 rounded-full"></div>
                    <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{runtime}</span>
                    </div>
                </div>

                {/* Genres */}
                <p className="text-primary font-medium mb-4">{genres}</p>

                {/* Overview */}
                <p className="text-gray-400 text-lg leading-relaxed mb-8 max-w-xl line-clamp-3">
                    {featuredMovie.overview || featuredMovie.tagline || 'Experience the magic of cinema with this incredible movie.'}
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-wrap gap-4">
                    <button
                        onClick={() => navigate(`/movie/${featuredMovie.id}`)}
                        className="btn btn-primary text-lg px-8 py-4"
                    >
                        <Play className="w-5 h-5 fill-white" />
                        Book Now
                    </button>
                    <button
                        onClick={() => navigate(`/movie/${featuredMovie.id}`)}
                        className="btn btn-secondary text-lg px-8 py-4"
                    >
                        <Info className="w-5 h-5" />
                        More Info
                    </button>
                </div>

                {/* Cast Preview */}
                {featuredMovie.cast && featuredMovie.cast.length > 0 && (
                    <div className="mt-10">
                        <p className="text-gray-500 text-sm mb-3">Starring</p>
                        <div className="flex items-center gap-3">
                            {featuredMovie.cast.slice(0, 4).map((actor, index) => (
                                <div key={index} className="flex items-center gap-2">
                                    {actor.profile_path ? (
                                        <img
                                            src={`https://image.tmdb.org/t/p/w185${actor.profile_path}`}
                                            alt={actor.name}
                                            className="w-10 h-10 rounded-full object-cover ring-2 ring-white/20"
                                        />
                                    ) : (
                                        <div className="w-10 h-10 rounded-full bg-surface-light flex items-center justify-center">
                                            <span className="text-sm font-medium">{actor.name?.charAt(0)}</span>
                                        </div>
                                    )}
                                    <span className="text-sm text-gray-300 hidden lg:block">{actor.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Decorative Elements */}
            <div className="blur-circle top-1/4 -right-48 opacity-30"></div>
            <div className="blur-circle bottom-0 left-1/4 opacity-20"></div>
        </div>
    )
}

export default HeroSection