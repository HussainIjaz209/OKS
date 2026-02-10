const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    className: {
        type: String, // e.g., "Play Group Rose"
        required: true
    },
    subject: {
        type: String,
        required: true
    },
    teacher: {
        type: Number,
        ref: 'Teacher',
        required: true
    },
    dueDate: {
        type: Date,
        required: true
    },
    points: {
        type: Number,
        default: 100
    },
    status: {
        type: String,
        enum: ['active', 'completed', 'draft'],
        default: 'active'
    },
    file: {
        type: String // Path to uploaded file
    },
    submissions: [{
        student: {
            type: Number,
            ref: 'Student'
        },
        status: {
            type: String,
            enum: ['submitted', 'pending'],
            default: 'pending'
        },
        markedDate: {
            type: Date,
            default: Date.now
        }
    }]
}, {
    timestamps: true
});

module.exports = mongoose.model('Assignment', assignmentSchema);
