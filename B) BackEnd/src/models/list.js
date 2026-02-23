const mongoose = require('mongoose');

const paintingSchema = new mongoose.Schema({
    image: {
        type: String,
        required: true
    },
    imageURL: {
        type: String,
        required: true
    },
    imageID: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    artist: {
        type: String,
        required: true
    },
    year: {
        type: Number,
        required: false
    },
    style: {
        type: String,
        required: true
    },
    medium: {
        type: String,
        required: true
    },
    dimensions: {
        type: String,
        required: true
    },
    price: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Painting', paintingSchema);
