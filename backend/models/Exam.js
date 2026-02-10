const mongoose = require('mongoose');

const examSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true, // e.g., "Final Term 2024", "Mid Term"
    },
    class: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Class',
        required: true,
    },
    term: {
        type: String, // e.g., "First Term", "Mid Term", "Final Term"
    },
    sessions: [{
        subject: { type: String, required: true },
        date: { type: Date, required: true },
        startTime: { type: String, required: true },
        duration: { type: String, required: true }, // e.g., "2 Hours"
        room: { type: String },
        totalMarks: { type: Number, default: 100 }
    }],
    status: {
        type: String,
        enum: ['upcoming', 'ongoing', 'completed'],
        default: 'upcoming'
    }
}, {
    timestamps: true,
});

module.exports = mongoose.model('Exam', examSchema);
