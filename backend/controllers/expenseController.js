const Expense = require('../models/Expense');
const Teacher = require('../models/Teacher');

// @desc    Get all expenses
// @route   GET /api/expenses
exports.getExpenses = async (req, res) => {
    try {
        const { category, startDate, endDate } = req.query;
        let query = {};

        if (category && category !== 'All') {
            query.category = category;
        }

        if (startDate || endDate) {
            query.date = {};
            if (startDate) query.date.$gte = new Date(startDate);
            if (endDate) query.date.$lte = new Date(endDate);
        }

        const expenses = await Expense.find(query).sort({ date: -1 });
        res.status(200).json({ success: true, data: expenses });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Create new expense
// @route   POST /api/expenses
exports.createExpense = async (req, res) => {
    try {
        const expense = await Expense.create(req.body);
        res.status(201).json({ success: true, data: expense });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc    Update expense
// @route   PUT /api/expenses/:id
exports.updateExpense = async (req, res) => {
    try {
        const expense = await Expense.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if (!expense) {
            return res.status(404).json({ success: false, message: 'Expense not found' });
        }
        res.status(200).json({ success: true, data: expense });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc    Delete expense
// @route   DELETE /api/expenses/:id
exports.deleteExpense = async (req, res) => {
    try {
        const expense = await Expense.findByIdAndDelete(req.params.id);
        if (!expense) {
            return res.status(404).json({ success: false, message: 'Expense not found' });
        }
        res.status(200).json({ success: true, message: 'Expense deleted' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get expense summary/stats
// @route   GET /api/expenses/stats
exports.getExpenseStats = async (req, res) => {
    try {
        const stats = await Expense.aggregate([
            { $match: { status: 'Paid' } },
            {
                $group: {
                    _id: '$category',
                    total: { $sum: '$amount' },
                    count: { $sum: 1 }
                }
            }
        ]);

        const totalSpent = stats.reduce((acc, curr) => acc + curr.total, 0);

        res.status(200).json({
            success: true,
            data: {
                totalSpent,
                byCategory: stats
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
