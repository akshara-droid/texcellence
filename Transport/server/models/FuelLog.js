const mongoose = require('mongoose');

const fuelLogSchema = new mongoose.Schema({
  vehicleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle', required: true },
  driverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  tripId: { type: mongoose.Schema.Types.ObjectId, ref: 'Trip' },
  fuelType: { type: String },
  quantity: { type: Number, required: true },
  pricePerLitre: { type: Number, required: true },
  totalCost: { type: Number, required: true },
  mileageAtFill: { type: Number, required: true },
  fuelStation: { type: String },
  receiptImage: { type: String },
  date: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('FuelLog', fuelLogSchema);
