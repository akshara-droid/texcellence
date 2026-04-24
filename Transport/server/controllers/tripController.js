const Trip = require('../models/Trip');

const getTrips = async (req, res) => {
  try {
    const trips = await Trip.find().populate('vehicleId').populate('driverId');
    res.json(trips);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getTripById = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id).populate('vehicleId').populate('driverId');
    if (trip) res.json(trip);
    else res.status(404).json({ message: 'Trip not found' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createTrip = async (req, res) => {
  try {
    const trip = await Trip.create(req.body);
    res.status(201).json(trip);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateTrip = async (req, res) => {
  try {
    const trip = await Trip.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(trip);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteTrip = async (req, res) => {
  try {
    await Trip.findByIdAndDelete(req.params.id);
    res.json({ message: 'Trip removed' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = { getTrips, getTripById, createTrip, updateTrip, deleteTrip };
