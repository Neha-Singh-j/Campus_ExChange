const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const { authenticate, rateLimit } = require('../middleware/auth');

// Each message costs money, so require login and cap the rate
const chatLimiter = rateLimit({ windowMs: 10 * 60 * 1000, max: 40 });

router.post('/', authenticate, chatLimiter, chatController.chat);

module.exports = router;
