const express = require('express');
const Comment = require('../models/Comment');
const router = express.Router();

// Add a comment to a post
router.post('/', async (req, res) => {
  const { post, author, content } = req.body;

  try {
    const newComment = new Comment({ post, author, content });
    await newComment.save();
    res.status(201).json(newComment);
  } 
  catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get comments for a specific post
router.get('/:postId', async (req, res) => {
  try {
    const comments = await Comment.find({ post: req.params.postId }).populate('author', 'username');
    res.json(comments);
  } 
  catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all comments
router.get('/', async (req, res) => {
  try {
    const comments = await Comment.find().populate('author', 'username');
    res.json(comments);
  } 
  catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a comment by ID
router.delete('/:id', async (req, res) => {
  try {
    const comment = await Comment.findByIdAndDelete(req.params.id);

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    res.json({ message: 'Comment deleted successfully' });
  } 
  catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete all comments
router.delete('/', async (req, res) => {
  try {
    const result = await Comment.deleteMany({});

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'No comments to delete' });
    }

    res.json({ message: 'All comments deleted successfully' });
  } 
  catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
