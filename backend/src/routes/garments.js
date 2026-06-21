const router = require('express').Router();
const { getGarments, createGarment, updateGarment, deleteGarment, getRandomOutfit } = require('../controllers/garmentController');
const { authenticate } = require('../middlewares/auth');
const upload = require('../config/upload');

router.use(authenticate);
router.get('/', getGarments);
router.get('/random-outfit', getRandomOutfit);
router.post('/', upload.single('image'), createGarment);
router.put('/:id', upload.single('image'), updateGarment);
router.delete('/:id', deleteGarment);

module.exports = router;
