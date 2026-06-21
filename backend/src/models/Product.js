const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Product = sequelize.define('Product', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT },
  price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  stock: { type: DataTypes.INTEGER, defaultValue: 0 },
  imageUrl: { type: DataTypes.STRING },
  sizes: { type: DataTypes.ARRAY(DataTypes.STRING), defaultValue: [] },
  colors: { type: DataTypes.ARRAY(DataTypes.STRING), defaultValue: [] },
  gender: { type: DataTypes.ENUM('men', 'women', 'unisex', 'kids'), defaultValue: 'unisex' },
  isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
});

module.exports = Product;
