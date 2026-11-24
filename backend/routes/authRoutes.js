const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticate, rateLimit } = require('../middleware/auth');

const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 20 });

router.post('/signup', authLimiter, authController.signup);
router.post('/login', authLimiter, authController.login);
router.get('/me', authenticate, authController.me);

module.exports = router;
