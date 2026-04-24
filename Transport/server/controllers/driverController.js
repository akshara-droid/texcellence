const Driver = require('../models/Driver');

const getDrivers = async (req, res) => {
  try {
    const drivers = await Driver.find().populate('userId', 'fullName email phone').populate('currentVehicleId', 'registrationNumber make model');
    res.json(drivers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getDriverById = async (req, res) => {
  try {
    const driver = await Driver.findById(req.params.id).populate('userId').populate('currentVehicleId');
    if (driver) res.json(driver);
    else res.status(404).json({ message: 'Driver not found' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createDriver = async (req, res) => {
  try {
    const driver = await Driver.create(req.body);
    res.status(201).json(driver);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateDriver = async (req, res) => {
  try {
    const driver = await Driver.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(driver);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = { getDrivers, getDriverById, createDriver, updateDriver };
