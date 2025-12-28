import axios from "axios";
import Show from "../models/ShowModel.js";
import MoviesModel from "../models/MoviesModel.js";

// Get now playing movies from TMDB
const genNowPlayingMovies = async (req, res) => {
    try {
        const response = await axios.get('https://api.themoviedb.org/3/movie/now_playing', {
            headers: {
                Authorization: `Bearer ${process.env.TMDB_API_KEY}`
            }
        });

        const data = response.data.results;

        return res.status(200).json({
            success: true,
            message: "Now playing movies generated successfully",
            data: data
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

// Get popular movies from TMDB
const getPopularMovies = async (req, res) => {
    try {
        const response = await axios.get('https://api.themoviedb.org/3/movie/popular', {
            headers: {
                Authorization: `Bearer ${process.env.TMDB_API_KEY}`
            }
        });

        return res.status(200).json({
            success: true,
            data: response.data.results
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

// Get movie details by ID
const getMovieDetails = async (req, res) => {
    try {
        const { movieId } = req.params;

        const [movieResponse, creditsResponse, videosResponse] = await Promise.all([
            axios.get(`https://api.themoviedb.org/3/movie/${movieId}`, {
                headers: {
                    Authorization: `Bearer ${process.env.TMDB_API_KEY}`
                }
            }),
            axios.get(`https://api.themoviedb.org/3/movie/${movieId}/credits`, {
                headers: {
                    Authorization: `Bearer ${process.env.TMDB_API_KEY}`
                }
            }),
            axios.get(`https://api.themoviedb.org/3/movie/${movieId}/videos`, {
                headers: {
                    Authorization: `Bearer ${process.env.TMDB_API_KEY}`
                }
            })
        ]);

        const movieData = movieResponse.data;
        const creditsData = creditsResponse.data;
        const videosData = videosResponse.data;

        return res.status(200).json({
            success: true,
            data: {
                ...movieData,
                cast: creditsData.cast,
                videos: videosData.results
            }
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

// Add a new show
const addShow = async (req, res) => {
    try {
        const { movieId, showPrice, showTime, showDate, theater } = req.body;

        // Check if movie exists in our database
        let movie = await MoviesModel.findOne({ movieId });

        if (!movie) {
            // Fetch movie details from TMDB and save to database
            const [movieDetailsResponse, movieCreditsResponse] = await Promise.all([
                axios.get(`https://api.themoviedb.org/3/movie/${movieId}`, {
                    headers: {
                        Authorization: `Bearer ${process.env.TMDB_API_KEY}`
                    }
                }),
                axios.get(`https://api.themoviedb.org/3/movie/${movieId}/credits`, {
                    headers: {
                        Authorization: `Bearer ${process.env.TMDB_API_KEY}`
                    }
                })
            ]);

            const movieApiData = movieDetailsResponse.data;
            const movieApiCreditsData = movieCreditsResponse.data;

            movie = await MoviesModel.create({
                movieId: movieId,
                title: movieApiData.title,
                overview: movieApiData.overview,
                backdrop_path: movieApiData.backdrop_path,
                poster_path: movieApiData.poster_path,
                release_date: movieApiData.release_date,
                runtime: movieApiData.runtime,
                vote_average: movieApiData.vote_average,
                vote_count: movieApiData.vote_count,
                genres: movieApiData.genres,
                original_language: movieApiData.original_language,
                tagline: movieApiData.tagline,
                cast: movieApiCreditsData.cast
            });
        }

        // Create the show
        const show = await Show.create({
            movie: movie._id,
            showPrice,
            showTime,
            showDate,
            theater: theater || "PVR Cinemas",
            occupiedSeats: []
        });

        const populatedShow = await Show.findById(show._id).populate('movie');

        return res.status(201).json({
            success: true,
            message: "Show added successfully",
            data: populatedShow
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

// Get all shows
const getAllShows = async (req, res) => {
    try {
        const shows = await Show.find().populate('movie').sort({ showDate: 1, showTime: 1 });

        return res.status(200).json({
            success: true,
            data: shows
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

// Get shows by movie ID
const getShowsByMovie = async (req, res) => {
    try {
        const { movieId } = req.params;

        // Find movie in our database
        const movie = await MoviesModel.findOne({ movieId });
        if (!movie) {
            return res.status(404).json({
                success: false,
                message: "Movie not found"
            });
        }

        const shows = await Show.find({ movie: movie._id })
            .populate('movie')
            .sort({ showDate: 1, showTime: 1 });

        return res.status(200).json({
            success: true,
            data: shows
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

// Get show by ID
const getShowById = async (req, res) => {
    try {
        const { showId } = req.params;

        const show = await Show.findById(showId).populate('movie');
        if (!show) {
            return res.status(404).json({
                success: false,
                message: "Show not found"
            });
        }

        return res.status(200).json({
            success: true,
            data: show
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

// Delete show (admin)
const deleteShow = async (req, res) => {
    try {
        const { showId } = req.params;

        const show = await Show.findByIdAndDelete(showId);
        if (!show) {
            return res.status(404).json({
                success: false,
                message: "Show not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Show deleted successfully"
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

// Update show (admin)
const updateShow = async (req, res) => {
    try {
        const { showId } = req.params;
        const { showPrice, showTime, showDate, theater } = req.body;

        const show = await Show.findById(showId);
        if (!show) {
            return res.status(404).json({
                success: false,
                message: "Show not found"
            });
        }

        // Update fields if provided
        if (showPrice !== undefined) show.showPrice = showPrice;
        if (showTime !== undefined) show.showTime = showTime;
        if (showDate !== undefined) show.showDate = showDate;
        if (theater !== undefined) show.theater = theater;

        await show.save();

        const updatedShow = await Show.findById(showId).populate('movie');

        return res.status(200).json({
            success: true,
            message: "Show updated successfully",
            data: updatedShow
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

export {
    genNowPlayingMovies,
    getPopularMovies,
    getMovieDetails,
    addShow,
    getAllShows,
    getShowsByMovie,
    getShowById,
    deleteShow,
    updateShow
};