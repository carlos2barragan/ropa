const router = require('express').Router();
const { createOrder, getMyOrders, getOrder, getAllOrders, updateOrderStatus } = require('../controllers/orderController');
const { authenticate, isAdmin } = require('../middlewares/auth');

router.use(authenticate);
router.post('/', createOrder);
router.get('/my-orders', getMyOrders);
router.get('/all', isAdmin, getAllOrders);
router.get('/:id', getOrder);
router.put('/:id/status', isAdmin, updateOrderStatus);

module.exports = router;
