// middleware/validateProduct.js — validasi & sanitasi body produk
function validateProduct(req, res, next) {
const { nama, harga, stok } = req.body;
const errors = [];
if (!nama || nama.trim().length < 2)
 errors.push('nama wajib, minimal 2 karakter');
if (!harga || isNaN(harga) || Number(harga) <= 0)
 errors.push('harga wajib, harus angka positif');
if (stok !== undefined && (isNaN(stok) || Number(stok) < 0))
 errors.push('stok harus angka >= 0');
if (errors.length > 0) {
 return res.status(400).json({ errors });
 }
// Sanitasi: pastikan tipe data konsisten
req.body.nama = nama.trim();
req.body.harga = Number(harga);
req.body.stok = stok !== undefined ? Number(stok) : 0;
next();
}
module.exports = validateProduct;