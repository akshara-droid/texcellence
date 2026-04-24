const Vehicle = require('../models/Vehicle');

const getVehicles = async (req, res) => {
  try {
    const vehicles = await Vehicle.find().populate('assignedDriverId', 'fullName string');
    res.json(vehicles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getVehicleById = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id).populate('assignedDriverId');
    if (vehicle) res.json(vehicle);
    else res.status(404).json({ message: 'Vehicle not found' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.create(req.body);
    res.status(201).json(vehicle);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(vehicle);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteVehicle = async (req, res) => {
  try {
    await Vehicle.findByIdAndDelete(req.params.id);
    res.json({ message: 'Vehicle removed' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = { getVehicles, getVehicleById, createVehicle, updateVehicle, deleteVehicle };
