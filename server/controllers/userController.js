const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

/**
 * Safely compares administrative secrets using constant-time evaluation 
 * to prevent character-guessing timing attacks.
 */
const isValidAdminSecret = (inputSecret) => {
  const envSecret = process.env.ADMIN_REGISTRATION_SECRET;
  if (!envSecret || !inputSecret) return false;
  
  try {
    return crypto.timingSafeEqual(
      Buffer.from(inputSecret),
      Buffer.from(envSecret)
    );
  } catch {
    return false;
  }
};

/**
 * Generates an authentication token. Throws an explicit error 
 * if environment secrets are completely missing.
 */
const generateToken = (id, role) => {
  if (!process.env.JWT_SECRET) {
    throw new Error('Critical Error: JWT_SECRET environment variable is not defined.');
  }
  return jwt.sign(
    { id: String(id), role }, 
    process.env.JWT_SECRET, 
    { expiresIn: '30d' }
  );
};

// 1. REGISTER USER
exports.registerUser = async (req, res) => {
  const { name, email, mobile, password, adminSecret } = req.body;

  try {
    // FIX: Checks BOTH fields to stop database runtime indexing crashes
    const userExists = await User.findOne({ $or: [{ email }, { mobile }] });
    if (userExists) {
      return res.status(400).json({ message: 'Email or mobile number is already registered' });
    }

    let role = 'user';
    if (adminSecret && isValidAdminSecret(adminSecret)) {
      role = 'admin';
    }

    const user = await User.create({ name, email, mobile, password, role });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      mobile: user.mobile,
      token: generateToken(user._id, user.role)
    });
  } catch (error) {
    res.status(500).json({ message: 'Registration failed', error: error.message });
  }
};

// 2. LOGIN USER
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    
    if (user && (await bcrypt.compare(password, user.password))) {
      return res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        mobile: user.mobile,
        token: generateToken(user._id, user.role)
      });
    }

    res.status(401).json({ message: 'Invalid email or password' });
  } catch (error) {
    res.status(500).json({ message: 'Login failed', error: error.message });
  }
};

// 3. GET ALL USERS (Protected Route)
exports.getAllUsers = async (req, res) => {
  try {
    // FIX: Extract token from the HTTP Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    const token = authHeader.split(' ')[1];
    
    // FIX: Verify identity data encoded inside the JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // FIX: Block access if the user's encoded role payload is not 'admin'
    if (decoded.role !== 'admin') {
      return res.status(403).json({ message: 'Access forbidden. Administrative privileges required.' });
    }

    const users = await User.find({}).select('-password');
    res.json(users);
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Access denied. Invalid token authentication.' });
    }
    res.status(500).json({ message: 'Failed to retrieve users', error: error.message });
  }
};
