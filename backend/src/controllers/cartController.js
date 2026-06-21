const { Cart, CartItem, Product } = require('../models');

const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({
      where: { UserId: req.user.id },
      include: [{ model: CartItem, include: [{ model: Product, attributes: ['id', 'name', 'price', 'imageUrl', 'stock'] }] }],
    });
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener carrito', error: error.message });
  }
};

const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1, size, color } = req.body;
    const product = await Product.findByPk(productId);
    if (!product || !product.isActive) return res.status(404).json({ message: 'Producto no encontrado' });
    if (product.stock < quantity) return res.status(400).json({ message: 'Stock insuficiente' });

    let cart = await Cart.findOne({ where: { UserId: req.user.id } });
    if (!cart) cart = await Cart.create({ UserId: req.user.id });

    const existingItem = await CartItem.findOne({ where: { CartId: cart.id, ProductId: productId, size, color } });
    if (existingItem) {
      await existingItem.update({ quantity: existingItem.quantity + quantity });
    } else {
      await CartItem.create({ CartId: cart.id, ProductId: productId, quantity, size, color });
    }

    const updatedCart = await Cart.findOne({
      where: { UserId: req.user.id },
      include: [{ model: CartItem, include: [Product] }],
    });
    res.json(updatedCart);
  } catch (error) {
    res.status(500).json({ message: 'Error al agregar al carrito', error: error.message });
  }
};

const updateCartItem = async (req, res) => {
  try {
    const item = await CartItem.findByPk(req.params.itemId);
    if (!item) return res.status(404).json({ message: 'Item no encontrado' });
    await item.update({ quantity: req.body.quantity });
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar item', error: error.message });
  }
};

const removeFromCart = async (req, res) => {
  try {
    const item = await CartItem.findByPk(req.params.itemId);
    if (!item) return res.status(404).json({ message: 'Item no encontrado' });
    await item.destroy();
    res.json({ message: 'Item eliminado' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar item', error: error.message });
  }
};

const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ where: { UserId: req.user.id } });
    if (cart) await CartItem.destroy({ where: { CartId: cart.id } });
    res.json({ message: 'Carrito vaciado' });
  } catch (error) {
    res.status(500).json({ message: 'Error al vaciar carrito', error: error.message });
  }
};

module.exports = { getCart, addToCart, updateCartItem, removeFromCart, clearCart };
