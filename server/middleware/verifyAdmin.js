// middleware/verifyAdmin.js
const jwt = require('jsonwebtoken');

const verifyAdmin = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = decoded; // Attach to request
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Session expired or invalid token' });
  }
};

module.exports = verifyAdmin;
