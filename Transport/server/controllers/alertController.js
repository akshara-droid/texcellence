const Alert = require('../models/Alert');

const getAlerts = async (req, res) => {
  try {
    const alerts = await Alert.find().sort({ createdAt: -1 });
    res.json(alerts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const readAlert = async (req, res) => {
  try {
    const alert = await Alert.findByIdAndUpdate(req.params.id, { isRead: true }, { new: true });
    res.json(alert);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const readAllAlerts = async (req, res) => {
  try {
    await Alert.updateMany({}, { isRead: true });
    res.json({ message: 'All alerts marked as read' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Internal function to create alerts
const createAlert = async (data) => {
  try {
    await Alert.create(data);
  } catch (error) {
    console.error('Error creating alert', error);
  }
};

module.exports = { getAlerts, readAlert, readAllAlerts, createAlert };
