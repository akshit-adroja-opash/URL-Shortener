const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user.js');  // Fixed relative path from controller dir

const JWT_SECRET = process.env.JWT_SECRET || 'URL-shortener-secret';
const TOKEN_EXPIRY = '7d';

const createToken = (user) => {
  return jwt.sign(
    { id: user._id.toString(), name: user.name, email: user.email },
    JWT_SECRET,
    { expiresIn: TOKEN_EXPIRY }
  );
};

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required.' });
    }

    const trimmedEmail = email.trim().toLowerCase();
    const existingUser = await User.findOne({ email: trimmedEmail });
    if (existingUser) {
      return res.status(409).json({ error: 'Email is already registered.' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = new User({ name: name.trim(), email: trimmedEmail, passwordHash });
    await user.save();

    const token = createToken(user);
    return res.json({ user: { name: user.name, email: user.email }, token });
  } catch (error) {
    return res.status(500).json({ error: 'Server error during registration.' });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const trimmedEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: trimmedEmail });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const validPassword = await bcrypt.compare(password, user.passwordHash);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const token = createToken(user);
    return res.json({ user: { name: user.name, email: user.email }, token });
  } catch (error) {
    return res.status(500).json({ error: 'Server error during login.' });
  }
};

module.exports = { register, login };
