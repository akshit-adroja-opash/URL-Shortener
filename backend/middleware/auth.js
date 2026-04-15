const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  console.log('Auth middleware called for path:', req.path);
  const token = req.header('x-auth-token');
  console.log('Token present:', !!token);

  if (!token) {
    console.log('No token provided');
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    console.log('Token verified for user:', decoded.id);
    next();
  } catch (error) {
    console.log('Token verification failed:', error.message);
    res.status(401).json({ message: 'Token is not valid' });
  }
};

module.exports = auth;
