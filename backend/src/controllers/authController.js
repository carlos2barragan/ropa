const jwt = require('jsonwebtoken');
const { User, Cart } = require('../models');

const generateToken = (user) =>
  jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });

const register = async (req, res) => {
  try {
    const { name, email, password, address, phone } = req.body;
    const exists = await User.findOne({ where: { email } });
    if (exists) return res.status(400).json({ message: 'El email ya está registrado' });

    const user = await User.create({ name, email, password, address, phone });
    await Cart.create({ UserId: user.id });

    const token = generateToken(user);
    res.status(201).json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    res.status(500).json({ message: 'Error al registrar usuario', error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Credenciales incorrectas' });
    }

    const token = generateToken(user);
    res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    res.status(500).json({ message: 'Error al iniciar sesión', error: error.message });
  }
};

const getProfile = async (req, res) => {
  res.json(req.user);
};

const updateProfile = async (req, res) => {
  try {
    const { name, address, phone } = req.body;
    await req.user.update({ name, address, phone });
    res.json(req.user);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar perfil', error: error.message });
  }
};

module.exports = { register, login, getProfile, updateProfile };
