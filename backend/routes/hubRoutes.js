const express = require('express');
const router = express.Router();
const hubController = require('../controllers/hubController');

router.get('/', hubController.getAllHubs);
router.get('/safety-pledge', hubController.getSafetyPledge);

module.exports = router;
