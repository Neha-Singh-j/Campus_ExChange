const express = require('express');
const router = express.Router();
const wantedController = require('../controllers/wantedController');

// Wanted board CRUD
router.route('/')
  .get(wantedController.getAllWanted)
  .post(wantedController.createWanted);

router.route('/:id')
  .get(wantedController.getWantedById);

// Submit offer to wanted student
router.post('/:id/offer', wantedController.submitOffer);

module.exports = router;
