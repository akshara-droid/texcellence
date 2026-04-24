const express = require('express');
const router = express.Router();
const { loginUser, logoutUser, forgotPassword } = require('../controllers/authController');

router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.post('/forgot-password', forgotPassword);

module.exports = router;
