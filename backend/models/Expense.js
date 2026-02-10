const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    amount: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        required: true,
        enum: ['Salary', 'Building Rent', 'Maintenance', 'Utilities', 'Stationery', 'Other'],
        default: 'Other'
    },
    payee: {
        type: String, // Name of person or entity receiving payment
        required: true
    },
    teacher: {
        type: Number, // Reference to Teacher ID if it's a salary
        ref: 'Teacher'
    },
    date: {
        type: Date,
        default: Date.now
    },
    paymentMethod: {
        type: String,
        enum: ['Cash', 'Bank Transfer', 'Cheque', 'Other'],
        default: 'Cash'
    },
    description: {
        type: String,
        trim: true
    },
    status: {
        type: String,
        enum: ['Paid', 'Pending'],
        default: 'Paid'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Expense', expenseSchema);
