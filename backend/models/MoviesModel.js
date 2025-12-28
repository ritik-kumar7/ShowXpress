import mongoose from "mongoose";

const moviesSchema = new mongoose.Schema({
    movieId: { type: String, required: true },
    title: { type: String, required: true },
    overview: { type: String, required: true },
    backdrop_path: { type: String, required: true },
    poster_path: { type: String, required: true },
    release_date: { type: String, required: true },
    runtime: { type: Number, required: true },
    vote_average: { type: Number, required: true },
    vote_count: { type: Number, required: true },
    genres: { type: Array, required: true },
    original_language: { type: String },
    tagline: { type: String },
    cast: { type: Array },


}, { timestamps: true })

export default mongoose.model("Movies", moviesSchema);