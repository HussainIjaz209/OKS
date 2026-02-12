const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.Mixed,
    },
    username: {
        type: String,
        required: true,
        unique: true,
    },
    studentId: {
        type: Number,
    },
    teacherId: {
        type: Number,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['admin', 'student', 'teacher'],
        default: 'student',
    },
}, {
    timestamps: true,
});

const { comparePassword } = require('../utils/hashUtils');

// Match user entered password to password in database
userSchema.methods.matchPassword = async function (enteredPassword) {
    // If password is plain text (legacy), do direct comparison
    if (this.password.length < 60) { // SHA-256 hex is 64 chars
        return enteredPassword === this.password;
    }
    // Otherwise comparing hash
    return comparePassword(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
