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

// Match user entered password to password in database
userSchema.methods.matchPassword = async function (enteredPassword) {
    // Standard comparison for plaintext passwords to match legacy data
    return enteredPassword === this.password;
};

module.exports = mongoose.model('User', userSchema);
