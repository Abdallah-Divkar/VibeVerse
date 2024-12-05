const express = require('express');
const router = express.Router();
const cloudinary = require('../config/config'); 
const Post = require("../models/Post");
const upload = require("../middleware/upload");
const { createPost, deletePost, getPost, getAllPosts } = require('../controllers/post.controller');
const { requireAuth } = require('@clerk/express');

// Create a post with a required photo
router.post('/create', requireAuth, upload.single('photo'), async (req, res) => {
  try {
    const { content } = req.body;

    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Photo is required' });
    }

    const result = await cloudinary.uploader.upload(req.file.path, { folder: 'vibeverse_posts' });

    const newPost = new Post({
      content,
      photo: result.secure_url,
      user: req.auth.userId,
    });

    await newPost.save();
    res.status(201).json({ success: true, post: newPost });
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ success: false, message: 'Error creating post', error });
  }
});

router.get('/', getAllPosts);

router.get('/user/:userId', requireAuth, async (req, res) => {
  try {
    const userId = req.params.userId;
    const posts = await Post.find({ user: userId }).populate('user', 'username');

    if (!posts || posts.length === 0) {
      return res.status(404).json({ success: false, message: 'No posts found for this user' });
    }

    res.status(200).json({ success: true, posts });
  } catch (error) {
    console.error('Error fetching posts by user:', error);
    res.status(500).json({ success: false, message: 'Error fetching posts by user' });
  }
});

router.get('/:postId', requireAuth, getPost);
router.put('/:id', requireAuth, async (req, res) => {
  try {
    const { title, content } = req.body;
    const updatedPost = await Post.findByIdAndUpdate(req.params.id, { title, content }, { new: true });
    res.status(200).json(updatedPost);
  } catch (err) {
    res.status(500).json({ error: "Failed to update post" });
  }
});
router.delete('/:postId', requireAuth, deletePost);

module.exports = router;
