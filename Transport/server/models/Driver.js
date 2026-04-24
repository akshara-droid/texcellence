const mongoose = require('mongoose');

const driverSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  licenseNumber: { type: String, required: true, unique: true },
  licenseExpiry: { type: Date, required: true },
  licenseType: { type: String },
  experience: { type: Number },
  emergencyContact: { type: String },
  address: { type: String },
  bloodGroup: { type: String },
  joiningDate: { type: Date, default: Date.now },
  currentVehicleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle' },
  totalTrips: { type: Number, default: 0 },
  rating: { type: Number, default: 5 },
  isAvailable: { type: Boolean, default: true },
  documents: [{ type: String }]
}, { timestamps: true });

module.exports = mongoose.model('Driver', driverSchema);
