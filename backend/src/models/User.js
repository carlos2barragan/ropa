const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: false },
  role: { type: DataTypes.ENUM('admin', 'customer'), defaultValue: 'customer' },
  address: { type: DataTypes.TEXT },
  phone: { type: DataTypes.STRING },
}, {
  hooks: {
    beforeCreate: async (user) => {
      user.password = await bcrypt.hash(user.password, 10);
    },
    beforeUpdate: async (user) => {
      if (user.changed('password')) {
        user.password = await bcrypt.hash(user.password, 10);
      }
    },
  },
});

User.prototype.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

module.exports = User;
