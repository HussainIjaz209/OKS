const mongoose = require('mongoose');

const feeInvoiceSchema = new mongoose.Schema({
    invoiceNumber: {
        type: String,
        required: true,
        unique: true
    },
    studentId: {
        type: Number, // Link to legacy student ID
        required: true
    },
    studentName: String,
    class: String,
    month: {
        type: String, // Format: YYYY-MM
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    dueDate: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ['paid', 'pending', 'overdue', 'partially_paid'],
        default: 'pending'
    },
    paidAmount: {
        type: Number,
        default: 0
    },
    remainingBalance: {
        type: Number
    },
    type: {
        type: String,
        default: 'Tuition Fee'
    },
    paymentDate: Date,
    description: String
}, {
    timestamps: true,
    collection: 'fee_invoices' // Match user mentioned name
});

module.exports = mongoose.model('FeeInvoice', feeInvoiceSchema);
