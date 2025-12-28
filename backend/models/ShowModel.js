import mongoose from "mongoose";

const showSchema = new mongoose.Schema({
    movie: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Movies'
    },
    showPrice: {
        type: Number,
        required: true,
    },
    showTime: {
        type: Date,
        required: true
    },
    showDate: {
        type: String,
        required: true
    },
    theater: {
        type: String,
        required: true,
        default: "PVR Cinemas"
    },
    totalSeats: {
        type: Number,
        default: 100
    },
    occupiedSeats: {
        type: Array,
        default: []
    }
}, { timestamps: true })


export default mongoose.model("Show", showSchema);
