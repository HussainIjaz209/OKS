const mongoose = require('mongoose');

const feeStructureSchema = new mongoose.Schema({
    class: {
        type: String,
        required: true,
        unique: true
    },
    monthlyFee: {
        type: Number,
        required: true
    },
    annualFees: {
        exam: { type: Number, default: 0 },
        sports: { type: Number, default: 0 },
        medical: { type: Number, default: 0 },
        promotion: { type: Number, default: 0 },
        registration: { type: Number, default: 0 }
    }
}, {
    timestamps: true,
    collection: 'fee_structures' // Match existing collection name
});

module.exports = mongoose.model('FeeStructure', feeStructureSchema);
