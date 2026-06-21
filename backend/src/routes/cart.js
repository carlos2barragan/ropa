const router = require('express').Router();
const { getCart, addToCart, updateCartItem, removeFromCart, clearCart } = require('../controllers/cartController');
const { authenticate } = require('../middlewares/auth');

router.use(authenticate);
router.get('/', getCart);
router.post('/items', addToCart);
router.put('/items/:itemId', updateCartItem);
router.delete('/items/:itemId', removeFromCart);
router.delete('/', clearCart);

module.exports = router;
