const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema({
  type: { type: String, enum: ['insurance-expiry', 'license-expiry', 'maintenance-due', 'fitness-expiry', 'fuel-low', 'trip-delay'], required: true },
  referenceId: { type: mongoose.Schema.Types.ObjectId },
  referenceModel: { type: String },
  message: { type: String, required: true },
  severity: { type: String, enum: ['low', 'medium', 'high', 'critical'], default: 'medium' },
  isRead: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Alert', alertSchema);
