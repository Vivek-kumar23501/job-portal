// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Register and send verification email
router.post('/register', authController.register);

// Email verify (called from button click)
router.get('/verify-email', authController.verifyEmail);

// Login (after verification)
router.post('/login', authController.login);

module.exports = router;
