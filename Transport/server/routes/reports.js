const express = require('express');
const router = express.Router();
const { getReports, generateReport } = require('../controllers/reportController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/').get(protect, admin, getReports);
router.route('/generate').post(protect, admin, generateReport);

module.exports = router;
