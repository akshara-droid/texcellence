const Expense = require('../models/Expense');

const getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find().populate('vehicleId').populate('driverId').populate('tripId');
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createExpense = async (req, res) => {
  try {
    const expense = await Expense.create(req.body);
    res.status(201).json(expense);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const approveExpense = async (req, res) => {
  try {
    const expense = await Expense.findByIdAndUpdate(req.params.id, { status: 'approved', approvedBy: req.user._id }, { new: true });
    res.json(expense);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const rejectExpense = async (req, res) => {
  try {
    const expense = await Expense.findByIdAndUpdate(req.params.id, { status: 'rejected' }, { new: true });
    res.json(expense);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = { getExpenses, createExpense, approveExpense, rejectExpense };
