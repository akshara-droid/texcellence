const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  reportType: { type: String, enum: ['monthly', 'trip', 'fuel', 'driver', 'vehicle'], required: true },
  generatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  parameters: { type: mongoose.Schema.Types.Mixed },
  filePath: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Report', reportSchema);
