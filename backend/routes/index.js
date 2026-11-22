const express = require('express');
const router = express.Router();

const listingRoutes = require('./listingRoutes');
const bundleRoutes = require('./bundleRoutes');
const wantedRoutes = require('./wantedRoutes');
const searchRoutes = require('./searchRoutes');
const wishlistRoutes = require('./wishlistRoutes');
const verifyRoutes = require('./verifyRoutes');
const hubRoutes = require('./hubRoutes');

// Mount routes
router.use('/listings', listingRoutes);
router.use('/bundles', bundleRoutes);
router.use('/wanted', wantedRoutes);
router.use('/search', searchRoutes);
router.use('/wishlist', wishlistRoutes);
router.use('/verify', verifyRoutes);
router.use('/hubs', hubRoutes);

// API Health Check
router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    app: 'CampusZon UC Berkeley Backend',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
