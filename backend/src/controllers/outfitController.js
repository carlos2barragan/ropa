const { Outfit, Garment } = require('../models');

const getOutfits = async (req, res) => {
  try {
    const outfits = await Outfit.findAll({
      where: { UserId: req.user.id },
      include: [Garment],
      order: [['createdAt', 'DESC']],
    });
    res.json(outfits);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener outfits', error: error.message });
  }
};

const saveOutfit = async (req, res) => {
  try {
    const { name, garmentIds } = req.body;
    if (!garmentIds?.length) return res.status(400).json({ message: 'Se requieren prendas' });

    const outfit = await Outfit.create({ name: name || 'Mi outfit', UserId: req.user.id });
    const garments = await Garment.findAll({ where: { id: garmentIds, UserId: req.user.id } });
    await outfit.addGarments(garments);

    const full = await Outfit.findByPk(outfit.id, { include: [Garment] });
    res.status(201).json(full);
  } catch (error) {
    res.status(500).json({ message: 'Error al guardar outfit', error: error.message });
  }
};

const deleteOutfit = async (req, res) => {
  try {
    const outfit = await Outfit.findOne({ where: { id: req.params.id, UserId: req.user.id } });
    if (!outfit) return res.status(404).json({ message: 'Outfit no encontrado' });
    await outfit.destroy();
    res.json({ message: 'Outfit eliminado' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar outfit', error: error.message });
  }
};

module.exports = { getOutfits, saveOutfit, deleteOutfit };
