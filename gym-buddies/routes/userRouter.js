const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Register a new user
router.post('/register', async (req, res) => {
  console.log('Received register request:', req.body); // Log the request body
  const { username, password } = req.body;
  if (!username || !password) {
    console.log('Missing username or password');
    return res.status(400).json({ message: 'Username and password are required' });
  }

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      console.log('Username already taken');
      return res.status(400).json({ message: 'Username already taken' });
    }

    const user = new User({ username, password });
    await user.save();

    const token = jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    console.log('User registered successfully:', user);
    console.log('Generated token:', token);
    res.status(201).json({ token });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(400).json({ message: 'Error registering user', error: error.message });
  }
});

// Log in an existing user
router.post('/login', async (req, res) => {
  console.log('Login request received:', req.body);

  const { username, password } = req.body;
  if (!username || !password) {
    console.log('Missing username or password');
    return res.status(400).json({ message: 'Username and password are required' });
  }

  try {
    const user = await User.findOne({ username });

    if (user && (await user.matchPassword(password))) {
      const token = jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET, {
        expiresIn: '1h',
      });

      console.log('User logged in successfully:', user);
      console.log('Generated token:', token);
      res.json({ token });
    } else {
      console.log('Invalid username or password');
      res.status(401).json({ message: 'Invalid username or password' });
    }
  } catch (error) {
    console.error('Error logging in user:', error);
    res.status(400).json({ message: 'Error logging in user', error: error.message });
  }
});

module.exports = router;
