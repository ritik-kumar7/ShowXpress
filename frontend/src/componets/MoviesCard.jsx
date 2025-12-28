import { StarIcon, Play, Ticket } from 'lucide-react'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import './MoviesCard.css'

const MoviesCard = ({ movie }) => {
    const navigate = useNavigate()

    const handleMovieClick = () => {
        navigate(`/movie/${movie.id}`)
        window.scrollTo(0, 0)
    }

    const genres = {
        28: 'Action', 12: 'Adventure', 16: 'Animation', 35: 'Comedy',
        80: 'Crime', 99: 'Documentary', 18: 'Drama', 10751: 'Family',
        14: 'Fantasy', 36: 'History', 27: 'Horror', 10402: 'Music',
        9648: 'Mystery', 10749: 'Romance', 878: 'Sci-Fi', 10770: 'TV Movie',
        53: 'Thriller', 10752: 'War', 37: 'Western'
    }

    const movieGenres = movie.genre_ids?.slice(0, 2).map(id => genres[id] || 'Unknown').join(' • ') || ''

    return (
        <div className="movie-card group" onClick={handleMovieClick}>
            {/* Image Container */}
            <div className="movie-card-image">
                <img
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    alt={movie.title}
                    loading="lazy"
                />

                {/* Rating Badge */}
                <div className="movie-card-rating">
                    <StarIcon className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                    <span>{movie.vote_average?.toFixed(1)}</span>
                </div>

                {/* Hover Overlay */}
                <div className="movie-card-overlay">
                    <div className="movie-card-play">
                        <Play className="w-8 h-8 text-white fill-white" />
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="movie-card-content">
                <h3 className="movie-card-title">{movie.title}</h3>

                <div className="movie-card-meta">
                    <span className="movie-card-year">{new Date(movie.release_date).getFullYear()}</span>
                    {movieGenres && (
                        <>
                            <span className="movie-card-divider">•</span>
                            <span className="movie-card-genre">{movieGenres}</span>
                        </>
                    )}
                </div>

                <button className="movie-card-btn">
                    <Ticket className="w-4 h-4" />
                    Book Now
                </button>
            </div>
        </div>
    )
}

export default MoviesCard