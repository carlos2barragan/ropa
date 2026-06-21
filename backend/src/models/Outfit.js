const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Outfit = sequelize.define('Outfit', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, defaultValue: 'Mi outfit' },
});

const OutfitGarment = sequelize.define('OutfitGarment', {}, { timestamps: false });

module.exports = { Outfit, OutfitGarment };
