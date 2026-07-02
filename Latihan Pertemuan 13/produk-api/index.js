 
require('dotenv').config();
const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

const authGuard = require('./middleware/authGuard');
const authRouter = require('./routes/auth');
const productsRouter = require('./routes/products');

app.use('/api/auth', authRouter);
app.use('/api/products', authGuard, productsRouter);

app.use((err, req, res, next) => {
  console.error(err.message);
  res.status(err.status || 500)
    .json({ error: err.message || 'Server error' });
});

app.listen(PORT, () => {
  console.log(`Server jalan di port ${PORT}`);
});