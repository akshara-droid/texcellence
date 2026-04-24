const mongoose = require('mongoose');

const tripSchema = new mongoose.Schema({
  tripCode: { type: String, required: true, unique: true },
  vehicleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle', required: true },
  driverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  origin: { type: String, required: true },
  destination: { type: String, required: true },
  distance: { type: Number },
  startTime: { type: Date },
  endTime: { type: Date },
  status: { type: String, enum: ['scheduled', 'in-progress', 'completed', 'cancelled'], default: 'scheduled' },
  purpose: { type: String },
  cargoDetails: { type: String },
  startMileage: { type: Number },
  endMileage: { type: Number },
  fuelUsed: { type: Number },
  notes: { type: String },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('Trip', tripSchema);
