const mongoose = require('mongoose');

const announcementSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    sender: {
        type: mongoose.Schema.Types.Mixed,
        ref: 'User', // Admin or Teacher usually
    },
    authorName: String, // Friendly name for display
    audience: {
        type: String,
        enum: ['all', 'students', 'teachers', 'parents', 'class'],
        default: 'all',
    },
    className: String, // Target class name (if audience is 'class')
    section: String,   // Target section (if audience is 'class')
    teacherId: Number, // Reference to Teacher._id
    priority: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'medium',
    },
    expiresAt: Date, // Optional auto-delete or hide date
}, {
    timestamps: true,
});

module.exports = mongoose.model('Announcement', announcementSchema);
