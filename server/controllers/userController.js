const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const generateToken = (id, role) => {
  if (!process.env.JWT_SECRET) {
    console.warn('WARNING: JWT_SECRET is not set. Using insecure default fallback.');
  }
  return jwt.sign({ id, role }, process.env.JWT_SECRET || 'secret123', { expiresIn: '30d' });
};

exports.registerUser = async (req, res) => {
  const { name, email, mobile, password, adminSecret } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    // SECURE ADMIN RULE: Only grants admin if a matching secret key is provided in the request body
    let role = 'user';
    if (adminSecret && adminSecret === process.env.ADMIN_REGISTRATION_SECRET) {
      role = 'admin';
    }

    const user = await User.create({ name, email, mobile, password, role });
    res.status(201).json({
      _id: user._id, name: user.name, email: user.email, role: user.role, mobile: user.mobile,
      token: generateToken(user._id, user.role)
    });
  } catch (error) { res.status(500).json({ message: error.message }); }
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        _id: user._id, name: user.name, email: user.email, role: user.role, mobile: user.mobile,
        token: generateToken(user._id, user.role)
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) { res.status(500).json({ message: error.message }); }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    res.json(users);
  } catch (error) { res.status(500).json({ message: error.message }); }
};