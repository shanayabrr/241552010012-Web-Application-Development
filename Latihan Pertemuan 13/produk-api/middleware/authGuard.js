 
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ 
      error: 'Akses ditolak. Login terlebih dahulu.' 
    });
  }

  const token = authHeader.slice(7);

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ 
      error: 'Akses ditolak. Login terlebih dahulu.' 
    });
  }

  const token = authHeader.slice(7);

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ 
      error: 'Token tidak valid atau sudah expired.' 
    });
  }
};
    res.status(401).json({ 
      error: 'Token tidak valid atau sudah expired.' 
    });
  }
};