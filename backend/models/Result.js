const mongoose = require('mongoose');

const resultSchema = new mongoose.Schema({
    exam: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Exam',
        required: true,
    },
    student: {
        type: Number, // Student ID matches legacy schema
        ref: 'Student',
        required: true,
    },
    marks: [{
        subject: { type: String, required: true },
        obtainedMarks: { type: Number, required: true },
        totalMarks: { type: Number, required: true },
        grade: { type: String },
        remarks: { type: String }
    }],
    totalObtained: { type: Number },
    totalMax: { type: Number },
    percentage: { type: Number },
    overallGrade: { type: String },
    resultStatus: {
        type: String, // "Pass", "Fail"
    }
}, {
    timestamps: true,
});

module.exports = mongoose.model('Result', resultSchema);
