const express = require('express');
const router = express.Router();
const Comment = require('../models/Comment');
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

// Get comments for a workout
router.get('/workout/:workoutId', async (req, res) => {
  try {
    const comments = await Comment.find({ workout: req.params.workoutId }).populate('user', 'username');
    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching comments', error });
  }
});

// Add a comment to a workout
router.post('/', authMiddleware, async (req, res) => {
  const { workout, content } = req.body;
  try {
    const comment = new Comment({ workout, content, user: req.user._id });
    const saveComment = await comment.save();
    const populatedComment = await saveComment.populate('user', 'username');
    res.status(201).json(populatedComment);
  } catch (error) {
    console.log(error)
    res.status(400).json({ message: 'Error creating comment', error });
  }
});

// Edit a comment
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ message: 'Comment not found' });

    if (comment.user.toString() !== req.user.id) return res.status(401).json({ message: 'Unauthorized' });

    comment.content = req.body.content || comment.content;
    comment.edited = true;

    await comment.save();
    res.json(comment);
  } catch (error) {
    res.status(400).json({ message: 'Error updating comment', error });
  }
});

// Delete a comment
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    if (comment.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    await Comment.findByIdAndDelete(req.params.id);
    res.json({ message: 'Comment deleted' });
  } catch (error) {
    res.status(400).json({ message: 'Error deleting comment', error });
  }
});


module.exports = router;
