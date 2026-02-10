const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.Mixed,
        ref: 'User',
        required: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Admin', adminSchema);
