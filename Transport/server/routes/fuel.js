const express = require('express');
const router = express.Router();
const { getFuelLogs, getFuelLogById, createFuelLog } = require('../controllers/fuelController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(protect, getFuelLogs).post(protect, createFuelLog);
router.route('/:id').get(protect, getFuelLogById);

module.exports = router;
