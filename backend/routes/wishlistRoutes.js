const express = require('express');
const router = express.Router();
const c = require('../controllers/wishlistController');
const { protect } = require('../middleware/auth');

router.use(protect);

// Course watchlists (declared before /:listingId so "watchlists" isn't read as an id)
router.route('/watchlists').get(c.getWatchlists).post(c.createWatchlist);
router.patch('/watchlists/:id/toggle-notify', c.toggleAutoNotify);
router.delete('/watchlists/:id', c.deleteWatchlist);

// Saved listings
router.route('/').get(c.getWishlist).post(c.addToWishlist);
router.delete('/:listingId', c.removeFromWishlist);

module.exports = router;
