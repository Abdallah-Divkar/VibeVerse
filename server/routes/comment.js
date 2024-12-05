const express = require('express');
const router = express.Router();
const {
  createComment,
  getAllComments,
  getCommentById,
  getCommentsByUser,
  getCommentsByPost,
  deleteComment
} = require('../controllers/comment.controller');
const { requireAuth } = require('@clerk/express');

// Create a comment
router.post('/', requireAuth, createComment);

// Get all comments
router.get('/', getAllComments);

// Get comment by ID
router.get('/:id', getCommentById);

// Get comments by user
router.get('/user/:userId', requireAuth, getCommentsByUser);

// Get comments by post
router.get('/post/:postId', getCommentsByPost);

// Delete a comment
router.delete('/:id', requireAuth, deleteComment);

module.exports = router;
