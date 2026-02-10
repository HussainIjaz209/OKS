const mongoose = require('mongoose');

const classSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true, // e.g., "10", "1"
    },
    section: {
        type: String, // e.g., "A", "B", "Green"
        required: true,
    },
    room: {
        type: String,
    },
    capacity: {
        type: Number,
    },
    classTeacher: {
        type: Number,
        ref: 'Teacher',
    },
    students: [{
        type: Number,
        ref: 'Student',
    }],
    subjects: [String], // Subjects taught in this class
    timetable: [{
        day: { type: String, required: true }, // e.g. "Monday"
        startTime: { type: String, required: true }, // e.g. "08:00"
        endTime: { type: String, required: true },   // e.g. "08:40"
        subject: { type: String },
        teacher: { type: String },
        room: { type: String }
    }]
}, {
    timestamps: true,
});

module.exports = mongoose.model('Class', classSchema);
