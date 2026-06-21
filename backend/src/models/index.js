const sequelize = require('../config/database');
const User = require('./User');
const Category = require('./Category');
const Product = require('./Product');
const { Cart, CartItem } = require('./Cart');
const { Order, OrderItem } = require('./Order');

// User <-> Cart
User.hasOne(Cart, { onDelete: 'CASCADE' });
Cart.belongsTo(User);

// Cart <-> Product (through CartItem)
Cart.hasMany(CartItem, { onDelete: 'CASCADE' });
CartItem.belongsTo(Cart);
Product.hasMany(CartItem);
CartItem.belongsTo(Product);

// Category <-> Product
Category.hasMany(Product);
Product.belongsTo(Category);

// User <-> Order
User.hasMany(Order);
Order.belongsTo(User);

// Order <-> Product (through OrderItem)
Order.hasMany(OrderItem, { onDelete: 'CASCADE' });
OrderItem.belongsTo(Order);
Product.hasMany(OrderItem);
OrderItem.belongsTo(Product);

module.exports = { sequelize, User, Category, Product, Cart, CartItem, Order, OrderItem };
