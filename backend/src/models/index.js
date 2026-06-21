const sequelize = require('../config/database');
const User = require('./User');
const Garment = require('./Garment');
const { Outfit, OutfitGarment } = require('./Outfit');

// User -> Garments
User.hasMany(Garment, { onDelete: 'CASCADE' });
Garment.belongsTo(User);

// User -> Outfits
User.hasMany(Outfit, { onDelete: 'CASCADE' });
Outfit.belongsTo(User);

// Outfit <-> Garment (many-to-many)
Outfit.belongsToMany(Garment, { through: OutfitGarment });
Garment.belongsToMany(Outfit, { through: OutfitGarment });

module.exports = { sequelize, User, Garment, Outfit, OutfitGarment };
