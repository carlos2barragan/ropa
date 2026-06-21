const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Garment = sequelize.define('Garment', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
  category: {
    type: DataTypes.ENUM('top', 'bottom', 'shoes', 'outerwear', 'accessory'),
    allowNull: false,
  },
  color: { type: DataTypes.STRING },
  description: { type: DataTypes.TEXT },
  imageUrl: { type: DataTypes.STRING },
  isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
});

module.exports = Garment;
