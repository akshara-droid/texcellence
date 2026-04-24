const express = require('express');
const router = express.Router();
const { getMaintenanceLogs, createMaintenanceLog, updateMaintenanceLog } = require('../controllers/maintenanceController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(protect, getMaintenanceLogs).post(protect, createMaintenanceLog);
router.route('/:id').put(protect, updateMaintenanceLog);

module.exports = router;
