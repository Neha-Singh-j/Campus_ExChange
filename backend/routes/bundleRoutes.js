const express = require('express');
const router = express.Router();
const bundleController = require('../controllers/bundleController');

// Stats overview
router.get('/stats/overview', bundleController.getBundleStats);

// Bundles CRUD
router.route('/')
  .get(bundleController.getAllBundles)
  .post(bundleController.createBundle);

router.route('/:id')
  .get(bundleController.getBundleById);

// Claim move-out bundle
router.post('/:id/claim', bundleController.claimBundle);

module.exports = router;
