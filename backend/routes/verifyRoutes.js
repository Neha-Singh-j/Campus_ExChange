const express = require('express');
const router = express.Router();
const verifyController = require('../controllers/verifyController');
const { authenticate } = require('../middleware/auth');

router.use(authenticate);

router.get('/profile', verifyController.getVerificationProfile);
router.post('/request', verifyController.submitVerification);

module.exports = router;
