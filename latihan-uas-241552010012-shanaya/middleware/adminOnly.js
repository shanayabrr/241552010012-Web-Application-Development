// 1. Tidak perlu import apapun (karena hanya membaca req.user)

// 2. Buat fungsi middleware dengan signature (req, res, next)
const adminOnly = (req, res, next) => {
    // 3. Cek apakah user yang login memiliki role 'admin'
    // Kita pastikan req.user ada (berasal dari authGuard) dan role-nya valid
    if (req.user && req.user.role === 'admin') {
        // Kalau admin, lanjutkan ke handler berikutnya
        next();
    } else {
        // Kalau bukan admin, hentikan request dan kirim 403 Forbidden
        return res.status(403).json({ message: 'Akses ditolak, hanya admin' });
    }
};

// 4. Export fungsinya agar bisa digunakan di index.js atau file route
module.exports = adminOnly;