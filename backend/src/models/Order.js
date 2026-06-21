const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Order = sequelize.define('Order', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  status: {
    type: DataTypes.ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled'),
    defaultValue: 'pending',
  },
  total: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  shippingAddress: { type: DataTypes.TEXT, allowNull: false },
  notes: { type: DataTypes.TEXT },
});

const OrderItem = sequelize.define('OrderItem', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  quantity: { type: DataTypes.INTEGER, allowNull: false },
  price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  size: { type: DataTypes.STRING },
  color: { type: DataTypes.STRING },
});

module.exports = { Order, OrderItem };
