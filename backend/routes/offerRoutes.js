const express = require('express');
const router = express.Router();
const c = require('../controllers/offerController');
const { protect, requireVerified } = require('../middleware/auth');

router.use(protect, requireVerified);

router.route('/').get(c.getMyOffers).post(c.createOffer);
router.get('/:id', c.getOffer);
router.post('/:id/respond', c.respond);
router.post('/:id/withdraw', c.withdraw);
router.post('/:id/cancel', c.cancelDeal);
router.post('/:id/complete', c.complete);

module.exports = router;
