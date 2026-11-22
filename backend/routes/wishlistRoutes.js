const express = require('express');
const router = express.Router();
const wishlistController = require('../controllers/wishlistController');

// Wishlist items
router.route('/')
  .get(wishlistController.getWishlist)
  .post(wishlistController.addToWishlist);

router.delete('/:id', wishlistController.removeFromWishlist);

// Course Watchlists
router.route('/watchlists')
  .get(wishlistController.getWatchlists)
  .post(wishlistController.createWatchlist);

router.patch('/watchlists/:id/toggle-notify', wishlistController.toggleAutoNotify);
router.delete('/watchlists/:id', wishlistController.deleteWatchlist);

module.exports = router;
