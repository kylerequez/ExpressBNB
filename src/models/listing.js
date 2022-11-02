const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const reviewSchema = new Schema({
    rating: {
        type: Number,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    review: {
        type: String,
        required: true
    },
    datePosted: {
        type: Date,
        default: Date.now
    }
});

const listingSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    datePosted: {
        type: Date,
        default: Date.now
    },
    reviews: [reviewSchema]
});
module.exports = new model('Listing', listingSchema);