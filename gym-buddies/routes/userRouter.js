const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Authentication middleware
const authMiddleware = async (req, res, next) => {
  const token = req.header('Authorization').replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

// Register a new user
router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  console.log('Received registration request:', req.body); // Log the request body

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  try {
    // Check if the username is already taken
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already taken' });
    }

    // Create and save the new user
    const user = new User({ username, password });
    await user.save();
    console.log('User registered:', user); // Log the registered user
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error registering user:', error); // Log the error
    res.status(400).json({ message: 'Error registering user', error });
  }
});

// Log in an existing user
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  console.log('Received login request:', req.body); // Log the request body

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  try {
    const user = await User.findOne({ username });
    console.log('Found user:', user); // Log the found user

    if (user && (await user.matchPassword(password))) {
      const token = jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET, {
        expiresIn: '1h',
      });
      console.log('Login successful, token:', token); // Log the generated token
      res.json({ token });
    } else {
      console.log('Invalid username or password'); // Log the invalid login attempt
      res.status(401).json({ message: 'Invalid username or password' });
    }
  } catch (error) {
    console.error('Error logging in user:', error); // Log the error
    res.status(400).json({ message: 'Error logging in user', error });
  }
});

// Get user profile
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json(user);
  } catch (error) {
    res.status(400).json({ message: 'Error fetching user profile', error });
  }
});

// Update user profile
router.put('/profile', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    user.bio = req.body.bio || user.bio;
    if (req.body.weight) user.measurements.push({ weight: req.body.weight, height: req.body.height });
    await user.save();
    res.json(user);
  } catch (error) {
    res.status(400).json({ message: 'Error updating user profile', error });
  }
});

// Delete a user
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user._id.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted' });
  } catch (error) {
    res.status(400).json({ message: 'Error deleting user', error });
  }
});

module.exports = router;
