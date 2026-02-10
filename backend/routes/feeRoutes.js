const express = require('express');
const router = express.Router();
const FeeInvoice = require('../models/FeeInvoice');
const FeeStructure = require('../models/FeeStructure');
const Concession = require('../models/Concession');
const Student = require('../models/Student');

// @route   GET /api/fees/invoices
// @desc    Get all invoices (Admin) or single student's (Student)
// @access  Private
router.get('/invoices', async (req, res) => {
    try {
        const { studentId } = req.query;
        let query = {};

        if (studentId) {
            query.studentId = parseInt(studentId);
        }

        const invoices = await FeeInvoice.find(query).sort({ createdAt: -1 });
        res.json(invoices);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching invoices', error: error.message });
    }
});

// @route   POST /api/fees/invoices
// @desc    Create a new invoice
// @access  Private (Admin)
router.post('/invoices', async (req, res) => {
    try {
        const { studentId, month, amount, dueDate, type, description } = req.body;

        // Find student details
        const student = await Student.findOne({ _id: studentId });
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        const invoiceNumber = `INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

        const newInvoice = new FeeInvoice({
            invoiceNumber,
            studentId,
            studentName: `${student.FirstName} ${student.LastName}`,
            class: student.CurrentClass || student.AdmissionClass,
            month,
            amount,
            dueDate,
            type,
            description,
            status: 'pending'
        });

        const savedInvoice = await newInvoice.save();
        res.status(201).json(savedInvoice);
    } catch (error) {
        res.status(500).json({ message: 'Error creating invoice', error: error.message });
    }
});

// @route   GET /api/fees/structures
// @desc    Get fee structures for all classes
// @access  Private
router.get('/structures', async (req, res) => {
    try {
        const structures = await FeeStructure.find();
        res.json(structures);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching fee structures', error: error.message });
    }
});

// @route   GET /api/fees/concessions/:studentId
// @desc    Get concessions for a student
// @access  Private
const { generateMonthlyInvoices } = require('../utils/feeScheduler');

// ... existing routes ...

// @route   PUT /api/fees/invoices/:id
// @desc    Update invoice status
// @access  Private (Admin)
router.put('/invoices/:id', async (req, res) => {
    try {
        const { status, paidAmount } = req.body;
        const invoice = await FeeInvoice.findById(req.params.id);

        if (!invoice) return res.status(404).json({ message: 'Invoice not found' });

        if (paidAmount !== undefined) {
            invoice.paidAmount = paidAmount;
            invoice.remainingBalance = invoice.amount - paidAmount;

            if (invoice.remainingBalance <= 0) {
                invoice.status = 'paid';
                invoice.remainingBalance = 0;
            } else if (invoice.paidAmount > 0) {
                invoice.status = 'partially_paid';
            } else {
                invoice.status = 'pending';
            }
        } else if (status) {
            invoice.status = status;
            if (status === 'paid') {
                invoice.paidAmount = invoice.amount;
                invoice.remainingBalance = 0;
            } else if (status === 'pending') {
                invoice.paidAmount = 0;
                invoice.remainingBalance = invoice.amount;
            }
        }

        await invoice.save();
        res.json(invoice);
    } catch (error) {
        res.status(500).json({ message: 'Error updating invoice', error: error.message });
    }
});

// @route   DELETE /api/fees/invoices/month/:month
// @desc    Delete all invoices for a specific month
// @access  Private (Admin)
router.delete('/invoices/month/:month', async (req, res) => {
    try {
        const { month } = req.params;
        const result = await FeeInvoice.deleteMany({ month });
        res.json({ 
            message: `Deleted ${result.deletedCount} invoices for ${month}`,
            deletedCount: result.deletedCount 
        });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting invoices', error: error.message });
    }
});

// @route   DELETE /api/fees/invoices/:id
// @desc    Delete an invoice
// @access  Private (Admin)
router.delete('/invoices/:id', async (req, res) => {
    try {
        const invoice = await FeeInvoice.findByIdAndDelete(req.params.id);
        if (!invoice) return res.status(404).json({ message: 'Invoice not found' });
        res.json({ message: 'Invoice deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting invoice', error: error.message });
    }
});

// @route   POST /api/fees/generate-monthly
// @desc    Manually trigger batch invoice generation
// @access  Private (Admin)
router.post('/generate-monthly', async (req, res) => {
    try {
        const { month, overwrite } = req.body;
        const result = await generateMonthlyInvoices(month, overwrite);
        if (result.success) {
            res.json(result);
        } else {
            res.status(500).json({ message: 'Generation failed', error: result.error });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error triggering generation', error: error.message });
    }
});

module.exports = router;
