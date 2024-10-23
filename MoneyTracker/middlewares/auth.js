require('dotenv').config()
const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.SECRET_KEY;  // Use the same key from the users route

// Middleware to verify JWT token
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Format: "Bearer <token>"
  
  if (!token) return res.status(401).json({ error: 'Token not provided' });

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
}

module.exports = authenticateToken;