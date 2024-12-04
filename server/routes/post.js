const express = require('express');
const router = express.Router();
const Post = require("../models/Post");
const upload = require("../middleware/upload");
const { requireSignin, canDeletePost } = require('../controllers/auth.controller');
const { createPost, deletePost, getPost, getAllPosts } = require('../controllers/post.controller');

// Create a post with a required photo
router.post('/posts', upload.single('photo'), async (req, res) => {
  try {
    const { content } = req.body;

    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Photo is required to create a post' });
    }

    const photo = req.file.path; // File path of the uploaded image

    const newPost = new Post({
      content,
      photo, // Save the photo URL
    });

    await newPost.save();
    res.status(201).json({ success: true, post: newPost });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error creating post', error: err.message });
  }
});

// Route to get all posts
router.get('/', getAllPosts);

// Route to get a specific post by ID
router.get('/:postId', getPost);

// Route to delete a post by ID
router.delete('/:postId', requireSignin, canDeletePost, deletePost);

module.exports = router;
