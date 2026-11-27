const express = require('express');
const router = express.Router();
const c = require('../controllers/listingController');
const { protect, optionalAuth, requireVerified } = require('../middleware/auth');
const { listingImages } = require('../middleware/upload');

router.get('/stats/summary', optionalAuth, c.getStats);
router.get('/mine', protect, c.getMine);

router.route('/')
  .get(optionalAuth, c.getListings)
  .post(protect, requireVerified, listingImages, c.createListing);

router.route('/:id')
  .get(optionalAuth, c.getListing)
  .patch(protect, requireVerified, listingImages, c.updateListing)
  .delete(protect, c.deleteListing);

router.patch('/:id/status', protect, requireVerified, c.setStatus);

module.exports = router;
