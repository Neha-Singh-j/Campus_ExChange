const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { authenticate } = require('../middleware/auth');

router.use(authenticate);

router.post('/', orderController.createOrderHandler);
router.get('/mine', orderController.getMyOrders);
router.patch('/:id/complete', orderController.completeOrder);

module.exports = router;
