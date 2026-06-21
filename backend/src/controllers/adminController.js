const { User, Product, Order, Category } = require('../models');
const { Op } = require('sequelize');
const sequelize = require('../config/database');

const getDashboardStats = async (req, res) => {
  try {
    const [totalUsers, totalProducts, totalOrders, revenueResult] = await Promise.all([
      User.count({ where: { role: 'customer' } }),
      Product.count({ where: { isActive: true } }),
      Order.count(),
      Order.sum('total', { where: { status: { [Op.not]: 'cancelled' } } }),
    ]);

    const recentOrders = await Order.findAll({
      limit: 5,
      order: [['createdAt', 'DESC']],
      include: [{ model: User, attributes: ['name', 'email'] }],
    });

    res.json({
      totalUsers,
      totalProducts,
      totalOrders,
      totalRevenue: revenueResult || 0,
      recentOrders,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener estadísticas', error: error.message });
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await User.findAll({ attributes: { exclude: ['password'] }, order: [['createdAt', 'DESC']] });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener usuarios', error: error.message });
  }
};

module.exports = { getDashboardStats, getUsers };
