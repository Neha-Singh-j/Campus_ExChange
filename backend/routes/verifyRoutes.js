const express = require('express');
const router = express.Router();
const verifyController = require('../controllers/verifyController');

router.get('/profile', verifyController.getVerificationProfile);
router.post('/request', verifyController.submitVerification);

module.exports = router;
