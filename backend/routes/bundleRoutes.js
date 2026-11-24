const express = require('express');
const router = express.Router();
const bundleController = require('../controllers/bundleController');
const { authenticate } = require('../middleware/auth');

// Stats overview
router.get('/stats/overview', bundleController.getBundleStats);

// Browsing is public; creating and claiming require login
router.route('/')
  .get(bundleController.getAllBundles)
  .post(authenticate, bundleController.createBundle);

router.route('/:id')
  .get(bundleController.getBundleById);

// Claim move-out bundle (records an order)
router.post('/:id/claim', authenticate, bundleController.claimBundle);

module.exports = router;
