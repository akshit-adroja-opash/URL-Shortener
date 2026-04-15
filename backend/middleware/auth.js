const jwt = require('jsonwebtoken');
const AppError = require('../utils/AppError');

const auth = (req, res, next) => {
  let token = req.header('x-auth-token') || req.header('Authorization');

  if (!token) {
    return next(new AppError(401, 'Authentication required', 'AUTH_REQUIRED'));
  }

  if (token.startsWith('Bearer ')) {
    token = token.slice(7);
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'URL-shortener-secret');
    req.user = {
      id: decoded.id,
      email: decoded.email,
      name: decoded.name,
    };
    next();
  } catch (err) {
    next(new AppError(401, 'Invalid or expired token', 'INVALID_TOKEN'));
  }
};

module.exports = auth;
