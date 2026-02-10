const mongoose = require('mongoose');

const evaluationSchema = new mongoose.Schema({
    student: {
        type: Number,
        ref: 'Student',
        required: true
    },
    teacher: {
        type: Number,
        ref: 'Teacher',
        required: true
    },
    class: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Class'
    },
    term: {
        type: String,
        required: true
    },
    academicYear: {
        type: String,
        required: true
    },
    evaluations: [{
        category: { type: String, required: true },
        question: { type: String, required: true },
        score: { type: Number, required: true, min: 1, max: 5 }
    }],
    overallComments: {
        type: String
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Evaluation', evaluationSchema);
