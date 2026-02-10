const mongoose = require('mongoose');

const materialSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    subject: {
        type: String,
        required: true,
    },
    className: {
        type: String, // e.g., "10"
        required: true,
    },
    section: {
        type: String, // e.g., "A"
        required: true,
    },
    fileUrl: {
        type: String,
        required: true,
    },
    fileSize: {
        type: String, // e.g., "1.2 MB"
    },
    fileType: {
        type: String, // e.g., "pdf", "video"
    },
    uploadedBy: {
        type: Number,
        ref: 'Teacher',
        required: true,
    },
    downloads: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true,
});

module.exports = mongoose.model('Material', materialSchema);
