const jwt = require('jsonwebtoken');
require('dotenv').config();

/**
 * Middleware untuk memverifikasi JWT token dari header Authorization.
 * Format header yang diharapkan: "Authorization: Bearer <token>"
 *
 * Jika valid  -> decoded payload disimpan di req.user, lanjut ke next()
 * Jika tidak  -> response 401
 */
function authGuard(req, res, next) {
  const authHeader = req.headers['authorization'];

  // Header tidak ada atau formatnya salah
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token tidak ditemukan' });
  }

  const token = authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Token tidak ditemukan' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { userId, email, nama, role }
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token tidak valid atau kadaluarsa' });
  }
}

module.exports = authGuard;
