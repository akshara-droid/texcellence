const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  vehicleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle' },
  driverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  tripId: { type: mongoose.Schema.Types.ObjectId, ref: 'Trip' },
  category: { type: String, enum: ['fuel', 'toll', 'repair', 'parking', 'misc'], required: true },
  amount: { type: Number, required: true },
  description: { type: String },
  receiptImage: { type: String },
  date: { type: Date, default: Date.now },
  approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' }
}, { timestamps: true });

module.exports = mongoose.model('Expense', expenseSchema);
