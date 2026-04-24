const express = require('express');
const router = express.Router();
const { getAlerts, readAlert, readAllAlerts } = require('../controllers/alertController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(protect, getAlerts);
router.route('/read-all').put(protect, readAllAlerts);
router.route('/:id/read').put(protect, readAlert);

module.exports = router;
