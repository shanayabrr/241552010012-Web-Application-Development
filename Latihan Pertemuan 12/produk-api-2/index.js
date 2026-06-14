// index.js — hanya konfigurasi & mount router
const express = require('express');
const cors = require('cors');
const logger = require('./middleware/logger' );
const app = express();
app.use(cors());
app.use(express.json());
app.use(logger); // semua route kena logger
// Mount routers ke base path
app.use('/api/products' , require('./routes/products' ));
app.use('/api/users' , require('./routes/users' ));
// Error handler — selalu paling bawah
app.use((err, req, res, next) => {
console.error(err.stack);
res.status(err.status || 500).json({ error: err.message });
});
app.listen(3000, () => console.log('API jalan di http://localhost:3000' ));