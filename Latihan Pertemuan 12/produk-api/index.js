// index.js — Setup awal
const express = require('express');
const app = express();
app.use(express.json());
app.use(require('cors' )());
// ─── DATA AWAL (simulasi database) ─────────────────────
let products = [
 { id: 1, nama: 'Apel Fuji', kategori: 'buah', harga: 15000, stok:
100 },
 { id: 2, nama: 'Jeruk Mandarin', kategori: 'buah', harga: 8000,
stok: 50 },
 { id: 3, nama: 'Wortel', kategori: 'sayur', harga: 5000, stok:
200 },
 { id: 4, nama: 'Bayam', kategori: 'sayur', harga: 3000, stok: 150
},
 { id: 5, nama: 'Susu Ultra', kategori: 'minuman', harga: 18000,
stok: 30 },
];
let nextId = 6; // counter auto-increment
// ─── GET /products — ambil semua produk ────────────────
app.get('/products' , (req, res) => {
 res.json(products);
});
// ─── GET /products/:id — satu produk ─────────────────
app.get('/products/:id' , (req, res) => {
 const p = products. find(p => p.id == req.params.id);
 if (!p) return res. status(404).json({ error: 'Produk tidak ditemukan' });
 res.json(p);
});
// ─── POST /products — buat produk baru ─────────────────
app.post('/products' , (req, res) => {
 const { nama, kategori, harga, stok = 0 } = req.body;
 // Validasi field wajib
 if (!nama) return res. status(400).json({ error: 'nama wajib diisi' });
 if (!harga) return res. status(400).json({ error: 'harga wajib diisi' });
 if (harga <= 0 ) return res. status(400).json({ error: 'harga harus positif'
});
 const produkBaru = { id: nextId++, nama, kategori, harga, stok,
 createdAt: new Date().toISOString() };
 products. push(produkBaru);
 res.status(201).json(produkBaru);
});
// ─── PUT /products/:id — update penuh ─────────────────
app.put('/products/:id', (req, res) => {
 const idx = products.findIndex(p => p.id == req.params.id);
 if (idx === -1) return res.status(404).json({ error: 'Not found' });
 // Spread: ambil data lama, timpa dengan data baru
 products[idx] = { ...products[idx], ...req.body, id: +req.params.id };
 res.json(products[idx]);
});
// ─── PATCH /products/:id — update sebagian ─────────────
// PATCH sama seperti PUT tapi lebih eksplisit tentang partial update
app.patch('/products/:id', (req, res) => {
 const idx = products.findIndex(p => p.id == req.params.id);
 if (idx === -1) return res.status(404).json({ error: 'Not found' });
 Object.assign(products[idx], req.body); // merge partial update
 res.json(products[idx]);
});
// ─── DELETE /products/:id — hapus produk ───────────────
app.delete('/products/:id', (req, res) => {
 const before = products.length;
 products = products.filter(p => p.id != req.params.id);
 if (products.length === before) // panjang tidak berubah = tidak ada yang
dihapus
 return res.status(404).json({ error: 'Not found' });
 res.status(204).send(); // 204 = sukses, tidak ada body
});
// ─── Jalankan server ────────────────────────────────────
app.listen(3000, () => console.log('API jalan di http://localhost:3000'));