const express = require('express');
const router = express.Router();

router.use('/auth', require('./authRoutes'));
router.use('/listings', require('./listingRoutes'));
router.use('/offers', require('./offerRoutes'));
router.use('/wanted', require('./wantedRoutes'));
router.use('/wishlist', require('./wishlistRoutes'));

router.get('/health', (req, res) => {
  res.json({ status: 'online', app: 'Campus Exchange API', version: '2.0.0', timestamp: new Date().toISOString() });
});

module.exports = router;
