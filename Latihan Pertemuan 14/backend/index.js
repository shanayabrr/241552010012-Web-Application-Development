require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true
}));

app.use(express.json());
app.get('/', (req, res) => res.json({ status: 'ok', app: 'todo-api' }));
app.use('/api/todos', require('./routes/todos'));
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✓ Server jalan di http://localhost:${PORT}`);
});
