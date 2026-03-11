const express = require('express');
const router = express.Router();
const {
    addOrderItems,
    getOrderById,
    updateOrderToVerified,
    getMyOrders,
    getOrders,
    updateOrderStatus
} = require('../controllers/orderController');
const { protect, admin } = require('../middleware/authMiddleware');
const { upload } = require('../middleware/errorMiddleware');

router.route('/')
    .post(upload.single('screenshot'), addOrderItems)
    .get(protect, admin, getOrders);

router.route('/mine').get(protect, getMyOrders);

router.route('/:id').get(protect, getOrderById);

router.route('/:id/status').put(protect, admin, updateOrderStatus);

router.route('/:id/verify').put(protect, admin, updateOrderToVerified);

module.exports = router;
