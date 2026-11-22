const express = require('express');
const router = express.Router();
const listingController = require('../controllers/listingController');

// Stats summary route
router.get('/stats/summary', listingController.getMarketplaceStats);

// Main listings CRUD
router.route('/')
  .get(listingController.getAllListings)
  .post(listingController.createListing);

router.route('/:id')
  .get(listingController.getListingById)
  .delete(listingController.deleteListing);

// Likes and Wishlist toggle interactions
router.patch('/:id/like', listingController.toggleLike);
router.patch('/:id/wishlist', listingController.toggleWishlist);

module.exports = router;
