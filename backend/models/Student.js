const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    _id: Number, // Explicitly define _id as Number to match legacy DB schema validation
    user: {
        type: Number,
        ref: 'User',
    },
    RollNo: {
        type: Number,
    },
    username: {
        type: String,
    },
    password: {
        type: String,
    },
    FirstName: {
        type: String,
        required: true,
    },
    LastName: {
        type: String,
        required: true,
    },
    Gender: {
        type: String,
        enum: ['Male', 'Female', 'Other'],
    },
    DateOfBirth: {
        type: Date,
    },
    AdmissionDate: {
        type: Date,
    },
    AdmissionClass: {
        type: String,
    },
    Religion: {
        type: String,
    },
    CNIC: {
        type: String,
    },
    FatherOccupation: {
        type: String,
    },
    PresentAddress: {
        type: String,
    },
    GuardianName: {
        type: String,
    },
    GuardianContactNo: {
        type: String,
    },
    Relation: {
        type: String,
    },
    GuardianPresentAddress: {
        type: String,
    },
    CurrentClass: {
        type: String,
    },
    // New fields for Admission Form migration
    bloodGroup: {
        type: String,
    },
    status: {
        type: String, // 'pending', 'approved', 'rejected', 'active', 'withdrawn'
        default: 'pending',
    },
    withdrawnDate: {
        type: Date,
    },
    declarationAccepted: {
        type: Boolean,
        default: false,
    },
    profilePicture: {
        type: String,
    },
    FatherName: {
        type: String,
    },
    MotherName: {
        type: String,
    },
    // Legacy fields for backward compatibility
    rollNumber: {
        type: String,
    },
    class: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Class',
    },
    section: {
        type: String,
    },
    fatherName: {
        type: String,
    },
    motherName: {
        type: String,
    },
    dateOfBirth: {
        type: Date,
    },
    contactNumber: {
        type: String,
    },
    address: {
        type: String,
    },
    assignments: [{
        title: String,
        score: Number,
        status: {
            type: String,
            enum: ['pending', 'submitted', 'graded', 'overdue'],
            default: 'pending'
        },
        submissionLink: String,
        feedback: String,
        dueDate: Date
    }],
    attendance: [{
        date: {
            type: Date,
            default: Date.now
        },
        status: {
            type: String,
            enum: ['present', 'absent', 'late', 'excused'],
            default: 'present'
        }
    }],
    fees: [{
        month: String,
        amount: Number,
        status: {
            type: String,
            enum: ['paid', 'unpaid', 'partial'],
            default: 'unpaid'
        },
        paymentDate: Date
    }]
}, {
    timestamps: true,
});

module.exports = mongoose.model('Student', studentSchema);
