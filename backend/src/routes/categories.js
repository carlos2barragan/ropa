const router = require('express').Router();
const { getCategories, createCategory, updateCategory, deleteCategory } = require('../controllers/categoryController');
const { authenticate, isAdmin } = require('../middlewares/auth');

router.get('/', getCategories);
router.post('/', authenticate, isAdmin, createCategory);
router.put('/:id', authenticate, isAdmin, updateCategory);
router.delete('/:id', authenticate, isAdmin, deleteCategory);

module.exports = router;
