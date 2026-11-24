const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authenticate, requireRole } = require('../middleware/auth');

// Every admin route requires a logged-in admin
router.use(authenticate, requireRole('admin'));

router.get('/overview', adminController.getOverview);
router.get('/orders', adminController.getOrders);
router.get('/listings', adminController.getListings);
router.get('/users', adminController.getUsers);
router.patch('/users/:id/active', adminController.setUserStatus);
router.patch('/users/:id/verification', adminController.setVerification);
router.get('/users/:id/id-proof', adminController.getIdProof);

module.exports = router;
