const express = require('express');
const router = express.Router();
const Measurement = require('../models/Measurement');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

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

// Create a new measurement
router.post('/', authMiddleware, async (req, res) => {
  const { weight, height } = req.body;
  try {
    const measurement = new Measurement({ weight, height, user: req.user.id });
    await measurement.save();
    res.status(201).json(measurement);
  } catch (error) {
    res.status(400).json({ message: 'Error creating measurement', error });
  }
});

// Get measurements for a user
router.get('/user/:userId', authMiddleware, async (req, res) => {
  try {
    const measurements = await Measurement.find({ user: req.params.userId });
    res.json(measurements);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching measurements', error });
  }
});

// Edit a measurement
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const measurement = await Measurement.findById(req.params.id);
    if (!measurement) {
      return res.status(404).json({ message: 'Measurement not found' });
    }

    if (measurement.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    measurement.weight = req.body.weight || measurement.weight;
    measurement.height = req.body.height || measurement.height;
    await measurement.save();
    res.json(measurement);
  } catch (error) {
    res.status(400).json({ message: 'Error updating measurement', error });
  }
});

// Delete a measurement
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const measurement = await Measurement.findById(req.params.id);
    if (!measurement) {
      return res.status(404).json({ message: 'Measurement not found' });
    }

    if (measurement.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    await Measurement.findByIdAndDelete(req.params.id);
    res.json({ message: 'Measurement deleted' });
  } catch (error) {
    res.status(400).json({ message: 'Error deleting measurement', error });
  }
});

module.exports = router;
