const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs'); // Not strictly needed for signup if hashing is only in model

// POST /api/auth/signup
router.post('/signup', async (req, res) => {
  const { username, email, password } = req.body;

  // Basic validation for presence of fields
  if (!username || !email || !password) {
    return res.status(400).json({ message: 'Please enter all fields' });
  }

  try {
    // Check if user already exists
    let user = await User.findOne({ $or: [{ email }, { username }] });
    if (user) {
      return res.status(400).json({ message: 'User already exists with this email or username' });
    }

    // Create new user
    user = new User({
      username,
      email,
      password, // Password will be hashed by the pre-save hook in User.js
    });

    // Save user to database
    await user.save();

    // Generate JWT token
    const payload = {
      user: {
        id: user.id,
        username: user.username,
      },
    };

    // It's highly recommended to use an environment variable for the secret key
    const JWT_SECRET = process.env.JWT_SECRET || 'YOUR_SECRET_KEY'; 

    jwt.sign(
      payload,
      JWT_SECRET,
      { expiresIn: '1h' }, // Token expires in 1 hour
      (err, token) => {
        if (err) throw err;
        res.status(201).json({
          token,
          user: {
            id: user.id,
            username: user.username,
            email: user.email,
          },
        });
      }
    );
  } catch (err) {
    console.error(err.message);
    // Check for specific errors if needed, e.g., validation errors from Mongoose
    if (err.name === 'ValidationError') {
        return res.status(400).json({ message: err.message });
    }
    res.status(500).send('Server error');
  }
});

// POST /api/auth/signin
router.post('/signin', async (req, res) => {
  const { email, password } = req.body;

  // Basic validation for presence of fields
  if (!email || !password) {
    return res.status(400).json({ message: 'Please enter both email and password' });
  }

  try {
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' }); // Or 401
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' }); // Or 401
    }

    // Generate JWT token
    const payload = {
      user: {
        id: user.id,
        username: user.username,
      },
    };

    // It's highly recommended to use an environment variable for the secret key
    const JWT_SECRET = process.env.JWT_SECRET || 'YOUR_SECRET_KEY';

    jwt.sign(
      payload,
      JWT_SECRET,
      { expiresIn: '1h' }, // Token expires in 1 hour
      (err, token) => {
        if (err) throw err;
        res.status(200).json({
          token,
          user: {
            id: user.id,
            username: user.username,
            email: user.email,
          },
        });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
