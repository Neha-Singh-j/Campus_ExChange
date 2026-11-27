const express = require('express');
const router = express.Router();
const auth = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const rateLimit = require('../utils/rateLimit');

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: Number(process.env.AUTH_RATE_LIMIT_MAX) || 40,
  message: 'Too many attempts. Please wait a few minutes and try again.',
});

router.post('/register', authLimiter, auth.register);
router.post('/login', authLimiter, auth.login);
router.get('/me', protect, auth.me);
router.patch('/me', protect, auth.updateMe);

module.exports = router;
