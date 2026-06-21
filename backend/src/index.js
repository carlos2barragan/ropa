require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { sequelize } = require('./models');

const app = express();

app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());

app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/categories', require('./routes/categories'));
app.use('/api/cart', require('./routes/cart'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/admin', require('./routes/admin'));

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

const PORT = process.env.PORT || 4000;

sequelize.sync({ alter: true }).then(() => {
  app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));
}).catch((err) => console.error('Error al conectar BD:', err));
