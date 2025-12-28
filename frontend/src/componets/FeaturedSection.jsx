import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, Sparkles } from 'lucide-react'
import MoviesCard from './MoviesCard'
import { movieAPI } from '../lib/api'
import toast from 'react-hot-toast'

const FeaturedSection = () => {
    const navigate = useNavigate()
    const [movies, setMovies] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchNowPlayingMovies()
    }, [])

    const fetchNowPlayingMovies = async () => {
        try {
            const response = await movieAPI.getNowPlaying()
            if (response.success) {
                setMovies(response.data)
            }
        } catch (error) {
            toast.error('Failed to fetch movies')
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <section className="py-20 relative">
                <div className="container-custom">
                    <div className="section-header">
                        <div className="skeleton h-10 w-48"></div>
                        <div className="skeleton h-10 w-32"></div>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="space-y-4">
                                <div className="skeleton aspect-[2/3] rounded-2xl"></div>
                                <div className="skeleton h-6 w-3/4"></div>
                                <div className="skeleton h-4 w-1/2"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        )
    }

    return (
        <section className="py-20 relative overflow-hidden">
            {/* Background Elements */}
            <div className="blur-circle -top-48 -left-48 opacity-30"></div>
            <div className="blur-circle -bottom-48 -right-48 opacity-20"></div>

            <div className="container-custom relative z-10">
                {/* Section Header */}
                <div className="section-header">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                            <Sparkles className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                            <h2 className="section-title">Now Showing</h2>
                            <p className="text-gray-500 text-sm">Catch the latest releases</p>
                        </div>
                    </div>
                    <button
                        onClick={() => navigate('/movies')}
                        className="btn btn-ghost text-primary hover:text-primary-light"
                    >
                        View All
                        <ArrowRight className="w-4 h-4" />
                    </button>
                </div>

                {/* Movies Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                    {movies.slice(0, 5).map((movie) => (
                        <MoviesCard key={movie.id} movie={movie} />
                    ))}
                </div>

                {/* View More Button */}
                <div className="text-center mt-12">
                    <button
                        onClick={() => navigate('/movies')}
                        className="btn btn-primary px-10"
                    >
                        Explore All Movies
                        <ArrowRight className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </section>
    )
}

export default FeaturedSection