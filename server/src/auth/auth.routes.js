const express = require('express');
const router = express.Router();
const authController = require('./auth.controller');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

/**
 * Public routes
 */
router.post('/signup', authController.signup);
router.post('/login', authController.login);

/**
 * Protected routes
 */
router.get('/me', authMiddleware, authController.getMe);

module.exports = router;

