/**
 * Middleware ini HARUS dipasang setelah authGuard, karena
 * bergantung pada req.user yang di-set oleh authGuard.
 */
function adminOnly(req, res, next) {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Akses ditolak, hanya untuk admin' });
  }
  next();
}

module.exports = adminOnly;
