const { Garment } = require('../models');
const fs = require('fs');
const path = require('path');

const getGarments = async (req, res) => {
  try {
    const { category } = req.query;
    const where = { UserId: req.user.id, isActive: true };
    if (category) where.category = category;
    const garments = await Garment.findAll({ where, order: [['createdAt', 'DESC']] });
    res.json(garments);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener prendas', error: error.message });
  }
};

const createGarment = async (req, res) => {
  try {
    const { name, category, color, description } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;
    const garment = await Garment.create({ name, category, color, description, imageUrl, UserId: req.user.id });
    res.status(201).json(garment);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear prenda', error: error.message });
  }
};

const updateGarment = async (req, res) => {
  try {
    const garment = await Garment.findOne({ where: { id: req.params.id, UserId: req.user.id } });
    if (!garment) return res.status(404).json({ message: 'Prenda no encontrada' });

    if (req.file) {
      if (garment.imageUrl) {
        const old = path.join(__dirname, '../../', garment.imageUrl);
        if (fs.existsSync(old)) fs.unlinkSync(old);
      }
      req.body.imageUrl = `/uploads/${req.file.filename}`;
    }

    await garment.update(req.body);
    res.json(garment);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar prenda', error: error.message });
  }
};

const deleteGarment = async (req, res) => {
  try {
    const garment = await Garment.findOne({ where: { id: req.params.id, UserId: req.user.id } });
    if (!garment) return res.status(404).json({ message: 'Prenda no encontrada' });
    await garment.update({ isActive: false });
    res.json({ message: 'Prenda eliminada' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar prenda', error: error.message });
  }
};

const getRandomOutfit = async (req, res) => {
  try {
    const categories = ['top', 'bottom', 'shoes', 'outerwear', 'accessory'];
    const outfit = {};

    for (const cat of categories) {
      const garments = await Garment.findAll({ where: { UserId: req.user.id, category: cat, isActive: true } });
      if (garments.length > 0) {
        outfit[cat] = garments[Math.floor(Math.random() * garments.length)];
      }
    }

    res.json(outfit);
  } catch (error) {
    res.status(500).json({ message: 'Error al generar outfit', error: error.message });
  }
};

module.exports = { getGarments, createGarment, updateGarment, deleteGarment, getRandomOutfit };
