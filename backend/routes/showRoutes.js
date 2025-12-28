import express from "express";
import {
    genNowPlayingMovies,
    getPopularMovies,
    getMovieDetails,
    addShow,
    getAllShows,
    getShowsByMovie,
    getShowById,
    deleteShow,
    updateShow
} 
from "../controllers/ShowController.js";

const showRouter = express.Router();

// Movie routes
showRouter.get('/now-playing', genNowPlayingMovies);
showRouter.get('/popular', getPopularMovies);
showRouter.get('/movie/:movieId', getMovieDetails);

// Show routes
showRouter.post('/add-show', addShow);
showRouter.get('/all', getAllShows);
showRouter.get('/movie/:movieId/shows', getShowsByMovie);
showRouter.get('/:showId', getShowById);
showRouter.put('/:showId', updateShow);
showRouter.delete('/:showId', deleteShow);

export default showRouter;