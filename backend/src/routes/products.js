const router = require('express').Router();
const { getProducts, getProduct, createProduct, updateProduct, deleteProduct } = require('../controllers/productController');
const { authenticate, isAdmin } = require('../middlewares/auth');

router.get('/', getProducts);
router.get('/:id', getProduct);
router.post('/', authenticate, isAdmin, createProduct);
router.put('/:id', authenticate, isAdmin, updateProduct);
router.delete('/:id', authenticate, isAdmin, deleteProduct);

module.exports = router;
