const { Op } = require('sequelize');
const { Product, Category } = require('../models');

const getProducts = async (req, res) => {
  try {
    const { category, gender, minPrice, maxPrice, search, page = 1, limit = 12 } = req.query;
    const where = { isActive: true };
    if (gender) where.gender = gender;
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price[Op.gte] = minPrice;
      if (maxPrice) where.price[Op.lte] = maxPrice;
    }
    if (search) where.name = { [Op.iLike]: `%${search}%` };

    const include = [{ model: Category, attributes: ['id', 'name'] }];
    if (category) include[0].where = { name: category };

    const offset = (page - 1) * limit;
    const { count, rows } = await Product.findAndCountAll({ where, include, limit: parseInt(limit), offset: parseInt(offset), order: [['createdAt', 'DESC']] });

    res.json({ products: rows, total: count, pages: Math.ceil(count / limit), currentPage: parseInt(page) });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener productos', error: error.message });
  }
};

const getProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id, { include: [Category] });
    if (!product) return res.status(404).json({ message: 'Producto no encontrado' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener producto', error: error.message });
  }
};

const createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear producto', error: error.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ message: 'Producto no encontrado' });
    await product.update(req.body);
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar producto', error: error.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ message: 'Producto no encontrado' });
    await product.update({ isActive: false });
    res.json({ message: 'Producto eliminado' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar producto', error: error.message });
  }
};

module.exports = { getProducts, getProduct, createProduct, updateProduct, deleteProduct };
