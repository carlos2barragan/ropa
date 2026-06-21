const router = require('express').Router();
const { register, login, getProfile, updateProfile } = require('../controllers/authController');
const { authenticate } = require('../middlewares/auth');

router.post('/register', register);
router.post('/login', login);
router.get('/profile', authenticate, getProfile);
router.put('/profile', authenticate, updateProfile);

module.exports = router;
