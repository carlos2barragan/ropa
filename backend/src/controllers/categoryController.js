const { Category } = require('../models');

const getCategories = async (req, res) => {
  try {
    const categories = await Category.findAll({ order: [['name', 'ASC']] });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener categorías', error: error.message });
  }
};

const createCategory = async (req, res) => {
  try {
    const category = await Category.create(req.body);
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear categoría', error: error.message });
  }
};

const updateCategory = async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id);
    if (!category) return res.status(404).json({ message: 'Categoría no encontrada' });
    await category.update(req.body);
    res.json(category);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar categoría', error: error.message });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id);
    if (!category) return res.status(404).json({ message: 'Categoría no encontrada' });
    await category.destroy();
    res.json({ message: 'Categoría eliminada' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar categoría', error: error.message });
  }
};

module.exports = { getCategories, createCategory, updateCategory, deleteCategory };
