const router = require('express').Router();
const { getOutfits, saveOutfit, deleteOutfit } = require('../controllers/outfitController');
const { authenticate } = require('../middlewares/auth');

router.use(authenticate);
router.get('/', getOutfits);
router.post('/', saveOutfit);
router.delete('/:id', deleteOutfit);

module.exports = router;
