const express = require('express');
const router = express.Router();
const listingController = require('../controllers/listingController');
const { authenticate } = require('../middleware/auth');

// Stats summary route
router.get('/stats/summary', listingController.getMarketplaceStats);

// Browsing is public; posting and deleting require login
router.route('/')
  .get(listingController.getAllListings)
  .post(authenticate, listingController.createListing);

router.route('/:id')
  .get(listingController.getListingById)
  .delete(authenticate, listingController.deleteListing);

// Likes and Wishlist toggle interactions (login required)
router.patch('/:id/like', authenticate, listingController.toggleLike);
router.patch('/:id/wishlist', authenticate, listingController.toggleWishlist);

module.exports = router;
