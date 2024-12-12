const express = require('express');
const router = express.Router();
const cloudinary = require('../config/config');
const multer = require('multer');
const User = require("../models/User");
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

// In user.routes.js or a separate posts.routes.js

// Fetch posts by username
router.get('/posts/users/:username', async (req, res) => {
  const { username } = req.params;
  
  try {
    const posts = await Post.find({ 'user.username': username })  // Assuming you have a `username` field in the `User` collection
      .populate('user', 'username profilePic');  // Populate user data, adjust this as needed

    if (!posts) {
      return res.status(404).json({ message: 'No posts found for this user.' });
    }

    res.status(200).json({ posts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch posts' });
  }
});


// GET posts by a specific user (authentication can be added if necessary)
router.get('/users/:userId', async (req, res) => { // Added requireAuth here
  try {
    const posts = await Post.find({ user: req.params.userId }); // Filter posts by userId
    res.json({ posts });
  } catch (err) {
    res.status(500).json({ message: "Error fetching posts" });
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
