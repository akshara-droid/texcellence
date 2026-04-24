const mongoose = require('mongoose');

const maintenanceLogSchema = new mongoose.Schema({
  vehicleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle', required: true },
  maintenanceType: { type: String, enum: ['scheduled', 'breakdown', 'repair', 'inspection'], required: true },
  description: { type: String, required: true },
  cost: { type: Number, required: true },
  serviceProvider: { type: String },
  serviceDate: { type: Date, required: true },
  nextServiceDate: { type: Date },
  nextServiceMileage: { type: Number },
  partsReplaced: [{ type: String }],
  mechanicName: { type: String },
  status: { type: String, enum: ['pending', 'in-progress', 'completed'], default: 'pending' },
  invoiceImage: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('MaintenanceLog', maintenanceLogSchema);
