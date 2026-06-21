const { Order, OrderItem, Cart, CartItem, Product, User } = require('../models');

const createOrder = async (req, res) => {
  try {
    const { shippingAddress, notes } = req.body;
    const cart = await Cart.findOne({
      where: { UserId: req.user.id },
      include: [{ model: CartItem, include: [Product] }],
    });

    if (!cart?.CartItems?.length) return res.status(400).json({ message: 'El carrito está vacío' });

    let total = 0;
    const orderItems = cart.CartItems.map((item) => {
      total += item.Product.price * item.quantity;
      return { ProductId: item.ProductId, quantity: item.quantity, price: item.Product.price, size: item.size, color: item.color };
    });

    const order = await Order.create({ UserId: req.user.id, total, shippingAddress, notes });
    await OrderItem.bulkCreate(orderItems.map((i) => ({ ...i, OrderId: order.id })));
    await CartItem.destroy({ where: { CartId: cart.id } });

    const fullOrder = await Order.findByPk(order.id, { include: [{ model: OrderItem, include: [Product] }] });
    res.status(201).json(fullOrder);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear orden', error: error.message });
  }
};

const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      where: { UserId: req.user.id },
      include: [{ model: OrderItem, include: [{ model: Product, attributes: ['id', 'name', 'imageUrl'] }] }],
      order: [['createdAt', 'DESC']],
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener órdenes', error: error.message });
  }
};

const getOrder = async (req, res) => {
  try {
    const order = await Order.findOne({
      where: { id: req.params.id, UserId: req.user.id },
      include: [{ model: OrderItem, include: [Product] }],
    });
    if (!order) return res.status(404).json({ message: 'Orden no encontrada' });
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener orden', error: error.message });
  }
};

// Admin
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      include: [
        { model: User, attributes: ['id', 'name', 'email'] },
        { model: OrderItem, include: [{ model: Product, attributes: ['id', 'name'] }] },
      ],
      order: [['createdAt', 'DESC']],
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener órdenes', error: error.message });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id);
    if (!order) return res.status(404).json({ message: 'Orden no encontrada' });
    await order.update({ status: req.body.status });
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar orden', error: error.message });
  }
};

module.exports = { createOrder, getMyOrders, getOrder, getAllOrders, updateOrderStatus };
