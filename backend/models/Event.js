const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    fullDescription: {
        type: String,
    },
    date: {
        type: Date,
        required: true,
    },
    location: {
        type: String,
        default: 'School Campus',
    },
    category: {
        type: String,
        enum: ['Sports', 'Academic', 'Cultural', 'Arts', 'Competitions', 'General'],
        default: 'General',
    },
    gradient: {
        type: String,
    },
    images: [{
        type: String, // URLs to images
    }],
    videos: [{
        type: String, // URLs to videos
    }],
    isPublished: {
        type: Boolean,
        default: true,
    }
}, {
    timestamps: true,
});

module.exports = mongoose.model('Event', eventSchema);
