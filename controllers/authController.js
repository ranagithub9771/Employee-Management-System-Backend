const jwt = require('jsonwebtoken');
const User = require('../models/User');

const sign = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });

const sendToken = (res, status, user) =>
  res.status(status).json({
    token: sign(user._id),
    user: { id: user._id, name: user.name, email: user.email },
  });

exports.register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const exists = await User.findOne({ email: String(email || '').toLowerCase() });
    if (exists) return res.status(409).json({ message: 'Email already registered', errors: { email: 'Email already registered' } });
    const user = await User.create({ name, email, password });
    sendToken(res, 201, user);
  } catch (e) {
    next(e);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email and password are required' });
    const user = await User.findOne({ email: String(email).toLowerCase() }).select('+password');
    if (!user || !(await user.matchPassword(String(password)))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    sendToken(res, 200, user);
  } catch (e) {
    next(e);
  }
};

exports.logout = (req, res) => res.json({ message: 'Logged out successfully' });

exports.me = (req, res) => res.json({ user: req.user });
