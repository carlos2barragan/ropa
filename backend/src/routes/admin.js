const router = require('express').Router();
const { getDashboardStats, getUsers } = require('../controllers/adminController');
const { authenticate, isAdmin } = require('../middlewares/auth');

router.use(authenticate, isAdmin);
router.get('/stats', getDashboardStats);
router.get('/users', getUsers);

module.exports = router;
