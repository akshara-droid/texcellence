const express = require('express');
const router = express.Router();
const { getExpenses, createExpense, approveExpense, rejectExpense } = require('../controllers/expenseController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/').get(protect, getExpenses).post(protect, createExpense);
router.route('/:id/approve').put(protect, admin, approveExpense);
router.route('/:id/reject').put(protect, admin, rejectExpense);

module.exports = router;
