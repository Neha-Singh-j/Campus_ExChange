const express = require('express');
const router = express.Router();
const wantedController = require('../controllers/wantedController');
const { authenticate } = require('../middleware/auth');

// Browsing is public; posting a request or an offer requires login
router.route('/')
  .get(wantedController.getAllWanted)
  .post(authenticate, wantedController.createWanted);

router.route('/:id')
  .get(wantedController.getWantedById);

// Submit offer to wanted student
router.post('/:id/offer', authenticate, wantedController.submitOffer);

module.exports = router;
