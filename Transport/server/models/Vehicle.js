const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
  registrationNumber: { type: String, required: true, unique: true },
  make: { type: String, required: true },
  model: { type: String, required: true },
  year: { type: Number, required: true },
  type: { type: String, enum: ['truck', 'van', 'car', 'heavy'], required: true },
  fuelType: { type: String, enum: ['diesel', 'petrol', 'CNG', 'electric'], required: true },
  tankCapacity: { type: Number },
  currentMileage: { type: Number, default: 0 },
  status: { type: String, enum: ['available', 'on-trip', 'maintenance', 'retired'], default: 'available' },
  assignedDriverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  insuranceExpiry: { type: Date },
  fitnessExpiry: { type: Date },
  purchaseDate: { type: Date },
  images: [{ type: String }]
}, { timestamps: true });

module.exports = mongoose.model('Vehicle', vehicleSchema);
