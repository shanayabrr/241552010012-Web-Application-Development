const express = require('express');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const artikelRoutes = require('./routes/artikel');

const app = express();

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/artikel', artikelRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Blog & Artikel API berjalan' });
});

// 404 handler untuk endpoint yang tidak dikenal
app.use((req, res) => {
  res.status(404).json({ message: 'Endpoint tidak ditemukan' });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});
