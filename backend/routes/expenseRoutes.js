const express = require('express');
const router = express.Router();
const {
    getExpenses,
    createExpense,
    deleteExpense,
    updateExpense,
    getExpenseStats
} = require('../controllers/expenseController');

router.get('/', getExpenses);
router.post('/', createExpense);
router.put('/:id', updateExpense);
router.delete('/:id', deleteExpense);
router.get('/stats', getExpenseStats);

module.exports = router;
