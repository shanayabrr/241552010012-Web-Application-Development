// 1. Import jsonwebtoken
const jwt = require('jsonwebtoken');

// 2. Buat fungsi middleware dengan signature (req, res, next)
const authGuard = (req, res, next) => {
    // 3. Ambil header Authorization
    const authHeader = req.headers.authorization;

    // Cek apakah header tidak ada atau tidak dimulai dengan "Bearer "
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Token tidak ditemukan' });
    }

    // 4. Ekstrak token dari header dengan memisahkan string berdasarkan spasi
    const token = authHeader.split(' ')[1];

    // 5. Verifikasi token di dalam blok try...catch
    try {
        // Proses verifikasi menggunakan JWT_SECRET dari .env
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Simpan hasil decode (userId, email, nama, role) ke req.user
        req.user = decoded;
        
        // Panggil next() agar request lanjut ke route berikutnya
        next();
    } catch (error) {
        // 6. Tangani kegagalan verifikasi (invalid/expired)
        return res.status(401).json({ message: 'Token tidak valid atau kadaluarsa' });
    }
};

// 7. Export fungsi agar bisa digunakan di index.js dan file route
module.exports = authGuard;