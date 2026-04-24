const MaintenanceLog = require('../models/MaintenanceLog');

const getMaintenanceLogs = async (req, res) => {
  try {
    const logs = await MaintenanceLog.find().populate('vehicleId');
    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createMaintenanceLog = async (req, res) => {
  try {
    const log = await MaintenanceLog.create(req.body);
    res.status(201).json(log);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateMaintenanceLog = async (req, res) => {
  try {
    const log = await MaintenanceLog.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(log);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = { getMaintenanceLogs, createMaintenanceLog, updateMaintenanceLog };
