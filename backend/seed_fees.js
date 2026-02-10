const mongoose = require('mongoose');
const FeeInvoice = require('./models/FeeInvoice');
const Student = require('./models/Student');

async function seedFees() {
    try {
        await mongoose.connect('mongodb://localhost:27017/OKS');
        console.log('Connected to OKS DB');

        const studentId = 148; // Hamdan Khan
        const student = await Student.findById(studentId);

        if (!student) {
            console.error('Student 148 not found');
            process.exit(1);
        }

        const sampleInvoices = [
            {
                invoiceNumber: 'INV-2024-001',
                studentId: studentId,
                studentName: `${student.FirstName} ${student.LastName}`,
                class: student.CurrentClass || 'Foundation 1',
                month: '2024-11',
                amount: 5000,
                paidAmount: 5000,
                remainingBalance: 0,
                dueDate: new Date('2024-11-10'),
                status: 'paid',
                type: 'Tuition Fee',
                description: 'November 2024 Tuition Fee'
            },
            {
                invoiceNumber: 'INV-2024-002',
                studentId: studentId,
                studentName: `${student.FirstName} ${student.LastName}`,
                class: student.CurrentClass || 'Foundation 1',
                month: '2024-12',
                amount: 5000,
                paidAmount: 2000,
                remainingBalance: 3000,
                dueDate: new Date('2024-12-10'),
                status: 'partially_paid',
                type: 'Tuition Fee',
                description: 'December 2024 Tuition Fee'
            },
            {
                invoiceNumber: 'INV-2025-001',
                studentId: studentId,
                studentName: `${student.FirstName} ${student.LastName}`,
                class: student.CurrentClass || 'Foundation 1',
                month: '2025-01',
                amount: 5000,
                paidAmount: 0,
                remainingBalance: 5000,
                dueDate: new Date('2025-01-10'),
                status: 'pending',
                type: 'Tuition Fee',
                description: 'January 2025 Tuition Fee'
            }
        ];

        await FeeInvoice.deleteMany({ studentId: studentId });
        await FeeInvoice.insertMany(sampleInvoices);
        console.log('Sample fee invoices seeded for student 148');
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

seedFees();
