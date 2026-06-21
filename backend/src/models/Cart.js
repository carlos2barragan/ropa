const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Cart = sequelize.define('Cart', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
});

const CartItem = sequelize.define('CartItem', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  quantity: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
  size: { type: DataTypes.STRING },
  color: { type: DataTypes.STRING },
});

module.exports = { Cart, CartItem };
