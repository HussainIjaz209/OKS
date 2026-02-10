const mongoose = require('mongoose');

const teacherSchema = new mongoose.Schema({
    _id: Number,
    user: {
        type: mongoose.Schema.Types.Mixed,
        ref: 'User',
        required: true,
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    // Job Application Fields
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    fatherName: { type: String, required: true },
    dateOfBirth: { type: Date, required: true },
    gender: { type: String, required: true },
    maritalStatus: { type: String },
    city: { type: String, required: true },

    // Contact
    whatsappNumber: { type: String, required: true },
    email: { type: String, required: true },

    // Education
    degreeTitle: { type: String, required: true },
    subjectMajor: { type: String, required: true },
    universityBoard: { type: String, required: true },
    passingYear: { type: String, required: true },
    gradeCGPA: { type: String, required: true },

    // Experience
    totalExperience: { type: Number, required: true },

    // Academic (Existing)
    subjects: [{
        type: String,
    }],
    classes: [{
        type: mongoose.Schema.Types.ObjectId, // Kept for backward compatibility if any
        ref: 'Class',
    }],
    timetable: [{
        day: {
            type: String,
            enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        },
        period: Number,
        subject: String,
        class: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Class',
        }
    }]
}, {
    timestamps: true,
});

module.exports = mongoose.model('Teacher', teacherSchema);
