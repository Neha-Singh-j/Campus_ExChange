const express = require('express');
const router = express.Router();

const listingRoutes = require('./listingRoutes');
const bundleRoutes = require('./bundleRoutes');
const wantedRoutes = require('./wantedRoutes');
const searchRoutes = require('./searchRoutes');
const wishlistRoutes = require('./wishlistRoutes');
const verifyRoutes = require('./verifyRoutes');
const hubRoutes = require('./hubRoutes');
const authRoutes = require('./authRoutes');
const orderRoutes = require('./orderRoutes');
const adminRoutes = require('./adminRoutes');
const chatRoutes = require('./chatRoutes');

// Mount routes
router.use('/auth', authRoutes);
router.use('/orders', orderRoutes);
router.use('/admin', adminRoutes);
router.use('/chat', chatRoutes);
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
    app: 'CampusXchange UC Berkeley Backend',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
