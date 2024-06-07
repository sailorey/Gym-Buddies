const express = require('express');
const router = express.Router();
const Workout = require('../models/Workout');
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

// Get all workouts
router.get('/', async (req, res) => {
  try {
    const workouts = await Workout.find().populate('user', 'username');
    res.json(workouts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching workouts', error });
  }
});

// Get a single workout by ID
router.get('/:id', async (req, res) => {
  try {
    const workout = await Workout.findById(req.params.id).populate('user', 'username');
    if (!workout) {
      return res.status(404).json({ message: 'Workout not found' });
    }
    res.json(workout);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching workout', error });
  }
});


// Create a new workout
router.post('/', authMiddleware, async (req, res) => {
  const { title, description, exercises } = req.body;
  try {
    const workout = new Workout({ title, description, exercises, user: req.user.id, username: req.user.username });
    await workout.save();
    res.status(201).json(workout);
  } catch (error) {
    res.status(400).json({ message: 'Error creating workout', error });
  }
});

// Edit a workout
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const workout = await Workout.findById(req.params.id);
    if (!workout) return res.status(404).json({ message: 'Workout not found' });

    if (workout.user.toString() !== req.user.id) return res.status(401).json({ message: 'Unauthorized' });

    workout.title = req.body.title || workout.title;
    workout.description = req.body.description || workout.description;
    workout.exercises = req.body.exercises || workout.exercises;
    workout.edited = true;

    await workout.save();
    res.json(workout);
  } catch (error) {
    res.status(400).json({ message: 'Error updating workout', error });
  }
});

// Delete a workout
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const workout = await Workout.findById(req.params.id);
    if (!workout) {
      return res.status(404).json({ message: 'Workout not found' });
    }

    if (workout.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    await Workout.findByIdAndDelete(req.params.id);
    res.json({ message: 'Workout deleted' });
  } catch (error) {
    res.status(400).json({ message: 'Error deleting workout', error });
  }
});

module.exports = router;
