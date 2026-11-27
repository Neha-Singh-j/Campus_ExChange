const express = require('express');
const router = express.Router();
const c = require('../controllers/wantedController');
const { protect, optionalAuth, requireVerified } = require('../middleware/auth');

router.route('/')
  .get(optionalAuth, c.getAllWanted)
  .post(protect, requireVerified, c.createWanted);

router.route('/:id')
  .get(optionalAuth, c.getWanted)
  .delete(protect, c.deleteWanted);

router.post('/:id/offer', protect, requireVerified, c.submitOffer);
router.get('/:id/offers', protect, c.getOffers);
router.patch('/:id/status', protect, c.setStatus);

module.exports = router;
