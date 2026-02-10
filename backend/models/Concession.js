const mongoose = require('mongoose');

const concessionSchema = new mongoose.Schema({
    studentId: {
        type: Number, // Match the legacy student ID system
        required: true
    },
    type: {
        type: String,
        default: 'No Concession'
    },
    mode: {
        type: String,
        enum: ['fixed', 'percentage'],
        default: 'fixed'
    },
    amount: {
        type: Number,
        default: 0
    },
    startMonth: {
        type: String, // Format: YYYY-MM
        required: true
    },
    endMonth: {
        type: String,
        default: null
    }
}, {
    timestamps: true,
    collection: 'concessions' // Match existing collection name
});

module.exports = mongoose.model('Concession', concessionSchema);
