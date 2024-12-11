const express = require('express');
const router = express.Router();
const cloudinary = require('../config/config');
const multer = require('multer');
const Post = require('../models/Post');
const postCtrl = require("../controllers/post.controller");
const upload = require("../middleware/upload");
const { requireAuth } = require("../middleware/requireAuth");

// POST route to create a post with an image
router.post('/create', requireAuth, upload, async (req, res) => {
  try {
    const { content } = req.body;

    // Ensure that a photo is provided
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Photo is required' });
    }

    // Upload image to Cloudinary and get secure URL
    const result = await cloudinary.uploader.upload(req.file.path, { folder: 'vibeverse_posts' });

    // Create a new post instance
    const newPost = new Post({
      content,
      photo: result.secure_url,
      user: req.auth.userId, // Authenticated user's ID
    });

    // Save the post and send success response
    await newPost.save();
    res.status(201).json({ success: true, post: newPost });
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ success: false, message: 'Error creating post', error });
  }
});

router.delete('/delete/:postId', requireAuth, postCtrl.deletePost);

// GET all posts
router.get('/', postCtrl.getAllPosts);

// GET posts by a specific user (authentication can be added if necessary)
router.get('/user/:userId', requireAuth, async (req, res) => { // Added requireAuth here
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

// GET a specific post by its ID
router.get('/:postId', requireAuth, postCtrl.getPost); // Added requireAuth here

// PUT route to update a post (content or title)
router.put('/:id', requireAuth, async (req, res) => { // Added requireAuth here
  try {
    const { title, content } = req.body;
    const updatedPost = await Post.findByIdAndUpdate(req.params.id, { title, content }, { new: true });
    res.status(200).json(updatedPost);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update post' });
  }
});

// DELETE a post by its ID
router.delete('/:postId', requireAuth, postCtrl.deletePost); // Added requireAuth here

module.exports = router;
