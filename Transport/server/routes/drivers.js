const express = require('express');
const router = express.Router();
const { getDrivers, getDriverById, createDriver, updateDriver } = require('../controllers/driverController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(protect, getDrivers).post(protect, createDriver);
router.route('/:id').get(protect, getDriverById).put(protect, updateDriver);

module.exports = router;
