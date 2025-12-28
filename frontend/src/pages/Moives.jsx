import React, { useState, useEffect } from 'react'
import { movieAPI } from '../lib/api'
import MoviesCard from '../componets/MoviesCard'
import { Search, Filter, Film, X } from 'lucide-react'
import toast from 'react-hot-toast'

const Movies = () => {
    const [movies, setMovies] = useState([])
    const [filteredMovies, setFilteredMovies] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedGenre, setSelectedGenre] = useState('')

    const genres = {
        28: 'Action', 12: 'Adventure', 16: 'Animation', 35: 'Comedy',
        80: 'Crime', 99: 'Documentary', 18: 'Drama', 10751: 'Family',
        14: 'Fantasy', 36: 'History', 27: 'Horror', 10402: 'Music',
        9648: 'Mystery', 10749: 'Romance', 878: 'Sci-Fi', 10770: 'TV Movie',
        53: 'Thriller', 10752: 'War', 37: 'Western'
    }

    useEffect(() => {
        fetchMovies()
    }, [])

    useEffect(() => {
        filterMovies()
    }, [movies, searchTerm, selectedGenre])

    const fetchMovies = async () => {
        try {
            const [nowPlayingResponse, popularResponse] = await Promise.all([
                movieAPI.getNowPlaying(),
                movieAPI.getPopular()
            ])

            let allMovies = []
            if (nowPlayingResponse.success) {
                allMovies = [...allMovies, ...nowPlayingResponse.data]
            }
            if (popularResponse.success) {
                allMovies = [...allMovies, ...popularResponse.data]
            }

            // Remove duplicates based on movie ID
            const uniqueMovies = allMovies.filter((movie, index, self) =>
                index === self.findIndex(m => m.id === movie.id)
            )

            setMovies(uniqueMovies)
        } catch (error) {
            toast.error('Failed to fetch movies')
        } finally {
            setLoading(false)
        }
    }

    const filterMovies = () => {
        let filtered = movies

        // Filter by search term
        if (searchTerm) {
            filtered = filtered.filter(movie =>
                movie.title.toLowerCase().includes(searchTerm.toLowerCase())
            )
        }

        // Filter by genre
        if (selectedGenre) {
            filtered = filtered.filter(movie =>
                movie.genre_ids && movie.genre_ids.includes(parseInt(selectedGenre))
            )
        }

        setFilteredMovies(filtered)
    }

    const clearFilters = () => {
        setSearchTerm('')
        setSelectedGenre('')
    }

    if (loading) {
        return (
            <div className="min-h-screen pt-24 pb-16">
                <div className="container-custom">
                    {/* Header Skeleton */}
                    <div className="mb-12">
                        <div className="skeleton h-12 w-64 mb-4"></div>
                        <div className="skeleton h-6 w-96"></div>
                    </div>

                    {/* Filters Skeleton */}
                    <div className="flex gap-4 mb-8">
                        <div className="skeleton h-12 flex-1 max-w-md rounded-xl"></div>
                        <div className="skeleton h-12 w-48 rounded-xl"></div>
                    </div>

                    {/* Grid Skeleton */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                        {[...Array(10)].map((_, i) => (
                            <div key={i} className="space-y-4">
                                <div className="skeleton aspect-[2/3] rounded-2xl"></div>
                                <div className="skeleton h-6 w-3/4"></div>
                                <div className="skeleton h-4 w-1/2"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen pt-24 pb-16 relative overflow-hidden">
            {/* Background Elements */}
            <div className="blur-circle -top-48 -right-48 opacity-20"></div>
            <div className="blur-circle bottom-0 -left-48 opacity-15"></div>

            <div className="container-custom relative z-10">
                {/* Header */}
                <div className="mb-12">
                    <div className="flex items-center gap-4 mb-4">

                        <div>
                            <h1 className="text-4xl font-bold text-white">All Movies</h1>
                            <p className="text-gray-400">
                                Discover and book your next movie experience
                            </p>
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex flex-col md:flex-row gap-4 mb-8">
                    {/* Search */}
                    <div className="relative flex-1 max-w-xl">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search movies..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="input-dark pl-12 pr-4"
                        />
                    </div>

                    {/* Genre Filter */}
                    <div className="relative">
                        <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                        <select
                            value={selectedGenre}
                            onChange={(e) => setSelectedGenre(e.target.value)}
                            className="input-dark pl-12 pr-10 min-w-[180px] appearance-none cursor-pointer"
                        >
                            <option value="">All Genres</option>
                            {Object.entries(genres).map(([id, name]) => (
                                <option key={id} value={id}>{name}</option>
                            ))}
                        </select>
                    </div>

                    {/* Clear Filters */}
                    {(searchTerm || selectedGenre) && (
                        <button
                            onClick={clearFilters}
                            className="btn btn-ghost text-gray-400 hover:text-white"
                        >
                            <X className="w-4 h-4" />
                            Clear Filters
                        </button>
                    )}
                </div>

                {/* Results count */}
                <div className="flex items-center justify-between mb-8">
                    <p className="text-gray-400">
                        Showing <span className="text-white font-semibold">{filteredMovies.length}</span> of {movies.length} movies
                    </p>
                </div>

                {/* Movies Grid */}
                {filteredMovies.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="w-20 h-20 rounded-full bg-surface-light flex items-center justify-center mx-auto mb-6">
                            <Film className="w-10 h-10 text-gray-500" />
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-2">No movies found</h2>
                        <p className="text-gray-400 mb-6">Try adjusting your search or filter criteria</p>
                        <button onClick={clearFilters} className="btn btn-primary">
                            Clear Filters
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                        {filteredMovies.map((movie) => (
                            <MoviesCard key={movie.id} movie={movie} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default Movies