require('dotenv').config();
const { sequelize, User, Category, Product, Cart } = require('../models');

const seed = async () => {
  await sequelize.sync({ force: true });

  const categories = await Category.bulkCreate([
    { name: 'Camisetas', description: 'Camisetas y tops' },
    { name: 'Pantalones', description: 'Jeans, pantalones y shorts' },
    { name: 'Vestidos', description: 'Vestidos y faldas' },
    { name: 'Chaquetas', description: 'Chaquetas y abrigos' },
    { name: 'Calzado', description: 'Zapatos y zapatillas' },
    { name: 'Accesorios', description: 'Bolsos, cinturones y más' },
  ]);

  const admin = await User.create({
    name: 'Admin',
    email: 'admin@store.com',
    password: 'admin123',
    role: 'admin',
  });
  await Cart.create({ UserId: admin.id });

  const customer = await User.create({
    name: 'Cliente Demo',
    email: 'cliente@store.com',
    password: 'cliente123',
    role: 'customer',
    address: 'Calle 123, Ciudad',
    phone: '300-000-0000',
  });
  await Cart.create({ UserId: customer.id });

  await Product.bulkCreate([
    { name: 'Camiseta Básica Blanca', description: 'Camiseta de algodón 100%', price: 29900, stock: 50, CategoryId: categories[0].id, sizes: ['XS', 'S', 'M', 'L', 'XL'], colors: ['blanco', 'negro', 'gris'], gender: 'unisex', imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400' },
    { name: 'Camiseta Estampada', description: 'Camiseta con estampado moderno', price: 45900, stock: 30, CategoryId: categories[0].id, sizes: ['S', 'M', 'L', 'XL'], colors: ['azul', 'rojo'], gender: 'unisex', imageUrl: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=400' },
    { name: 'Jean Slim Fit', description: 'Jean de corte moderno y ajustado', price: 89900, stock: 25, CategoryId: categories[1].id, sizes: ['28', '30', '32', '34', '36'], colors: ['azul oscuro', 'negro'], gender: 'men', imageUrl: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400' },
    { name: 'Pantalón Chino', description: 'Pantalón casual versátil', price: 79900, stock: 20, CategoryId: categories[1].id, sizes: ['28', '30', '32', '34'], colors: ['beige', 'verde oliva', 'navy'], gender: 'men', imageUrl: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=400' },
    { name: 'Vestido Floral', description: 'Vestido con estampado de flores', price: 95900, stock: 15, CategoryId: categories[2].id, sizes: ['XS', 'S', 'M', 'L'], colors: ['rosa', 'azul'], gender: 'women', imageUrl: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=400' },
    { name: 'Chaqueta Denim', description: 'Chaqueta de mezclilla clásica', price: 129900, stock: 18, CategoryId: categories[3].id, sizes: ['S', 'M', 'L', 'XL'], colors: ['azul', 'negro'], gender: 'unisex', imageUrl: 'https://images.unsplash.com/photo-1551537482-f2075a1d41f2?w=400' },
    { name: 'Zapatillas Urbanas', description: 'Zapatillas cómodas para el día a día', price: 149900, stock: 22, CategoryId: categories[4].id, sizes: ['36', '37', '38', '39', '40', '41', '42'], colors: ['blanco', 'negro', 'gris'], gender: 'unisex', imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400' },
    { name: 'Bolso Tote', description: 'Bolso espacioso y elegante', price: 69900, stock: 12, CategoryId: categories[5].id, sizes: ['único'], colors: ['negro', 'camel', 'blanco'], gender: 'women', imageUrl: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400' },
  ]);

  console.log('Seed completado exitosamente');
  console.log('Admin: admin@store.com / admin123');
  console.log('Cliente: cliente@store.com / cliente123');
  process.exit(0);
};

seed().catch((err) => { console.error(err); process.exit(1); });
