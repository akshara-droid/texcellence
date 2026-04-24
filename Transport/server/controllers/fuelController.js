const FuelLog = require('../models/FuelLog');

const getFuelLogs = async (req, res) => {
  try {
    const logs = await FuelLog.find().populate('vehicleId').populate('driverId');
    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getFuelLogById = async (req, res) => {
  try {
    const log = await FuelLog.findById(req.params.id).populate('vehicleId').populate('driverId');
    if (log) res.json(log);
    else res.status(404).json({ message: 'Fuel Log not found' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createFuelLog = async (req, res) => {
  try {
    const log = await FuelLog.create(req.body);
    res.status(201).json(log);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = { getFuelLogs, getFuelLogById, createFuelLog };
