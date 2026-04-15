const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const AppError = require('../utils/AppError');

const JWT_SECRET = process.env.JWT_SECRET || 'URL-shortener-secret';
const TOKEN_EXPIRY = process.env.JWT_EXPIRY || '7d';
const SALT_ROUNDS = 10;

const createToken = (user) => jwt.sign(
  {
    id: user._id.toString(),
    email: user.email,
    name: user.name,
  },
  JWT_SECRET,
  { expiresIn: TOKEN_EXPIRY },
);

const serializeAuthPayload = (user) => ({
  user: {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    createdAt: user.createdAt,
  },
  token: createToken(user),
});

const register = async ({ name, email, password }) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new AppError(409, 'Email is already registered', 'EMAIL_TAKEN');
  }

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
  const user = await User.create({
    name,
    email,
    passwordHash,
  });

  return serializeAuthPayload(user);
};

const login = async ({ email, password }) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new AppError(401, 'Invalid email or password', 'INVALID_CREDENTIALS');
  }

  const validPassword = await bcrypt.compare(password, user.passwordHash);
  if (!validPassword) {
    throw new AppError(401, 'Invalid email or password', 'INVALID_CREDENTIALS');
  }

  return serializeAuthPayload(user);
};

module.exports = {
  register,
  login,
};
